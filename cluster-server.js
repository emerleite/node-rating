var server = require('./node-rating');
var port = process.env.PORT || "3000";
var cluster = require('cluster');
cluster(server)
  .set('workers', 1)
  .use(cluster.logger())
  .use(cluster.stats())
  .use(cluster.pidfiles())
  .use(cluster.cli())
  .listen(parseInt(port));
