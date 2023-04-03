import db from "@/db";
import { ObjectId } from "mongodb";

const methods = {
  async GET() {
    return db.collection("test").find().toArray();
  },
  async PUT(data = []) {
    const itemsToUpdate = data;

    try {
      // 檢查 _id 是否有效
      itemsToUpdate.forEach((item) => {
        if (!ObjectId.isValid(item._id)) {
          throw new Error(`Invalid _id: ${item._id}`);
        }
      });

      // 查找現有文檔
      const existingDocs = await db.collection("test").find().toArray();

      // 將現有文檔轉換為一個對象，以便更快地查找
      const existingDocsMap = {};
      existingDocs.forEach((doc) => (existingDocsMap[doc._id] = doc));

      // 進行更新和刪除操作
      const operations = itemsToUpdate.map((item) => {
        if (existingDocsMap[item._id]) {
          // 如果存在，則更新
          return db
            .collection("test")
            .updateOne({ _id: new ObjectId(item._id) }, { $set: item });
        } else {
          // 如果不存在，則刪除
          return db
            .collection("test")
            .deleteOne({ _id: new ObjectId(item._id) });
        }
      });

      // 尋找要刪除的文檔
      const docsToDelete = existingDocs.filter(
        (doc) => !itemsToUpdate.find((item) => item._id === doc._id.toString())
      );

      // 刪除沒有在新列表中出現的文檔
      const deleteOperations = docsToDelete.map((doc) =>
        db.collection("test").deleteOne({ _id: doc._id })
      );

      // 執行所有操作
      await Promise.all([...operations, ...deleteOperations]);
      // 返回成功消息
      res.status(200).json({ message: "更新成功" });
    } catch (e) {
      // 如果出現錯誤，則返回錯誤消息
      res.status(400).json({ error: e.message });
    }
  },
  async POST(obj) {
    return db.collection("test").insertOne({ ...obj });
  },
  async DELETE(obj) {
    return db.collection("test").deleteMany({ _id: new ObjectId(obj._id) });
  },
};

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "GET":
        const result = await db.collection("test").find().toArray();
        console.log(result);
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
