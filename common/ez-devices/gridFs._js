"use strict";

var ez = require('ez-streams');
var mongo = require('mongodb');
var grid = require('gridfs-stream');
var writerApi = require('ez-streams/lib/writer');

module.exports = {

	reader: function(db, options, onError) {
		options = options || {};
		var gfs = grid(db, mongo);
		// streaming from gridfs
		var readstream = gfs.createReadStream({
		  _id: options.id
		});
		if (onError) readstream.on('error', function(err) {
			onError(err);	
		});
		return readstream;
	},

	writer: function(db, options, onFinish, onError) {
		options = options || {};
		var gfs = grid(db, mongo);
		// streaming to gridfs
		var writestream = gfs.createWriteStream({
			filename : options.filename
		});
		if (onFinish) writestream.on('finish', function(id) {
			onFinish(writestream.id);
		});
		if (onError) writestream.on('error', function(err) {
			onError(err);	
		});
		
		return ez.devices.node.writer(writestream);		
	}
};