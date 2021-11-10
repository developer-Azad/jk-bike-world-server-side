const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb')

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aymnc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('bike_world');
        const bikesCollection = database.collection('bikes');
        // const usersCollection = database.collection('users');
        
        app.get('/bikes', async(req, res) => {
            const email = req.query.email;
            const query = {email: email}
            const cursor = bikesCollection.find(query);
            const bikes = await cursor.toArray();
            res.json(bikes);
        })

        app.post('/bikes', async(req, res) => {
            const bikes = req.body;
            const result = await bikesCollection.insertOne(bikes);
            console.log(result);
            res.json(result);
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello JK Bike World!')
})

app.listen(port, () => {
    console.log(`Listening at port : ${port}`)
})