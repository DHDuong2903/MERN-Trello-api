/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

const MONGODB_URI =
  "mongodb+srv://duongdo:DM1BGqeqRMLzJhB3@cluster0-duongdo.m6x26.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0-DuongDo";

const DATABASE_NAME = "MERN-Trello";

import { MongoClient, ServerApiVersion } from "mongodb";

let trelloDatabaseInstance = null;

const mongoClientInstance = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Ket noi toi DB
export const CONNECT_DB = async () => {
  await mongoClientInstance.connect();

  trelloDatabaseInstance = mongoClientInstance.db(DATABASE_NAME);
};

// Dong ket noi toi DB khi can
export const CLOSE_DB = async () => {
  await mongoClientInstance.close();
}

export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error("Must connect to Database first!");
  return trelloDatabaseInstance;
};
