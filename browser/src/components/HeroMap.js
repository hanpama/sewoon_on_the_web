import * as React from 'react';
import CesiumGlobe from '../cesium/CesiumGlobe';
import { loadCzmlData } from '../loadCzmlData';

const { Cesium } = window;

export class HeroMap extends React.Component {

  constructor(props) {
    super(props);

    this.workIds = [];
    this.dataSourcePromiseMap = {};
    this.state = {
      viewer: null,
    };
  }

  componentWillReceiveProps(newProps) {
    const { workIds } = newProps;
    const { viewer } = this.state;

    if (!viewer) {
      return;
    }
    console.log('received props');

    const removedIds = [];
    const addedIds = [];

    const distinctIds = new Set([...newProps.workIds, ...this.workIds]);
    distinctIds.forEach(id => {
      const idInOld = this.workIds.indexOf(id) !== -1;
      const idInNew = newProps.workIds.indexOf(id) !== -1;

      if (idInNew && !idInOld) {
        return addedIds.push(id);
      }
      if (!idInNew && idInOld) {
        return removedIds.push(id);
      }
    });

    let lastAddedPromise = null;


    addedIds.forEach(id => {
      if (!this.dataSourcePromiseMap[id]) {
        this.dataSourcePromiseMap[id] = loadCzmlData(id);
        lastAddedPromise = this.dataSourcePromiseMap[id];
      }
      viewer.dataSources.add(this.dataSourcePromiseMap[id]);
    });

    removedIds.forEach(id => {
      const dataSourcePromise = this.dataSourcePromiseMap[id];
      dataSourcePromise.then((dataSource) => {
        console.log(viewer.dataSources.remove(dataSource));

      });
    });

    if (lastAddedPromise) {
      lastAddedPromise.then(src => {
        const firstEntity = src.entities.values[0];
        viewer.scene.camera.lookAt(
          firstEntity.position.getValue(viewer.clock.currentTime),
          new Cesium.Cartesian3(-500, -500, 500)
        );
      })
    }
  }
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
          this.setState({ viewer });
        }}
      />
    );
  }
}