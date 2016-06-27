//aqui estaran todas las busquedas que se necesiten en la app ajenas a la base de datos
function busquedas($http, $rootScope){
    return{
    	clima:function(){
    		return $http.get('http://api.openweathermap.org/data/2.5/weather?q=Mexico City,MX&lang=es&type=like&sort=population&cnt=30');
    	}
    }
}

busquedas.$inject = ['$http','$rootScope'];

app.factory("busquedas",busquedas);





