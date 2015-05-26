require('angular');

angular.module('webApp').controller('addContactModalController', ["$scope", "addContactModal", "$http", "userService", "contactsService",
    function ($scope, addContactModal, $http, userService, contactsService) {
        $scope.passmode = false;
        $scope.accountValid = true;
        $scope.errorMessage = "";
        $scope.secondPassphrase = userService.secondPassphrase;
        $scope.publicKey = userService.publicKey;
        $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;
        $scope.checkSecondPass = false;

        $scope.passcheck = function (fromSecondPass) {
            if (fromSecondPass) {
                $scope.checkSecondPass = false;
                $scope.passmode = $scope.rememberedPassword ? false : true;
                $scope.secondPassphrase = '';
                $scope.pass = '';
                return;
            }
            if ($scope.rememberedPassword) {
                $scope.addFolower($scope.rememberedPassword);
            }
            else {
                $scope.passmode = !$scope.passmode;
                $scope.pass = '';
            }
        }

        $scope.close = function () {
            if ($scope.destroy) {
                $scope.destroy();
            }

            addContactModal.deactivate();
        }

        $scope.addFolower = function (pass, withSecond) {
            if ($scope.secondPassphrase && !withSecond) {
                $scope.checkSecondPass = true;
                return;
            }
            var queryParams = {
                secret: pass,
                following: $scope.contact,
                publicKey: userService.publicKey
            }
            if ($scope.secondPassphrase) {
                queryParams.secondSecret = $scope.secondPhrase;
                if ($scope.rememberedPassword) {
                    queryParams.secret = $scope.rememberedPassword;
                }
            }
            contactsService.addContact(queryParams, function (response) {
                if (response.data.success) {
                    $scope.close();
                }
                else {
                    $scope.errorMessage = response.data.error;
                }
            });
        }
    }]);