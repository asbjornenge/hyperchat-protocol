var swarm = require('discovery-swarm')()
var hyperlog = require('hyperlog')
var crypto = require('crypto')
var memdb = require('memdb')
var slog = require('single-line-log')
var log = hyperlog(memdb())
var args = require('minimist')(process.argv.slice(2), {
  default: {
    channel: 'knowit',
    name: 'Mr. Lame'
  }
})

var key = crypto.createHmac('sha256', 'hyperchat')
                   .update(args.channel)
                   .digest('hex');

var changesStream = log.createReadStream({live:true})

let link = null;
changesStream.on('data', function(node) {
  link = [node.key]
  console.log(node.value.toString())
})

swarm.listen()
swarm.join(key)
swarm.on('connection', function (connection) {
  connection.pipe(log.replicate()).pipe(connection)
})

var keypress = require('keypress');
keypress(process.stdin);

let msg = ''
let prompt = 'msg> '
process.stdin.on('keypress', function (ch, key) {
  key = key || {name:'yolo'}
  switch(key.name) {
    case 'return':
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
      log.add(link, args.name+': '+msg)
      msg = ''
      break
    case 'backspace':
      msg = msg.slice(0, -1)
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
      process.stdout.write(msg)
      break
    default:
      msg += ch
      process.stdout.write(ch)
  }
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause();
    process.exit(1)
  }
});

process.stdin.setRawMode(true)
process.stdin.resume()
