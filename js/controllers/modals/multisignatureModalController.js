require('angular');

angular.module('webApp').controller('multisignatureModalController', ["$scope", "$http", "multisignatureModal", function ($scope, $http, multisignatureModal) {

    $scope.close = function () {
        multisignatureModal.deactivate();
    }

}]);