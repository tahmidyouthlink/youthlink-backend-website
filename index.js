const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT | 5000;
require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n9or6wr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const workCollection = client.db("youthLink").collection("works");
        const blogCollection = client.db("youthLink").collection("blogs");
        const availableJobCollection = client.db("youthLink").collection("availableJobs");
        const applicantCollection = client.db("youthLink").collection("applicants");

        // post a work
        app.post("/addWork", async (req, res) => {
            const workData = req.body;
            const result = await workCollection.insertOne(workData);
            res.send(result);
        })

        // get all works data
        app.get("/allWork", async (req, res) => {
            const result = await workCollection.find().toArray();
            res.send(result);
        })

        // delete single work
        app.delete("/deleteWork/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await workCollection.deleteOne(query);
            res.send(result);
        })

        // get single work info
        app.get("/allWork/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await workCollection.findOne(query);
            res.send(result);
        })

        // edit a single work
        app.patch("allWork/:id", async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            const filter = { new: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    ...body,
                }
            }
            const result = await workCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })

        // post a blog
        app.post("/addBlog", async (req, res) => {
            const result = await blogCollection.insertOne(blogData);
            const blogData = req.body;
            res.send(result);
        })

        // get all blogs data
        app.get("/allBlog", async (req, res) => {
            const result = await blogCollection.find().toArray();
            res.send(result);
        })

        // delete single blog
        app.delete("/deleteBlog/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await blogCollection.deleteOne(query);
            res.send(result);
        })

        // delete
        app.delete("/deleteBlogPerArray/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await blogCollection.deleteOne(query);
            res.send(result);
        })

        // get single blog info
        app.get("/allBlog/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await blogCollection.findOne(query);
            res.send(result);
        })

        // edit a single blog page
        app.patch("allBlog/:id", async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            const filter = { new: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    ...body,
                }
            }
            const result = await blogCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })

        // post a job circular
        app.post("/addJobCircular", async (req, res) => {
            const jobData = req.body;
            const result = await availableJobCollection.insertOne(jobData);
            res.send(result);
        })

        // delete a job circular
        app.delete("/deleteJobCircular/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await availableJobCollection.deleteOne(query);
            res.send(result);
        })

        // view recent job circulars 
        app.get("/allJobCircular", async (req, res) => {
            const result = await availableJobCollection.find().toArray();
            res.send(result);
        })

        // get single job circular
        app.get("/allJobCircular/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await availableJobCollection.findOne(query);
            res.send(result);
        })

        // edit a single job circular
        app.patch("allJobCircular/:id", async (req, res) => {
            const id = req.params.id;
            const body = req.body;
            const filter = { new: ObjectId(id) };
            const updatedDoc = {
                $set: {
                    ...body,
                }
            }
            const result = await workCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })

        // applying a job
        app.post("/applyInJob", async (req, res) => {
            const userData = req.body;
            const result = await applicantCollection.insertOne(userData);
            res.send(result);
        })

        // view job application
        app.get("/viewJobApplication", async (req, res) => {
            const result = await applicantCollection.find().toArray();
            res.send(result);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("YouthLink server is running");
})

app.listen(port, () => {
    console.log(`YouthLink server is running on port ${port}`);
})