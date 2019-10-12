const serialize = require('serialize-javascript');

exports.serialize =serialize;
exports.deserialize = function deserialize(serializedJavascript){
    return eval('(' + serializedJavascript + ')');
};