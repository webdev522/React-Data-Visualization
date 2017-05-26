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
  VictoryPie,
  VictoryTooltip,
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

const Pie = (props) => {
  const data = stats.getPieData(props.type, props.subregion);
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
      <VictoryPie
        data={data}
        labelComponent={<VictoryTooltip />}
        theme={theme}
        width={400}
        height={250}
        x="label"
        y="total"
      />
    </Panel>
  );
};

export default Pie;
