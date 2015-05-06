require('angular');

angular.module('webApp').controller('transactionInfoController', ["$scope", "$http", "transactionInfo", function ($scope, $http, transactionInfo) {

    $scope.close = function () {
        transactionInfo.deactivate();
    }
}]);