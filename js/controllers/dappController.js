require('angular');
angular.module('webApp').controller('dappController', ['$scope', 'viewFactory', '$stateParams', '$http', "$interval", "userService", "errorModal",
    function ($scope, viewFactory, $stateParams, $http, $interval, userService, errorModal) {
        $scope.view = viewFactory;
        $scope.view.inLoading = true;
        $scope.view.loadingText = "Loading dapp";
        $scope.loading = true;
        $scope.installed = false;
        $scope.showSiaInstall = false;

        $scope.getTags = function () {
            try {
                return $scope.dapp.tags.split(',');
            }
            catch (err) {
                return []
            }
        }

        $http.get('/api/dapps/siaenabled').then(function (response) {
            if (response.data.success) {
                $scope.showSiaInstall = response.data.enabled || $scope.dapp.siaAscii.trim()=="";
            }
        })

        $scope.isInstalled = function () {
            $http.get('/api/dapps/installedIds').then(function (response) {
                $scope.installed = (response.data.ids.indexOf($stateParams.dappId) >= 0);
                $scope.loading = false;
                console.log("Loading: false");
            });
        }

        $scope.installingIds = [];
        $scope.removingIds = [];
        $scope.launchedIds = [];

        $scope.isInstalling = function () {
            return ($scope.installingIds.indexOf($stateParams.dappId) >= 0);
        }
        $scope.isLaunched = function () {
            return ($scope.launchedIds.indexOf($stateParams.dappId) >= 0);
        }
        $scope.isRemoving = function () {
            return ($scope.removingIds.indexOf($stateParams.dappId) >= 0);
        }

        $scope.getInstalling = function () {
            $http.get("/api/dapps/installing").then(function (response) {
                if (response.data.success) {
                    $scope.installingIds = response.data.installing;
                }
            });
        };
        $scope.getRemoving = function () {
            $http.get("/api/dapps/removing").then(function (response) {
                if (response.data.success) {
                    $scope.removingIds = response.data.removing;
                }
            });
        };
        $scope.getLaunched = function () {
            $http.get("/api/dapps/launched").then(function (response) {
                if (response.data.success) {
                    $scope.launchedIds = response.data.launched;
                }
            });
        };

        //previos != previous :)
        $scope.view.page = {title: '', previos: 'main.dappstore'};
        $scope.view.bar = {};
        $scope.showMore = false;
        $scope.changeShowMore = function () {
            $scope.showMore = !$scope.showMore;
        };
        $http.get("/api/dapps/get?id=" + $stateParams.dappId).then(function (response) {
            $scope.dapp = response.data.dapp;
            if ($scope.dapp.git) {
                $scope.dapp.githublink = $scope.githubLink($scope.dapp.git);
                console.log($scope.githublink);
            }
            $scope.view.page = {title: $scope.dapp.name, previos: 'main.dappstore'};
            $scope.view.inLoading = false;
        });

        $scope.installDapp = function () {
            $scope.installingIds.push($stateParams.dappId);
            $http.post("/api/dapps/install", {
                "id": $stateParams.dappId
            }).then(function (response) {
                $scope.getInstalling();
                $scope.getLaunched();
                $scope.getRemoving();
                if (response.data.success == true) {
                    $scope.installed = true;
                    if ($scope.dapp.type == 1) {
                        $scope.openDapp();
                    }
                }
                else {
                    $scope.errorModal = errorModal.activate({
                        error: resp.data.error,
                        destroy: function () {

                        }
                    })
                }
            });
        }

        $scope.githubLink = function (git) {
            //git@github.com:crypti/cryptipad.git
            return git.replace("git@", "https://").replace(".com:", ".com/").replace('.git', '');
        }


        $scope.runDApp = function (type) {
            // open dapp
            if (type == 1) {
                $scope.openDapp();
            }
            else {
                $http.post("/api/dapps/launch", {
                    "params": [userService.rememberPassword],
                    "id": $stateParams.dappId
                }).then(function (response) {
                    $scope.getInstalling();
                    $scope.getLaunched();
                    $scope.getRemoving();
                    if (response.data.success == true) {
                        $scope.openDapp();
                    }
                });
            }
        }

        $scope.openDapp = function () {
            // open dapp
            if ($scope.dapp.type == 1) {
                var link = angular.element('<a href="' + $scope.dapp.link + '" target="_blank"></a>');
            }
            else {
                var link = angular.element('<a href="' +
                    '/dapps/' + $stateParams.dappId + '" target="_blank"></a>');
            }
            angular.element(document.body).append(link);
            link[0].style.display = "none";
            link[0].click();
            link.remove();
        }

        $scope.isInstalled();

        $scope.getInstalling();
        $scope.getLaunched();
        $scope.getRemoving();

        $scope.$on('$destroy', function () {
            $interval.cancel($scope.stateDappInterval);
        });

        $scope.$on('updateControllerData', function (event, data) {
            if (data.indexOf('main.dapps') != -1) {
                $scope.getInstalling();
                $scope.getLaunched();
                $scope.getRemoving();
            }
        });

    }]);