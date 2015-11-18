require('angular');

angular.module('webApp').controller('newUserController', ["$scope", "$http", "newUser", "userService", "$state", "peerFactory", "viewFactory",
    function ($scope, $http, newUser, userService, $state, peerFactory, viewFactory) {
    $scope.noMatch = false;
    $scope.firstStep = true;
    $scope.view = viewFactory;
    $scope.view.loadingText = "Registering user";
    $scope.view.inLoading = false;

    $scope.activeLabel = function (pass) {
        return pass != '';
    }

    $scope.generatePassword = function () {
        var Mnemonic = require('bitcore-mnemonic');
        var code = new Mnemonic(Mnemonic.Words.ENGLISH);
        //$scope.newPassphrase = code.toHDPrivateKey();
        $scope.newPassphrase = code.toString();
        $scope.newPassphrase = $scope.newPassphrase.length > 100 ? $scope.newPassphrase.substr(0, 99) : $scope.newPassphrase;
    };

    $scope.step = function () {
        if ($scope.firstStep) {
            $scope.passToCheck = $scope.newPassphrase;
        }
        $scope.firstStep = !$scope.firstStep;
    }

    $scope.savePassToFile = function (pass) {
        var crypti = require('crypti-js');
        var keys = crypti.crypto.getKeys(pass);
        var address = crypti.crypto.getAddress(keys.publicKey);
        fs.writeFile('pass for ' + address + '.txt', 'address: ' + address + ' password: ' + pass, function (err) {
            if (err) throw err;
            Materialize.toast('密码已保存到文件: \'pass for ' + address + '.txt\'', 4000);
        });
    }

    $scope.login = function (pass) {
        $scope.noMatch = false;
        var data = {secret: pass};
        if ($scope.passToCheck != pass) {
            $scope.noMatch = true;
        }
        else {
            $scope.view.inLoading = true;
            $http.post(peerFactory.getUrl() + "/api/accounts/open/", {secret: pass})
                .then(function (resp) {
                    $scope.view.inLoading = false;
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
        newUser.deactivate();
    }

    //runtime
    $scope.generatePassword();
}
])
;
