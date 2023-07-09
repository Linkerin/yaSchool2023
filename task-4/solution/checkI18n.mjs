import { readdirSync, readFileSync } from 'fs';
import { resolve, extname } from 'path';

const SOLUTION_FOLDER_NAME = 'solution';
const [, , SOLUTION_ZIP_ARCHIVE_NAME] = process.argv;
const [SOLUTION_ZIP_ARCHIVE_FOLDER_NAME] = SOLUTION_ZIP_ARCHIVE_NAME.split('.');

const STUDENT_DIRECTORY = resolve(SOLUTION_FOLDER_NAME, SOLUTION_ZIP_ARCHIVE_FOLDER_NAME);

try {
    const i18n = JSON.parse(readFileSync(`${STUDENT_DIRECTORY}/i18n.json`, 'utf-8'));
    const i18nKeys = Object.keys(i18n);
    const i18nValue = Object.values(i18n);

    const files = readdirSync(`${STUDENT_DIRECTORY}/dist`, 'utf-8');

    files.forEach(filename => {
        if (extname(filename) === '.js') {
            const fileContent = readFileSync(`${STUDENT_DIRECTORY}/dist/${filename}`, 'utf-8');
            const test1 = i18nKeys.every(key => {
                if (fileContent.includes(`i18n('${key}')`)) {
                    console.log(`Найдено i18n('${key}')`);
                    return false;
                }
                return true;
            });
            const test2 = i18nKeys.every(key => {
                if (fileContent.includes(`i18n("${key}")`)) {
                    console.log(`Найдено i18n('${key}')`);
                    return false;
                }
                return true;
            });

            if (test1 === false || test2 === false) {
                console.log('Найден как минимум 1 вызов i18n');
                process.exit(1);
            }
        }
    });
} catch (e) {
    console.log('Unknown error');
    console.log(e);
    process.exit(1);
}
