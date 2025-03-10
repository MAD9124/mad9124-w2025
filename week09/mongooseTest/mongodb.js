const { MongoClient, ObjectId } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');

const main = async () => {
  try {
    const connection = await client.connect();

    // const result = await connection
    //   .db('mad9124')
    //   .collection('cars')
    //   .find({ _id: new ObjectId('67cb702691478e050335419f') })
    //   .toArray();
    // console.log(result);

    const result = await connection.db('mad9124').collection('cars').insertOne({
      make: 'Ford',
      model: 'f150',
      colour: 'red',
      script: 'something bad',
      username: 'tim',
    });
    console.log(result);
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
};

main();
