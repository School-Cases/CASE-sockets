import { If } from "../../../../utils/If";
import { useState, useEffect } from "react";

import { post, get } from "../../../../utils/http";

export const CreateChatroom = ({
  fetchChatrooms,
  setCreateChatroom,
  createChatroom,
  user,
}) => {
  const [loading, setLoading] = useState(true);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomTheme, setNewRoomTheme] = useState("#FA0000");
  const [newRoomMembers, setNewRoomMembers] = useState([user._id]);
  const [addableUsers, setAddableUsers] = useState([]);
  const [searchUsersInput, setSearchUsersInput] = useState("");

  const fetchAllUsers = async (signal) => {
    let res = await get(`/protected/get-all-users`, signal);

    setAddableUsers(res.data);
    setLoading(false);
  };

  const fetchCreateChatroom = async () => {
    await post(`/protected/create-chatroom`, {
      name: newRoomName,
      admins: [user._id],
      members: newRoomMembers,
      theme: newRoomTheme,
    });
    setCreateChatroom(false);
    const abortController = new AbortController();
    fetchChatrooms(abortController.signal, user._id);
    return () => abortController.abort();
  };

  useEffect(async () => {
    const abortController = new AbortController();
    if (createChatroom) await fetchAllUsers(abortController.signal);
    return () => abortController.abort();
  }, [createChatroom]);

  if (loading) {
    <h4>loading ...</h4>;
  }

  return (
    <section className="dashboard-con-create-con">
      <div className="flex create-con-top">
        <h3>create chatroom</h3>
        <button
          className="create-con-button-back"
          onClick={() => setCreateChatroom(false)}
        >
          back
        </button>
      </div>

      <div className="create-con-name">
        <label htmlFor="" className="create-con-text">
          Name:
        </label>

        <input
          className="create-con-input-text"
          type="text"
          name="name"
          onChange={(e) => setNewRoomName(e.target.value)}
        />
      </div>

      <input type="text" name="theme" value={newRoomTheme} hidden />

      <div className="create-con-text">color:</div>
      <div className="flex">
        <div onClick={() => setNewRoomTheme("#A2DC68")}>greenC</div>
        <div onClick={() => setNewRoomTheme("#68DCC4")}>blueC</div>
        <div onClick={() => setNewRoomTheme("#DC68D0")}>purpleC</div>
        <div onClick={() => setNewRoomTheme("#D8DC68")}>yellowC</div>
      </div>

      <input
        className="create-con-color-picker"
        type="color"
        onChange={(e) => setNewRoomTheme(e.target.value)}
      />

      <label className="create-con-text" htmlFor="">
        add ppl:
      </label>
      <input
        className="create-con-input-text"
        type="text"
        placeholder="search user"
        onChange={(e) => setSearchUsersInput(e.target.value)}
      />
      <div className="flex">
        <If condition={searchUsersInput !== ""}>
          {addableUsers.map((m) => {
            return (
              <If condition={m.name.includes(searchUsersInput)}>
                <div
                  onClick={() =>
                    setNewRoomMembers((prev) => {
                      return [...prev, m._id];
                    })
                  }
                >
                  {m.name} <span>+</span>
                </div>
              </If>
            );
          })}
        </If>
      </div>
      <button
        className="create-con-button-create"
        onClick={() => fetchCreateChatroom()}
      >
        create it
      </button>
    </section>
  );
};
