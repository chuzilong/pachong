var request=require("request");
var cheerio=require("cheerio");
var mysql=require("mysql");

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
