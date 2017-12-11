import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';


import injectSheet from 'react-jss';

import UploadScreen from './screens/UploadScreen';
import { HeroMap } from './components/HeroMap';


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
    height: '50%',
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
            <HeroMap />
            <div>Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.</div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectSheet(styles)(App);
