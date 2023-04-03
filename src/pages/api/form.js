import db from "@/db";

export default async function handler(req, res) {
  const method = req.method;
  try {
    if (method === "GET") {
      const result = await db.collection("form").find().toArray();
      res.status(200).json(result);
    } else if (method === "PUT") {
      await db
        .collection("form")
        .updateOne({ _id: new ObjectId(obj._id) }, { $set: { ...obj } });
      res.status(200);
    } else if (method === "POST") {
      console.log("insert !!");
      await db.collection("form").insertMany([obj]);
      res.status(200);
    } else {
      res.status(400).json({ error: "not found" });
    }
  } catch (e) {
    res.status(400);
  }

  // await client.close();
}
