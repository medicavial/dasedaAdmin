// generamos una funcion general
function categoriasCtrl($scope, $rootScope, Categorias, $location, DTOptionsBuilder, DTColumnBuilder) {

	$scope.pageClass = 'page-item';
	$rootScope.footer = 'views/nuevo-footer.html';
	$rootScope.titulo = 'Categorias';
	$rootScope.nuevo = "categoria";

    $scope.inicio = function(){

        $scope.cargando = false;
    	$scope.muestraInfo();

    }

    $scope.muestraInfo = function(){

        $scope.cargando = true;
        Categorias.query(function(data){
            $scope.categorias = data;
            $scope.cargando = false;
        });

    }

    $scope.muestraCategoria = function(data){
        $location.path('/categoria/'+data[0]);
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

        // .withOption('rowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        //     $('td', nRow).bind('click', function() {
        //         $scope.$apply(function() {
        //             $scope.muestraCategoria(aData);
        //         });
        //     });
        //     return nRow;
        // })


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
        
    $scope.dtColumns = [

        DTColumnBuilder.newColumn("id"),
        DTColumnBuilder.newColumn("nombre"),
        DTColumnBuilder.newColumn("contacto"),
        DTColumnBuilder.newColumn("correo"),
        DTColumnBuilder.newColumn("telefono"),
        DTColumnBuilder.newColumn("createdAt")

    ];


}

// inyectamos las dependencias para la minificacion
categoriasCtrl.$inject = ['$scope', '$rootScope', 'Categorias', '$location', 'DTOptionsBuilder', 'DTColumnBuilder'];

//asignamos a la aplicacion la funcion
app.controller('categoriasCtrl', categoriasCtrl);
