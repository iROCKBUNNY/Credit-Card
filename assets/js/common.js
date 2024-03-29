// common.js

// updated at
dayjs.extend(window.dayjs_plugin_relativeTime);
function updateVersion(timestamp) {
    $('#updated-at').attr('class', 'ui mini green label');
    $('#updated-at .detail').text(dayjs(timestamp).fromNow());
};
var updateAt = $('meta[name=updated_at]').attr('content');
updateVersion(updateAt);
setInterval(function () {
    updateVersion(updateAt);
}, 60000);