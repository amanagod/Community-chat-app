const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
// const BodyParser = require("body-parser");
const { v4: uuidv4}=require("uuid");
var methodOverride = require("method-override");
const mysql = require("mysql2");
require("dotenv").config();


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));



////////////////////////////////////////////////////// database connection
const urldb =`mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`;
const connection = mysql.createConnection(urldb);

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     database: 'quora',
//     password:"",
//   }); 
  

//  connection.end();

///////////////////////////////////////////////////////////all posts 
app.get("/posts",(req,res)=>{
    try{  connection.query("select * from posts",(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.render("index.ejs",{result,port});
    });
     } catch(err){
         console.log(err);
         res.send("some error happend"+err);
     }


// res.send("server working ");
});

//////////////////////////////////////// create
app.get("/posts/new",(req,res)=>{

    res.render("new.ejs");
});

app.post("/posts",(req,res)=>{
    
    let{username,content}=req.body;
    let id =uuidv4();
    // posts.push({username,content,id});
    
    let q = `insert into posts values("${id}","${username}","${content}")`;
    try{  connection.query(q,(err,result)=>{
      if(err) throw err;
      console.log(result);
    });
   } catch(err){
       console.log(err);
   }

//     try{  connection.query("select * from posts",(err,result)=>{
//     if(err) throw err;
//     console.log(result);
//   });
//  } catch(err){
//      console.log(err);
//  }


    res.redirect("/posts");
});
//////////////////////////////////////////////// view in detail
app.get("/posts/:id",(req,res)=>{

    let {id} = req.params;
// console.log(id);

try{  connection.query(`select * from posts where id = "${id}";`,(err,result)=>{
    if(err) throw err;
    console.log(result);
    res.render("show.ejs",{ result });

});
 } catch(err){
     console.log(err);
 }

// let post = posts.find((p)=> id == p.id);
// console.log(post);
// res.send("hii received");
});


//////////////////////////////////////////// update
app.get("/posts/:id/edit",(req,res)=>{
    let {id} = req.params;
    // let post =posts.find((x)=>id==x.id);
    try{  connection.query(`select * from posts where id = "${id}";`,(err,result)=>{
        if(err) throw err;
        console.log(result);
        res.render("edit.ejs",{result});    
    });
     } catch(err){
         console.log(err);
     }
});

app.patch("/posts/:id",(req,res)=>{
    let {id} = req.params;
    // console.log(id);
    let newcontent=req.body.content;
    // console.log(newcontent);
    // let post =posts.find((x)=>id==x.id);
    // post.content=newcontent;
    // console.log(post);
    let q =`update posts set content = "${newcontent}" where id = "${id}" `;
    try{  connection.query(q,(err,result)=>{
        if(err) throw err;
        console.log(result);
    });
     } catch(err){
         console.log(err);
     }
    
    
    // res.send("request received");
    res.redirect("/posts");
});

///////////////////////////////////////// delete
app.delete("/posts/:id",(req,res)=>{
    let {id}=req.params;
    //  posts=posts.filter((p)=>id !==p.id);
     
     let q =`delete from posts where id = "${id}"; `;
     try{  connection.query(q,(err,result)=>{
         if(err) throw err;
         console.log(result);
     });
      } catch(err){
          console.log(err);
      }


   res.redirect("/posts");
});
///////////////////////////////////////////// server list
app.listen(port,()=>{
    console.log("server working on port "+port);
    });
    