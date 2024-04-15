const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        //database collection end.

        //all toys data start----
        app.get('/allToys', async (req, res) => {
            const options = {

                projection: {

                    toy_name: 1,
                    seller_name: 1,
                    price: 1,
                    quantity: 1,
                    subcategory: 1
                },
            };

            // const cursor = toyCollection.find(options);
            const result = await toyCollection.find({}, options).toArray();
            res.send(result);
        })

        //all toys data end----

        //single toy data start----
        app.get('/singleToy', async (req, res) => {
            const options = {
                projection: {
                    photo_url: 1,
                    toy_name: 1,
                    seller_name: 1,
                    seller_email: 1,
                    price: 1,
                    rating: 1,
                    quantity: 1,
                    description: 1,
                },
            };

            // const cursor = toyCollection.find(options);
            const result = await toyCollection.findOne({}, options);
            res.send(result);
        })

        //single toy data end----

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