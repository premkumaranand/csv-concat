module.exports = function(file, options, parseCsv, fs) {

    var keyPrefix = file.replace(options.src + '/', '');
    keyPrefix = keyPrefix.replace('.csv', '');
    keyPrefix += '/';

    function getRecords() {
        var fileContent = fs.readFileSync(file);

        var records = parseCsv(fileContent, {
            delimiter: options.delimiter,
            relax: true
        });

        if (options.addPrefixToKey) {
            records.forEach(function (theRecord) {
                theRecord[0] = keyPrefix + theRecord[0];
            });
        }

        return records;
    }

    return {
        getRecords: getRecords
    };
};
