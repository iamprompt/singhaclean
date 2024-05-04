import { hash } from '@node-rs/argon2'
import { Model, model, models, Schema } from 'mongoose'

const ModelName = 'User'

export interface IUser {
  _id: string
  email: string
  password: string
  created_at: Date
  updated_at: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'users',
  },
)

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // Hash password
    this.password = await hash(this.password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })
  }

  next()
})

export const User: Model<IUser> =
  models[ModelName] || model(ModelName, UserSchema)
