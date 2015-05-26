require('angular');

angular.module('webApp').controller('secondPassphraseModalController', ["$scope", "secondPassphraseModal", "$http", "userService", function ($scope, secondPassphraseModal, $http, userService) {

    $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;
    $scope.passmode=false;

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
            $scope.pass = '';
        }
    }

    $scope.addNewPassphrase = function (pass) {
        $http.put("/api/signatures", {
            secret: pass,
			secondSecret: $scope.newSecretPhrase,
            publicKey: userService.publicKey
        }).then(function (resp) {
            if (resp.data.error) {
                $scope.fromServer = resp.data.error;
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