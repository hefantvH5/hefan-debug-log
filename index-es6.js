/**
 * Created by Cray on 2016/4/29.
 */
let created = false;
let instance = null;
class Log {
    constructor() {
        this.envArray = ['development', 'testing', 'prepare', 'production'];

        if (!created) {
            created = true;
            this._jsGetClientIP()
            this._jsErrorHandler()           
            instance = new Log();
        }
        this.config()

        return instance
    }

    config({ pjKey = typeof _PJKEY !== 'undefined' && _PJKEY ? _PJKEY : {'key':'0'},
        env = process.env.NODE_ENV}={}) {

        this.pjKey = pjKey.key
        this.env = env
        this.enable = false

        let envIndex = this.envArray.indexOf(env);
        if (envIndex > -1) {
            this.enable = true
        } 

    }
    debug(...msg) {
        this._consolePrint('log', 0, msg);
    }

    log(...msg) {
        this._consolePrint('log', 1, msg);
    }

    info(...msg) {
        this._consolePrint('info', 2, msg);
    }

    warn(...msg) {
        this._consolePrint('warn', 3, msg);
    }

    error(...msg) {
        this._consolePrint('error', 4, msg);
    }
    
    /**
    * 打印输出
    **/
    _consolePrint(type, level, msg) {
        const fn = window.console[type];
        if (fn) {           
            if(this.enable){
                let logData = msg
                if(level == 4){
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

                    let errorInfo = {
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
                    }

                    logData = [errorInfo]
                }
                if(this.env == 'production'){
                    if(level > 0){
                        this._debugHandler(type, logData)
                    }
                }else{
                    this._debugHandler(type, logData)
                }
            }  
            fn.apply(window.console, this._formatMsg(type, msg))
        }
    }
    /**
    * 输出到debug系统
    **/
    _debugHandler(type, msg) {
        let _this = this
        let sourceData = {"pjKey":this.pjKey, "type": type, server: "",
            env: this.env, "action": "4001", "url": window.location.href, "logData": msg,
            ipInfo: window.returnCitySN }
        let imgData = this._paramFormat(sourceData)
        if(window.returnCitySN){
            this._ajax('http://debug.hefantv.com/api/postDebug', imgData, 'POST');
        }else{
            this._ajax('http://h5api.hefantv.com/api/ipaddress').then(function(data){
                try{
                    sourceData.ipInfo = JSON.parse(data)
                }catch(e){
                    sourceData.ipInfo = {}
                }
                imgData = _this._paramFormat(sourceData)
                _this._ajax('http://debug.hefantv.com/api/postDebug', imgData, 'POST');
         })
        }       
        
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
    /**
    * 页面error监听
    **/
    _jsErrorHandler() {
        let _this = this;
        if (typeof window !== 'undefined' && !window.onerror) {

            window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, error) {
                if (!scriptURI){
                    return true;
                }

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

                    setTimeout(function(){
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
                                msg: columnNumber || (window.event && window.event.errorCharacter) || 0
                            },
                            errorObj: {
                                meaning: '堆栈信息：',
                                msg: ''
                            }
                        }
           
                        if (!!error && !!error.stack){
                            //如果浏览器有堆栈信息
                            //直接使用
                            errorInfo.errorObj.msg = error.stack.toString();
                        }else if (!!arguments.callee){
                            //尝试通过callee拿堆栈信息
                            var ext = [];
                            var f = arguments.callee.caller, c = 3;
                            //这里只拿三层堆栈信息
                            while (f && (--c>0)) {
                               ext.push(f.toString());
                               if (f  === f.caller) {
                                    break;//如果有环
                               }
                               f = f.caller;
                            }
                            ext = ext.join(",");
                            errorInfo.errorObj.msg = error.stack.toString();
                        }

                         _this._debugHandler('error', [errorInfo])
                    },0);
                } catch (err) {

                }

            }
        }
    }

    /**
    * 客户端打入ip获取js
    **/
    _jsGetClientIP(){
        let eleHeader = document.getElementsByTagName('HEAD').item(0)
        let eleScript= document.createElement("script") 
        eleScript.type = "text/javascript"
        eleScript.src="http://h5api.hefantv.com/api/ipaddress?format=js" 
        eleHeader.appendChild( eleScript)
    }

    _ajax(url, data, method='GET') {
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
        return new Promise((resolve, reject)=>{
            xhr.onreadystatechange=function()
            {
                if (xhr.readyState==4 && xhr.status==200)
                {
                    resolve(xhr.responseText)
                }
            }

            if(method == 'POST'){
                xhr.open('POST', url, true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send(data);
            }else{
                xhr.open('GET', url, true);
                xhr.send();
            }  
        })
            
    }
}

module.exports = new Log();