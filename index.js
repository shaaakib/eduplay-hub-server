const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lrzr3ao.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect((err) => {
      if (err) {
        console.log(err);
        return;
      }
    });

    // await client.connect();

    const toysCollection = client.db('toysDB').collection('toys');

    app.get('/toys', async (req, res) => {
      let query = {};
      if (req.query?.category) {
        query = { category: req.query.category };
      }
      if (req.query?.email) {
        query = { seller_email: req.query.email };
      }
      const result = await toysCollection.find(query).limit(20).toArray();

      res.send(result);
    });

    app.post('/toys', async (req, res) => {
      const addToys = req.body;
      const result = await toysCollection.insertOne(addToys);
      res.send(result);
    });

    app.get('/toys/:id', async (req, res) => {
      const id = req.params;
      console.log('single data', id);
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    app.put('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedToy = req.body;
      const toy = {
        $set: {
          picture: updatedToy.picture,
          toy_name: updatedToy.toy_name,
          seller_name: updatedToy.seller_name,
          seller_email: updatedToy.seller_email,
          price: updatedToy.price,
          rating: updatedToy.rating,
          quantity: updatedToy.quantity,
          description: updatedToy.description,
          category: updatedToy.category,
        },
      };

      const result = await toysCollection.updateOne(filter, toy, options);
      res.send(result);
    });

    app.delete('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('EduPlay-Hub is running');
});

app.listen(port, () => {
  console.log(`EduPlay-Hub server is running on port ${port}`);
});
