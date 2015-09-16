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
.controller('CropperCtrl', function($scope, $state, $modalInstance, data) {
	  $scope.myImage='';
      $scope.myCroppedImage='';

      $scope.onFile=function(file) {
        var reader = new FileReader();
        reader.onload = function (evt) {
          $scope.$apply(function($scope){
            $scope.myImage=evt.target.result;
          });
        };
        reader.readAsDataURL(file);
      };
      
      $scope.onSubmit = function() {
    	  data.uploadFn(data.id, $scope.myCroppedImage, function(err, result) {
    		  $modalInstance.close();
    		  $state.transitionTo($state.current, $state.params, { reload: true, inherit: true, notify: true })
    	  });
      }
      
      
      if (data && data.url) {
    	  $scope.myImage = data.url;
      }
      
  }).controller('Cropper2Ctrl', function($scope, $timeout, $state, $modalInstance, data, Cropper, Binary) {
	  var file, crData;

	  var loadImage = function(blob) {
		  var reader = new FileReader();
	        reader.onload = function (evt) {
	          $scope.$apply(function($scope){
	        	  $scope.dataUrl = evt.target.result;
	    	      $timeout(showCropper); //  wait for $digest to set image's src	          
	    	  });
	        };
	        reader.readAsDataURL((file = blob));
	  }
	  /**
	   * Method is called every time file input's value changes.
	   * Because of Angular has not ng-change for file inputs a hack is needed -
	   * call `angular.element(this).scope().onFile(this.files[0])`
	   * when input's event is fired.
	   */
	  $scope.onFile = function(blob) {
		  hideCropper();
		  loadImage(blob);
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
	   * Use cropper function proxy to call methods of the plugin.
	   * See https://github.com/fengyuanchen/cropper#methods
	   */
	  $scope.clear = function(degrees) {
	    if (!$scope.cropper.first) return;
	    $scope.cropper.first('clear');
	  };

      $scope.onSubmit = function() {
    	  
  	    if (!file || !crData) return;
	    Cropper.crop(file, crData)
	    	// scale
	    	.then(function(blob) {
	    		return Cropper.scale(blob, {height: 200});
	    	})
	    	// encode
	    	.then(Cropper.encode)
	    	// upload
	    	.then(function(dataUrl) {
	    		data.uploadFn({
	    			id: data.id,
	    			filename: "test.jpeg",
	    			mime: "image/jpeg",
	    			data: dataUrl
	    		}, function(err, result) {
	    		
	    			$modalInstance.close();
	    			$state.transitionTo($state.current, $state.params, { reload: true, inherit: true, notify: true })
	    		},2000); 
	    	});
      }
	  /**
	   * Object is used to pass options to initalize a cropper.
	   * More on options - https://github.com/fengyuanchen/cropper#options
	   */
	  $scope.options = {
	    maximize: true,
	    aspectRatio: data.ratio || 4 / 3,
	    crop: function(dataNew) {
	      crData = dataNew;
	    },
	    replace: function(urlNew) {
	    	debugger;
	    	$scope.dataUrl = urlNew;
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

      if (data && data.url) {
    	  
    	  
    	// Simulate a call to Dropbox or other service that can
    	// return an image as an ArrayBuffer.
    	var xhr = new XMLHttpRequest();

    	// Use JSFiddle logo as a sample image to avoid complicating
    	// this example with cross-domain issues.
    	xhr.open( "GET", data.url, true );

    	// Ask for the result as an ArrayBuffer.
    	xhr.responseType = "arraybuffer";

    	xhr.onload = function( e ) {
    	    // Obtain a blob: URL for the image data.
    	    var arrayBufferView = new Uint8Array( this.response );
    	    var blob = new Blob( [ arrayBufferView ], { type: "image/jpg" } );
    	    loadImage(blob);
    	    //$scope.dataUrl = urlCreator.createObjectURL( blob );

    	};

    	xhr.send();

      }
	});
