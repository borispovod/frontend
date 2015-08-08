require('angular');

angular.module('webApp').controller('addDappModalController', ["$scope", "$http", "addDappModal", "userService", "viewFactory",
    function ($scope, $http, addDappModal, userService, viewFactory) {
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
            $scope.errorMessage = "";
            if ($scope.secondPassphrase && !withSecond) {
                $scope.checkSecondPass = true;
                $scope.focus = 'secondPhrase';
                return;
            }
            pass = pass || $scope.secretPhrase;

            $scope.view.inLoading = true;

            $scope.newDapp.secret = pass;
            $scope.newDapp.category = $scope.newDapp.category || 0;

            if ($scope.secondPassphrase) {
                $scope.newDapp.secondSecret = $scope.secondPhrase;
                if ($scope.rememberedPassword) {
                    $scope.newDapp.secret = $scope.rememberedPassword;
                }
            }

            $http.put('/api/dapps', $scope.newDapp).then(function (response) {
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