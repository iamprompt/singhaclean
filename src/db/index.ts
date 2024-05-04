import mongoose from 'mongoose'
import { NextRequest } from 'next/server'
import { z } from 'zod'

import { AppError } from '@/modules/api/appError'

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
  (
    handler: (
      req: NextRequest,
      options: Record<string, any>,
    ) => Promise<Response> | Response,
  ) =>
  async (req: NextRequest, options: Record<string, any> = {}) => {
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
      return await handler(req, options)
    } catch (error) {
      console.error(error)
      if (error instanceof AppError) {
        return Response.json(
          { message: error.message },
          { status: error.statusCode },
        )
      }

      if (error instanceof z.ZodError) {
        return Response.json(
          { message: error.errors[0].message },
          { status: 400 },
        )
      }

      return Response.json(
        { error: 'An error occurred while processing the request' },
        { status: 500 },
      )
    }
  }

export default connectMongo
