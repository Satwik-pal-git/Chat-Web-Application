const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function formatMessage(username, text) {
    var date = new Date();
    var day = date.getDate();
    var month = monthNames[date.getMonth()];
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();

    var now_time = h + ":" + m + ":" + s + " (" + day + " " + month + ")";
    return {
        username,
        text,
        time: now_time
    };
};
module.exports = formatMessage;
