var net = require('net');

const connections = [];

var server = net.createServer((conn) => {
    connections.push(conn);
    const remoteAddress = conn.remoteAddress + ':' + conn.remotePort; 
    console.log('connected: ' + remoteAddress);
    conn.write('Welcome to chat. No of connected clients: ' + connections.length + '\n');

    conn.setEncoding('utf8');

    conn.on('data', (data) => {
        console.log('connection data from %s: %j', remoteAddress, data);
        connections.forEach( (c) => {
            if (conn != c) {
                c.write(data);  
            }
        });
    });

    conn.once('close', () => {
        console.log('connection from %s closed', remoteAddress);
    });

    conn.on('error', (err) => {
        console.log('connection %s error: %s', remoteAddress, err.message);
    });

    conn.on('end', () => {
      console.log('client disconnected');
      let idx = connections.findIndex( (c) => c == conn);
      connections.splice(idx, 1);
  });
});

server.on('error', (err) => {
    console.log('[ERROR]:');
    throw err;
});


server.listen(1337, () => {
    console.log('server listening to %j', server.address());
});