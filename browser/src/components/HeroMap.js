import * as React from 'react';
import CesiumGlobe from '../cesium/CesiumGlobe';

const { Cesium } = window;

export class HeroMap extends React.Component {
  render() {
    return (
      <CesiumGlobe
        shadows={true}
        imageryProvider={Cesium.createOpenStreetMapImageryProvider({
          url : 'https://stamen-tiles.a.ssl.fastly.net/toner/',
          credit : '' // credit will places bottom of the page, not here
        })}
        onload={viewer => {

          viewer.scene.globe.depthTestAgainstTerrain = true;
          viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date(2017, 3, 1, 9, 50));
          viewer.clock.multiplier = 60 * 2;
          viewer.clock.shouldAnimate = true //if it was paused.


          const dataSourcePromise = Cesium.CzmlDataSource.load('/data/czml/all.czml');
          viewer.dataSources.add(dataSourcePromise);
          dataSourcePromise.then(src => {
            const firstEntity = src.entities.values[0];
            viewer.scene.camera.lookAt(
              firstEntity.position.getValue(viewer.clock.currentTime),
              new Cesium.Cartesian3(-500, -500, 500)
            );
          });
        }}
      />
    );
  }
}