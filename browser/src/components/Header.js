import * as React from 'react';

import injectSheet from 'react-jss';

const styles = {
  Header: {
    padding: '12px 0',
    display: 'flex',
    'justify-content': 'space-between',
  },
  left: {
    // float: 'left',
    width: '120px',
    'font-weight': 600,
  }
};

const HeaderComponent = ({ classes }) => (
  <div className={classes.Header}>
    <div className={classes.left}>
      sewoon<br/>on the<br/>web
    </div>
    <div>
      competitions
    </div>
  </div>
);

export const Header = injectSheet(styles)(HeaderComponent);
