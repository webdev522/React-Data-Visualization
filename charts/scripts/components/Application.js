import React, {
  Component,
} from 'react';
import _ from 'lodash';
import {
  Col,
  Grid,
  Row,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.min.css';
import 'react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css';
import '../../styles/default.css';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import Charts from './Charts';
import stats from '../utils/stats';

class Application extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      page: 'summary',
      sidebar: {
        toggled: true,
      },
      filter: {
        disabled: true,
        from: process.env.START_DATE,
        to: process.env.END_DATE,
        subregionId: 'all',
        countryId: 'all',
      },
    };

    this.onStatsLoaded = this.onStatsLoaded.bind(this);
    this.onSidebarToggle = this.onSidebarToggle.bind(this);
    this.onEconomyChange = this.onEconomyChange.bind(this);
    this.onNavigationChange = this.onNavigationChange.bind(this);
  }

  componentDidMount() {
    stats.load().then(() => this.onStatsLoaded());
  }

  onStatsLoaded() {
    stats.slice(this.state.filter.from, this.state.filter.to);
    this.setState(_.merge(this.state,
      {
        loaded: true,
        filter: { disabled: false },
      },
    ));
  }

  onSidebarToggle() {
    this.setState(_.merge(this.state, {
      sidebar: {
        toggled: !this.state.sidebar.toggled,
      },
    }));
  }

  onEconomyChange(data) {
    // stats.slice(data.from, data.to);
    this.setState(_.merge(this.state, { filter: data }));
  }

  onNavigationChange(page) {
    this.setState({ page });
  }

  render() {
    return (
      <div>
        <Sidebar
          filter={this.state.filter}
          sidebar={this.state.sidebar}
          onEconomyChange={this.onEconomyChange}
        />
        <div className={`wrapper ${this.state.sidebar.toggled ? 'wrapper-hidden' : 'wrapper-shown'}`}>
          <Navigation
            onSidebarToggle={this.onSidebarToggle}
            onNavigationChange={this.onNavigationChange}
            toggled={this.state.sidebar.toggled}
          />
          <Grid fluid className="content">
            <Row>
              <Col>
                <Charts
                  filter={this.state.filter}
                  page={this.state.page}
                />
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Application;
