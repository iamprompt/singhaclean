import { MongodbAdapter } from '@lucia-auth/adapter-mongodb'
import { Lucia } from 'lucia'
import mongoose from 'mongoose'

const adapter = new MongodbAdapter(
  mongoose.connection.collection('sessions'),
  mongoose.connection.collection('users'),
)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: 'singhaclean-session',
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
})

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
  }
}
