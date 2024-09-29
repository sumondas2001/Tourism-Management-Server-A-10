const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const cors = require('cors');


// middleware

app.use(cors());
app.use(express.json());







const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DV_USER}:${process.env.DV_PASS}@cluster0.3y9ux.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
     serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
     }
});

async function run() {
     try {
          // Connect the client to the server	(optional starting in v4.7)
          await client.connect();

          const dataBase = client.db('tourismDB');
          const spotCollection = dataBase.collection('allSpots');

          // add Tourists Spot for data base

          app.post('/addTouristsSpot', async (req, res) => {
               const newTouristsSpot = req.body;
               console.log(newTouristsSpot)
               const result = await spotCollection.insertOne(newTouristsSpot);
               res.send(result);
          });

          app.get('/allTouristsSpot', async (req, res) => {
               const course = spotCollection.find();
               const result = await course.toArray();
               res.send(result)
          });
          app.get('/viewDetails/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: new ObjectId(id) };
               const result = await spotCollection.findOne(query);
               res.send(result);
          })



          // Send a ping to confirm a successful connection
          await client.db("admin").command({ ping: 1 });
          console.log("Pinged your deployment. You successfully connected to MongoDB!");
     } finally {
          // Ensures that the client will close when you finish/error
          // await client.close();
     }
}
run().catch(console.dir);


app.get('/', (req, res) => {
     res.send('Coffee making server is running')
});

app.listen(port, () => {
     console.log(`coffee server running on port : ${port}`)
})
