var swarm = require('discovery-swarm')()
var hyperlog = require('hyperlog')
var crypto = require('crypto')
var memdb = require('memdb')
var prompt = require('prompt')
var log = hyperlog(memdb())

var key = crypto.createHmac('sha256', 'hyperchat')
                   .update('yolo')
                   .digest('hex');

var changesStream = log.createReadStream({live:true})

let link = null;
changesStream.on('data', function(node) {
  link = [node.key]
  console.log('change:', node.value.toString(), node.key)
})

swarm.listen()
swarm.join(key)
swarm.on('connection', function (connection) {
  connection.pipe(log.replicate()).pipe(connection)
})

prompt.start()

function msg() {
  prompt.get(['message'], function(err, res) {
    if (err) {
      console.log(err)
      return 1
    }
    log.add(link, res.message)
    msg()
  })
}
msg()
