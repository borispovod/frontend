require('angular');

angular.module('webApp').controller('walletsController', ['$scope', '$rootScope', '$http', 'viewFactory', 'ngTableParams', '$filter', 'multiMembersModal',
    function ($rootScope, $scope, $http, viewFactory, ngTableParams, $filter, multiMembersModal) {
        $scope.view = viewFactory;
        $scope.view.inLoading = true;
        $scope.view.loadingText = "Loading multisignature wallets";
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

        var dataConfirmed = [
            {
                address: "Crypti Foundation",
                confirmations: 4,
                needed: 3,
                amount: 100900000000,
                fee: 100900000,
                timestamp: 9730609,
                recipientId: "9946841100442405851C"
            },
            {address: "Test Group", confirmations: 6, needed: 3, amount: 100900000000,
                fee: 100900000,
                timestamp: 12060576,
                recipientId: "9946841100442405851C"},
            {address: "17649443584386761059C", confirmations: 5, needed: 5, amount: 100900000000,
                fee: 100900000,
                timestamp: 9730609,
                recipientId: "9946841100442405851C"},
            {address: "Shopping", confirmations: 2, needed: 7, amount: 100900000000,
                fee: 100900000,
                timestamp: 9730609,
                recipientId: "9946841100442405851C"},
            {address: "Crypti Foundation", confirmations: 1, needed: 6, amount: 100900000000,
                fee: 100900000,
                timestamp: 12060576,
                recipientId: "9946841100442405851C"},
            {address: "17649443584386761059C", confirmations: 3, needed: 5, amount: 100900000000,
                fee: 100900000,
                timestamp: 9730609,
                recipientId: "9946841100442405851C"},
            {address: "Crypti Foundation", confirmations: 2, needed: 2, amount: 100900000000,
                fee: 100900000,
                timestamp: 12060576,
                recipientId: "9946841100442405851C"}
        ];


        $scope.showMembers = function (confirmed) {
            $scope.multiMembersModal = multiMembersModal.activate({
                confirmed: confirmed,
                destroy: function () {
                }
            });
        }

        //Wallets table
        $scope.tableWallets = new ngTableParams({
            page: 1,            // show first page
            count: 25,
            sorting: {
                address: 'desc'     // initial sorting
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

        //Wallets table
        $scope.tableTransactions = new ngTableParams({
            page: 1,            // show first page
            count: 10,
            sorting: {
                timestamp: 'asc'     // initial sorting
            }
        }, {
            counts: [],
            total: 0,
            getData: function ($defer, params) {
                var orderedData = params.sorting() ?
                    $filter('orderBy')(dataConfirmed, params.orderBy()) :
                    dataConfirmed;
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                $scope.view.inLoading = false;
            }
        });

        $scope.tableTransactions.settings().$scope = $scope;

        $scope.$watch("filter.$", function () {
            $scope.tableTransactions.reload();
        });

        //end


    }]);