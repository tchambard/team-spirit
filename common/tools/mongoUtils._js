"use strict";

var ez = require('ez-streams');
var GridFs = require('../ez-devices/gridFs');

exports.readBlob = function(db, id, writer, onError) {
	var reader = GridFs.reader(db, {
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
	var writer = GridFs.writer(db, {
		filename : filename
	}, onFinish, function(err) {
		throw err;
	});
	
	// stream data
	reader.pipe(_ >> function(err, res) {
		if (err) throw err;
	}, writer);
};
