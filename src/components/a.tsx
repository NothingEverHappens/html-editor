import React from 'react';
import { useFieldArray } from 'react-hook-form';
import { FormContextValues } from 'react-hook-form/dist/contextTypes';

import { Field } from '../../../common/Field';
import { AddAuthUserPayload } from '../../types';
import { IconButton } from '@rmwc/icon-button';

export const CustomAttributes: React.FC<FormContextValues<AddAuthUserPayload>> = ({ control, register, watch }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'customAttributes',
    });

    // const attributeValues = watch('customAttributes', fields as any)!;

    return (
        <div>
            {fields.map((item, index) => (
                <div key={item.id} style={{ display: 'flex' }}>
                    <Field
                        name={`customAttributes[${index}].role`}
                        inputRef={register()}
                        defaultValue={item.role}
                    />
                    {2+2}
                    <Field
                        name={`customAttributes[${index}].value`}
                        inputRef={register()}
                        defaultValue={item.role}
                    />
                    <IconButton
                        label="Add field"
                        type="button"
                        icon="close"
                        onClick={() => {
                            remove(index);
                        }}
                    />
                </div>
            ))}
            <IconButton
                label="Add field"
                type="button"
                icon="add"
                onClick={() => {
                    append({});
                }}
            />
        </div>
    );
};
