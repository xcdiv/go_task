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
var _return_url= go_task.domain("").hncatv_return_check();

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

#go_task 应用开发功能:
##domian(string)
```html
go_task.domain("域")
```

###设定go_task工作的域，可以避免各个业务之间调用返回地址的时候发生冲突。

举例：按照业务应用的层级

1   一般规划为应用的首页也就是一级
2   一般规划为二级栏目
3   一般规划为二级栏目下的列表页
4   一般规划为列表页下的详细页面

####那么用户访问的顺序为1->2->3->4

```flow
begin=>start: 一般规划为应用的首页
t2=>operation: 一般规划为二级栏目
t3=>operation: 一般规划为二级栏目下的列表页
en=>end: 一般规划为列表页下的详细页面

begin->t2->t3->en
 
```
####返回为4->3->2->1

```flow
begin=>start: 一般规划为应用的首页
t2=>operation: 一般规划为二级栏目
t3=>operation: 一般规划为二级栏目下的列表页
en=>end: 一般规划为列表页下的详细页面

en->t3->t2->begin
 
```

但是首页上可能直接推荐4级栏目的内容，则会出现1->4的情况，这样业务就需要单独定制。
如果出现推荐专题的情况，则会出现1->3->4的业务形态，那么业务的返回逻辑又需要定制。

如果业务分七层，而2，3，4，5层都有可能是二级栏目或内容列表页，着就会出现更多的业务返回定制逻辑。

go_task就可以解决这个问题，通过push()和pop()就可以解决业务的动态层级返回问题

##push(int,string)
##本页跳转之前提交返回地址

```html
go_task.domain("域").push(等级,”http://返回地址“）

```
###等级 int
从1到int(max-1)

###返回地址
string的标准url即可

##pop(int)
##提交当前页面等级，返回应该跳转的登记地址

```html
go_task.domain("域").pop(当前页面等级）

```
###等级 int
从1到int(max)


###返回 string 或 null
string表示push存储的url地址，如果返回null表示无返回地址

##等级规划案例

例如：某应用业务

                    
### 绘制表格 Tables
 
----

|等级        |介绍                                                                 |跳转记录                                   |获取返回地址                      |
|----------|:-------------:|------:| ------:| 
|1           |首页随机推荐3~7级下所有的节目                                        |go_task.domain("应用名称").push(1,url)     |默认返回                          |
|2           |二级栏目首页推荐此栏目下的节目                                       |go_task.domain("应用名称").push(2,url)     |go_task.domain("应用名称").pop(2) |
|2           |专题首页推荐专题的节目                                               |go_task.domain("应用名称").push(2,url)     |go_task.domain("应用名称").pop(2) |
|3           |所有专题的列表                                                       |go_task.domain("应用名称").push(3,url)     |go_task.domain("应用名称").pop(3) |
|4           |具体专题首页                                                         |go_task.domain("应用名称").push(4,url)     |go_task.domain("应用名称").pop(4) |
|5           |具体专题的节目列表                                                   |go_task.domain("应用名称").push(5,url)     |go_task.domain("应用名称").pop(5) |
|6           |具体专题的节目列表下的某个节目的介绍详细页面                         |go_task.domain("应用名称").push(6,url)     |go_task.domain("应用名称").pop(6) |
|6           |*具体专题的节目列表下的某个节目可能也是专题                          |go_task.domain("应用名称").push(6,url)     |go_task.domain("应用名称").pop(6) |
|7           |*具体专题的节目列表下的某个节目->专题的某个节目的介绍详细页面        |go_task.domain("应用名称").push(7,url)     |go_task.domain("应用名称").pop(7) |
----


###这样可以支持几种情况：


###1、在首页直接和二级页面调用6级页面，返回容易冲突。按照此方法，由于首页跳转的时候仅仅记录了push(1,url)的地址，而6级页面采用pop(6)查查找时(2~5)的等级都是null，而只有1级有数据则会直接跳转。

###2、二级栏目首页和专题首页两个栏目之前跳转了4到5回，再访问某个节目的时候会按照最新覆盖原则执行push(2,url)，这样pop(6)查查找时(3~5)的等级都是null，同时只获取最后一次覆盖push(2,url)的地址，防止先返回专题首页再会二级栏目首页的尴尬问题（标准histroy.back(-1)则只能按访问顺序返回）。

###3、按照正常流程1->2->3->4->5->6->7执行了push(n,url)的记录，那么当7->2级页面调用pop()返回的时候就会按照顺序返回。


##mpop(array)
##提交当前页面多个pop配置，按顺序返回应该跳转的登记地址

```javascript
go_task.mpop(["5::domainA"
                    ,"16::domainB"
                    ,"-1"
                    ,"-2"])

```
###传入参数
标准pop   层级::域
内置      -1      河南有线的返回标准V2
          -2      河南有线的返回标准V1
 

###返回 string 或 null
string表示push存储的url地址，如果返回null表示无返回地址