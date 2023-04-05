const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectId } = require("mongodb");

const pws = "nyCNKlDz115AghWk";
const uri = `mongodb+srv://youngox9:${pws}@cluster0.vlupstz.mongodb.net/?retryWrites=true&w=majority`;

export const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// const db = client.db("test");

export async function getList() {
  const db = client.db("test");
  const docs = await db.collection("test").find().toArray();
  const jsonDocs = docs.map((doc) => {
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest };
  });
  // res.json(jsonDocs);
  return jsonDocs;
}

export async function getFormList() {
  const db = client.db("form");
  const docs = await db.collection("list").find().toArray();
  const jsonDocs = docs.map((doc) => {
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest };
  });
  // res.json(jsonDocs);
  return jsonDocs;
}

export async function getHtmlList() {
  const db = client.db("form");
  const docs = await db.collection("html").find().toArray();
  const jsonDocs = docs.map((doc) => {
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest };
  });
  return jsonDocs;
}

export async function getData(dbName) {
  const db = client.db(dbName);
  const docs = await db.collection("list").find().toArray();
  const jsonDocs = docs.map((doc) => {
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest };
  });
  // res.json(jsonDocs);
  return jsonDocs;
}

export default client;
