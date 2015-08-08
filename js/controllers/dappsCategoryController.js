require('angular');

angular.module('webApp').controller('dappsCategoryController', ['$scope', 'viewFactory', '$http', '$stateParams', 'dappsService', '$timeout',
    function ($scope, viewFactory, $http, $stateParams, dappsService, $timeout) {
        alert("1");
        $scope.view = viewFactory;
        $scope.view.inLoading = true;
        $scope.view.loadingText = "Loading dapps";
        $scope.category = $stateParams.categoryId;
        $scope.view.page = {title: $scope.category, previos: 'main.dappstore'};
        $scope.view.bar = {showDappsCategoryBar: true};
        $scope.searchedText = '';
        $scope.searchDapp = dappsService;
        $scope.searchDapp.searchForDapp = '';
        $scope.searchDapp.inSearch = false;

        //Search dapps watcher
        var tempsearchForDappID = '',
            searchForDappIDTimeout;
        $scope.$watch('searchDapp.searchForDapp', function (val) {
            if (searchForDappIDTimeout) $timeout.cancel(searchForDappIDTimeout);
            if (val.trim() != '') {
                $scope.searchDapp.inSearch = true;
            }
            else {
                $scope.searchDapp.inSearch = false;
                if (tempsearchForDappID != val) {
                    tempsearchForDappID = val;
                    $scope.searchDapp.searchForDapp = tempsearchForDappID;
                    $scope.searchDappText();
                    return;
                }
            }
            tempsearchForDappID = val;
            searchForDappIDTimeout = $timeout(function () {
                $scope.searchDapp.searchForDapp = tempsearchForDappID;
                $scope.searchDappText();
            }, 2000); // delay 2000 ms
        })


        $scope.searchDappText = function () {
            if ($scope.category == 'Installed') {
                if ($scope.searchDapp.searchForDapp.trim() != '') {
                    $http.get("/api/dapps/search?q=" + $scope.searchDapp.searchForDapp + "&installed=1").then(function (response) {
                        console.log("here");
                        $scope.dapps = response.data.dapps;
                        $scope.searchDapp.inSearch=false;
                        $scope.view.inLoading = false;
                        $scope.searchedText = '(search for "' + $scope.searchDapp.searchForDapp + '")';
                    });
                }
                else {
                    $http.get("/api/dapps/installed").then(function (response) {
                        $scope.dapps = response.data.dapps;
                        $scope.searchedText = '';
                        $scope.view.inLoading = false;
                    });
                }
            }
            else {
                if ($scope.searchDapp.searchForDapp.trim() != '') {
                    $http.get("/api/dapps/search?q=" + $scope.searchDapp.searchForDapp + "&category=" + $scope.category).then(function (response) {
                        $scope.dapps = response.data.dapps;
                        $scope.searchDapp.inSearch = false;
                        $scope.view.inLoading = false;
                        $scope.searchedText = '(search for "' + $scope.searchDapp.searchForDapp + '")';
                    });
                }
                else {
                    $http.get("/api/dapps/?category=" + $scope.category).then(function (response) {
                        $scope.dapps = response.data.dapps;
                        $scope.searchDapp.inSearch = false;
                        $scope.searchedText = '';
                        $scope.view.inLoading = false;
                    });
                }
            }
        };

        $scope.searchDappText();
    }]);