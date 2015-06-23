require('angular');

angular.module('webApp').factory('peerFactory', ['$http',  '$interval', function ($http, $interval) {

    var factory = {
        editing: false,
        peer: {
            "ip": "130.211.72.188",
            "port": 4060
        },
        peerList: [
			{
				"ip": "130.211.72.188",
				"port": 4060
			}
        ],
        checkPeer: function (url, cb, timeout) {
            $http.get(url + "/peer/list", transactionService.createHeaders(timeout))
                .then(function (resp) {
                    cb(resp);
                }, function (err) {
                    cb(err);
                });
        },
        setPeer: function (ip, port) {
            this.peer = {
                ip: ip,
                port: port
            };
        },
        getUrl: function () {
            return "http://" + this.peer.ip + ":" + this.peer.port + "";
        }
    }

    return factory;

}]);