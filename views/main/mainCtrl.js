
define([
	'js/qlik',
	'app'
], function (qlik, app) {
	
	app.controller('views/MainCtrl', function ($scope) {

		$scope.app = qlik.openApp('C:\\Users\\lft\\Documents\\Qlik\\Sense\\Apps\\Helpdesk Management', config);
		
		$scope.sheets = [];
		$scope.app.getAppObjectList("sheet", function(c) {
			var h = c.qAppObjectList.qItems.sort(function(a, b) {
				return a.qData.rank - b.qData.rank
			});
			
			h.forEach(function(c) {
				
				var newSheet = {
					id: c.qInfo.qId,
					title: c.qData.title,
					type: 'sheet',
					items: []
				}
				
				c.qData.cells.forEach(function(c) {
					var g = c;
					
					g.id = c.name;
					g.appid = $scope.app.id
					newSheet.items.push(g);
					
					$scope.app.getObjectProperties(g.id).then(function(b) {
						var c = b.properties;
						
						g.type = c.qInfo.qType;
						
						c.title && c.title.trim && c.title.trim().length > 0
						? g.title = c.title
						: c.markdown && c.markdown.trim && c.markdown.trim().length > 0
						? $scope.app.getObject(g.id).then(function(b) {})
						: "object" == typeof c.title
						? $scope.app.getObject(g.id).then(function(a) {
							g.title = a.layout.title
						})
						:
						c.title
						? g.title = "[no title]"
						: $scope.app.getObject(g.id).then(function(a) {
							!a.layout.title || a.layout.title && "" === a.layout.title.trim()
							? g.title = "[no title]"
							: g.title = a.layout.title
						})
					})
				})
				
				$scope.sheets.push(newSheet);

			})
			
		});
		
	});
	
});