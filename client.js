var request=require("request");
var cheerio=require("cheerio");
var mysql=require("mysql");
/*
* 1. 要保证代码本身的正确性
*
* 2. 申请成为百度云的开发者
 *
 * 3.  登陆百度开放云
 * 4.  充值
 * 5.  进入应用引擎
 * 6.  添加部署
 * 7.  进入部署界面  进行添加
 *
 * 8.   确定你的域名  选择nodejs(最高版本)引擎  选择需要的内存  点击付款
 *
 * 9.  进入扩展服务 创建mysql
 *
 * 10. 将自己的本地mysql的表结构导入到远程的mysql
 *
 * 11. 回到部署列表，拷贝git地址
 * 12.  在你的本地创建文件，进入文件 ,运行 git clone 地址，将远程的内容拷贝到你的本地
 *
 * 13.  修改package.json  选项"scripts": {
 "start": "node server.js",将以前安装所有的依赖项目配置，拷贝到"dependencies": {}

   14 .  修改端口  18080

   15.  修改你的数据库配置文件 （sereve.js,client.js）

     host : 远程的地址
     port:端口
     user:""
     password:""
     database:"XVwgtByURdZcmIuDrkBo"


     16.  修改一下 server.js 加上一个路由，用来手动爬虫
 app.get('/run', function (req, res) {
 require("./client");
 res.end();

 });

 17.  上传你的代码  git add .
                   git commit -m "dsa"
                   git push


18. 打开首页 运行 爬虫 xinzhou1.duapp.com/run，往数据库里面抓取内容

19. 回到首页，按照正常的流程去访问

*
*
*
* */

var connect=mysql.createConnection({
    host:"localhost",
    port:"3306",
    user:"root",
    password:"root",
    database:"fhnews"
});
connect.connect();
request.get("http://news.ifeng.com/",function(error,head,body){
    var $=cheerio.load(body);
    //1.  获取分类名字  %u8981
    var category=[];
    $("#fixed_box li").each(function(index,obj){
        var str=$(obj).html();
        str=unescape(str.replace(/&#x/g,"%u").replace(/;/g,""));
        category.push(str);
    })
     var num=0;
    for(var i=0;i<category.length;i++){
        connect.query("insert into category (catname) values ('"+category[i]+"')",function(){
            num++;
            if(num==category.length){
                console.log("完美")
            }
        })
    }


    //2.  获取列表的信息
    //  a. 获取娱乐的信息

    var yule=$(".left_co3").next("script").html();


    yule=JSON.parse(yule.slice(yule.indexOf("[")));


   //b. 获取其他信息
    var qita=$(".left_co3").nextAll("script").eq(1).html();
    qita=JSON.parse(qita.slice(qita.indexOf("["),-2));

    qita.splice(2,0,yule);

    for(var i=0;i<qita.length;i++){
        for(var j=0;j<qita[i].length;j++){
            var num=i+1;
           connect.query(`insert into lists (title,url,thumbnail,skey,cid) values ('${qita[i][j].title}','${qita[i][j].url}','${qita[i][j].thumbnail}','${qita[i][j].skey}',${(num)})`,function(error){

           })
        }
    }






});
