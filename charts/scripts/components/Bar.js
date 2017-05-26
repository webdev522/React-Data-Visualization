import _ from 'lodash';
import React from 'react';
import {
  Panel,
  DropdownButton,
  MenuItem,
  Col,
  Grid,
  Row,
  Glyphicon,
} from 'react-bootstrap';
import {
  VictoryAxis,
  VictoryBar,
  VictoryStack,
  VictoryChart,
} from 'victory';
import theme from '../utils/theme';
import stats from '../utils/stats';

const download = (text, name, type) => {
  const a = document.createElement('a');
  const file = new Blob([text], { type });
  a.href = URL.createObjectURL(file);
  a.download = name;
  a.click();
};

const Bar = (props) => {
  const data = stats.getBarData(props.type, props.subregion, props.country);
  const bars = [];
  const min = parseInt(props.from / 10000, 10);
  const max = parseInt(props.to / 10000, 10);
  const xticks = _.map(_.range((max - min) + 1), offset => min + offset);
  let iterator = 0;

  _.each(data, (value, key) => {
    bars.push({
      key: iterator,
      name: key,
      values: value,
    });
    iterator += 1;
  });

  return (
    <Panel>
      <Grid fluid>
        <Row className="chart-header">
          <Col xs={3} >
            &nbsp;
          </Col>
          <Col xs={6} className="chart-title">
            <p>{props.title}</p>
          </Col>
          <Col xs={3} bsClass="text-right" className="chart-export">
            <DropdownButton
              noCaret
              pullRight
              className="chart-export"
              id={`export-${props.title.replace(/\s+/g, '-').toLowerCase()}`}
              title={<Glyphicon glyph="share" />}
              onSelect={(key) => {
                if (key === 'json') {
                  download(
                    JSON.stringify(data, null, 2),
                    `${props.title.replace(/\s+/g, '-').toLowerCase()}.json`,
                    'text/json',
                  );
                }
              }}
            >
              <MenuItem eventKey="json">JSON</MenuItem>
            </DropdownButton>
          </Col>
        </Row>
      </Grid>
      <VictoryChart
        theme={theme}
        domainPadding={15}
      >
        <VictoryAxis tickValues={xticks} />
        <VictoryAxis dependentAxis />
        <VictoryStack>
          {_.map(bars, bar => (
            <VictoryBar
              key={bar.key}
              name={bar.name}
              data={bar.values}
              x="year"
              y="total"
            />
          ))}
        </VictoryStack>
      </VictoryChart>
    </Panel>
  );
};

export default Bar;
