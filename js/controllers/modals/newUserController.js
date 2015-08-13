require('angular');

angular.module('webApp').controller('newUserController', ["$rootScope","$scope", "$http", "newUser", "userService", "$state", "peerFactory",
    function ($rootScope,$scope, $http, newUser, userService, $state, peerFactory) {
    $scope.noMatch = false;
    $scope.firstStep = true;

    $scope.activeLabel = function (pass) {
        return pass != '';
    }

    $scope.generatePassword = function () {
        var Mnemonic = require('bitcore-mnemonic');
        var code = new Mnemonic(Mnemonic.Words.ENGLISH);
        //$scope.newPassphrase = code.toHDPrivateKey();
        $scope.newPassphrase = code.toString();
    };

    $scope.step = function () {
        if ($scope.firstStep) {
            $scope.passToCheck = $scope.newPassphrase;
        }
        $scope.firstStep = !$scope.firstStep;
    }

    $scope.savePassToFile = function (pass) {
        var blob = new Blob([pass], {type: "text/plain;charset=utf-8"});
        FS.saveAs(blob, "cryptiPassphrase.txt");
    }

    $scope.login = function (pass) {
        $scope.noMatch = false;
        var data = {secret: pass};
        if ($scope.passToCheck != pass) {
            $scope.noMatch = true;
        }
        else {
            $http.post(peerFactory.getUrl() + "/api/accounts/open/", {secret: pass})
                .then(function (resp) {
                    if (resp.data.success) {
                        newUser.deactivate();
                        userService.setData(resp.data.account.address, resp.data.account.publicKey, resp.data.account.balance, resp.data.account.unconfirmedBalance, resp.data.account.effectiveBalance);
                        userService.setForging(resp.data.account.forging);
                        userService.setSecondPassphrase(resp.data.account.secondSignature);
                        userService.unconfirmedPassphrase = resp.data.account.unconfirmedSignature;

                        (function (d, script) {

                            script = d.createElement('script');

                            script.id = "soketIoScript";
                            script.type = 'text/javascript';
                            script.async = true;
                            script.onload = function () {
                                $scope.logging = false;
                                $state.go('main.dashboard');
                            };

                            script.src = peerFactory.getUrl() + '/socket.io/socket.io.js';
                            d.getElementsByTagName('head')[0].appendChild(script);
                        }(document));

                    } else {
                        alert("Something wrong. Restart server please.");
                    }
                });
        }
    }
    $scope.close = function () {
        $rootScope.modalIsOpen = false;
        newUser.deactivate();

    }

    //runtime
    $scope.generatePassword();
}
])
;