"use strict";

var util = require('util');
var inflection = require( 'inflection' );

module.exports = Registry;

/**
 * Define and reference `Models` and `DataSources`.
 *
 * @class
 */

function Registry(app) {
	var Binary;
	
	
	function addModelMethods(modelName, property, pluralName) {
		
		var Model = app.models[modelName];
		var capitalizedName = property.charAt(0).toUpperCase() + property.substring(1);
		
		Model["get" + capitalizedName] = function(blobId, res, cb) {
			Binary.getBlob(blobId, res, cb);
		};
		
		
		var setPrefix = pluralName ? "add" : "set";
		Model[setPrefix + capitalizedName] = function(options, cb) {

			Model.findOne({
				where : {
					id : options.id
				}
			}, function(err, inst) {
				if (err) cb(err);

				Binary.setBlob({
					data: options.data,
					path: options.path,
					filename: options.filename
				}, function(err, blobId) {
					var propData = {
						blobId: blobId,
						filename: options.filename,
						mime: options.mime
					};
					
					if (pluralName) {
						inst[pluralName].create(propData, function(err, rel) {
							if (err) cb(err);
							if (cb) cb(null,rel.blobId);
						});
					}else {
						// get property value
						inst[property](function(err, rel) {
							if (err) cb(err);
							// if no value, create it
							if (!rel) {
								inst[property].create(propData, function(err, rel) {
									if (err) cb(err);
									if (cb) cb(null,rel.blobId);
								});
							} 
							// else if value is already set, update it
							else {
								inst[property].update(propData, function(err, rel) {
									if (err) cb(err);
									if (cb) cb(null,rel.blobId);
								});
							}
						});
					}
					
					
				});

			});
		};
		
		Model.remoteMethod('get' + capitalizedName, {
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
		    path: '/get' + capitalizedName
		  }
		});
		
		Model.remoteMethod(setPrefix + capitalizedName, {
			http : {
				path : setPrefix + capitalizedName,
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
				arg : 'blob',
				type : 'string'
			}
		});
	}
	
	function _registerOneBlob(modelName, property) {
		app.models[modelName].hasOne(Binary, {foreignKey: property + 'Id', as: property});
		addModelMethods(modelName, property);
	}

	function _registerManyBlobs(modelName, property) {
		var pluralName = inflection.pluralize(property);
		app.models[modelName].hasMany(Binary, {foreignKey: property + 'Id', as: pluralName});
		addModelMethods(modelName, property, pluralName);
	}
	app.registry.registerBlobRelation = function(modelName, properties, isPlural) {
		if (!Binary) Binary = app.models.Binary;
		var registerFn = isPlural ? _registerManyBlobs : _registerOneBlob;
		if (Array.isArray(properties)) {
			properties.forEach(function(p) {
				registerFn(modelName, p);
			});
		} else {
			registerFn(modelName, properties);
		}
		
	};
}
