import React, {
  Component,
} from 'react';
import {
  Navbar,
  Nav,
  NavItem,
  Glyphicon,
} from 'react-bootstrap';

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      key: 'summary',
    };
    this.onToggle = this.onToggle.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  onToggle() {
    this.props.onSidebarToggle();
  }

  onSelect(key) {
    this.setState(
      { key },
      () => this.props.onNavigationChange(key),
    );
  }

  render() {
    return (
      <Navbar
        staticTop
        inverse
        fluid
        className={`navigation navbar ${this.props.toggled ? 'navbar-hidden' : 'navbar-shown'}`}
      >
        <a className="navigation-sidebar-toggle" href="#" onClick={this.onToggle}>
          <Glyphicon glyph="menu-hamburger" />
        </a>
        <Nav activeKey={this.state.key} onSelect={this.onSelect}>
          <NavItem eventKey={'summary'} href="#">Summary</NavItem>
          <NavItem eventKey={'asn'} href="#">ASN</NavItem>
          <NavItem eventKey={'ipv4'} href="#">IPv4</NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default Navigation;
