import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';

import CesiumGlobe from './cesium/CesiumGlobe';
import injectSheet from 'react-jss';

import UploadScreen from './screens/UploadScreen';

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
            <CesiumGlobe>

            </CesiumGlobe>
          </div>
        </div>
      </div>
    );
  }
}

export default injectSheet(styles)(App);
