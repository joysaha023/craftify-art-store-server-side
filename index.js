const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}@cluster0.jvkz9mr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const craftCollection = client.db('craftStoreDB').collection('craftItemDB');


    app.get('/craftitems', async(req, res) => {
        const cursor = craftCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get("/singleItems/:id", async (req, res) => {
        console.log(req.params.id);
        const result = await craftCollection.findOne({
            _id: new ObjectId(req.params.id),
        });
        console.log(result);
        res.send(result);
    });

    app.post('/craftitems', async(req, res)=> {
        const newItem = req.body;
        console.log(newItem);
        const result = await craftCollection.insertOne(newItem)
        res.send(result)
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
    res.send('art and craft data running')
})

app.listen(port, () => {
    console.log(`art and craft app on port ${port}`)
})