const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

//mongodb-start

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.pizauii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        //database collection start

        const toyCollection = client.db("toy").collection("toyCollection");

        //database collection end

        //get toys collection number start

        app.get('/totalToys', async (req, res) => {
            const result = await toyCollection.estimatedDocumentCount();
            res.send({ totalToysNum: result });
        });

        //get toys collection number end

        // ----get all toys data start----

        app.get('/allToys', async (req, res) => {
            const sort = req.query.sort;
            const search = req.query.search;
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);

            let query = {}
            if (req.query?.email) {
                query = { seller_email: req.query.email }
            }

            if (req.query?.search) {
                query = {
                    toy_name: { $regex: search, $options: 'i' }
                }
            }

            const skip = page * limit;
            const options = {
                sort: { "price": sort === 'ascending' ? 1 : -1 }
            }
            const result = await toyCollection.find(query, options).skip(skip).limit(limit).toArray();
            res.send(result);
        })

        // ----get all toys data end----

        // ----get all toys data by subCategory start----

        // app.get('/toysBySubcategory/:subcategory', async (req, res) => {
        //     const subcategory = req.params.subcategory;
        //     const query = { subcategory: subcategory };
        //     const options = {
        //         projection: { photo_url: 1, toy_name: 1, rating: 1, price: 1, details: 1 },
        //     };

        //     const result = await toyCollection.find(query, options).toArray();
        //     res.send(result);
        // })

        // ----get all toys data by subCategory end----
        // ----get all toys data by subCategory start----

        app.get('/toysBySubcategory', async (req, res) => {
            const result = await toyCollection.find().toArray();
            res.send(result);
        })

        // ----get all toys data by subCategory end----


        // get single toy data start----

        app.get('/allToys/:_id', async (req, res) => {
            const _id = req.params._id;
            const query = { _id: new ObjectId(_id) }
            const options = {
                projection: { photo_url: 1, toy_name: 1, seller_name: 1, seller_email: 1, price: 1, rating: 1, quantity: 1, description: 1, subcategory: 1 },
            };

            const result = await toyCollection.findOne(query, options);
            res.send(result);
        })

        // get single toy data end----

        // post all toys data start
        app.post('/allToys', async (req, res) => {
            const data = req.body;
            const result = await toyCollection.insertOne(data);
            res.send(result);
        })

        // post all toys data end

        // put specific toy data start

        app.put('/allToys/:_id', async (req, res) => {
            const _id = req.params._id;
            const filter = { _id: new ObjectId(_id) }
            const options = { upsert: true }
            const updatedToyData = req.body;

            const result = await toyCollection.updateOne(filter, { $set: updatedToyData });
            res.send(result);
        })

        // put specific toy data end

        // delete specific toy data start

        app.delete('/allToys/:_id', async (req, res) => {
            const _id = req.params._id;
            const query = { _id: new ObjectId(_id) };
            const result = await toyCollection.deleteOne(query);
            res.send(result);
        })

        // delete specific toy data end

        // Send a ping to confirm a successful connection

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

//mongodb-end

app.get('/', (req, res) => {
    res.send('server is running huuuuuuuuuuu')
})

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);
})
