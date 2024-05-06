const express=require('express')
const {MongoClient} = require('mongodb');
const bodyParser=require('body-parser');
const app=express();
const cors=require('cors')
app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({
 extended:true
}))
app.get("/dictsearch",async function(req,res){
 let word=req.query.word; 
 console.log("Input"+word)
 const url = 'mongodb://localhost:27017';
 const client = new MongoClient(url);
 const database = 'Dictionary';
 let result = await client.connect();
 let db = result.db(database);
 var query = { word: word };
 let collection = db.collection('words');
 let response = await collection.find(query).toArray();
 console.log(response);
 res.send("<h1> Meaning of the word "+word+" is "+response[0].meaning+"</h1>");
 });
app.listen(8000,function(){
 console.log("Server is running on port number 8000")
});