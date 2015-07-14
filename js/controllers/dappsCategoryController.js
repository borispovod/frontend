require('angular');

angular.module('webApp').controller('dappsCategoryController', ['$scope', 'viewFactory', '$http', '$stateParams',
    function ($scope, viewFactory, $http, $stateParams) {
        $scope.view = viewFactory;
        $scope.category = $stateParams.categoryId;
        $scope.view.page = {title: $scope.categoryType[$scope.category], previos: 'main.dappstore'};
        $scope.view.bar = {showDappsCategoryBar: true};
            $http.get("/api/dapps/?category="+$scope.category).then(function (response) {
                $scope.dapps = response.data.dapps;
            });
    }]);