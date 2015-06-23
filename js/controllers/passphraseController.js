require('angular');

angular.module('webApp').controller('passphraseController', ['$scope', '$rootScope', '$http', "$state", "userService", "newUser",
    function ($rootScope, $scope, $http, $state, userService, newUser) {
        userService.setData();
        userService.rememberPassword = false;
        userService.rememberedPassword = '';
        $scope.rememberPassword = true;
        $scope.errorMessage = "";

        // angular.element(document.getElementById("forgingButton")).show();
        $scope.newUser = function () {
            $scope.newUserModal = newUser.activate({
                destroy: function () {
                }
            });
        }
        $scope.login = function (pass, remember) {
            if (pass.length>100) {
                $scope.errorMessage = 'Password must contain less than 100 characters.';
                return;
            }
            var data = {secret: pass};
            $scope.errorMessage = "";

            var crypti = require('crypti-js');
            var keys = crypti.crypto.getKeys(pass);
            var address = crypti.crypto.getAddress(keys.publicKey);
            userService.setData(address, keys.publicKey);
            $scope.logging = false;
            $state.go('main.dashboard');
        }
    }]);