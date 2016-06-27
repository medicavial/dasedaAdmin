// generamos una funcion general
function clientesCtrl($scope, $rootScope, Clientes, $location, DTOptionsBuilder, DTColumnBuilder) {

	$scope.pageClass = 'page-item';
	$rootScope.footer = 'views/nuevo-footer.html';
	$rootScope.titulo = 'Clientes';
	$rootScope.nuevo = "cliente";
    
    $scope.inicio = function(){

        $scope.cargando = false;
        $scope.muestraInfo();

    }

    $scope.muestraInfo = function(){

        $scope.cargando = true;
        Clientes.query(function(data){
            $scope.clientes = data;
            $scope.cargando = false;
        });

    }

    $scope.muestraProvedor = function(data){
        $location.path('/cliente/'+data[0]);
    }


    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('full_numbers')
        .withOption('lengthMenu', [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "Todo"] ])
        // .withOption('responsive', true)
        .withOption('language', {
            paginate: {
                first: "«",
                last: "»",
                next: "→",
                previous: "←"
            },
            search: "Buscar:",
            loadingRecords: "Cargando Información....",
            lengthMenu: "    Mostrar _MENU_ entradas",
            processing: "Procesando Información",
            infoEmpty: "No se encontro información",
            emptyTable: "Sin Información disponible",
            info: "Mostrando pagina _PAGE_ de _PAGES_ , Registros encontrados _TOTAL_ ",
            infoFiltered: " - encontrados _MAX_ coincidencias"
        })

        .withOption('rowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td', nRow).bind('click', function() {
                $scope.$apply(function() {
                    $scope.muestraProvedor(aData);
                });
            });
            return nRow;
        })


        // Add Bootstrap compatibility
        .withBootstrap()
        // Add ColVis compatibility
        .withColVis()
        // Add a state change function
        .withColVisStateChange(function(iColumn, bVisible) {
            console.log('The column' + iColumn + ' has changed its status to ' + bVisible)
        })

        .withOption("colVis",{
            buttonText: "Mostrar / Ocultar Columnas"
        })
        // Exclude the last column from the list
        // .withColVisOption('aiExclude', [2])

        // Add ColReorder compatibility
        .withColReorder()
        // Set order
        // .withColReorderOrder([1, 0, 2])
        // Fix last right column
        // .withColReorderOption('iFixedColumnsRight', 1)
        // .withColReorderCallback(function() {
        //     console.log('Columns order has been changed with: ' + this.fnOrder());
        // })
        // //Add Table tools compatibility

        .withTableTools('js/swf/copy_csv_xls_pdf.swf')
        .withTableToolsButtons([

            {
                "sExtends":     "copy",
                 "sButtonText": "Copiar"
            },
            {
                'sExtends': 'collection',
                'sButtonText': 'Exportar',
                'aButtons': ['xls', 'pdf']
            }
    ]);

}

// inyectamos las dependencias para la minificacion
clientesCtrl.$inject = ['$scope', '$rootScope', 'Clientes', '$location', 'DTOptionsBuilder', 'DTColumnBuilder'];

//asignamos a la aplicacion la funcion
app.controller('clientesCtrl', clientesCtrl);
