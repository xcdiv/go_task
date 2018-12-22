
//======================测试函数=========================//
var _gp = {
    __debug: ""

};
var getPgt = function () {

    return "";
};
var isEMU = false;

//======================测试函数=========================//

//#################################
//# 增强的portalms模板返回逻辑    #
//#################################
var go_task = {
    version: 1.5
    , isEmu: false
    , _domain: ""
    , domain: function (val) {
        this._domain = val;

        return this;
    }
     , hn_probe: function (data) {

         if (data == null) {

             data = { "href": null, "type": 0, "title": null, "spcode": null, "level": -1, "base_url": null, "assetId": "", "tvn": "00000000", "classname": "" };
         } else {


             data.title = encodeURI(data.title);
             data.href = encodeURI(data.href);
             data.tvn = go_task.getTVN();
             data.domain = go_task._domain;
             data.url = encodeURI(window.location);
             data.classname = encodeURI(data.classname);

             go_task.ajax({
                 method: 'POST',
                 url: 'http://172.30.37.21:8080/committee_interface/committee/setConnectionRecord',
                 data: data,
                 success: function (response) {
                     //console.log(response);
                 }
             });
         }
         return this;
     }
    , probe: function (data) {

        if (data == null) {

            data = { "href": null, "act": 0, "title": null, "spcode": null, "level": -1, "base_url": null, "assetId": "", "pgt": null };
        } else {


            data.title = escape(data.title);
            data.href = escape(data.href);
            data.pgt = go_task.getPgt();
            data.domain = go_task._domain;
            data.base_url = window.location;


            go_task.ajax({
                method: 'POST',
                url: 'http://ugo.kemei.henancatv.com:8000/APP/UGO/UGO_DVB_Handler.ashx?act=probe',
                data: data,
                async: true,
                success: function (response) {
                    //console.log(response);
                }
            });
        }
        return this;
    }
    , getTVN: function (pgt) { 

        var data=JSON.parse( go_task.getHttpRequest('http://ugo.kemei.henancatv.com:8000/APP/UGO/UGO_DVB_Handler.ashx?act=pgt2tvn&pgt=' + pgt));
               
        if (data.status == "200") {

            return data.TVN;

        }

        return "";
    }
    , getHttpRequest: function (val, wait, func) {
        var _data = [];

        if (typeof wait != "undefined" && typeof func != "undefined") {
            go_task.Ajax.get(val, function (data) {
                func(data);
            }, false, false, wait);

        } else {

            go_task.Ajax.get(val, function (data) {
                _data = data;
            }, false, false);

        }
        return _data;
    }
   , Ajax: {
      __ajax: this
    , timeout: {}
    , _xmlHttp: function () {
        return new (window.ActiveXObject || window.XMLHttpRequest)("Microsoft.XMLHTTP");
    }
    , _AddEventToXHP: function (xhp, fun, isxml) {
        xhp.onreadystatechange = function () {
            if (xhp.readyState == 4 && xhp.status == 200)
                fun(isxml ? xhp.responseXML : xhp.responseText);
        }
    }
    , get: function (url, fun, isxml, bool, wait) {
        var _xhp = this._xmlHttp();
        this._AddEventToXHP(_xhp, fun || function () { }, isxml);

        if (typeof wait == "undefined") {
            _xhp.open("GET", url, bool);
            //_xhp.withCredentials = true;
            _xhp.send(null);
        } else {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(function () {
                _xhp.open("GET", url, bool);
                //_xhp.withCredentials = true;
                _xhp.send(null);

            }, wait);

        }
    },
       post: function (url, data, fun, isxml, bool, wait) {
           var _xhp = this._xmlHttp();
           this._AddEventToXHP(_xhp, fun || function () { }, isxml);

           if (typeof wait == "undefined") {
               _xhp.open("POST", url, bool);
               //_xhp.withCredentials = true;
               _xhp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
               _xhp.send(data);
           } else {
               clearTimeout(this.timeout);
               this.timeout = setTimeout(function () {
                   _xhp.open("POST", url, bool);
                   //_xhp.withCredentials = true;
                   _xhp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                   _xhp.send(data);

               }, wait);
           }
       }
   }
    , ajax: function (opt) {
        opt = opt || {};
        opt.method = opt.method.toUpperCase() || 'POST';
        opt.url = opt.url || '';
        opt.async = opt.async || true;
        opt.data = opt.data || null;
        opt.success = opt.success || function () { };
        var xmlHttp = null;
        if (XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        }
        else {
            xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
        } var params = [];
        for (var key in opt.data) {
            params.push(key + '=' + opt.data[key]);
        }
        var postData = params.join('&');
        if (opt.method.toUpperCase() === 'POST') {
            xmlHttp.open(opt.method, opt.url, opt.async);
            xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
            xmlHttp.send(postData);
        }
        else if (opt.method.toUpperCase() === 'GET') {
            xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
            xmlHttp.send(null);
        }
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                opt.success(xmlHttp.responseText);
            }
        };
    }
    , pgt: null
    , getPgt: function () {
        var pgt = "TGT-1038705614-dr9fbn2b90HV3hW1vbdlFXGx9jxy7bvgdma5WZuRX0hU0tJRyV-cas";
        //TGT-259451368-h00aLTPrhHgqarsGyYwC34iS0p5ugIFX0VOexfcpl9nsGhGzwb-cas
        /*
         * var getPgtUrl = "http://192.168.6.24:9005/stbsimulator/test";
        
          var ret = getHttpRequest(getPgtUrl);
          var data = eval("(" + ret + ")");
            if(data.pgt != undefined){
                pgt=data.pgt;
            }*/


        if (typeof System != "undefined") {

            if (go_task.pgt != null) {

                return go_task.pgt;
            }

            try {
                pgt = System.Pgt();

            } catch (e) {
                if (System.Pgt) {
                    pgt = System.Pgt;
                }
            }
        }

        go_task.pgt = pgt;

        return pgt;
    }
    , replaceParam: function (val) {

        if (val.indexOf('#DEBUG#') > -1) {
            val = val.replace(/#DEBUG#/gi, _gp.__debug);
        }
        if (val.indexOf('#PGT#') > -1) {
            val = val.replace(/#PGT#/gi, go_task.getPgt());
        }
        if (val.indexOf('#TVN#') > -1) {
            val = val.replace(/#TVN#/gi, go_task.getTVN());
        }
        return val;
    }
    , Cookie: new function () {
        //添加cookie
        this.add = function (name, value, hours) {
            var life = new Date().getTime();
            life += hours * 1000 * 60;
            var cookieStr = name + "=" + escape(value) + ";expires=" + new Date(life).toGMTString() + ";path=/";
            document.cookie = cookieStr;
        };
        //获取cookie值
        this.get = function (name) {
            var cookies = document.cookie.split(";");

            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].split("=");
                if (cookie[0].trim() == name) {
                    return unescape(cookie[1]);
                }
            }
            return null;
        };

        this.exists = function (name) {
            var val = this.get(name);

            if (val != null && val != 'default') {

                return true;
            }

            return false;
        };

        //删除cookie
        this.remove = function (name) {

            if (typeof name == "object") {
                for (var i = 0; i < name.length; i++) {
                    this._remove(name[i]);
                }
            }
        };

        this._remove = function (name) {

            var date = new Date();
            date.setTime(date.getTime() - 10000);
            var cookieStr = name + "=" + escape('null') + ";expires=" + date.toGMTString() + ";path=/";
            document.cookie = cookieStr;
        }
    }
    , LIST: []
    , sync_g: function () {
        if (typeof onbeforeunload_handler == "function") {
            onbeforeunload_handler();
        }
        return this;
    }
    , clear: function () {

        this.LIST = [];

        if (go_task.isEmu) {

            Cookie.add(this._domain + "superRootUrl", "default");
            Cookie.add(this._domain + "superRootType", "default");
        } else {
            var gvarRootUrl = new Global(this._domain + "superRootUrl");
            var gvarRootType = new Global(this._domain + "superRootType");

            gvarRootUrl.value = 'default';
            gvarRootType.value = 'default';
            go_task.sync_g();
        }
    }
    , return_root: function () {

        if (go_task.isEmu) {

            if (go_task.Cookie.exists("superRootUrl") && go_task.Cookie.get("superRootUrl") != 'default') {
                _return_url = go_task.Cookie.get("superRootUrl");

                return _return_url;
            }

        } else {

            var gvarRootUrl = new Global("superRootUrl");
            if (gvarRootUrl.value != '' && gvarRootUrl.value != 'default') {
                return gvarRootUrl.value;
            }
        }
        return null;
    }


   , hncatv_return_check: function () {

       var _return_url = null;

       if (go_task.isEmu) {


           if (go_task.Cookie.exists(this._domain + "superRootUrl") &&
                go_task.Cookie.exists(this._domain + "superRootType") &&
                parseInt(go_task.Cookie.get(this._domain + "superRootType")) == 1) {
               _return_url = go_task.Cookie.get(this._domain + "superRootUrl");
               go_task.Cookie.add(this._domain + "superRootUrl", "default");
               go_task.Cookie.add(this._domain + "superRootType", "default");

               return _return_url;
           }


       } else {

           var gvarRootUrl = new Global(this._domain + "superRootUrl");
           var gvarRootType = new Global(this._domain + "superRootType");
           // alert('global return:' + gvarRootType.value + ' ' + gvarRootType.value);
           if (gvarRootType.value != 'default' && gvarRootType.value != 'default' && parseInt(gvarRootType.value) == 1) {
               _return_url = gvarRootUrl.value;
               gvarRootUrl.value = 'default';
               gvarRootType.value = 'default';
               go_task.sync_g();
               return _return_url;
           }
           //gvarRootUrl.value = 'default';
           //gvarRootType.value = 'default';
           go_task.sync_g();
       }

       return null;
   }
      , hncatv_return_set: function (url) {

          if (go_task.isEmu) {
              go_task.Cookie.add(this._domain + "superRootUrl", url);
              go_task.Cookie.add(this._domain + "superRootType", 1);
          } else {
              var gvarRootUrl = new Global(this._domain + "superRootUrl");
              var gvarRootType = new Global(this._domain + "superRootType");


              gvarRootUrl.value = url;
              gvarRootType.value = '1';

              go_task.sync_g();
          }
      }
    , hncatv_init: function () {
        this.sync_read();
        //如果存在有线的返回逻辑处理
        var hn_url = go_task.hncatv_return_check();

        if (hn_url != null) {
            this.LIST[0] = hn_url;
        }
        this.sync_write();

    }
    , push: function (url) {
        this.sync_read();

        var hn_url = go_task.hncatv_return_check();

        if (hn_url != null) {
            this.LIST[0] = hn_url;
        }
        var level = this.LIST.length;
        if (level == 0) {
            level = 1;
        }
        this.LIST[level] = url;
        this.sync_write();
        return this;
    }
    //设置当前等级
    //0 root
    //1 首页
    //2 二级页面
    //3 三级页面
    //4 .....
   , set: function (level, url) {

       this.sync_read();

       var hn_url = go_task.hncatv_return_check();

       if (hn_url != null) {
           this.LIST[0] = hn_url;
       }

       if (level > 0) {
           this.LIST[level] = url;
           if (this.LIST.length > level + 1) {
               this.LIST.splice(level + 1, this.LIST.length);
           }
       }

       this.sync_write();

       return this;
   }
    //当前你的页面等级
       , pop: function (level) {
           this.sync_read();
           var url = null;
           if (level && level > 0) {

               //向上追溯直到找到无空的值为止
               for (var i = (level - 1) ; i >= 0; i--) {

                   if (this.LIST[i]) {
                       url = this.LIST[i];
                       this.LIST.splice(i, this.LIST.length);
                       break;
                   }
               }
           } else if (level == 1) {
               url = this.LIST[level - 1];
               this.LIST = [];
           } else {
               url = this.LIST.pop();
           }
           this.sync_write();
           return url;
       }

    , force_return: function () {

        if (navigator.userAgent.indexOf("Avit-09") == -1) {
            window.location = "file://htmldata/index.htm";
        } else {
            try {
                method.finishWebLauncher();//09盒子返回到桌面
            } catch (e) { }
        }
    }
    /*
    多pop方法，按顺序处理多个返回逻辑，简化返回键的逻辑
    go_task.mpop(["5::domainA"
                    ,"16::domainB"
                    ,"-1"
                    ,"-2"])
    标准pop   层级::域
    内置      -1      河南有线的返回标准V2
              -2      河南有线的返回标准V1
    */
    , mpop: function (arr) {
        var _url = null;

        if (typeof arr == "object") {
            for (var i = 0; i < arr.length; i++) {

                //正常的pop()返回处理
                if (arr[i].indexOf("::") > -1) {
                    var item = arr[i].split("::");
                    _url = this.domain(item[1]).pop(parseInt(item[0]));
                    if (_url != null) {
                        return _url;
                        break;
                    }
                    //返回河南有线的返回标准V2，superRootUrl!=default superRootType==1
                } else if (arr[i] == "-1") {
                    _url = go_task.hncatv_return_check();
                    if (_url != null) {
                        return _url;
                        break;
                    }
                    //返回河南有线的返回标准V1，superRootUrl!=default
                } else if (arr[i].level == "-2") {
                    _url = go_task.return_root();
                    if (_url != null) {
                        return _url;
                        break;
                    }
                }
            }
        }
        return _url;

    }
    , sync_read: function () {


        if (go_task.isEmu) {


            if (go_task.Cookie.exists(this._domain + "super_go_task") &&
                go_task.Cookie.get(this._domain + "super_go_task").indexOf('[!]') > -1
                ) {
                var _p = go_task.Cookie.get(this._domain + "super_go_task").split('[@]');
                for (var i = 0; i < _p.length; i++) {
                    var _s = _p[i].split('[!]');
                    this.LIST[parseInt(_s[0])] = _s[1];
                }
            }


        } else {

            var super_go_task = new Global(this._domain + "super_go_task");
            if (super_go_task.value != 'default' && super_go_task.value.indexOf('[!]') > -1) {
                //0[!]http://*****/asdasd.html[@]
                var _p = super_go_task.value.split('[@]');
                for (var i = 0; i < _p.length; i++) {
                    var _s = _p[i].split('[!]');
                    this.LIST[parseInt(_s[0])] = _s[1];
                }
            }
        }
        return this;
    }
     , sync_write: function () {

         if (this.LIST.length > 0) {

             var val = [];
             for (d in this.LIST) {
                 val.push(d + "[!]" + this.LIST[d]);
             }
             //console.log(val.join('[@]'));
             if (go_task.isEmu) {
                 go_task.Cookie.add(this._domain + "super_go_task", val.join('[@]'));

             } else {
                 var super_go_task = new Global(this._domain + "super_go_task");
                 super_go_task.value = val.join('[@]');
             }
         }

         go_task.sync_g();
         return this;
     }
    , test: function () {
        for (var i = 0; i < 10; i++) {
            if (i % 2 == 0) {
                go_task.set(i, 'http://www.baidu.com?a' + i);
            } else {

            }
        }


        //console.log(" go_task.pop();" +go_task.pop());
        //console.log(" go_task.pop(100);"+ go_task.pop(100));
        //console.log(" go_task.pop(10);"+ go_task.pop(10));
        //console.log("go_task.LIST.length：" + go_task.LIST.length);


        go_task.sync_write();
    }

};

(function () {

    if (isEMU) {

        go_task.isEmu = true;
    }
})();
