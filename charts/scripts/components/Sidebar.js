/* eslint-disable max-len */
import React from 'react';
import Links from './Links';
import Economies from './Economies';
import Filter from './Filter';

const Sidebar = props =>
  <div className={`sidebar ${props.sidebar.toggled ? 'sidebar-shown' : 'sidebar-hidden'}`}>
    <div className="sidebar-header" />
    <Economies
      filter={props.filter}
      onEconomyChange={props.onEconomyChange}
    />
    <Filter
      filter={props.filter}
      onFilterApply={props.onFilterApply}
    />
    <Links />
  </div>;

export default Sidebar;
