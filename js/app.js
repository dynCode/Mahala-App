//-- AngularJS --//
(function(){
    'use strict';
    
    var module = angular.module('app', ['onsen', 'ngMap']);
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
        $scope.partner_voucher = '';
        $scope.partner_tel = '';
        $scope.partner_address = '';
        $scope.voucher_date = '';
        
        //Category Partner Lists
        $scope.catList = [];
        $scope.catPartnerList = [];
        
        //Coupons List
        $scope.couponList = [];
        
        //Coupon Code
        $scope.couponCode = '';
        
        //Coupon Data
        $scope.couponimageUrl = "";
        $scope.couponname = "";
        $scope.coupondescription = "";
        $scope.coupondiscount = "";
        $scope.coupontc = "";
        
        // Airtime Options
        $scope.selectedAir = [];
    	$scope.selectedAirData = [
            { 
                'id' : '0', 
                'network' : 'Vodacom',
                'airOptions' : [
                    {"cents" : '500', "rand" : 'R 5'},
                    {"cents" : '1000', "rand" : 'R 10'},
                    {"cents" : '1200', "rand" : 'R 12'},
                    {"cents" : '2900', "rand" : 'R 29'},
                    {"cents" : '5500', "rand" : 'R 55'},
                    {"cents" : '11000', "rand" : 'R 110'}
                ]
            },{ 
                'id': '1',
                'network' : 'MTN',
                'airOptions' : [
                    {"cents" : '500', "rand" : 'R 5'},
                    {"cents" : '1000', "rand" : 'R 10'},
                    {"cents" : '1500', "rand" : 'R 15'},
                    {"cents" : '3000', "rand" : 'R 30'},
                    {"cents" : '6000', "rand" : 'R 60'},
                    {"cents" : '18000', "rand" : 'R 180'}
                ]
            },{ 
                'id': '2',
                'network' : 'CellC',
                "airOptions": [
                    {"cents" : '500', "rand" : 'R 5'},
                    {"cents" : '1000', "rand" : 'R 10'},
                    {"cents" : '2500', "rand" : 'R 25'},
                    {"cents" : '3500', "rand" : 'R 35'},
                    {"cents" : '5000', "rand" : 'R 50'},
                    {"cents" : '7000', "rand" : 'R 70'},
                    {"cents" : '10000', "rand" : 'R 100'},
                    {"cents" : '15000', "rand" : 'R 150'}
                ] 
            },{ 
                'id': '3',
                'network' : 'Telkom',
                "airOptions": [
                    {"cents" : '500', "rand" : 'R 5'},
                    {"cents" : '1000', "rand" : 'R 10'},
                    {"cents" : '2000', "rand" : 'R 20'},
                    {"cents" : '3000', "rand" : 'R 30'}
                ] 
            }
	];
        
        /*
        //partner map matkers
        $scope.partnerMarkers = [];
        
        // set map instance
        $scope.map;
        $scope.$on('mapInitialized', function(evt, evtMap) {
            map = evtMap;
            $scope.map = map;
        });
        */
        
        // login checker
        $scope.LogIn = function() {
            var user = $scope.data.loyaltyNum;
            var pass = $scope.data.password;
            
            if (user && pass) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "login", "user" : user, "pass" : pass})
                .success(function(data, status){
                    if (data['error'] == 0) {
                        
                        var randVal = parseFloat(data['CurrentBalance'])/10;
                        
                        modal.hide();
                        $scope.data.result = data['html'];
                        $scope.CurrentBalance = data['CurrentBalance'];
                        $scope.UsedUnits = data['UsedUnits'];
                        $scope.CurrTierDescription = data['CurrTierDescription'];
                        $scope.Community = data['Community'];
                        $scope.CardNumber = data['CardNumber'];
                        $scope.RandValue = randVal.toFixed(2);
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
            var airAmt = $scope.selectedAir.airOption;
            var spNetwork = $scope.selectedAir.network.network;
                        
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post('http://www.mahala.mobi/mobiTest/api/redeemAir.php', {"reqType" : "redeemAir", "mobile" : mobile, "airAmt" : airAmt, "spNetwork": spNetwork, "cardNum" : $scope.MPacc})
                .success(function(data, status){
                    if (data['error'] == 0) {
                        modal.hide();
                        $scope.data.result = data['html'];
                        $scope.data.errorCode = data['html'];
                        modal.show();
                        myNavigator.pushPage('views/user/welcome.html', { animation : 'fade'});
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
                $scope.data.errorCode = 'No cell number entered.';
                modal.show();
            }
        };
        // electricity redemption
        $scope.redeemElc = function () {
            var mobile = $scope.data.CellNum;
            var vAmount = $scope.data.voucher;
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "redeemElc", "mobile" : mobile, "voucher" : vAmount, "cardNum" : $scope.MPacc})
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
            var vAmount = $scope.data.voucher;
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "redeemFood", "mobile" : mobile, "voucher" : vAmount, "cardNum" : $scope.MPacc})
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
            var vAmount = $scope.data.voucher;
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "redeemMovie", "mobile" : mobile, "voucher" : vAmount, "cardNum" : $scope.MPacc})
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
        
        // build points name dropdown
        $scope.pointsName = function() {
            $scope.pointsDD = [];
            $scope.partnerList = [];
            $http.get('http://www.mahala.mobi/mobiTest/api/pointsDD.php')
            .success(function (result, status) {
                $scope.pointsDD = result;
                myNavigator.pushPage('views/user/points_name.html', { animation : 'lift' });
            })
            .error(function(result, status) {
                $scope.data.errorCode = 'Failed to get parter names, please try again.';
                modal.show();
            });
        };
        
        // get points name and display list
        $scope.searchPointName = function() {
            $scope.searchOk = false;
            $scope.partnerList = [];
            var partnerName = this.selectPointsName.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "PointPartnerName", "partnerName" : partnerName})
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
        
        // build points category dropdown
        $scope.pointsCategory = function() {
            $scope.pointsCatDD = [];
            $scope.partnerList = [];
            $http.get('http://www.mahala.mobi/mobiTest/api/pointsCatDD.php')
            .success(function (result, status) {
                $scope.pointsCatDD = result;
                myNavigator.pushPage('views/user/points_cat.html', { animation : 'lift' } );
            })
            .error(function(result, status) {
                $scope.data.errorCode = 'Failed to get categories, please try again.';
                modal.show();
            });
        };
        
        // get points category and display list
        $scope.searchPointCat = function() {
            $scope.searchOk = false;
            $scope.partnerList = [];
            var partnerCat = this.selectPointsCat.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "PointPartnerCat", "partnerCat" : partnerCat})
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
        
        // build points province dropdown
        $scope.pointsProvince = function() {
            $scope.pointsProvDD = [];
            $scope.partnerList = [];
            $http.get('http://www.mahala.mobi/mobiTest/api/pointsProvDD.php')
            .success(function (result, status) {
                $scope.pointsProvDD = result;
                myNavigator.pushPage('views/user/points_reg.html', { animation : 'lift' } );
            })
            .error(function(result, status) {
                $scope.data.errorCode = 'Failed to get regions, please try again.';
                modal.show();
            });
        };
        
        // get points category and display list
        $scope.searchPointProv = function() {
            $scope.searchOk = false;
            $scope.partnerList = [];
            var partnerProv = this.selectPointsProv.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/mobiTest/api/pointsCityDD.php', {"partnerProv" : partnerProv})
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
            $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "PointPartnerCity", "partnerCity" : partnerCity})
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
            $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "PartnerVoucher", "partnerId" : partnerId, "cardNum" : $scope.MPacc})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                
                var now = new Date();
                var day = ("0" + now.getDate()).slice(-2);
                var month = ("0" + (now.getMonth() + 1)).slice(-2);
                var today = now.getFullYear() + "-" + (month) + "-" + (day);
                
                $scope.partner_logo = data[0]['partner_logo'];
                $scope.partner_voucher = data[0]['partner_voucher'];
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
        };
        
        // buile discount name dropdown
        $scope.discountName = function () {
            $scope.discountDD = [];
            $scope.discountPartnerList = [];
            $http.get('http://www.mahala.mobi/mobiTest/api/discountDD.php')
            .success(function (result, status) {
                $scope.discountDD = result;
                myNavigator.pushPage('views/user/dis_name.html', { animation : 'lift' } );
            })
            .error(function(result, status) {
                console.log(result);
                console.log(status);
                $scope.data.errorCode = 'Failed to get partner names. Please try again.';
                modal.show();
            });
        };
        
        // get discount name and display list
        $scope.searchDiscountName = function() {
            $scope.searchDiscountOk = false;
            $scope.discountPartnerList = [];
            var partnerName = this.selectDiscountName.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "DiscountPartnerName", "partnerName" : partnerName})
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
        $scope.discountCategory = function() {
            $scope.discountCatDD = [];
            $scope.discountPartnerList = [];
            $http.get('http://www.mahala.mobi/mobiTest/api/discountCatDD.php')
            .success(function (result, status) {
                $scope.discountCatDD = result;
                myNavigator.pushPage('views/user/dis_cat.html', { animation : 'lift' } );
            })
            .error(function(result, status) {
                $scope.data.errorCode = 'Failed to get discount cat drop down';
                modal.show();
            });
        };
        
        // get discount category and display list
        $scope.searchDiscountCat = function() {
            $scope.searchDiscountOk = false;
            $scope.discountPartnerList = [];
            var partnerCat = this.selectDiscountCat.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "DiscountPartnerCat", "partnerCat" : partnerCat})
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
        
        // build discount province dropdown
        $scope.discountProvine = function() {
            $scope.discountProvDD = [];
            $scope.discountPartnerList = [];
            $http.get('http://www.mahala.mobi/mobiTest/api/discountProvDD.php')
            .success(function (result, status) {
                $scope.discountProvDD = result;
                myNavigator.pushPage('views/user/dis_reg.html', { animation : 'lift' } );
            })
            .error(function(result, status) {
                $scope.data.errorCode = 'Failed to get discount province drop down';
                modal.show();
            });
        };
        
        // get discount category and display list
        $scope.searchDiscountProv = function() {
            $scope.searchDiscountOk = false;
            $scope.discountPartnerList = [];
            var partnerProv = this.selectDiscountProv.Name;
            
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/mobiTest/api/discountCityDD.php', {"partnerProv" : partnerProv})
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
            $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "DiscountPartnerCity", "partnerCity" : partnerCity})
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
            $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "DiscountPartnerVoucher", "partnerId" : partnerId, "cardNum" : $scope.MPacc})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                
                var now = new Date();
                var day = ("0" + now.getDate()).slice(-2);
                var month = ("0" + (now.getMonth() + 1)).slice(-2);
                var today = now.getFullYear() + "-" + (month) + "-" + (day);
                
                $scope.partner_logo = data[0]['partner_logo'];
                $scope.partner_voucher = data[0]['partner_voucher'];
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
        };
        
        // log out function
        $scope.logout = function(){
            $scope.data = [];
            $scope.loggedIn = false;
            myNavigator.pushPage('views/home.html', { animation : 'fade' });
        };
        
        //contact us form function
        $scope.contactMe = function() {
            var contactAccount = $scope.data.contactAccount;
            var contactStudent = $scope.data.contactStudent;
            var contactPerks = $scope.data.contactPerks;
            var contactComments = $scope.data.contactComments;
            var contactName = $scope.data.contactName;
            var contactSurname = $scope.data.contactSurname;
            var contactCell = $scope.data.contactCell;
            var contactEmail = $scope.data.contactEmail;
            
            if (contactName && contactSurname && contactCell && contactEmail) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', { "reqType" : "contactUs", "accountType" : contactAccount, "student" : contactStudent, "perks" : contactPerks, "comments" : contactComments, "cName" : contactName, "cSurname" : contactSurname, "cCell" : contactCell, "cEmail" : contactEmail })
                .success(function(data, status){
                    if (data['error'] == 0) {
                        modal.hide();
                        $scope.data.result = data['html'];
                        $scope.data.errorCode = data['html'];
                        modal.show();
                        myNavigator.pushPage('views/home.html', { animation : 'fade'});
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
                $scope.data.errorCode = 'Please fill in all the fields.';
                modal.show();
            }
        };
        
        $scope.getDiscountCatList = function() {
            $scope.catList = [];
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "listDiscountCat", "partnerCat" : "catList"})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                $scope.catList = data;
                if (data) {
                    myNavigator.pushPage('views/partners/discount.html', { animation : 'fade'});
                } else {
                    $scope.data.errorCode = 'No Partners were found!';
                    modal.show();
                }         
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };
        
        $scope.getDiscountList = function(catName) {
            var partnerCat = catName;
            $scope.catPartnerList = [];
            console.log(catName);
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "listDiscountCat", "partnerCat" : partnerCat})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                $scope.catPartnerList = data;
                
                if (data) {
                    if (partnerCat === 'catList') {
                        myNavigator.pushPage('views/partners/discount.html', { animation : 'fade'});
                    } else {
                        myNavigator.pushPage('views/partners/list.html', { animation : 'fade'});
                    }
                } else {
                    $scope.data.errorCode = 'No Partners were found!';
                    modal.show();
                }         
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };
        
        $scope.getPointCatList = function() {
            $scope.catList = [];
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "listPointCat", "partnerCat" : "catList"})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                $scope.catList = data;
                
                if (data) {
                    myNavigator.pushPage('views/partners/points.html', { animation : 'fade'});
                } else {
                    $scope.data.errorCode = 'No Partners were found!';
                    modal.show();
                } 
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };
        
        $scope.getPointList = function(catName) {
            var partnerCat = catName;
            $scope.catPartnerList = [];
            console.log(catName);
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "listPointCat", "partnerCat" : partnerCat})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                $scope.catPartnerList = data;
                
                if (data) {
                    if (partnerCat === 'catList') {
                        myNavigator.pushPage('views/partners/points.html', { animation : 'fade'});
                    } else {
                        myNavigator.pushPage('views/partners/list.html', { animation : 'fade'});
                    }
                } else {
                    $scope.data.errorCode = 'No Partners were found!';
                    modal.show();
                } 
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };
        
        //Coupons List Builder
        $http.get('http://www.mahala.mobi/mobiTest/api/coupon-list.php')
        .success(function (result, status) {
            $scope.couponList = result;
        })
        .error(function(result, status) {
            $scope.data.errorCode = 'Request failed';
            modal.show();
        });
        
        //Get coupon code
        $scope.getCouponCode = function() {
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/mobiTest/api/coupon-code.php', {"userRef" : $scope.MPacc})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                $scope.couponCode = data['html'];
                myNavigator.pushPage('views/user/coupon_code.html', { animation : 'fade'});
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
        };
        
        //setup map search for points partenrs close by
        $scope.pointsCloseBy = function() {
            myNavigator.pushPage('views/user/points_close_by.html', {animation : 'lift'} );
        };
        
        //setup map search for discount partenrs close by
        $scope.discountCloseBy = function() {
            myNavigator.pushPage('views/user/discount_close_by.html', {animation : 'lift'} );
        };
        
        //build map voucher
        $scope.MapPartnerVoucher = function(partnerId,partnerType) {
            console.log(partnerId);
            console.log(partnerType);
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "MapPartnerVoucher", "partnerId" : partnerId, "cardNum" : $scope.MPacc, "partnerType": partnerType})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                
                var now = new Date();
                var day = ("0" + now.getDate()).slice(-2);
                var month = ("0" + (now.getMonth() + 1)).slice(-2);
                var today = now.getFullYear() + "-" + (month) + "-" + (day);
                
                $scope.partner_logo = data[0]['partner_logo'];
                $scope.partner_voucher = data[0]['partner_voucher'];
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
        };
        
        $scope.showCoupon = function(couponId) {
            console.log(couponId);
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post('http://www.mahala.mobi/mobiTest/api/show_coupon.php', {"couponId" : couponId})
            .success(function(data, status){
                modal.hide();
                console.log(data);
                
                $scope.couponimageUrl = data[0]['imageUrl'];
                $scope.couponname = data[0]['name'];
                $scope.coupondescription = data[0]['description'];
                $scope.coupondiscount = data[0]['discount'];
                $scope.coupontc = data[0]['tandc'];
            })
            .error(function(data, status) {
                modal.hide();
                $scope.data.errorCode = 'Request failed';
                modal.show();
            });
            
            
            myNavigator.pushPage('views/user/coupon_view.html', { animation : 'fade' });
            
        };
    });
    
    // Map Controler
    
    module.controller('mapController', function($scope, $http, StreetView) {
        $scope.map;
        $scope.stores = [];
        $scope.partnerType;
        $scope.mapRadius;
        $scope.partnerList = [];
        
        $scope.init = function(type,radius) {
            $scope.partnerType = type;
            $scope.mapRadius = radius;
        };
        
        var map;
        $scope.$on('mapInitialized', function(event, evtMap) {
            map = evtMap;
            $scope.map = map;
            $scope.myLat = $scope.map.center.A;
            $scope.myLng = $scope.map.center.F;
            
            $http.post('http://www.mahala.mobi/mobiTest/api/mapMarkers.php', {"lat" : $scope.myLat, "lng" : $scope.myLng, "radius" : $scope.mapRadius, "type" : $scope.partnerType, cat : "%"}).success( function(stores) {
                var markers = [];
                console.log(stores);
                $scope.partnerList = stores;
                for (var i=0; i<stores.length; i++) {
                    var store = stores[i];
                    store.position = new google.maps.LatLng(store.partner_lat,store.partner_lng);
                    store.title = store.partner_name;
                    store.animation = google.maps.Animation.DROP;
                    markers[i] = new google.maps.Marker(store);
                    google.maps.event.addListener(markers[i], 'click', function() {
                        $scope.store = this;
                        //map.setZoom(18);
                        map.setCenter(this.getPosition());
                        $scope.storeInfo.show();
                    });
                    google.maps.event.addListener(map, 'click', function() {
                        $scope.storeInfo.hide();
                    });
                    $scope.stores.push(markers[i]); 
                    markers[i].setPosition(store.position);
                    markers[i].setMap($scope.map);
                }
            });
        });
        $scope.showStreetView = function() {
            StreetView.setPanorama(map, $scope.panoId);
            $scope.storeInfo.hide();
        };
        $scope.showHybridView = function() {
            map.setMapTypeId(google.maps.MapTypeId.HYBRID);
            map.setTilt(45);
            $scope.storeInfo.hide();
        }
    });
    module.directive('storeInfo', function() {
        var StoreInfo = function(s, e, a) {
            this.scope = s;
            this.element = e;
            this.attrs = a;
            this.show = function() {
                this.element.css('display', 'block');
                this.scope.$apply();
            }
            this.hide = function() {
                this.element.css('display', 'none');
            }
        };
        return {
            templateUrl: 'store-info.html',
            link: function(scope, e, a) {
                scope.storeInfo= new StoreInfo(scope, e, a);
            }
        }
    });
})();

