'use strict';

/*jshint sub:true*/
/*jshint camelcase: false */

angular.module('com.module.teams')
  .factory('TeamSvc', function(Team, CoreService) {
    return {
	      getTeamById: function(id, cb) {
	    	  var team;
	    	  Team.findOne({
	    	      filter: {
	    	        where: {
	    	          id: id
	    	        },
	    	        include: ['members']
	    	      }
	    	    }, function(t) {
					if (t.logo) {
						t.avatarUrl = CoreService.env.apiUrl +  "/Teams/{teamId}/getImage?teamId="+ t.id + "&property=logo";
					} else {
						//t.avatarUrl = "https://www.trynova.org/wp-content/uploads/2012/07/TEAM.jpg";
					}
					
					if (t.ban) {
						t.banUrl = CoreService.env.apiUrl +  "/Teams/{teamId}/getImage?teamId="+ t.id + "&property=ban";
					} else {
						//t.avatarUrl = "https://www.trynova.org/wp-content/uploads/2012/07/TEAM.jpg";
					}
	    	    	cb(null, t);
	    	    }, function(err) {
		    	    cb(err);
	    		});
	      
	      },
	      uploadImg: function(id, prop, data, cb) {
	    	  Team.setImage({teamId: id, property: prop}, {data: data}, function(result, headers) {
	    	    	cb(null, result);
	    	    }, function(err) {
		    	    cb(err);
	    		});
	      }
	  }
  });
