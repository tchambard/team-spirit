'use strict';

// to enable these logs set `DEBUG=boot:001-extends-models` or `DEBUG=boot:*`
var log = require('debug')('boot:001-extends-models');

module.exports = function(app) {

	var User = app.models.user;
	var Role = app.models.Role;
	var RoleMapping = app.models.RoleMapping;
	var Team = app.models.Team;
	var MemberMapping = app.models.MemberMapping;
	var Binary = app.models.Binary;
	
	// Manage users and roles relations
	RoleMapping.belongsTo(User);
	RoleMapping.belongsTo(Role);
	User.hasMany(Role, {through: RoleMapping, foreignKey: 'principalId'});
	User.hasMany(RoleMapping, {foreignKey: 'principalId'});
	Role.hasMany(User, {through: RoleMapping, foreignKey: 'roleId'});
	
	
	// add blob capabilities to Team model
	app.registry.registerBlobRelation("Team", ["logo", "ban"]);
};
