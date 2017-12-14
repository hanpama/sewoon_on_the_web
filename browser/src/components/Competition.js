import React from 'react';

import { Work } from './Work';

export class Competition extends React.Component {
  render() {
    const { competition, workViewContext } = this.props;

    return (
      <div>
        <h4>[{competition.year}] {competition.title}</h4>
        {
          competition.works.map(work => (
            <div>
              <Work work={work} workViewContext={workViewContext} />
            </div>
          ))
        }
      </div>
    );
  }
}
