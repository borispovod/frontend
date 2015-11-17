require('angular');

angular.module('webApp').filter('timeAgoFilter', function ($filter) {
    return function (time, fullTime) {
        if (fullTime) {
            return $filter('timestampFilter')(time);
        }
        var d = new Date(Date.UTC(2015, 3, 9, 0, 0, 0, 0));
        var t = parseInt(d.getTime() / 1000);

        time = new Date((time + t) * 1000);

        var currentTime = new Date().getTime();
        var diffTime = (currentTime - time.getTime()) / 1000;

        if (diffTime < 60) {
            return Math.floor(diffTime) + ' 秒前';
        }
        if (Math.floor(diffTime / 60) <= 1) {
            return Math.floor(diffTime / 60) + ' 分前';
        }
        if ((diffTime / 60) < 60) {
            return Math.floor(diffTime / 60) + ' 分前';
        }
        if (Math.floor(diffTime / 60 / 60) <= 1) {
            return Math.floor(diffTime / 60 / 60) + ' 小时前';
        }
        if ((diffTime / 60 / 60) < 24) {
            return Math.floor(diffTime / 60 / 60) + ' 小时前';
        }
        if (Math.floor(diffTime / 60 / 60 / 24) <= 1) {
            return Math.floor(diffTime / 60 / 60 / 24) + ' 天前';
        }
        if ((diffTime / 60 / 60 / 24) < 30) {
            return Math.floor(diffTime / 60 / 60 / 24) + ' 天前';
        }
        if (Math.floor(diffTime / 60 / 60 / 24 / 30) <= 1) {
            return Math.floor(diffTime / 60 / 60 / 24 / 30) + ' 月前';
        }
        if ((diffTime / 60 / 60 / 24 / 30) < 12) {
            return Math.floor(diffTime / 60 / 60 / 24 / 30) + ' 月前';
        }
        if (Math.floor((diffTime / 60 / 60 / 24 / 30 / 12)) <= 1) {
            return Math.floor(diffTime / 60 / 60 / 24 / 30 / 12) + ' 年前';
        }

        return Math.floor(diffTime / 60 / 60 / 24 / 30 / 12) + ' 年前';

    }
});
