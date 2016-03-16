var app=angular.module('app');

app.controller('registercontroller',function($scope,authService,$http,$window,$localStorage){
console.log('registercontroller');
$scope.uploadImg="assets/images/profile.jpg";
$scope.nameDisplay=$localStorage.fullname;
$scope.regclose=function(){
  $window.localStorage.clear();
  $window.location.href="https://frugal-lms2.herokuapp.com/#/";
  
}

$scope.imageUpload = function(element){
        var reader = new FileReader();
        reader.onload = $scope.imageIsLoaded;
        reader.readAsDataURL(element.files[0]);
        
    }

    $scope.imageIsLoaded = function(e){
        $scope.$apply(function() {
            $scope.uploadImg=e.target.result;
            // console.log("Come with Encoded Format::"+$scope.uploadImg);

         
        });
    }
    $scope.mySplit = function(string, nb) {
    var array = string.split(','); 
    return array[nb];
  }


//Check Email Already Exist-Register
 $scope.checkExistUser=function(){
    console.log("Mail::"+$scope.regs.email);
 if (!angular.isDefined($scope.regs.email)) {
  $scope.getCheckUser.msg="";
 }else{
  console.log("No Mail::"+JSON.stringify($scope.regs));
    authService.checkExistUser($scope.regs).then(function(response) {
    $scope.getCheckUser = response.data; 
  })
 }
 }
  $scope.registerform = function() 
  {
    console.log("Register::"+JSON.stringify($scope.regs));
    $scope.regs.companyID="101";
    $scope.regs.password=$scope.randomPass(8);
    $scope.regs.verified="0";
    $scope.regs.ResetPassStr="";
    $scope.regs.Role="Learner";
    $scope.regs.loginverified="0";
    var imgStr=$scope.uploadImg;
    if (imgStr=='assets/images/profile.jpg') {
      $scope.regs.UploadImg="";
    }else{
      $scope.regs.UploadImg=imgStr;
    }
    
    console.log("Get Img"+JSON.stringify($scope.regs.UploadImg));
    
    authService.registerform($scope.regs).then(function(response) {
    console.log("gggg"+response.data);
    var regResponse=response.data;
    console.log("ID::"+regResponse._id);
            var activationlink="http://frugal-lms2.herokuapp.com/confirm/"+regResponse._id;
              $http({
              method: 'GET',
              url: '/mail',
              params: {activationlink:activationlink,emailID:regResponse.email}
              }).then(function successCallback(res) {
                console.log("Confirmed successfully");
                $localStorage.fullname=$scope.regs.firstname+' '+$scope.regs.middlename+' '+$scope.regs.lastname;  
                $window.location.href="https://frugal-lms2.herokuapp.com/#/signupsuccess";
                }, function errorCallback(res) {
                });
    })
    }


$scope.randomPass=function(length){
                var chars = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOP1234567890";
                var pass = "";
                for (var x = 0; x < length; x++) {
                    var i = Math.floor(Math.random() * chars.length);
                    pass += chars.charAt(i);
                }
                return pass;
              }

});

