var mongoose = require("mongoose");

module.exports = function() {

    var ArrayStatementSchema = mongoose.Schema({
        operation : {type : String, enum : ["CONCAT", "EVERY", "FILL", "FILTER", "FIND",
            "FINDINDEX", "FOREACH", "INDEXOF", "ISARRAY", "JOIN", "LASTINDEXOF", "MAP", "POP", "PUSH", "REDUCE",
            "REDUCERIGHT", "SHIFT", "SLICE", "SOME", "SORT", "SPLICE", "TOSTRING", "UNSHIFT", "VALUEOF"]},
        array1: Object,
        array2: Object,
        applicableFunction: Object,
        singleElement: Object,
        index1: Object,
        index2:Object

    });

    return ArrayStatementSchema;
};