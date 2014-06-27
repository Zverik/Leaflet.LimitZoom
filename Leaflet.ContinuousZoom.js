// Fill in missing zoom levels of a tile layer with scaled previous zooms.
// Written by Ilya Zverev, licensed WTFPL

L.TileLayer.mergeOptions({
	nativeZooms: [] // array of integers
});

// this doesn't work because L.TileLayer does not call init hooks. So do not forget to set options.minZoom!
L.TileLayer.addInitHook(function () {
	var opt = this.options,
	    zooms = opt.nativeZooms;
	if( zooms && zooms.length > 0 ) {
		var minZoom = 100, i;
		for (i = 0; i < zooms.length; i++)
			if (zooms[i] < minZoom)
				minZoom = zooms[i];
	}
	opt.minZoom = Math.max(opt.minZoom, minZoom - 1);
});

L.TileLayer.include({
	_getTileSize: function () {
		var map = this._map,
		    zoom = map.getZoom() + this.options.zoomOffset,
		    zoomN = this.options.maxNativeZoom,
		    zoomsN = this.options.nativeZooms,
		    tileSize = this.options.tileSize;

		var nativeZoom = this._mapNativeZoom(zoom);

		return nativeZoom == zoom ? tileSize :
			Math.round(map.getZoomScale(zoom) / map.getZoomScale(nativeZoom) * tileSize);
	},

	_getZoomForUrl: function () {
		var options = this.options,
		    zoom = this._map.getZoom();

		if (options.zoomReverse) {
			zoom = options.maxZoom - zoom;
		}

		zoom += options.zoomOffset;

		return this._mapNativeZoom(zoom);
	},

	_mapNativeZoom: function (zoom) {
		var zoomN = this.options.maxNativeZoom,
		    zoomsN = this.options.nativeZooms,
		    result = zoom;

		if (zoomsN && zoomsN.length > 0) {
			var prevZoom = -1, minZoom = 100, i;
			for (i = 0; i < zoomsN.length; i++) {
				if( zoomsN[i] <= zoom && zoomsN[i] > prevZoom )
					prevZoom = zoomsN[i];
				if( zoomsN[i] < minZoom )
					minZoom = zoomsN[i];
			}
			result = prevZoom < 0 ? minZoom : prevZoom;
		} else if (zoomN && zoom > zoomN) {
			result = zoomN;
		}
		return result;
	}
});
