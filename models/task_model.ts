import mongoose, { Schema, Document, Model } from "mongoose"

interface IProgress extends Document {
  date: Date
  description: string
}

interface ITask extends Document {
  title: string
  dateAdded: Date
  status: "in progress" | "prioritised" | "completed" | "snoozed" | "archived"
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
  delayReason?: string
  doReason?: string
  notes?: string
  tags: string[]
  progress: ProgressInput[]
  user: object
}

const progressSchema: Schema<IProgress> = new Schema({
  date: { type: Date, default: Date.now },
  description: {
    type: String,
    required: [true, "Please add description"],
    minLength: [1, "Progress description can't be empty"]
  }
})

const taskSchema: Schema<ITask> = new Schema({
  title: { type: String, required: [true, "Please add title"], unique: true },
  dateAdded: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["in progress", "prioritised", "completed", "snoozed", "archived"],
    default: "in progress"
  },
  delayReason: { type: String },
  doReason: { type: String },
  notes: { type: String },
  tags: [String],
  progress: [progressSchema],
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true }
})

const TaskModel: Model<ITask> = mongoose.model<ITask>("Task", taskSchema)

export { TaskModel, ITask, IProgress, TaskInput, ProgressInput }
