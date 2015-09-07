require('angular');

angular.module('webApp').controller('dappsController', ['$scope', 'viewFactory', '$http', 'dappsService', '$timeout', 'addDappModal', "$interval", "peerFactory",
    function ($scope, viewFactory, $http, dappsService, $timeout, addDappModal, $interval, peerFactory) {
        $scope.view = viewFactory;
        $scope.view.inLoading = true;
        $scope.view.loadingText = "Loading dapps";
        $scope.view.page = {title: 'Dapp Store', previos: null};
        $scope.view.bar = {showDappsBar: true, searchDapps: false, showCategories: false};
        $scope.searchDapp = dappsService;
        $scope.searchDapp.searchForDappGlobal = '';
        $scope.searchDapp.inSearch = false;
        $scope.showPlaceholder = false;

        $scope.getImageUrl = function (url) {
            return peerFactory.getUrl() + url;
        }

        $scope.getImageSia = function (transactionId) {
            return peerFactory.getUrl() + '/api/dapps/icon?id=' + transactionId;
        }

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

        $scope.addNewDapp = function () {
            $scope.addDappModal = addDappModal.activate({
                destroy: function () {
                }
            });
        }

        $scope.searchedText = '';
        $scope.searchedInstalledText = '';

        $scope.searchDappText = function () {
            if ($scope.searchDapp.searchForDappGlobal.trim() == '') {

                $http.get(peerFactory.getUrl() + "/api/dapps?type=1").then(function (response) {
                    $scope.dapps = response.data.dapps;
                    $scope.searchedText = '';
                    $scope.view.inLoading = false;
                });
                /*$http.get(peerFactory.getUrl() + "/api/dapps/installed").then(function (response) {
                    $scope.installedDapps = response.data.dapps;
                    $scope.searchedInstalledText = '';
                        $scope.showPlaceholder = !response.data.success ? true : !response.data.length;

                });*/

            }
            else {
                $http.get(peerFactory.getUrl() + "/api/dapps/search?q=" + $scope.searchDapp.searchForDappGlobal).then(function (response) {
                    $scope.dapps = response.data.dapps;
                    $scope.searchDapp.inSearch = false;
                    $scope.view.inLoading = false;
                    $scope.searchedText = '(search for "' + $scope.searchDapp.searchForDappGlobal + '")';
                });
                if (!$scope.showPlaceholder) {
                    $http.get(peerFactory.getUrl() + "/api/dapps/search?q=" + $scope.searchDapp.searchForDappGlobal + "&installed=1").then(function (response) {
                        $scope.installedDapps = response.data.dapps;
                        $scope.searchedInstalledText = '(search for "' + $scope.searchDapp.searchForDappGlobal + '")';
                    });
                }
            }

        };

        $scope.$on('updateControllerData', function (event, data) {
            if (data.indexOf('main.dapps') != -1) {
                $scope.searchDappText();
            }
        });

        $scope.searchDappText();
    }])
;