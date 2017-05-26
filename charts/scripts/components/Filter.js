import React, {
  Component,
} from 'react';
import DateTimeField from 'react-bootstrap-datetimepicker';
import moment from 'moment';
import {
  Button,
  Col,
  ControlLabel,
  Form,
  FormGroup,
  Grid,
} from 'react-bootstrap';
import stats from '../utils/stats';

class Filter extends Component {

  constructor(props) {
    super(props);

    this.state = {
      from: this.props.filter.from,
      to: this.props.filter.to,
    };

    this.onFromChange = this.onFromChange.bind(this);
    this.onToChange = this.onToChange.bind(this);
    this.onApplyClick = this.onApplyClick.bind(this);
  }

  onFromChange(date) {
    this.setState({ from: date });
  }

  onToChange(date) {
    this.setState({ to: date });
  }

  onApplyClick() {
    this.props.onFilterApply(this.state);
  }

  render() {
    return (
      <Grid fluid className="filter">
        <Form horizontal>
          <FormGroup controlId="filterFrom">
            <Col componentClass={ControlLabel} xs={3}>From:</Col>
            <Col xs={9}>
              <DateTimeField
                id="dateFrom"
                mode="date"
                viewMode="years"
                showToday={false}
                format="YYYYMMDD"
                inputFormat="YYYYMMDD"
                minDate={moment(String(stats.start), 'YYYYMMDD')}
                maxDate={moment(String(stats.end), 'YYYYMMDD')}
                dateTime={this.state.from}
                onChange={this.onFromChange}
                disabled={this.props.filter.disabled}
              />
            </Col>
          </FormGroup>
          <FormGroup controlId="filterTo">
            <Col componentClass={ControlLabel} xs={3}>To:</Col>
            <Col xs={9}>
              <DateTimeField
                id="dateTo"
                mode="date"
                viewMode="years"
                showToday={false}
                format="YYYYMMDD"
                inputFormat="YYYYMMDD"
                minDate={moment(String(stats.start), 'YYYYMMDD')}
                maxDate={moment(String(stats.end), 'YYYYMMDD')}
                dateTime={this.state.to}
                onChange={this.onToChange}
                disabled={this.props.filter.disabled}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col md={12}>
              <Button
                disabled={this.props.filter.disabled}
                onClick={this.onApplyClick}
                block
              >
                Apply
              </Button>
            </Col>
          </FormGroup>
        </Form>
      </Grid>
    );
  }
}

export default Filter;
