require('angular');
var crypti = require('crypti-js');

angular.module('webApp').service('contactsService', function ($http, userService, $filter, peerFactory, transactionService, dbFactory) {
    function filterData(data, filter) {
        return $filter('filter')(data, filter)
    }

    function orderData(data, params) {
        return params.sorting() ? $filter('orderBy')(data, params.orderBy()) : filteredData;
    }

    function sliceData(data, params) {
        return data.slice((params.page() - 1) * params.count(), params.page() * params.count())
    }

    function transformData(data, filter, params) {
        return sliceData(orderData(filterData(data, filter), params), params);
    }

    var contacts = {
        count: 0,
        followersCount: 0,
        list: [],
        getContacts: function (publicKey, cb) {
            var queryParams = {
                publicKey: publicKey
            }
            $http.get(peerFactory.getUrl() + "/api/contacts/", {
                params: queryParams
            })
                .then(function (response) {
                    if (response.data.success) {
                        contacts.list = response.data.following;
                        contacts.count = response.data.following.length;
                        contacts.followersCount = response.data.followers.length;
                    }
                    else {
                        contacts.list = [];
                        contacts.count = 0;
                        contacts.followersCount = 0;
                    }
                    cb();
                });
        },
        getSortedContacts: function ($defer, params, filter, cb) {
            var queryParams = {
                publicKey: userService.publicKey
            }
            $http.get(peerFactory.getUrl() + "/api/contacts/", {
                params: queryParams
            })
                .then(function (response) {
                    params.total(response.data.following.length);
                    var filteredData = $filter('filter')(response.data.following, filter);
                    var transformedData = transformData(response.data.following, filter, params);
                    $defer.resolve(transformedData);
                    cb(null);
                });
        },
        getSortedFollowers: function ($defer, params, filter, cb) {
            var queryParams = {
                publicKey: userService.publicKey
            }
            $http.get(peerFactory.getUrl() + "/api/contacts/", {
                params: queryParams
            })
                .then(function (response) {
                    params.total(response.data.followers.length);
                    var filteredData = $filter('filter')(response.data.followers, filter);
                    var transformedData = transformData(response.data.followers, filter, params);
                    $defer.resolve(transformedData);
                    cb(null);
                });
        },
        addContact: function (queryParams, cb) {

            var contactTransaction;

            contactTransaction = crypti.contact.createContact(queryParams.secret, queryParams.following, queryParams.secondSecret);

            var checkBeforSending = transactionService.checkTransaction(contactTransaction, queryParams.secret);

            if (checkBeforSending.err) {
                return cb({data:{success: false, err: checkBeforSending.message}});
            }

                $http.post(peerFactory.getUrl() + "/peer/transactions",
                    {transaction: contactTransaction},
                    transactionService.createHeaders()).then(function (response) {
                        cb(response);
                    });
        }
    }

    return contacts;
});