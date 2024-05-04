import { Model, model, models, Schema } from 'mongoose'

const ModelName = 'User'

export interface ISession {
  _id: string
  user_id: string
  expires_at: Date
  created_at: Date
  updated_at: Date
}

const SessionSchema = new Schema<ISession>(
  {
    _id: { type: String, required: true },
    user_id: { type: String, required: true },
    expires_at: { type: Date, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    _id: false,
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'sessions',
  },
)

export const Session: Model<ISession> =
  models[ModelName] || model(ModelName, SessionSchema)
