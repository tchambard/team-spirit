'use strict';

// to enable these logs set `DEBUG=boot:02-load-users` or `DEBUG=boot:*`
var log = require('debug')('boot:02-load-users');



function importData(_, app) {
	
	var users = [], roles = [];
	
	function createUsers(_) {
		var User = app.models.User;

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
		},].forEach_(_, function(_, user) {
			try {
				var createdUser = User.findOrCreate(
						{where: {username: user.username}}, // find
						user, // create
						_ // callback
				);
				console.log("Created user: "+JSON.stringify(createdUser,null,2));
				users.push(createdUser);
			} catch(e) {
				console.error("User findOrCreate error: " + e.stack);
			}
		});
	}
	
	function createRole(_, name, users) {
		var Role = app.models.Role;
		var RoleMapping = app.models.RoleMapping;
		
		var roleObj = {
			name: name
		};
		try {
			var createdRole = Role.findOrCreate(
				{where: {name: roleObj.name}}, // find
				roleObj, // create
				_ // callback
			);
			console.log("Created role: "+JSON.stringify(createdRole,null,2));
			
			users.forEach_(_, function(_, user) {
				var rolePrincipal = createdRole.principals.create({
	              principalType: RoleMapping.USER,
	              principalId: user.id
	            });
	            console.log("Role mapping USER associates user ["+user.username+"] to role ["+roleObj.name+"]");
			});
			
			
			
			
			roles.push(createdRole);
		} catch(e) {
			console.error("Role findOrCreate error: " + e.stack);
		}

	}
	
	function createTeam(_, name, members, owner) {
		var Team = app.models.Team;
		var MemberMapping = app.models.MemberMapping;
		var Image = app.models.Binary;
		
		var teamObj = {
			name: name,
			mainColor: "#6391ff"
			//owner: owner.id
		};
		try {
			var createdTeam = Team.findOrCreate(
				{where: {name: teamObj.name}}, // find
				teamObj, //  create
				_ // callback
			);
			
			console.log("Created team: "+JSON.stringify(createdTeam, null, 2));
			Team.setImage(createdTeam.id, "logo", "boot/data/shadow.jpeg");
			
			
			members.forEach_(_, function(_, member) {
				var memberMap = MemberMapping.create({
					teamId: createdTeam.id,
					userId: member.id
	            }, _);
	            console.log("Members: "+JSON.stringify(memberMap,null,2));
			});
			/*
			var avatar = createdTeam.avatar.create({
				filename: name + "Avatar",
				mime: "image/jpeg",
				content: getImage(_)
			}, _);
			*/
			

		} catch(e) {
			console.error("Team findOrCreate error " + e.stack);
		}

	}
	
	
	
	createUsers(_);
	createRole(_, "admin", [users[0]]);
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
