require('angular');

angular.module('webApp').controller('userSettingsModalController',
    ["$scope", "$http", "userSettingsModal", "userService", "transactionService", "peerFactory",
        function ($scope, $http, userSettingsModal, userService, transactionService, peerFactory) {

    $scope.error = null;
    $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;
    $scope.secondPassphrase = userService.secondPassphrase;
    $scope.focus = 'username';

    $scope.passcheck = function (fromSecondPass) {
        if (fromSecondPass) {
            $scope.checkSecondPass = false;
            $scope.passmode = $scope.rememberedPassword ? false : true;
            if ($scope.passmode){
                $scope.focus = 'passPhrase';
            }
            else {
                $scope.focus = 'username';
            }
            $scope.secondPhrase = '';
            $scope.pass = '';
            return;
        }
        if ($scope.rememberedPassword) {
            $scope.saveName($scope.rememberedPassword);
        }
        else {
            $scope.focus = 'passPhrase';
            $scope.passmode = !$scope.passmode;
            $scope.pass = '';
        }
    }

    $scope.close = function () {
        userSettingsModal.deactivate();
    }

    $scope.saveName = function (pass, withSecond) {
        if ($scope.secondPassphrase && !withSecond) {
            $scope.focus = 'secondPhrase';
            $scope.checkSecondPass = true;
            return;
        }
        pass = pass || $scope.secretPhrase;
        $scope.action = true;
        $scope.error = null;

        var data = {
            secret: pass,
            username: $scope.username,
            publicKey: userService.publicKey};

        if ($scope.secondPassphrase) {
            data.secondSecret = $scope.secondPhrase;
            if ($scope.rememberedPassword) {
                data.secret = $scope.rememberedPassword;
            }
        }
        var crypti = require('crypti-js');
        var usernameTransaction;

        usernameTransaction = crypti.username.createUsername(data.secret, data.username, data.secondSecret);

        var checkBeforSending = transactionService.checkTransaction(usernameTransaction, data.secret);

        if (checkBeforSending.err) {
            $scope.error = checkBeforSending.message;
            return;
        }

        if (!$scope.lengthError && !$scope.sending) {
            $scope.sending = !$scope.sending;

            $http.post(peerFactory.getUrl() + "/peer/transactions",
                {transaction: usernameTransaction},
                transactionService.createHeaders()).then(function (resp) {
                    $scope.sending = !$scope.sending;
                    if (!resp.data.success) {
                        $scope.error = resp.data.error;
                    }
                    else {
                        if ($scope.destroy) {
                            $scope.destroy();
                        }
                        userSettingsModal.deactivate();
                    }
                });

        }


    }

}]);