import fs from 'node:fs';
import path from 'node:path';

/*
 * Guards against the failure class fixed in this file's sibling helpers: a spec that
 * reads a *filler* card (the padding setupTest adds to every deck) out of a shared
 * zone without placing it. Such a spec silently depends on which card the filler
 * happens to be, and because prompt buttons are deduped by card id, it also breaks
 * whenever the shuffle puts a second copy of that id in scope.
 *
 * The province filler is exempt: setupTest always seats it in every province, so
 * referring to it without placing it is an intentional, widely-used convention.
 */
const GUARDED = ['dynasty', 'conflict'];
const LOOKUP = /(?:findCardByName|findAllCardsByName|filterCardsByName)\(\s*'[^']*'/g;

function specFiles(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if(entry.isDirectory()) {
            return specFiles(full);
        }
        return /\.spec\.(js|ts)$/.test(entry.name) ? [full] : [];
    });
}

function displayName(id) {
    const file = path.join('test/json/Card', `${id}.json`);
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8'))[0].name : null;
}

describe('filler card dependencies', function () {
    GUARDED.forEach(function (key) {
        it(`no spec reads the ${key} filler without placing it`, function () {
            const id = fillers[key];
            const names = [id, displayName(id)].filter(Boolean);
            const pattern = new RegExp(names.map((n) => `'${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`).join('|'));

            const offenders = specFiles('test').filter((file) => {
                const source = fs.readFileSync(file, 'utf8');
                if(!pattern.test(source)) {
                    return false;
                }
                // If the only mentions are inside lookup calls, the spec never placed it.
                return !pattern.test(source.replace(LOOKUP, ''));
            });

            expect(offenders).toEqual([]);
        });
    });
});
