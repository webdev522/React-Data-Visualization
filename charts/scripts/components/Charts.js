import React, {
  Component,
} from 'react';
import {
  Col,
  Grid,
  Row,
  Panel,
  ProgressBar,
} from 'react-bootstrap';
import Bar from './Bar';
import Pie from './Pie';

class Charts extends Component {

  constructor(props) {
    super(props);

    this.state = {
      page: this.props.page,
      from: this.props.filter.from,
      to: this.props.filter.to,
      disabled: this.props.filter.disabled,
      subregionId: this.props.filter.subregionId,
      countryId: this.props.filter.countryId,
    };

    this.getCharts = this.getCharts.bind(this);
    this.getAllCharts = this.getAllCharts.bind(this);
    this.invalid = false;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      page: nextProps.page,
      disabled: nextProps.filter.disabled,
      from: nextProps.filter.from,
      to: nextProps.filter.to,
      subregionId: nextProps.filter.subregionId,
      countryId: nextProps.filter.countryId,
    });
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.filter.disabled !== this.state.disabled ||
      nextProps.filter.subregionId !== this.state.subregionId ||
      nextProps.filter.countryId !== this.state.countryId ||
      nextProps.filter.from !== this.state.from ||
      nextProps.filter.to !== this.state.to ||
      nextProps.page !== this.state.page
    ) {
      return true;
    }
    return false;
  }

  componentWillUpdate(nextProps) {
    this.invalid = false;
    if (nextProps.filter.from > nextProps.filter.to) this.invalid = true;
  }

  getCharts() {
    if (this.state.disabled) {
      return (
        <Grid fluid className="loading-wrapper">
          <Panel>
            <ProgressBar className="loading" active now={100} label="Loading data..." />
          </Panel>
        </Grid>
      );
    } else if (this.invalid) {
      return (
        <Grid fluid>Invalid input.</Grid>
      );
    } else if (this.state.subregionId === 'all') {
      return this.getAllCharts();
    } else if (this.state.countryId === 'all') {
      return this.getSubregionCharts();
    }
    return this.getCountryCharts();
  }

  getAllCharts() {
    if (this.state.page === 'summary') {
      return (
        <Grid fluid>
          <Row>
            <Col xs={12} sm={6} md={6} className="chart-column">
              <Bar
                title="ASN Total by Year"
                type="asn"
                subregion={this.state.subregionId}
                country={this.state.countryId}
                from={this.state.from}
                to={this.state.to}
              />
            </Col>
            <Col xs={12} sm={6} md={6} className="chart-column">
              <Pie
                title="ASN by Subregion"
                type="asn"
                subregion="all"
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={6} md={6} className="chart-column">
              <Bar
                title="IPv4 Total by Year"
                type="ipv4"
                subregion={this.state.subregionId}
                country={this.state.countryId}
                from={this.state.from}
                to={this.state.to}
              />
            </Col>
            <Col xs={12} sm={6} md={6} className="chart-column">
              <Pie
                title="IPv4 by Subregion"
                type="ipv4"
                subregion="all"
              />
            </Col>
          </Row>
        </Grid>
      );
    } else if (this.state.page === 'asn') {
      return (
        <Grid fluid>
          <Row>
            <Col xs={12} sm={6} md={6} className="chart-column">
              <Bar
                title="ASN Total by Year"
                type="asn"
                subregion={this.state.subregionId}
                country={this.state.countryId}
                from={this.state.from}
                to={this.state.to}
              />
            </Col>
            <Col xs={12} sm={6} md={6} className="chart-column">
              <Pie
                title="ASN by Subregion"
                type="asn"
                subregion="all"
              />
            </Col>
          </Row>
        </Grid>
      );
    } else if (this.state.page === 'ipv4') {
      return (
        <Grid fluid>
          <Row>
            <Col xs={12} sm={6} md={6} className="chart-column">
              <Bar
                title="IPv4 Total by Year"
                type="ipv4"
                subregion={this.state.subregionId}
                country={this.state.countryId}
                from={this.state.from}
                to={this.state.to}
              />
            </Col>
            <Col xs={12} sm={6} md={6} className="chart-column">
              <Pie
                title="IPv4 by Subregion"
                type="ipv4"
                subregion="all"
              />
            </Col>
          </Row>
        </Grid>
      );
    }
  }

  getSubregionCharts() {
    if (this.state.page === 'summary') {
      return (
        <Grid fluid>
          <Row>
            <Col xs={12} sm={6} md={6} className="chart-column">
              <Bar
                title="ASN Total by Year"
                type="asn"
                subregion={this.state.subregionId}
                country={this.state.countryId}
                from={this.state.from}
                to={this.state.to}
              />
            </Col>
            <Col xs={12} sm={6} md={6} className="chart-column">
              <Pie
                title="ASN by Economy"
                type="ipv4"
                subregion={this.state.subregionId}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={6} md={6} className="chart-column">
              <Bar
                title="IPv4 Total by Year"
                type="ipv4"
                subregion={this.state.subregionId}
                country={this.state.countryId}
                from={this.state.from}
                to={this.state.to}
              />
            </Col>
            <Col xs={12} sm={6} md={6} className="chart-column">
              <Pie
                title="IPv4 by Economy"
                type="ipv4"
                subregion={this.state.subregionId}
              />
            </Col>
          </Row>
        </Grid>
      );
    } else if (this.state.page === 'asn') {
      return (
        <Grid fluid>
          <Row>
            <Col xs={12} sm={6} md={6} className="chart-column">
              <Bar
                title="ASN Total by Year"
                type="asn"
                subregion={this.state.subregionId}
                country={this.state.countryId}
                from={this.state.from}
                to={this.state.to}
              />
            </Col>
            <Col xs={12} sm={6} md={6} className="chart-column">
              <Pie
                title="ASN by Economy"
                type="asn"
                subregion={this.state.subregionId}
              />
            </Col>
          </Row>
        </Grid>
      );
    } else if (this.state.page === 'ipv4') {
      return (
        <Grid fluid>
          <Row>
            <Col xs={12} sm={6} md={6} className="chart-column">
              <Bar
                title="IPv4 Total by Year"
                type="ipv4"
                subregion={this.state.subregionId}
                country={this.state.countryId}
                from={this.state.from}
                to={this.state.to}
              />
            </Col>
            <Col xs={12} sm={6} md={6} className="chart-column">
              <Pie
                title="IPv4 by Economy"
                type="ipv4"
                subregion={this.state.subregionId}
              />
            </Col>
          </Row>
        </Grid>
      );
    }
  }

  getCountryCharts() {
    if (this.state.page === 'summary') {
      return (
        <Grid fluid>
          <Row>
            <Col xs={12} sm={6} md={6} className="chart-column">
              <Bar
                title="ASN Total by Year"
                type="asn"
                subregion={this.state.subregionId}
                country={this.state.countryId}
                from={this.state.from}
                to={this.state.to}
              />
            </Col>
            <Col xs={12} sm={6} md={6} className="chart-column">
              <Bar
                title="IPv4 Total by Year"
                type="ipv4"
                subregion={this.state.subregionId}
                country={this.state.countryId}
                from={this.state.from}
                to={this.state.to}
              />
            </Col>
          </Row>
        </Grid>
      );
    } else if (this.state.page === 'asn') {
      return (
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} className="chart-column">
              <Bar
                type="asn"
                subregion={this.state.subregionId}
                country={this.state.countryId}
                from={this.state.from}
                to={this.state.to}
              />
            </Col>
          </Row>
        </Grid>
      );
    } else if (this.state.page === 'ipv4') {
      return (
        <Grid fluid>
          <Row>
            <Col xs={12} sm={12} md={12} className="chart-column">
              <Bar
                type="ipv4"
                subregion={this.state.subregionId}
                country={this.state.countryId}
                from={this.state.from}
                to={this.state.to}
              />
            </Col>
          </Row>
        </Grid>
      );
    }
  }

  render() {
    return this.getCharts();
  }

}

export default Charts;
