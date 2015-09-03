require('angular');


angular.module('webApp').controller('settingsController', ['$scope', '$rootScope', '$http', "userService", "$interval", "multisignatureModal",
    function ($rootScope, $scope, $http, userService, $interval, multisignatureModal) {
        $scope.view.page = {title: 'Settings', previos: null};


        $scope.checkEnabledMultisign = function(){
            if (userService.multisignatures) {
                if (userService.multisignatures.length){
                    return true;
                }
            }
            if (userService.u_multisignatures) {
                if (userService.u_multisignatures.length) {
                    return true;
                }
            }
            return false;
        }

        $scope.enabledMultisign = $scope.checkEnabledMultisign();

        $scope.updateSettings = $interval(function(){
            $scope.enabledMultisign = $scope.checkEnabledMultisign();
        }, 1000);

            $interval.cancel($scope.updateSettings);


        $scope.setMultisignature = function () {
            if ($scope.enabledMultisign){
                return;
            }
            $interval.cancel($scope.updateSettings);
            $scope.multisignatureModal = multisignatureModal.activate({
                destroy: function () {
                    $scope.updateSettings = $interval(function () {
                        $scope.enabledMultisign = $scope.checkEnabledMultisign();
                    }, 1000);
                }
            });
        }



    }]);
