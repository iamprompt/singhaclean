import { model, models, Schema } from 'mongoose'

const ModelName = 'MachineHistory'

export interface IMachineHistory {
  no: number
  machine_no: string
  price: number
  banknotes: number
  coins: number
  qr: number
  total: number
  start_at: Date
  finish_at: Date
  duration: number
  status: string
  created_at: Date
  updated_at: Date
}
const MachineHistorySchema = new Schema<IMachineHistory>(
  {
    no: { type: Number, required: true },
    machine_no: { type: String, required: true },
    price: { type: Number, required: true },
    banknotes: { type: Number, required: true },
    coins: { type: Number, required: true },
    qr: { type: Number, required: true },
    total: { type: Number, required: true },
    start_at: { type: Date, required: true },
    finish_at: { type: Date },
    duration: { type: Number },
    status: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'machine_histories',
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id
      },
    },
  },
)

export const MachineHistory =
  models[ModelName] || model(ModelName, MachineHistorySchema)
