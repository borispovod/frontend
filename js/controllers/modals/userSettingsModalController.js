require('angular');

angular.module('webApp').controller('userSettingsModalController', ["$scope", "$http", "userSettingsModal", "userService", function ($scope, $http, userSettingsModal, userService) {

    $scope.error = null;
    $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;

    $scope.passcheck = function () {
        if ($scope.rememberedPassword) {
            $scope.saveName($scope.rememberedPassword);
        }
        else {
        $scope.passmode = !$scope.passmode;
        $scope.pass = '';}
    }

    $scope.close = function () {
        userSettingsModal.deactivate();
    }

    $scope.saveName = function (pass) {
        pass = pass || $scope.secretPhrase;
        $scope.action = true;
        $scope.error = null;

        $http.put("/api/accounts/username", {
            secret: $scope.secretPhrase,
            secondSecret: $scope.secondPassphrase,
            username: $scope.username,
            publicKey: userService.publicKey
        })
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