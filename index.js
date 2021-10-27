const  express = require('express')
const { MongoClient } = require('mongodb');


const ObjectId = require('mongodb').ObjectId


const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;


// middlewire

app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@<cluster-url>?retryWrites=true&writeConcern=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pdjev.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//// step   
async function run() {
    try {
      await client.connect();
      const database = client.db("carMechanic");
      const servicesCollection = database.collection("services");
       
      // GET API 
      app.get('/services' , async(req,res)=> {
          const cursor = servicesCollection.find({})
          const services = await cursor.toArray()
          res.send(services)
      })


       // GET SINGLE SERVICE

       app.get('/services/:id' , async (req,res) => {
             
            const id = req.params.id
            console.log(' Getting Specific Service ' ,id)
            const query = {_id : ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.json(service)
       })

      //POST API 

      app.post('/services', async (req,res)=> {
         
        const service = req.body
        console.log('hit the post api ' ,service)
        
          const result =  await servicesCollection.insertOne(service)
          console.log(result)
          res.json(result)
      });


      //DELETE API 
        app.delete('/services/:id' , async(req,res) => {
          const id = req.params.id 
          const query = {_id:ObjectId(id)}
          const result = await servicesCollection.deleteOne(query)
          res.json(result)
        } ) 


    } finally {
      //await client.close();
    }
  }
  run().catch(console.dir);


app.get('/',  (req,res) => {
    res.send('zzzz')
})

app.get('/z',  (req,res) => {
    res.send('zzzz update here ')
})

app.listen(port ,() => {
    console.log('Running Server On Port ' , port )
} )


  /* 
      
  one time 
  1. heroku  account open
  2. heroku software install 


  Every project 
  1. git init 
  2. .gitignore
  3. push everything to git
  4.make sure you have this script : "start": "node index.js",
  5. make sure  const port = process.env.PORT || 5000;
  6. heroku login
  7. heroku create (only one time for a project)
  8. command : git push heroku main

  -----
  update :

  1. save everything check locally
  2. git add , git commit -m"z"  , git push
  3. git push heroku main

  
  */