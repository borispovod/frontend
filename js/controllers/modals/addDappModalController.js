require('angular');

angular.module('webApp').controller('addDappModalController', ["$scope", "$http", "addDappModal", function ($scope, $http, addDappModal) {

    $scope.close = function () {
        addDappModal.deactivate();
    }

}]);