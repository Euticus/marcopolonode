const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const PORT = process.env.PORT || 5000

const router = require('./router')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

let User1 = null;
let User2 = null;
let lat1 = 40; 
let lon1 = -74;
let lat2 = 40;
let lon2 = -74;
let dist;
let locObj;
let locObj2;

io.origins((origin, callback) => callback(null, true))
io.on('connection', (socket) => {
  console.log("I just feel a connection, dont you?")
  socket.on('dataToServer', (data) => {
    handleLogic(data)
    console.log("dist", dist)
    socket.broadcast.emit('broadcast', {dist})
  })
  socket.on('disconnect', () => { 
      console.log('user has left!')})
})

const defineUser = (obj) => {
  if (User1 === null && User2 === null){
    User1 = obj.userId
  } else if (User1 && User2 == null) {
    User2 = obj.userId
  } else{
    User1 = User1
    User2 = User2
  }
}

const setLocation = (user, location) => {
  switch(user){
    case User1:
        locObj = JSON.parse(location);
        lat1 = locObj["coords"]["latitude"]
        lon1 = locObj["coords"]["longitude"]
      break;
    case User2:
        locObj2 = JSON.parse(location);
        lat2 = locObj2["coords"]["latitude"]
        lon2 = locObj2["coords"]["longitude"]
      break;     
  }
}

const mathFunc = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km (change this constant to get miles)
  let dLat = (lat2 - lat1) * Math.PI / 180;
  let dLon = (lon2 - lon1) * Math.PI / 180;
  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  return d;
}

const handleLogic = (data) => {
  defineUser(data)
  setLocation(data.userId, data.location)
  dist = mathFunc(lat1, lon1, lat2, lon2)  
}


app.use(router)


server.listen(PORT, () => console.log(`server has started on ${PORT}`))

