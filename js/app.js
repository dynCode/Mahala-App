(function(){
    'use strict';
    var module = angular.module('app', ['onsen']);
    module.controller('AppController', function($scope, $http, $window) {
        $scope.data = [];
        //points partners name dropdown
        $scope.pointsDD = [];
        $scope.pointsCatDD = [];
        $scope.pointsProvDD = [];
        $scope.pointsCityDD = [];
        $scope.searchOk = false;
        $scope.searchProvOk = false;
        $scope.partnerList = [];
        
        //discount partners name dropdown
        $scope.discountDD = [];
        $scope.discountCatDD = [];
        $scope.discountProvDD = [];
        $scope.discountCityDD = [];
        $scope.searchDiscountOk = false;
        $scope.searchDiscountProvOk = false;
        $scope.discountPartnerList = [];
        
        // login data
        $scope.CurrentBalance = '';
        $scope.UsedUnits = '';
        $scope.CurrTierDescription = '';
        $scope.Community = '';
        $scope.CardNumber = '';
        $scope.RandValue = '';
        $scope.MPacc = '';
        $scope.loggedIn = false;
        
        //Partner Data
        $scope.partner_logo = '';
        $scope.voucher_description = '';
        $scope.partner_tel = '';
        $scope.partner_address = '';
        $scope.voucher_date = '';
        
        // login checker
        $scope.LogIn = function() {
            var user = $scope.data.loyaltyNum;
            var pass = $scope.data.password;
            
            if (user && pass) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post('http://www.mahala.mobi/newMobi/api/app-results.php', {"reqType" : "login", "user" : user, "pass" : pass})
                .success(function(data, status){
                    
                    if (data['error'] == 0) {
                        modal.hide();
                        $scope.data.result = data['html'];
                        $scope.CurrentBalance = data['CurrentBalance'];
                        $scope.UsedUnits = data['UsedUnits'];
                        $scope.CurrTierDescription = data['CurrTierDescription'];
                        $scope.Community = data['Community'];
                        $scope.CardNumber = data['CardNumber'];
                        $scope.RandValue = parseInt(data['UsedUnits'])/10;
                        $scope.MPacc = user;
                        $scope.loggedIn = true;
                        myNavigator.pushPage('views/user/welcome.html', { animation : 'fade' });
                    } else {
                        modal.hide();
                        $scope.data.result = data['html'];
                        $scope.data.errorCode = data['html'];
                        modal.show();
                    }
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'Invalid Loyalty Number or Password.';
                modal.show();
            }
        };
        // airtime redemption
        $scope.redeemAir = function () {
            var mobile = $scope.data.CellNum;
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post('http://www.mahala.mobi/newMobi/api/app-results.php', {"reqType" : "redeemAir", "mobile" : mobile, "cardNum" : $scope.MPacc})
                .success(function(data, status){
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    modal.show();
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'No cell number entered.';
                modal.show();
            } 
        };
        // electricity redemption
        $scope.redeemElc = function () {
            var mobile = $scope.data.CellNum;
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post('http://www.mahala.mobi/newMobi/api/app-results.php', {"reqType" : "redeemElc", "mobile" : mobile, "cardNum" : $scope.MPacc})
                .success(function(data, status){
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    modal.show();
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'No cell number entered.';
                modal.show();
            } 
        };
        // groceries redemption
        $scope.redeemFood = function () {
            var mobile = $scope.data.CellNum;
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post('http://www.mahala.mobi/newMobi/api/app-results.php', {"reqType" : "redeemFood", "mobile" : mobile, "cardNum" : $scope.MPacc})
                .success(function(data, status){
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    modal.show();
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'No cell number entered.';
                modal.show();
            } 
        };
        // nu metro redemption
        $scope.redeemMovie = function () {
            var mobile = $scope.data.CellNum;
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post('http://www.mahala.mobi/newMobi/api/app-results.php', {"reqType" : "redeemMovie", "mobile" : mobile, "cardNum" : $scope.MPacc})
                .success(function(data, status){
                    modal.hide();
                    $scope.data.result = data['html'];
                    $scope.data.errorCode = data['html'];
                    modal.show();
                })
                .error(function(data, status) {
                    modal.hide();
                    $scope.data.errorCode = 'Request failed';
                    modal.show();
                });
            } else {
                $scope.data.errorCode = 'No cell number entered.';
                modal.show();
            } 
        };
        
        // buile points name dropdown
        $http.get('http://www.mahala.mobi/newMobi/api/pointsDD.php')
        .success(function (result, status) {
            $scope.pointsDD = result;
        })
        .error(function(result, status) {
            $scope.data.errorCode = 'Request failed';
            modal.show();
        });
        
        // get points name and display list
        $scope.searchPointName = function() {
            $scope.searchOk = false;
            $scope.partnerList = [];
            var partnerName = this.selectPointsName.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/newMobi/api/app-results.php', {"reqType" : "PointPartnerName", "partnerName" : partnerName})
            .success(function(data, status){
                modal.hide();
                //console.log(data);
                $scope.searchOk = true;
                $scope.partnerList = data;
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };
        
        // buile points category dropdown
        $http.get('http://www.mahala.mobi/newMobi/api/pointsCatDD.php')
        .success(function (result, status) {
            $scope.pointsCatDD = result;
        })
        .error(function(result, status) {
            $scope.data.errorCode = 'Request failed';
            modal.show();
        });
        
        // get points category and display list
        $scope.searchPointCat = function() {
            $scope.searchOk = false;
            $scope.partnerList = [];
            var partnerCat = this.selectPointsCat.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/newMobi/api/app-results.php', {"reqType" : "PointPartnerCat", "partnerCat" : partnerCat})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                $scope.searchOk = true;
                $scope.partnerList = data;
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };       
        
        // buile points province dropdown
        $http.get('http://www.mahala.mobi/newMobi/api/pointsProvDD.php')
        .success(function (result, status) {
            $scope.pointsProvDD = result;
        })
        .error(function(result, status) {
            $scope.data.errorCode = 'Request failed';
            modal.show();
        });
        
        // get points category and display list
        $scope.searchPointProv = function() {
            $scope.searchOk = false;
            $scope.partnerList = [];
            var partnerProv = this.selectPointsProv.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/newMobi/api/pointsCityDD.php', {"partnerProv" : partnerProv})
            .success(function(data, status){
                modal.hide();
                //console.log(data);
                $scope.searchProvOk = true;
                $scope.pointsCityDD = data;
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        }; 
        
        // get points city and display list
        $scope.searchPointCity = function() {
            $scope.searchOk = false;
            $scope.partnerList = [];
            var partnerCity = this.selectPointsCity.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/newMobi/api/app-results.php', {"reqType" : "PointPartnerCity", "partnerCity" : partnerCity})
            .success(function(data, status){
                modal.hide();
                //console.log(data);
                $scope.searchOk = true;
                $scope.partnerList = data;
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        }; 
        
        //build voucher
        $scope.pointsVoucher = function(partnerId) {
            console.log(partnerId);
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/newMobi/api/app-results.php', {"reqType" : "PartnerVoucher", "partnerId" : partnerId})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                
                var now = new Date();
                var day = ("0" + now.getDate()).slice(-2);
                var month = ("0" + (now.getMonth() + 1)).slice(-2);
                var today = now.getFullYear() + "-" + (month) + "-" + (day);
                
                $scope.partner_logo = data[0]['partner_logo'];
                $scope.voucher_description = data[0]['voucher_description'];
                $scope.partner_tel = data[0]['partner_tel'];
                $scope.partner_address = data[0]['partner_address'];
                $scope.voucher_date = today;
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
            
            
            myNavigator.pushPage('views/user/voucher.html', { animation : 'fade', partnerId : partnerId });
        }
        
        // buile discount name dropdown
        $http.get('http://www.mahala.mobi/newMobi/api/discountDD.php')
        .success(function (result, status) {
            $scope.discountDD = result;
        })
        .error(function(result, status) {
            $scope.data.errorCode = 'Request failed';
            modal.show();
        });
        
        // get discount name and display list
        $scope.searchDiscountName = function() {
            $scope.searchDiscountOk = false;
            $scope.discountPartnerList = [];
            var partnerName = this.selectDiscountName.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/newMobi/api/app-results.php', {"reqType" : "DiscountPartnerName", "partnerName" : partnerName})
            .success(function(data, status){
                modal.hide();
                //console.log(data);
                $scope.searchDiscountOk = true;
                $scope.discountPartnerList = data;
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };
        
        // build discount category dropdown
        $http.get('http://www.mahala.mobi/newMobi/api/discountCatDD.php')
        .success(function (result, status) {
            $scope.discountCatDD = result;
        })
        .error(function(result, status) {
            $scope.data.errorCode = 'Request failed';
            modal.show();
        });
        
        // get discount category and display list
        $scope.searchDiscountCat = function() {
            $scope.searchDiscountOk = false;
            $scope.discountPartnerList = [];
            var partnerCat = this.selectDiscountCat.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/newMobi/api/app-results.php', {"reqType" : "DiscountPartnerCat", "partnerCat" : partnerCat})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                $scope.searchDiscountOk = true;
                $scope.discountPartnerList = data;
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };       
        
        // buile discount province dropdown
        $http.get('http://www.mahala.mobi/newMobi/api/discountProvDD.php')
        .success(function (result, status) {
            $scope.discountProvDD = result;
        })
        .error(function(result, status) {
            $scope.data.errorCode = 'Request failed';
            modal.show();
        });
        
        // get discount category and display list
        $scope.searchDiscountProv = function() {
            $scope.searchDiscountOk = false;
            $scope.discountPartnerList = [];
            var partnerProv = this.selectDiscountProv.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/newMobi/api/discountCityDD.php', {"partnerProv" : partnerProv})
            .success(function(data, status){
                modal.hide();
                //console.log(data);
                $scope.searchDiscountProvOk = true;
                $scope.discountCityDD = data;
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        }; 
        
        // get discount city and display list
        $scope.searchDiscountCity = function() {
            $scope.searchDiscountOk = false;
            $scope.discountPartnerList = [];
            var partnerCity = this.selectDiscountCity.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/newMobi/api/app-results.php', {"reqType" : "DiscountPartnerCity", "partnerCity" : partnerCity})
            .success(function(data, status){
                modal.hide();
                //console.log(data);
                $scope.searchDiscountOk = true;
                $scope.discountPartnerList = data;
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        }; 
        
        //build voucher
        $scope.discountVoucher = function(partnerId) {
            console.log(partnerId);
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/newMobi/api/app-results.php', {"reqType" : "DiscountPartnerVoucher", "partnerId" : partnerId})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                
                var now = new Date();
                var day = ("0" + now.getDate()).slice(-2);
                var month = ("0" + (now.getMonth() + 1)).slice(-2);
                var today = now.getFullYear() + "-" + (month) + "-" + (day);
                
                $scope.partner_logo = data[0]['partner_logo'];
                $scope.voucher_description = data[0]['voucher_description'];
                $scope.partner_tel = data[0]['partner_tel'];
                $scope.partner_address = data[0]['partner_address'];
                $scope.voucher_date = today;
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
            
            
            myNavigator.pushPage('views/user/voucher.html', { animation : 'fade', partnerId : partnerId });
        }
        
        $scope.logout = function(){
            $scope.data = [];
            myNavigator.popPage();
            
            console.log('I got here');
        }
    });
})();

