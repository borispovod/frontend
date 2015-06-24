require('angular');
var crypti = require('crypti-js');

angular.module('webApp').controller('secondPassphraseModalController',
    ["$scope", "secondPassphraseModal", "$http", "userService", "peerFactory", "transactionService",
        function ($scope, secondPassphraseModal, $http, userService, peerFactory, transactionService) {

    $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;
    $scope.passmode = false;
    $scope.focus = 'secondPass';
    $scope.fee = 0;

    $scope.getFee = function () {
        $http.get(peerFactory.getUrl() + "/api/signatures/fee").then(function (resp) {
            if (resp.data.success) {
                $scope.fee = resp.data.fee;
            }
            else {
                $scope.fee = 0;
            }
        });
    }
    $scope.getFee();

    $scope.close = function () {
        if ($scope.destroy) {
            $scope.destroy();
        }
        secondPassphraseModal.deactivate();
    }

    $scope.passcheck = function () {
        if ($scope.rememberedPassword) {
            $scope.addNewPassphrase($scope.rememberedPassword);
        }
        else {
            $scope.passmode = !$scope.passmode;
            if ($scope.passmode) {
                $scope.focus = 'pass';
            }
            else {
                $scope.focus = 'secondPass';
            }
            $scope.pass = '';
        }
    }

    $scope.addNewPassphrase = function (pass) {
        $scope.fromServer = '';
        if ($scope.repeatSecretPhrase != $scope.newSecretPhrase) {
            $scope.fromServer = 'Password and Confirm Password don\'t match';
            return;
        }

        var transaction = crypti.signature.createSignature(pass, $scope.newSecretPhrase);
        var checkBeforSending = transactionService.checkTransaction(transaction,pass);

        if (checkBeforSending.err) {
            $scope.fromServer = checkBeforSending.message;
            return;
        }

        $scope.sending = true;

        $http.post(peerFactory.getUrl() + "/peer/transactions", {transaction: transaction}, transactionService.createHeaders()).then(function (resp) {
            $scope.sending = false;
            if (!resp.data.success) {
                $scope.fromServer = resp.data.message;
            }
            else {
                if ($scope.destroy) {
                    $scope.destroy(true);
                }

                secondPassphraseModal.deactivate();
            }
        });
    }
}]);