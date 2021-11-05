import { useState, useEffect } from "react";

import { If } from "../../../../utils/If";

import { SettingsChatroom } from "./SettingsChatroom";

import styled from "styled-components";
const StyledSection = styled("section")`
  background: linear-gradient(
    235deg,
    ${(props) => props.theme} 25%,
    rgba(255, 255, 255, 1) 25%
  );
`;

export const SettingsCol2 = ({
  ws,
  user,
  userChatrooms,
  setChatroomUpdated,
}) => {
  // states
  const [activeChatroom, setActiveChatroom] = useState(null);
  const [searchChatrooms, setSearchChatrooms] = useState("");

  const [updateMessage, setUpdateMessage] = useState(null);

  // useEffects
  useEffect(() => {
    if (updateMessage) setTimeout(() => setUpdateMessage(null), 4000);
  }, [updateMessage]);

  return (
    <section className="flex height100 dash-settings-chatrooms">
      <section className="flex search-chatroom-con">
        <input
          type="text"
          placeholder="search chatrooms"
          onInput={(e) => setSearchChatrooms(e.target.value)}
        />
      </section>
      {userChatrooms.map((room) => {
        return (
          <If condition={room.name.includes(searchChatrooms)}>
            <StyledSection
              theme={room.theme}
              className={`col2-chatroom-con ${
                activeChatroom === room ? "active" : ""
              }`}
              onClick={() => {
                setActiveChatroom(room);
              }}
            >
              <h5 className="flex">
                {room.name}
                <If condition={room.admins.includes(user._id)}>
                  <span>A</span>
                </If>
              </h5>
              <If condition={updateMessage}>
                <div>{updateMessage}</div>
              </If>
              <If condition={room === activeChatroom}>
                <SettingsChatroom
                  ws={ws}
                  user={user}
                  room={room}
                  activeChatroom={activeChatroom}
                  setChatroomUpdated={setChatroomUpdated}
                  setUpdateMessage={setUpdateMessage}
                />
              </If>
            </StyledSection>
          </If>
        );
      })}
    </section>
  );
};
