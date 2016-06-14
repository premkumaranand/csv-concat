# csv-concat
An npm module to concat csv files exclusively

Check https://github.com/premkumaranand/csv-concat/blob/master/csv-concat.js#L9 for the options.

The big winner for an exclusive case in one of my projects is the option "addPrefixToKey". Setting this to true allows one to treat the first column value in each row as a key for the row, and the key will be prefixed with the folder path in which its csv file is present. This option is closed for modification, but when there is a need I will open it for extension.