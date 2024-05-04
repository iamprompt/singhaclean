import { model, models, Schema } from 'mongoose'

const ModelName = 'Cache'

export interface ICache {
  key: string
  value: string
  created_at: Date
  updated_at: Date
}

const CacheSchema = new Schema<ICache>(
  {
    key: { type: String, required: true },
    value: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'caches',
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id
      },
    },
  },
)

export const Cache = models[ModelName] || model(ModelName, CacheSchema)
