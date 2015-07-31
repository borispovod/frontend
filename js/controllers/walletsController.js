require('angular');

angular.module('webApp').controller('walletsController', ['$scope', '$rootScope', '$http', 'viewFactory', 'ngTableParams', '$filter',
    function ($rootScope, $scope, $http, viewFactory, ngTableParams, $filter) {
        $scope.view = viewFactory;
        $scope.view.page = {title: 'Multisignature', previos: null};
        $scope.view.bar = {showWalletBar: true};
        var data = [
            {address: "Crypti Foundation", confirmations: 4, needed: 3, pending: 2},
            {address: "Test Group", confirmations: 6, needed: 3, pending: 0},
            {address: "17649443584386761059C", confirmations: 5, needed: 5, pending: 0},
            {address: "Shopping", confirmations: 2, needed: 1, pending: 2},
            {address: "Crypti Foundation", confirmations: 6, needed: 1, pending: 4},
            {address: "17649443584386761059C", confirmations: 5, needed: 5, pending: 0},
            {address: "Crypti Foundation", confirmations: 2, needed: 2, pending: 5}
        ];
        //Wallets table
        $scope.tableWallets = new ngTableParams({
            page: 1,            // show first page
            count: 25,
            sorting: {
                address: 'asc'     // initial sorting
            }
        }, {
            counts: [],
            total: 0,
            getData: function ($defer, params) {
                var orderedData = params.sorting() ?
                    $filter('orderBy')(data, params.orderBy()) :
                    data;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

        $scope.tableWallets.settings().$scope = $scope;

        $scope.$watch("filter.$", function () {
            $scope.tableWallets.reload();
        });

        //end


    }]);