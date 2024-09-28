import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';


dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

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
    const userCollection = client.db('BistroDB').collection('users');
    const menuCollection = client.db('BistroDB').collection('menu');
    const reviewCollection = client.db('BistroDB').collection('reviews');
    const cartCollection = client.db('BistroDB').collection('carts');

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
      try {
        const email = req.query.email;
        console.log('Querying carts for email:', email); // Log the email being queried
        const query = { email: email };
        const result = await cartCollection.find(query).toArray();
        console.log('Query result:', result); // Log the query result
        res.send(result);
      } catch (error) {
        console.error('Error fetching carts:', error);
        res.status(500).send('Error fetching carts');
      }
    });
    app.post('/carts', async (req, res) => {
      try {
        const cartItem = req.body;
        console.log('Inserting cart item:', cartItem); // Log the item being inserted
        const result = await cartCollection.insertOne(cartItem);
        console.log('Insert result:', result); // Log the insert result
        res.send(result);
      } catch (error) {
        console.error('Error inserting cart item:', error);
        res.status(500).send('Error inserting cart item');
      }
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
