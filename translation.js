module.exports = function(key, value) {
    return {
        key: key,
        value: value,

        toString: function() {
            return key + '|' + value;
        }
    };
}
