const express = require('express')
const { MongoClient,ObjectId, ServerApiVersion } = require('mongodb');
const cors=require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8qmgmso.mongodb.net/movieList?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    //await client.connect();
    //user movie collection
    const userMovieCollection=client.db('movieList').collection('movies');
    app.post('/movielist',async(req,res)=>{
        const movie=req.body;
        const result=await userMovieCollection.insertOne(movie)
        console.log(result);
        res.send(result)
    })
//get data from db
app.get('/movielist',async(req,res)=>{
    const result=await userMovieCollection.find().toArray()
        console.log(result)
        res.send(result)
    
})
//delete data from db
app.delete('/movielist/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      
      const result = await userMovieCollection.deleteOne(query);
      
      if (result.deletedCount > 0) {
        res.send({ message: 'Movie deleted successfully', deletedCount: result.deletedCount });
      } else {
        res.status(404).send({ message: 'Movie not found' });
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      res.status(500).send({ message: 'Error deleting movie', error });
    }
  });
  
   // await client.db("admin").command({ ping: 1 });
   // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

//middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello bhai!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
//Antim-Sarker
//f1CPDATDW4lWybqQ