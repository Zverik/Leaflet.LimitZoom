# Miss some zoom levels for your tiles?

That's not a problem with those Leaflet plugins! Your users won't even notice the absense.
See [this map](http://zverik.github.io/Leaflet.LimitZoom/) for a demo.

## Leaflet.LimitZoom

Does not allow selecting zoom levels that are not in a predefined list.
Include the js file and add `zooms: [1, 5, 8, 14]` option to your `L.Map` object,
with zooms of your choosing.

## Leaflet.ContinuousZoom

Allows restricting `L.TileLayer` zoom levels to a predefined list, while
not limiting map zooming functionality. Missing levels are interpolated from
previous, or a minimal existing zoom level. Be careful: set `minZoom` option
to the minimal native zoom, or number of tile request would be enormous.

To use, include the js file and add `nativeZoom: [2,5,8]` option to a `L.TileLayer`
object, with zooms you have.

## Author and License

Those plugins were written by Ilya Zverev and published under WTFPL license.
