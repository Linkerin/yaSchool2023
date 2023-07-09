const fs = require('fs');
const path = require('path');

module.exports = function (source) {
    if (!source.includes('import i18n')) return source;

    const callback = this.async();
    const options = this.getOptions();

    const translationsPath = options.translationsPath
        ? options.translationsPath
        : path.resolve(__dirname, '../i18n.json');

    this.addDependency(translationsPath);

    fs.readFile(translationsPath, 'utf-8', function (err, content) {
        if (err) return callback(err);

        const translationsObj = JSON.parse(content);

        const replacedSource = source.replace(/{i18n\(['"]([^)]+)['"]\)}/g, (match, key) => {
            if (!!translationsObj[key]) {
                return `${translationsObj[key]}`;
            }
            return match;
        });

        callback(null, replacedSource);
    });
};
