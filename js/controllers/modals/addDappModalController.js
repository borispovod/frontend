require('angular');

angular.module('webApp').controller('addDappModalController', ["$scope", "$http", "addDappModal", function ($scope, $http, addDappModal) {

    $scope.close = function () {
        $http.put('/api/dapps', $scope.newDapp).then(function (response) {
            // catch error and show loading
            addDappModal.deactivate();
        });
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
        type: 0,
        tags: "",
        git: "",
        siaAscii: "",
        siaIcon: "",
        icon: ""
    };

    $scope.goToStep3 = function(invalid){
        if ($scope.dapp_data_form.$valid) {
            $scope.step = 3;
        } else {
            $scope.dapp_data_form.submitted = true;
        }


    }
    $scope.goToStep2 = function () {

        $scope.step = 2;
    }

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