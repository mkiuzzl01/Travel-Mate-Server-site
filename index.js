const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleWare
app.use(cors());
app.use(express.json());

// const uri = 'mongodb://localhost:27017'
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rbychrh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const Tourist_Sport_Collection = client
      .db("Tourist_SportsDB")
      .collection("All_Spots");
      const UserCollection = client.db("Tourist_SportsDB").collection('Users')
    const BangladeshCollection = client
      .db("Tourist_SportsDB")
      .collection("Bangladesh");

    app.get("/Tourist_Sports", async (req, res) => {
      const query = Tourist_Sport_Collection.find();
      const result = await query.toArray();
      res.send(result);
    });
    app.get("/Users", async (req, res) => {
      const query = UserCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    app.get("/minCost", async (req, res) => {
      const query = Tourist_Sport_Collection.find();
      const result = await query.toArray();
      const minData = result.sort(function(a,b){
        return parseInt(a.average_cost) - parseInt(b.average_cost);
    })
      res.send(minData);
    });

    app.get("/maxCost", async (req, res) => {
      const query = Tourist_Sport_Collection.find();
      const result = await query.toArray();
      const minData = result.sort(function(a,b){
        return parseInt(a.average_cost) - parseInt(b.average_cost);
    })
      minData.reverse()
      res.send(minData);
    });

    app.get("/Tourist_Sports/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id) };
      const result = await Tourist_Sport_Collection.findOne(query);
      res.send(result);
    });

    app.get("/My_List/:email", async (req, res) => {
        const email = req.params.email;
        const query = {userEmail:email};
        const result = await Tourist_Sport_Collection.find(query).toArray();
        console.log(result);
        res.send(result);
      });

    app.post("/Tourist_Sports", async (req, res) => {
      const Sports = req.body;
      const result = await Tourist_Sport_Collection.insertOne(Sports);
      res.send(result);
    });

    app.post("/Users", async (req, res) => {
      const User = req.body;
      const result = await UserCollection.insertOne(User);
      res.send(result);
    });

    app.put("/Tourist_Sports/:id", async(req,res)=>{
        const id = req.params.id;
        const filter = {_id:new ObjectId(id)};
        const option = {upsert:true};
        const updated = req.body;
        const sport = {
            $set:{
                sport_name:updated.sport_name,
                country_Name:updated.country_Name,
                location:updated.location,
                description:updated.description,
                average_cost:updated.average_cost,
                travel_time:updated.travel_time,
                total_visitor:updated.total_visitor,
                photo:updated.photo,
                seasonal:updated.seasonal,
                userEmail:updated.userEmail,
                userName:updated.userName,
            }
        }
        const result = await Tourist_Sport_Collection.updateOne(filter,sport,option,);
        res.send(result);
    })

    app.delete("/Tourist_Sports/:id", async (req,res)=>{
        const id = req.params.id;
        const query = {_id:new ObjectId(id)}
        const result = await Tourist_Sport_Collection.deleteOne(query);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Travel-Mate Server is Running");
});

app.listen(port, () => {
  console.log(`Travel-Mate server is running on: ${port}`);
});
