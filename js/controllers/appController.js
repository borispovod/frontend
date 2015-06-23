require('angular');
var compareVersion = require('../../node_modules/compare-version/index.js');

angular.module('webApp').controller('appController', ['$scope', '$rootScope', '$http', "userService", "$interval", "$timeout", 'viewFactory', '$state', 'blockService', 'sendCryptiModal', 'registrationDelegateModal', 'userSettingsModal', 'serverSocket', 'delegateService', '$window', 'forgingModal', 'contactsService', 'addContactModal', 'userInfo', 'transactionsService', 'secondPassphraseModal',
    function ($rootScope, $scope, $http, userService, $interval, $timeout, viewFactory, $state, blockService, sendCryptiModal, registrationDelegateModal, userSettingsModal, serverSocket, delegateService, $window, forgingModal, contactsService, addContactModal, userInfo, transactionsService, secondPassphraseModal) {

        $scope.searchTransactions = transactionsService;
        $scope.searchBlocks = blockService;
        $scope.toggled = false;
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
            'main.delegates',
            'main.transactions',
            'main.votes',
            'main.forging',
            'main.blockchain',
            'passphrase',
            'main.contacts'

        ];

        $scope.getUSDPrice = function () {
            $http.get("//146.148.61.64:4060/api/1/ticker/XCR_BTC")
                .then(function (response) {
                    var xcr_btc = response.data.last;
                    $http.get("//146.148.61.64:4060/api/1/ticker/BTC_USD")
                        .then(function (response) {
                            $scope.xcr_usd = xcr_btc * response.data.last;
                        });
                });
        };

        $scope.getVersion = function () {
            $http.get("/api/peers/version").then(function (response) {
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
            $http.get("/api/accounts", {params: {address: userService.address}})
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
                    $scope.getForging();
                    $scope.getDelegate();
                    $scope.getMyVotesCount();
                    $scope.getContacts();
                    $scope.getVersion();

                });
        };

        $scope.sendCrypti = function (to) {
            to = to || '';
            $scope.sendCryptiModal = sendCryptiModal.activate({
                totalBalance: $scope.unconfirmedBalance,
                to: to,
                destroy: function () {
                }
            });
        }

        $scope.addContact = function (contact) {
            contact = contact || "";
            $scope.addContactModal = addContactModal.activate({
                contact: contact,
                destroy: function () {
                }
            });
        }

        $scope.setSecondPassphrase = function () {
            $scope.addSecondPassModal = secondPassphraseModal.activate({
                totalBalance: $scope.unconfirmedBalance,
                destroy: function () {
                }
            });
        }

        $scope.enableForging = function () {
            if ($scope.rememberedPassword) {
                $http.post("/api/delegates/forging/enable", {
                    secret: $scope.rememberedPassword,
                    publicKey: userService.publicKey
                })
                    .then(function (resp) {
                        userService.setForging(resp.data.success);
                        $scope.forging = resp.data.success;
                    });


            }
            else {
                $scope.forgingModal = forgingModal.activate({
                    forging: false,
                    totalBalance: userService.unconfirmedBalance,
                    destroy: function () {
                        $scope.forging = userService.forging;
                        $scope.getForging();
                    }
                })
            }
        }

        $scope.disableForging = function () {
            if ($scope.rememberedPassword) {

                $scope.error = null;

                $http.post("/api/delegates/forging/disable", {
                    secret: $scope.rememberedPassword,
                    publicKey: userService.publicKey
                })
                    .then(function (resp) {
                        userService.setForging(!resp.data.success);
                        $scope.forging = !resp.data.success;
                    });
            }
            else {
                $scope.forgingModal = forgingModal.activate({
                    forging: true,
                    totalBalance: userService.unconfirmedBalance,
                    destroy: function () {
                        $scope.forging = userService.forging;
                        $scope.getForging();
                    }
                })
            }
        }

        $scope.getForging = function () {
            $http.get("/api/delegates/forging/status", {params: {publicKey: userService.publicKey}})
                .then(function (resp) {
                    $scope.forging = resp.data.enabled;
                    userService.setForging($scope.forging);
                });
        }

        $scope.getContacts = function () {
            contactsService.getContacts(userService.publicKey, function () {
                $scope.contacts = {
                    count: contactsService.count,
                    followersCount: contactsService.followersCount,
                    list: contactsService.list
                };
            });
        }

        $scope.registrationDelegate = function () {
            $scope.registrationDelegateModal = registrationDelegateModal.activate({
                totalBalance: userService.unconfirmedBalance,
                destroy: function () {
                    $scope.delegateInRegistration = userService.delegateInRegistration;
                    $scope.getDelegate();
                }
            })
        }

        $scope.userSettings = function () {
            $scope.userSettingsModal = userSettingsModal.activate({
                destroy: function () {
                }
            });
        }

        $scope.getDelegate = function () {
            delegateService.getDelegate(userService.publicKey, function (response) {
                if (response.username && !$scope.username) {
                    $scope.username = response.username;
                    userService.username = response.username;

                }
                if ($scope.delegateInRegistration) {
                    $scope.delegateInRegistration = !(!!response);
                    userService.setDelegateProcess($scope.delegateInRegistration);
                }
                $scope.delegate = response;
                userService.setDelegate($scope.delegate);
                if (!response.noDelegate) {
                    $http.get("/api/transactions", {
                        params: {
                            senderPublicKey: userService.publicKey,
                            limit: 1,
                            type: 2
                        }
                    }).then(function (response) {
                        if (response.data.success) {
                            userService.setDelegateTime(response.data.transactions);
                        }
                        else {
                            userService.setDelegateTime([{timestamp: null}]);
                        }
                    });
                }
            });
        }

        $scope.getSync = function () {
            $http.get("/api/loader/status/sync").then(function (resp) {
                if (resp.data.success) {
                    $scope.syncState = resp.data.sync ? (resp.data.blocks ? (Math.floor((resp.data.height / resp.data.blocks) * 100)) : 0) : 0;
                    if ($scope.syncState) {
                        $scope.loading.values = [(resp.data.height - resp.data.blocks) < 0 ? (0 - (resp.data.height - resp.data.blocks)) : (resp.data.height - resp.data.blocks), resp.data.blocks];
                    }
                }
            });
        }

        $scope.getMyVotesCount = function () {
            $http.get("/api/accounts/delegates/", {params: {address: userService.address}})
                .then(function (response) {
                    $scope.myVotesCount = response.data.delegates ? response.data.delegates.length : 0;
                });
        }

        $scope.myUserInfo = function () {
            $scope.modal = userInfo.activate({userId: userService.address});
        }

        $scope.syncInterval = $interval(function () {
            $scope.getSync();
        }, 1000 * 30);

        $scope.getSync();
        $scope.getDelegate();

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
            console.log('new blocks ' + new Date());
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