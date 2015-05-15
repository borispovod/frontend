require('angular');

angular.module('webApp').controller('addContactModalController', ["$scope", "addContactModal", "$http", "userService", "contactsService",
    function ($scope, addContactModal, $http, userService, contactsService) {
        $scope.passmode = false;
        $scope.accountValid = true;
        $scope.errorMessage = "";
        $scope.secondPassphrase = userService.secondPassphrase;
        $scope.publicKey = userService.publicKey;
        $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;

        $scope.passcheck = function () {
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

        $scope.addFolower = function (secretPhrase) {
            contactsService.addContact(userService.publicKey, secretPhrase, $scope.contact, function (response) {
                console.log(response);
            });
        }
    }]);