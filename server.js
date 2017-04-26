var express=require("express");
var mysql=require("mysql");
var ejs=require("ejs");
var path=require("path");
var app=express();

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'fhnews'
});

connection.connect();

app.set('views', path.join(__dirname,'tpl'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'/static')));

app.get('/', function (req, res) {
    connection.query("select * from category order by id asc",function(error,result){
        category=result;
        res.render("index",{category:result});
    })


});


app.get('/list/:aaa', function (req,res) {
    var cid=req.params.aaa;

    connection.query("select * from category order by id asc",function(error,result){
        connection.query("select * from lists where cid="+cid,function(error,info){
            res.render("list",{info:info,category:result})
        })
    })


});











app.listen(8888);