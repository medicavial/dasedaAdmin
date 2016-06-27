// generamos una funcion general
function productoCtrl($scope, $rootScope, $location, Provedores, Categorias, Marcas, Productos, webStorage) {

    // variables globales del controlador para cargar las herramientas visuales

    // clase para la animacion de la pagina
    $scope.pageClass = 'page-item';
    // link de la ruta anterior
    $scope.rutaAnterior = '/productos';
    // html que debe crgar para el footer 
    $rootScope.footer = 'views/guardar-footer.html';
    // titulo de la plantilla
    $rootScope.titulo = 'Nuevo Producto';

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

        // variables para el progresivo cuando subimos imagenes
        $scope.uploadCurrent =  0;
        $scope.currentColor =   '#45ccce';
        $scope.bgColor =        '#eaeaea';
        $scope.radius =         100;
        $scope.isSemi =         false;
        $scope.stroke =         15;
        $scope.currentAnimation = 'easeOutCubic';

        // arreglo donde se acomodan las imagenes
        $scope.imagenes = [];

        $scope.provedores = Provedores.query(); 
        $scope.categorias = Categorias.query();
        $scope.marcas = Marcas.query();
        $scope.marca = '';
        $scope.objetoMarca = '';
        // verificamos que se tenga informacion el localstorage por aquello que se reinicio solo o algo asi

        // en caso de que no limpia todas las variables
        if (webStorage.get('producto') == null) {

            $scope.datos = {
                codigo:'',
                codigobarras:'',
                titulo:'',
                marca:'',
                idmarca:'',
                provedor:'',
                categoria:'',
                costo:'',
                venta:'',
                cantidad:'',
                descripcion1:'',
                descripcion2:'',
                imagenes:$scope.imagenes
            } 
        // en caso de que se tenga se asigna una vista especial en el footer que pregunta si
        // quieres recuperar la informacion que esta en localstorage
        }else{

            $rootScope.respaldo = true;
        }

        
    }

    // funcion que manda un true para mostrar validaciones de campos 
    $scope.interacted = function(field) {
        return $scope.prodForm.$submitted;
    };

    // esta funcion se ejecuta cada que se quita el focus de un input para guardar un respaldo en 
    // localstorage por si algun accidente ocurre se pueda recuperar y no perder
    $scope.backup = function(){

        if ($scope.datos.idmarca == '') {
            
            var dato =  angular.element('#marca_value').val();
            $scope.datos.marca = dato;

        }

        webStorage.local.add('producto',JSON.stringify($scope.datos));

    }


    $scope.seleccionaMarca = function(selected) {
        
        $scope.datos.idmarca = selected.originalObject.id;
        $scope.datos.marca = selected.title;
    };

    // funcion para subir archivos
    $scope.altaImagenes = function(files,file,event){

        // console.log(files);
        // console.log(file);

        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                $scope.imagenes.push(files[i]);
            }
        }

        $scope.backup();
    }


    $scope.eliminaImagen = function(index){
        $scope.imagenes.splice(index,1); 

        $scope.backup(); 
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
        $scope.marca = $scope.datos.marca;
        $scope.imagenes = $scope.datos.imagenes;
        $rootScope.respaldo = false;
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
                    $scope.inicio();
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
                $scope.inicio();
                $scope.prodForm.$submitted = false;
                $scope.prodForm.$pristine = false;
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

                Productos.save($scope.datos,function (data){
                    
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
            //console.log($scope.datos);
            
        };
    }

}

// inyectamos las dependencias para la minificacion
productoCtrl.$inject = ['$scope', '$rootScope', '$location', 'Provedores', 'Categorias','Marcas','Productos',  'webStorage'];

//asignamos a la aplicacion la funcion
app.controller('productoCtrl', productoCtrl);
