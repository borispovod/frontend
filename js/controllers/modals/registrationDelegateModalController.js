require('angular');

angular.module('webApp').controller('registrationDelegateModalController', ["$scope", "registrationDelegateModal", "$http", "userService", "delegateService",
    function ($scope, registrationDelegateModal, $http, userService, delegateService) {
        $scope.error = null;
        $scope.delegate = userService.delegate;
        $scope.action = false;
        $scope.isSecondPassphrase = userService.secondPassphrase;
        $scope.passmode = false;
        $scope.secondPassphrase = userService.secondPassphrase;
        $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;

        $scope.close = function () {
            if ($scope.destroy) {
                $scope.destroy();
            }

            registrationDelegateModal.deactivate();
        }

        $scope.passcheck = function (fromSecondPass) {
            if (fromSecondPass) {
                $scope.checkSecondPass = false;
                $scope.passmode = $scope.rememberedPassword ? false : true;
                $scope.secondPassphrase = '';
                $scope.pass = '';
                return;
            }
            if ($scope.rememberedPassword) {
                $scope.registrationDelegate($scope.rememberedPassword);
            }
            else {
                $scope.passmode = !$scope.passmode;
                $scope.pass = '';
            }
        }

        $scope.registrationDelegate = function (pass, withSecond) {
            if ($scope.secondPassphrase && !withSecond) {
                $scope.checkSecondPass = true;
                return;
            }
            pass = pass || $scope.secretPhrase;

            $scope.action = true;
            $scope.error = null;
            var data = {
                secret: pass,
                secondSecret: $scope.secondPassphrase,
                username: $scope.delegateUsername,
                publicKey: userService.publicKey
            };
            if ($scope.secondPassphrase) {
                data.secondSecret = $scope.secondPhrase;
                if ($scope.rememberedPassword) {
                    data.secret = $scope.rememberedPassword;
                }
            }
            $http.put("/api/delegates/", data)
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