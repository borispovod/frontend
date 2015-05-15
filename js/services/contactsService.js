require('angular');

angular.module('webApp').service('contactsService', function ($http) {

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