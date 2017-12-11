import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';

import CesiumGlobe from './cesium/CesiumGlobe';
import injectSheet from 'react-jss';

import UploadScreen from './screens/UploadScreen';

const { Cesium } = window;

const styles = {
  App: {
    'height': '100vh',
  },
  layout: {
    display: 'flex',
    height: '100%',
  },
  sidebar: {
    'box-sizing': 'content-box',
    padding: '20px',
    width: '400px',
    height: '100%',
  },
  main: {
    width: '100%',
    height: '100%',
  },
  appname: {
    'font-size': '21px',
  },
};

class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.App}>
        <div className={classes.layout}>
          <div className={classes.sidebar}>
            <Switch>
              <Route exact path="/" render={() => (
                <span className={classes.appname}>SEWOON_ON_THE_WEB</span>
              )} />
            </Switch>

          </div>
          <div className={classes.main}>
            <CesiumGlobe
              imageryProvider={Cesium.createOpenStreetMapImageryProvider({
                url : 'https://stamen-tiles.a.ssl.fastly.net/toner/',
                credit : 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.'
              })}
              onload={viewer => {
                const dataSourcePromise = Cesium.CzmlDataSource.load('/data/czml/test1.czml');
                viewer.dataSources.add(dataSourcePromise);
                dataSourcePromise.then(src => {
                  const firstEntity = src.entities.values[0];
                  viewer.scene.camera.lookAt(firstEntity.position.getValue(viewer.clock.currentTime), new Cesium.Cartesian3(0,0,1000));

                })

              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default injectSheet(styles)(App);
