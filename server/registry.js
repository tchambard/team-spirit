"use strict";

var util = require('util');

module.exports = Registry;

/**
 * Define and reference `Models` and `DataSources`.
 *
 * @class
 */

function Registry(app) {
	var Binary;
	var Team = app.models.Team;
	function _registerOneBlob(Model, property) {
		Model.hasOne(Binary, {foreignKey: property + 'Id', as: property});
	}

	function _registerManyBlobs(Model, property) {
		
	}
	app.registry.registerBlobRelation = function(Model, properties, isPlural) {
		if (!Binary) Binary = app.models.Binary;
		var registerFn = isPlural ? _registerManyBlobs : _registerOneBlob;
		if (Array.isArray(properties)) {
			properties.forEach(function(p) {
				registerFn(Model, p);
			});
		} else {
			registerFn(Model, properties);
		}
		
		
		
	};
}
