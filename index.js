const express = require('express');
const app = express();

const cors = require('cors');
require('dotenv').config();

const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

//middleWire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aymnc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('bike_world');
        const bikesCollection = database.collection('bikes');
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');
        const ordersCollection = database.collection('orders');
        
        //Get api for bikes
        app.get('/bikes', async(req, res) => {
            const email = req.query.email;
            const query = {email: email}
            const cursor = bikesCollection.find(query);
            const bikes = await cursor.toArray();
            res.json(bikes);
        })

        //get api for single bike
        app.get('/bikes/:id', async(req, res) => {
            const id = req.params.id;
            console.log('bike id', id);
            const query = {_id: ObjectId(id)};
            const bike = await bikesCollection.findOne(query);
            res.json(bike);
        })

        //Get api for Review
        app.get('/reviews', async(req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.json(reviews);
        })

        //get api for users
        app.get('/users', async(req, res) => {
            const cursor = usersCollection.find({});
            const user = await cursor.toArray();
            res.json(user);
        })

        // Get api for all orders
        app.get('/orders', async(req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders);
        })

        //get api for user orders
        app.get('/orders/user', async(req, res) => {
            const email = req.query.email;
            const query = {email: email}
            const cursor = ordersCollection.find(query);
            const order = await cursor.toArray();
            res.json(order);
        })

        //post api for bikes
        app.post('/bikes', async(req, res) => {
            const bikes = req.body;
            const result = await bikesCollection.insertOne(bikes);
            res.json(result);
        })

        //post api for users
        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            // console.log(result);
            res.json(result);
        })

        //post api for orders
        app.post('/orders', async(req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            // console.log(result);
            res.json(result);
        })

        //post api for review
        app.post('/reviews', async(req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            console.log(result);
            res.json(result);
        })

        //put api for users
        app.put('/users/admin', async(req, res) => {
            const user = req.body;
            const filter = {email: user.email};
            const updateDoc = {$set: {role: 'admin'}};
            const result = await usersCollection.updateOne(filter, updateDoc);
            console.log(result);
            res.json(result);
        })

        //put api for orders
        app.put('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const updatedOrder = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updateDoc = {$set: {status: updatedOrder.status
            },
        };
            const result = await ordersCollection.updateOne(filter, updateDoc, options);
            console.log(result);
            res.json(result);
        })

        app.delete('/bikes/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await bikesCollection.deleteOne(query);
            console.log('deleted products id : ', result);
            res.json(result);
        })

        app.delete('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            console.log('deleted products id : ', result);
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