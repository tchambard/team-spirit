"use strict";

var ez = require('ez-streams');
var mongo = require('mongodb');
var grid = require('gridfs-stream');
var writerApi = require('ez-streams/lib/writer');

var gDevice = {

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


exports.readBlob = function(db, id, writer, onError) {
	var reader = gDevice.reader(db, {
	  id: id
	}, onError);
	// stream data
	reader.pipe(writer);
};

exports.writeBlob = function(db, filename, buffer, onFinish) {
	var self = this;
	// read from buffer
	var reader = ez.devices.buffer.reader(buffer);
	// streaming to gridfs
	var writer = gDevice.writer(db, {
		filename : filename
	}, onFinish, function(err) {
		throw err;
	});
	
	// stream data
	reader.pipe(_ >> function(err, res) {
		if (err) throw err;
	}, writer);
};
