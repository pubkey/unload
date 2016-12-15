module.exports = (function(request) {
    var pingHost = 'http://localhost:23230/counter/';
    return function() {
        return request(pingHost).then(c => parseInt(c));
    };
})(
    require('request-promise-native')
);
