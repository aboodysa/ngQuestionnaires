angular.module('ngQuestionnaires.categories', []);
angular.module('ngQuestionnaires.questionnaires', []);
angular.module('ngQuestionnaires.questions', []);
angular.module('ngQuestionnaires.responses', []);
angular.module('ngQuestionnaires.directives', []);
angular.module('ngQuestionnaires.filters', []);
angular.module('ngQuestionnaires.services', ['firebase']);

angular.module('ngQuestionnaires', [
    'ng',
    'ngSanitize',
    'ngAnimate',
    'ngCookies',
    'ngRoute',
    'templates-app',
    'templates-common',
    'ui.bootstrap',
    'ui.highlight',
    'ngQuestionnaires.categories',
    'ngQuestionnaires.questionnaires',
    'ngQuestionnaires.questions',
    'ngQuestionnaires.responses',
    'ngQuestionnaires.directives',
    'ngQuestionnaires.filters',
    'ngQuestionnaires.services'
  ])

  .constant('fbUrl', 'https://ngdev.firebaseio.com/')
//  .constant('fbUrl', 'https://ngquestionnaires.firebaseio.com/')

  .constant('pagination', {itemsPerPage: 5, maxSize: 5})

  .factory('Firebase', [
    '$window',
    function ($window) {

      return $window.Firebase;

    }
  ])

  .factory('underscore', [
    '$window',
    function ($window) {

      return $window._;

    }
  ])

  .factory('d3', [
    '$window',
    function ($window) {

      return $window.d3;

    }
  ])

  .config(function ($routeProvider) {

    $routeProvider.otherwise({redirectTo: '/questionnaires/list'});

  })

  .run([
    '$rootScope',
    '$cacheFactory',
    'fbUrl',
    'Firebase',
    'angularFireAuth',
    'questionnaires',
    'questions',
    'responses',
    'categories',
    function ($rootScope, $cacheFactory, fbUrl, Firebase, angularFireAuth, questionnaires, questions, responses, categories) {

      angularFireAuth.initialize(
        new Firebase(fbUrl), {
          scope: $rootScope,
          name: 'user'
        }
      );

      $rootScope.questionnaires = questionnaires;

      $rootScope.questions = questions;

      $rootScope.responses = responses;

      $rootScope.categories = categories;

      $cacheFactory('data');

    }
  ])

  .controller('appCtrl', [
    '$scope',
    '$cookieStore',
    '$location',
    '$timeout',
    'angularFireAuth',
    function ($scope, $cookieStore, $location, $timeout, angularFireAuth) {

      $scope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
//        console.log(event, newUrl, oldUrl);
        if (!$scope.user && (
          newUrl.indexOf('#/questionnaires/new') > -1 ||
            newUrl.indexOf('#/questionnaires/edit') > -1 ||
            newUrl.indexOf('#/questionnaires/delete') > -1 ||
            newUrl.indexOf('#/questions/new') > -1 ||
            newUrl.indexOf('#/questions/edit') > -1 ||
            newUrl.indexOf('#/questions/delete') > -1 ||
            newUrl.indexOf('#/responses/new') > -1 ||
            newUrl.indexOf('#/responses/delete') > -1
          )) {
          $scope.setAlert('danger', 'Permission denied');
        }
      });

      $scope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl) {
//        console.log(event, newUrl, oldUrl);
      });

      $scope.$on('$routeChangeStart', function (event, next, current) {
//        console.log(event, next, current);
      });

      $scope.$on('$routeChangeSuccess', function (event, current, previous) {
//        console.log(event, current, previous);
      });

      $scope.$on('$routeChangeError', function (event, current, previous, rejection) {
//        console.log(event, current, previous, rejection);
      });

      $scope.title = "ngQuestionnaires";
      $scope.setTitle = function (title) {
        $scope.title = title;
      };

      $scope.isLoading = false;
      $scope.loading = function (show) {
        $scope.isLoading = show;
      };

      $scope.$on('angularFireAuth:login', function (event, user) {
        $scope.setAlert('success', 'You are logged in to ' + user.provider + ' as ' + user.displayName);
      });

      $scope.$on('angularFireAuth:logout', function (event) {
//        $scope.setAlert('warning', 'You are not logged in');
      });

      $scope.$on('angularFireAuth:error', function (event, error) {
        $scope.setAlert('warning', error.message);
      });

      $scope.login = function (provider) {
        angularFireAuth.login(provider);
      };

      $scope.logout = function () {
        angularFireAuth.logout();
      };

      $scope.alert = null;

      $scope.setAlert = function (type, msg) {
        $scope.alert = {
          type: type,
          msg: msg
        };
        $timeout(function () {
          $scope.alert = null;
        }, 5000);
      };

      $scope.formatDate = function (ms) {
        var d = new Date(ms);
        return 'on ' + d.toLocaleDateString() + ' at ' + d.toLocaleTimeString();
      };

    }
  ]);
