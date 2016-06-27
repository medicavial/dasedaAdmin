// generamos una funcion general
function productoEditCtrl($scope, $rootScope, $location, Productos, Provedores, Categorias, webStorage, $routeParams, $upload) {

	// variables globales del controlador para cargar las herramientas visuales

    // clase para la animacion de la pagina
	$scope.pageClass = 'page-item';
    // link de la ruta anterior
	$scope.rutaAnterior = '/productos';
    // html que debe crgar para el footer 
	$rootScope.footer = 'views/guardar-footer.html';
    // titulo de la plantilla
	$rootScope.titulo = 'Editar Producto';

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
        $scope.cargando = false;
        $scope.edicion = true;

        // variables para el progresivo cuando subimos imagenes
        $scope.uploadCurrent =  0;
        $scope.currentColor =   '#45ccce';
        $scope.bgColor =        '#eaeaea';
        $scope.radius =         100;
        $scope.isSemi =         false;
        $scope.stroke =         15;
        $scope.currentAnimation = 'easeOutCubic';

        // cargamos catalogos de provedores y categorias
        $scope.provedores = Provedores.query(); 
        $scope.categorias = Categorias.query();

        // arreglo donde se acomodan las imagenes que se eliminan
        $scope.eliminadas = [];

        // verificamos que se tenga informacion el localstorage por aquello que se reinicio solo o algo asi

        Productos.get({ id: $routeParams.id },function(data){
            
            $scope.imagenes = data.imagenes;

            $scope.datos = {
                codigo:data.datos.codigo,
                codigobarras:data.datos.codigobarras,
                titulo:data.datos.titulo,
                marca:data.datos.marca,
                idmarca:data.datos.brand_id,
                provedor:data.datos.provider_id,
                categoria:data.datos.category_id,
                costo:data.datos.costo,
                venta:data.datos.venta,
                cantidad:data.datos.existencia,
                descripcion1:data.datos.descripcion1,
                descripcion2:data.datos.descripcion2,
                imagenes:$scope.imagenes,
                eliminadas:$scope.eliminadas,
                activo:data.datos.activated
            } 

            console.log($scope.imagenes);


        });

    	
    }

    // funcion que manda un true para mostrar validaciones de campos 
    $scope.interacted = function(field) {
      	return $scope.prodForm.$submitted;
    };

    // esta funcion se ejecuta cada que se quita el focus de un input para guardar un respaldo en 
    // localstorage por si algun accidente ocurre se pueda recuperar y no perder
    $scope.backup = function(){
    	webStorage.local.add('producto',JSON.stringify($scope.datos));
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

    	webStorage.local.remove('producto');
    	$rootScope.respaldo = false;
    }

    // esta funcion indica que el usuario quiere recuperar la informacion que perdio por accidente
    // y esta respaldad en localstorage
    $rootScope.restauraBackup = function(){

    	$scope.datos =  JSON.parse(webStorage.local.get('producto'));
    	$rootScope.respaldo = false;
    }

    // funcion para subir archivos
    $scope.altaImagenes = function($files) {

        // verificamos el total de los archivos y lo mostramos
        $scope.cargando = true;
        $scope.total = $files.length;

        for (var i = 0; i < $files.length; i++) {

            $scope.actual = i + 1;
            $scope.uploadCurrent =  0;
            var file = $files[i];

            try{

                $scope.nombreimagen = file.name;

                if (file.type.indexOf('image') == -1) {

                     throw 'La extension no es de tipo imagen'; 

                }else if (file.size > 5242880){

                     throw 'El archivo excede los 5MB dispnibles';
                }

                $scope.upload = $upload.upload({
                    url: api + 'upload', //upload.php script, node.js route, or servlet url
                    method: 'POST',
                    headers: {'Token':webStorage.session.get('SSID')}, withCredential: true,
                    data: {dato: 'datos Enviados'},
                    file: file
                    // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
                    /* set file formData name for 'Content-Desposition' header. Default: 'file' */
                    //fileFormDataName: myFile,
                    /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
                    //formDataAppender: function(formData, key, val){} 
                }).progress(function(evt) {
                    $scope.uploadCurrent =  parseInt(100.0 * evt.loaded / evt.total);
                }).success(function(data, status, headers, config) {

                    // imagen se guardo con exito en temporales
                    $scope.imagenes.push({
                      nombre:data.nombre,
                      ubicacion:data.ubicacion,
                      image:data.temporal
                    });

                    if ($scope.total == $scope.actual) {

                        $scope.cargando = false;
                        $scope.datos.imagenes = $scope.imagenes;
                        $scope.backup();

                    }else{

                        $scope.actual +=1 ;

                    }

                });

            }catch(err){

                $scope.cargando = false;
                alert(err);

            }

        }

    }

    // elimina una imagen
    $scope.eliminaImagen = function(index){

        $scope.eliminadas.push($scope.imagenes[index]);
        $scope.imagenes.splice(index,1);  

    }

    //funcion que verifica que se tenga algo de contenido en el formulario y si recurre a una accion 
    // que no haya sido por voluntad del usuario se pregunta si esta seguro
    $rootScope.verifica = function(action){

        $scope.ejecuta = action;

        if(!$scope.prodForm.$pristine){
            $rootScope.notificacion = true;
        }else{
            
            webStorage.local.remove('producto');
            switch($scope.ejecuta) {
                case 1:
                    $rootScope.notificacion = false;
                    $location.path($scope.rutaAnterior);
                    break;
                case 2:
                    $scope.prodForm.$submitted = false;
                    $scope.prodForm.$pristine = false;
                    $location.path('/producto');
                    break;
            }
        }
    }

    //en caso de que si este seguro se ejecuta la accion que llamo 
    $rootScope.ejecutaAccion = function(){

    	webStorage.local.remove('producto');

    	switch($scope.ejecuta) {
		    case 1:
		        $location.path($scope.rutaAnterior);
		        $rootScope.notificacion = false;
		        break;
		    case 2:
		        $scope.prodForm.$submitted = false;
		        $scope.prodForm.$pristine = false;
                $location.path('/producto');
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
    	$scope.prodForm.$submitted = true;
        // si el formulario esta correcto se dispone a guardar
    	if ($scope.prodForm.$valid) {

            // se activa la vista en el footer 
            $rootScope.guardando = true;
            
                Productos.update({id:$routeParams.id},$scope.datos,function (data){
                    
                    if (data.error) {
                        $rootScope.fallo = true;

                    }else{
                        
                        $rootScope.terminado = true;
                        $scope.prodForm.$pristine = false;
                        $scope.prodForm.$submitted = false;
                        webStorage.local.remove('producto');
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
productoEditCtrl.$inject = ['$scope', '$rootScope', '$location' , 'Productos', 'Provedores', 'Categorias',  'webStorage' , '$routeParams', '$upload'];

//asignamos a la aplicacion la funcion
app.controller('productoEditCtrl', productoEditCtrl);
