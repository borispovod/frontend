require('angular');

angular.module('webApp').filter('decimalFilter', function () {

    return function (fee) {
        fee = fee.toString();
        if (!fee) {
            return [0][0];
        }
        return [fee.slice(0, -8), fee.slice(-8)];
    }
});