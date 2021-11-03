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

export const SettingsCol2 = ({ ws, user, userChatrooms }) => {
  // states
  const [activeChatroom, setActiveChatroom] = useState(null);
  const [searchChatrooms, setSearchChatrooms] = useState("");

  return (
    <section className="flex dash-settings-chatrooms">
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
              className="col2-chatroom-con"
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
              <If condition={room === activeChatroom}>
                <SettingsChatroom
                  ws={ws}
                  user={user}
                  room={room}
                  activeChatroom={activeChatroom}
                />
              </If>
            </StyledSection>
          </If>
        );
      })}
    </section>
  );
};
