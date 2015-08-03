
function getURLParameter(a) {
    return (RegExp(a + "=(.+?)(&|$)").exec(location.search) || [null, null])[1]
}

define([
	'js/qlik',
	'angular',
	'angularRoute',
	'angularBootstrap'
], function(qlik, angular) {
	
	var app = angular.module('qlik-mashup-angular-bootstrap', [
		'ngRoute',
		'ngAnimate',
		'ui.bootstrap'
	]);
	
	app.controller('DefaultCtrl', function ($scope) {
		
	});

	app.config(['$routeProvider', function($routeProvider) {
				
		$routeProvider.when('/main', {
			templateUrl: 'views/main/main.html',
			controller: 'views/MainCtrl'
		});
		
		$routeProvider.otherwise({redirectTo: '/main'});
	}]);
	
	
	app.directive("qvPlaceholder", function() {
		return {
			restrict: "A",
			
			scope: {
				qvPlaceholder : '='
			},
			
			link: function(scope, elem, attrs) {
				
				scope.$watch('qvPlaceholder', function(newValue, oldValue, scope) {

					if (typeof scope.qvPlaceholder !== 'undefined') {
						$(elem).empty();
					
						$(elem).removeClass('qv');
						$(elem).removeClass('qvtarget');

						scope.$parent.app.getObject(elem, scope.qvPlaceholder).then(function (o) {});
					}
					
				});
				
				$(elem).on('dragover', function (event) {
					
					event.preventDefault();
					$(this).addClass("drop-hover");
					
				}).on('dragleave', function (event) {
					
					event.preventDefault();
					$(this).removeClass("drop-hover");
					
				}).on('drop', function (event) {
					
					event.preventDefault();
					$(this).removeClass("drop-hover");
					
					var id = event.originalEvent.dataTransfer.getData('text').split("#")[1];
					var type = event.originalEvent.dataTransfer.getData('text').split("#")[0];
					
					var app = qlik.openApp(decodeURI(getURLParameter('app')), config);
					
					scope.$apply(function(){
						scope.qvPlaceholder = id;
					});
					
					app.close();
					
				});
			}
		}
	});

	app.directive('currentSelections', function($filter){
		return {
			restrict: "A",
			
			scope: {
				currentSelections : '='
			},
			
			link: function(scope, element, attrs) {
				
				scope.$watch('currentSelections', function (newValue, oldValue) {
					if(typeof scope.currentSelections != 'undefined') {
						scope.currentSelections.getObject(element, 'CurrentSelections');
					}
				});
				
			}
		}
	});
	
	return app;
});