var server = require('./node-rating');
var port = process.env.PORT || "3000";
var cluster = require('cluster');
cluster(server)
  .use(cluster.logger())
  .use(cluster.stats())
  .use(cluster.pidfiles())
  .use(cluster.cli())
  .listen(port);
