require('angular');

angular.module('webApp').controller('addDappModalController', ["$scope", "$http", "addDappModal", function ($scope, $http, addDappModal) {

    $scope.close = function () {
        addDappModal.deactivate();
    }

    $scope.newDapp = {
        name: "",
        description: "",
        category: "",
        tags: "",
        gitText: "",
        siaText: ""

    };
    $scope.step = 1;

    $scope.repository = 'sia';

    $scope.getRepositoryText = function () {
        return $scope.repository == 'sia' ? $scope.newDapp.siaText : $scope.newDapp.gitText;
    }

    $scope.getRepositoryName = function () {
        return $scope.repository == 'sia' ? 'SIA' : 'GIT';
    }
    $scope.selectRepository = function (name) {
        $scope.repository = name;
    }
}]);