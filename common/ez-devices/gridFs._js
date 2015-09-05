"use strict";

var mongo = require('mongodb');
var Grid = require('gridfs-stream');

module.exports = {

	reader: function(db, options) {
		options = options || {};
		var gfs = Grid(db, mongo);

		// streaming from gridfs
		var readstream = gfs.createReadStream({
		  _id: options.id
		});
		return readstream;
	},

	writer: function(db, options) {
		options = options || {};
		var gfs = Grid(db, mongo);
		// streaming to gridfs
		var writestream = gfs.createWriteStream({
			filename : options.filename
		});
		return writestream;
	}
};