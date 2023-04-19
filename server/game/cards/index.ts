import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';

function allJsFiles(path: string): string[] {
    const files = [];

    for(const file of readdirSync(path)) {
        const filepath = join(path, file);
        if(lstatSync(filepath).isDirectory()) {
            files.push(...allJsFiles(filepath));
        } else if(file.endsWith('.js') && !path.endsWith('/cards')) {
            files.push(filepath);
        }
    }
    return files;
}

export const cards = new Map(
    allJsFiles(__dirname).map((filepath) => {
        const fileImported = require(filepath);
        const card = 'default' in fileImported ? fileImported.default : fileImported;
        return [card.id, card];
    })
);
