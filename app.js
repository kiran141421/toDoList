
const express=require('express');
const bodyParser=require('body-parser');

const app=express();

let items=["Buy Food","Cook Food","Eat Food"];
let works=[];

app.set('view engine','ejs');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    let today=new Date();
    
    let options={
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day=today.toLocaleDateString("un-es",options);
    res.render('list', {listTitle:day,listItem:items});
});

app.post("/",function(req,res){

    if(req.body.button=="Work List")
    {
        let work=req.body.newItem;
        works.push(work);

        res.redirect("/work");
    }
    else
    {   
        let item=req.body.newItem;
        items.push(item);

        res.redirect("/");
    }

});

app.get("/work",function(req,res){
    res.render("list",{listTitle:"Work List",listItem:works});
});

// app.post("/work",function(req,res){
//     let work=req.body.newItem;
//     res.redirect("/work");
// });

app.listen(3000,function(){
    console.log("App listening at port 3000");
});