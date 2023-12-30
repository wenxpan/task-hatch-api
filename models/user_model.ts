import mongoose, { Schema, Document, Model } from "mongoose"

interface IUser extends Document {
  username: string
  email: string
  password: string
  isAdmin: boolean
}

type UserInput = {
  username: string
  email: string
  password: string
  isAdmin: boolean
}

const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: [true, "Please add username"],
    unique: true
  },
  email: {
    type: String,
    required: [true, "Please add email address"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please add password"],
    minLength: [6, "Password must be longer than 6 characters"],
    maxLength: [128, "Password must be shorter than 128 characters"],
    select: false
  },
  isAdmin: { type: Boolean, default: false }
})

const UserModel: Model<IUser> = mongoose.model<IUser>("User", userSchema)

export { UserModel, IUser, UserInput }
