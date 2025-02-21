// const express = require('express')
// const app = express()
// var cors = require('cors')

// const port = process.env.PORT || 3000;

// app.use(cors())
// app.use(express.json())

// // taskManager
// // YTgReGa7WlbFLshU

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://taskManager:YTgReGa7WlbFLshU@cluster0.bnqcs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {

//     const database = client.db("taskDB");
//     const userDb = database.collection("users");
//     const taskDb = database.collection("tasks");


//     // Connect the client to the server	(optional starting in v4.7)
//     // await client.connect();

//     app.post("/addUser", async (req, res) => {
//         try {
//             let userData = req.body;
//             let email = userData.email;
    
//             // ✅ Ensure 'userDb' is initialized properly
//             const database = client.db("taskManagerDB");  // Replace with your DB name
//             const userDb = database.collection("users"); // Replace with your collection name
    
//             let query = { email };
    
//             // ✅ Check if the user already exists
//             let existingUser = await userDb.findOne(query);
    
//             if (existingUser) {
//                 return res.status(403).send({ message: "User already exists" });
//             }
    
//             // ✅ Fix: Spread userData instead of nesting it
//             let result = await userDb.insertOne({ ...userData });
    
//             res.send(result);
//         } catch (error) {
//             console.error("Error in /addUser:", error);
//             res.status(500).send({ message: "Internal server error" });
//         }
//     });



//     app.get("/alltask",async(req,res)=>{
//       const cursor = await taskDb.find().toArray();
//       res.send(cursor)
//     })


//     app.post("/addtask",async(req,res)=>{

//       let task=req.body
//       // console.log(task)

//       const doc = {
//         title: task.title,
//         description: task.description,
//         category:task.category,
//         timestamp:task.timestamp
//       }
     
//       const result = await taskDb.insertOne(doc);
//       res.send(result)
//     })

//  // Update Task Category (PATCH request)
// app.patch("/tasks/:id", async (req, res) => {
//   try {
//     const taskId = req.params.id;
//     const { category } = req.body;

//     if (!category || !["To-Do", "In Progress", "Done"].includes(category)) {
//       return res.status(400).send({ message: "Invalid category" });
//     }

//     const updatedTask = await taskDb.findOneAndUpdate(
//       { _id: new MongoClient.ObjectId(taskId) },
//       { $set: { category } },
//       { returnDocument: "after" }
//     );

//     if (!updatedTask.value) {
//       return res.status(404).send({ message: "Task not found" });
//     }

//     res.status(200).send(updatedTask.value);
//   } catch (error) {
//     console.error("Error updating task category:", error);
//     res.status(500).send({ message: "Error updating task category" });
//   }
// });



    
    








//     // Send a ping to confirm a successful connection
//     // await client.db("admin").command({ ping: 1 });
//     // console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);


// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })


const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB URI and client setup
const uri = "mongodb+srv://taskManager:YTgReGa7WlbFLshU@cluster0.bnqcs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect(); // Ensure we connect to MongoDB

    const database = client.db("taskDB");
    const taskDb = database.collection("tasks");
    const userDb = database.collection("users");

    // Add User
    app.post("/addUser", async (req, res) => {
      try {
        let userData = req.body;
        let email = userData.email;
        
        let existingUser = await userDb.findOne({ email });

        if (existingUser) {
          return res.status(403).send({ message: "User already exists" });
        }

        let result = await userDb.insertOne(userData);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error in /addUser:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Get All Tasks
    app.get("/alltask/:email", async (req, res) => {
      // try {
      //   const tasks = await taskDb.find().toArray();
      //   res.status(200).send(tasks);
      // } catch (error) {
      //   console.error("Error fetching tasks:", error);
      //   res.status(500).send({ message: "Error fetching tasks" });
      // }

      let email=req.params.email
      let query={email}

      let tasks=await taskDb.find(query).toArray()
      res.send(tasks)
    });

    // Add Task
    app.post("/addtask", async (req, res) => {
      try {
        let task = req.body;
        console.log(task)
        

        const result = await taskDb.insertOne({
          title: task.title,
          description: task.description,
          category: task.category,
          timestamp: task.timestamp,
          email:task.email
        });

        res.status(201).send(result);
      } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).send({ message: "Error adding task" });
      }
    });



    app.put("/task/:id",async(req,res)=>{


      let task= req.body

      let idx=req.params.id

      const filter = { _id:new ObjectId(idx) };

      const updateDoc = {
        $set: {
          title: task.title,
          description: task.description,
          category: task.category,
          timestamp: task.timestamp

        },
      };

      const result = await taskDb.updateOne(filter, updateDoc);
      res.send(result)
    })

    app.get("/task/:id",async(req,res)=>{

     let idx=req.params.id
      const query = {_id:new ObjectId(idx) };

      const result = await taskDb.findOne(query);
      res.send(result)
    })


    app.delete("/tasks/:id",async(req,res)=>{

      let idx=req.params.id
      let query={_id:new ObjectId(idx)}
      const result = await taskDb.deleteOne(query);

      res.send(result)

    })

    // Update Task Category (PATCH request)
    app.patch("/tasks/:id", async (req, res) => {
      try {
        const taskId = req.params.id;
        const { category } = req.body;

        if (!category || !["To-Do", "In Progress", "Done"].includes(category)) {
          return res.status(400).send({ message: "Invalid category" });
        }

        const updatedTask = await taskDb.findOneAndUpdate(
          { _id: new ObjectId(taskId) },
          { $set: { category } },
          { returnDocument: "after" } // Returns the document after update
        );

        if (!updatedTask.value) {
          return res.status(404).send({ message: "Task not found" });
        }

        res.status(200).send(updatedTask.value);
      } catch (error) {
        console.error("Error updating task category:", error);
        res.status(500).send({ message: "Error updating task category" });
      }
    });

  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

run().catch((error) => {
  console.error("Failed to start server:", error);
});

// Home route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
