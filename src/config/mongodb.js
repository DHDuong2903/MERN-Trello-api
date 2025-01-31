import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "./environment";

let trelloDatabaseInstance = null;

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Ket noi toi DB
export const CONNECT_DB = async () => {
  await mongoClientInstance.connect();

  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME);
};

// Dong ket noi toi DB khi can
export const CLOSE_DB = async () => {
  await mongoClientInstance.close();
}

export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error("Must connect to Database first!");
  return trelloDatabaseInstance;
};
