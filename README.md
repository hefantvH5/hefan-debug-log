# hefan-log

hefan debug console.log

# 说明

> 最新版本为v0.0.13

>  盒饭TV内部使用

>  仅限于 npm 方式安装

>  环境 node 语言 es6



## 项目使用（nodejs 6.0+）

``` bash

# 安装
npm install --save hefan-log

# 配置

//在js中引用

import Log from "hefan-debug-log-s";

//若使用webpack，可在配置文件中设置别名，配置后可在项目中直接使用

plugins: [
        new webpack.ProvidePlugin({
            "Log": 'hefan-log',
        })
    ],
//配置方法
//projectName  项目名称 env 环境   level 输出级别

Log.config(projectName, env,level)

//projectName：项目名称，若webpack中设置了相应全局变量_PROJECTNAME，则取_PROJECTNAME。默认为'项目名称未配置'.

//env：配置的环境应是['development', 'testing', 'preproduction', 'production']中存在的，否则无法展示,默认为当前进程环境

//level 配置的level应是 ['debug', 'log', 'info', 'warn', 'error']中存在的  debug级别最低，error最高。此字段代表只输出高于所设级别的log，

//例如设置为log级，那么Log.debug()则不会被输出

//配置例子

Log.config('测试项目', 'development'，'log')

//代码调用方法  仅能为 'debug', 'log', 'info', 'warn', 'error'中的一个。

Log.xxx('输出的页面名称'，'输出的内容')



# log展示地址
http://debug.hefantv.com/debug
