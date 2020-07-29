import React, { useState, Fragment } from "react";
import decode from "jwt-decode";
import Team from "../component/Team";
import Channel from "../component/Channel";
import AddChannelModal from "../component/AddChannelModal";
import InvitePeopleModal from "../component/InvitePeopleModal";

export default ({ teams, team }) => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const toggleAddChannel = (e) => {
    if (e) {
      e.preventDefault();
    }
    setOpen(!open);
  };

  const toggleInvitePeopleModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    setOpenModal(!openModal);
  };

  let username = "";
  try {
    const token = localStorage.getItem("token");
    const { user } = decode(token);
    username = user.username;
  } catch (error) {}

  return [
    <Fragment key={`team-fragment-${team.id}`}>
      <Team key={`team-sidebar-${team.id}`} teams={teams} team={team} />
      <Channel
        key={`team-channel-${team.id}`}
        teamName={team.name}
        username={username}
        channels={team.channels}
        teamId={team.id}
        users={[
          { id: 1, name: "User-one" },
          { id: 2, name: "User-two" },
        ]}
        openAddChannelModal={toggleAddChannel}
        InvitePeopleModalClick={toggleInvitePeopleModal}
      />
      <AddChannelModal open={open} close={toggleAddChannel} teamId={team.id} />
      <InvitePeopleModal
        open={openModal}
        close={toggleInvitePeopleModal}
        teamId={team.id}
      />
    </Fragment>,
  ];
};
