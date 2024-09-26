const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.edwy44d.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;

// MongoDB client setup
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const userCollection = client.db('bistroBoss').collection('users');
    const menuCollection = client.db('bistroBoss').collection('menu');
    const reviewCollection = client.db('bistroBoss').collection('reviews');
    const cartCollection = client.db('bistroBoss').collection('carts');

    app.get('/menu', async (req, res) => {
        const result = await menuCollection.find().toArray();
        res.send(result);
    });

    app.get('/reviews', async (req, res) => {
        const result = await reviewCollection.find().toArray();
        res.send(result);
    });

   
    // User-related API
      app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'User already exists', insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // Cart collection APIs
    app.get('/carts', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });
    app.post('/carts', async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });

    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // MongoDB Ping for Connection Confirmation
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } finally {
    // Ensure the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Root route
app.get('/', (req, res) => {
  res.send('Bistro is sitting');
});

// Start the server
app.listen(port, () => {
  console.log(`Bistro is sitting on port ${port}`);
});
