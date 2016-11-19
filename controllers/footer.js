//control the active state of navbar-->
var activenavbar = function HeaderController($scope, $location) {
    	$scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
	};

module.exports = activenavbar;
