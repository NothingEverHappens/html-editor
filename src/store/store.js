import Vuex from 'vuex';

import $ from 'jquery';
import {cleanUpHtml, importNode} from "@/store/helpers";
import {editorActions} from "@/store/actions";
import {getField, updateField} from 'vuex-map-fields';
import {mode} from "@/store/utils/mode";
import {parseTypeScriptFile} from "@/store/typescript/utils";

export const fileTypes = {
    JAVASCRIPT: 'JAVASCRIPT',
    TYPESCRIPT: 'TYPESCRIPT',
    HTML: 'HTML',
};

export const extensionToType = {
    js: fileTypes.JAVASCRIPT,
    ts: fileTypes.TYPESCRIPT,
    html: fileTypes.HTML,
};

const tree = parseTypeScriptFile(`import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Store} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import Empty from 'goog:proto.google.protobuf.Empty'; // from //google/protobuf:empty_jspb_proto
import {Channel, Release, SiteConfig, SitesApiClientImpl, SitesChannelsApiClientImpl, SitesChannelsReleasesApiClientImpl, SitesReleasesApiClientImpl, SitesVersionsApiClientImpl} from 'google3/google/firebase/hosting/firebasehosting_api_ng2';
import {HostingSite, HostingSiteTypeEnum, ListHostingSitesResponse, ProjectsHostingApiClientImpl, ProjectsSitesApiClientImpl} from 'google3/google/internal/mobilesdk/mobilesdk_api_client_ng2';
import {getCurrentProjectNumber} from 'google3/java/com/google/firebase/console/web/core/ngrx/project/selectors';
import {createSiteConfig} from 'google3/java/com/google/firebase/console/web/modules/hosting/ng2/history/common/converters';
import {FirebaseRequestServiceFactory} from 'google3/java/com/google/firebase/console/web/shared/api_helpers/ng2/api_client_helpers';
import {mockFirebaseRequestServiceFactoryByMap} from 'google3/java/com/google/firebase/console/web/shared/api_helpers/ng2/test_helper';
import {Mockery} from 'google3/java/com/google/firebase/console/web/testing/mockery';
import {DeepPartial} from 'google3/java/com/google/firebase/console/web/testing/type_utils';
import {asyncMatchers, describe, expect, get, it, setupModule} from 'google3/javascript/angular2/testing/catalyst';
import {createSpyFromClass} from 'google3/javascript/typescript/contrib/jasmine/spy_class';
import {of} from 'rxjs';

import {HostingSitesService} from './sites_service';


describe('hostingSitesService', () => {
  const MAX_VERSIONS = '100';
  const NEW_MAX_VERSIONS = '200';
  const PROJECT_NUMBER = 'PITSOT';
  const SITE = 'Pkchu';
  const SITES = {
    site: [{
      site: 'foo',
      appId: 'my-app-id',
      type: HostingSiteTypeEnum.DEFAULT_HOSTING_SITE,
    }]
  };

  function setup() {
    jasmine.addMatchers(asyncMatchers);
    const mockery = new Mockery();

    const sitesApi = createSpyFromClass(SitesApiClientImpl);
    const projectsHostingApi = createSpyFromClass(ProjectsHostingApiClientImpl);
    const projectsSitesApi = createSpyFromClass(ProjectsSitesApiClientImpl);
    const channelsSitesApi = createSpyFromClass(SitesChannelsApiClientImpl);
    const sitesVersionsApi = createSpyFromClass(SitesVersionsApiClientImpl);
    const sitesReleasesApi = createSpyFromClass(SitesReleasesApiClientImpl);
    const sitesChannelsReleasesApi =
        createSpyFromClass(SitesChannelsReleasesApiClientImpl);

    const mockFactory = mockFirebaseRequestServiceFactoryByMap(new Map<{}, {}>([
      [SitesApiClientImpl, sitesApi],
      [ProjectsHostingApiClientImpl, projectsHostingApi],
      [ProjectsSitesApiClientImpl, projectsSitesApi],
      [SitesChannelsApiClientImpl, channelsSitesApi],
      [SitesVersionsApiClientImpl, sitesVersionsApi],
      [SitesChannelsReleasesApiClientImpl, sitesChannelsReleasesApi],
      [SitesReleasesApiClientImpl, sitesReleasesApi],
    ]));

    setupModule({
      imports: [HttpClientTestingModule],
      superProviders: [
        provideMockStore({}),
        mockery.ng2Providers(),
        {
          provide: FirebaseRequestServiceFactory,
          useValue: mockFactory,
        },
      ]
    });

    const store = get(Store) as MockStore<{}>;
    store.overrideSelector(getCurrentProjectNumber, PROJECT_NUMBER);

    return {
      hostingSiteService: get(HostingSitesService),
      sitesApi,
      projectsHostingApi,
      projectsSitesApi,
      channelsSitesApi,
      sitesVersionsApi,
      sitesReleasesApi,
      sitesChannelsReleasesApi,
    };
  }

  it('fetches release storage settings', () => {
    const {hostingSiteService, sitesApi} = setup();
    sitesApi.getConfig.and.returnValue(
        of(new SiteConfig({maxVersions: MAX_VERSIONS})));

    expect(hostingSiteService.getReleaseStorageSettings('pekachu'))
        .toEmit(MAX_VERSIONS);
    expect(sitesApi.getConfig).toHaveBeenCalledWith('sites/pekachu/config');
  });

  it('gets site config', () => {
    const {hostingSiteService, sitesApi} = setup();
    const config = new SiteConfig({maxVersions: MAX_VERSIONS});
    sitesApi.getConfig.and.returnValue(of(config));

    expect(hostingSiteService.getSiteConfig('pekachu')).toEmit(config);
    expect(sitesApi.getConfig).toHaveBeenCalledWith('sites/pekachu/config');
  });

  it('lists channels', () => {
    const {hostingSiteService, channelsSitesApi} = setup();

    const result = [
      new Channel({}),
      new Channel({name: 'Franz Liszt'}),
    ];

    channelsSitesApi.list.and.returnValue(of(result));

    expect(hostingSiteService.listChannels('pekachu')).toEmit(result);
    expect(channelsSitesApi.list).toHaveBeenCalledWith('sites/pekachu', {
      pageSize: 50
    });
  });

  it('lists channels releases', () => {
    const {hostingSiteService, sitesChannelsReleasesApi} = setup();

    const releases = [
      new Release({}),
      new Release({name: 'Franz Liszt'}),
    ];

    sitesChannelsReleasesApi.list.and.returnValue(of({releases}));

    expect(hostingSiteService.listChannelsReleases('pekachu', 'lol'))
        .toEmit(releases);
    expect(sitesChannelsReleasesApi.list)
        .toHaveBeenCalledWith('sites/pekachu/channels/lol');
  });

  it('update channel', () => {
    const {hostingSiteService, channelsSitesApi} = setup();
    const path = 'channel/patch';
    const url = 'http://lol';
    const retainedReleaseCount = 10;

    const result = new Channel({
      name: path,
      url,
      retainedReleaseCount,
    });

    channelsSitesApi.patch.and.returnValue(of(result));

    expect(hostingSiteService.updateChannel(new Channel({
      name: path,
      url,
      retainedReleaseCount,
    }))).toEmit(result);

    expect(channelsSitesApi.patch)
        .toHaveBeenCalledWith(
            path,
            result,
            {updateMask: 'expireTime,retainedReleaseCount'},
        );
  });

  it('deletes channel', () => {
    const {hostingSiteService, channelsSitesApi} = setup();
    const channelName = 'lol';

    channelsSitesApi.delete.and.returnValue(of(Empty));

    expect(hostingSiteService.deleteChannel(channelName)).toEmit(Empty);

    expect(channelsSitesApi.delete)
        .toHaveBeenCalledWith(
            channelName,
        );
  });

  it('deletes release', () => {
    const {hostingSiteService, sitesVersionsApi} = setup();
    const name = 'lol';

    sitesVersionsApi.delete.and.returnValue(of(Empty));

    expect(hostingSiteService.deleteRelease(name)).toEmit(Empty);

    expect(sitesVersionsApi.delete).toHaveBeenCalledWith(name);
  });

  it('rollbacks release', () => {
    const {hostingSiteService, sitesReleasesApi} = setup();
    const parent = 'sites/pirojok';
    const versionName = 'sites/pirojok/version/kojorip';

    sitesReleasesApi.create.and.returnValue(of(Empty));

    expect(hostingSiteService.rollbackRelease(parent, versionName))
        .toEmit(Empty);

    expect(sitesReleasesApi.create)
        .toHaveBeenCalledWith(parent, new Release(), {versionName});
  });

  it('updates the settings', () => {
    const {hostingSiteService, sitesApi} = setup();
    sitesApi.updateConfig.and.returnValue(
        of(new SiteConfig({maxVersions: NEW_MAX_VERSIONS})));

    expect(hostingSiteService.setRevisionHistoryConfig(
               'pekachu', NEW_MAX_VERSIONS))
        .toEmit(NEW_MAX_VERSIONS);
    expect(sitesApi.updateConfig)
        .toHaveBeenCalledWith(
            'sites/pekachu/config',
            new SiteConfig({maxVersions: NEW_MAX_VERSIONS}),
            {updateMask: 'maxVersions'});
  });

  it('updates cloud logging config', () => {
    const {hostingSiteService, sitesApi} = setup();
    const result = new SiteConfig({cloudLoggingEnabled: true});
    sitesApi.updateConfig.and.returnValue(of(result));

    expect(hostingSiteService.updateCloudLoggingConfig(createSiteConfig({
      siteName: 'pekachu',
      isCloudLoggingEnabled: true,
    }))).toEmit(result);
    expect(sitesApi.updateConfig)
        .toHaveBeenCalledWith(
            'sites/pekachu/config', new SiteConfig({cloudLoggingEnabled: true}),
            {updateMask: 'cloudLoggingEnabled'});
  });

  it('Lists the site', () => {
    const {hostingSiteService, projectsHostingApi} = setup();
    projectsHostingApi.list.and.returnValue(
        of<DeepPartial<ListHostingSitesResponse>>(SITES));

    expect(hostingSiteService.list()).toEmitSequence([SITES]);
  });

  describe('linkSiteToWebApp', () => {
    it('Calls web app request and returns the result', () => {
      const {hostingSiteService, projectsSitesApi} = setup();
      const hostingSite = new HostingSite();
      projectsSitesApi.webApp.and.returnValue(of(hostingSite));

      expect(hostingSiteService.linkSiteToWebApp(SITE, 'b')).toEmitSequence([
        hostingSite
      ]);
      expect(projectsSitesApi.webApp).toHaveBeenCalled();
    });
  });
});
         `
);

function getInitialState() {
    return {
        mode: mode.NORMAL,
        inputFocused: false,
        modeArg: {},
        filter: '',

        selectedFileName: 'index.ts',
        files: {
            'index.ts': {
                tree,
                selectedNode: tree,
                code: `const add = (a, b) => {
                return a + b;
                }
                console.log(add(4, 5));
                `

            },
            'index.html': {
                code: '<root id = root>',
                selectedNodeKey: 'root',
            },
            'banan.html': {
                type: 'html',
                code: '<root id = root>',
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
            selectNode(state, node) {
                state.files[state.selectedFileName].selectedNode = node;
            },
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
                return extensionToType[state.selectedFileName.match(/\.(\w+)$/)[1]];
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
