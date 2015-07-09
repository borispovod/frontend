require('angular');

angular.module('webApp').controller('dappsController', ['$scope', 'viewFactory',
    function ($scope, viewFactory) {
        $scope.view = viewFactory;
        $scope.view.page = {title: 'Dapp Store', previos: null};
        $scope.view.bar = {showDappsBar: true, searchDapps: false, showCategories:false};

    }]);