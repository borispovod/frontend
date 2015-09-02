require('angular');

angular.module('webApp').controller('walletsController', ['$scope', '$rootScope', '$http', 'viewFactory', 'ngTableParams', '$filter', 'multiMembersModal', 'multiService', 'userService',
    function ($rootScope, $scope, $http, viewFactory, ngTableParams, $filter, multiMembersModal, multiService, userService) {
        $scope.view = viewFactory;
        $scope.view.inLoading = false;
        $scope.view.loadingText = "Loading multisignature wallets";
        $scope.view.page = {title: 'Multisignature', previos: null};
        $scope.view.bar = {showWalletBar: true};

        $scope.countSign = function(transaction){
            return transaction.signatures ? transaction.signatures.length: 0;
        }

        $scope.signedByUser = function (transaction) {
            return transaction.signatures ? (transaction.signatures.indexOf(userService.publicKey)!=-1) : false;
        }

        $scope.showMembers = function (confirmed) {
            $scope.multiMembersModal = multiMembersModal.activate({
                confirmed: confirmed,
                destroy: function () {
                }
            });
        }

        $scope.confirmTransaction = function (transactionId) {
            multiService.confirmTransaction(transactionId, function () {
            })
        };

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
                $scope.view.inLoading = true;
                multiService.getWallets($defer, params, $scope.filter, function () {
                    $scope.view.inLoading = false;
                });

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
                $scope.view.inLoading = true;
                multiService.getPendings($defer, params, $scope.filter, function () {
                    $scope.view.inLoading = false;
                });
            }
        });

        $scope.tableTransactions.settings().$scope = $scope;

        $scope.$watch("filter.$", function () {
            $scope.tableTransactions.reload();
        });
        //end


        $scope.$on('updateControllerData', function (event, data) {
            if (data.indexOf('main.multi') != -1) {
                $scope.updateWallets();
            }
        });

        $scope.updateWallets = function () {
            $scope.tableTransactions.reload();
            $scope.tableWallets.reload();
        };


    }]);