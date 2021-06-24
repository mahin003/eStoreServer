const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors= require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
console.log(process.env.DB_USER);
const port = process.env.PORT || 5055 

const ObjectID= require('mongodb').ObjectID
app.use(cors());
app.use(bodyParser.json());

var h= "gfoB9TT6jFehIMwW";
app.get('/', (req, res) => {
  res.send('Hello World!')
})
 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ump4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log('URI ',uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err)
  const collection = client.db("Store").collection("products");
  const userCollection = client.db("Store").collection("userInfo");
  // perform actions on the collection object


app.get("/events", (req,res)=>{
    collection.find().toArray((err,items)=>{
      res.send(items)
      console.log("database ",items)
    })
})


app.get("/chekcout/:id", (req,res)=>{
  const id=ObjectID(req.params.id);
   console.log("checkout ",id);
  collection.findOne((err,product)=>{
      console.log("error extract ",err)
     res.send(product)
    //  console.log("extrected", product);
  })
})

 
app.delete('/deleteItem/:id',(req,res)=>{
   const id=ObjectID(req.params.id);
  //  console.log("dlt ",id);
   collection.findOneAndDelete({_id: id})
   .then(documents=> res.send(!!documents.value))
 })



app.post('/addEvent', (req, res)=>{
     const newEvent = req.body;
    //  console.log("New Event: ",newEvent);
     collection.insertOne(newEvent)
     .then(result=>{
       console.log("Inserted succesfully ", result.insertedCount);
       res.send(result.insertedCount>0);
     })
  })

  app.post('/addUserInfo', (req, res)=>{
    const newEvent = req.body;
    console.log("New Event User: ",newEvent);
    userCollection.insertOne(newEvent)
    .then(result=>{
      console.log("Inserted succesfully order ", result.insertedCount);
      res.send(result.insertedCount>0);
    })
 })

 app.get("/UserOrders/:email", (req,res)=>{
  const email=ObjectID(req.params.email);
  console.log("orer email: ",email)
  userCollection.find({email: email}).toArray((err,items)=>{
    console.log("user ",err)
    res.send(items)
    console.log("database got for order ",items)
  })
})



//   client.close();
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})