define([
    'dojo/text!./templates/App.html',

    'dojo/_base/array',
    'dojo/_base/Color',
    'dojo/_base/declare',
    'dojo/_base/json',

    'dojo/io-query',

    'dojo/on',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',

    'agrc/widgets/map/BaseMap',
    'agrc/widgets/map/BaseMapSelector',

    'esri/graphic',

    'esri/geometry/Point',
    'esri/geometry/Polyline',

    'esri/symbols/SimpleLineSymbol'
], function(
    template,

    array,
    Color,
    declare,
    dojo,

    ioQuery,

    on,

    _WidgetBase,
    _TemplatedMixin,

    BaseMap,
    BaseMapSelector,

    Graphic,

    Point,
    Polyline,

    SimpleLineSymbol
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        baseClass: 'app',
        serviceUrl: 'http://mapserv.utah.gov/arcgis/rest/services/BaseMaps/Terrain/MapServer',

        constructor: function() {
            // summary:
            //      first function to fire after page loads
            console.info('app.App::constructor', arguments);

            this.childWidgets = [];

            this.inherited(arguments);
        },
        postCreate: function() {
            // summary:
            //      Fires when
            console.log('app.App::postCreate', arguments);

            this.initMap();

            window.agrc = this;

            this.inherited(arguments);
        },
        startup: function() {
            // summary:
            //      Fires after postCreate when all of the child widgets are finished laying out.
            console.log('app.App::startup', arguments);

            var that = this;
            array.forEach(this.childWidgets, function (widget) {
                console.log(widget.declaredClass);
                that.own(widget);
                widget.startup();
            });

            this.inherited(arguments);
        },
        initMap: function() {
            // summary:
            //      Sets up the map
            console.info('app.App::initMap', arguments);

            var uri = window.location.href,
                query = uri.substring(uri.indexOf('?') + 1, uri.length),
                queryObject = ioQuery.queryToObject(query);

            var center = new Point(dojo.fromJson(queryObject.center));
            var line = new Polyline(dojo.fromJson(queryObject.redline));

            var sls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0]), 3);
            var graphic = new Graphic(line, sls);

            this.map = new BaseMap(this.mapDiv, {
                useDefaultBaseMap: false,
                showAttribution: false
            });

            var self = this;
            on(this.map, 'Load', function() {
                self.map.centerAndZoom(center, queryObject.level);
                self.map.graphics.add(graphic);
            });

            this.childWidgets.push(
                new BaseMapSelector({
                    map: this.map,
                    id: 'claro',
                    position: 'TR'
                })
            );
        }
    });
});