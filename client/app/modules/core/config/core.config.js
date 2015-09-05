'use strict';
var app = angular.module('com.module.core');
app.run(function($rootScope, gettextCatalog) {

  // Left Sidemenu
  $rootScope.menu = [];

  // Add Sidebar Menu
  $rootScope.addMenu = function(name, uisref, icon) {
    $rootScope.menu.push({
      name: name,
      sref: uisref,
      icon: icon
    });
  };

  // Add Menu Dashboard
  $rootScope.addMenu(gettextCatalog.getString('Dashboard'), 'app.home',
    'fa-dashboard');

  // Dashboard
  $rootScope.dashboardBox = [];

  // Add Dashboard Box
  $rootScope.addDashboardBox = function(name, color, icon, quantity, href) {
    $rootScope.dashboardBox.push({
      name: name,
      color: color,
      icon: icon,
      quantity: quantity,
      href: href
    });
  };

});

app.config(function(formlyConfigProvider) {
  var templates = 'modules/core/views/elements/fields/';
  var formly = templates + 'formly-field-';
  var fields = [
    'checkbox',
    'email',
    'hidden',
    'number',
    'password',
    'radio',
    'select',
    'text',
    'textarea'
  ];

  angular.forEach(fields, function(val) {
    formlyConfigProvider.setTemplateUrl(val, formly + val + '.html');
  });

  formlyConfigProvider.setTemplateUrl('date', templates + 'date.html');
  formlyConfigProvider.setTemplateUrl('time', templates + 'time.html');

});

app.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
}]);
