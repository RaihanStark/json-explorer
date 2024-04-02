"use server";
import { jsonrepair } from "jsonrepair";
import {
  connectToConfigCollection,
  connectToDatabase,
  connectToWorkCollection,
} from "../components/utils/connection-mongo";
import mongoose from "mongoose";

export const clearData = async () => {
  await connectToDatabase();
  const collection = await connectToWorkCollection();
  const config = await connectToConfigCollection();

  await config.deleteMany({});
  await collection.deleteMany({});
};

export const handleConfig = async (obj) => {
  await connectToDatabase();
  const config = await connectToConfigCollection();

  await config.deleteMany({});

  let headers = {};

  Object.keys(obj).forEach((key) => {
    if (!headers[key]) {
      // check if object is an array or just object
      if (Array.isArray(obj[key])) {
        headers[key] = "array";
      } else if (typeof obj[key] === "object") {
        headers[key] = "object";
      } else {
        headers[key] = typeof obj[key];
      }
    }
  });

  await config.insertOne({
    headers,
  });

  return true;
};

export const importJSON = async (arrayObj) => {
  await connectToDatabase();
  const collection = await connectToWorkCollection();

  await collection.insertMany(arrayObj, { ordered: false });
  return true;
};

export const getItems = async (
  pageNumber = 1,
  pageSize = 5,
  searchBy = null,
  search = null,
  condition = null,
) => {
  const skipCount = (pageNumber - 1) * pageSize;

  await connectToDatabase();
  const collection = await connectToWorkCollection();

  let filters = {};

  // includes or excludes search

  if (searchBy && search) {
    if (condition === "includes" || condition === null) {
      filters[searchBy] = {
        $regex: new RegExp(search, "i"),
      };
    } else if (condition === "excludes") {
      filters[searchBy] = {
        $regex: new RegExp(`^(?!.*${search}).*`, "i"),
      };
    }
  }

  const cursor = collection
    .find(filters)
    .sort({ _id: -1 })
    .skip(skipCount)
    .limit(pageSize);

  return {
    data: (await cursor.toArray()).map((doc) =>
      JSON.parse(JSON.stringify(doc)),
    ),
    total: await collection.countDocuments(filters),
  };
};

export const updateItem = async (id, body) => {
  await connectToDatabase();
  const collection = await connectToWorkCollection();

  const update = {
    $set: {
      ...body,
    },
  };

  const result = await collection.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id) },
    update,
  );

  return result;
};

export const deleteItem = async (id) => {
  await connectToDatabase();
  const collection = await connectToWorkCollection();
  const result = await collection.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
  });

  return result;
};

export const getTotalDocument = async () => {
  await connectToDatabase();
  const collection = connectToWorkCollection();

  const total = await collection.countDocuments();

  return total;
};

export const getHeaders = async () => {
  await connectToDatabase();
  const config = await connectToConfigCollection();
  const headers = await config.findOne({});

  return headers;
};

export const addItem = async (body) => {
  await connectToDatabase();
  const collection = await connectToWorkCollection();

  const result = await collection.insertOne(body);

  return result;
};
