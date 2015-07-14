require('angular');
angular.module('webApp').controller('dappController', ['$scope', 'viewFactory', '$stateParams', '$http',
    function ($scope, viewFactory, $stateParams, $http) {
        $scope.view = viewFactory;
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

        $scope.installDapp = function(){
            $http.post("/api/dapps/install", {
                "id": $stateParams.dappId
            }).then(function (response) {

            });
        }

    }]);