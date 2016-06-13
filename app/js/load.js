/*
    Author: Rolando Caldas Sanchez
    Blog: http://rolandocaldas.com/
    Google+: https://plus.google.com/+RolandoCaldasSanchez
    Linkedin: http://www.linkedin.com/in/rolandocaldas
    Twitter: https://twitter.com/rolando_caldas

    This file is part of an article:
    http://rolandocaldas.com/html5/carga-asincrona-de-javascript 
*/
    
function addEvent(element, event, fn) {
    if (element.addEventListener) {
        element.addEventListener(event, fn, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, fn);
    }
}

function loadScript(src, callback)
{
  var s,
      r,
      t,
      scripts,
      write;
      
  if (Array.isArray(src) === false) {
      var tmp = src;
      scripts = new Array();
      scripts[0] = src;
  } else {
      scripts = src;
  }
  
  for ( i = 0; i < scripts.length; i++) {
    write = scripts[i].split("/");
    document.getElementById('loading-text').innerHTML = 'Loading ... ' + write[(write.length - 1)] + ' ... ';
    r = false;
    s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = scripts[i];
    if (i == scripts.length - 1) {
        s.onload = s.onreadystatechange = function() {
            if ( !r && (!this.readyState || this.readyState == 'complete') )
            {
                r = true;
                if (callback !== undefined) {
                    callback();
                }
            }
        };
    }
    t = document.getElementsByTagName('script')[0];
    t.parentNode.insertBefore(s, t);  
  }
}

addEvent(window, 'load', function(){ loadScript(
        'lib/prefixfree.min.js', 
        function () { loadScript(
            new Array(

            'lib/jquery.min.js',
            'lib/bootstrap.min.js',
            'lib/angular.min.js',
            'modules/angular-animate.min.js',
            'modules/angular-route.min.js',
            'modules/angular-cookies.min.js',
            'modules/angular-webstorage.min.js',
            'modules/angular-resource.min.js',
            'modules/angular-messages.min.js',
            'modules/ui-bootstrap-tpls.min.js',
            'app/app.js',
            'app/services/loginService.js',
            'app/services/loadingService.js',
            'app/services/findService.js',
            'app/services/resourceService.js',
            'app/directives/cargando.js',
            'app/directives/rutas.js',
            'app/controllers/homeCtrl.js',
            'app/controllers/productoCtrl.js',
            'app/controllers/loginCtrl.js',
            'app/controllers/provedorCtrl.js',
            'app/controllers/provedoresCtrl.js'

            ), 
            function () { loadScript('js/welcome.js')})
        } );
});





          