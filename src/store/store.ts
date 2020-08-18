import Vuex from 'vuex';

import $ from 'jquery';
import {cleanUpHtml, importHtml, importNode} from "@/store/helpers";
import {editorActions} from "@/store/actions";
import {getField, updateField} from 'vuex-map-fields';
import {mode} from "@/store/utils/mode";
import {parseTypeScriptFile} from "@/store/typescript/utils";
import {EditorState} from "@/store/types";

export const fileTypes = {
    JAVASCRIPT: 'JAVASCRIPT',
    TYPESCRIPT: 'TYPESCRIPT',
    HTML: 'HTML',
};

export const extensionToType: Record<string, string> = {
    js: fileTypes.JAVASCRIPT,
    ts: fileTypes.TYPESCRIPT,
    html: fileTypes.HTML,
};

const tree = parseTypeScriptFile(`
import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {PermissionRequirements, Requirement} from 'google3/java/com/google/firebase/console/web/components/permissions/permissions';
import {HostingSiteConfig} from 'google3/java/com/google/firebase/console/web/modules/hosting/ng2/history/common/types';
import {CloudLoggingUnlinkDialog} from 'google3/java/com/google/firebase/console/web/modules/settings/integrations/ng2/extensions/cloud_logging/dialogs/cloud_logging_unlink_dialog/cloud_logging_unlink_dialog';
import {CloudLoggingIntegration} from 'google3/java/com/google/firebase/console/web/modules/settings/integrations/ng2/services/cloud_logging_integration';
import {Permission} from 'google3/java/com/google/firebase/console/web/services/permissions/permissions';
import {ReplaySubject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';

/** Settings page for Cloud Logging  */
@Component({
  selector: 'fire-cloud-logging-settings-page',
  templateUrl: './cloud_logging_settings_page.ng.html',
  styleUrls: ['./cloud_logging_settings_page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CloudLoggingSettingsPage implements OnDestroy {
  readonly linkPermissions: Readonly<PermissionRequirements> = {
    permissions: [
      Permission.FIREBASE_LINKS_UPDATE,
    ],
    require: Requirement.ALL,
  };

  private readonly destroy$ = new ReplaySubject<void>(1);

  readonly hostingEnabledControl = new FormControl(true);
  readonly logsGeneratedPerDay$ =
      this.cloudLoggingService.getHostingLogsGeneratedPerDay();

  readonly getHostingLogsGeneratedPerDayLoading$ =
      this.cloudLoggingService.getHostingLogsGeneratedPerDayLoading();

  readonly hostingSites$ = this.cloudLoggingService.hostingSites();
  readonly storageEstimateBySite$ =
      this.cloudLoggingService.getStorageEstimateBySite();

  readonly viewInCloudLoggingUrl$ =
      this.cloudLoggingService.getViewInCloudLoggingUrl();

  constructor(
      private readonly cloudLoggingService: CloudLoggingIntegration,
      private readonly dialog: MatDialog,
  ) {
    this.cloudLoggingService.loadLogsGenerated();
  }

  openStopDataExportDialog(event: MatSlideToggleChange) {
    this.dialog.open(CloudLoggingUnlinkDialog)
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((shouldDisableHosting: boolean) => {
          if (shouldDisableHosting) {
            this.cloudLoggingService.disableCloudLogging();
          } else {
            this.hostingEnabledControl.setValue(true);
          }
        });
  }

  openUnlinkDialog() {
    this.dialog.open(CloudLoggingUnlinkDialog)
        .afterClosed()
        .pipe(
            takeUntil(this.destroy$),
            filter(a => !!a),
            )
        .subscribe(() => {
          this.cloudLoggingService.disableCloudLogging();
        });
  }

  onSave(configs: HostingSiteConfig[]) {
    this.cloudLoggingService.updateCloudLoggingConfigs(configs);
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}

  `
);

function getInitialState(): EditorState {
    return {
        mode: mode.NORMAL,
        inputFocused: false,
        modeArg: {},
        filter: '',

        selectedFileName: 'index.ts',
        files: {
            'index.ts': {
                type: 'ts',
                tree,
                selectedNode: tree,
            },
            'index.html': {
                type: 'html',
                code: '<root id = root>',
                selectedNodeKey: 'root',
            },
            'banan.html': {
                type: 'html',
                code: importHtml(`<root id = root><div></div></root>`),
                selectedNodeKey: 'root',
            },
        }
    };
}

export function getStore() {
    return new Vuex.Store({
        state: getInitialState(),
        mutations: {
            async executeAction(state, action) {
                editorActions.execute(action, state);
            },
            updateFilter(state, filter) {
                state.filter = filter;
            },
            selectFileName(state, selectedFileName) {
                state.selectedFileName = selectedFileName;
            },
            updateField,
        },
        getters: {
            getField,
            filter(state) {
                console.log(state.filter);
                return state.filter;
            },
            selectedFile(state) {
                return state.files[state.selectedFileName];
            },
            tree(state, {selectedFile, selectedFileType}) {
                if (selectedFileType === fileTypes.HTML) {
                    return importNode($(selectedFile.code)[0], selectedFile.selectedNodeKey);
                }

                if (selectedFileType === fileTypes.TYPESCRIPT) {
                    return selectedFile.tree;
                }
            },
            selectedNode(state, {selectedFile}) {
                return selectedFile.selectedNode;
            },
            html(state, {selectedFile, selectedFileType}) {
                if (selectedFileType === fileTypes.HTML) {
                    return cleanUpHtml(selectedFile.code);
                }
                return '';
            },
            selectedFileType(state) {
                return extensionToType[state.selectedFileName.match(/\.(\w+)$/)![1]];
            },
            files(state) {
                return Object.entries(state.files).map(([name, file]) => {
                    return {name, ...file, selected: state.selectedFileName === name}
                })
            },
            state(state) {
                return state;
            },
            inputFocused(state) {
                return state.inputFocused;
            }
        }
    });
}
