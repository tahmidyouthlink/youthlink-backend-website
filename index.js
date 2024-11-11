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
    const userCollection = client.db("youthLink").collection("users");
    const workCollection = client.db("youthLink").collection("works");
    const blogCollection = client.db("youthLink").collection("blogs");
    const availableJobCollection = client.db("youthLink").collection("availableJobs");
    const skillsCollection = client.db("youthLink").collection("skills");
    const workKeywordCollection = client.db("youthLink").collection("workKeywords");
    const blogKeywordCollection = client.db("youthLink").collection("blogKeywords");
    const workCategoryCollection = client.db("youthLink").collection("workCategory");
    const blogCategoryCollection = client.db("youthLink").collection("blogCategory");
    const careerCategoryCollection = client.db("youthLink").collection("careerCategory");
    const applicantCollection = client.db("youthLink").collection("applicants");

    // searching skills
    app.get("/allSkills/:name", async (req, res) => {
      try {
        const name = req.params.name;

        // Function to escape special characters in a string for use in a regular expression
        function escapeRegExp(string) {
          return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        }

        const escapedName = escapeRegExp(name);
        const regex = new RegExp(escapedName, 'i'); // Creating a regex with 'i' flag for case-insensitive search

        const result = await skillsCollection.find({ allSkills: { $regex: regex } }, { projection: { allSkills: 1 } }).toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    // searching work keyword
    app.get("/workKeywords/:keyword", async (req, res) => {
      try {
        const keyword = req.params.keyword;

        // Function to escape special characters in a string for use in a regular expression
        function escapeRegExp(string) {
          return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        }

        const escapedKeyword = escapeRegExp(keyword);
        const regex = new RegExp(escapedKeyword, 'i'); // Creating a regex with 'i' flag for case-insensitive search

        const result = await workKeywordCollection.find({ workKeywords: { $regex: regex } }, { projection: { workKeywords: 1 } }).toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    // searching work category
    app.get("/workCategory/:category", async (req, res) => {
      try {
        const category = req.params.category;

        // Function to escape special characters in a string for use in a regular expression
        function escapeRegExp(string) {
          return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        }

        const escapedCategory = escapeRegExp(category);
        const regex = new RegExp(escapedCategory, 'i'); // Creating a regex with 'i' flag for case-insensitive search

        const result = await workCategoryCollection.find({ workCategory: { $regex: regex } }, { projection: { workCategory: 1 } }).toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    // searching blog category
    app.get("/blogCategory/:category", async (req, res) => {
      try {
        const category = req.params.category;

        // Function to escape special characters in a string for use in a regular expression
        function escapeRegExp(string) {
          return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        }

        const escapedCategory = escapeRegExp(category);
        const regex = new RegExp(escapedCategory, 'i'); // Creating a regex with 'i' flag for case-insensitive search

        const result = await blogCategoryCollection.find({ blogCategory: { $regex: regex } }, { projection: { blogCategory: 1 } }).toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    // Route to get all blog keywords
    app.get("/allBlogKeywords", async (req, res) => {
      try {
        const result = await blogKeywordCollection.find().toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send('Error retrieving blog keywords');
      }
    });

    // POST route to publish new blog keywords
    app.post("/publishBlogKeywords", async (req, res) => {
      const { keywords } = req.body;

      // Get current keywords from the database
      const existingKeywords = await blogKeywordCollection.find().toArray();
      const existingKeywordNames = existingKeywords.map(item => item.blogKeywords);

      // Filter to include only new keywords not present in the database
      const newKeywords = keywords.filter(keyword => !existingKeywordNames.includes(keyword));

      if (newKeywords.length > 0) {
        // Prepare new keyword objects with the same structure as `allBlogKeywords`
        const newKeywordDocs = newKeywords.map(keyword => ({ blogKeywords: keyword }));

        // Insert new keyword objects to the collection
        const result = await blogKeywordCollection.insertMany(newKeywordDocs);
        res.send({ message: 'New keywords added', result });
      } else {
        res.send({ message: 'No new keywords to add' });
      }
    });

    // get all blog categories
    app.get("/allBlogCategories", async (req, res) => {
      try {
        const result = await blogCategoryCollection.find().toArray();
        res.send(result);
      } catch (err) {
        res.status(500).send('Error retrieving blog categories');
      }
    });

    // POST route to publish new blog categories
    app.post("/publishBlogCategories", async (req, res) => {
      const { categories } = req.body;

      // Get current categories from the database
      const existingCategories = await blogCategoryCollection.find().toArray();
      const existingCategoryNames = existingCategories.map(item => item.blogCategory);

      // Filter to include only new categories not present in the database
      const newCategories = categories.filter(category => !existingCategoryNames.includes(category));

      if (newCategories.length > 0) {
        // Prepare new category objects with the same structure as `allBlogCategories`
        const newCategoryDocs = newCategories.map(category => ({ blogCategory: category }));

        // Insert new category objects to the collection
        const result = await blogCategoryCollection.insertMany(newCategoryDocs);
        res.send({ message: 'New category added', result });
      } else {
        res.send({ message: 'No new categories to add' });
      }
    });

    // searching career category
    app.get("/careerCategory/:category", async (req, res) => {
      try {
        const category = req.params.category;

        // Function to escape special characters in a string for use in a regular expression
        function escapeRegExp(string) {
          return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        }

        const escapedCategory = escapeRegExp(category);
        const regex = new RegExp(escapedCategory, 'i'); // Creating a regex with 'i' flag for case-insensitive search

        const result = await careerCategoryCollection.find({ careerCategory: { $regex: regex } }, { projection: { careerCategory: 1 } }).toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    // searching blog keyword
    app.get("/blogKeywords/:keyword", async (req, res) => {
      try {
        const keyword = req.params.keyword;

        // Function to escape special characters in a string for use in a regular expression
        function escapeRegExp(string) {
          return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        }

        const escapedKeyword = escapeRegExp(keyword);
        const regex = new RegExp(escapedKeyword, 'i'); // Creating a regex with 'i' flag for case-insensitive search

        const result = await blogKeywordCollection.find({ blogKeywords: { $regex: regex } }, { projection: { blogKeywords: 1 } }).toArray();
        res.send(result);
      } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });

    // post user information
    app.post("/user", async (req, res) => {
      const userData = req.body;
      const result = await userCollection.insertOne(userData);
      res.send(result);
    })

    // checks admin or user
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const findUser = await userCollection.findOne(query);
      const isAdmin = findUser?.role === "admin";
      res.send({ isAdmin });
    });

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

    //update a single work
    app.put("/allWork/:id", async (req, res) => {
      const id = req.params.id;
      const work = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateWork = {
        $set: {
          ...work,
        }
      }
      const result = await workCollection.updateOne(filter, updateWork);
      res.send(result);
    })

    // checking work status
    app.get("/checkedWork", async (req, res) => {
      const result = await workCollection.find({ status: { $eq: "checked" } }).toArray();
      res.send(result);
    })

    // under review work status
    app.get("/reviewWork", async (req, res) => {
      const result = await workCollection.find({ status: { $eq: "pending" } }).toArray();
      res.send(result);
    })

    // pending to check work status
    app.patch("/checkedWork/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "checked",
        },
      };
      const result = await workCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    // post a blog
    app.post("/addBlog", async (req, res) => {
      const blogData = req.body;
      const result = await blogCollection.insertOne(blogData);
      res.send(result);
    })

    // get all blogs data
    app.get("/allBlog", async (req, res) => {
      const result = await blogCollection.find().toArray();
      res.send(result);
    })

    // Getting titles
    // app.get("/blogTitle/:keywords", async (req, res) => {
    //   try {
    //     const keywordsJSON = req.params.keywords;
    //     const keywords = JSON.parse(decodeURIComponent(keywordsJSON));

    //     // Aggregation pipeline to match keywords and project only titles
    //     const matchedKeywords = await blogCollection.aggregate([
    //       { $unwind: "$keyword" }, // Split the keywords array into separate documents
    //       {
    //         $match: {
    //           "keyword.label": { $in: keywords.map(kw => kw.label) }, // Match labels
    //           "keyword.value": { $in: keywords.map(kw => kw.value) } // Match values
    //         }
    //       },
    //       { $group: { _id: "$_id", titles: { $addToSet: "$title" } } } // Group by _id and collect unique titles
    //     ]).toArray();

    //     // Extract titles from the matched documents
    //     const titles = matchedKeywords.flatMap(item => item.titles);

    //     res.json({
    //       data: titles
    //     });
    //   } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ message: 'Server Error' });
    //   }
    // });

    // Getting just matched titles - 2 
    app.get("/blogTitle/:keywords", async (req, res) => {
      try {
        const keywordsJSON = req.params.keywords;
        const keywords = JSON.parse(decodeURIComponent(keywordsJSON));

        const matchedBlogs = await blogCollection.aggregate([
          {
            $match: {
              "keyword": {
                $all: keywords.map(kw => ({ $elemMatch: { label: kw.label, value: kw.value } }))
              }
            }
          },
          {
            $project: { title: 1 }
          }
        ]).toArray();

        const titles = matchedBlogs.map(blog => blog.title);

        res.json({
          data: titles
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
      }
    });

    // delete single blog
    app.delete("/deleteBlog/:id", async (req, res) => {
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

    //update a single blog
    app.put("/allBlog/:id", async (req, res) => {
      const id = req.params.id;
      const work = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateWork = {
        $set: {
          ...work,
        }
      }
      const result = await blogCollection.updateOne(filter, updateWork);
      res.send(result);
    })

    // checking blog status
    app.get("/checkedBlog", async (req, res) => {
      const result = await blogCollection.find({ status: { $eq: "checked" } }).toArray();
      res.send(result);
    })

    // under review blog status
    app.get("/reviewBlog", async (req, res) => {
      const result = await blogCollection.find({ status: { $eq: "pending" } }).toArray();
      res.send(result);
    })

    // pending to check blog status
    app.patch("/checkedBlog/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "checked",
        },
      };
      const result = await blogCollection.updateOne(filter, updateDoc);
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

    //update a single job circular
    app.put("/allJobCircular/:id", async (req, res) => {
      const id = req.params.id;
      const work = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateWork = {
        $set: {
          ...work,
        }
      }
      const result = await availableJobCollection.updateOne(filter, updateWork);
      res.send(result);
    })

    // checking job circular status
    app.get("/checkedJobCircular", async (req, res) => {
      const result = await availableJobCollection.find({ status: { $eq: "checked" } }).toArray();
      res.send(result);
    })

    // under review job circular status
    app.get("/reviewJobCircular", async (req, res) => {
      const result = await availableJobCollection.find({ status: { $eq: "pending" } }).toArray();
      res.send(result);
    })

    // pending to check job circular status
    app.patch("/checkedJobCircular/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "checked",
        },
      };
      const result = await availableJobCollection.updateOne(filter, updateDoc);
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