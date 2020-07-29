import React from "react";
import AppLayout from "../component/AppLayout";
import Header from "../component/Header";
import Message from "../component/Message";
import SendMessage from "../component/SendMessage";
import Sidebar from "../container/Sidebar";
import { graphql } from "react-apollo";
import { allTeamsQuery } from "../graphql/team";
import findIndex from "lodash/findIndex";
import { Redirect } from "react-router-dom";

const ViewTeam = ({
  match: {
    params: { teamId, channelId },
  },
  data: { loading, allTeams, invitedTeams },
}) => {
  if (loading) {
    return null;
  }
  // console.log(allTeams);s
  const teams = [...allTeams, ...invitedTeams];

  if (!teams.length) {
    return <Redirect to="/create-team" />;
  }

  const teamIdInt = parseInt(teamId, 10);
  let teamIdx;
  if (!Number.isNaN(teamIdInt)) {
    teamIdx = findIndex(teams, ["id", teamIdInt]);
  } else {
    teamIdx = 0;
  }
  const team = teamIdx === -1 ? teams[0] : teams[teamIdx];
  const channelIdInt = parseInt(channelId, 10);
  let channelIdx;
  if (!Number.isNaN(channelIdInt)) {
    channelIdx = findIndex(team.channels, ["id", channelIdInt]);
  } else {
    channelIdx = 0;
  }
  const channel =
    channelIdx === -1 ? team.channels[0] : team.channels[channelIdx];

  return (
    <AppLayout className="app-layout">
      <Sidebar
        teams={teams.map((t) => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
        team={team}
      />
      {channel && <Header channelName={channel.name} />}
      {channel && (
        <Message channelId={channel.id}>
          <ul className="message-list">
            <li></li>
            <li></li>
          </ul>
        </Message>
      )}
      {channel && <SendMessage channelName={channel.name} />}
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
