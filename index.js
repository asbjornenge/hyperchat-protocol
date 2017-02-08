var swarm = require('discovery-swarm')()
var hypercore = require('hypercore')
var crypto = require('crypto')
var net = require('net')

var key = crypto.createHmac('sha256', 'asdasdasdasd')
                   .update('yolo')
                   .digest('hex');

swarm.listen()
swarm.join(key)
swarm.on('connection', function (connection) {
  console.log(connection)
//  connection.pipe(archive.replicate()).pipe(connection)
})

//var core = hypercore(require('memdb')()) // db is a leveldb instance
//var feed = core.createFeed(key)
//
//feed.append(['hello', 'world'], function () {
//  console.log('appended two blocks')
//  console.log('key is', feed.key.toString('hex'))
//})
//
//feed.on('upload', function (block, data) {
//  console.log('uploaded block', block, data)
//})
//
//var server = net.createServer(function (socket) {
//  socket.pipe(feed.replicate()).pipe(socket)
//})
//
//server.listen(10000)
