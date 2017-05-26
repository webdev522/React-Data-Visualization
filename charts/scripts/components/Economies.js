/* eslint-disable max-len */
// import _ from 'lodash';
import React, {
  Component,
} from 'react';
import {
  Accordion,
  Panel,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import economies from '../utils/economies';

class Economies extends Component {

  constructor(props) {
    super(props);

    this.data = {
      subregionId: this.props.filter.subregionId,
      countryId: this.props.filter.countryId,
      panels: [
        { collapsed: true, sign: '+' },
        { collapsed: true, sign: '+' },
        { collapsed: true, sign: '+' },
        { collapsed: true, sign: '+' },
      ],
    };

    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(subregionId, countryId) {
    this.data.subregionId = subregionId;
    this.data.countryId = countryId;
    if (countryId === 'all') {
      if (subregionId === 'all') {
        for (let i = 0; i < this.data.panels.length; i += 1) {
          this.data.panels[i].collapsed = true;
        }
      } else if (subregionId === 'eastern asia') {
        this.data.panels[0].collapsed = !this.data.panels[0].collapsed;
        this.data.panels[1].collapsed = true;
        this.data.panels[2].collapsed = true;
        this.data.panels[3].collapsed = true;
      } else if (subregionId === 'south-eastern asia') {
        this.data.panels[0].collapsed = true;
        this.data.panels[1].collapsed = !this.data.panels[1].collapsed;
        this.data.panels[2].collapsed = true;
        this.data.panels[3].collapsed = true;
      } else if (subregionId === 'oceania') {
        this.data.panels[0].collapsed = true;
        this.data.panels[1].collapsed = true;
        this.data.panels[2].collapsed = !this.data.panels[2].collapsed;
        this.data.panels[3].collapsed = true;
      } else if (subregionId === 'southern asia') {
        this.data.panels[0].collapsed = true;
        this.data.panels[1].collapsed = true;
        this.data.panels[2].collapsed = true;
        this.data.panels[3].collapsed = !this.data.panels[3].collapsed;
      }
      for (let i = 0; i < this.data.panels.length; i += 1) {
        if (this.data.panels[i].collapsed === true) {
          this.data.panels[i].sign = '+';
        } else {
          this.data.panels[i].sign = '-';
        }
      }
    }
    this.props.onEconomyChange(this.data);
  }

  render() {
    const southernAsia = economies[1].countries.map(c => (
      <ListGroupItem
        key={c.id}
        onClick={() => this.onSelect('southern asia', c.id)}
      >
        {c.label}
      </ListGroupItem>
    ));
    const oceania = economies[2].countries.map(c => (
      <ListGroupItem
        key={c.id}
        onClick={() => this.onSelect('oceania', c.id)}
      >
        {c.label}
      </ListGroupItem>
    ));
    const southEasternAsia = economies[3].countries.map(c => (
      <ListGroupItem
        key={c.id}
        onClick={() => this.onSelect('south-eastern asia', c.id)}
      >
        {c.label}
      </ListGroupItem>
    ));
    const easternAsia = economies[4].countries.map(c => (
      <ListGroupItem
        key={c.id}
        onClick={() => this.onSelect('eastern asia', c.id)}
      >
        {c.label}
      </ListGroupItem>
    ));
    return (
      <Accordion className="sidebar-economies" >
        <Panel
          className="sidebar-economies-level-one"
          collapsible={false}
          eventKey={1}
          header={
            <span className="sidebar-panel-heading">
              <span>APNIC</span>
            </span>
          }
          onSelect={() => this.onSelect('all', 'all')}
        />
        <Panel
          className="sidebar-economies-level-two"
          header={
            <span className="sidebar-panel-heading">
              <span>Eastern Asia</span>
              <span className="sidebar-plus">{this.data.panels[0].sign}</span>
            </span>
          }
          eventKey={2}
          onSelect={() => this.onSelect('eastern asia', 'all')}
        >
          <ListGroup fill>{easternAsia}</ListGroup>
        </Panel>
        <Panel
          className="sidebar-economies-level-two"
          header={
            <span className="sidebar-panel-heading">
              <span>South-Eastern Asia</span>
              <span className="sidebar-plus">{this.data.panels[1].sign}</span>
            </span>
          }
          eventKey={3}
          onSelect={() => this.onSelect('south-eastern asia', 'all')}
        >
          <ListGroup fill>{southEasternAsia}</ListGroup>
        </Panel>
        <Panel
          className="sidebar-economies-level-two"
          header={
            <span className="sidebar-panel-heading">
              <span>Oceania</span>
              <span className="sidebar-plus">{this.data.panels[2].sign}</span>
            </span>
          }
          eventKey={4}
          onSelect={() => this.onSelect('oceania', 'all')}
        >
          <ListGroup fill>{oceania}</ListGroup>
        </Panel>
        <Panel
          className="sidebar-economies-level-two"
          header={
            <span className="sidebar-panel-heading">
              <span>Southern Asia</span>
              <span className="sidebar-plus">{this.data.panels[3].sign}</span>
            </span>
          }
          eventKey={5}
          onSelect={() => this.onSelect('southern asia', 'all')}
        >
          <ListGroup fill>{southernAsia}</ListGroup>
        </Panel>
      </Accordion>
    );
  }
}

export default Economies;
