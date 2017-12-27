let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');


let port = process.env.port || 3000;

let app = express();


app.use(express.static(__dirname + "/public" ));
app.set('view engine', 'ejs');


// DB connection
let redis = require('redis');
let client = redis.createClient();
client.on('connect',function(){
console.log('Redis connected successfully!!!!!');
});
// DB connection end


// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
// body parser end

app.get('/',function(req,res){
   res.render('users');
});

app.post('/users/search',function(req,res){
    let userId = req.body.userId;
    client.hgetall(userId,function(err, data){
        if(!data){
            res.render('users',{message: "No user exist"});
        }else{
            data.userId = userId;
            res.render('users',{users: data});
        }
        
    })
   
});

app.get('/users/add',function(req,res){
    res.render('add-user');
 });


 // hmset command accepts multiple key value at a time and overwrites any specified fields already existing in the hash. If key does not exist, a new key holding a hash is created.
app.post('/users/add',function(req,res){
    let userId = req.body.userId;
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    client.hmset(userId, ["name", name, "email", email, "password", password],function(err,response){
            if(err){
                console.log(err);
            }else{
                console.log(response);
                res.render('add-user',{message: "User added successfully!!!!"});   
            }
    });
    
 });

 app.get('/users/delete/:userId',function(req,res){
    client.del(req.params.userId,function(err,result){
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    });
 });


app.listen(port,function(){
    console.log("Server running at port "+ port);
    });