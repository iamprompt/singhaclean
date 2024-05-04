import { Model, model, models, Schema } from 'mongoose'

const ModelName = 'MachineHistory'

export enum MachineStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum MachineType {
  WASHER = 'washer',
  DRYER = 'dryer',
}

export interface IMachine {
  machine_no: number
  type: string
  status: string
  created_at: Date
  updated_at: Date
}

const MachineSchema = new Schema<IMachine>(
  {
    machine_no: { type: Number, required: true },
    type: { type: String, required: true, default: MachineType.WASHER },
    status: { type: String, required: true, default: MachineStatus.ACTIVE },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'machines',
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id
      },
    },
  },
)

export const Machine: Model<IMachine> =
  models[ModelName] || model(ModelName, MachineSchema)
