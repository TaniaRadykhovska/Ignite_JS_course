
var app = angular.module("appKet", ["smoothScroll", "ngRoute"]);

app.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/:newsId', {
				templateUrl: 'news.html',
				controller: 'NewsCtrl',
				controllerAs: 'news'
			})
			.when('/', {
				templateUrl: 'main.html',
				controller: 'DataCtrl',
				controllerAs: 'data'
			})

		$locationProvider.html5Mode(true);
	}]);

app.controller("mainCtrl", ["$scope", "smoothScroll", "$http", function($scope, smoothScroll, $http){

	$scope.menuItems = [
		{ id: "top", name: "HOME"},
		{ id: "services", name: "SERVICES"},
		{ id: "portfolio", name: "PORTFOLIO"},
		{ id: "about-us", name: "ABOUT"},
		{ id: "news", name: "NEWS"},
		{ id: "contact", name: "CONTACT"}
	];

	$scope.activeMenu = "top";

	$scope.scrollTo = function(anchor) {

		var options = {
			duration: 700,
			easing: 'easeInQuad',
			offset: 100
		},
		elem = document.getElementById(anchor);
		if ( elem ) {
			smoothScroll(elem, options);
		}
	}

	$scope.activateMenu = function (anchor) {
		$scope.activeMenu = anchor;
	}

	$http.get("data.json").success(function (response) {
		$scope.items = response;
		for (var i in $scope.items) {
			$scope.items[i].date = new Date($scope.items[i].date);
		}
	});
}]);

app.controller('NewsCtrl', ['$routeParams', '$http', function NewsCtrl ($routeParams, $http) {
	this.id = $routeParams.newsId;
	var getArticle = function (response) {
		for (var i in response) {
			if (response[i].id == $routeParams.newsId) {
				this.date = new Date(response[i].date);
				this.text = response[i].text;
			}
		}
	};
	$http.get("data.json").success(getArticle.bind(this));
}]);

app.controller('DataCtrl', ['$http', '$scope', function DataCtrl ($http, $scope) {

}]);

app.controller("serviceCtrl", ["$scope", function($scope) {
	$scope.activeService = "web";
	$scope.serviceItems = [
		{name: "WEB DESIGN", class: "web", blockL: false},
		{name: "GRAPHIC DESIGN", class: "graphic", blockL: false},
		{name: "PROGRAMMING", class: "programming", blockL: false},
		{name: "PHOTOGRAPHY", class: "photography", blockL: true}
	]
	$scope.viewService = function(service) {
		$scope.activeService = service;
	}
}]);

app.controller("registerFormCtrl",["$scope", function($scope) {
	$scope.nameRegex = /^[a-zA-Z]*$/;
	$scope.mailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]+$/; 
	$scope.passwordRegex = /.{20,}/;

	$scope.submitHandler = function(isvalid) {
		if (isvalid) {
			alert('Спасибо! Ваша регистрация принята!!!)');
		}
		else {
			alert('Please enter your data');
		}
	}
	$scope.showError = function (err) {
		if (angular.isDefined(err)) {
			if (err.required) {
				return 'no data entered!'
			}
			else if (err.pattern) {
				return "invalid data!";
			}
		}
	}
}]);