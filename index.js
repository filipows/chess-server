var net = require('net');

const connections = [];

var server = net.createServer((currentConn) => {
    connections.push(currentConn);
    const remoteAddress = currentConn.remoteAddress + ':' + currentConn.remotePort; 
    console.log('connected: ' + remoteAddress);
    currentConn.write('Welcome to chat. No of connected clients: ' + connections.length + '\n');

    currentConn.setEncoding('utf8');

    currentConn.on('data', (data) => {
        console.log('data: ', data);
        console.log('connection data from %s: %j', remoteAddress, data);
        connections.forEach( (c) => {
            if (currentConn != c) {
                c.write(data);  
            }
        });
    });

    currentConn.once('close', () => {
        console.log('connection from %s closed', remoteAddress);
    });

    currentConn.on('error', (err) => {
        console.log('connection %s error: %s', remoteAddress, err.message);
    });

    currentConn.on('end', () => {
      console.log('client disconnected');
      connections.splice(connections.indexOf(currentConn), 1);
  });
});

server.on('error', (err) => {
    console.log('[ERROR]:');
    throw err;
});


server.listen(1337, () => {
    console.log('server listening to %j', server.address());
});