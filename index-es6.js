/**
 * Created by Cray on 2016/4/29.
 */
let projectName = typeof _PROJECTNAME !== 'undefined' && _PROJECTNAME ? _PROJECTNAME : '项目名称未配置';
let _LOGENV = _LOGENV || 'null'
let env = __DEV ? '测试环境（process.env==' + _LOGENV + '）' : '预上线/正式环境（process.env==' + _LOGENV + '）';
const LEVEL_CONFIG = { 'debug': true, 'log': true, 'info': true, 'warn': true, 'error': true };

const Log = {
    startup(value = 'debug') {
        let array = ['debug', 'log', 'info', 'warn', 'error'];
        // let enable = false;
        // array.forEach((type) => {
        //     type == value ? (enable = true) : (LEVEL_CONFIG[type] = false);

        //     if (enable) {
        //         LEVEL_CONFIG[type] = true;
        //     }
        // });

    },

    debug(pageName, ...msg) {
        _consolePrint('debug', pageName, msg);
    },

    log(pageName, ...msg) {
        _consolePrint('log', pageName, msg);
    },

    info(pageName, ...msg) {
        _consolePrint('info', pageName, msg);
    },

    warn(pageName, ...msg) {
        _consolePrint('warn', pageName, msg);
    },

    error(pageName, ...msg) {
        _consolePrint('error', pageName, msg);
    }

}

if (__DEV) {
    Log.startup('debug')
} else {
    Log.startup('log')
}

function _ajax(url, data) {
    // 创建ajax对象
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }
    // 用于清除缓存
    var random = Math.random();

    if (typeof data == 'object') {
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
        const fn = window.console[type];
        if (fn) {
            fn.apply(window.console, _formatMsg(type, msg));
            _debugImg(type, pageName, msg)
        }
    }
}

function _debugImg(type, pageName, data) {
    let imgData = _paramFormat({ "projectName": projectName, "type": type, env: env, "action": "4001", "pageName": pageName, "logData": data });
    // let img = new Image();
    // img.src = 'http://debug.hefantv.com/debug.gif?data=' + encodeURIComponent(imgData.data);

    // 测试调用

    _ajax('http://debug.hefantv.com/api/postDebug', imgData);
}

function _getTime() {
    let d = new Date();
    return String(d.getHours()) + ":" + String(d.getMinutes()) + ":" + String(d.getSeconds());
}

function _paramFormat(data) {
    let result = {};
    result.data = JSON.stringify(data);
    return result;
}
if (typeof window !== 'undefined') {
    window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
        let errorInfo = {
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
        }
        _debugImg('error', scriptURI, errorInfo)
    }
}


function _formatMsg(type, msg) {
    msg.unshift(_getTime() + ' [' + type + '] > ');
    return msg;
}

module.exports = Log;