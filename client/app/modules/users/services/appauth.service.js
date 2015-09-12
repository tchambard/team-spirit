'use strict';

/*jshint sub:true*/
/*jshint camelcase: false */

angular.module('com.module.users')
  .factory('AppAuth', function($cookies, User, LoopBackAuth, $http) {
    return {
      login: function(data, cb) {
        var self = this;
        LoopBackAuth.currentUserId = LoopBackAuth.accessTokenId = null;
        $http.post('/api/users/login', {
            email: data.email,
            password: data.password
          })
          .then(function(response) {
            if (response.data && response.data.id) {
              LoopBackAuth.currentUserId = response.data.userId;
              LoopBackAuth.accessTokenId = response.data.id;
            }
            if (LoopBackAuth.currentUserId === null) {
              delete $cookies['access_token'];
              LoopBackAuth.accessTokenId = null;
            }
            LoopBackAuth.save();
            
            if (LoopBackAuth.currentUserId) {
            	   User.findOne({
            		      filter: {
            		        where: {
            		          id: LoopBackAuth.currentUserId
            		        },
            		        include: ['roles', 'identities', 'credentials', 'accessTokens']
            		      }
            		    }, function(user) {
            		    	self.currentUser = user;
            		    	console.log(JSON.stringify(user,null,2));
            		    	cb(self.currentUser);
            		    }, function(err) {
            		      console.log(err);
            		      cb({});
            		    });
            	   

            } else {
            	cb({});
            }
          }, function() {
            console.log('User.login() err', arguments);
            LoopBackAuth.currentUserId = LoopBackAuth.accessTokenId =
              null;
            LoopBackAuth.save();
            cb({});
          });
      },

      logout: function() {
        LoopBackAuth.clearUser();
        LoopBackAuth.save();
        window.location = '/auth/logout';
      },

      ensureHasCurrentUser: function(cb) {
        var self = this;
        if ((!this.currentUser || this.currentUser.id === 'social') &&
          $cookies.access_token) {
          LoopBackAuth.currentUserId = LoopBackAuth.accessTokenId = null;
          $http.get('/auth/current')
            .then(function(response) {
              if (response.data.id) {
                LoopBackAuth.currentUserId = response.data.id;
                LoopBackAuth.accessTokenId = $cookies.access_token.substring(
                  2, 66);
              }
              if (LoopBackAuth.currentUserId === null) {
                delete $cookies['access_token'];
                LoopBackAuth.accessTokenId = null;
              }
              LoopBackAuth.save();
              self.currentUser = response.data;
              var profile = self.currentUser && self.currentUser.profiles &&
                self.currentUser.profiles.length && self.currentUser.profiles[
                  0];
              if (profile) {
                self.currentUser.name = profile.profile.name;
              }
              cb(self.currentUser);
            }, function() {
              console.log('User.getCurrent() err', arguments);
              LoopBackAuth.currentUserId = LoopBackAuth.accessTokenId =
                null;
              LoopBackAuth.save();
              cb({});
            });
        } else {
          console.log('Using cached current user.');
          cb(self.currentUser);
        }
      }
      
      
    };
  })
  .directive('restrict', function(authService){
	    return{
	        restrict: 'A',
	        priority: 100000,
	        scope: false,
	        link: function(){
	            // alert('ergo sum!');
	        },
	        compile:  function(element, attr, linker){
	            var accessDenied = true;
	            var user = authService.getUser();

	            var attributes = attr.access.split(" ");
	            for(var i in attributes){
	                if(user.role == attributes[i]){
	                    accessDenied = false;
	                }
	            }


	            if(accessDenied){
	                element.children().remove();
	                element.remove();           
	            }

	        }
	    }
	});
