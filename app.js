
require('dotenv').config()
const express=require('express');
const bodyParser=require('body-parser');
const mongoose= require('mongoose');
const _=require('lodash');

const app=express();

app.set('view engine','ejs');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

mongoose.set('strictQuery', false);

const server=process.env.SERVER;
mongoose.connect(server,{useNewUrlParser: true});

const itemsSchema={
    name: String
};

const listSchema={
    name:String,
    items:[itemsSchema]
};

const Item= mongoose.model("Item",itemsSchema);

const List=mongoose.model("List",listSchema);

const item1= new Item({
    name: "Welcome to your todolist"
});

const item2= new Item({
    name: "Hit the + button to add a new button"
});

const item3= new Item({
    name:"<-- Hit this to strike off the item"
});

const defaultArr=[item1,item2,item3];

let today=new Date();
    
let options={
    weekday: "long",
    day: "numeric",
    month: "long"
};
const day="Today";

app.get("/",function(req,res){

    Item.find({},function(err,foundItems){
        if(foundItems.length==0)
        {
            Item.insertMany(defaultArr,function(err){
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("inserted defaultItems");
                }
            });
            res.redirect("/");
        }
        else
        {
            res.render('list', {listTitle:day,listItem:foundItems});
        }
            
    });
});

app.get('/:customListName',function(req,res){
    const customListName= _.capitalize(req.params.customListName);

    List.find({name:customListName},function(err,foundList){
        if(foundList.length==0)
        {
            const list=new List({
                name:customListName,
                items:defaultArr
            });
        
            list.save();

            res.redirect("/"+customListName);
        }
        else
        {
            res.render('list',{listTitle:foundList[0].name,listItem:foundList[0].items})
        }
    });
});

app.post("/",function(req,res){
   
        let itemTemp=req.body.newItem;
        const temp =new Item({
            name:itemTemp
        });

        const customListName=_.capitalize(req.body.button);

        if(customListName==="Today")
        {
            Item.insertMany([temp]);
            res.redirect("/");
        }
        else
        {
            List.findOne({name:customListName},function(err,foundList){
                foundList.items.push(temp);
                foundList.save();
                res.redirect("/"+customListName);
            });

        }
});

app.post("/delete",function(req,res){   
    const id=req.body.checkbox;
    const listName=_.capitalize(req.body.listName);
    
    if(listName==="Today")
    {   
        Item.deleteOne({_id:id}).catch(function(err){
            console.log(err);
        });
        res.redirect('/');
    }
    else
    {
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:id}}},function(err,results)
        {
            if(err)
            {
                console.log(err);
            }
            else{
                console.log(results);
            }
        });
        res.redirect("/"+listName);
    }
});

app.listen(3000,function(){
    console.log("App listening at port 3000");
});