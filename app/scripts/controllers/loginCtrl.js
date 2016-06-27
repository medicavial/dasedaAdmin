// generamos una funcion general
function loginCtrl($scope, $rootScope, sesion) {

	$rootScope.login = true;
	$scope.pageClass = 'page-login';
	$rootScope.titulo = '';

	$scope.inicio = function(){

		$rootScope.mensaje = '';
		$scope.datos = {
			username:'',
			password:''
		}
		$scope.submitted = false;
		$('html').addClass('fondologin');

	}

    $scope.interacted = function(field) {
      return $scope.loginForm.$submitted || field.$dirty;
    };

	$scope.login = function() {


		if ($scope.loginForm.$valid){
			$('#boton').button('loading');
			sesion.login($scope.datos);
		};


	}

}

// inyectamos las dependencias para la minificacion
loginCtrl.$inject = ['$scope', '$rootScope', 'sesion'];

//asignamos a la aplicacion la funcion
app.controller('loginCtrl', loginCtrl);