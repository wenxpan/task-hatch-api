import * as bcrypt from "bcryptjs"
import { dbConnect, dbClose } from "./db"
import { TaskModel, TaskInput } from "../models/task_model"
import { UserModel, UserInput } from "../models/user_model"

async function seedDB() {
  try {
    await dbConnect()

    const salt = await bcrypt.genSalt(10)

    const users: UserInput[] = [
      {
        username: "DemoUser",
        password: await bcrypt.hash("Testingdemouser", salt),
        email: "demo@gmail.com",
        isAdmin: false
      },
      {
        username: "RegisteredUser",
        password: await bcrypt.hash("Testinguser", salt),
        email: "user@gmail.com",
        isAdmin: true
      },
      {
        username: "Admin",
        password: await bcrypt.hash("Testingadmin", salt),
        email: "admin@gmail.com",
        isAdmin: true
      }
    ]

    await UserModel.deleteMany()
    console.log("deleted users")
    const insertedUsers = await UserModel.insertMany(users)
    console.log("inserted users")

    const tasks: TaskInput[] = [
      {
        title: "Finish reading Phoenix Project",
        dateAdded: new Date("2023-08-08"),
        delayReason:
          "I'm reading other books right now, don't have time for this",
        doReason: "I can learn more about project management",
        notes: "Link to book: amazon.com/phoenix-project",
        tags: ["book", "pd", "web-dev"],
        progress: [
          {
            date: new Date("2023-08-08"),
            description: "Read first few pages"
          },
          {
            date: new Date("2023-08-09"),
            description: "Read a few more pages"
          }
        ],
        user: insertedUsers[0]
      },
      {
        title: "Complete JavaScript Course",
        dateAdded: new Date("2023-08-08"),
        delayReason: "I've been focusing on other programming languages",
        doReason: "Improving my web development skills",
        notes: "Course platform: udemy.com/js-course",
        tags: ["course", "programming", "web-dev"],
        progress: [
          {
            date: new Date("2023-08-01"),
            description: "Completed the basic modules"
          },
          {
            date: new Date("2023-08-08"),
            description: "Started working on advanced topics"
          }
        ],
        user: insertedUsers[0]
      },
      {
        title: "Learn Japanese",
        dateAdded: new Date("2023-07-15"),
        delayReason: "Need to explore different courses",
        doReason: "Want to visit Japan next year",
        notes: "",
        tags: ["language", "learning", "culture"],
        progress: [],
        user: insertedUsers[0]
      }
    ]

    await TaskModel.deleteMany()
    console.log("deleted tasks")
    await TaskModel.insertMany(tasks)
    console.log("inserted tasks")

    await dbClose()
  } catch (error) {
    console.error("Error seeding database: ", error)
  }
}

seedDB()
