require('angular');

angular.module('webApp').factory('peerFactory', ['$http',  '$interval', 'transactionService', function ($http, $interval, transactionService) {

    var factory = {
        editing: false,
        peer: null,
        peerList: [
			{
				"ip": "130.211.72.188",
				"port": 4060
			},
            {
                "ip": "104.155.15.135",
                "port": 4060
            },
            {
                "ip": "213.8.59.59",
                "port": 8040
            }
        ],
        checkPeer: function (url, cb, timeout) {
            $http.get(url + "/peer/list", transactionService.createHeaders(10000))
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
            if (this.peer){
            return "http://" + this.peer.ip + ":" + this.peer.port + "";}
            return "";
        }
    }

    return factory;

}]);

