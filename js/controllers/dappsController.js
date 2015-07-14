require('angular');

angular.module('webApp').controller('dappsController', ['$scope', 'viewFactory', '$http',
    function ($scope, viewFactory, $http) {
        $scope.view = viewFactory;
        $scope.view.page = {title: 'Dapp Store', previos: null};
        $scope.view.bar = {showDappsBar: true, searchDapps: false, showCategories:false};
        $http.get("/api/dapps").then(function (response) {
            $scope.dapps = response.data.dapps;
        });
    }]);