import app from "./app"

const port = process.env.PORT || 4001

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
