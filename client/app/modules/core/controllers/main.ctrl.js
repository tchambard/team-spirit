'use strict';
/**
 * @ngdoc function
 * @name com.module.core.controller:MainCtrl
 * @description Login Controller
 * @requires $scope
 * @requires $state
 * @requires $location
 * @requires CoreService
 * @requires AppAuth
 * @requires User
 * @requires gettextCatalog
 **/
angular.module('com.module.core')
  .controller('MainCtrl', function($scope, $rootScope, $state, $location,
    CoreService, User, gettextCatalog, AppAuth) {

	AppAuth.ensureHasCurrentUser(function(user)
    {
      $scope.currentUser = user;
	});

    $scope.menuoptions = $rootScope.menu;
    $scope.logout = function() {
      User.logout(function() {
        $state.go('login');
        CoreService.toastSuccess(gettextCatalog.getString('Logged out'),
          gettextCatalog.getString('You are logged out!'));
      });
    };

  }).controller('UploadController', function($scope, $timeout, Cropper) {
	  var file, data;

	  
	  /**
	   * When there is a cropped image to show encode it to base64 string and
	   * use as a source for an image element.
	   */
	  var preview = function() {
	    if (!file || !data) return;
	    Cropper.crop(file, data).then(Cropper.encode).then(function(dataUrl) {
	      ($scope.preview || ($scope.preview = {})).dataUrl = dataUrl;
	    });
	  };

	  /**
	   * Use cropper function proxy to call methods of the plugin.
	   * See https://github.com/fengyuanchen/cropper#methods
	   */
	  var clear = function(degrees) {
	    if (!$scope.cropper.first) return;
	    $scope.cropper.first('clear');
	  };

	  var scale = function(width) {
	    Cropper.crop(file, data)
	      .then(function(blob) {
	    	  $scope.mode = "preview";
	        return Cropper.scale(blob, {width: width});
	      })
	      .then(Cropper.encode).then(function(dataUrl) {
	    	 
	        ($scope.preview || ($scope.preview = {})).dataUrl = dataUrl;
	        
	      });
	  }
	  
	  console.log("DATA: "+JSON.stringify($scope.data,null,2));
	  

	  /**
	   * Method is called every time file input's value changes.
	   * Because of Angular has not ng-change for file inputs a hack is needed -
	   * call `angular.element(this).scope().onFile(this.files[0])`
	   * when input's event is fired.
	   */
	  $scope.onFile = function(blob) {
		  if (blob && file && file.size != blob.size) {
		  }
	    Cropper.encode((file = blob)).then(function(dataUrl) {
	    	$scope.dataUrl = dataUrl;
	    	$timeout(showCropper);  // wait for $digest to set image's src
	    	$scope.mode = "edit";
	    });
	  };

	  /**
	   * Croppers container object should be created in controller's scope
	   * for updates by directive via prototypal inheritance.
	   * Pass a full proxy name to the `ng-cropper-proxy` directive attribute to
	   * enable proxing.
	   */
	  $scope.cropper = {};
	  $scope.cropperProxy = 'cropper.first';



	  /**
	   * Object is used to pass options to initalize a cropper.
	   * More on options - https://github.com/fengyuanchen/cropper#options
	   */
	  $scope.options = {
	    maximize: true,
	    aspectRatio: 1 / 1,
	    crop: function(dataNew) {
	      data = dataNew;
	    },
	    replace: function(url) {
	    	$scope.dataUrl = url;
	    	($scope.preview || ($scope.preview = {})).dataUrl = url;
	    }
	  };
	  
	  

	  /**
	   * Showing (initializing) and hiding (destroying) of a cropper are started by
	   * events. The scope of the `ng-cropper` directive is derived from the scope of
	   * the controller. When initializing the `ng-cropper` directive adds two handlers
	   * listening to events passed by `ng-cropper-show` & `ng-cropper-hide` attributes.
	   * To show or hide a cropper `$broadcast` a proper event.
	   */
	  $scope.showEvent = 'show';
	  $scope.hideEvent = 'hide';

	  function showCropper() { $scope.$broadcast($scope.showEvent); }
	  function hideCropper() { $scope.$broadcast($scope.hideEvent); }

	  $scope.mode = $scope.dataUrl != null ? "preview" : "edit";
	  $scope.edit = function() {
		  $scope.mode = "edit";
	  }
	  
	  $scope.valid = function() {
		  scale(300);
	  }
	  
	});
