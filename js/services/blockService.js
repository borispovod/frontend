require('angular');

angular.module('webApp').service('blockService', function ($http) {

    var blocks = {
        lastBlockId: null,
        getBlocks: function ($defer, params, filter, cb, publicKey) {
            var sortString = '';
            var keys = [];
            for (var key in params.$params.sorting) {
                if (params.$params.sorting.hasOwnProperty(key)) {
                    sortString = key + ':' + params.$params.sorting[key];
                }
            }
            var queryParams = {
                orderBy: sortString,
                limit: params.count(),
                offset: (params.page() - 1) * params.count()
            }
            if (publicKey) {
                queryParams.generatorPublicKey = publicKey;
            }
            $http.get("/api/blocks/", {
                params: queryParams
            })
                .then(function (response) {
                    var queryParams = {orderBy: "height:desc", limit: 1, offset: 0}
                    if (publicKey) {
                        queryParams.generatorPublicKey = publicKey;
                    }
                    $http.get("/api/blocks/", {params: queryParams})
                        .then(function (res) {
                            if (publicKey) {
                                params.total(res.data.count);
                            }
                            else {
                                params.total(res.data.blocks[0].height);
                            }
                            $defer.resolve(response.data.blocks);
                            blocks.lastBlockId = response.data.blocks[response.data.blocks.length - 1].id;
                            cb();
                        });
                });
        }
    }

    return blocks;
});