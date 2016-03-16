var app=angular.module('app',['ngRoute',"ngStorage"]);
app.config(['$routeProvider',function($routeProvider){
$routeProvider.

when('/',
{
  templateUrl: 'angular/views/login.html', 
  controller: 'logincontroller'
}).
when('/register',
{
  templateUrl: 'angular/views/register.html', 
  controller: 'registercontroller'
}).

when('/resetpassword',
{
  templateUrl: 'angular/views/resetpassword.html', 
  controller: 'resetpasscontroller'
}).
when('/recoverpassword',
{
  templateUrl: 'angular/views/recoverpassword.html', 
  controller: 'recoverpasscontroller'
}).

when('/dashboard',
{
  templateUrl: 'angular/views/dashboard.html', 
  controller: 'logincontroller'
}).
when('/signupsuccess',
{
  templateUrl: 'angular/views/signup_success.html', 
  controller: 'registercontroller'
}).
when('/loginsuccess',
{
  templateUrl: 'angular/views/loginsuccess.html', 
  controller: 'logincontroller'
}).
when('/activations',
    {
      templateUrl: 'angular/views/activations.html',
      controller: 'registercontroller'
    }).
when('/activationp',
    {
      templateUrl: 'angular/views/activationp.html',
      controller: 'registercontroller'
    }).

otherwise({
        redirectTo: '/'
      });

}])
 .run( function($rootScope, $location,$localStorage) {

    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      if ( $localStorage.email == null ) {
        if ( next.templateUrl == "angular/views/register.html" ) {
          $location.path( "/register" );
        }else if(next.templateUrl == "angular/views/resetpassword.html"){
            $location.path( "/resetpassword" );
        }else if(next.templateUrl == "angular/views/recoverpassword.html"){
            $location.path( "/recoverpassword" );
        }else if(next.templateUrl == "angular/views/signup_success.html"){
          $location.path( "/signupsuccess" );
        }else if(next.templateUrl == "angular/views/loginsuccess.html"){
          $location.path( "/loginsuccess" );
        }
        else if(next.templateUrl == "angular/views/activations.html"){
          $location.path( "/activations" );
        }else if(next.templateUrl == "angular/views/activationp.html"){
          $location.path( "/activationp" );
        }
        else{
          $location.path( "/" );
        }
      } else{
        if ( next.templateUrl == "angular/views/login.html" ) {
          $location.path( "/dashboard" );
        }
      }        
    });
 })
app.controller('maincontroller',function($scope){
// console.log('login goes in maincontroller');
})
