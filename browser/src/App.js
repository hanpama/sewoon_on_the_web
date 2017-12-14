import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';

// import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';

import injectSheet from 'react-jss';

import UploadScreen from './screens/UploadScreen';
import { HeroMap } from './components/HeroMap';
import { Header } from './components/Header';
import { Work } from './components/Work';

import { data } from './data';
import { Competition } from './components/Competition';

const dummyModelList = [
  {
    name: '을지로 일대의 건축물들',
    description: `1966년 4월 4일 서울특별시장으로 김현옥이 부임하였다. 그가 부임하기 앞서 중구청 산업과 상공계장으로서 이을삼이 있었다. 그는 이 지역을 처음 봤을 때 이 곳을 이대로 방치해서는 안 된다고 생각했다. 중구청장 장지을이 이 계장을 대동해 김 시장에게 이것을 보고했다. 김 시장은 실태가 심각한 수준임을 인식해 도시계획과에 이 지구 정리방안을 작성하도록 하였고 이를 박정희 대통령에게 보고하였다. 종래에 종로구와 중구에 각각 분담되어 있었던 이 지역의 정비사업이 시청 소관으로 이전되어 김 시장이 진두지휘하였다. 김 시장은 1966년 7월 초 종로구·중구 양 구청장에게 이 지대 무허가건물 철거를 지시했고, 8월까지 이 지역에 대한 철거작업을 마쳤다.[4] 서울시는 이 지역에 대규모의 상가 건물을 짓기로 계획했지만, 정부는 당초 이 지역을 도로용지로 지정한 것을 들어 상가 건설을 거부하려고 했지만, 청계천에 인접하고 있던 현재의 아세아전자상가 위치에 9월 8일 기공식이 거행되었다. 이 기공식에 참석한 김현옥은 '세계의 기운이 이곳으로 모이라' 라는 뜻을 담아 이 지역의 상가 이름을 세운(世運) 상가로 결정했다.[5] 결국 정부도 이 지역을 재개발지구로 고시하게 되었다.[6]

    한편, 1966년 11월 26일에는 세운상가가 지어질 소개공지의 좌우측에 도로명을 부여하였다. ‘대한극장앞(중구 충무로4가 125)~종묘동측(종로구 훈정동 93)’ 구간을 번영동로(繁榮東路)로, ‘대한극장앞(중구 충무로4가 125)~종묘서측(종로구 훈정동 85)’ 구간을 번영서로(繁榮西路)로 지정한 것이다.[7] 두 도로의 이름은 1984년 11월 7일 폐지되었다.`
  },
  { name: '기존의 세운상가' },
  { name: '다시세운 세운상가' },
  { name: '2013년 공모전 당선안' },
  { name: '종로구 세운상가 리노베이션 계획안' },
  { name: '다른 어떤 모델' },
  { name: '또 다른 모델' },
]


const styles = {
  App: {
    'max-width': '1020px',
    'margin': '0 auto',
  },
  main: {
    width: '100%',
    height: '40vh',
    position: 'relative',
  },
  overlaidTitle: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    'background-color': '#8a8a8a',
    color: 'white',
    padding: '8px',
  },
  body: {

  }
};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedWorkIds: [],
    };
  }

  activateWork(workId) {
    this.setState({
      selectedWorkIds: [...this.state.selectedWorkIds, workId],
    });
    console.log(workId);
  }
  deactivateWork(workId) {
    this.setState({
      selectedWorkIds: this.state.selectedWorkIds.filter(item => item !== workId),
    });
    console.log(workId);
  }
  isSelectedWork(workId) {
    return this.state.selectedWorkIds.indexOf(workId) !== -1
  }

  workViewContext = {
    activateWork: this.activateWork.bind(this),
    deactivateWork: this.deactivateWork.bind(this),
    isSelectedWork: this.isSelectedWork.bind(this),
  }

  render() {
    const { classes } = this.props;

    const selectedModelIndex = 0;

    return (
      <div className={classes.App}>
        <Header />

        <div className={classes.main}>
          <HeroMap workIds={this.state.selectedWorkIds} />
          <h1 className={classes.overlaidTitle}>을지로 일대의 건축물들</h1>
        </div>

        <Grid container>

          <Grid item xs={12} md={4}>
            {data.map((row) => (
              row.type === 'competition' ?
              (
                <Competition
                  competition={row}
                  workViewContext={this.workViewContext}
                />
              ) :
              (
                <div>
                  <Work
                    work={row}
                    workViewContext={this.workViewContext}
                  />
                </div>
              )
            ))}
          </Grid>
          <Grid item xs={12} md={8}>
            <p>
              { dummyModelList[selectedModelIndex].description }
            </p>
            <div>Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.</div>
          </Grid>
        </Grid>

      </div>

    );
  }
}

export default injectSheet(styles)(App);
