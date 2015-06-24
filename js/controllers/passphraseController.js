require('angular');

angular.module('webApp').controller('passphraseController', ['$scope', '$rootScope', '$http', "$state", "userService", "newUser", "peerFactory",
    function ($rootScope, $scope, $http, $state, userService, newUser, peerFactory) {
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
            if (remember) {
                userService.setSessionPassword(pass);
            }

            (function (d, script) {
                script = d.createElement('script');
                script.type = 'text/javascript';
                script.async = true;
                script.onload = function ()
                {
                    $scope.logging = false;
                    $state.go('main.dashboard');
                };
                script.src = peerFactory.getUrl() + '/socket.io/socket.io.js';
                d.getElementsByTagName('head')[0].appendChild(script);
            }(document));

        }
    }]);