require('angular');
var crypti = require('crypti-js');

angular.module('webApp').service('transactionService', function (userService) {

    this.checkTransaction = function (transaction, secret) {

        var keys = crypti.crypto.getKeys(secret);
        var address = crypti.crypto.getAddress(keys.publicKey);

        if (userService.address != address) {
            return {
                err: true,
                message: "Invalid account password. Please try again"
            }
        }

        if (secret.length == 0) {
            return {
                err: true,
                message: "Provide secret key"
            }
        }

        if (keys.publicKey) {
            if (keys.publicKey != transaction.senderPublicKey) {
                return {
                    err: true,
                    message: "Invalid account primary password. Try again"
                }
            }
        }

        if (!userService.balance) {
            return {
                err: true,
                message: "Account doesn't have balance"
            }
        }

        if (!userService.publicKey) {
            return {
                err: true,
                message: "Open account to make transaction"
            }
        }

        return {err: false}

    }

    this.createHeaders = function (timeout) {
        var data = {
            "headers": {
                "os": process.platform,
                "version": "0.2.1Lite!",
                "port": 1,
                "share-port": 0
            }};
        if (timeout) {
            data["timeout"] = timeout;
        }
        return data;
    }


})
;