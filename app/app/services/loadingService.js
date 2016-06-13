//servicio que verifica sesiones de usuario
function loading($rootScope,$interval){
    return{

        set : function()
        {   
            $rootScope.cargando = true;
            $rootScope.terminado = false;
            $interval(function(){

                $rootScope.cargando = false;
                
                $interval(function(){
                  $rootScope.terminado = true;  
                }, 1000);

            }, 2000);

        }
    }
}

loading.$inject = ['$rootScope','$interval'];


app.factory("loading",loading);

