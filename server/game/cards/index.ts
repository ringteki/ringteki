import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';

function allJsFiles(path: string): string[] {
    const files = [];

    for (const file of readdirSync(path)) {
        if (file.startsWith('_')) {
            continue;
        }

        const filepath = join(path, file);
        if (lstatSync(filepath).isDirectory()) {
            files.push(...allJsFiles(filepath));
        } else if (file.endsWith('.js') && !path.endsWith('/cards')) {
            files.push(filepath);
        }
    }
    return files;
}

export const cards = new Map(
    allJsFiles(__dirname).reduce<[string, unknown][]>((all, filepath) => {
        const fileImported = require(filepath);
        const card = 'default' in fileImported ? fileImported.default : fileImported;
        if (card.id) {
            all.push([card.id, card]);
        }
        return all;
    }, [])
);
