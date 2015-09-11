var mongoUtils = require("../tools/mongoUtils");

module.exports = function(Team) {

	Team.getLogo = function(id, res, cb) {
		
		this.findOne({
			where : {
				id : id
			}
		}, function(err, team) {
			if (err) throw err;
			//
			var db = team.constructor.app.datasources.db.connector.db;
			mongoUtils.readBlob(db, team.logoId, res, function (err) {
				res.type('application/json');
				res.status(500).send({ error: err });
			});
			// callback is intentionally not invoked
		});
	};
	
	Team.setLogo = function(teamId, data, cb) {
		this.findOne({
			where : {
				id : teamId
			}
		}, function(err, team) {
			if (err) throw err;
			//
			var db = team.constructor.app.datasources.db.connector.db;
			
			if (!(data instanceof Buffer)) {
				buffer = new Buffer(data.data.split(',')[1], "base64");
			} else {
				buffer = data;
			}
			mongoUtils.writeBlob(db, team.name + "_logo", buffer, function(writerId) {
				  team.updateAttribute("logoId", writerId, function(err, inst) {
					  if (err) throw err;
					  if (cb) cb();
				  });
			 });
		});
		
	};
	

	

	
	

	Team.remoteMethod('getLogo', {
	  accepts: [
	    {arg: 'id', type: 'string', required: true, 'http': {source: 'query'}},
	    {arg: 'res', type: 'object', 'http': {source: 'res'}}
	  ],
	  http: {
	    verb: 'get',
	    path: '/:id/getLogo'
	  }
	});
	
	Team.remoteMethod('setLogo', {
		http : {
			path : '/setLogo',
			verb : 'post'
		},
		
		accepts : [{
			arg : 'id',
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
			arg : 'logo',
			type : 'string'
		}
	});
};