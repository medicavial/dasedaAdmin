var conexion;
var descripcion;
var api = "http://localhost/dasedaNuevo/public/api/";


// cargamos javascript y en cuanto cargue mostramos el splash screen 
window.onload=function(){

    $('#splash').addClass('zoomIn splash-open');
    window.setTimeout(function(){

        if (navigator.onLine) {

            conexion = true;
            descripcion = 'Con conexion a internet';

        }

        $('#splash').removeClass('zoomIn splash-open');
        $('#splash').addClass('fadeOut');
        angular.bootstrap(document,['app']);

    },2000);

}


//inicializamos la aplicacion
var app = angular.module('app', 
    [
        'ngRoute',
        'ngAnimate',
        'ngResource',
        'ngMessages',
        'webStorageModule',
        'ui.bootstrap',
        'angular-svg-round-progressbar',
        'MassAutoComplete',
        'ngFileUpload',
        'datatables',
        'datatables.buttons',
        'datatables.bootstrap',
        'datatables.colvis',
        'datatables.colreorder',
        'datatables.tabletools',
        'angucomplete-alt',
        'textAngular',
        'FBAngular',
        'mn'
    ]);

//configuramos nuestra aplicacion
app.config(['$routeProvider','$locationProvider','$httpProvider',function($routeProvider,$locationProvider,$httpProvider){

    //Configuramos la ruta que queremos el html que le toca y que controlador usara
    $routeProvider.when('/categorias',{
            templateUrl: 'views/categorias.html',
            controller : 'categoriasCtrl'
    });

    $routeProvider.when('/categoria',{
            templateUrl: 'views/categoria.html',
            controller : 'categoriaCtrl'
    });

    $routeProvider.when('/categoria/:id',{
            templateUrl: 'views/categoria.html',
            controller : 'categoriaEditCtrl'
    });

    $routeProvider.when('/cliente',{
            templateUrl: 'views/cliente.html',
            controller : 'clienteCtrl'
    });

    $routeProvider.when('/cliente/:id',{
            templateUrl: 'views/cliente.html',
            controller : 'clienteEditCtrl'
    });

    $routeProvider.when('/clientes',{
            templateUrl: 'views/clientes.html',
            controller : 'clientesCtrl'
    });

    $routeProvider.when('/home',{
            templateUrl: 'views/home.html',
            controller : 'homeCtrl'
    });

    $routeProvider.when('/login',{
            templateUrl: 'views/login.html',
            controller : 'loginCtrl'
    });

    $routeProvider.when('/productos',{
            templateUrl: 'views/productos.html',
            controller : 'productosCtrl'
    });

    $routeProvider.when('/producto',{
            templateUrl: 'views/producto.html',
            controller : 'productoCtrl'
    });

    $routeProvider.when('/producto/:id',{
            templateUrl: 'views/producto.html',
            controller : 'productoEditCtrl'
    });

    $routeProvider.when('/provedor',{
            templateUrl: 'views/provedor.html',
            controller : 'provedorCtrl'
    });

    $routeProvider.when('/provedor/:id',{
            templateUrl: 'views/provedor.html',
            controller : 'provedorEditCtrl'
    });

    $routeProvider.when('/provedores',{
            templateUrl: 'views/provedores.html',
            controller : 'provedoresCtrl'
    });
    
    $routeProvider.otherwise({redirectTo:'/login'});

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });


}]);


//sirve para ejecutar cualquier cosa cuando inicia la aplicacion
app.run(['$rootScope','$location', 'sesion','webStorage','$window', 'Fullscreen' ,function ($rootScope , $location, sesion, webStorage, $window, Fullscreen){    
    
    $rootScope.isFullscreen = false;
    $rootScope.openaccess = false;
    $rootScope.online = conexion;
    $rootScope.descripcion = descripcion;
    $rootScope.ruta = "http://daseda.net/";

    $rootScope.panel = function(){
        $rootScope.openaccess = !$rootScope.openaccess;
    }
     
    $window.addEventListener("online", function() {
        $rootScope.$apply(function(){
            $rootScope.online = true;
            $rootScope.descripcion = 'Con conexion a internet';
        });
    }, true);
     
    $window.addEventListener("offline", function() {

        //alert("Hubo un error de conexion cuando la conexion regrese se sincronizaran tus datos");
        $rootScope.$apply(function(){
            $rootScope.online = false;
            $rootScope.descripcion = 'Sin conexion a internet';
        });

    }, true);

    // eventos para saber la resolucion de la pantalla 

    // pixeles permitidos para modo smartphone
    var mobileView = 767;

    // obtenemos el valor de la pantalla pixeles
    $rootScope.getWidth = function() { return window.innerWidth; };

    // observamos cada cambio que se haga en el tamaño del navegador
    $rootScope.$watch($rootScope.getWidth, function(newValue, oldValue)
    {
        if(newValue <= mobileView)
        {
            if(angular.isDefined(webStorage.session.get('mobile')))
            {
                if(webStorage.session.get('mobile') == false)
                    $rootScope.mobile = false;

                else
                    $rootScope.mobile = true;
            }
            else 
            {
                $rootScope.mobile = true;
                webStorage.session.add('mobile',$rootScope.mobile);
            }
        }
        else
        {
            $rootScope.mobile = false;
        }

    });

    // detectammos cada que se cambie la resolucion en pantalla
    window.onresize = function() { $rootScope.$apply(); };


    if ($location.path() == '/login') {
        $rootScope.oculto = true;
        $rootScope.login = true;
    }else{
        $rootScope.oculto = false;
        $rootScope.login = false;
    }

    // funcion que muestra el menu en modo de smartphone
    $rootScope.cambia = function(){
        // detecta el modo y que la ruta sea diferente de login
        if ($location.path() != '/login' && $rootScope.mobile == true) {
            $rootScope.offcanvas = !$rootScope.offcanvas;
        };
    }

    //evento que verifica cuando alguien cambia de ruta
    $rootScope.$on('$routeChangeStart', function(){

        if ($rootScope.offcanvas) {
            $rootScope.offcanvas = !$rootScope.offcanvas;
        };
        $rootScope.user =  webStorage.session.get('user');
        sesion.checkStatus();
    });

    

    // plantillas para los ng-include
    $rootScope.menu = 'views/menu.html';
    $rootScope.header = 'views/header.html';
    $rootScope.tittle = 'views/tittle.html';
    $rootScope.lounch = 'views/lounch.html';

    //funcion en angular para cerrar sesion
    $rootScope.logout = function(){
        sesion.logout();
    }

    $rootScope.pantalla = function () {

        if (Fullscreen.isEnabled()){
            Fullscreen.cancel();
            $rootScope.isFullscreen = false;
        }else{
            Fullscreen.all();
            $rootScope.isFullscreen = true;
        }


    }

}]);

