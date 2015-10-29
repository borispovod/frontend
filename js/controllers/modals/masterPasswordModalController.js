require('angular');

angular.module('webApp').controller('masterPasswordModalController', ["$scope", "masterPasswordModal", function ($scope, masterPasswordModal) {

    $scope.masterPass = '';
    $scope.emptyPass = false;

    $scope.close = function (pass) {
        if ($scope.destroy) {
            $scope.destroy(pass);
        }
        masterPasswordModal.deactivate();
    }
    $scope.passcheck = function (pass) {
        $scope.emptyPass = !pass;
        if (!$scope.emptyPass) {
            $scope.close(pass);
        }
    }


}]);