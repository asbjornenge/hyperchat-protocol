var swarm = require('discovery-swarm')()
var hyperlog = require('hyperlog')
var crypto = require('crypto')
var memdb = require('memdb')
var log = hyperlog(memdb())

var key = crypto.createHmac('sha256', 'hyperchat')
                   .update('yolo')
                   .digest('hex');

var changesStream = log.createReadStream({live:true})

changesStream.on('data', function(node) {
  console.log('change:', node.value.toString())
})

let link = null;
setInterval(function() {
  log.add(link, 'elo', function(err, node) {
    if (err) throw new Error(err)
    link = node.key
  })
},1000)

swarm.listen()
swarm.join(key)
swarm.on('connection', function (connection) {
  console.log(connection)
  connection.pipe(log.replicate()).pipe(connection)
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
