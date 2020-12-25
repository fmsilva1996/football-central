import React, { useState, useEffect } from 'react';
import './FixtureBody.css';

// Routing
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom';

// My Components
import FixtureStats from '../FixtureStats/FixtureStats';
import LineUps from '../LineUps/LineUps';
import FixtureCountdown from '../FixtureCountdown/FixtureCountdown';
import Predictions from '../Predictions/Predictions';
import NewsList from '../NewsList/NewsList';
import newsAPI from '../../services/newsAPI';
import MainSpinner from '../MainSpinner/MainSpinner';

const FixtureBody = ({fixtureData, predictions}) => {
  const {url, path} = useRouteMatch();
  const [news, setNews] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect( () => {
    newsAPI.getFixtureNews(fixtureData)
      .then(articles => setNews(articles))
      .then(() => setReady(true))
  }, [fixtureData])

  return (
    <React.Fragment>
      <div className="fixture__views greenUnderline">
        <Link to={`${url}/overview`} disabled>Overview</Link>
        <Link to={`${url}/lineups`}>Line-Ups</Link>
        <Link to={`${url}/predictions`}>Predictions</Link>
        <Link to={`${url}/news`}>News</Link>

      </div>
      <div>
        <Switch>
          <Route exact path={path}>
            {fixtureData.statistics
              ? <FixtureStats statistics={fixtureData.statistics}/>
              : <FixtureCountdown startTime={fixtureData.event_date}/>
            }
          </Route>
          <Route path={`${path}/overview`}>
            {fixtureData.statistics
              ? <FixtureStats statistics={fixtureData.statistics}/>
              : <FixtureCountdown startTime={fixtureData.event_date}/>
            }
          </Route>
          <Route path={`${path}/lineups`}>
            <div className='lineups__container'>
              {fixtureData.lineups
                ? <React.Fragment>
                    <LineUps team={fixtureData.lineups[fixtureData.homeTeam.team_name]} />
                    <LineUps team={fixtureData.lineups[fixtureData.awayTeam.team_name]} />
                  </React.Fragment>
                : <FixtureCountdown startTime={fixtureData.event_date}/>
              }
            </div>
          </Route>
          <Route path={`${path}/predictions`}>
            <Predictions predictions={predictions} />
          </Route>
          <Route path={`${path}/news`}>
            {ready
              ?
              <>
                <h2>Latest News</h2>
                <NewsList news={news.slice(0, 4)} />
                <br />
              </>
              :
              <MainSpinner />
            }
          </Route>


        </Switch>
      </div>
    </React.Fragment>
  );
}

export default FixtureBody;
