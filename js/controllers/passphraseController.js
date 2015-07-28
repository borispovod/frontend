require('angular');
var ip = require('ip');
var ipRegex = require('ip-regex');

angular.module('webApp').controller('passphraseController', ['$scope', '$rootScope', '$http', "$state", "userService", "newUser", "peerFactory", "dbFactory", "$interval", "stBlurredDialog", "transactionService", "$timeout",
    function ($rootScope, $scope, $http, $state, userService, newUser, peerFactory, dbFactory, $interval, stBlurredDialog, transactionService, $timeout) {
        userService.setData();
        userService.rememberPassword = false;
        userService.rememberedPassword = '';
        $scope.rememberPassword = true;
        $scope.errorMessage = "";

        $scope.getPeers = function getPeers(cb, index) {
            index = index || 0;
            var peer = peerFactory.peerList[index]
            if (!!peer) {
                peerFactory.setPeer(peer.ip, peer.port);
                dbFactory.add({ip: ip.toLong(peer.ip).toString(), port: peer.port});
                $http.get("http://" + peer.ip + ':' + peer.port + "/peer/list", transactionService.createHeaders(10000))
                    .then(function (resp) {
                        //console.log(resp);
                        if (!!resp.data && !!resp.data.peers) {
                            resp.data.peers.forEach(function (peer) {
                                if (peer.sharePort) {
                                    dbFactory.add(peer);
                                }
                            });
                        }
                        getPeers(cb, ++index);
                    }, function (reject) {
                        getPeers(cb, ++index);
                    });
            }
            else {
                cb();
            }


        }

        $scope.setBestPeer = function (cb) {
            dbFactory.emptydb(function (empty) {
                if (empty) {
                    console.log('empty peer list');
                    console.log('no peers to search');
                    console.log('new turn for peers in config');
                    $scope.getPeers(function () {
                        $scope.setBestPeer(cb);
                    });
                }
                else {
                    dbFactory.getRandom(10, function () {
                        var key = (Math.floor((Math.random() * 10) + 1) - 1);
                        // console.log(dbFactory.randomList);
                        if (!!dbFactory.randomList[key]) {
                            peerFactory.checkPeer(dbFactory.randomList[key].key.url, function (resp) {
                                if (resp.status == 200) {
                                    peerFactory.setPeer(ip.fromLong(dbFactory.randomList[key].key.ip), dbFactory.randomList[key].key.port);
                                    console.log('newPeer', ip.fromLong(dbFactory.randomList[key].key.ip) + ':' + dbFactory.randomList[key].key.port);
                                    $scope.peerexists = true;
                                    if (!!cb){
                                        cb();
                                    }
                                    stBlurredDialog.close();
                                }
                                else {
                                    console.log('errorPeer', ip.fromLong(dbFactory.randomList[key].key.ip) + ':' + dbFactory.randomList[key].key.port);
                                    dbFactory.delete(dbFactory.randomList[key].key._id, function () {
                                        $scope.setBestPeer(cb);
                                    });
                                }

                            })
                        }
                        else {
                            $scope.setBestPeer(cb);
                        }
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

            $http.get(peerFactory.getUrl() + "/api/accounts", {params: {address: userService.address}})
                .then(function (resp) {
                    var account = resp.data.account;
                    if (!account) {
                        $http.post(peerFactory.getUrl() + "/api/accounts/open/", {secret: pass})
                            .then(function (resp) {
                                if (resp.data.success) {
                                    userService.setData(resp.data.account.address, resp.data.account.publicKey, resp.data.account.balance, resp.data.account.unconfirmedBalance, resp.data.account.effectiveBalance);
                                    userService.setForging(resp.data.account.forging);
                                    userService.setSecondPassphrase(resp.data.account.secondSignature);
                                    userService.unconfirmedPassphrase = resp.data.account.unconfirmedSignature;
                                } else {
                                    console.log("Something wrong. Restart server please.");
                                }
                            });
                    }
                    (function (d, script) {
                        script = d.createElement('script');
                        script.id = "soketIoScript";
                        script.type = 'text/javascript';
                        script.async = true;
                        script.onload = function () {
                            $scope.logging = false;
                            $state.go('main.dashboard');
                        };
                        script.src = peerFactory.getUrl() + '/socket.io/socket.io.js';
                        d.getElementsByTagName('head')[0].appendChild(script);
                    }(document));

                }, function(reasone){
                    $scope.getPeers(function () {
                        $scope.setBestPeer(function(){$scope.login(pass, remember)});
                    });
                });


        }

        $scope.ubpatedbinterval = $interval(function () {
            dbFactory.updatedb(function (response) {
                response.forEach(function (peer) {
                    peerFactory.checkPeer(
                        peer.key.url,
                        function (resp) {
                            if (resp.status == 200) {
                                console.log('workingPeer', ip.fromLong(peer.key.ip) + ':' + peer.key.port);
                                resp.data.peers.forEach(function (peer) {
                                    if (peer.sharePort) {
                                        dbFactory.add(peer);
                                    }
                                });
                                dbFactory.updatepeer(peer);
                            }
                            else {
                                console.log('errorPeer', ip.fromLong(peer.key.ip) + ':' + peer.key.port);
                                dbFactory.delete(peer.key._id,
                                    function () {

                                    });

                            }
                        })
                })
            });
        }, 1000 * 60 * 1);

        dbFactory.createdb();
        $timeout(function () {
            dbFactory.destroydb(function () {
                dbFactory.createdb();
                dbFactory.ipVersion(function(){
                    if (!peerFactory.peer) {
                        stBlurredDialog.open('partials/modals/blurredModal.html', {err: false});
                        dbFactory.emptydb(
                            function (empty) {
                                if (true) {
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
                    }});


            });
        }, 1);

         }]);