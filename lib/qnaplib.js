'use strict';

const rp = require('request-promise-native');
const xml2js = require('xml2js-es6-promise');
const ezEncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/**
 *
 * @param str
 * @returns {string}
 */
let utf16to8 = str => {
    let out, i, len, c;
    out = "";
    len = str.length;
    for (i=0; i<len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        }
        else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >>6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >>0) & 0x3F));

        }
        else {
            out += String.fromCharCode(0xC0 | ((c >>6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >>0) & 0x3F));
        }
    }
    return out;
};

/**
 *
 * @param str
 * @returns {string}
 */
let ezEncode = str => {
    let out, i, len;
    let c1, c2, c3;

    len = str.length;
    i = 0;
    out = "";
    while(i < len)
    {
        c1 = str.charCodeAt(i++) & 0xff;
        if(i == len)
        {
            out += ezEncodeChars.charAt(c1 >> 2);
            out += ezEncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if(i == len)
        {
            out += ezEncodeChars.charAt(c1 >> 2);
            out += ezEncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out += ezEncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += ezEncodeChars.charAt(c1 >> 2);
        out += ezEncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
        out += ezEncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += ezEncodeChars.charAt(c3 & 0x3F);
    }
    return out;
};

/**
 * Make Qnap beep
 * @param protocol
 * @param host
 * @param port
 * @param sid
 * @param timeout
 * @param strictSSL
 * @param customRequest
 */
let beep = (protocol, host, port, sid, timeout, strictSSL, customRequest) => {
    return requestQnap(
        protocol,
        host,
        port,
        sid,
        timeout,
        strictSSL,
        customRequest,
        `${protocol}://${host}:${port}/cgi-bin/sys/sysRequest.cgi?subfunc=notification&count=0&sid=${sid}&apply=where_are_you`,
        'Beep'
    );
};

/**
 * Restart Qnap
 * @param protocol
 * @param host
 * @param port
 * @param sid
 * @param timeout
 * @param strictSSL
 * @param customRequest
 */
let restart = (protocol, host, port, sid, timeout, strictSSL, customRequest) => {
    return requestQnap(
        protocol,
        host,
        port,
        sid,
        timeout,
        strictSSL,
        customRequest,
        `${protocol}://${host}:${port}/cgi-bin/sys/sysRequest.cgi?subfunc=power_mgmt&count=0&sid=${sid}&apply=restart`,
        'Starting reboot...'
    );
};

/**
 * Shutdown Qnap
 * @param protocol
 * @param host
 * @param port
 * @param sid
 * @param timeout
 * @param strictSSL
 * @param customRequest
 */
let shutdown = (protocol, host, port, sid, timeout, strictSSL, customRequest) => {
    return requestQnap(
        protocol,
        host,
        port,
        sid,
        timeout,
        strictSSL,
        customRequest,
        `${protocol}://${host}:${port}/cgi-bin/sys/sysRequest.cgi?subfunc=power_mgmt&count=0&sid=${sid}&apply=shutdown`,
        'Starting shutdown...'
    );
};

let requestQnap = (protocol, host, port, sid, timeout, strictSSL, customRequest, uri, resolveMessage) => {
    let request = customRequest || rp;
    return request({
        uri: uri,
        timeout: timeout,
        strictSSL: strictSSL == 1
    }).then(res => {
        return xml2js(res).then(result => {
            if (result['QDocRoot']['authPassed'][0] == 1) {
                return Promise.resolve(resolveMessage);
            } else {
                return Promise.reject(Error('Error: You are not authorized!'));
            }
        });
    });
};

/**
 * Sleep Qnap
 * @param protocol
 * @param host
 * @param port
 * @param sid
 * @param timeout
 * @param strictSSL
 * @param customRequest
 */
let sleep = (protocol, host, port, sid, timeout, strictSSL, customRequest) => {
    return requestQnap(
        protocol,
        host,
        port,
        sid,
        timeout,
        strictSSL,
        customRequest,
        `${protocol}://${host}:${port}/cgi-bin/sys/sysRequest.cgi?subfunc=power_mgmt&count=0&sid=${sid}&apply=sleep`,
        'Starting sleep...'
    );
};

/**
 * Get SID for operate with CGI
 * @param protocol
 * @param host
 * @param port
 * @param username
 * @param password
 * @param timeout
 * @param strictSSL
 * @param customRequest
 * @returns {Promise<U>|Promise.<TResult>|Thenable<U>|*}
 */
let getSid = (protocol, host, port, username, password, timeout, strictSSL, customRequest) => {
    let encode_password = password ? ezEncode(utf16to8(password)) : password;
    let request = customRequest || rp;
    return request({
        method: 'POST',
        form: {user: username, pwd: encode_password},
        uri:`${protocol}://${host}:${port}/cgi-bin/authLogin.cgi`,
        timeout: timeout,
        strictSSL: strictSSL == 1
    }).then(res => {
        return xml2js(res).then(result => {
            if (typeof result['QDocRoot'] !== 'undefined' && typeof result['QDocRoot']['authPassed'] !== 'undefined') {
                if (result['QDocRoot']['authPassed'][0] == 1) {
                    return result['QDocRoot']['authSid'][0];
                }
            }
            return Promise.reject(Error("Error: Authentication failed!"));
        });
    });
};

module.exports = {
    getSid: getSid,
    beep: beep,
    restart: restart,
    sleep: sleep,
    shutdown: shutdown
};
