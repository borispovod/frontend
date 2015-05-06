require('angular');

angular.module('webApp').controller('blockchainController', ['$scope', '$rootScope', '$http', "userService", "$interval", 'blockService', 'blockModal', 'blockInfo', 'userInfo', 'ngTableParams', 'viewFactory',
    function ($rootScope, $scope, $http, userService, $interval, blockService, blockModal, blockInfo, userInfo, ngTableParams, viewFactory) {
        $scope.view = viewFactory;
        $scope.view.page = {title: 'Blockchain', previos: null};
        $scope.view.bar = {showBlockSearchBar: true};
        $scope.address = userService.address;
        $scope.loading = true;

        //Blocks
        $scope.tableBlocks = new ngTableParams({
            page: 1,
            count: 25,
            sorting: {
                height: 'desc'
            }
        }, {
            total: 0,
            counts: [],
            getData: function ($defer, params) {
                $scope.loading = true;
                blockService.getBlocks($defer, params, $scope.filter, function () {
                    $scope.loading = false;
                });
            }
        });

        $scope.tableBlocks.settings().$scope = $scope;

        $scope.$watch("filter.$", function () {
            $scope.tableBlocks.reload();
        });

        $scope.updateBlocks = function () {
            $scope.tableBlocks.reload();
        };
        //end Blocks

        $scope.$on('updateControllerData', function (event, data) {
            if (data.indexOf('blockchain') != -1) {
                $scope.updateBlocks();
            }
        });

        $scope.blocksInterval = $interval(function () {
            $scope.updateBlocks();
        }, 1000 * 60);

        $scope.$on('$destroy', function () {
            $interval.cancel($scope.blocksInterval);
            $scope.blocksInterval = null;
        });

        $scope.showBlock = function (block) {
            $scope.modal = blockModal.activate({block: block});
        }

        $scope.blockInfo = function (block) {
            $scope.modal = blockInfo.activate({block: block});
        }

        $scope.userInfo = function (userId) {
            $scope.modal = userInfo.activate({userId: userId});
        }

    }]);