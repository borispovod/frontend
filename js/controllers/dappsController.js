require('angular');

angular.module('webApp').controller('dappsController', ['$scope', 'viewFactory', '$http', 'dappsService', '$timeout',
    function ($scope, viewFactory, $http, dappsService, $timeout) {
        $scope.view = viewFactory;
        $scope.view.page = {title: 'Dapp Store', previos: null};
        $scope.view.bar = {showDappsBar: true, searchDapps: false, showCategories: false};
        $scope.searchDapp = dappsService;
        $scope.searchDapp.searchForDappGlobal = '';
        $scope.searchDapp.inSearch = false;
        $scope.showPlaceholder = false;

        //Search dapps watcher
        var tempsearchForDappID = '',
            searchForDappIDTimeout;
        $scope.$watch('searchDapp.searchForDappGlobal', function (val) {
            if (searchForDappIDTimeout) $timeout.cancel(searchForDappIDTimeout);
            if (val.trim() != '') {
                $scope.searchDapp.inSearch = true;
            }
            else {
                $scope.searchDapp.inSearch = false;
                if (tempsearchForDappID != val) {
                    tempsearchForDappID = val;
                    $scope.searchDapp.searchForDappGlobal = tempsearchForDappID;
                    $scope.searchDappText();
                    return;
                }
            }
            tempsearchForDappID = val;
            searchForDappIDTimeout = $timeout(function () {
                $scope.searchDapp.searchForDappGlobal = tempsearchForDappID;
                $scope.searchDappText();
            }, 2000); // delay 2000 ms
        })

        $scope.searchedText = '';
        $scope.searchedInstalledText = '';

        $scope.searchDappText = function () {
            if ($scope.searchDapp.searchForDappGlobal.trim() == '') {

                $http.get("/api/dapps").then(function (response) {
                    $scope.dapps = response.data.dapps;
                    $scope.searchedText = '';
                });
                $http.get("/api/dapps/installed").then(function (response) {
                    $scope.installedDapps = response.data.dapps;
                    $scope.searchedInstalledText = '';
                    if (!$scope.installedDapps.length) {
                        $scope.showPlaceholder = true;
                    }
                });

            }
            else {
                $http.get("/api/dapps/search?q=" + $scope.searchDapp.searchForDappGlobal).then(function (response) {
                    $scope.dapps = response.data.dapps;
                    $scope.searchDapp.inSearch = false;
                    $scope.searchedText = '(search for "' + $scope.searchDapp.searchForDappGlobal + '")';
                });
                if (!$scope.showPlaceholder) {
                    $http.get("/api/dapps/search?q=" + $scope.searchDapp.searchForDappGlobal + "&installed=1").then(function (response) {
                        $scope.installedDapps = response.data.dapps;
                        $scope.searchedInstalledText = '(search for "' + $scope.searchDapp.searchForDappGlobal + '")';
                    });
                }
            }

        };

        $scope.searchDappText();
    }]);