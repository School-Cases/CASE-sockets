import { useState, useEffect } from "react";
import { post, get } from "../../../../utils/http";

export const UserSettings = ({ fetchAgain, setFetchAgain }) => {
  const [loading, setLoading] = useState(true);

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
    setAvatar(res.data.avatar);
    setTheme(res.data.theme);
    setLoading(false);
  };

  const fetchUpdateUser = async () => {
    await post(`/protected/update-user/${user._id}`, {
      name: name,
      newPassword: newPassword,
      currentPassword: currentPassword,
      avatar: avatar,
      theme: theme,
    });
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
    <div>
      <div className="user-settings-input-con">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          name="name"
          id=""
          placeholder={name}
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
