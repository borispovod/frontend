require('angular');

angular.module('webApp').service('transactionsService', function ($http, userService) {

    var transactions = {
        getTransactions: function ($defer, params, filter, cb) {
            var sortString = '';
            var keys = [];
            for (var key in params.$params.sorting) {
                if (params.$params.sorting.hasOwnProperty(key)) {
                    sortString = key + ':' + params.$params.sorting[key];
                }
            }
            $http.get("/api/transactions", {
                params: {
                    senderPublicKey: userService.publicKey,
                    recipientId: userService.address,
                    orderBy: sortString,
                    limit: params.count(),
                    offset: (params.page() - 1) * params.count()
                }
            })
                .then(function (response) {
                    var transactions = response.data.transactions;
                    params.total(response.data.count);
                    $defer.resolve(transactions);
                    cb();
                });
        }
    }

    return transactions;
});