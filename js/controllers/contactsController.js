require('angular');

angular.module('webApp').controller('contactsController', ['$scope', '$rootScope', '$http', 'viewFactory', 'contactsService',
    function ($rootScope, $scope, $http, viewFactory, contactsService) {
        $scope.view = viewFactory;
        $scope.view.page = {title: 'Contacts', previos: null};
        $scope.view.bar = {showContactsBar: true};

    }]);