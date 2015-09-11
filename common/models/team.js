var mongoUtils = require("../tools/mongoUtils");

module.exports = function(Team) {

	Team.getImage = function(teamId, prop, res, cb) {
		
		this.findOne({
			where : {
				id : teamId
			}
		}, function(err, team) {
			if (err) throw err;
			//
			var db = team.constructor.app.datasources.db.connector.db;
			mongoUtils.readBlob(db, team[prop], res, function (err) {
				res.type('application/json');
				res.status(500).send({ error: err });
			});
			// callback is intentionally not invoked
		});
	};
	
	Team.setImage = function(teamId, prop, data, cb) {
		this.findOne({
			where : {
				id : teamId
			}
		}, function(err, team) {
			if (err) throw err;
			//
			var db = team.constructor.app.datasources.db.connector.db;
			var buffer, ext;
			if (typeof data !== "string") {
				var regex = /^data:.+\/(.+);base64,(.*)$/;

				var matches = data.data.match(regex);
				ext = "." + matches[1];
				var _data = matches[2];
				buffer = new Buffer(_data, "base64");
			} else {
				ext = require('path').extname(data);
				buffer = require("fs").readFileSync(data);
			}
			mongoUtils.writeBlob(db, team.name + "_" + prop + ext, buffer, function(writerId) {
				  team.updateAttribute(prop, writerId, function(err, inst) {
					  if (err) throw err;
					  if (cb) cb();
				  });
			 });
		});
		
	};
	

	Team.remoteMethod('getImage', {
	  accepts: [{
			arg : 'teamId',
			type : 'string',
			required: true, 
			http : {
				source : 'query'
			}
		}, {
			arg : 'property',
			type : 'string',
			required: true, 
			http : {
				source : 'query'
			}
		},
	    {
			arg: 'res',
			type: 'object',
			http: {
				source: 'res'
			}
		}
	  ],
	  http: {
	    verb: 'get',
	    path: '/:id/getImage'
	  }
	});
	
	Team.remoteMethod('setImage', {
		http : {
			path : '/setImage',
			verb : 'post'
		},
		
		accepts : [{
			arg : 'teamId',
			type : 'string',
			required: true, 
			http : {
				source : 'query'
			}
		}, {
			arg : 'property',
			type : 'string',
			required: true, 
			http : {
				source : 'query'
			}
		}, {
			arg: 'data',
			type: 'object',
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