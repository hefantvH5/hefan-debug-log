/**
 * Created by Cray on 2016/4/29.
 */
let created = false;
let instance = null;
class Log {
    constructor() {
        this.envArray = ['development', 'testing', 'preproduction', 'production'];

        if (!created) {
            created = true;
            this._jsErrorHandler()
            instance = new Log();
        }
        this.config()

        return instance
    }

    config({ projectName = typeof _PROJECTNAME !== 'undefined' && _PROJECTNAME ? _PROJECTNAME : '项目名称未配置', env = process.env.NODE_ENV, level = 'debug' } = {}) {
        this.projectName = projectName;
        this.enable = true;
        this.typeArray = ['debug', 'log', 'info', 'warn', 'error'];
        let envIndex = this.envArray.indexOf(env);
        if (envIndex > -1) {
            this.env = env
        } else {
            this.enable = false;
        }
        let typeIndex = this.typeArray.indexOf(level);
        if (typeIndex > -1) {
            this.typeArray = this.typeArray.splice(typeIndex)
        }

    }
    debug(pageName, ...msg) {
        this._consolePrint('debug', pageName, msg);
    }

    log(pageName, ...msg) {
        this._consolePrint('log', pageName, msg);
    }

    info(pageName, ...msg) {
        this._consolePrint('info', pageName, msg);
    }

    warn(pageName, ...msg) {
        this._consolePrint('warn', pageName, msg);
    }

    error(pageName, ...msg) {
        this._consolePrint('error', pageName, msg);
    }
    _ajax(url, data) {
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
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }
    _consolePrint(type, pageName, msg) {
        if (this.enable && this.typeArray.indexOf(type) > -1) {
            const fn = window.console[type];
            if (fn) {
                fn.apply(window.console, this._formatMsg(type, msg));
                this._debugHandler(type, pageName, msg)
            }
        }
    }
    _debugHandler(type, pageName, data) {
        let imgData = this._paramFormat({ "projectName": this.projectName, "type": type, env: this.env, "action": "4001", "pageName": pageName, "logData": data });
        this._ajax('http://debug.hefantv.com/api/postDebug', imgData);
    }
    _getTime() {
        let d = new Date();
        return String(d.getHours()) + ":" + String(d.getMinutes()) + ":" + String(d.getSeconds());
    }
    _paramFormat(data) {
        let result = {};
        result.data = JSON.stringify(data);
        result.data = encodeURIComponent(result.data)
        return result;
    }
    _formatMsg(type, msg) {
        msg.unshift(this._getTime() + ' [' + type + '] > ');
        return msg;
    }
    _jsErrorHandler() {
        let _this = this;
        if (typeof window !== 'undefined' && !window.onerror) {

            window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
                let message = {};
                let htmlURI = window.location.host + window.location.pathname;

                try {
                    let {
                        appCodeName,
                        appName,
                        appVersion,
                        cookieEnabled,
                        languages,
                        onLine,
                        platform,
                        product,
                        productSub,
                        userAgent,
                        vendor
                    } = window.navigator, userNavigator;

                    userNavigator = {
                        appCodeName,
                        appName,
                        appVersion,
                        cookieEnabled,
                        languages,
                        onLine,
                        platform,
                        product,
                        productSub,
                        userAgent,
                        vendor
                    }
                    if (typeof errorMessage === "object" && errorMessage.toString() === "[object Event]") {
                        for (key in errorMessage) {
                            message += `${key}:${errorMessage[key]},`
                        }
                    } else {
                        message = errorMessage
                    }
                    let errorInfo = {
                        mobileInfo: {
                            meaning: '浏览器信息：',
                            msg: userNavigator
                        },
                        errorMessage: {
                            meaning: '错误信息：',
                            msg: message
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
                    _this._debugHandler('error', htmlURI, errorInfo)
                } catch (err) {

                }

            }
        }
    }
}

module.exports = new Log();