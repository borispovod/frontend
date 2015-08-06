require('angular');

angular.module('webApp').controller('addDappModalController', ["$scope", "$http", "addDappModal", function ($scope, $http, addDappModal) {

    $scope.close = function () {
        addDappModal.deactivate();
    }

    $scope.step=1;
    $scope.name="";
    $scope.description = "";
    $scope.category = "";
    $scope.tags = "";
    $scope.gitText ="";
    $scope.siaText = "";

    $scope.repository = 'sia';

    $scope.getRepositoryText = function(){
        return $scope.repository == 'sia'? siaText: gitText;
    }

    $scope.getRepositoryName = function () {
        return $scope.repository == 'sia' ? 'SIA' : 'GIT';
    }
    $scope.selectRepository = function(name){
        $scope.repository = name;
    }
}]);