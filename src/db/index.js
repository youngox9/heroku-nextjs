const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectId } = require("mongodb");

const pws = "nyCNKlDz115AghWk";
const uri = `mongodb+srv://youngox9:${pws}@cluster0.vlupstz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = client.db("test");

export async function getList() {
  const result = await db.collection("test").find().toArray();
  return result;
}

export async function addItem(obj) {
  const result = await db.collection("test").insert({ ...obj });
  return result;
}

export async function deleteItem(obj) {
  const result = await db
    .collection("test")
    .deleteMany({ _id: new ObjectId(obj._id) });

  console.log();
  return result;
}

export async function updateItem(obj) {
  const result = await db
    .collection("test")
    .updateOne({ _id: new ObjectId(obj._id) }, { $set: { value: obj.value } });
  return result;
}

export default db;
