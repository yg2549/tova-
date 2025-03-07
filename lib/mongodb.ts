import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("חסר משתנה סביבה MONGODB_URI")
}

if (!process.env.MONGODB_DB) {
  throw new Error("חסר משתנה סביבה MONGODB_DB")
}

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // בסביבת פיתוח, השתמש במשתנה גלובלי כדי לשמור על חיבור יחיד
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // בסביבת ייצור, צור חיבור חדש
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

export default clientPromise

