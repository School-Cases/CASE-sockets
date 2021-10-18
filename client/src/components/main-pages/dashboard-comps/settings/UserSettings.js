import { useState, useEffect } from "react";
import { api_address, post } from "../../../../utils/http";

export const UserSettings = ({ user }) => {
  console.log(user);

  const [avatar, setAvatar] = useState(user.avatar);
  const [theme, setTheme] = useState(user.theme);
  const [name, setName] = useState(user.name);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const fetchUpdateUser = async () => {
    let res = await post(`/update-user/${user._id}`, {
      name: name,
      newPassword: newPassword,
      currentPassword: currentPassword,
      avatar: avatar,
      theme: theme,
    });
    console.log(res);
  };
  return (
    <div>
      <div className="user-settings-input-con">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          name="name"
          id=""
          placeholder={user.name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="user-settings-input-con">
        <label htmlFor="newPassword">New password:</label>
        <input
          type="password"
          name="newPassword"
          id=""
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="user-settings-input-con">
        <label htmlFor="password">Current password:</label>
        <input
          type="password"
          name="password"
          id=""
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      <div className="flex user-settings-input-con">
        <label htmlFor="avatar">Avatar:</label>
        <div>avatarImg</div>
        <div>avatarImg2</div>
        <div>avatarImg3</div>
      </div>
      <div className="flex user-settings-input-con">
        <label htmlFor="theme">Theme:</label>
        <div onClick={() => setTheme(0)}>theme img1</div>
        <div onClick={() => setTheme(1)}>theme img2</div>
      </div>
      <button onClick={() => fetchUpdateUser()}>save</button>
    </div>
  );
};
