const express = require('express')
const app = express()

let data = [
  {
    name:'1',
    age:'2',
    sex:'3',
  }
]

app.get('/data', (req, res) =>{
  res.header("Content-Type", "application/json;charset=utf-8");
  res.send(data)
})


app.listen(3000, () => console.log('Example app listening on port 3000!'))