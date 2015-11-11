require('angular');

angular.module('webApp').factory('serverSocket', ["socketFactory", "$location", "peerFactory", function (socketFactory, $location, peerFactory) {
    var newIoSocket = io.connect(peerFactory.getUrl());
    serverSocket = socketFactory({
        ioSocket: newIoSocket
    });

    serverSocket.newPeer = function(){
        newIoSocket.disconnect();
        newIoSocket = io.connect(peerFactory.getUrl());
        serverSocket = socketFactory({
            ioSocket: newIoSocket
        });
        serverSocket.forward('transactions/change');
        serverSocket.forward('blocks/change');
        serverSocket.forward('delegates/change');
        serverSocket.forward('contacts/change');
        serverSocket.forward('followers/change');
        serverSocket.forward('multisignatures/change');
        serverSocket.forward('multisignatures/signatures/change');
        serverSocket.forward('dapps/change');
        serverSocket.forward('rounds/change');
    };

    serverSocket.forward('transactions/change');
    serverSocket.forward('blocks/change');
    serverSocket.forward('delegates/change');
    serverSocket.forward('contacts/change');
    serverSocket.forward('followers/change');
    serverSocket.forward('multisignatures/change');
    serverSocket.forward('multisignatures/signatures/change');
    serverSocket.forward('dapps/change');
    serverSocket.forward('rounds/change');
    return serverSocket;
}]);