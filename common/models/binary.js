var gridfs = require("../extends/gridfs");
var loopback = require('loopback');

module.exports = function(Binary) {
	Binary.getBlob = function(blobId, res, cb) {
		var db = loopback.User.app.datasources.db.connector.db;

		gridfs.readBlob(db, blobId, res, function (err) {
			res.type('application/json');
			res.status(500).send({ error: err });
		});
	};
	
	Binary.setBlob = function(options, cb) {
		try {	
			var db = loopback.User.app.datasources.db.connector.db;

			var buffer, ext;
			if (options.data) {
				var regex = /^data:.+\/(.+);base64,(.*)$/;

				var matches = options.data.match(regex);
				ext = "." + matches[1];
				var _data = matches[2];
				buffer = new Buffer(_data, "base64");
			} else if (options.path) {
				ext = require('path').extname(options.filename);
				buffer = require("fs").readFileSync(options.path + "/" + options.filename);
			}
			gridfs.writeBlob(db, options.filename, buffer, function(writerId) {
				cb(null, writerId);
			});
		} catch(e) {
			if (cb) cb(err);
		}
	};
};