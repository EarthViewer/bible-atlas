
/* global WorldWind */

export default class GeoTiffLayer extends WorldWind.RenderableLayer {
  constructor(resourceUrl) {
    super("GeoTiff")

    this.isLoaded = false;
    this.isLoading = false;

    this.geoTiffReader = new WorldWind.GeoTiffReader(resourceUrl);
  }

  doRender(dc) {

    if (!this.isLoaded && !this.isLoading) {
      this.isLoading = true;

      try {
        this.geoTiffReader.readAsImage((canvas) => {
          let surfaceGeoTiff = new WorldWind.SurfaceImage(
              this.geoTiffReader.metadata.bbox,
              new WorldWind.ImageSource(canvas));

          this.addRenderable(surfaceGeoTiff);
          this.isLoaded = true;
          this.isLoading = false;
        });
      } catch (error) {
        console.error(error);
      }
    }
    super.doRender(dc);
  }
}

