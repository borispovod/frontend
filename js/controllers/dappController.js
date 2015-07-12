require('angular');
angular.module('webApp').controller('dappController', ['$scope', 'viewFactory',
    function ($scope, viewFactory) {
        $scope.view = viewFactory;
        $scope.view.page = {title: 'Inbox', previos: 'main.dappstore'};
        $scope.view.bar = {};
        $scope.showMore = false;
        $scope.changeShowMore = function(){
            $scope.showMore = !$scope.showMore;
        };

    }]);