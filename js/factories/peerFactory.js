require('angular');

angular.module('webApp').factory('peerFactory', ['$http', '$interval', 'transactionService', function($http, $interval, transactionService){

	var factory = {
		editing  : false,
		peer     : {
			"ip": "130.211.72.188",
			"port": 7040
		},
		peerList : [
		],
		checkPeer: function(url, cb, timeout){
			$http.get(url + "/peer/list", transactionService.createHeaders())
					.then(function(resp){
						cb(resp);
					}, function(err){
						cb(err);
					});
		},
		setPeer  : function(ip, port){
			this.peer = {
				ip  : ip,
				port: port
			};
		},
		getUrl   : function(){
			return "http://" + this.peer.ip + ":" + this.peer.port + "";
		}
	}

	return factory;

}]);