app.controller('logincontroller',function($scope,authService,$http,$window,$localStorage,$location, $rootScope){
console.log('logincontroller');

$scope.profileImg="assets/images/profile.jpg";

$scope.loginInit=function(){
  console.log("init login");
  if ($localStorage.remember==true) {
    $scope.login={"email":$localStorage.remEmail,"password":$localStorage.remPass,"remember":$localStorage.remember};

    console.log("init login"+$scope.login.remember);
};
}


$scope.checkLoginUser=function(){
console.log("Check Login User");
$scope.login.remember="false";
if (!angular.isDefined($scope.login.email)) {
  // $scope.getCheckUser.msg="";
 }else{
  console.log("Login::"+$scope.login.email);

  authService.checkLoginUser({'email':$scope.login.email}).then(function(response) {
    $scope.getLoginUser = response.data; 
    if ($scope.getLoginUser==undefined) {
      console.log("No Result");
      $scope.profileImg="assets/images/profile.jpg"
  }else
  {
     console.log("result"+JSON.stringify($scope.getLoginUser[0]));
     $rootScope.loggedUser = $scope.login.email;
    if ($scope.getLoginUser[0].UploadImg=="") {
      $scope.profileImg="assets/images/profile.jpg"
    }else{
      $scope.profileImg=$scope.getLoginUser[0].UploadImg;
    }
   
  }
    
    
  })
 }
}

$scope.checkcheck=function(){
  console.log($scope.login.remember);
}
$scope.loginform=function(){
  console.log("Enter"+JSON.stringify($scope.login));
  $localStorage.remember=$scope.login.remember;
console.log("$localStorage.remember"+$localStorage.remember);
  if ($localStorage.remember==true) {
    $localStorage.remEmail=$scope.login.email;
    $localStorage.remPass=$scope.login.password;
console.log("$localStorage.remEmail"+$localStorage.remEmail);
console.log("$localStorage.remPass"+$localStorage.remPass);
  }else{
    console.log("clear");
    $localStorage.remEmail="";
    $localStorage.remPass=""
  }

  authService.login({'email':$scope.login.email,"password":$scope.login.password}).then(function(response) {
    console.log("result"+response.data.Result);
     if (response.data.Result=='true'){
      if ($scope.getLoginUser==undefined) {
        $scope.checkLoginUser();
      };
                    console.log("Success"+$scope.getLoginUser[0]);
                    $localStorage.email =$scope.getLoginUser[0].email;
                    console.log("localStorage"+$localStorage.email);
                    // $window.localStorage.clear();
                    if ($scope.getLoginUser[0].loginverified==0) {
                 $window.location.href="https://frugal-lms2.herokuapp.com/#/loginsuccess";
                }else{
                  $window.location.href="https://frugal-lms2.herokuapp.com/#/dashboard";
                }
           
                }else   {
                $window.location.href="https://frugal-lms2.herokuapp.com/#/Fail";
              }

  })
}


$scope.existingpassword=function(){
  $scope.loginverified();
$window.location.href="https://frugal-lms2.herokuapp.com/#/dashboard";
}
$scope.newpassword=function(){
  $scope.loginverified();
$window.location.href="https://frugal-lms2.herokuapp.com/#/recoverpassword";
}
$scope.loginverified=function(){

   authService.loginverified($localStorage.email).then(function(response) {
    console.log("got loginverified::"+response);
   });
}
$scope.logout=function(){
  $window.localStorage.clear();
  $window.location.href="https://frugal-lms2.herokuapp.com";
}
})

app.controller('resetpasscontroller',function($scope,authService,$http,$window){
console.log('resetpasscontroller');
$scope.checkExistUser=function(){
if (!angular.isDefined($scope.forget.email)) {
  // $scope.getCheckUser.msg="";
 }else{
  console.log("No Mail::"+JSON.stringify($scope.forget));
    authService.checkExistUser($scope.forget).then(function(response) {
    // $scope.getCheckUser = response.data;
    console.log(response.data);
    $scope.resetCheck=response.data.CStatus;
    if ($scope.resetCheck==true) {
      $scope.validation="User Exist!";
      $scope.vcolor="green";
    }else{
      $scope.validation="User Not Exist!";
       $scope.vcolor="red";
    }
    
  })
 }
}

$scope.forgetPassword=function(){
   $scope.forget.ResetString=$scope.randomString(30);
  console.log($scope.forget);
  authService.forgetpassword($scope.forget).then(function(response) {
    console.log(JSON.stringify(response));
    if (response.status==200) {
      $window.location.href="http://frugal-lms2.herokuapp.com";
    };
  });
}
$scope.randomString=function(length){
                var chars = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOP1234567890";
                var pass = "";
                for (var x = 0; x < length; x++) {
                    var i = Math.floor(Math.random() * chars.length);
                    pass += chars.charAt(i);
                }
                return pass;
              }

})

app.controller('recoverpasscontroller',function($scope,authService,$http,$window){
console.log("recoverpasscontroller");
$scope.resetPassword=function(){
  authService.recoverpassword($scope.recover).then(function(response) {
    console.log(JSON.stringify(response));
    if (response.data.ok==1) {
      $window.location.href="http://frugal-lms2.herokuapp.com/#/recoverpassword.html";
    };
  });
}
})



//DECODE FROM SERVER


 // var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

          //   // Define the string
          //   var string = 'Arun';

          // // Encode the String
          // var encodedString = Base64.encode(string);
          // console.log(encodedString);
          //  var getString=$scope.mySplit($scope.uploadImg,1);
          // console.log("getString"+getString);
          // var decodedString = Base64.decode(getString);
          // console.log(decodedString); 
          // $scope.newImg=$scope.uploadImg;
          // console.log($scope.newImg);





          