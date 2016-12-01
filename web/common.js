function is_admin(cookie) {
    var pos = cookie.indexOf('**', cookie) + 2;
    return (cookie[pos] == '1');
}


function get_username(cookie) {
    var pos = cookie.indexOf('**');
    return cookie.substring(0, pos);
}

module.exports = {
    'is_admin': is_admin,
    'get_username': get_username
};