// generamos una funcion general
function homeCtrl($scope, $rootScope, busquedas, Productos, Clientes, Provedores) {

	$scope.pageClass = 'page-home';

    $scope.inicio = function(){

    	$rootScope.titulo = '';
    	$scope.obtenClima();
        $scope.muestraInfo();
        
    }

    $scope.muestraInfo = function() {
        
        Provedores.query(function (data){
            $scope.provedores = data.length;
        });
        Clientes.query(function (data){
            $scope.clientes = data.length;
        });
        Productos.query(function (data){
            $scope.productos = data.length;
        });
        
    }

    $scope.obtenClima = function(){

    	busquedas.clima().success(function (data){
    		
    		$scope.detalle = data.weather[0].description;
    		$scope.icon = data.weather[0].icon;
    		$scope.clave = data.weather[0].id;
    		$scope.minima = Number(data.main.temp_min) - 273.15 ;
    		$scope.maxima = Number(data.main.temp_max) -  273.15 ;
    		$scope.actual = Number(data.main.temp) -  273.15 ;

    	});

    }
}

// inyectamos las dependencias para la minificacion
homeCtrl.$inject = ['$scope', '$rootScope', 'busquedas', 'Productos', 'Clientes', 'Provedores'];

//asignamos a la aplicacion la funcion
app.controller('homeCtrl', homeCtrl);
