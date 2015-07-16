require('angular');
angular.module('webApp').controller('dappController', ['$scope', 'viewFactory', '$stateParams', '$http', "$window",
    function ($scope, viewFactory, $stateParams, $http, $window) {
        $scope.view = viewFactory;
        $scope.loading = true;
        $scope.installed = false;
        $scope.isInstalled = function () {
            $http.get('/api/dapps/installedIds').then(function (response) {
                $scope.installed = (response.data.ids.indexOf($stateParams.dappId) >= 0);
                $scope.loading = false;
                console.log("LOading: false");
            });
        }


        //previos != previous :)
        $scope.view.page = {title: '', previos: 'main.dappstore'};
        $scope.view.bar = {};
        $scope.showMore = false;
        $scope.changeShowMore = function () {
            $scope.showMore = !$scope.showMore;
        };
        $http.get("/api/dapps/get?id=" + $stateParams.dappId).then(function (response) {
            $scope.dapp = response.data.dapp;
            $scope.view.page = {title: $scope.dapp.name, previos: 'main.dappstore'};
        });

        $scope.installDapp = function() {
            $http.post("/api/dapps/install", {
                "id": $stateParams.dappId
            }).then(function (response) {
                if (response.data.success == true) {
                    $scope.installed = true;

                    if ($scope.dapp.type == 1) {
                        $window.open($scope.dapp.link, '_blank');
                    }
                }
            });
        }

        $scope.runDApp = function () {
            // open dapp
            if ($scope.dapp.type == 1) {
                $window.open($scope.dapp.link, '_blank');
            }
        }

        $scope.isInstalled();
    }]);