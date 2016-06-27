// generamos una funcion general
function categoriaCtrl($scope, $rootScope, $location, $interval, Categorias,  webStorage) {

	// variables globales del controlador para cargar las herramientas visuales

    // clase para la animacion de la pagina
	$scope.pageClass = 'page-item';
    // link de la ruta anterior
	$scope.rutaAnterior = '/categorias';
    // html que debe crgar para el footer 
	$rootScope.footer = 'views/guardar-footer.html';
    // titulo de la plantilla
	$rootScope.titulo = 'Nueva Categoria';

    // funcion inicial que va a ejecutar la vista con ng-init
    $scope.inicio = function(){ 

        // inicializamos variables dependiendo de esta es lo que se ve en el footer por eso son globales
    	$rootScope.notificacion = false;
        $rootScope.respaldo = false;
        $rootScope.guardando = false;
        $rootScope.terminado = false;
        $rootScope.fallo = false;

        // limpiamos variables en caso que sea un nuevo dato a capturar
    	$scope.mensaje = '';
    	$scope.ejecuta = '';

        // verificamos que se tenga informacion el localstorage por aquello que se reinicio solo o algo asi

        // en caso de que no limpia todas las variables
    	if (webStorage.get('categoria') == null) {

	    	$scope.datos = {
	    		nombre:''
	    	} 
        // en caso de que se tenga se asigna una vista especial en el footer que pregunta si
        // quieres recuperar la informacion que esta en localstorage
    	}else{

    		$rootScope.respaldo = true;
    	}

    	
    }

    // funcion que manda un true para mostrar validaciones de campos 
    $scope.interacted = function(field) {
      	return $scope.catForm.$submitted;
    };

    // esta funcion se ejecuta cada que se quita el focus de un input para guardar un respaldo en 
    // localstorage por si algun accidente ocurre se pueda recuperar y no perder
    $scope.backup = function(){
    	webStorage.local.add('categoria',JSON.stringify($scope.datos));
    }

    // funciones globales ya que se utiliza un ng-include para mostrar los botones de guardar


    // funcion para saber si estan activos algunos servicios como alguna notificacion
    // o falta de restauracion en local
    $rootScope.muestraBotones = function(){

        if ($rootScope.notificacion) {
            return true;
        }else if($rootScope.respaldo){
            return true;
        }else if($rootScope.guardando){
            return true;
        }else if($rootScope.terminado){
            return true;
        }else if($rootScope.fallo){
            return true;
        }else{
            return false;
        }
    }

    // esta funcion elimina el backup eso quiere decir que el usario no quizo recuperar 
    // la info que tenia en localstorage
    $rootScope.eliminaBackup = function(){

    	webStorage.local.remove('categoria');
    	$rootScope.respaldo = false;
    }

    // esta funcion indica que el usuario quiere recuperar la informacion que perdio por accidente
    // y esta respaldad en localstorage
    $rootScope.restauraBackup = function(){

    	$scope.datos =  JSON.parse(webStorage.local.get('categoria'));
    	$rootScope.respaldo = false;
    }

    //funcion que verifica que se tenga algo de contenido en el formulario y si recurre a una accion 
    // que no haya sido por voluntad del usuario se pregunta si esta seguro
    $rootScope.verifica = function(action){

        $scope.ejecuta = action;

        if(!$scope.catForm.$pristine){
            $rootScope.notificacion = true;
        }else{
            
            webStorage.local.remove('categoria');
            switch($scope.ejecuta) {
                case 1:
                    $rootScope.notificacion = false;
                    $location.path($scope.rutaAnterior);
                    break;
                case 2:
                    $scope.catForm.$submitted = false;
                    $scope.catForm.$pristine = false;
                    $scope.inicio();
                    break;
            }
        }
    }

    //en caso de que si este seguro se ejecuta la accion que llamo 
    $rootScope.ejecutaAccion = function(){

    	webStorage.local.remove('categoria');

    	switch($scope.ejecuta) {
		    case 1:
		        $location.path($scope.rutaAnterior);
		        $rootScope.notificacion = false;
		        break;
		    case 2:
		        $scope.inicio();
		        $scope.catForm.$submitted = false;
		        $scope.catForm.$pristine = false;
		        break;
		}
    }

    // se cancela la accion es decir no estuvo seguro 
    $rootScope.cancela = function(){
    	$rootScope.notificacion = false;
    }

    // funcion global para guardar 
    $rootScope.guardar = function(){

        // se asigna el formulario como enviado para que valide los campos y muestre los errores
        // en caso de tenerlos
    	$scope.catForm.$submitted = true;
        // si el formulario esta correcto se dispone a guardar
    	if ($scope.catForm.$valid) {

            // se activa la vista en el footer 
            $rootScope.guardando = true;

                Categorias.save($scope.datos,function (data){
                    
                    if (data.error) {
                        $rootScope.fallo = true;

                    }else{
                        
                        $rootScope.terminado = true;
                        $scope.catForm.$pristine = false;
                        $scope.catForm.$submitted = false;
                        webStorage.local.remove('categoria');
                    }

                    $rootScope.mensaje = data.message;
                    $rootScope.guardando = false;

                },function (error){
                    
                    $rootScope.fallo = true;
                    $rootScope.mensaje = 'intentalo nuevamente';
                    $rootScope.guardando = false;
                });

                // se actualizan los valores para mostrar el mensaje que mando el server 
    		
    	};
    }

}

// inyectamos las dependencias para la minificacion
categoriaCtrl.$inject = ['$scope', '$rootScope', '$location', '$interval' , 'Categorias',  'webStorage'];

//asignamos a la aplicacion la funcion
app.controller('categoriaCtrl', categoriaCtrl);
