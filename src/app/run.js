(function () {
    // the baseUrl is relavant in source version and while running unit tests.
    // the`typeof` is for when this file is passed as a require argument to the build system
    // since it runs on node, it doesn't have a window object. The basePath for the build system
    // is defined in build.profile.js
    var config = {
        baseUrl: (
            typeof window !== 'undefined' &&
            window.dojoConfig &&
            window.dojoConfig.isJasmineTestRunner
            ) ? '/src': './',
        packages: [
            'agrc',
            'app',
            'dgrid',
            'dijit',
            'dojo',
            'dojox',
            'esri',
            'ijit',
            'layer-selector',
            'put-selector',
            'xstyle',
            {
                name: 'proj4',
                location: 'proj4/dist',
                main: 'proj4'
            },{
                name: 'jquery',
                location: 'jquery/dist',
                main: 'jquery'
            },{
                name: 'spin',
                location: 'spinjs',
                main: 'spin'
            }
        ]
    };
    require(config, [
        'jquery',

        'app/App',

        'dojo/_base/lang',
        'dojo/dom',


        'dojo/domReady!'
    ],
    function (
        $,

        App,

        lang,
        dom
        ) {

        // don't initialize if this is the jasmine test runner
        if (!lang.getObject('dojoConfig.isJasmineTestRunner')) {
            var app = new App({}, dom.byId('appDiv'));
            app.startup();
        }
    });
})();
