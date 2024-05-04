import mongoose from 'mongoose'
import { NextRequest } from 'next/server'

const MONGO_URI = process.env.MONGO_URI
const cached: {
  connection?: typeof mongoose
  promise?: Promise<typeof mongoose>
} = {}

async function connectMongo() {
  if (!MONGO_URI) {
    throw new Error(
      'Please define the MONGO_URI environment variable inside .env.local',
    )
  }
  if (cached.connection) {
    return cached.connection
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }
    cached.promise = mongoose.connect(MONGO_URI, opts)
  }
  try {
    cached.connection = await cached.promise
  } catch (e) {
    cached.promise = undefined
    throw e
  }
  return cached.connection
}

export const withDB =
  (handler: (req: NextRequest) => Promise<Response> | Response) =>
  async (req: NextRequest) => {
    try {
      await connectMongo()
    } catch (error) {
      console.error(error)
      return Response.json(
        { error: 'Failed to connect to the database' },
        { status: 500 },
      )
    }

    try {
      return handler(req)
    } catch (error) {
      console.error(error)
      return Response.json(
        { error: 'An error occurred while processing the request' },
        { status: 500 },
      )
    }
  }

export default connectMongo
