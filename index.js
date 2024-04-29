const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware

app.use(cors({
  origin:["https://craftify-art-store.web.app", "http://localhost:5173"],
  credentials: true,
}));
app.use(express.json());

const uri = `mongodb+srv://${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}@cluster0.jvkz9mr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const craftCollection = client.db("craftStoreDB").collection("craftItemDB");
    const categoryCollection = client
      .db("craftCategory")
      .collection("craftCategoryDB");

    app.get("/craftitems", async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/singleItems/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await craftCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(result);
      res.send(result);
    });

    app.get("/mylistitems/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await craftCollection
        .find({ user_email: req.params.email })
        .toArray();
      res.send(result);
    });

    app.get("/updateItem/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await craftCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });



    app.put("/updateInfoo/:id", async (req, res) => {
      console.log(req.params.id);
      const query = { _id: new ObjectId(req.params.id)};
      const options = { upsert: true};
      const data = {
        $set: {
          image: req.body.image,
          item_name: req.body.item_name,
          subcategory_Name: req.body.subcategory_Name,
          description: req.body.description,
          price: req.body.price,
          rating: req.body.rating,
          customization: req.body.customization,
          processing_time: req.body.processing_time,
          stock_status: req.body.stock_status,
        },
      };
      const result = await craftCollection.updateOne(query, data, options);
      console.log(result);
      res.send(result);
    });

    app.post("/craftitems", async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      const result = await craftCollection.insertOne(newItem);
      res.send(result);
    });

    app.delete("/delete/:id", async (req, res) => {
      const result = await craftCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(result);
      res.send(result);
    });

    //category collection
    app.get("/craftcategory", async (req, res) => {
      const cursor = categoryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/categoryItems/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await craftCollection
        .find({
          subcategory_Name: req.params.id,
        })
        .toArray();
      res.send(result);
    });

    app.post("/craftcategory", async (req, res) => {
      const newdata = req.body;
      console.log(newdata);
      const result = await categoryCollection.insertOne(newdata);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("art and craft data running");
});

app.listen(port, () => {
  console.log(`art and craft app on port ${port}`);
});
