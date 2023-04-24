import client from "@/db";

export default async function handler(req, res) {
  const db = client.db("test");
  try {
    switch (req.method) {
      case "GET":
        const result = await db.collection("test").find().toArray();

        res.status(200).json(result);
        break;
      case "PUT":
        const data = req.body;
        try {
          const collection = db.collection("test");

          // 找到所有不在傳入陣列中的項目，將它們刪除
          const existingItems = await collection.find().toArray();
          const idsToRemove = existingItems
            .filter((item) => !data.some((d) => d._id === item._id))
            .map((item) => item._id);
          await collection.deleteMany({ _id: { $in: idsToRemove } });

          for (const item of data) {
            if (item._id) {
              // 先檢查 item 是否已存在
              const existingItem = await collection.findOne({ _id: item._id });
              console.log("不存在");
              if (existingItem) {
                // 如果存在，就更新
                const updateObj = { ...item };
                delete updateObj._id; // 從更新中排除 _id
                await collection.updateOne(
                  { _id: item._id },
                  { $set: updateObj }
                );
              } else {
                // 如果不存在，就插入
                await collection.insertOne({ ...item });
              }
            } else {
              // 沒有 _id，不允許插入
              console.log("Skipping item without _id:", item);
              await collection.insertOne({ ...item });
            }
          }

          res.status(200).json({ message: "OK" });
        } catch (e) {
          console.error(e);
          res.status(400).json({ error: e.message });
        }
        break;
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}
