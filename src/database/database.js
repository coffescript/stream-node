const { MongoClient } = require('mongodb')

let db

MongoClient.connect('mongodb+srv://dmr1204:admin1204@cluster0-fjfoq.mongodb.net/test?retryWrites=true&w=majority', { useUnifiedTopology: true } , async (err, client) => {
  if(err) {
    console.log(err)
    process.exit(0)
  }
  db = client.db('tracksdb')
  console.log('Database is connected now!')
})

const getConnection = () => db

module.exports = { getConnection }