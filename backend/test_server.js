const http = require('http');
const server = http.createServer((req, res) => {
  res.end('ok');
});
server.listen(5000, () => console.log('Test server listening on 5000'));
// keep process alive
setInterval(() => {}, 1000);
