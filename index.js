'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Cray on 2016/4/29.
 */
var created = false;
var instance = null;

var Log = function () {
    function Log() {
        _classCallCheck(this, Log);

        this.envArray = ['development', 'testing', 'prepare', 'production'];

        if (!created) {
            created = true;
            this._jsGetClientIP();
            this._jsErrorHandler();
            instance = new Log();
        }
        this.config();

        return instance;
    }

    _createClass(Log, [{
        key: 'config',
        value: function config() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                _ref$pjKey = _ref.pjKey,
                pjKey = _ref$pjKey === undefined ? typeof _PJKEY !== 'undefined' && _PJKEY ? _PJKEY : { 'key': '0' } : _ref$pjKey,
                _ref$env = _ref.env,
                env = _ref$env === undefined ? process.env.NODE_ENV : _ref$env;

            this.pjKey = pjKey.key;
            this.env = env;
            this.enable = false;

            var envIndex = this.envArray.indexOf(env);
            if (envIndex > -1) {
                this.enable = true;
            }
        }
    }, {
        key: 'debug',
        value: function debug() {
            for (var _len = arguments.length, msg = Array(_len), _key = 0; _key < _len; _key++) {
                msg[_key] = arguments[_key];
            }

            this._consolePrint('log', 0, msg);
        }
    }, {
        key: 'log',
        value: function log() {
            for (var _len2 = arguments.length, msg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                msg[_key2] = arguments[_key2];
            }

            this._consolePrint('log', 1, msg);
        }
    }, {
        key: 'info',
        value: function info() {
            for (var _len3 = arguments.length, msg = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                msg[_key3] = arguments[_key3];
            }

            this._consolePrint('info', 2, msg);
        }
    }, {
        key: 'warn',
        value: function warn() {
            for (var _len4 = arguments.length, msg = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                msg[_key4] = arguments[_key4];
            }

            this._consolePrint('warn', 3, msg);
        }
    }, {
        key: 'error',
        value: function error() {
            for (var _len5 = arguments.length, msg = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                msg[_key5] = arguments[_key5];
            }

            this._consolePrint('error', 4, msg);
        }

        /**
        * 打印输出
        **/

    }, {
        key: '_consolePrint',
        value: function _consolePrint(type, level, msg) {
            var fn = window.console[type];
            if (fn) {
                if (this.enable) {
                    var logData = msg;
                    if (level == 4) {
                        var _window$navigator = window.navigator,
                            appCodeName = _window$navigator.appCodeName,
                            appName = _window$navigator.appName,
                            appVersion = _window$navigator.appVersion,
                            cookieEnabled = _window$navigator.cookieEnabled,
                            languages = _window$navigator.languages,
                            onLine = _window$navigator.onLine,
                            platform = _window$navigator.platform,
                            product = _window$navigator.product,
                            productSub = _window$navigator.productSub,
                            userAgent = _window$navigator.userAgent,
                            vendor = _window$navigator.vendor,
                            userNavigator = void 0;


                        userNavigator = {
                            appCodeName: appCodeName,
                            appName: appName,
                            appVersion: appVersion,
                            cookieEnabled: cookieEnabled,
                            languages: languages,
                            onLine: onLine,
                            platform: platform,
                            product: product,
                            productSub: productSub,
                            userAgent: userAgent,
                            vendor: vendor
                        };

                        var errorInfo = {
                            mobileInfo: {
                                meaning: '浏览器信息：',
                                msg: userNavigator
                            },
                            scriptURI: {
                                meaning: '出错文件：',
                                msg: ''
                            },
                            lineNumber: {
                                meaning: '出错行号：',
                                msg: 0
                            },
                            columnNumber: {
                                meaning: '出错列号：',
                                msg: 0
                            },
                            errorObj: {
                                meaning: '堆栈信息：',
                                msg: ''
                            },
                            errorMessage: {
                                meaning: '错误信息：',
                                msg: msg.toString()
                            }
                        };

                        logData = [errorInfo];
                    }
                    if (this.env == 'production') {
                        if (level > 0) {
                            this._debugHandler(type, logData);
                        }
                    } else {
                        this._debugHandler(type, logData);
                    }
                }
                fn.apply(window.console, this._formatMsg(type, msg));
            }
        }
        /**
        * 输出到debug系统
        **/

    }, {
        key: '_debugHandler',
        value: function _debugHandler(type, msg) {
            var _this = this;
            var sourceData = { "pjKey": this.pjKey, "type": type, server: "",
                env: this.env, "action": "4001", "url": window.location.href, "logData": msg,
                ipInfo: window.returnCitySN };
            var imgData = this._paramFormat(sourceData);
            if (window.returnCitySN) {
                this._ajax('http://debug.hefantv.com/api/postDebug', imgData, 'POST');
            } else {
                this._ajax('http://h5api.hefantv.com/api/ipaddress').then(function (data) {
                    try {
                        sourceData.ipInfo = JSON.parse(data);
                    } catch (e) {
                        sourceData.ipInfo = {};
                    }
                    imgData = _this._paramFormat(sourceData);
                    _this._ajax('http://debug.hefantv.com/api/postDebug', imgData, 'POST');
                });
            }
        }
    }, {
        key: '_getTime',
        value: function _getTime() {
            var d = new Date();
            return String(d.getHours()) + ":" + String(d.getMinutes()) + ":" + String(d.getSeconds());
        }
    }, {
        key: '_paramFormat',
        value: function _paramFormat(data) {
            var result = {};
            result.data = JSON.stringify(data);
            result.data = encodeURIComponent(result.data);
            return result;
        }
    }, {
        key: '_formatMsg',
        value: function _formatMsg(type, msg) {
            msg.unshift(this._getTime() + ' [' + type + '] > ');
            return msg;
        }
        /**
        * 页面error监听
        **/

    }, {
        key: '_jsErrorHandler',
        value: function _jsErrorHandler() {
            var _this = this;
            if (typeof window !== 'undefined' && !window.onerror) {

                window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, error) {
                    if (!scriptURI) {
                        return true;
                    }

                    var message = {};
                    var htmlURI = window.location.host + window.location.pathname;

                    try {
                        var _window$navigator2 = window.navigator,
                            appCodeName = _window$navigator2.appCodeName,
                            appName = _window$navigator2.appName,
                            appVersion = _window$navigator2.appVersion,
                            cookieEnabled = _window$navigator2.cookieEnabled,
                            languages = _window$navigator2.languages,
                            onLine = _window$navigator2.onLine,
                            platform = _window$navigator2.platform,
                            product = _window$navigator2.product,
                            productSub = _window$navigator2.productSub,
                            userAgent = _window$navigator2.userAgent,
                            vendor = _window$navigator2.vendor,
                            userNavigator = void 0;


                        userNavigator = {
                            appCodeName: appCodeName,
                            appName: appName,
                            appVersion: appVersion,
                            cookieEnabled: cookieEnabled,
                            languages: languages,
                            onLine: onLine,
                            platform: platform,
                            product: product,
                            productSub: productSub,
                            userAgent: userAgent,
                            vendor: vendor
                        };
                        if ((typeof errorMessage === 'undefined' ? 'undefined' : _typeof(errorMessage)) === "object" && errorMessage.toString() === "[object Event]") {
                            for (key in errorMessage) {
                                message += key + ':' + errorMessage[key] + ',';
                            }
                        } else {
                            message = errorMessage;
                        }

                        setTimeout(function () {
                            var errorInfo = {
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
                                    msg: columnNumber || window.event && window.event.errorCharacter || 0
                                },
                                errorObj: {
                                    meaning: '堆栈信息：',
                                    msg: ''
                                }
                            };

                            if (!!error && !!error.stack) {
                                //如果浏览器有堆栈信息
                                //直接使用
                                errorInfo.errorObj.msg = error.stack.toString();
                            } else if (!!arguments.callee) {
                                //尝试通过callee拿堆栈信息
                                var ext = [];
                                var f = arguments.callee.caller,
                                    c = 3;
                                //这里只拿三层堆栈信息
                                while (f && --c > 0) {
                                    ext.push(f.toString());
                                    if (f === f.caller) {
                                        break; //如果有环
                                    }
                                    f = f.caller;
                                }
                                ext = ext.join(",");
                                errorInfo.errorObj.msg = error.stack.toString();
                            }

                            _this._debugHandler('error', [errorInfo]);
                        }, 0);
                    } catch (err) {}
                };
            }
        }

        /**
        * 客户端打入ip获取js
        **/

    }, {
        key: '_jsGetClientIP',
        value: function _jsGetClientIP() {
            var eleHeader = document.getElementsByTagName('HEAD').item(0);
            var eleScript = document.createElement("script");
            eleScript.type = "text/javascript";
            eleScript.src = "http://h5api.hefantv.com/api/ipaddress?format=js";
            eleHeader.appendChild(eleScript);
        }
    }, {
        key: '_ajax',
        value: function _ajax(url, data) {
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';

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
            return new Promise(function (resolve, reject) {
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        resolve(xhr.responseText);
                    }
                };

                if (method == 'POST') {
                    xhr.open('POST', url, true);
                    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhr.send(data);
                } else {
                    xhr.open('GET', url, true);
                    xhr.send();
                }
            });
        }
    }]);

    return Log;
}();

module.exports = new Log();