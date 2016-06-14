var argv = require('argv');

module.exports = function() {
    /**
     * Private methods
     */
    function setOptions() {
        argv.option([
            {
                name: 'src',
                short: 's',
                type: 'string',
                description: 'Directory path that has the CSV files',
                example: 'csv-concat-cli.js -s ~/somewhere/sub'
            },
            {
                name: 'delimiter',
                short: 'm',
                type: 'string',
                description: 'What are the columns delimited by? Default is comma(,)',
                example: 'csv-concat-cli.js -m |'
            },
            {
                name: 'ignore',
                short: 'i',
                type: 'csv',
                description: '//Ignore files with these names',
                example: 'csv-concat-cli.js -i napa.csv,sth.csv'
            },
            {
                name: 'dest',
                short: 'd',
                type: 'string',
                description: 'Destination file where the merged CSVs are placed into',
                example: 'csv-concat-cli.js -d ~/somewhere/napa.csv'
            },
            {
                name: 'addPrefixToKey',
                short: 'p',
                type: 'boolean',
                description: 'Generate a prefix for the keys from the folder structure and the file name? Default is false',
                example: 'csv-concat-cli.js -p true'
            }
        ]);
    }

    function getOptions() {
        //console.log(argv.run());
        return argv.run().options;
    }

    /**
     * Constructor
     */
    setOptions();

    /**
     * Public interfaces
     */
    return {
        getOptions: getOptions
    };
};
