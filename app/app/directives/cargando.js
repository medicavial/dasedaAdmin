app.directive('loading', function () {
    return {
        restrict: 'AE',
        replace: 'false',
        template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
    }
});


app.directive('loading2', function () {

	var html = '<div class="spinner"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div>';
    return {
        restrict: 'AE',
        replace: 'false',
        template: html
    }
});


app.directive('loading3', function () {

    return {
        restrict: 'AE',
        replace: 'false',
        template: '<div class="spinner2"></div>'
    }
});


app.directive('loading4', function () {

    return {
        restrict: 'AE',
        replace: 'false',
        template: '<div class="spinner3"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>'
    }
});

app.directive('loading5', function () {

    return {
        restrict: 'AE',
        replace: 'false',
        template: '<div class="loading-container"><div class="loading"></div><div id="loading-text">Cargando</div></div>'
    }
});

app.directive('loading6', function () {

    return {
        restrict: 'AE',
        replace: 'false',
        template: '<div class="spinner4"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'
    }
});


