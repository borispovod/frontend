require('angular');

angular.module('webApp').controller('userSettingsModalController', ["$scope", "$http", "userSettingsModal", "userService", function ($scope, $http, userSettingsModal, userService) {

    $scope.error = null;
    $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;
    $scope.secondPassphrase = userService.secondPassphrase;

    $scope.passcheck = function (fromSecondPass) {
        if (fromSecondPass) {
            $scope.checkSecondPass = false;
            $scope.passmode = $scope.rememberedPassword ? false : true;
            $scope.secondPhrase = '';
            $scope.pass = '';
            return;
        }
        if ($scope.rememberedPassword) {
            $scope.saveName($scope.rememberedPassword);
        }
        else {

            $scope.passmode = !$scope.passmode;
            $scope.pass = '';
        }
    }

    $scope.close = function () {
        userSettingsModal.deactivate();
    }

    $scope.saveName = function (pass, withSecond) {
        if ($scope.secondPassphrase && !withSecond) {

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
        $http.put("/api/accounts/username", data)
            .then(function (resp) {
                $scope.action = false;

                if (resp.data.success) {
                    if ($scope.destroy) {
                        $scope.destroy();
                    }

                    userSettingsModal.deactivate();
                } else {
                    $scope.error = resp.data.error;
                }
            });
    }

}]);