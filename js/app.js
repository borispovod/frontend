require('angular');
require('angular-ui-router');
require('angular-modal');
require('angular-resource');
require('browserify-angular-animate');
require('ng-clip');
require('../bower_components/angular-chart.js/dist/angular-chart.js');
require('../bower_components/angular-socket-io/socket.js');
//require('../bower_components/angular-materialize/src/angular-materialize.js');
require('../node_modules/ng-table/dist/ng-table.js');

webApp = angular.module('webApp', ['ui.router', 'btford.modal', 'ngTable', 'ngAnimate',  'chart.js', 'btford.socket-io', 'ui.bootstrap', 'ngClipboard']);

webApp.config(["ngClipProvider",
    "$locationProvider",
    "$stateProvider",
    "$urlRouterProvider",
    function (ngClipProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
        ngClipProvider.setPath("../node_modules/zeroclipboard/dist/ZeroClipboard.swf");

        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise("/");

        // Now set up the states
        $stateProvider
            .state('main', {
                abstract: true,
                templateUrl: "/partials/app-template.html",
                controller: "templateController"
            })
            .state('main.dashboard', {
                url: "/dashboard",
                templateUrl: "/partials/account.html",
                controller: "accountController"
            })
            .state('main.transactions', {
                url: "/transactions",
                templateUrl: "/partials/transactions.html",
                controller: "transactionsController"
            })
            .state('main.delegates', {
                url: "/delegates",
                templateUrl: "/partials/delegates.html",
                controller: "delegatesController"
            })
            .state('main.votes', {
                url: "/delegates/votes",
                templateUrl: "/partials/votes.html",
                controller: "votedDelegatesController"
            })
            .state('main.forging', {
                url: "/forging",
                templateUrl: "/partials/forging.html",
                controller: "forgingController"
            })
            .state('main.blockchain', {
                url: "/blockchain",
                templateUrl: "/partials/blockchain.html",
                controller: "blockchainController"
            })
            .state('main.contacts', {
                url: "/contacts",
                templateUrl: "/partials/contacts.html",
                controller: "contactsController"
            })
            .state('main.pending', {
                url: "/pending",
                templateUrl: "/partials/pendings.html",
                controller: "pendingsController"
            })
            .state('passphrase', {
                url: "/",
                templateUrl: "/partials/passphrase.html",
                controller: "passphraseController"
            });
    }
]);




