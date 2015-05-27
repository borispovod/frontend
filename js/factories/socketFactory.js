require('angular');

angular.module('webApp').factory('serverSocket', ["socketFactory", "$location", function (socketFactory, $location) {
    var newIoSocket = io.connect($location.protocol() + '://' + $location.host() + ($location.port() ? ':' + $location.port() : ''));
    serverSocket = socketFactory({
        ioSocket: newIoSocket
    });
    serverSocket.forward('transactions/change');
    serverSocket.forward('blocks/change');
    serverSocket.forward('delegates/change');
    serverSocket.forward('contacts/change');
    serverSocket.forward('followers/change');
    return serverSocket;
}]);