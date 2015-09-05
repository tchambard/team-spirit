var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;
var GridStore = mongo.GridStore;
var Grid = require('gridfs-stream');

module.exports = function(Team) {

	Team.getAvatar = function(id, res, cb) {
console.error("id: "+id);
		this.findOne({
			where : {
				id : id
			}
		}, function(err, team) {
			if (err) throw err;
			console.error("avatarId: "+team.avatarId);

			team.readAvatar(team.avatarId, res);

			// callback is intentionally not invoked
		});
	};
	
	Team.setAvatar = function(teamId, filename, data) {
		this.findOne({
			where : {
				id : teamId
			}
		}, function(err, team) {
			if (err) throw err;
			team.writeAvatar(filename, data);
		});
		
	};

	Team.prototype.readAvatar = function(id, res) {
		var self = this;
		var teamModel = this.constructor;
		var app = teamModel.app;

		var db = app.datasources.db.connector.db;

		var gfs = Grid(db, mongo);

		// streaming from gridfs
		var readstream = gfs.createReadStream({
		  _id: id
		});
		
		//error handling, e.g. file does not exist in gridFs
		readstream.on('error', function (err) {
			console.log('An error occurred!', err);
			res.type('application/json');
			res.status(500).send({ error: err });
		});
		
		readstream.pipe(res);
	};
	
	
	Team.prototype.writeAvatar = function(filename, readableStream) {
		

			var self = this;
		
			var teamModel = this.constructor;
			var app = teamModel.app;
	
			var db = app.datasources.db.connector.db;
	
			/*
			
			var gridStore = new GridStore(db, new ObjectID(), "test_gs_getc_file", "w");
			gridStore.open(function(err, gridStore) {
				console.error("Open cb");

				// Write some content to the file
				gridStore.write("hello", function(err, gridStore) {
					console.error("GRIDSTORE: "+JSON.stringify(gridStore,null,2));
					// Flush the file to GridFS
					gridStore.close(function(err, fileData) {
						console.error("DATA: "+JSON.stringify(fileData,null,2));
					});
				});
			});

		*/
		
		var gfs = Grid(db, mongo);

		// streaming to gridfs
		var writestream = gfs.createWriteStream({
			filename : filename
		});
		writestream.on('finish', function() {
		  console.log('Write avatar complete.');
		  //console.error("ws= "+ require('util').inspect(writestream,null,2));
		  console.log("AV ID: "+writestream.id);
		  self.updateAttribute("avatarId", writestream.id, function(err, inst) {
			  if (err) throw err;
		  });
		  
		});
		readableStream.pipe(writestream);

	};
	

	
	

	Team.remoteMethod('getAvatar', {
	  accepts: [
	    {arg: 'id', type: 'string', required: true, 'http': {source: 'query'}},
	    {arg: 'res', type: 'object', 'http': {source: 'res'}}
	  ],
	  http: {
	    verb: 'get',
	    path: '/:id/getAvatar'
	  }
	});
	
	Team.remoteMethod('setAvatar', {
		http : {
			path : '/setAvatar',
			verb : 'post'
		},
		accepts : {
			arg : 'id',
			type : 'string',
			http : {
				source : 'query'
			}
		},
		returns : {
			arg : 'myAvatar',
			type : 'string'
		}
	});
};