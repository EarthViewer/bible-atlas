
/* global WorldWind */

export default class WmsCatalog {
  constructor(serviceAddress) {

    // Ensure a GetCapabilities request URL
    this.serviceAddress = serviceAddress.split('?')[0];
    this.url = this.serviceAddress;
    this.url += "?service=wms";
    this.url += "&request=getcapabilities";
    this.url += "&vers"
  }

  loadCatalog(callback) {

    let request = new XMLHttpRequest();

    request.open("GET", this.url);
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        
        let xmlDom = request.responseXML;
        if (!xmlDom && request.responseText.indexOf("<?xml") === 0) {
          xmlDom = new window.DOMParser().parseFromString(request.responseText, "text/xml");
        }
        if (!xmlDom) {
          alert(this.url + " retrieval failed. It is probably not a WMS server.");
          return;
        }

        let wmsCapsDoc = new WorldWind.WmsCapabilities(xmlDom);
        if (wmsCapsDoc.version) { // if no version, then the URL doesn't point to a caps doc.
          // Process the servers's capabilities document
          WmsCatalog.processCapabilities(wmsCapsDoc, callback);
        } else {
          alert(this.serviceAddress +
              " WMS capabilities document invalid. The server is probably not a WMS server.");
        }
        
      } else if (request.readyState === 4) {
        if (request.statusText) {
          alert(request.responseURL + " " + request.status + " (" + request.statusText + ")");
        } else {
          alert("Failed to retrieve WMS capabilities from " + this.serverAddress + ".");
        }
      }
    };
    request.send(null);
  }

  static processCapabilities(wmsCapsDoc, callback) {
    let capsLayers = wmsCapsDoc.capability.layers;

    // Ignore the top-level layer if it's a grouping layer with the same title as the server title.
    if ((capsLayers.length === 1) && (capsLayers[0].layers) &&
        (capsLayers[0].title === wmsCapsDoc.service.title) && !(capsLayers[0].name && capsLayers[0].name.length > 0)) {
      capsLayers = capsLayers[0].layers;
    }

    let layers = [];
    WmsCatalog.createLayers(capsLayers, layers);
    layers.forEach(callback);
    
  }

  /**
   *
   * @param {Array} capsLayers Array of layer capabilities
   */
  static createLayers(capsLayers, layersResult) {

    for (let i = 0; i < capsLayers.length; i++) {
      let layerCaps = capsLayers[i];
      let isLayer = (layerCaps.name && layerCaps.name.length > 0) || false;

      if (layerCaps.layers && layerCaps.layers.length > 0) {
        this.createLayers(layerCaps.layers, layersResult);
      } else if (isLayer) {
        layersResult.push(WmsCatalog.createLayerFromCapabilities(layerCaps));
      }
    }
  }

  /**
   * 
   * @param {Object} layerCaps
   * @returns {WorldWind.WmsLayer|WorldWind.WmsTimeDimensionedLayer}
   */
  static createLayerFromCapabilities(layerCaps) {
    if (layerCaps.name) {
      var config = WorldWind.WmsLayer.formLayerConfiguration(layerCaps, null);
      var layer;

      if (config.timeSequences &&
          (config.timeSequences[config.timeSequences.length - 1] instanceof WorldWind.PeriodicTimeSequence)) {
        var timeSequence = config.timeSequences[config.timeSequences.length - 1];
        config.levelZeroDelta = new WorldWind.Location(180, 180);
        layer = new WorldWind.WmsTimeDimensionedLayer(config);
        layer.opacity = 0.8;
        layer.time = timeSequence.startTime;
//                        this.timeSeriesPlayer.timeSequence = timeSequence;
//                        this.timeSeriesPlayer.layer = layer;
        layer.timeSequence = timeSequence;

        //for (var t = timeSequence.currentTime; t != null; t = timeSequence.next()) {
        //    console.log(t.toISOString());
        //}
        //timeSequence.reset();

      } else if (config.timeSequences &&
          (config.timeSequences[config.timeSequences.length - 1] instanceof Date)) {
        timeSequence = config.timeSequences[config.timeSequences.length - 1];
        config.levelZeroDelta = new WorldWind.Location(180, 180);
        layer = new WorldWind.WmsTimeDimensionedLayer(config);
        layer.opacity = 0.8;
        layer.time = config.timeSequences[0];
//                        this.timeSeriesPlayer.timeSequence = new WorldWind.BasicTimeSequence(config.timeSequences);
//                        this.timeSeriesPlayer.layer = layer;
        layer.timeSequence = timeSequence;
      } else {
        layer = new WorldWind.WmsLayer(config, null);
//                        layer = new WorldWind.WmsLayer(config, null);
//                        this.timeSeriesPlayer.timeSequence = null;
//                        this.timeSeriesPlayer.layer = null;
      }

      if (layerCaps.styles && layerCaps.styles.length > 0
          && layerCaps.styles[0].legendUrls && layerCaps.styles[0].legendUrls.length > 0) {
        // Add the legend url to the layer object so we can
        // draw an image using the url as the image source
        layer.legendUrl = layerCaps.styles[0].legendUrls[0];
      }

      // TODO: pass in category; add to selected category
      layer.enabled = true;
      return layer;
    }

    return null;
  }

  /**
   * Add a WMS layer to the globe and applies options object properties to the 
   * the layer.
   * @param {String} serviceAddress Service address for the WMS map server
   * @param {String} layerName Layer name (not title) as defined in the capabilities document
   * @param {Object|null} options
   */
  static addLayerFromWms(serviceAddress, layerName, options) {
    const self = this;

    // Create a GetCapabilities request URL
    let url = serviceAddress.split('?')[0];
    url += "?service=wms";
    url += "&request=getcapabilities";

    let parseCapabilities = function (xml) {
      // Create a WmsCapabilities object from the returned xml
      var wmsCapabilities = new WorldWind.WmsCapabilities(xml);

      var layerForDisplay = wmsCapabilities.getNamedLayer(layerName);
      var layerConfig = WorldWind.WmsLayer.formLayerConfiguration(layerForDisplay);
      // Create the layer and add it to the globe
      var wmsLayer = new WorldWind.WmsLayer(layerConfig);
      // Extract the bbox out of the WMS layer configuration
      options.bbox = layerConfig.sector;
      // Add the layer to the globe
      self.addLayer(wmsLayer, options);
    };

    // Create a request to retrieve the data
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true); // performing an asynchronous request 
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          parseCapabilities(xhr.responseXML);
        } else {
          alert("XMLHttpRequest to " + url + " failed with status code " + xhr.status);
        }
      }
    };
    xhr.send();
  }
}