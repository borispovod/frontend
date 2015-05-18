require('angular');

angular.module('webApp').service('contactsService', function ($http, userService, $filter) {
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
        list: [],
        getContacts: function (publicKey, cb) {
            var queryParams = {
                publicKey: publicKey
            }
            $http.get("/api/contacts/", {
                params: queryParams
            })
                .then(function (response) {
                    contacts.list = response.data.following;
                    contacts.count = response.data.following.length;
                    cb();
                });
        },
        getSortedContacts: function ($defer, params, filter, cb) {
            var queryParams = {
                publicKey: userService.publicKey
            }
                    $http.get("/api/contacts/", {
                        params: queryParams
                    })
                        .then(function (response) {
                            params.total(response.data.following.length);
                            var filteredData = $filter('filter')(response.data.following, filter);
                            var transformedData = transformData(response.data.following, filter, params);
                            $defer.resolve(transformedData);
                        });
        },
        addContact: function (publicKey, pass, contact, cb) {
            var queryParams = {
                secret: pass,
                following: contact,
                publicKey: publicKey
            }
            $http.put("/api/contacts/",
                queryParams
            )
                .then(function (response) {
                    cb(response);
                });
        }
    }

    return contacts;
});