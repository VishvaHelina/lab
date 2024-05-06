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
app.post("/", async function(req, res){
    MongoClient.connect(url, function(err, client) {
        if (err) throw err;

        var db = client.db("FSD");

        // Check if the database exists
        db.admin().listDatabases((err, dbs) => {
            if (err) throw err;

            const databaseExists = dbs.databases.some(db => db.name === "FSD");
            if (databaseExists) {
                console.log("Database already exists!");

                // Check if the collection exists
                db.listCollections({ name: "Employee" }).toArray((err, collections) => {
                    if (err) throw err;

                    if (collections.length > 0) {
                        console.log("Collection already exists!");
                    } else {
                        // Create the collection
                        db.createCollection("Employee", function(err, res) {
                            if (err) throw err;
                            console.log("Collection created!");
                        });
                    }
                
                });
            } else {
                console.log("Database does not exist.");
            
            }
        });
    });
});


app.post("/employeesearch", async function(req, res) {
    try {
        let word = req.body.name;
        console.log("Input: " + word);

        const url = 'mongodb://localhost:27017';
        const client = new MongoClient(url);
        const database = 'FSD';

        await client.connect();
        const db = client.db(database);
        
        const query = { name: word };

        const collection = db.collection('Employee');
        const response = await collection.find(query).toArray();

        if (response.length === 0) {
            // If no data is found, send an appropriate message
            throw new Error("Data not found.");
        }

        console.log(response);

        res.send("<h1>Name of the Employee: " + word + "<br>Department: " + response[0].Dept + "</h1>");
    } catch (error) {
        console.error("Error:", error);
        res.status(404).send("Data not found.");
    } 
});
   
      app.post("/employeeinsert", async function(req, res1) {
        try {
            const word = req.body.name;
            const dept = req.body.Dept;
            const doj = req.body.DOJ;
            console.log("Input: " + word + ", " + dept + ", " + doj);
    
            const url = 'mongodb://localhost:27017';
            const client = new MongoClient(url);
            const database = 'FSD';
    
            await client.connect();
            const db = client.db(database);
            
            const document = { name: word, Dept: dept, DOJ: doj };
    
            const collection = db.collection('Employee');
            const result = await collection.insertOne(document);
    
            if (result.insertedCount === 0) {
                throw new Error("Failed to insert data.");
            }
    
            console.log("Data inserted successfully");
    
            res1.send("<h1>Data Inserted successfully</h1>");
        } catch (error) {
            console.error("Error:", error);
            res1.status(500).send("Failed to insert data.");
        } 
    });

    app.post("/employeedel", async function(req, res1) {
        try {
            const word = req.body.name;
            console.log("Input: " + word);
    
            const url = 'mongodb://localhost:27017';
            const client = new MongoClient(url);
            const database = 'FSD';
    
            await client.connect();
            const db = client.db(database);
            
            const query = { name: word };
    
            const collection = db.collection('Employee');
            const result = await collection.deleteOne(query);
    
            if (result.deletedCount === 0) {
                // If no document was deleted, it means the data wasn't found
                throw new Error("Data not found for deletion.");
            }
            res1.send("<h1>Data deleted successfully</h1>");
        } catch (error) {
            console.error("Error:", error);
            res1.status(404).send("Data not found for deletion.");
        } 
    });

    app.post("/employeeupdate", async function(req, res1) {
        try {
            const word = req.body.name;
            const dept = req.body.Dept;
            const doj = req.body.DOJ;
            
            console.log("Input: " + word);
    
            const url = 'mongodb://localhost:27017';
            const client = new MongoClient(url);
            const database = 'FSD';
    
            await client.connect();
            const db = client.db(database);
            
            const query = { name: word };
            const newValues = { $set: { name: word, Dept: dept, DOJ: doj} };
            const collection = db.collection('Employee');
            const result = await collection.updateOne(query, newValues);
            if (result.matchedCount === 0) {
                throw new Error("Data not found for update");
            }
            console.log(result);
            res1.send("<h1>Data updated successfully</h1>");
        } catch (error) {
            console.error("Error:", error);
            res1.status(500).send("An error occurred while updating data: " + error.message);
        } 
    });
app.listen(8020,function(){
    console.log("Server is running on port number 8020")
});
