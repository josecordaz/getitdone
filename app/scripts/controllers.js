'use strict';

angular.module('getItDoneApp')

.controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', function ($scope, menuFactory, favoriteFactory) {

    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showFavorites = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";

    menuFactory.query(
        function (response) {
            $scope.dishes = response;
            $scope.showMenu = true;

        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "appetizer";
        } else if (setTab === 3) {
            $scope.filtText = "mains";
        } else if (setTab === 4) {
            $scope.filtText = "dessert";
        } else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.toggleFavorites = function () {
        $scope.showFavorites = !$scope.showFavorites;
    };
    
    $scope.addToFavorites = function(dishid) {
        console.log('Add to favorites', dishid);
        favoriteFactory.save({_id: dishid});
        $scope.showFavorites = !$scope.showFavorites;
    };
}])

.controller('ContactController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {

    $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
    };

    var channels = [{
        value: "tel",
        label: "Tel."
    }, {
        value: "Email",
        label: "Email"
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

    $scope.sendFeedback = function () {
        if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
            $scope.invalidChannelSelection = true;
        } else {
            $scope.invalidChannelSelection = false;
            feedbackFactory.save($scope.feedback);
            $scope.feedback = {
                mychannel: "",
                firstName: "",
                lastName: "",
                agree: false,
                email: ""
            };
            $scope.feedback.mychannel = "";
            $scope.feedbackForm.$setPristine();
        }
    };
}])

