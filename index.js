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

        this.envArray = ['development', 'testing', 'preproduction', 'production'];

        if (!created) {
            created = true;
            this._jsErrorHandler();
            instance = new Log();
        }
        this.config();

        return instance;
    }

    _createClass(Log, [{
        key: 'config',
        value: function config(pN) {
            var env = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : process.env.NODE_ENV;
            var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'debug';

            this.projectName = pN || typeof _PROJECTNAME !== 'undefined' && _PROJECTNAME ? _PROJECTNAME : '项目名称未配置';
            this.enable = true;
            this.typeArray = ['debug', 'log', 'info', 'warn', 'error'];
            var envIndex = this.envArray.indexOf(env);
            if (envIndex > -1) {
                this.env = env;
            } else {
                this.enable = false;
            }
            var typeIndex = this.typeArray.indexOf(value);
            if (typeIndex > -1) {
                this.typeArray = this.typeArray.splice(typeIndex);
            }
        }
    }, {
        key: 'debug',
        value: function debug(pageName) {
            for (var _len = arguments.length, msg = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                msg[_key - 1] = arguments[_key];
            }

            this._consolePrint('debug', pageName, msg);
        }
    }, {
        key: 'log',
        value: function log(pageName) {
            for (var _len2 = arguments.length, msg = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                msg[_key2 - 1] = arguments[_key2];
            }

            this._consolePrint('log', pageName, msg);
        }
    }, {
        key: 'info',
        value: function info(pageName) {
            for (var _len3 = arguments.length, msg = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                msg[_key3 - 1] = arguments[_key3];
            }

            this._consolePrint('info', pageName, msg);
        }
    }, {
        key: 'warn',
        value: function warn(pageName) {
            for (var _len4 = arguments.length, msg = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
                msg[_key4 - 1] = arguments[_key4];
            }

            this._consolePrint('warn', pageName, msg);
        }
    }, {
        key: 'error',
        value: function error(pageName) {
            for (var _len5 = arguments.length, msg = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                msg[_key5 - 1] = arguments[_key5];
            }

            this._consolePrint('error', pageName, msg);
        }
    }, {
        key: '_ajax',
        value: function _ajax(url, data) {
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
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(data);
        }
    }, {
        key: '_consolePrint',
        value: function _consolePrint(type, pageName, msg) {
            if (this.enable && this.typeArray.indexOf(type) > -1) {
                var fn = window.console[type];
                if (fn) {
                    fn.apply(window.console, this._formatMsg(type, msg));
                    this._debugHandler(type, pageName, msg);
                }
            }
        }
    }, {
        key: '_debugHandler',
        value: function _debugHandler(type, pageName, data) {
            var imgData = this._paramFormat({ "projectName": this.projectName, "type": type, env: this.env, "action": "4001", "pageName": pageName, "logData": data });
            this._ajax('http://debug.hefantv.com/api/postDebug', imgData);
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
            return result;
        }
    }, {
        key: '_formatMsg',
        value: function _formatMsg(type, msg) {
            msg.unshift(this._getTime() + ' [' + type + '] > ');
            return msg;
        }
    }, {
        key: '_jsErrorHandler',
        value: function _jsErrorHandler() {
            var _this = this;
            if (typeof window !== 'undefined' && !window.onerror) {
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
                    _this._debugHandler('error', scriptURI, errorInfo);
                };
            }
        }
    }]);

    return Log;
}();

module.exports = new Log();