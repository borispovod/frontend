require('angular');

angular.module('webApp').controller('contactsController', ['$scope', '$rootScope', '$http', 'viewFactory', 'contactsService', 'ngTableParams',
    function ($rootScope, $scope, $http, viewFactory, contactsService, ngTableParams) {
        $scope.view = viewFactory;
        $scope.view.page = {title: 'Contacts', previos: null};
        $scope.view.bar = {showContactsBar: true};
        $scope.contactsView = contactsService;
        //Contacts table
        $scope.tableContacts = new ngTableParams({
            page: 1,            // show first page
            count: 25,
            sorting: {
                username: 'asc'     // initial sorting
            }
        }, {
            counts: [],
            total: 0,
            getData: function ($defer, params) {
                contactsService.getSortedContacts($defer, params, $scope.filter);
            }
        });

        $scope.tableContacts.settings().$scope = $scope;

        $scope.$watch("filter.$", function () {
            $scope.tableContacts.reload();
        });

        $scope.updateContacts = function () {
            $scope.tableContacts.reload();
        };
        //end Top delegates

        $scope.$on('updateControllerData', function (event, data) {
            if (data.indexOf('main.contacts') != -1) {
                $scope.updateContacts();
            }
        });

    }]);