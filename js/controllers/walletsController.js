require('angular');

angular.module('webApp').controller('walletsController', ['$scope', '$rootScope', '$http', 'viewFactory', 'ngTableParams', '$filter', 'multiMembersModal', 'multiService', 'userService',
    function ($rootScope, $scope, $http, viewFactory, ngTableParams, $filter, multiMembersModal, multiService, userService) {
        $scope.view = viewFactory;
        $scope.view.inLoading = false;
        $scope.view.loadingText = "Loading multisignature wallets";
        $scope.view.page = {title: 'Multisignature', previos: null};
        $scope.view.bar = {showWalletBar: true};
        $scope.secondPassphrase = userService.secondPassphrase;
        $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;
        $scope.countWallets = 0;
        $scope.countPendings = 0;

        $scope.countSign = function (transaction) {
            return (transaction.signatures ? transaction.signatures.length : 0) + 1;
        }

        $scope.signedByUser = function (transaction) {
            return false;
            return transaction.signatures ? (transaction.signatures.indexOf(userService.publicKey) != -1) : false;
        }

        $scope.showMembers = function (confirmed, dataMembers, address) {
            dataMembers.push({address: address})
            $scope.multiMembersModal = multiMembersModal.activate({
                confirmed: confirmed,
                dataMembers: dataMembers,
                destroy: function () {
                }
            });
        }

        $scope.confirmTransaction = function (transactionId) {
            if (!$scope.secondPassphrase && $scope.rememberedPassword) {
                multiService.confirmTransaction(transactionId, function (err) {
                    if (!err) {
                        $scope.tableTransactions.reload();
                    }
                })
            }
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
                    $scope.countWallets = params.total();
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
                    $scope.countPendings = params.total();
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