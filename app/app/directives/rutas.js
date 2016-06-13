//funcion para cambiar la ruta 
app.directive('ruta', ['$location', function($location) {
    return {
        link: function(scope, element, attrs) {
            element.on('click', function() {
                scope.$apply(function() {
                    $location.path('/' + attrs.ruta);
                });
            });
        }
    }
}]);