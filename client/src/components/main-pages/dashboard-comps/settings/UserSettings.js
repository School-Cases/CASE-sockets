import { useState, useEffect } from "react";
import { post, get } from "../../../../utils/http";

import { If } from "../../../../utils/If";

import avatars from "../../../../utils/avatars";

import styled from "styled-components";

const StyledDiv = styled("div")`
  background-image: url(../avatars/${(props) => props.img});
`;

export const UserSettings = ({ fetchAgain, setFetchAgain }) => {
  const [loading, setLoading] = useState(true);

  // <StyledDiv
  //                 img={avatar[0]}
  //                 className="chosen-avatar"
  //               ></StyledDiv>
  //               <button onClick={() => setAvatarSwitch(!avatarSwitch)}>
  //                 byt
  //               </button>

  const [avatarSwitch, setAvatarSwitch] = useState(false);

  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [theme, setTheme] = useState(null);
  const [name, setName] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const fetchUser = async (signal) => {
    let res = await get(`/protected/get-user`, signal);
    setUser(res.data);
    setName(res.data.name);
    setAvatar([res.data.avatar, 0]);
    setTheme(res.data.theme);
    setLoading(false);
  };

  const fetchUpdateUser = async () => {
    let res = await post(`/protected/update-user/${user._id}`, {
      name: name,
      newPassword: newPassword,
      currentPassword: currentPassword,
      avatar: avatar[0],
      avatarChange: avatar[1],
      theme: theme,
    });
    console.log(res);
    setFetchAgain(!fetchAgain);
  };

  useEffect(async () => {
    const abortController = new AbortController();
    await fetchUser(abortController.signal);
    return () => abortController.abort();
  }, [fetchAgain]);

  if (loading) {
    return <h2 className="">Loading...</h2>;
  }

  return (
    <div className="col3-settings-con">
      <div className="user-settings-input-con">
        <label className="user-settings-text" htmlFor="name">
          Name:
        </label>
        <input
          className="user-settings-input"
          type="text"
          name="name"
          id=""
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
          id=""
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
          id=""
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
        <label className="user-settings-text" htmlFor="avatar">Avatar:</label>
        <StyledDiv img={avatar[0]} className="chosen-avatar"></StyledDiv>
        <button className="change-avatar-button" onClick={() => setAvatarSwitch(!avatarSwitch)}>change</button>
        {console.log(avatar[0])}
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
      <button
        className="user-settings-save-button"
        onClick={() => fetchUpdateUser()}
      >
        save
      </button>
    </div>
  );
};
