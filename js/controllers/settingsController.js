require('angular');


angular.module('webApp').controller('settingsController', ['$scope', '$rootScope', '$http', "userService", "$interval", "multisignatureModal",
    function ($rootScope, $scope, $http, userService, $interval, multisignatureModal) {
        $scope.view.page = {title: 'Settings', previos: null};
        $scope.setMultisignature = function () {
            $scope.multisignatureModal = multisignatureModal.activate({
                destroy: function () {

                }
            });
        }


    }]);