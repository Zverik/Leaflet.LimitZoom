// Fill in missing zoom levels of a tile layer with scaled previous zooms.
// Written by Ilya Zverev, licensed WTFPL

L.TileLayer.mergeOptions({
	nativeZooms: [] // array of integers
});

L.TileLayer.addInitHook(function () {
	var opt = this.options,
	    zooms = opt.nativeZooms;
	if( zooms && zooms.length > 0 ) {
		var minZoom = 100, i;
		for (i = 0; i < zooms.length; i++)
			if (zooms[i] < minZoom)
				minZoom = zooms[i];
		opt.minZoom = Math.max(opt.minZoom, minZoom - 1);
	}
});

L.TileLayer.include({
	getTileSize: function () {
		var map = this._map,
		tileSize = L.GridLayer.prototype.getTileSize.call(this),
		zoom = this._tileZoom + this.options.zoomOffset,
		nativeZoom = this._mapNativeZoom(zoom);

		return nativeZoom == zoom ? tileSize :
			tileSize.divideBy(map.getZoomScale(nativeZoom, zoom)).round();
	},

	_getZoomForUrl: function () {
		var zoom = this._tileZoom,
		maxZoom = this.options.maxZoom,
		zoomReverse = this.options.zoomReverse,
		zoomOffset = this.options.zoomOffset;

		if (zoomReverse) {
			zoom = maxZoom - zoom;
		}

		zoom += zoomOffset;

		return this._mapNativeZoom(zoom);
	},

	_mapNativeZoom: function (zoom) {
		var zooms = this.options.nativeZooms,
		minNativeZoom = this.options.minNativeZoom,
		maxNativeZoom = this.options.maxNativeZoom;

		if (zooms && zooms.length > 0) {
			var prevZoom = -1, minZoom = 100, i;
			for (i = 0; i < zooms.length; i++) {
				if( zooms[i] <= zoom && zooms[i] > prevZoom )
					prevZoom = zooms[i];
				if( zooms[i] < minZoom )
					minZoom = zooms[i];
			}
			zoom = prevZoom < 0 ? minZoom : prevZoom;
		} else if (maxNativeZoom !== null && zoom > maxNativeZoom) {
			zoom = maxNativeZoom;
		} else if (minNativeZoom !== null && zoom < minNativeZoom) {
			zoom = minNativeZoom;
		}
		return zoom;
	}
});
