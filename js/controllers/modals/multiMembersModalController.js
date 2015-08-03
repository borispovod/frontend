require('angular');

angular.module('webApp').controller('multiMembersModalController', ["$scope", "multiMembersModal", function ($scope, multiMembersModal) {

    $scope.dataMembers = [
        {address: "17649443584386761059C", name: "Tom"},
        {address: "17649443584386761059C", name: "Jon"},
        {address: "17649443584386761059C"},
        {address: "45694435843867619999C"},
        {address: "17649443584386761059C", name: "Kate"}
    ];

    $scope.close = function () {
        if ($scope.destroy) {
            $scope.destroy();
        }
        multiMembersModal.deactivate();
    }

}]);