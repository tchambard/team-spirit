'use strict';

// to enable these logs set `DEBUG=boot:02-load-users` or `DEBUG=boot:*`
var log = require('debug')('boot:02-load-users');

//require('events').EventEmitter.prototype._maxListeners = 100;


function importData(_, app) {
	
	var User = app.models.user;
	var Role = app.models.Role;
	var RoleMapping = app.models.RoleMapping;
	var Team = app.models.Team;
	var MemberMapping = app.models.MemberMapping;
	var Binary = app.models.Binary;
	
	var users = [], roles = [];
	
	function createUsers(_) {

		[{
			firstName: 'Admin',
			lastName: 'User',
			email: 'admin@admin.com',
			username: 'admin',
			password: 'admin'
		},{
			firstName: 'Guest',
			lastName: 'User',
			email: 'user@user.com',
			username: 'user',
			password: 'user'
		},{
			firstName: 'User1',
			lastName: 'User1',
			email: 'user1@users.com',
			username: 'user1',
			password: 'user1'
		},{
			firstName: 'User2',
			lastName: 'User2',
			email: 'user2@users.com',
			username: 'user2',
			password: 'user2'
		},{
			firstName: 'User3',
			lastName: 'User3',
			email: 'user3@users.com',
			username: 'user3',
			password: 'user3'
		},{
			firstName: 'User4',
			lastName: 'User4',
			email: 'user4@users.com',
			username: 'user4',
			password: 'user4'
		},{
			firstName: 'User5',
			lastName: 'User5',
			email: 'user5@users.com',
			username: 'user5',
			password: 'user5'
		},{
			firstName: 'User6',
			lastName: 'User6',
			email: 'user6@users.com',
			username: 'user6',
			password: 'user6'
		},{
			firstName: 'User7',
			lastName: 'User7',
			email: 'user7@users.com',
			username: 'user7',
			password: 'user7'
		},{
			firstName: 'User8',
			lastName: 'User8',
			email: 'user8@users.com',
			username: 'user8',
			password: 'user8'
		}].forEach_(_, function(_, user) {
			try {
				var result = User.findOrCreate(
						{where: {username: user.username}}, // find
						user, // create
						[_]
				);
				var usr = result[0];
				var created = result[1];
				if (created) {
					console.log("Created user: "+JSON.stringify(usr,null,2));
					users.push(usr);
				} else {
					console.log("Existing user found user: "+JSON.stringify(usr,null,2));

				}
				
			} catch(e) {
				console.error("User findOrCreate error: " + e.stack);
			}
		});
	}
	
	function createRole(_, name, users) {

		// Redefine relations because json declaration does not work properly
		RoleMapping.belongsTo(User);
		//RoleMapping.belongsTo(Role);
		//User.hasMany(Role, {through: RoleMapping, foreignKey: 'principalId'});
		User.hasMany(RoleMapping, {foreignKey: 'principalId'});
		Role.hasMany(User, {through: RoleMapping, foreignKey: 'roleId'});
		
		Team.hasOne(Binary, {foreignKey: 'logoId', as: 'logo'});
		Team.hasOne(Binary, {foreignKey: 'banId', as: 'ban'});
		
		
		var roleObj = {
			name: name
		};
		try {
			var result = Role.findOrCreate(
				{where: {name: roleObj.name}}, // find
				roleObj, // create
				[_] // callback
			);
			var role = result[0];
			var created = result[1]
			
			if (created) {
				console.log("Created role: "+JSON.stringify(role,null,2));
				roles.push(role);
			} else {
				console.log("Existing role found: "+JSON.stringify(role,null,2));

			}

			users.forEach_(_, function(_, user) {
	            console.log("Role mapping USER associates user ["+user.username+"] to role ["+roleObj.name+"]");
				var rolePrincipal = role.principals.create({
	              principalType: RoleMapping.USER,
	              principalId: user.id
	            });
			});
			
		} catch(e) {
			console.error("Role findOrCreate error: " + e.stack);
		}

	}
	
	function createTeam(_, name, members, owner) {

		
		var teamObj = {
			name: name,
			mainColor: "#6391ff"
			//owner: owner.id
		};
		try {
			var result = Team.findOrCreate(
				{where: {name: teamObj.name}}, // find
				teamObj, //  create
				[_] // callback
			);
			var team = result[0];
			var created = result[1];
			
			if (created) {
				console.log("Created team: "+JSON.stringify(team, null, 2));
	
				Binary.setBlob({
					path: "boot/data",
					filename: "shadow.jpeg",
					mime: "image/jpeg",
					id: team.id,
					model: "Team",
					property: "logo"
				});
				
				
				//Team.setImage(team.id, "logo", "boot/data/shadow.jpeg");
					
			} else {
				console.log("Existing team found: "+JSON.stringify(team, null, 2));
			}

			
			members.forEach_(_, function(_, member) {
	            console.log("Associate team " +team.id + " with user " + member.id);

				var memberMap = MemberMapping.create({
					teamId: team.id,
					userId: member.id
	            }, _);
			});			
			
			

		} catch(e) {
			console.error("Team findOrCreate error " + e.stack);
		}

	}
	
	
	
	createUsers(_);
	createRole(_, "admin", users.slice(0, 1));
	createRole(_, "user", users);
	createTeam(_, "Team1", users.slice(2, 5), users[0]);
	createTeam(_, "Team2", users.slice(5), users[0]);

}

module.exports = function(app) {

  if (app.dataSources.db.name !== 'Memory' && !process.env.INITDB) {
    
	  console.error("Ignore users import");
	  return;
  }

  importData(_ >> function(err, res){
	  if (err) throw err;
	  return res;
  }, app);
};
