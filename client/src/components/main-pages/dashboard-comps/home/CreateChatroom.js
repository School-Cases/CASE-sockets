import { If } from "../../../../utils/If";
import { useState, useEffect } from "react";

import { post, get } from "../../../../utils/http";

export const CreateChatroom = ({
  fetchChatrooms,
  setCreateChatroom,
  createChatroom,
  user,
  //   setNewRoomName,
  //   setNewRoomTheme,
  //   newRoomTheme,
  //   setNewRoomMembers,
  //   addableUsers,
  //   fetchCreateChatroom,
}) => {
  const [loading, setLoading] = useState(true);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomTheme, setNewRoomTheme] = useState(0);
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
    <section>
      <button onClick={() => setCreateChatroom(false)}>back</button>
      <h3>create a chatrum</h3>
      <input
        type="text"
        name="name"
        onChange={(e) => setNewRoomName(e.target.value)}
      />
      <input type="text" name="theme" value={newRoomTheme} />

      <div>color:</div>
      <div className="flex">
        <div onClick={() => setNewRoomTheme(0)}>röd</div>
        <div onClick={() => setNewRoomTheme(1)}>grön</div>
        <div onClick={() => setNewRoomTheme(2)}>blå</div>
        <div onClick={() => setNewRoomTheme(3)}>orange</div>
        <div onClick={() => setNewRoomTheme(4)}>svart</div>
      </div>

      <label htmlFor="">add ppl:</label>
      <input
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
      <button onClick={() => fetchCreateChatroom()}>create it</button>
    </section>
  );
};

//   m.name.includes(searchUsersInput) ? (
//     <div
//       onClick={() =>
//         setNewRoomMembers((prev) => {
//           return [...prev, m._id];
//         })
//       }
//     >
//       {m.name} <span>+</span>
//     </div>
//   ) : null;
