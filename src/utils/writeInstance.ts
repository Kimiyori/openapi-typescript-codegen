import { resolve } from 'path';

import type { Indent } from '../Indent';
import { writeFile } from './fileSystem';
import { formatCode as f } from './formatCode';
import { formatIndentation as i } from './formatIndentation';
import type { Templates } from './registerHandlebarTemplates';

/**
 * Generate the OpenAPI instance client index file using the Handlebar template and write it to disk.
 * The index file just contains all the exports you need to use the client as a standalone
 * library. But yuo can also import individual models and services directly.
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param clientName Custom client class name
 * @param indent Indentation options (4, 2 or tab)
 */
export const writeInstance = async (
    templates: Templates,
    outputPath: string,
    clientName: string,
    indent: Indent
): Promise<void> => {
    const templateResult = templates.instance({ clientName });

    await writeFile(resolve(outputPath, `instance.ts`), i(f(templateResult), indent));
};
