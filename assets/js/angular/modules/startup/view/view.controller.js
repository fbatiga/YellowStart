'use strict';

/**
 * @ngdoc function
 * @name startApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the startApp
 */
angular.module('start.controllers')
    .controller('ViewStartupCtrl', function ($scope, $rootScope, $stateParams, $window, $sce, Startup, StartupComment, StartupContact, UserService, NotificationService) {
        $scope.pageClass = 'startup-view';

        $scope.iframeUrl = function (src) {
            return $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + src);
        };

        if ($stateParams._id) {
            $scope.startup = new Startup({_id: $stateParams._id});
            $scope.startup.$get().then(function(){

                $scope.startupContacts = StartupContact.query({'query[startupId]': $stateParams._id}).$promise.then(function (res) {
                    console.log(res);
                    if (res.length > 0) {
                        var contact = res[0];
                        var content = '<div class="startup-map-infowindow">' +
                            '<div class="picture"><img alt="" src="http://dummyimage.com/90x90/000/fff" /></div>' +
                            '<div class="inner">' +
                            '<div class="name">' + contact.firstname + ' ' + contact.lastname + '</div> ' +
                            '<div class="job">' + (contact.role ? contact.role : '') + '</div> ' +
                            '<div class="email">' + (contact.email ? contact.email : '') + '</div> ' +
                            '<div class="phone">' + (contact.phonenumber ? contact.phonenumber : "") + '</div> ' +
                            '<div class="address">' + ($scope.startup.address ? $scope.startup.address : '' ) + '</div> ' +
                            '</div>' +
                            '</div>';
                    }
                    initGooglemaps($scope.startup.address, content);
                });

            });
        }
        else {
            $scope.startup = {
                'startupName': 'Souscritoo',
                'tags': ['home', 'service'],
                'tagline': 'La souscription multiservices en 1 clic',
                'category': 'iot',
                'websiteUrl': 'http://www.souscrito.com',
                'projectTweet': 'Vous déménagez ? Souscrivez en un coup de fil tous vos contrats d\'électricité, gaz, box & assurance. 20 min max. Zéro papier. 100% gratuit.',
                'offerServices': "Lors des déménagements, les clients doivent souscrire électricité, gaz box et " +
                "assurance habitation, processus pénible et sans intérêt. Grâce aux services de Souscritoo, en nous appelant," +
                "les clients peuvent souscrire d'un seul coup tous ces contrats en moins de 20 minutes, et avec zéro papiers" +
                "(adresse et RIB suffisent) - résiliation des an ciens contrats incluse." +
                "Ce service est bien évidement gratuit. Souscritoo permet à ses client d’économiser 300€/an et " +
                " ses offres sont sans engagement. Souscritoo innove en proposant un service 100% GRATUIT " +
                " aux consommateurs dans le but spécifique de prendre en charge leur démarches post " +
                " déménagement (aucune entreprise ne le faisant actuellement).",
                'offerStrengths': '',
                'offerAccess': '',
                'offerBusiness': '',
                MarketDescription: "",
                MarketClients: "",
                MArketCompetitors: "",
                'team': '',
                'existingCustomers': '',
                'rewards': '',
                'funds': '',
                'revenues': '',
                'otherRevenues': '',
                'progress': '',
                'partnerships': ''
            };

        }
        $scope.isBookmarked = $rootScope.globals.user.bookmarks && $rootScope.globals.user.bookmarks.indexOf($scope.startup._id) > -1 ? true : false;


        $scope.comments = StartupComment.query({'query[startupId]': $stateParams._id});
        $scope.relatedStartups = Startup.query({'publishedOnly':1, 'related': $stateParams._id, limit: 3});

        $scope.saveComment = function (text) {
            var comment = new StartupComment({
                userName: $rootScope.globals.user.firstname + ' ' + $rootScope.globals.user.lastname,
                text: text,
                startupId: $stateParams._id,
                userId: $rootScope.globals.user._id
            });
            comment.$save().then(function (response) {
                $scope.newCommentText = "";
                $scope.comments.push(response);
                NotificationService.newComment({startupId: $scope.startup._id});
            });
        };


        $scope.deleteStartup = function () {
            if ($rrotScope.globals.user.roles.indexOf('ADMIN') !== -1) {
                $scope.startup.$delete().$promise.then(function (res) {
                    $state.go('startup-list');
                });
            }

        }
        $scope.bookmarkStartup = function () {
            var index = $rootScope.globals.user.bookmarks.indexOf($stateParams._id);
            console.log('removing items ', index);

            if (index === -1) {
                $rootScope.globals.user.bookmarks.push($stateParams._id);
                $scope.isBookmarked = true;
            }
            else {
                console.log($rootScope.globals.user.bookmarks.splice(index, 1), $rootScope.globals.user.bookmarks);
                $scope.isBookmarked = false;
            }
            UserService.Update($rootScope.globals.user);
        };

        function initGooglemaps(address, infoboxContent) {
            console.log('init google maps');
            console.log(address);
            console.log(infoboxContent);
            var map = '';
            var geocoder = new google.maps.Geocoder();
            var address = address;

            geocoder.geocode({'address': address}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();

                    initialize(latitude, longitude, infoboxContent);
                }
            });
        };

        function initialize(latitude, longitude, infoboxContent) {
            var latLng = new google.maps.LatLng(latitude, longitude);

            var mapOptions = {
                zoom: 10,
                scrollwheel: false,
                panControl: false,
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                overviewMapControl: false,
                navigationControl: false,
                draggable: true,
                center: latLng
            };

            var map = new google.maps.Map(document.getElementById('map'), mapOptions);

            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                icon: '/images/spacer.gif'
            });

            var infoBubble = new InfoBubble({
                width: 300,
                borderRadius: 0,
                arrowSize: 20,
                borderWidth: 0,
                shadowStyle: 0,
                content: infoboxContent ? infoboxContent : '<div class="startup-map-infowindow">' +
                '<div class="picture"><img alt="" src="http://dummyimage.com/90x90/000/fff" /></div>' +
                '<div class="inner">' +
                '<div class="name">Philippe Martel</div> ' +
                '<div class="job">CEO & Founder</div> ' +
                '<div class="email">philippe@souscritoo.com</div> ' +
                '<div class="phone">+33 6 43 75 88 99</div> ' +
                '<div class="address">21 Rue de Cléry<br />75002 Paris</div> ' +
                '</div>' +
                '</div>'
            });

            infoBubble.open(map, marker);

            google.maps.event.addDomListener(window, 'resize', function () {
                map.setCenter(latLng);
            });
        }

    });
