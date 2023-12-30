import { TaskModel } from "../models/task_model"

export async function generateUserStats(userId: string) {
  const totalTasks = await TaskModel.countDocuments({ user: userId })
  const tasksCompleted = await TaskModel.countDocuments({
    user: userId,
    status: "completed"
  })
  const tasksToDo = await TaskModel.countDocuments({
    user: userId,
    status: { $in: ["in progress", "prioritised"] }
  })

  const topTags = await TaskModel.aggregate([
    { $match: { user: userId, status: { $ne: "archived" } } },
    { $unwind: "$tags" },
    {
      $group: {
        _id: "$tags",
        taskCount: { $sum: 1 }
      }
    },
    { $sort: { taskCount: -1 } },
    { $limit: 3 },
    {
      $project: {
        _id: 0,
        tag: "$_id",
        taskCount: 1
      }
    }
  ])

  return {
    totalTasks,
    tasksCompleted,
    tasksToDo,
    topTags
  }
}

export async function generateUserTags(userId: string) {
  // find unique tags that are not archived
  const tags = await TaskModel.aggregate([
    { $match: { status: { $ne: "archived" }, user: userId } },
    { $unwind: "$tags" },
    { $group: { _id: "$tags" } },
    { $sort: { _id: 1 } }
  ])
  const tagsArray = tags.map((tag) => tag._id)
  return tagsArray
}
