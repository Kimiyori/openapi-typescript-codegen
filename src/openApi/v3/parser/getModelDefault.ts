import type { Model } from '../../../client/interfaces/Model';
import { models } from '..';
import type { OpenApiSchema } from '../interfaces/OpenApiSchema';

export const getModelDefault = (definition: OpenApiSchema, model?: Model): string | undefined => {
    if (definition.default === undefined) {
        return undefined;
    }

    if (definition.default === null) {
        return 'null';
    }

    const type = definition.type || typeof definition.default;

    switch (type) {
        case 'int':
        case 'integer':
        case 'number':
            if (model?.export === 'enum' && model.enum?.[definition.default]) {
                return model.enum[definition.default].value;
            }
            return definition.default;

        case 'boolean':
            return JSON.stringify(definition.default);

        case 'string':
            const modelName = definition.$ref?.split('/').pop();
            const foundModel = models.find(m => m.name === modelName);
            if (foundModel) {
                const foundDefault = foundModel.enum.find(en => en.value === `'${definition.default}'`);
                if (foundDefault) {
                    return `${modelName}.${foundDefault.name.replace(/^'(.*)'$/, '$1')}`;
                }
            }
            return `'${definition.default}'`;

        case 'object':
            try {
                return JSON.stringify(definition.default, null, 4);
            } catch (e) {
                // Ignore
            }
    }

    return undefined;
};
