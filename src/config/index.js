const api = require('./api');
const host = window.location.origin+window.location.pathname;
module.exports = {
    name: '斯蔚沃后台管理系统',
    api: api,
    host:host
};