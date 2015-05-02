require('angular');

angular.module('webApp').controller('blockInfoController', ["$scope", "$http", "blockInfo", function ($scope, $http, blockInfo) {


	console.log($scope.block);
    $scope.transactions = [];
    $scope.getTransactionsOfBlock = function (blockId) {
        $http.get("/api/transactions/", {params: {blockId: blockId}})
            .then(function (resp) {
                $scope.transactions = resp.data.transactions;
                $scope.loading = false;
            });
    };

    $scope.getTransactionsOfBlock($scope.block.id);
    $scope.close = function () {
        blockInfo.deactivate();
    }
}]);