var app = angular.module('myApp', ['ngMessages']);
app.controller('machineKeyCtrl', ['$scope', '$http',function($scope, $http) {
	$scope.validation = "SHA1";
	$scope.decryption="AES256";
	$scope.result;
	$scope.errors=[];
	$scope.generateMachineKey = function () {
		/*$http.get(`https://chaos.aspnet.cz/MachineKey.ashx?validation=${$scope.validation}&decryption=${$scope.decryption}`)
		.then(function(response){
			$scope.result = response.data;			
		})
		.catch(function(error){
			$scope.errors.length = 0;
			$scope.errors.push({text:"Failed to generate Machine Key please refresh the page!"});
		});*/
		window.open(`https://chaos.aspnet.cz/MachineKey.ashx?validation=${$scope.validation}&decryption=${$scope.decryption}`,'_blank');
	}

	//$scope.generateMachineKey();

	$scope.copyText = function(id) {
		var range = document.createRange();
        range.selectNode(document.getElementById(id));
        window.getSelection().removeAllRanges(); // clear current selection
        window.getSelection().addRange(range); // to select text
        document.execCommand("copy");
        window.getSelection().removeAllRanges();// to deselect

	}
}]);