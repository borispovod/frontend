require('angular');

angular.module('webApp').service('transactionsService', function ($http, userService) {

    var transactions = {
        getTransactions: function ($defer, params, filter, cb) {
            $http.get("/api/transactions", {
                params: {
                    senderPublicKey: userService.publicKey,
                    recipientId: userService.address,
                    orderBy: 'timestamp:desc',
                    limit: params.count(),
                    offset: (params.page() - 1) * params.count()
                }
            })
                .then(function (response) {

                    var transactions = response.data.transactions;
                    params.total(10);
                    $defer.resolve(transactions);
                    cb();
                });
        }
    }

    return transactions;
});