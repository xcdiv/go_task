# go_task
#注意当使用正式环境的时候是不采用Cookie的请把go_task.js里面的
var isEMU = true;
改为
var isEMU = false;

#河南有线做CP/SP集成的时候，如果有推荐功能则按一下流程处理
```html
<script src="go_task.js"></script>
```
#在索引页或者详细页的返回专题页的时候：
```html
var _return_url= go_task.hncatv_return_check();

if(_return_url==null){
//按照默认逻辑跳转
}
else{
//按照 _return_url 的地址跳转
}
```


#在索引页或者详细页的返回机顶盒首页的时候：
```html
var _root_url = go_task.return_root();

if (_root_url == null) {
    //按照默认逻辑跳转
}
else {
    //按照 _root_url的地址跳转
}
```
