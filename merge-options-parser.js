var argv = require('argv');

module.exports = function() {
    /**
     * Private methods
     */
    function setOptions() {
        argv.option([
            {
                name: 'dir',
                type: 'string',
                description: 'Directory path that has the CSV files',
                example: 'merge.js --dir=~/somewhere/sub'
            }
        ]);
    }

    function getOptions() {
        var options = argv.run();
        return {
            dir: options.targets[0]
        };
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
