import mongoose, { Schema, Document, Model } from "mongoose"

interface IProgress extends Document {
  date: Date
  description: string
}

interface ITask extends Document {
  title: string
  dateAdded: Date
  isCompleted: boolean
  isArchived: boolean
  delayReason?: string
  doReason?: string
  notes?: string
  tags: string[]
  progress: IProgress[]
  user: mongoose.ObjectId
}

type ProgressInput = {
  date: Date
  description: string
}

type TaskInput = {
  title: string
  dateAdded: Date
  isCompleted: boolean
  isArchived: boolean
  delayReason?: string
  doReason?: string
  notes?: string
  tags: string[]
  progress: ProgressInput[]
  user: object
}

const progressSchema: Schema<IProgress> = new Schema({
  date: { type: Date, default: Date.now },
  description: { type: String, required: [true, "Please add description"] }
})

const taskSchema: Schema<ITask> = new Schema({
  title: { type: String, required: [true, "Please add title"] },
  dateAdded: { type: Date, default: Date.now },
  isCompleted: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  delayReason: { type: String },
  doReason: { type: String },
  notes: { type: String },
  tags: [String],
  progress: [progressSchema],
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true }
})

const TaskModel: Model<ITask> = mongoose.model<ITask>("Task", taskSchema)

export { TaskModel, ITask, IProgress, TaskInput, ProgressInput }
