var config = {
    endpoint: '/api',
    time: {
        "end_date": 1577808000 * 1000,
        "active_date": 1577786400 * 1000,
        "stop_before": 30
    }
}

function getCookie(cname) {
    return localStorage.getItem('access_token');
}

function registrationExpired() {
    var date = new Date(config.time['end_date']);
    var stop_date = new Date(date.getTime() - config.time['stop_before'] * 60 * 1000);
    return stop_date > new Date();
}

function restrictUserResultCheck() {
    var date = new Date(new Date(config.time['end_date']).getTime() + 2 * 60 * 60 * 1000);
    var stop_date = new Date(date.getTime());
    return stop_date > new Date();
}
var Base64 = {
    characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    encode: function (string) {
        var result = '';

        var i = 0;
        do {
            var a = string.charCodeAt(i++);
            var b = string.charCodeAt(i++);
            var c = string.charCodeAt(i++);

            a = a ? a : 0;
            b = b ? b : 0;
            c = c ? c : 0;

            var b1 = (a >> 2) & 0x3F;
            var b2 = ((a & 0x3) << 4) | ((b >> 4) & 0xF);
            var b3 = ((b & 0xF) << 2) | ((c >> 6) & 0x3);
            var b4 = c & 0x3F;

            if (!b) {
                b3 = b4 = 64;
            } else if (!c) {
                b4 = 64;
            }

            result += Base64.characters.charAt(b1) + Base64.characters.charAt(b2) + Base64.characters.charAt(b3) + Base64.characters.charAt(b4);

        } while (i < string.length);

        return result;
    },

    decode: function (string) {
        var result = '';

        var i = 0;
        do {
            var b1 = Base64.characters.indexOf(string.charAt(i++));
            var b2 = Base64.characters.indexOf(string.charAt(i++));
            var b3 = Base64.characters.indexOf(string.charAt(i++));
            var b4 = Base64.characters.indexOf(string.charAt(i++));

            var a = ((b1 & 0x3F) << 2) | ((b2 >> 4) & 0x3);
            var b = ((b2 & 0xF) << 4) | ((b3 >> 2) & 0xF);
            var c = ((b3 & 0x3) << 6) | (b4 & 0x3F);

            result += String.fromCharCode(a) + (b ? String.fromCharCode(b) : '') + (c ? String.fromCharCode(c) : '');

        } while (i < string.length);

        return result;
    }
};


var localToken = {
    set: function (code) {
        var cookie = getCookie('access_token');
        if (cookie == null) {
            return false;
        }
        var token = cookie + ',' + code;

        localStorage.setItem('confirmCode', Base64.encode(token));
    },

    get: function () {
        var token = localStorage.getItem('confirmCode');
        if (!token || !getCookie('access_token')) {
            return false;
        }
        token = Base64.decode(token);
        token = token.split(',');

        // Verify if received expected structure
        if (token.length !== 2) {
            localStorage.removeItem('confirmCode');
            return false;
        }

        var tokenCookie = token[0]
        var tokenCode = token[1];

        if (getCookie('access_token') !== tokenCookie) {
            localStorage.removeItem('confirmCode');
            return false;
        }

        return tokenCode;
    }
}

// Fix for safari page persisted issue
window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
}

