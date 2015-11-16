require('angular');
var crypti = require('crypti-js');

angular.module('webApp').service('transactionService', function (userService) {

    this.checkTransaction = function (transaction, secret) {

        var keys = crypti.crypto.getKeys(secret);
        var address = crypti.crypto.getAddress(keys.publicKey);

        if (userService.address != address) {
            return {
                err: true,
                message: "无效的主密钥，请重试！"
            }
        }

        if (secret.length == 0) {
            return {
                err: true,
                message: "请提供您的主密钥"
            }
        }

        if (keys.publicKey) {
            if (keys.publicKey != transaction.senderPublicKey) {
                return {
                    err: true,
                    message: "无效的主密钥，请重试！"
                }
            }
        }

        if (!userService.balance) {
            return {
                err: true,
                message: "目前帐户余额为0"
            }
        }

        if (!userService.publicKey) {
            return {
                err: true,
                message: "开启帐户去进行交易吧！"
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
