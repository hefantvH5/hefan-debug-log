'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Created by Cray on 2016/4/29.
 */
var projectName = typeof _PROJECTNAME !== 'undefined' && _PROJECTNAME ? _PROJECTNAME : '项目名称未配置';
var _LOGENV = _LOGENV || 'null';
var env = __DEV ? '测试环境（process.env==' + _LOGENV + '）' : '预上线/正式环境（process.env==' + _LOGENV + '）';
var LEVEL_CONFIG = { 'debug': true, 'log': true, 'info': true, 'warn': true, 'error': true };

var Log = {
    startup: function startup() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'debug';

        var array = ['debug', 'log', 'info', 'warn', 'error'];
        // let enable = false;
        // array.forEach((type) => {
        //     type == value ? (enable = true) : (LEVEL_CONFIG[type] = false);

        //     if (enable) {
        //         LEVEL_CONFIG[type] = true;
        //     }
        // });
    },
    debug: function debug(pageName) {
        for (var _len = arguments.length, msg = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            msg[_key - 1] = arguments[_key];
        }

        _consolePrint('debug', pageName, msg);
    },
    log: function log(pageName) {
        for (var _len2 = arguments.length, msg = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            msg[_key2 - 1] = arguments[_key2];
        }

        _consolePrint('log', pageName, msg);
    },
    info: function info(pageName) {
        for (var _len3 = arguments.length, msg = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            msg[_key3 - 1] = arguments[_key3];
        }

        _consolePrint('info', pageName, msg);
    },
    warn: function warn(pageName) {
        for (var _len4 = arguments.length, msg = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
            msg[_key4 - 1] = arguments[_key4];
        }

        _consolePrint('warn', pageName, msg);
    },
    error: function error(pageName) {
        for (var _len5 = arguments.length, msg = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
            msg[_key5 - 1] = arguments[_key5];
        }

        _consolePrint('error', pageName, msg);
    }
};

if (__DEV) {
    Log.startup('debug');
} else {
    Log.startup('log');
}

function _ajax(url, data) {
    // 创建ajax对象
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    // 用于清除缓存
    var random = Math.random();

    if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) == 'object') {
        var str = '';
        for (var key in data) {
            str += key + '=' + data[key] + '&';
        }
        data = str.replace(/&$/, '');
    }

    xhr.open('POST', url, true);
    // 如果需要像 html 表单那样 POST 数据，请使用 setRequestHeader() 来添加 http 头。
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(data);

    // 处理返回数据
    // xhr.onreadystatechange = function() {
    //     if (xhr.readyState == 4) {
    //         if (xhr.status == 200) {
    //             success(xhr.responseText);
    //         } else {
    //             if (failed) {
    //                 failed(xhr.status);
    //             }
    //         }
    //     }
    // }
}

function _consolePrint(type, pageName, msg) {
    if (LEVEL_CONFIG[type]) {
        var fn = window.console[type];
        if (fn) {
            fn.apply(window.console, _formatMsg(type, msg));
            _debugImg(type, pageName, msg);
        }
    }
}

function _debugImg(type, pageName, data) {
    var imgData = _paramFormat({ "projectName": projectName, "type": type, env: env, "action": "4001", "pageName": pageName, "logData": data });
    // let img = new Image();
    // img.src = 'http://debug.hefantv.com/debug.gif?data=' + encodeURIComponent(imgData.data);

    // 测试调用

    _ajax('http://debug.hefantv.com/api/postDebug', imgData);
}

function _getTime() {
    var d = new Date();
    return String(d.getHours()) + ":" + String(d.getMinutes()) + ":" + String(d.getSeconds());
}

function _paramFormat(data) {
    var result = {};
    result.data = JSON.stringify(data);
    return result;
}
if (typeof window !== 'undefined') {
    window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
        var errorInfo = {
            errorMessage: {
                meaning: '错误信息：',
                msg: errorMessage
            },
            scriptURI: {
                meaning: '出错文件：',
                msg: scriptURI
            },
            lineNumber: {
                meaning: '出错行号：',
                msg: lineNumber
            },
            columnNumber: {
                meaning: '出错列号：',
                msg: columnNumber
            },
            errorObj: {
                meaning: '错误详情：',
                msg: errorObj
            }
        };
        _debugImg('error', scriptURI, errorInfo);
    };
}

function _formatMsg(type, msg) {
    msg.unshift(_getTime() + ' [' + type + '] > ');
    return msg;
}

module.exports = Log;