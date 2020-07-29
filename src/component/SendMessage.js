import React from "react";
import style from "styled-components";
import { Input } from "semantic-ui-react";

const MessageWrapper = style.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

export default ({ channelName }) => (
  <MessageWrapper>
    <Input fluid placeholder={`Message #${channelName}`} />
  </MessageWrapper>
);
