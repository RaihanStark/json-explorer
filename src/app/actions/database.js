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

export const handleJSON = async (arrayObj) => {
  await connectToDatabase();
  const collection = await connectToWorkCollection();
  const config = await connectToConfigCollection();

  // fix json
  const data_repair = jsonrepair(arrayObj);
  const data_json = JSON.parse(data_repair);

  // based on array of object, create a schema for the collection
  // headers, type (string, datetime, boolean, array of string)
  // TODO: create a schema for the collection
  let headers = {};

  data_json.forEach((obj) => {
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
  });

  await config.insertOne({
    headers,
  });

  await collection.insertMany(data_json, { ordered: false });

  return true;
};

export const getItems = async (
  pageNumber = 1,
  pageSize = 5,
  searchBy = null,
  search = null,
) => {
  const skipCount = (pageNumber - 1) * pageSize;

  await connectToDatabase();
  const collection = await connectToWorkCollection();

  let filters = {};

  if (searchBy && search) {
    filters[searchBy] = {
      $regex: new RegExp(search, "i"),
    };
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
