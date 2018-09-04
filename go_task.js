
//======================测试函数=========================//
var _gp = {
    __debug: ""

};
var getPgt = function () {

    return "";
};
var isEMU = true;

//======================测试函数=========================//

//#################################
//# 增强的portalms模板返回逻辑    #
//#################################
var go_task = {
    version: 1.3
    , isEmu: false
    , _domain: ""
    , domain: function (val) {
        this._domain = val;

        return this;
    }
    , replaceParam: function (val) {

        val = val.replace(/#DEBUG#/gi, _gp.__debug);
        val = val.replace(/#PGT#/gi, getPgt());
        val = val.replace(/#TVN#/gi, getTVN());
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
        var gvarRootUrl = new Global("superRootUrl");

        if (gvarRootUrl.value != '' && gvarRootUrl.value != 'default') {
            return gvarRootUrl.value;
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
           gvarRootUrl.value = 'default';
           gvarRootType.value = 'default';
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
    /*
    go_task.mpop([])
    */
    , mpop: function (arr) {
        var _url = null;

        if (typeof arr == "object") { 
            for (var i = 0; i < arr.length; i++) {

                _url = this.domain(arr[0]).pop(arr[1]);
                if (_url != null) {

                    return _url;
                    break;
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
