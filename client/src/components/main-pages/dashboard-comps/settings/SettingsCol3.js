import { useState, useEffect } from "react";

import { post } from "../../../../utils/http";
import { If } from "../../../../utils/If";
import avatars from "../../../../utils/avatars";

import styled from "styled-components";
const StyledDiv = styled("div")`
  background-image: url(../avatars/${(props) => props.img});
`;

export const SettingsCol3 = ({ user, setUserUpdated, avatarSwitch, setAvatarSwitch }) => {
  // states
  const [avatar, setAvatar] = useState([user.avatar, 0]);
  // const [avatarSwitch, setAvatarSwitch] = useState(false);
  const [theme, setTheme] = useState(user.theme);
  const [name, setName] = useState(user.name);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [updateMessage, setUpdateMessage] = useState(null);

  // fetches
  const fetchUpdateUser = async () => {
    let res = await post(`/protected/update-user/${user._id}`, {
      name: name,
      newPassword: newPassword,
      currentPassword: currentPassword,
      avatar: avatar[0],
      avatarChange: avatar[1],
      theme: theme,
    });
    setUserUpdated(true);
    setAvatarSwitch(false);
    setUpdateMessage(res.message);
  };

  // useEffects
  useEffect(() => {
    if (updateMessage) setTimeout(() => setUpdateMessage(null), 4000);
  }, [updateMessage]);

  return (
    <div className="height100 col3-settings-con">
      <div className="user-settings-input-con">
        <label className="user-settings-text" htmlFor="name">
          Name:
        </label>
        <input
          className="user-settings-input"
          type="text"
          name="name"
          placeholder={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="user-settings-input-con">
        <label className="user-settings-text" htmlFor="newPassword">
          New password:
        </label>
        <input
          className="user-settings-input"
          type="password"
          name="newPassword"
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="user-settings-input-con">
        <label className="user-settings-text" htmlFor="password">
          Current password:
        </label>
        <input
          className="user-settings-input"
          type="password"
          name="password"
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      <div className="flex user-settings-input-con">
        <label className="user-settings-text" htmlFor="theme">
          Theme:
        </label>
        <div className="flex user-settings-themes">
          <div
            className="user-settings-theme-1"
            onClick={() => setTheme(0)}
          ></div>
          <div
            className="user-settings-theme-2"
            onClick={() => setTheme(1)}
          ></div>
        </div>
      </div>
      

      <div className="flex user-settings-input-con">
        <label className="user-settings-text" htmlFor="avatar">
          Avatar:
        </label>
        <StyledDiv img={avatar[0]} className="chosen-avatar"></StyledDiv>
        <button
          className="change-avatar-button"
          onClick={() => setAvatarSwitch(!avatarSwitch)}
        >
          Change{" "}
          <If condition={!avatarSwitch}>
            <i class="fas fa-caret-down"></i>
          </If>
          <If condition={avatarSwitch}>
            <i class="fas fa-caret-up"></i>
          </If>
        </button>
      </div>
      <If condition={avatarSwitch}>
        <div className="flex avatars-con">
          {avatars.map((a) => {
            return (
              <StyledDiv
                img={a}
                className={`avatars ${a === avatar[0] ? "current-avatar" : ""}`}
                onClick={() => setAvatar([a, 1])}
              ></StyledDiv>
            );
          })}
        </div>
      </If>
      <div className="flex user-settings-save-con">
        <button
          className="user-settings-save-button"
          onClick={() => fetchUpdateUser()}
        >
          SAVE
        </button>
        
      </div>
      <If condition={updateMessage}>
          <div>{updateMessage} <i className="fas fa-check"></i></div>
        </If>
    </div>
  );
};
