var hypercore = require('hypercore')
var net = require('net')
var core = hypercore(require('memdb')())
var feed = core.createFeed('d105ce546fd9b42c2b6b1ec93314f9732ea18702e64459b3313aae421132b85e')
var socket = net.connect(10000)

socket.pipe(feed.replicate()).pipe(socket)

feed.on('download', function (block, data) {
  console.log('downloaded block', block, data.toString())
})
