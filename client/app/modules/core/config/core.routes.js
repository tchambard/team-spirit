'use strict';
angular.module('com.module.core')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('router', {
        url: '/router',
        template: '<div class="lockscreen" style="height: 100%"></div>',
        controller: 'RouteCtrl'
      })
      .state('app', {
        abstract: true,
        url: '/app',
        templateUrl: 'modules/core/views/app.html',
        controller: 'MainCtrl'
      })
      .state('home', {
	        url: '/home',
	        views: {
	
	            // the main template will be placed here (relatively named)
	            '': { templateUrl: 'modules/core/views/home.html' },
	
	            // the child views will be defined here (absolutely named)
	            'carousel@home': {
	            	templateUrl: 'modules/core/views/carousel.html'
	            }
	        }
	        
	    })
    
	  .state('about', {
        url: '/about',
        templateUrl: 'modules/core/views/about.html',
      })
      
      .state('blog-1', {
        url: '/blog-1',
        templateUrl: 'modules/core/views/blog-home-1.html',
      })
      
      .state('blog-2', {
        url: '/blog-2',
        templateUrl: 'modules/core/views/blog-home-2.html',
      })
      
      .state('blog-post', {
        url: '/blog-post',
        templateUrl: 'modules/core/views/blog-post.html',
      })
      
      .state('contact', {
        url: '/contact',
        templateUrl: 'modules/core/views/contact.html',
      })
      
      .state('faq', {
        url: '/faq',
        templateUrl: 'modules/core/views/faq.html',
      })

      .state('full-width', {
        url: '/full-width',
        templateUrl: 'modules/core/views/full-width.html',
      })
      
      .state('portfolio-1', {
        url: '/portfolio-1',
        templateUrl: 'modules/core/views/portfolio-1-col.html',
      })
      
      .state('portfolio-2', {
        url: '/portfolio-2',
        templateUrl: 'modules/core/views/portfolio-2-col.html',
      })
      
      .state('portfolio-3', {
        url: '/portfolio-3',
        templateUrl: 'modules/core/views/portfolio-3-col.html',
      })
      
      .state('portfolio-4', {
        url: '/portfolio-4',
        templateUrl: 'modules/core/views/portfolio-4-col.html',
      })
      
      .state('portfolio-item', {
        url: '/portfolio-item',
        templateUrl: 'modules/core/views/portfolio-item.html',
      })
      
      .state('pricing', {
        url: '/pricing',
        templateUrl: 'modules/core/views/pricing.html',
      })
      
      .state('services', {
        url: '/services',
        templateUrl: 'modules/core/views/services.html',
      })
      
      .state('sidebar', {
        url: '/sidebar',
        templateUrl: 'modules/core/views/sidebar.html',
      })      

    $urlRouterProvider.otherwise('/router');
  });
