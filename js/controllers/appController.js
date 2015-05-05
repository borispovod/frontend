require('angular');

angular.module('webApp').controller('appController', ['$scope', '$rootScope', '$http', "userService", "$interval", 'viewFactory', '$state', 'sendCryptiModal', 'registrationDelegateModal', 'userSettingsModal', 'serverSocket', 'delegateService', '$window',
    function ($rootScope, $scope, $http, userService, $interval, viewFactory, $state, sendCryptiModal, registrationDelegateModal, userSettingsModal, serverSocket, delegateService, $window) {

        $scope.moreDropdownStatus = {
            isopen: false
        };
        $scope.moreNotificationsStatus = {
            isopen: false
        };

        $scope.moreDownTable = {
            isopen: false
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


        $scope.syncBlocks = 71;
        $scope.loading = {
            labels: ['Total', 'Loaded'],
            values: [29, 71],
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
            'passphrase'

        ];

        $scope.getAccount = function () {
            $http.get("/api/accounts", {params: {address: userService.address}})
                .then(function (resp) {
                    var account = resp.data.account;
                    userService.balance = account.balance / 100000000;
                    userService.unconfirmedBalance = account.unconfirmedBalance / 100000000;
                    userService.secondPassphrase = account.secondSignature;
                    userService.unconfirmedPassphrase = account.unconfirmedSignature;
                    $scope.balance = userService.balance;
                    $scope.unconfirmedBalance = userService.unconfirmedBalance;
                    $scope.secondPassphrase = userService.secondPassphrase;
                    $scope.unconfirmedPassphrase = userService.unconfirmedPassphrase;
                    $scope.delegateInRegistration = userService.delegateInRegistration;
                });
        }

        $scope.sendCrypti = function () {
            $scope.sendCryptiModal = sendCryptiModal.activate({
                totalBalance: $scope.unconfirmedBalance,
                destroy: function () {
                }
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
                var totalDelegates = 108;
                var rank = response.rate;

                $scope.graphs.rank.values = [totalDelegates - rank, totalDelegates - 1 - (totalDelegates - rank)];
                if (($scope.rank == 0 && rank != 0) || ($scope.rank > 50 && rank <= 50) || ($scope.rank > 101 && rank <= 101) || ($scope.rank <= 50 && rank > 50)) {
                    $scope.graphs.rank.colours = [rank <= 50 ? '#7cb342' : (rank > 101 ? '#d32f2f' : '#ffa000'), '#f5f5f5'];
                }
                $scope.rank = rank;


                var uptime = parseFloat(response.productivity);

                $scope.graphs.uptime.values = [uptime, 100 - uptime];
                if (($scope.uptime == 0 && uptime > 0) || ($scope.uptime >= 95 && uptime < 95) || ($scope.uptime >= 50 && uptime < 50)) {
                    $scope.graphs.uptime.colours = [uptime >= 95 ? '#7cb342' : (uptime >= 50 ? '#ffa000' : '#d32f2f'), '#f5f5f5'];
                }
                $scope.uptime = response.productivity;


                var approval = $scope.getApproval(response.vote);

                $scope.graphs.approval.values = [approval, $scope.getApproval($scope.allVotes) - approval];
                if (($scope.approval == 0 && approval > 0) || ($scope.approval >= 95 && approval < 95) || ($scope.approval >= 50 && approval < 50)) {
                    $scope.graphs.approval.colours = [approval >= 95 ? '#7cb342' : (approval >= 50 ? '#ffa000' : '#d32f2f'), '#f5f5f5'];
                }
                $scope.approval = approval;

            });
        }

        $scope.getSync = function () {
            $http.get("/api/loader/status/sync").then(function (resp) {
                if (resp.data.success) {
                    /*  $scope.sync = resp.data.sync ? (resp.data.height / resp.data.blocks) * 100 : resp.data.sync;
                     $scope.loading.values = [resp.data.height - resp.data.blocks, resp.data.blocks];*/

                }
            });
        }

        $scope.syncInterval = $interval(function () {
            $scope.getSync();
            $scope.getDelegate();
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

        $scope.$on('socket:transactions', function (ev, data) {
            $scope.getAccount();
            $scope.updateViews(['account']);
        });
        $scope.$on('socket:blocks', function (ev, data) {
            $scope.getAccount();
        });
        $scope.$on('socket:delegates', function (ev, data) {
            $scope.getAccount();
        });

        $window.onfocus = function () {
            $scope.getAccount();
            $scope.updateViews(['account']);
        }

        $scope.updateViews = function(views) {
            $scope.$broadcast('updateControllerData', views);
        }

        $scope.getAccount();
    }]);