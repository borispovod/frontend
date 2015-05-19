require('angular');


angular.module('webApp').controller('appController', ['$scope', '$rootScope', '$http', "userService", "$interval", 'viewFactory', '$state', 'sendCryptiModal', 'registrationDelegateModal', 'userSettingsModal', 'serverSocket', 'delegateService', '$window', 'forgingModal', 'contactsService', 'addContactModal',
    function ($rootScope, $scope, $http, userService, $interval, viewFactory, $state, sendCryptiModal, registrationDelegateModal, userSettingsModal, serverSocket, delegateService, $window, forgingModal, contactsService, addContactModal) {

        $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;
        $scope.xcr_usd = 0;

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


        $scope.sync = 1;
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
            $http.get("http://146.148.61.64:4060/api/1/ticker/XCR_BTC")
                .then(function (response) {
                    var xcr_btc = response.data.last;
                    $http.get("http://146.148.61.64:4060/api/1/ticker/BTC_USD")
                        .then(function (response) {
                            $scope.xcr_usd = xcr_btc * response.data.last;
                        });
                });
        };

        $scope.convertToUSD = function (xcr) {
            return (xcr / 100000000) * $scope.xcr_usd;
        }

        $scope.getAppData = function () {
            $http.get("/api/accounts", {params: {address: userService.address}})
                .then(function (resp) {
                    var account = resp.data.account;
                    userService.balance = account.balance / 100000000;
                    userService.unconfirmedBalance = account.unconfirmedBalance / 100000000;
                    userService.secondPassphrase = account.secondSignature;
                    userService.unconfirmedPassphrase = account.unconfirmedSignature;
                    userService.username = account.username;
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
                });
        }

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
                if ($scope.delegateInRegistration) {
                    $scope.delegateInRegistration = !(!!response);
                    userService.setDelegateProcess($scope.delegateInRegistration);
                }
                $scope.delegate = response;
                userService.setDelegate($scope.delegate);

            });
        }

        $scope.getSync = function () {
            $http.get("/api/loader/status/sync").then(function (resp) {
                if (resp.data.success) {
                    $scope.sync = resp.data.sync ? (resp.data.height / resp.data.blocks) * 100 : resp.data.sync;
                    $scope.loading.values = [resp.data.height - resp.data.blocks, resp.data.blocks];

                }
            });
        }

        $scope.getMyVotesCount = function () {
            $http.get("/api/accounts/delegates/", {params: {address: userService.address}})
                .then(function (response) {
                    $scope.myVotesCount = response.data.delegates ? response.data.delegates.length : 0;
                });
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
            $scope.updateViews(['account']);
        });
        $scope.$on('socket:blocks/change', function (ev, data) {
            $scope.getAppData();
            $scope.updateViews(['account', 'blockchain', 'transactions', 'forging']);
        });
        $scope.$on('socket:delegates/change', function (ev, data) {
            $scope.getAppData();

            $scope.updateViews(['forging']);
        });

        $window.onfocus = function () {
            $scope.getAppData();
            $scope.updateViews(['account', 'blockchain']);
        }

        $scope.updateViews = function (views) {
            $scope.$broadcast('updateControllerData', views);
        }

        $scope.getAppData();
        $scope.getUSDPrice();
    }]);