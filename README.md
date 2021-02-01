## 项目说明文件

- 基于express 搭建
- 后台ui使用layui
- 使用的技术 layui+jquery+aysnc/awit



## 运行项目

1. `npm i ` 安装项目所有的依赖项
2. 打开`data`导入sql文件，在修改config/db.json数据库配置信息。
3. 执行`npm run serve` 启动项目
4. 这是在github上面手动修改的，需要执行git pull 进行拉取
5. again


## 加入进度条 NProgress

- 在网页加载完毕之前加载进度条，加载完毕取消进度条即可
```
    function startNProgress(){
        NProgress.set(0.4);// 默认设置40% NProgress.set(0) 等价与 NProgress.start()
        let interval = setInterval(function(){
            NProgress.inc(); // 以小量递增
        },200)

        $(window).on('load',()=>{
            clearInterval(interval)
            NProgress.done()
        })
    }

    startNProgress();
```

> 高版本的jquery不支持 ` $(window).on('load')`的写法，改为on绑定即可. [参考](https://www.jianshu.com/p/d1269761bd0a)


## 文章编辑

- 1.先实现数据在表单中的回显，要获取到文章的id去发起请求获取数据
- 2.实现update入库 



## 集成富文本编辑器wangEditor

- [官网](https://www.wangeditor.com/)
- [文档](https://doc.wangeditor.com/)

- 初始化
```html
<body>
    <div id="div1"></div>
</body>
<script src="https://cdn.jsdelivr.net/npm/wangeditor@latest/dist/wangEditor.min.js"></script>
<script type="text/javascript">
    const E = window.wangEditor
    const editor = new E('#div1')
    editor.config.uploadImgShowBase64 = true; // 可以实现手动上传图片(转换成base64格式)
    // 或者 const editor = new E( document.getElementById('div1') )
    editor.create()
</script>
```
- [获取和设置内容api](https://doc.wangeditor.com/pages/02-%E5%86%85%E5%AE%B9%E5%A4%84%E7%90%86/03-%E8%8E%B7%E5%8F%96html.html)


## 防止用户翻墙访问（需要做权限验证）

说明： 有些路由需要登录后台有权限之后才可以进行操作，有session就说明有权限。

思考问题：哪些路由需要判断权限防翻墙，哪些不需要验证权限（放行）？

- 基本只要进入到后台执行的路由都需要权限验证
- 在系统外面的路由就不需要验证即放行。如： `/login` , `/singin` , `/logout` 出来这三个之外其他路由都需要权限验证

所以我可以定义一个中间件，在路由请求之前获取当前路由判断是否有权限
```js

// 定义中间件，托管静态资源
app.use('/public',express.static(path.join(__dirname,'public')));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));


// 在进入到路由匹配函数之前，要进行验证权限
app.use(function(req,res,next){
    // 1.获取当前访问路由
    let path = req.path.toLowerCase();
    // 2. 定义放行的路由，即不需要权限验证
    let noCheckAuth = ['/login','/signin','/logout']
    if(noCheckAuth.includes(path)){
        // 需要放行,不做任何限制
        next();
    }else{
        // 不在放行之外，需要验证权限（session）
        // addArt
        if(req.session.userInfo){
            // 有权限，可以继续操作
            next()
        }else{
            res.redirect('/login')
        }
    }
});

// 使用路由中间件 req.body
app.use(router)
```

## 数据可视化-echarts使用

- 基本步骤
- 文档：https://echarts.apache.org/zh/api.html#echarts 
- 快速入门建议查看菜鸟教程：https://www.runoob.com/echarts/echarts-tutorial.html
- 熟悉基本使用之后，再去看官网api手册

如下基本用法：
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>第一个 ECharts 实例</title>
    <!-- 引入 echarts.js -->
    <script src="https://cdn.staticfile.org/echarts/4.3.0/echarts.min.js"></script>
</head>
<body>
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <div id="main" style="width: 1000px;height:400px;"></div>
    <script type="text/javascript">
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
 
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: 'xx店铺销量清空'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子","内裤",'球鞋']
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20,100,2000]
            }]
        };
 
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    </script>
</body>
</html>
```

具体参数[查看文档](https://echarts.apache.org/zh/api.html#echarts )

- 需求1：统计出每个分类的总文章数
```sql
SELECT
	count(*) total,
	t2. NAME,
	t1.cat_id
FROM
	article t1
LEFT JOIN category t2 ON t1.cat_id = t2.cat_id
GROUP BY
	t1.cat_id;
```
- 需求2：统计出每月的文章数 
> 需要掌握mysql常用的一些内置时间函数，如：时间戳、日期、年月日时分秒，及他们互相转换。

```
mysql 常用内置函数

参考： https://www.runoob.com/mysql/mysql-functions.html 

执行函数：

    select 函数名();

常用函数：

- count(*)  或 count(字段名)： 求查询的总记录数
- max(字段名)： 求某个字段的最大值
- min(字段名)： 求某个字段的最小值
- avg(字段名)： 求某个字段的平均值
- sum(字段名)： 求某个字段的总和

上面几个函数可以叫统计函数或聚合函数。

- year(date): 获取日期的年份上
- month(date): 获取日期的月份
- day(date): 获取日期中月份中的day。
- date(date): 获取日期的年月日
- hour(date): 获取日期的小时数
- minute(date): 获取日期的分钟数
- second(date): 获取日期的秒数
- curtime(date): 获取日期的时分秒
- curdate(): 获取当前日期的年月日
- unix_timestamp([date]); 获取当前日期的时间戳，也可把日期date转化为时间戳格式.
- current_timestamp(): 获取当前的日期时间（年月日时分秒）。 或 now()
- DATE_FORMAT（日期时间，格式） 
- FROM_UNIXTIME（时间戳，格式） 

上面常见日期处理函数


```

- 案例：
```
# 获取今年（当前年）一月份发布的文章
select title,publish_date from article where month(publish_date) = 1 and year(publish_date) = year(now())

#  获取今年（当前年）一月份发布的文章总数
select month(publish_date) month,count(*) as total from article where month(publish_date) = 1 and year(publish_date) = year(now())

# 获取今年（当前年）每月份发布的文章总数
SELECT
	MONTH (publish_date) MONTH,
	count(*) AS total
FROM
	article
WHERE
	YEAR (publish_date) = YEAR (now())
GROUP BY
	MONTH (publish_date)


# 字符串拼接
select CONCAT(month(publish_date),'月') month,count(*) as total from article  where year(publish_date) = year(now()) group by month(publish_date)
```

## mysql模糊查询
```sql
# 模糊查询:   字段名  like   '%a%'
# %fs%    查询标题含有 fs字符 
# fs%    查询标题以fs字符 开头
# %fs    查询标题以fs字符 结尾
select title,status from article where 1 and  title like '%b%' and status = 0;
```
> where 1 仅仅是为了拼接多个查询条件，从而避免没有查询条件时的出错。


## 更新用户最后的登录时间

登录系统之后，在首页显示当前用户，并提示最后的登录时间。

实现思路：
- 用户登录成功之后，即把当前的时间更新到用户表的last_login_date字段
