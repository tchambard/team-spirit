var vcap_services = process.env.VCAP_SERVICES && JSON.parse(process.env.VCAP_SERVICES);
var mongoUri = process.env.MONGO_URI;
var MONGODB_URL;
if (vcap_services) {
	MONGODB_URL = vcap_services.mongolab[0].credentials.uri;
} else if (mongoUri) {
	console.log("Use mongoDb uri: "+mongoUri);
	MONGODB_URL = mongoUri;
}
if (MONGODB_URL) {
  module.exports = {
    db: {
      name: 'db',
      connector: 'loopback-connector-mongodb',
      url: MONGODB_URL
    }
  };
}

