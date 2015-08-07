require('angular');

angular.module('webApp').controller('addDappModalController', ["$scope", "$http", "addDappModal", function ($scope, $http, addDappModal) {

    $scope.close = function () {
        addDappModal.deactivate();
    }

    $scope.urlSiaMode = 0;
    $scope.changeUrlSiaMode = function(){
        $scope.urlSiaMode = $scope.urlSiaMode ? 0 : 1;
    }
    $scope.getUlrSiaText = function () {
        return $scope.urlSiaMode ? 'change to url link' : 'change to SIA ASCII';
    }

    $scope.newDapp = {
        name: "",
        description: "",
        category: 0,
        tags: "",
        gitText: "",
        siaText: "",
        iconUrl: "",
        iconSIA: ""

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