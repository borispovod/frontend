require('angular');

angular.module('webApp').controller('passphraseController', ['$scope', '$rootScope', '$http', "$state", "userService", "newUser",
    function ($rootScope, $scope, $http, $state, userService, newUser) {

        // angular.element(document.getElementById("forgingButton")).show();
        $scope.newUser = function () {
            console.log('done');
            $scope.newUserModal = newUser.activate({
                destroy: function () {
                }
            });
        }
        $scope.login = function (pass) {
            var data = {secret: pass};

            $http.post("/api/accounts/open/", {secret: pass})
                .then(function (resp) {
                    if (resp.data.success) {
                        userService.setData(resp.data.account.address, resp.data.account.publicKey, resp.data.account.balance, resp.data.account.unconfirmedBalance, resp.data.account.effectiveBalance);
                        userService.setForging(resp.data.account.forging);
                        userService.setSecondPassphrase(resp.data.account.secondSignature);
                        userService.unconfirmedPassphrase = resp.data.account.unconfirmedSignature;

                        //angular.element(document.getElementById("forgingButton")).hide();
                        $state.go('main.dashboard');
                    } else {
                        alert("Something wrong. Restart server please.");
                    }
                });
        }
    }]);