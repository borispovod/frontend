require('angular');

angular.module('webApp').controller('registrationDelegateModalController', ["$scope", "registrationDelegateModal", "$http", "userService", "delegateService",
    function ($scope, registrationDelegateModal, $http, userService, delegateService) {
        $scope.error = null;
        $scope.delegate = userService.delegate;
        $scope.action = false;
        $scope.isSecondPassphrase = userService.secondPassphrase;
        $scope.passmode = false;
        $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;

        $scope.close = function () {
            if ($scope.destroy) {
                $scope.destroy();
            }

            registrationDelegateModal.deactivate();
        }

        $scope.passcheck = function () {
            if ($scope.rememberedPassword) {
                $scope.registrationDelegate($scope.rememberedPassword);
            }
            else {
            $scope.passmode = !$scope.passmode;
            $scope.pass = '';}
        }

        $scope.registrationDelegate = function (pass) {
            pass = pass || $scope.secretPhrase;

            $scope.action = true;
            $scope.error = null;

            $http.put("/api/delegates/", {
                secret: pass,
                secondSecret: $scope.secondPassphrase,
                username: $scope.username,
                publicKey: userService.publicKey
            })
                .then(function (resp) {
                    $scope.action = false;
                    userService.setDelegateProcess(resp.data.success);

                    if (resp.data.success) {
                        if ($scope.destroy) {
                            $scope.destroy();
                        }

                        registrationDelegateModal.deactivate();
                    } else {
                        $scope.error = resp.data.error;
                    }
                });
        }

    }]);