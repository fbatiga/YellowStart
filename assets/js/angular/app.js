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
    .module('startApp', [
        'start.controllers', 'start.services',
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ui.router',
        'ngSanitize',
        'ngTouch',
        'xeditable',
        'ngBootbox',
        'ngDropzone',
        'selectize'
    ])
    .constant('CONFIG', {baseUrl: 'http://192.168.12.14:8080', apiUrl: 'http://192.168.12.14:8080/api'}).
    run(function (editableOptions, $state, $rootScope, Auth, $localstorage) {
        editableOptions.theme = 'bs3';
        $rootScope.$state = $state;
        $rootScope.globals = {};
        var user = $localstorage.getObject('currentUser');
        if (user) {
            $rootScope.globals.user = user;
            Auth.refresh().success(function(response){
                console.log(response);
                $rootScope.globals.user = response.user;
            });
        }

        $.ajaxSetup({
            headers: { 'Authorization':  'Bearer ' + $localstorage.get('auth_token') }
        });


        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if (!Auth.authorize(toState.data.access)) {
                event.preventDefault();
                $state.go('user-register');
            }
        });
    }).
    config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }]);
;
