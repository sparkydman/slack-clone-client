import React from "react";
import style from "styled-components";
import { Link } from "react-router-dom";

const TeamWrapper = style.div`
  grid-column: 1;
  grid-row: 1 / 4;
  background-color: #362234;
  color: #958993;
`;
const TeamList = style.ul`
  width: 100%;
  padding-left: 0px;
  list-style: none;
`;

const TeamListItem = style.li`
  height: 50px;
  width: 50px;
  background-color: #676066;
  color: #fff;
  margin: auto;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 11px;
  &:hover {
    border-style: solid;
    border-width: thick;
    border-color: #767676;
  }
`;

const team = ({ id, letter }) => (
  <Link to={`/view-team/${id}`} key={`Team-item-${id}`}>
    <TeamListItem>{letter}</TeamListItem>
  </Link>
);
export default ({ teams }) => (
  <TeamWrapper>
    <TeamList>{teams.map(team)}</TeamList>
  </TeamWrapper>
);
