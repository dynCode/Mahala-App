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
        
        //Category Partner Lists
        $scope.catPartnerList = [];
        
        //Coupons List
        $scope.couponList = [];
        
        //Coupon Code
        $scope.couponCode = '';
        
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
            if (mobile) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "redeemElc", "mobile" : mobile, "cardNum" : $scope.MPacc})
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
                $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "redeemFood", "mobile" : mobile, "cardNum" : $scope.MPacc})
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
                $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', {"reqType" : "redeemMovie", "mobile" : mobile, "cardNum" : $scope.MPacc})
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
        $http.get('http://www.mahala.mobi/mobiTest/api/pointsDD.php')
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
        
        // buile points category dropdown
        $http.get('http://www.mahala.mobi/mobiTest/api/pointsCatDD.php')
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
        
        // buile points province dropdown
        $http.get('http://www.mahala.mobi/mobiTest/api/pointsProvDD.php')
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
        };
        
        // buile discount name dropdown
        $http.get('http://www.mahala.mobi/mobiTest/api/discountDD.php')
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
        $http.get('http://www.mahala.mobi/mobiTest/api/discountCatDD.php')
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
        
        // buile discount province dropdown
        $http.get('http://www.mahala.mobi/mobiTest/api/discountProvDD.php')
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
        };
        
        // log out function
        $scope.logout = function(){
            $scope.data = [];
            $scope.loggedIn = false;
            myNavigator.pushPage('views/home.html', { animation : 'fade' });
            
            console.log('I got here');
        };
        
        //contact us form function
        $scope.contactMe = function() {
            var contactAccount = $scope.data.contactAccount;
            var contactPerks = $scope.data.contactPerks;
            var contactComments = $scope.data.contactComments;
            var contactName = $scope.data.contactName;
            var contactSurname = $scope.data.contactSurname;
            var contactCell = $scope.data.contactCell;
            var contactEmail = $scope.data.contactEmail;
            
            if (contactName && contactSurname && contactCell && contactEmail) {
                modal.show();
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post('http://www.mahala.mobi/mobiTest/api/app-results.php', { "reqType" : "contactUs", "accountType" : contactAccount, "perks" : contactPerks, "comments" : contactComments, "cName" : contactName, "cSurname" : contactSurname, "cCell" : contactCell, "cEmail" : contactEmail })
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
                    myNavigator.pushPage('views/partners/list.html', { animation : 'fade'});
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
                    myNavigator.pushPage('views/partners/list.html', { animation : 'fade'});
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
    });
})();

