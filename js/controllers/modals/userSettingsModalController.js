require('angular');

angular.module('webApp').controller('userSettingsModalController', ["$scope", "$http", "userSettingsModal", "userService", function ($scope, $http, userSettingsModal, userService) {

    $scope.error = null;

    $scope.passcheck = function () {
        $scope.passmode = !$scope.passmode;
        $scope.pass = '';
    }

    $scope.close = function () {
        userSettingsModal.deactivate();
    }

    $scope.saveName = function () {
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