// normal JS
// direction = boolean value: true or false. If true, go to NEXT slide; otherwise go to PREV slide
function toggleSlide(direction, className) {
    var elements = document.getElementsByClassName(className); // gets all the "slides" in our slideshow
    // Find the LI that's currently displayed
    var visibleID = getVisible(elements);
    elements[visibleID].style.display = "none"; // hide the currently visible LI
    if(!direction) {
        var makeVisible = prev(visibleID, elements.length); // get the previous slide
    } else {
        var makeVisible = next(visibleID, elements.length); // get the next slide
    }
    elements[makeVisible].style.display = "block"; // show the previous or next slide
}
function getVisible(elements) {
    var visibleID = -1;
    for(var i = 0; i < elements.length; i++) {
        if(elements[i].style.display == "block") {
            visibleID = i;
        }
    }
    return visibleID;
}
function prev(num, arrayLength) {
    if(num == 0) return arrayLength-1;
    else return num-1;
}
function next(num, arrayLength) {
    if(num == arrayLength-1) return 0;
    else return num+1;
}

var interval = 5000; // You can change this value to your desired speed. The value is in milliseconds, so if you want to advance a slide every 5 seconds, set this to 5000.
var switching = setInterval("toggleSlide(true,'hideable')", interval);
var switching = setInterval("toggleSlide(true,'hideableL')", interval);
var switching = setInterval("toggleSlide(true,'hideableW')", interval);