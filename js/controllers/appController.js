require('angular');
var compareVersion = require('../../node_modules/compare-version/index.js');
var ip = require('ip');
var ipRegex = require('ip-regex');

angular.module('webApp').controller('appController', ['$scope', '$rootScope', '$http', "userService", "$interval", "$timeout", 'viewFactory', '$state', 'serverSocket', '$window',  'peerFactory', 'dbFactory', 'dappsService',
    function ($rootScope, $scope, $http, userService, $interval, $timeout, viewFactory, $state, serverSocket,  $window, peerFactory, dbFactory, dappsService) {
        $rootScope.modalIsOpen = false;
        $scope.inError = false;
        $scope.searchDapp = dappsService;
        $scope.dbCompact = $interval(function () {
            dbFactory.compact(function (resp) {
            });
        }, 5 * 6 * 10 * 1000);

        $scope.$on('start-interval', function (event, args) {
            $scope.peerCheking = $interval(function () {
                $scope.checkPeer()
            }, 10000);
        });

        $scope.getCategoryName = function (id) {
            for (var key in $scope.categories) {
                if ($scope.categories.hasOwnProperty(key)) {
                    if (id == $scope.categories[key]) {
                        return key.toString();
                    }
                }
            }
        };

        $scope.getCategories = function () {
            $http.get(peerFactory.getUrl() + "/api/dapps/categories").then(function (response) {
                if (response.data.success) {
                    $scope.categories = response.data.categories;
                }
                else {
                    $scope.categories = {};
                }
            });

        };

        $scope.toggleSearchDapps = function () {
            $scope.view.bar.searchDapps = !$scope.view.bar.searchDapps;
            $scope.searchDapp.searchForDappGlobal = '';
        };

        $scope.checkPeer = function () {
            peerFactory.checkPeer(peerFactory.getUrl(), function (resp) {
                if (resp.status != 200) {
                    if ($scope.inError) {
                        var setBestPeer = function () {
                            dbFactory.getRandom(10, function () {
                                var key = (Math.floor((Math.random() * 10) + 1) - 1);
                                peerFactory.checkPeer(dbFactory.randomList[key].doc.url, function (resp) {
                                    if (resp.status == 200) {
                                        peerFactory.setPeer(ip.fromLong(dbFactory.randomList[key].id), dbFactory.randomList[key].doc.port);
                                        $scope.peerexists = true;
                                        $('#soketIoScript').remove();
                                        (function (d, script) {
                                            script = d.createElement('script');
                                            script.id = "soketIoScript";
                                            script.type = 'text/javascript';
                                            script.async = true;
                                            script.onload = function () {
                                                serverSocket.newPeer();
                                            };
                                            script.src = peerFactory.getUrl() + '/socket.io/socket.io.js';
                                            d.getElementsByTagName('head')[0].appendChild(script);
                                        }(document));


                                    }
                                    else {
                                        dbFactory.delete(dbFactory.randomList[key].id, function () {
                                            setBestPeer();
                                        });
                                    }
                                })
                            });
                        }();
                    }
                    else {
                        $scope.inError = true;
                    }
                }
                else {
                    $scope.inError = false;
                }
            });
        };

        $scope.peerCheking = $interval(function () {
            $scope.checkPeer()
        }, 10000);

        $scope.$on('$destroy', function () {
            $interval.cancel($scope.peerCheking);
            $interval.cancel($scope.dbCompact);
        });

        $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;
        $scope.xcr_usd = 0;
        $scope.version = 'ersion load';
        $scope.diffVersion = 0;
        $scope.subForgingCollapsed = true;

        $scope.collapseMenu = function () {
            $scope.subForgingCollapsed = !$scope.subForgingCollapsed;
        }

        $scope.toggleMenu = function () {
            $scope.toggled = !$scope.toggled;
        }

        $scope.moreDropdownStatus = {
            isopen: false
        };
        $scope.moreNotificationsStatus = {
            isopen: false
        };

        $scope.moreDownTable = {
            isopen: false
        };

        $scope.contacts = {
            count: 0,
            list: []
        };

        $scope.toggleDropdown = function ($event) {

        };

        $scope.toggled = function (open) {
            if ($scope.checked) {
                $scope.moreDownTable.isopen = true;
            }
        }
        $scope.checked = false;
        $scope.check = function ($event) {
            $event.stopPropagation();
            $scope.checked = true;
        }


        $scope.syncState = 1;
        $scope.loading = {
            labels: ['Total', 'Loaded'],
            values: [0, 100],
            colours: ['#1976d2', '#ffffff'],
            options: {
                percentageInnerCutout: 90,
                animationEasing: "linear",
                segmentShowStroke: false,
                showTooltips: false
            }
        };
        $scope.view = viewFactory;

        $scope.modules = [
            'main.dashboard',
            'main.dappstore'
        ];

        $scope.getUSDPrice = function () {
            $http.get("//146.148.61.64:4060/api/1/ticker/XCR_BTC")
                .then(function (response) {
                    var xcr_btc = response.data.last;
                    $http.get("http://146.148.61.64:4060/api/1/ticker/BTC_USD")
                        .then(function (response) {
                            $scope.xcr_usd = xcr_btc * response.data.last;
                        });
                });
        };

        $scope.getVersion = function () {
            $http.get(peerFactory.getUrl() + "/api/peers/version").then(function (response) {
                if (response.data.success) {
                    $scope.version = response.data.version;
                    $http.get("https://wallet.crypti.me/api/peers/version").then(function (response) {
                        $scope.latest = response.data.version;
                        $scope.diffVersion = compareVersion($scope.version, $scope.latest);
                    });
                }
                else {
                    $scope.diffVersion = -1;
                    $scope.version = 'ersion error';
                }
            });
        };

        $scope.convertToUSD = function (xcr) {
            return (xcr / 100000000) * $scope.xcr_usd;
        };

        $scope.getAppData = function () {
            $http.get(peerFactory.getUrl() + "/api/accounts", {params: {address: userService.address}})
                .then(function (resp) {
                    var account = resp.data.account;
                    if (!account) {
                        userService.balance = 0;
                        userService.unconfirmedBalance = 0;
                        userService.secondPassphrase = '';
                        userService.unconfirmedPassphrase = '';
                        userService.username = '';
                    }
                    else {
                        userService.balance = account.balance;
                        userService.unconfirmedBalance = account.unconfirmedBalance;
                        userService.secondPassphrase = account.secondSignature;
                        userService.unconfirmedPassphrase = account.unconfirmedSignature;
                        userService.username = account.username;
                    }
                    $scope.username = userService.username;
                    $scope.balance = userService.balance;
                    $scope.unconfirmedBalance = userService.unconfirmedBalance;
                    $scope.secondPassphrase = userService.secondPassphrase;
                    $scope.unconfirmedPassphrase = userService.unconfirmedPassphrase;
                    $scope.delegateInRegistration = userService.delegateInRegistration;
                    $scope.getVersion();
                    $scope.getCategories();
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }

                });
        };

        $scope.sendCrypti = function (to) {
            $rootScope.modalIsOpen = true;
            to = to || '';
            $scope.sendCryptiModal = sendCryptiModal.activate({
                totalBalance: $scope.unconfirmedBalance,
                to: to,
                destroy: function () {
                    $rootScope.modalIsOpen = false;
                }
            });
        }

        $scope.getSync = function () {
            $http.get(peerFactory.getUrl() + "/api/loader/status/sync").then(function (resp) {
                if (resp.data.success) {
                    $scope.syncState = resp.data.sync ? (resp.data.blocks ? (Math.floor((resp.data.height / resp.data.blocks) * 100)) : 0) : 0;
                    if ($scope.syncState) {
                        $scope.loading.values = [(resp.data.height - resp.data.blocks) < 0 ? (0 - (resp.data.height - resp.data.blocks)) : (resp.data.height - resp.data.blocks), resp.data.blocks];
                    }
                }
            });
        }


        $scope.syncInterval = $interval(function () {
            $scope.getSync();
        }, 1000 * 30);

        $scope.getSync();

        $scope.showMenuItem = function (state) {
            return $scope.modules.indexOf(state) != -1;
        }

        $scope.goToPrevios = function () {
            $state.go($scope.view.page.previos);
        }

        $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {

            });
        $rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {

            });

        $scope.$on('socket:transactions/change', function (ev, data) {
            $scope.getAppData();
            $scope.updateViews([$state.current.name]);
        });
        $scope.$on('socket:blocks/change', function (ev, data) {
            $scope.getAppData();
            $scope.updateViews([$state.current.name]);
        });
        $scope.$on('socket:delegates/change', function (ev, data) {
            $scope.getAppData();
            $scope.updateViews([$state.current.name]);
        });
        $scope.$on('socket:contacts/change', function (ev, data) {
            $scope.getAppData();
            $scope.updateViews([$state.current.name]);
        });
        $scope.$on('socket:followers/change', function (ev, data) {
            $scope.getAppData();
            $scope.updateViews([$state.current.name]);
        });
        $scope.$on('socket:dapps/change', function (ev, data) {
            $scope.updateViews([
                'main.dapps'
            ]);
        });

        $window.onfocus = function () {
            $scope.getAppData();
            $scope.updateViews([$state.current.name]);
        }

        $scope.updateViews = function (views) {
            $scope.$broadcast('updateControllerData', views);
        }

        $scope.getAppData();
        $scope.getUSDPrice();
    }]);