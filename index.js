const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1pvay.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const db = client.db("jobTask-db");
    const usersCollection = db.collection("users");
    const tasksCollection = db.collection("tasks");
    const toDoCollection = db.collection("toDo");
    const inProgressCollection = db.collection("inProgress");
    const doneCollection = db.collection("done");

    app.post("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = req.body;
      const isExist = await usersCollection.findOne(query);
      if (isExist) {
        return res.send(isExist);
      }
      const result = await usersCollection.insertOne({
        ...user,
        role: "Client",
        status: "Normal",
        timestamp: Date.now(),
      });
      res.send(result);
    });

    app.post("/add-task", async (req, res) => {
      const task = req.body;
      const result = await tasksCollection.insertOne(task);

      if (task.category === "To-Do") {
        await toDoCollection.insertOne(task);
      } else if (task.category === "In Progress") {
        await inProgressCollection.insertOne(task);
      } else if (task.category === "Done") {
        await doneCollection.insertOne(task);
      }

      res.send(result);
    });

    app.get("/all-task", async (req, res) => {
      const result = await tasksCollection.find().toArray();
      res.send(result);
    });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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
  res.send("Simple Job Task");
});

app.listen(port, () => {
  console.log(`Simple Job Task is running on PORT ${port}`);
});
