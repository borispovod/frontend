require('angular');
var ip = require('ip');
var ipRegex = require('ip-regex');

angular.module('webApp').controller('passphraseController', ['$scope', '$rootScope', '$http', "$state", "userService", "newUser", "peerFactory", "dbFactory", "$interval", "stBlurredDialog", "transactionService",
    function ($rootScope, $scope, $http, $state, userService, newUser, peerFactory, dbFactory, $interval, stBlurredDialog, transactionService) {
        userService.setData();
        userService.rememberPassword = false;
        userService.rememberedPassword = '';
        $scope.rememberPassword = true;
        $scope.errorMessage = "";

        $scope.getPeers = function (cb) {
            peerFactory.peerList.forEach(function (peer) {
                peerFactory.setPeer(peer.ip, peer.port);
                dbFactory.add({ip: ip.toLong(peer.ip).toString(), port: peer.port});
                $http.get("http://" + peer.ip + ':' + peer.port + "/peer/list", transactionService.createHeaders())
                    .then(function (resp) {
                        //console.log(resp);
                        resp.data.peers.forEach(function (peer) {
                            if (peer.sharePort) {
                                dbFactory.add(peer);
                            }
                        });
                        cb();
                    });
            });
        }

        $scope.setBestPeer = function () {
            dbFactory.emptydb(function (empty) {
                if (empty) {
                    console.log('empty peer list');
                }
                else {
                    dbFactory.getRandom(10, function () {
                        var key = (Math.floor((Math.random() * 10) + 1) - 1);
                        // console.log(dbFactory.randomList);
                        peerFactory.checkPeer(dbFactory.randomList[key].key.url, function (resp) {
                            if (resp.status == 200) {
                                peerFactory.setPeer(ip.fromLong(dbFactory.randomList[key].key._id), dbFactory.randomList[key].key.port);
                                console.log('newPeer', ip.fromLong(dbFactory.randomList[key].key._id) + ':' + dbFactory.randomList[key].key.port);
                                $scope.peerexists = true;
                                stBlurredDialog.close();
                            }
                            else {
                                console.log('errorPeer', ip.fromLong(dbFactory.randomList[key].key._id) + ':' + dbFactory.randomList[key].key.port);
                                dbFactory.delete(dbFactory.randomList[key].key._id, function () {
                                    $scope.setBestPeer();
                                });
                            }

                        })
                    });
                }
            });

        }

        $scope.newUser = function () {
            $scope.newUserModal = newUser.activate({
                destroy: function () {
                }
            });
        }

        $scope.login = function (pass, remember) {
            if (!$scope.peerexists) {
                return;
            }
            if (pass.length > 100) {
                $scope.errorMessage = 'Password must contain less than 100 characters.';
                return;
            }
            var data = {secret: pass};
            $scope.errorMessage = "";

            var crypti = require('crypti-js');
            var keys = crypti.crypto.getKeys(pass);
            var address = crypti.crypto.getAddress(keys.publicKey);
            userService.setData(address, keys.publicKey);
            if (remember) {
                userService.setSessionPassword(pass);
            }

            (function (d, script) {
                script = d.createElement('script');
                script.type = 'text/javascript';
                script.async = true;
                script.onload = function () {
                    $scope.logging = false;
                    $state.go('main.dashboard');
                };
                script.src = peerFactory.getUrl() + '/socket.io/socket.io.js';
                d.getElementsByTagName('head')[0].appendChild(script);
            }(document));

        }

        $scope.ubpatedbinterval = $interval(function () {
            dbFactory.updatedb(function (response) {
                response.forEach(function (peer) {
                    peerFactory.checkPeer(
                        peer.key.url,
                        function (resp) {
                            if (resp.status == 200) {
                                console.log('workingPeer', ip.fromLong(peer.key._id));
                                resp.data.peers.forEach(function (peer) {
                                    if (peer.sharePort) {
                                        dbFactory.add(peer);
                                    }
                                });
                                dbFactory.updatepeer(peer);
                            }
                            else {
                                console.log('errorPeer', ip.fromLong(peer.key._id));
                                dbFactory.delete(peer.key._id,
                                    function () {

                                    });

                            }
                        })
                })
            });
        }, 1000 * 60 * 1);

        dbFactory.createdb();

        if (!peerFactory.peer) {
            stBlurredDialog.open('partials/modals/blurredModal.html', {err: false});
            dbFactory.emptydb(
                function (empty) {
                    if (empty) {
                        $scope.getPeers(function () {
                            $scope.setBestPeer();
                        });
                    }
                    else {
                        $scope.setBestPeer();
                    }
                }
            );
        }
        else {
            $scope.peerexists = true;
        }

    }]);