var cron = require("node-cron")
import { TaskModel } from "../models/task_model"

async function updateSnoozedTasks() {
  const tasksToUnsnooze = await TaskModel.find({
    status: "snoozed",
    snoozeUntil: { $lte: new Date() }
  })

  tasksToUnsnooze.forEach(async (task) => {
    task.status = "in progress"
    task.snoozeUntil = undefined
    await task.save()
  })
}

export function startCronJobs() {
  cron.schedule("0 0 * * *", () => {
    console.log("Running daily task update at:", new Date())
    updateSnoozedTasks()
  })
}
