//servicio que verifica sesiones de usuario
function sesion($rootScope, $location, $http, $q, webStorage){
    return{
        login : function(credenciales)
        {   
            
            // console.log(credenciales);

            $http.post(api + 'login',credenciales).success(function (data){
                
                // console.log(data);

                webStorage.session.add('id',data.id);
                webStorage.session.add('user',data.username);
                webStorage.session.add('name',data.name);
                webStorage.session.add('email',data.email);
                webStorage.session.add('skill',data.skill);
                webStorage.session.add('SSID',data.remember_token);
                
                $rootScope.oculto = false;
                $rootScope.login = false;
                $('html').removeClass('fondologin');
                
                $location.path("/home");

                $('#boton').button('reset');


            }).error(function (data){

                $rootScope.mensaje = data.flash;
                $('#boton').button('reset');

            });

            //$rootScope.mensaje = 'El usuario o password son incorrectos';
        },
        logout : function()
        {
            $http.get(api + 'logout');
            webStorage.session.remove('user');
            $rootScope.oculto = true;
            $rootScope.login = true;
            $location.path("/login");
        },
        checkStatus : function()
        {   

            if($location.path() != "/login" && webStorage.session.get('user') == null){   
                $rootScope.oculto = true;
                $rootScope.login = true;
                $location.path("/login");
                $('html').addClass('fondologin');

            }
            //en el caso de que intente acceder al login y ya haya iniciado sesión lo mandamos a la home
            if($location.path() == "/login" && webStorage.session.get('user') != null){
                $location.path("/home");
                $('html').removeClass('fondologin');
            }
        }
    }
}

sesion.$inject = ['$rootScope', '$location', '$http', '$q', 'webStorage'];

app.factory("sesion",sesion);