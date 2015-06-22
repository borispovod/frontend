require('angular');

angular.module('webApp').controller('walletsController', ['$scope', '$rootScope', '$http', 'viewFactory', 'ngTableParams',
    function ($rootScope, $scope, $http, viewFactory, ngTableParams) {
        $scope.view = viewFactory;
        $scope.view.page = {title: 'Wallets', previos: null};
        $scope.view.bar = {showWalletBar: true};
        var data = [
            {address: "17649443584386761059C", confirmations: 4, needed: 3, pending: 2},
            {address: "17649443584386761059C", confirmations: 6, needed: 3, pending: 0},
            {address: "17649443584386761059C", confirmations: 5, needed: 5, pending: 0},
            {address: "17649443584386761059C", confirmations: 2, needed: 1, pending: 2},
            {address: "17649443584386761059C", confirmations: 6, needed: 1, pending: 4},
            {address: "17649443584386761059C", confirmations: 5, needed: 5, pending: 0},
            {address: "17649443584386761059C", confirmations: 2, needed: 2, pending: 5}


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
                $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

        $scope.tableWallets.settings().$scope = $scope;

        $scope.$watch("filter.$", function () {
            $scope.tableWallets.reload();
        });

        //end


    }]);