const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const handlebars = require('express-handlebars');

const app = express();

//configurando o body-parser
const urlencodeParser = bodyParser.urlencoded({extended: false});


//conectando com o banco de dados
const sql = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    port:3306
});
sql.query("use teste");

//configurando template(handlebars)
app.engine("handlebars",handlebars({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//configurando css,js,img 
app.use('/css',express.static('css'));
app.use('/js',express.static('js'));
app.use('/img',express.static('img'));


//Rotas e templates

app.get("/", function(req, res){
    //res.send("Página inicial");
  //res.sendfile(__dirname +"/teste.html");
    res.render('index');
});
/*app.get("/:id", function(req, res){
    /*res.send("Página inicial");
    res.sendfile(__dirname +"/teste.html");
   res.render('index');
  console.log(req.params.id);
  res.render('index',{id: req.params.id});
});*/

app.get("/inserir",function(req,res){
    res.render("inserir");
});

app.post("/controlleradd",urlencodeParser,function(req, res){
    sql.query("insert into usuario values(?,?,?)", [req.body.cpf,req.body.nome,req.body.email]);
    res.render("controlleradd", {nome:req.body.nome});
    //res.send("Cadastro com sucesso");
});

app.get("/select/:cpf?",function(req,res){
    if(!req.params.cpf){
        sql.query("select * from usuario",function(erro,results,fields){
            res.render("select",{data:results});
        });  
    }  
});

app.get("/deletar/:cpf",function(req,res){
    sql.query("delete from usuario where cpf=?",[req.params.cpf]);
    res.render("deletar");
});

app.get("/update/:cpf",function(req,res){
    sql.query("select * from usuario where cpf=?",[req.params.cpf], function(erro,results,fields){
        res.render("update",{cpf:req.params.cpf,nome:results[0].nome,email:results[0].email});
    });
});

app.post("/controllerupdate",urlencodeParser,function(req,res){
    sql.query("update usuario set cpf=?, nome=?,email=? where cpf=?",[req.body.cpf,req.body.nome,req.body.email,req.body.cpf]);
    res.render("controllerupdate");
});





//iniciando servidor http

app.listen(3000, function(req,res){
    console.log('Servidor funcionando!')
});

