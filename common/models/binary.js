var gridfs = require("../extends/gridfs");
var loopback = require('loopback');

module.exports = function(Binary) {
	Binary.getBlob = function(id, res, cb) {
		var db = loopback.User.app.datasources.db.connector.db;
		gridfs.readBlob(db, id, res, function (err) {
			res.type('application/json');
			res.status(500).send({ error: err });
		});
	};
	
	Binary.setBlob = function(options, cb) {
		try {
			var filename = options.filename,
				mime = options.mime;
	
			
			var instanceId = options.id,
				prop = options.property,
				model = typeof options.model === "string" ? loopback.findModel(options.model) : options.model;
	
			model.findOne({
				where : {
					id : instanceId
				}
			}, function(err, inst) {
				if (err) throw err;
				//
				var db = inst.constructor.app.datasources.db.connector.db;
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
					var propData = {
						gridId: writerId,
						filename: options.filename,
						mime: options.mime
					};
					
					inst[prop](function(err, rel) {
						if (err) throw err;
						if (!rel) {
							inst[prop].create(propData, function(err, rel) {
								if (err) throw err;
								if (cb) cb(null,rel.gridId);
							});
						} else {
							inst[prop].update(propData, function(err, rel) {
								if (err) throw err;
								if (cb) cb(null,rel.gridId);
							});
						}
					});
				 });
			});
		} catch(e) {
			if (cb) cb(err);
		}
	};
	

	Binary.remoteMethod('getBlob', {
	  accepts: [{
			arg : 'id',
			type : 'string',
			required: true, 
			http : {
				source : 'query'
			}
		}, {
			arg: 'res',
			type: 'object',
			http: {
				source: 'res'
			}
		}
	  ],
	  http: {
	    verb: 'get',
	    path: '/getBlob'
	  }
	});
	
	Binary.remoteMethod('setBlob', {
		http : {
			path : '/setBlob',
			verb : 'post'
		},
		
		accepts : [{
			arg: 'options',
			type: 'object',
			required: true, 
			http: {
				source: 'body'
			}
		}],
		returns : {
			arg : 'img',
			type : 'string'
		}
	});
};