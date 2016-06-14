'use strict';

/**
 * @ngdoc overview
 * @name startApp
 * @description
 * # startApp
 *
 * Main module of the application.
 */
angular
    .module('startApp').config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/js/angular/modules/startup/list/home.html',
                controller: 'ListStartupCtrl',
                data: {access: "USER" }
            })
            .state('startup-new', {
                url: '/startup/new',
                templateUrl: '/js/angular/modules/startup/edit/edit.html',
                controller: 'EditStartupCtrl',
                data: {access: "USER" }
            })
            .state('startup-edit', {
                url: '/startup/:_id/edit',
                templateUrl: '/js/angular/modules/startup/edit/edit.html',
                controller: 'EditStartupCtrl'
                ,data: {access: "USER" }
            })
            .state('startup-view', {
                url: '/startup/:_id/view',
                templateUrl: '/js/angular/modules/startup/view/view.html',
                controller: 'ViewStartupCtrl',
                data: {access: "USER" }
            })
            .state('startup-list', {
                url: '/startup?:search',
                templateUrl: '/js/angular/modules/startup/list/list.html',
                controller: 'ListStartupCtrl',
                data: {access: "USER" }
            })
            .state('user-register', {url: '/user/register', templateUrl: '/js/angular/modules/user/register/register.html',
                controller: 'RegisterCtrl',
                data: {access: "ANONYMOUS" }
            });
    });