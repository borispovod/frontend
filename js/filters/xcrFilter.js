require('angular');

angular.module('webApp').filter('xcrFilter', function () {
    return function (fee) {
        fee = fee.toString();
        if (!fee) {
            return 0;
        }
        return fee.slice(0, -8) + '.' + fee.slice(-8);
    }
});