.controller('DishDetailController', ['$scope', '$state', '$stateParams', 'menuFactory', 'commentFactory', function ($scope, $state, $stateParams, menuFactory, commentFactory) {

    $scope.dish = {};
    $scope.showDish = false;
    $scope.message = "Loading ...";

    $scope.dish = menuFactory.get({
            id: $stateParams.id
        })
        .$promise.then(
            function (response) {
                $scope.dish = response;
                $scope.showDish = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

    $scope.mycomment = {
        rating: 5,
        comment: ""
    };

    $scope.submitComment = function () {

        commentFactory.save({id: $stateParams.id}, $scope.mycomment);

        $state.go($state.current, {}, {reload: true});
        
        $scope.commentForm.$setPristine();

        $scope.mycomment = {
            rating: 5,
            comment: ""
        };
    };
}])

// implement the IndexController and About Controller here
.controller('GoalController',['$scope','ngDialog','goalsFactory','AuthFactory',function($scope,ngDialog,goalsFactory,AuthFactory){
    $scope.goalData = {
        description:"",
        dueDate:null
    };
    $scope.invalidDueDate = false;

    $scope.saveGoal = function(){
        var due = new Date($scope.goalData.dueDate);
        var hoy = new Date();
        if(hoy > due){
            $scope.invalidDueDate = true;
        } else {
            goalsFactory.save($scope.goalData).$promise.then(
                null,
                function (response) {
                    var descriptionErrores = '';
                    
                    if(!!response.data.error.errores){
                        var errores = Object.keys(response.data.error.errors);
                        errores.forEach(function(err){
                            descriptionErrores =  response.data.error.errors[err].message;
                        });
                    }

                    var message = ''+
                    '<div class="ngdialog-message">'+
                    '<div><h3>Error '+response.status+' </h3></div>' +
                      '<div><p>' +  response.data.message + '</p><p>' +descriptionErrores+
                      '</p></div>'+
                    '<div class="ngdialog-buttons">'+
                        '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>'+
                    '</div>';
                    if(response.data.error.status === 401){
                        AuthFactory.logout();
                    }
                    ngDialog.openConfirm({ template: message, plain: 'true'});
                }
            );
            ngDialog.close();
        }
    };
}])
.controller('TaskController',['$scope','taskFactory','AuthFactory','ngDialog',function($scope,taskFactory,AuthFactory,ngDialog){
    $scope.taskData = {
        description:"",
        startDate:null,
        daysWeek:null,
        pomodorosPerDay:0
    };

    $scope.saveTask = function(){
        taskFactory.save($scope.goalData).$promise.then(
            function () {},
            function (response) {
            var descriptionErrores = '';
                if(!!response.data.error.errores){
                    var errores = Object.keys(response.data.error.errors);
                    errores.forEach(function(err){
                        descriptionErrores =  response.data.error.errors[err].message;
                    });
                }
                var message = ''+
                '<div class="ngdialog-message">'+
                '<div><h3>Error '+response.status+' </h3></div>' +
                '<div><p>'+response.data.message+'</p><p>'+descriptionErrores+
                '</p></div>'+
                '<div class="ngdialog-buttons">'+
                '<button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>'+
                '</div>';
                if(response.data.error.status === 401){
                    AuthFactory.logout();
                }
                ngDialog.openConfirm({ template: message, plain: 'true'});
            }
        );

        /*var due = new Date($scope.goalData.dueDate);



        var hoy = new Date();
        if(hoy > due){
            $scope.invalidDueDate = true;
        } else {
            goalsFactory.save($scope.goalData).$promise.then(
                function (response) {},
                function (response) {
                    var descriptionErrores = '';
                    
                    if(!!response.data.error.errores){
                        var errores = Object.keys(response.data.error.errors);
                        errores.forEach(function(err){
                            descriptionErrores =  response.data.error.errors[err].message;
                        });
                    }

                    var message = '\
                    <div class="ngdialog-message">\
                    <div><h3>Error '+response.status+' </h3></div>' +
                      '<div><p>' +  response.data.message + '</p><p>' +descriptionErrores
                         + '</p></div>' +
                    '<div class="ngdialog-buttons">\
                        <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                    </div>';
                    if(response.data.error.status == 401){
                        AuthFactory.logout();
                    }
                    ngDialog.openConfirm({ template: message, plain: 'true'});
                }
            );
            ngDialog.close();
        }*/
    };
}])
.controller('HomeController', ['$scope','$rootScope','ngDialog','AuthFactory','goalsFactory',function ($scope,$rootScope,ngDialog,AuthFactory,goalsFactory) {
    $scope.openAddGoal = function () {
        ngDialog.open({ template: 'views/addGoal.html', scope: $scope, className: 'ngdialog-theme-default', controller:"GoalController" });
    };
    $scope.openAddTask = function (idGoal) {
        $rootScope.idGoal = idGoal;
        ngDialog.open({ template: 'views/addTask.html', scope: $scope, className: 'ngdialog-theme-default', controller:"TaskController" });
    };

    //$rootScope.username = "";
    $rootScope.username = AuthFactory.getUsername();

    if($rootScope.username !== ''){
        goalsFactory.query({})
        .$promise.then(
            function (response) {
                response = response.map(function(val){
                    val.dueDate = moment(val.dueDate).format("dddd, MMM DD, YYYY");
                    val.tasks = val.tasks.map(function(task){
                        task.startDate = moment(task.startDate).format("dddd, MMM DD, YYYY");
                        task.daysWeek = task.daysWeek.join(", ");
                        task.hoursWorded = Math.round(task.workedPomodoros.length * (25/60) * 100)/100;
                        return task;
                    });
                    return val;
                });
                $rootScope.goals = response;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
    }
    /*$scope.showDish = false;
    $scope.showLeader = false;
    $scope.showPromotion = false;
    $scope.message = "Loading ...";
    var leaders = corporateFactory.query({
            featured: "true"
        })
        .$promise.then(
            function (response) {
                var leaders = response;
                $scope.leader = leaders[0];
                $scope.showLeader = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
    $scope.dish = menuFactory.query({
            featured: "true"
        })
        .$promise.then(
            function (response) {
                var dishes = response;
                $scope.dish = dishes[0];
                $scope.showDish = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
    var promotions = promotionFactory.query({
        featured: "true"
    })
    .$promise.then(
            function (response) {
                var promotions = response;
                $scope.promotion = promotions[0];
                $scope.showPromotion = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );*/
}])

.controller('AboutController', ['$scope', 'corporateFactory', function ($scope, corporateFactory) {

    $scope.leaders = corporateFactory.query();

}])

.controller('FavoriteController', ['$scope', '$state', 'favoriteFactory', function ($scope, $state, favoriteFactory) {

    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showDelete = false;
    $scope.showMenu = false;
    $scope.message = "Loading ...";

    favoriteFactory.query(
        function (response) {
            $scope.dishes = response.dishes;
            $scope.showMenu = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "appetizer";
        } else if (setTab === 3) {
            $scope.filtText = "mains";
        } else if (setTab === 4) {
            $scope.filtText = "dessert";
        } else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.toggleDelete = function () {
        $scope.showDelete = !$scope.showDelete;
    };
    
    $scope.deleteFavorite = function(dishid) {
        console.log('Delete favorites', dishid);
        favoriteFactory.delete({id: dishid});
        $scope.showDelete = !$scope.showDelete;
        $state.go($state.current, {}, {reload: true});
    };
}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory','goalsFactory',function ($scope, $state, $rootScope, ngDialog, AuthFactory,goalsFactory) {

    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
        $rootScope.username = AuthFactory.getUsername();
        goalsFactory.query({}).$promise.then(
            function (response) {
                response = response.map(function(val){
                    val.dueDate = moment(val.dueDate).format("dddd, MMM DD, YYYY");
                    val.tasks = val.tasks.map(function(task){
                        task.startDate = moment(task.startDate).format("dddd, MMM DD, YYYY");
                        task.daysWeek = task.daysWeek.join(", ");
                        task.hoursWorded = Math.round(task.workedPomodoros.length * (25/60) * 100)/100;
                        return task;
                    });
                    return val;
                });
                $rootScope.goals = response;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
        $rootScope.username = "";
        $rootScope.goals = [];
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
        $rootScope.username = AuthFactory.getUsername();
        goalsFactory.query({}).$promise.then(
            function (response) {
                response = response.map(function(val){
                    val.dueDate = moment(val.dueDate).format("dddd, MMM DD, YYYY");
                    val.tasks = val.tasks.map(function(task){
                        task.startDate = moment(task.startDate).format("dddd, MMM DD, YYYY");
                        task.daysWeek = task.daysWeek.join(", ");
                        task.hoursWorded = Math.round(task.workedPomodoros.length * (25/60) * 100)/100;
                        return task;
                    });
                    return val;
                });
                $rootScope.goals = response;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
        $rootScope.username = AuthFactory.getUsername();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe){
            $localStorage.storeObject('userinfo',$scope.loginData);
        }
        AuthFactory.login($scope.loginData);
        ngDialog.close();
    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };  
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);
        
        ngDialog.close();

    };
}])
;