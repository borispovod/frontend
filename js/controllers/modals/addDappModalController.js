require('angular');

angular.module('webApp').controller('addDappModalController', ["$scope", "$http", "addDappModal", "userService", "viewFactory", "peerFactory",
    function ($scope, $http, addDappModal, userService, viewFactory, peerFactory) {
        $scope.view = viewFactory;
        $scope.view.loadingText = "Saving new dapp";
        $scope.secondPassphrase = userService.secondPassphrase;
        $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;
        $scope.passmode = false;
        $scope.errorMessage = "";
        $scope.checkSecondPass = false;


        $scope.close = function () {
            addDappModal.deactivate();
        }


        $scope.passcheck = function (fromSecondPass) {
            $scope.errorMessage = "";
            if (fromSecondPass) {
                $scope.checkSecondPass = false;
                $scope.passmode = $scope.rememberedPassword ? false : true;
                $scope.secondPhrase = '';
                $scope.secretPhrase = '';
                return;
            }
            if ($scope.rememberedPassword) {
                $scope.sendData($scope.rememberedPassword);
            }
            else {
                $scope.passmode = !$scope.passmode;
                if ($scope.passmode) {
                    $scope.focus = 'secretPhrase';
                }
                $scope.secretPhrase = '';
            }
        }

        $scope.newDapp = {
            name: "",
            description: "",
            category: 0,
            type: 0,
            tags: "",
            git: "",
            siaAscii: "",
            siaIcon: "",
            icon: ""
        };
        $scope.sendData = function (pass, withSecond) {
            var data = {
                name: $scope.newDapp.name,
                description: $scope.newDapp.description,
                category: $scope.newDapp.category,
                type: $scope.newDapp.type,
                tags: $scope.newDapp.tags,
            }
            if (!!$scope.urlSiaMode || $scope.newDapp.icon.trim() == '') {
            }
            else {
                data.icon = $scope.newDapp.icon.trim();
            }

            if (!$scope.urlSiaMode || $scope.newDapp.siaIcon.trim() == '') {
            }
            else {
               data.siaIcon =  $scope.newDapp.siaIcon.trim();
            }

            if ($scope.repository == 'sia' || $scope.newDapp.git.trim() == '') {
            }
            else {
                data.git =  $scope.newDapp.git.trim();
            }

            if ($scope.repository != 'sia' || $scope.newDapp.siaAscii.trim() == '') {
            }
            else {
                data.siaAscii = $scope.newDapp.siaAscii.trim();
            }

            $scope.errorMessage = "";
            if ($scope.secondPassphrase && !withSecond) {
                $scope.checkSecondPass = true;
                $scope.focus = 'secondPhrase';
                return;
            }
            pass = pass || $scope.secretPhrase;

            $scope.view.inLoading = true;

            data.secret = pass;
            data.category = $scope.newDapp.category || 0;

            if ($scope.secondPassphrase) {
                data.secondSecret = $scope.secondPhrase;
                if ($scope.rememberedPassword) {
                    data.secret = $scope.rememberedPassword;
                }
            }


            var crypti = require('crypti-js');
            var sendTransaction;

            sendTransaction = crypti.dapp.createDapp(data.secret, data.secondSecret, data);

            var checkBeforSending = transactionService.checkTransaction(sendTransaction, data.secret);

            if (checkBeforSending.err) {
                $scope.errorMessage = checkBeforSending.message;
                return;
            }

            $http.put(peerFactory.getUrl() + "/peer/transactions",
                {transaction: sendTransaction},
                transactionService.createHeaders()).then(function (response) {
                $scope.view.inLoading = false;
                if (response.data.error) {
                    $scope.errorMessage = response.data.error;
                }
                else {
                    if ($scope.destroy) {
                        $scope.destroy();
                    }
                    addDappModal.deactivate();
                }

            });
        }
        $scope.goToStep4 = function () {
            $scope.errorMessage = "";
            $scope.step = 4;
        }

        $scope.goToStep3 = function (invalid) {
            if ($scope.dapp_data_form.$valid) {
                $scope.dapp_data_form.submitted = false;
                $scope.step = 3;
            } else {
                $scope.dapp_data_form.submitted = true;
            }
        }

        $scope.urlSiaMode = 0;

        $scope.changeUrlSiaMode = function () {
            $scope.urlSiaMode = $scope.urlSiaMode ? 0 : 1;
        }

        $scope.getUlrSiaText = function () {
            return $scope.urlSiaMode ? 'change to url link' : 'change to SIA ASCII';
        }


        $scope.goToStep2 = function () {

            $scope.step = 2;
        }

        $scope.step = 1;

        $scope.repository = 'sia';

        $scope.getRepositoryText = function () {
            return $scope.repository == 'sia' ? $scope.newDapp.siaAscii : $scope.newDapp.git;
        }

        $scope.getRepositoryName = function () {
            return $scope.repository == 'sia' ? 'SIA' : 'GIT';
        }
        $scope.selectRepository = function (name) {
            $scope.repository = name;
        }
    }]);