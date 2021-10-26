import { useState, useEffect } from "react";
import { get, post } from "../../../../utils/http";

import { If } from "../../../../utils/If";

import styled from "styled-components";

// import { Chatroom } from "./oneChatSettings";

const StyledSection = styled("section")`
  background: linear-gradient(
    235deg,
    ${(props) => props.theme} 25%,
    rgba(255, 255, 255, 1) 25%
  );
`;

export const ChatroomsSettings = ({
  // user,
  // userChatrooms,
  searchChatrooms,
  setFetchAgain,
  fetchAgain,
  // setActiveChatroom,
  // activeChatroom,
  ws,
}) => {
  const [user, setUser] = useState(null);

  const [activeChatroom, setActiveChatroom] = useState(null);

  const [loading, setLoading] = useState(true);

  const [userChatrooms, setUserChatrooms] = useState([]);

  // const [isAdmin, setIsAdmin] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [roomMembers, setRoomMembers] = useState([]);
  const [roomAdmins, setRoomAdmins] = useState([]);
  const [roomTheme, setRoomTheme] = useState(null);

  const [notRoomMembers, setNotRoomMembers] = useState([]);

  const [searchUsersInput, setSearchUsersInput] = useState("");

  const fetchUser = async (signal) => {
    let res = await get(`/protected/get-user`, signal);
    setUser(res.data);
    // setFetchAgain(!fetchAgain);
    await fetchChatrooms(signal, res.data._id);
  };

  const fetchChatrooms = async (signal, userID) => {
    let res = await get(`/protected/get-all-chatrooms`, signal);
    setUserChatrooms(
      res.data
        .filter((chat) => chat.members.includes(userID))
        .sort((chatA, chatB) => {
          return (
            chatB.starmarked.includes(userID) -
            chatA.starmarked.includes(userID)
          );
        })
    );
    setLoading(false);
  };

  const fetchAllUsers = async (signal, activeRoom) => {
    console.log("3", activeRoom);
    let res = await get(`/protected/get-all-users`, signal);
    console.log(
      "4",
      res.data.filter((u) => activeRoom.admins.includes(u._id))
    );
    setRoomMembers(
      res.data
        .filter((u) => activeRoom.members.includes(u._id))
        .sort((a, b) => {
          return (
            activeRoom.admins.includes(b._id) -
            activeRoom.admins.includes(a._id)
          );
        })
    );
    setNotRoomMembers(
      res.data.filter((u) => !activeRoom.members.includes(u._id))
    );

    setRoomAdmins(res.data.filter((u) => activeRoom.admins.includes(u._id)));
    // setNotRoomAdmins(res.data.filter((u) => !room.admins.includes(u._id)));
  };

  const fetchUpdateChatroom = async (roomId) => {
    let newRoomAdmins = [];
    roomAdmins.forEach((a) => {
      newRoomAdmins.push(a._id);
    });

    let newRoomMembers = [];
    roomMembers.forEach((m) => newRoomMembers.push(m._id));

    let newRoomTheme;
    if (roomTheme === null) {
      newRoomTheme = activeChatroom.theme;
    } else {
      newRoomTheme = roomTheme;
    }

    let newRoomName;
    if (roomName === null) {
      newRoomName = activeChatroom.name;
    } else {
      newRoomName = roomName;
    }

    // if (roomName === null) {
    //   setRoomName()
    // }

    await post(`/protected/update-chatroom/` + roomId, {
      name: newRoomName,
      admins: newRoomAdmins,
      members: newRoomMembers,
      theme: newRoomTheme,
    });
    setFetchAgain(!fetchAgain);
    // ws.send(
    //   JSON.stringify({
    //     type: "roomsUpdate",
    //   })
    // );
  };

  const fetchDeleteChatroom = async (signal, roomId) => {
    let res = await get(`/protected/delete-chatroom/` + roomId, signal);
    setFetchAgain(!fetchAgain);
    ws.send(
      JSON.stringify({
        type: "roomsUpdate",
        detail: "roomDelete",
      })
    );
  };

  const fetchLeaveChatroom = async (signal, roomId) => {
    let res = await post(
      `/protected/leave-chatroom/` + roomId + "/" + user._id,
      signal
    );
    setFetchAgain(!fetchAgain);
    ws.send(
      JSON.stringify({
        type: "roomsUpdate",
        detail: "roomLeave",
        room: roomId,
        user: user._id,
      })
    );
  };

  useEffect(async () => {
    ws.onmessage = async (e) => {
      console.log(e.data);
      let theMessage = JSON.parse(e.data);
      console.log(theMessage);
      if (theMessage.type === "roomsUpdate") {
        if (theMessage.detail === "roomLeave") {
          console.log(userChatrooms);

          // console.log(
          //   userChatrooms.some((room) => {
          //     return room._id.includes(theMessage.room);
          //   })
          // );

          if (
            userChatrooms.some((room) => {
              return room._id.includes(theMessage.room);
            })
          ) {
            // if (activeChatroom._id === theMessage.room) {

            // }

            if (
              activeChatroom._id === theMessage.room &&
              theMessage.user !== user._id
            ) {
              const abortController = new AbortController();
              await fetchChatrooms(abortController.signal, user._id);
              setActiveChatroom(activeChatroom);
            } else {
              setFetchAgain(!fetchAgain);
            }
          }
          // } console.log("room update");
          // setFetchAgain(!fetchAgain);
          // const abortController = new AbortController();
          // await fetchChatrooms(abortController.signal, user._id);
          // return () => abortController.abort();
        }
      }
    };
  }, [ws.onmessage]);

  useEffect(async () => {
    const abortController = new AbortController();
    await fetchUser(abortController.signal);
    return () => abortController.abort();
  }, [fetchAgain]);

  // useEffect(async () => {
  //   const abortController = new AbortController();
  //   if (user !== null) await fetchChatrooms(abortController.signal, user._id);
  //   return () => abortController.abort();
  // }, [fetchAgain]);

  useEffect(async () => {
    const abortController = new AbortController();
    if (activeChatroom !== null)
      await fetchAllUsers(abortController.signal, activeChatroom);
    return () => abortController.abort();
  }, [activeChatroom]);

  // useEffect(() => {
  //   setIsAdmin(room.admins.includes(user._id));
  // }, []);

  if (loading) {
    return <h2 className="">Loading...</h2>;
  }

  return (
    <section className="flex dash-settings-chatrooms">
      {userChatrooms.map((room) => {
        // const StyledSection = styled.section`
        //   background: linear-gradient(
        //     235deg,
        //     ${room.theme} 25%,
        //     rgba(255, 255, 255, 1) 25%
        //   );
        // `;

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

              {/* room active */}
              <If condition={activeChatroom === room}>
                {/* admin */}
                <If condition={room.admins.includes(user._id)}>
                  <p className="chat-settings-members">
                    {room.members.length} members
                  </p>

                  <label className="chat-settings-text">Change name:</label>
                  <input
                    className="chat-settings-input-text"
                    type="text"
                    placeholder={room.name}
                    // value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                  />

                  <div className="chat-settings-text">Members:</div>
                  <div className="flex chat-settings-members-container">
                    {roomMembers.map((m, i) => {
                      return (
                        <div>
                          <div className="flex chat-settings-current-members">
                            <div className="current-members">{m.name} </div>
                            <If condition={roomAdmins.includes(m)}>
                              <span>A</span>
                            </If>
                          </div>
                          <If condition={m._id !== user._id}>
                            <If condition={!roomAdmins.includes(m)}>
                              <div
                                className="chat-settings-make-admin"
                                onClick={() =>
                                  setRoomAdmins((prev) => {
                                    return [...prev, m];
                                  })
                                }
                              >
                                make admin
                              </div>
                            </If>
                            <If condition={!roomAdmins.includes(m)}>
                              <div
                                className="chat-settings-kick"
                                onClick={() => {
                                  let newArr = roomMembers.filter(
                                    (me) => me._id !== m._id
                                  );
                                  setRoomMembers(newArr);
                                  let newArr2 = notRoomMembers;
                                  if (!newArr2.includes(m)) newArr2.push(m);
                                  setNotRoomMembers(newArr2);
                                }}
                              >
                                kick
                              </div>
                            </If>
                          </If>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex">
                    <label className="chat-settings-text">add member:</label>
                    <input
                      className="chat-settings-input-text"
                      type="text"
                      placeholder="search user"
                      value={searchUsersInput}
                      onChange={(e) => setSearchUsersInput(e.target.value)}
                    />
                  </div>
                  <div>
                    <If condition={searchUsersInput !== ""}>
                      {notRoomMembers.map((m) => {
                        return (
                          <If condition={m !== undefined}>
                            <If
                              condition={
                                m.name.includes(searchUsersInput) &&
                                !roomMembers.includes(m)
                              }
                            >
                              <span
                                className="chat-settings-add-member-user"
                                onClick={() =>
                                  setRoomMembers((prev) => {
                                    return [...prev, m];
                                  })
                                }
                              >
                                {m.name}
                              </span>
                            </If>
                          </If>
                        );
                      })}
                    </If>
                  </div>

                  <hr />

                  <div className="chat-settings-text">color:</div>
                  <div className="flex chat-settings-default-colors">
                    <div
                      className="settings-con-green chosen-color"
                      onClick={() => setRoomTheme("#A2DC68")}
                    ></div>
                    <div
                      className="settings-con-blue"
                      onClick={() => setRoomTheme("#68DCC4")}
                    ></div>
                    <div
                      className="settings-con-purple"
                      onClick={() => setRoomTheme("#DC68D0")}
                    ></div>
                    <div
                      className="settings-con-yellow"
                      onClick={() => setRoomTheme("#D8DC68")}
                    ></div>
                  </div>

                  <div className="flex chat-settings-color-pick">
                    <div className="chat-settings-text">pick:</div>
                    <input
                      className="chat-settings-color-picker"
                      type="color"
                      onChange={(e) => setRoomTheme(e.target.value)}
                    />
                  </div>

                  <hr />
                  <div
                    className="chat-settings-delete"
                    onClick={async () => {
                      const abortController = new AbortController();
                      await fetchDeleteChatroom(
                        abortController.signal,
                        room._id
                      );
                      return () => abortController.abort();
                    }}
                  >
                    <span>X</span> Delete chatroom
                  </div>
                  <div
                    className="chat-settings-save"
                    onClick={() => fetchUpdateChatroom(room._id)}
                  >
                    save
                  </div>
                </If>

                {/* not admin */}
                <If condition={!room.admins.includes(user._id)}>
                  <p className="chat-settings-members">
                    {room.members.length} members
                  </p>

                  <div className="chat-settings-text">Members:</div>
                  <div className="flex chat-settings-members-container">
                    {roomMembers.map((m, i) => {
                      return (
                        <div>
                          <div className="flex chat-settings-current-members">
                            <div className="current-members">{m.name}</div>
                            <If condition={roomAdmins.includes(m)}>
                              <span>A</span>
                            </If>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex">
                    <label className="chat-settings-text">add members:</label>
                    <input
                      className="chat-settings-input-text"
                      type="text"
                      placeholder="search user"
                      value={searchUsersInput}
                      onChange={(e) => setSearchUsersInput(e.target.value)}
                    />
                  </div>
                  <div>
                    <If condition={searchUsersInput !== ""}>
                      {notRoomMembers.map((m) => {
                        return (
                          <If condition={m !== undefined}>
                            <If
                              condition={
                                m.name.includes(searchUsersInput) &&
                                !roomMembers.includes(m)
                              }
                            >
                              <span
                                className="chat-settings-add-member-user"
                                onClick={() =>
                                  setRoomMembers((prev) => {
                                    return [...prev, m];
                                  })
                                }
                              >
                                {m.name}
                              </span>
                            </If>
                          </If>
                        );
                      })}
                    </If>
                  </div>

                  <hr />

                  <div className="chat-settings-text">color:</div>
                  <div className="flex chat-settings-default-colors">
                    <div
                      className="settings-con-green"
                      onClick={() => setRoomTheme("#A2DC68")}
                    ></div>
                    <div
                      className="settings-con-blue"
                      onClick={() => setRoomTheme("#68DCC4")}
                    ></div>
                    <div
                      className="settings-con-purple"
                      onClick={() => setRoomTheme("#DC68D0")}
                    ></div>
                    <div
                      className="settings-con-yellow"
                      onClick={() => setRoomTheme("#D8DC68")}
                    ></div>
                  </div>

                  <div className="flex chat-settings-color-pick">
                    <div className="chat-settings-text">pick:</div>
                    <input
                      className="chat-settings-color-picker"
                      type="color"
                      onChange={(e) => setRoomTheme(e.target.value)}
                    />
                  </div>

                  <hr />
                  <div
                    className="chat-settings-delete"
                    onClick={async () => {
                      const abortController = new AbortController();
                      await fetchLeaveChatroom(
                        abortController.signal,
                        room._id
                      );
                      return () => abortController.abort();
                    }}
                  >
                    <span>X</span> Leave chatroom
                  </div>
                  <div
                    className="chat-settings-save"
                    onClick={() => fetchUpdateChatroom(room._id)}
                  >
                    save
                  </div>
                </If>
              </If>
            </StyledSection>
          </If>
        );
      })}
    </section>
  );
};

// admin and notadmin combined
{
  /* <If condition={activeChatroom === room}>
  <p>{room.members.length} members</p>
  <If condition={room.admins.includes(user._id)}>
    <label>name:</label>
    <input
      type="text"
      placeholder={room.name}
      // value={roomName}
      onChange={(e) => setRoomName(e.target.value)}
    />
  </If>

  <div>Members:</div>
  <div className="flex">
    {roomMembers.map((m, i) => {
      return (
        <div>
          <div>
            {m.name}
            <If condition={roomAdmins.includes(m)}>
              <span>A</span>
            </If>
          </div>
          <If condition={room.admins.includes(user._id) && m._id !== user._id}>
            <If condition={!roomAdmins.includes(m)}>
              <div
                onClick={() =>
                  setRoomAdmins((prev) => {
                    return [...prev, m];
                  })
                }
              >
                make admin
              </div>
            </If>
            <If condition={!roomAdmins.includes(m)}>
              <div
                onClick={() => {
                  let newArr = roomMembers.filter((me) => me._id !== m._id);
                  setRoomMembers(newArr);
                  let newArr2 = notRoomMembers;
                  if (!newArr2.includes(m)) newArr2.push(m);
                  setNotRoomMembers(newArr2);
                  // setNotRoomMembers((prev) => {
                  //   if (!prev.includes(m)) {
                  //     return [...prev, m];
                  //   } else {
                  //     return [prev];
                  //   }
                  // });
                }}
              >
                kick
              </div>
            </If>
          </If>
        </div>
      );
    })}
  </div>
  <div className="flex">
    <label>search not members:</label>
    <input
      type="text"
      placeholder="search user"
      value={searchUsersInput}
      onChange={(e) => setSearchUsersInput(e.target.value)}
    />
  </div>
  <div>
    <If condition={searchUsersInput !== ""}>
      {notRoomMembers.map((m) => {
        console.log(m);
        console.log("notmembers", notRoomMembers);
        console.log("members", roomMembers);

        return (
          <If condition={m !== undefined}>
            <If
              condition={
                m.name.includes(searchUsersInput) && !roomMembers.includes(m)
              }
            >
              <span
                onClick={() =>
                  setRoomMembers((prev) => {
                    return [...prev, m];
                  })
                }
              >
                {m.name}
              </span>
            </If>
          </If>
        );
      })}
    </If>
  </div>

  <hr />

  <div>color:</div>
  <div className="flex">
    <div onClick={() => setRoomTheme("#A2DC68")}>greenC</div>
    <div onClick={() => setRoomTheme("#68DCC4")}>blueC</div>
    <div onClick={() => setRoomTheme("#DC68D0")}>purpleC</div>
    <div onClick={() => setRoomTheme("#D8DC68")}>yellowC</div>
  </div>

  <input type="color" onChange={(e) => setRoomTheme(e.target.value)} />

  <hr />
  <div onClick={() => fetchUpdateChatroom(room._id)}>save</div>
  {/* <div onClick={() => setChatSettingsToggle(null)}>save</div> */
}
//   {roomAdmins.includes(user) ? (
//     <div
//       onClick={async () => {
//         const abortController = new AbortController();
//         await fetchDeleteChatroom(abortController.signal, room._id);
//         return () => abortController.abort();
//       }}
//     >
//       <span>icon</span> Delete chatroom
//     </div>
//   ) : (
//     <div>
//       <span>icon</span> Leave chatroom
//     </div>
//   )}
// </If>; */}
// ----------------------------------------------

// const Chatroom = ({
//   user,
//   room,
//   chatSettingsToggle,
//   setChatSettingsToggle,
//   setFetchAgain,
//   fetchAgain,
// }) => {
//   const [searchUsersInput, setSearchUsersInput] = useState("");
//   const [roomAdmins, setRoomAdmins] = useState([]);
//   const [notRoomAdmins, setNotRoomAdmins] = useState([]);
//   const [roomMembers, setRoomMembers] = useState([]);
//   const [notRoomMembers, setNotRoomMembers] = useState([]);
//   const [isAdmin, setIsAdmin] = useState(null);

//   const [roomName, setRoomName] = useState("");
//   const [newRoomTheme, setNewRoomTheme] = useState(room.theme);

//   const fetchAllUsers = async (signal) => {
//     let res = await get(`/protected/get-all-users`, signal);
//     setRoomMembers(
//       res.data
//         .filter((u) => room.members.includes(u._id))
//         .sort((a, b) => {
//           return room.admins.includes(b._id) - room.admins.includes(a._id);
//         })
//     );
//     setNotRoomMembers(res.data.filter((u) => !room.members.includes(u._id)));

//     setRoomAdmins(res.data.filter((u) => room.admins.includes(u._id)));
//     setNotRoomAdmins(res.data.filter((u) => !room.admins.includes(u._id)));
//   };

//   const fetchDeleteChatroom = async (signal) => {
//     const abortController = new AbortController();
//     let res = await get(`/protected/delete-chatroom/` + room._id, signal);
//     setFetchAgain(!fetchAgain);
//     return () => abortController.abort();
//   };

//   const fetchUpdateChatroom = async () => {
//     let newRoomAdmins = [];
//     roomAdmins.forEach((a) => {
//       newRoomAdmins.push(a._id);
//       console.log(a._id);
//     });

//     let newRoomMembers = [];
//     roomMembers.forEach((m) => newRoomMembers.push(m._id));

//     // let newRoomName = room.name;
//     // if (roomName !== room.name && roomName !== "") {
//     //   newRoomName = roomName;
//     // }
//     await post(`/protected/update-chatroom/` + room._id, {
//       name: roomName,
//       admins: newRoomAdmins,
//       members: newRoomMembers,
//       theme: newRoomTheme,
//     });
//     setFetchAgain(!fetchAgain);
//   };

//   const StyledSection = styled.section`
//     background: linear-gradient(
//       235deg,
//       ${room.theme} 25%,
//       rgba(255, 255, 255, 1) 25%
//     );
//   `;

//   useEffect(async () => {
//     const abortController = new AbortController();
//     await fetchAllUsers(abortController.signal);
//     return () => abortController.abort();
//   }, []);

//   useEffect(() => {
//     setIsAdmin(room.admins.includes(user._id));
//   }, []);

//   return (
//     <StyledSection
//       onClick={() => {
//         setChatSettingsToggle(room._id);
//       }}
//       className="col2-chatroom-con"
//     >
//       <h5>
//         {room.name}
//         <If condition={isAdmin}>
//           <span>admin</span>
//         </If>
//       </h5>
//       <If condition={chatSettingsToggle === room._id}>
//         <p>{room.members.length} members</p>
//         <If condition={isAdmin}>
//           <label>name:</label>
//           <input
//             type="text"
//             placeholder={room.name}
//             // value={roomName}
//             onChange={(e) => setRoomName(e.target.value)}
//           />
//         </If>

//         <div>Members:</div>
//         <div className="flex">
//           {roomMembers.map((m, i) => {
//             return (
//               <div>
//                 <div>
//                   {m.name}
//                   <If condition={roomAdmins.includes(m)}>
//                     <span>A</span>
//                   </If>
//                 </div>
//                 <If condition={isAdmin && m._id !== user._id}>
//                   <If condition={!roomAdmins.includes(m)}>
//                     <div
//                       onClick={() =>
//                         setRoomAdmins((prev) => {
//                           return [...prev, m];
//                         })
//                       }
//                     >
//                       make admin
//                     </div>
//                   </If>
//                   <If condition={!roomAdmins.includes(m)}>
//                     <div
//                       onClick={() => {
//                         let newArr = roomMembers.filter(
//                           (me) => me._id !== m._id
//                         );
//                         setRoomMembers(newArr);
//                       }}
//                     >
//                       kick
//                     </div>
//                   </If>
//                 </If>
//               </div>
//             );
//           })}
//         </div>
//         <div className="flex">
//           <label>search not members:</label>
//           <input
//             type="text"
//             placeholder="search user"
//             onChange={(e) => setSearchUsersInput(e.target.value)}
//           />
//         </div>
//         <div>
//           <If condition={searchUsersInput !== ""}>
//             {notRoomMembers.map((m) => {
//               return (
//                 <If
//                   condition={
//                     m.name.includes(searchUsersInput) &&
//                     !roomMembers.includes(m)
//                   }
//                 >
//                   <span
//                     onClick={() =>
//                       setRoomMembers((prev) => {
//                         return [...prev, m];
//                       })
//                     }
//                   >
//                     {m.name}
//                   </span>
//                 </If>
//               );
//             })}
//           </If>
//         </div>

//         <hr />

//         <div>color:</div>
//         <div className="flex">
//           <div onClick={() => setNewRoomTheme("#A2DC68")}>greenC</div>
//           <div onClick={() => setNewRoomTheme("#68DCC4")}>blueC</div>
//           <div onClick={() => setNewRoomTheme("#DC68D0")}>purpleC</div>
//           <div onClick={() => setNewRoomTheme("#D8DC68")}>yellowC</div>
//         </div>

//         <input type="color" onChange={(e) => setNewRoomTheme(e.target.value)} />

//         <hr />
//         <div onClick={() => fetchUpdateChatroom()}>save</div>
//         {/* <div onClick={() => setChatSettingsToggle(null)}>save</div> */}
//         {isAdmin ? (
//           <div
//             onClick={() => {
//               fetchDeleteChatroom();
//             }}
//           >
//             <span>icon</span> Delete chatroom
//           </div>
//         ) : (
//           <div>
//             <span>icon</span> Leave chatroom
//           </div>
//         )}
//       </If>
//     </StyledSection>
//   );
// };

// before

// export const ChatroomsSettings = ({
//   user,
//   userChatrooms,
//   searchChatrooms,
//   setFetchAgain,
//   fetchAgain,
// }) => {
//   const [chatSettingsToggle, setChatSettingsToggle] = useState(null);

//   return (
//     <section className="flex dash-settings-chatrooms">
//       {userChatrooms.map((room) => {
//         return (
//           <If condition={room.name.includes(searchChatrooms)}>
//             <Chatroom
//               user={user}
//               room={room}
//               chatSettingsToggle={chatSettingsToggle}
//               setChatSettingsToggle={setChatSettingsToggle}
//               setFetchAgain={setFetchAgain}
//               fetchAgain={fetchAgain}
//             />
//           </If>
//         );
//       })}
//     </section>
//   );
// };

// const Chatroom = ({
//   user,
//   room,
//   chatSettingsToggle,
//   setChatSettingsToggle,
//   setFetchAgain,
//   fetchAgain,
// }) => {
//   const [searchUsersInput, setSearchUsersInput] = useState("");
//   const [roomAdmins, setRoomAdmins] = useState([]);
//   const [notRoomAdmins, setNotRoomAdmins] = useState([]);
//   const [roomMembers, setRoomMembers] = useState([]);
//   const [notRoomMembers, setNotRoomMembers] = useState([]);
//   const [isAdmin, setIsAdmin] = useState(null);

//   const [roomName, setRoomName] = useState("");
//   const [newRoomTheme, setNewRoomTheme] = useState(room.theme);

//   const fetchAllUsers = async (signal) => {
//     let res = await get(`/protected/get-all-users`, signal);
//     setRoomMembers(
//       res.data
//         .filter((u) => room.members.includes(u._id))
//         .sort((a, b) => {
//           return room.admins.includes(b._id) - room.admins.includes(a._id);
//         })
//     );
//     setNotRoomMembers(res.data.filter((u) => !room.members.includes(u._id)));

//     setRoomAdmins(res.data.filter((u) => room.admins.includes(u._id)));
//     setNotRoomAdmins(res.data.filter((u) => !room.admins.includes(u._id)));
//   };

//   const fetchDeleteChatroom = async (signal) => {
//     const abortController = new AbortController();
//     let res = await get(`/protected/delete-chatroom/` + room._id, signal);
//     setFetchAgain(!fetchAgain);
//     return () => abortController.abort();
//   };

//   const fetchUpdateChatroom = async () => {
//     let newRoomAdmins = [];
//     roomAdmins.forEach((a) => {
//       newRoomAdmins.push(a._id);
//       console.log(a._id);
//     });

//     let newRoomMembers = [];
//     roomMembers.forEach((m) => newRoomMembers.push(m._id));

//     // let newRoomName = room.name;
//     // if (roomName !== room.name && roomName !== "") {
//     //   newRoomName = roomName;
//     // }
//     await post(`/protected/update-chatroom/` + room._id, {
//       name: roomName,
//       admins: newRoomAdmins,
//       members: newRoomMembers,
//       theme: newRoomTheme,
//     });
//     setFetchAgain(!fetchAgain);
//   };

//   const StyledSection = styled.section`
//     background: linear-gradient(
//       235deg,
//       ${room.theme} 25%,
//       rgba(255, 255, 255, 1) 25%
//     );
//   `;

//   useEffect(async () => {
//     const abortController = new AbortController();
//     await fetchAllUsers(abortController.signal);
//     return () => abortController.abort();
//   }, []);

//   useEffect(() => {
//     setIsAdmin(room.admins.includes(user._id));
//   }, []);

//   return (
//     <StyledSection
//       onClick={() => {
//         setChatSettingsToggle(room._id);
//       }}
//       className="col2-chatroom-con"
//     >
//       <h5>
//         {room.name}
//         <If condition={isAdmin}>
//           <span>admin</span>
//         </If>
//       </h5>
//       <If condition={chatSettingsToggle === room._id}>
//         <p>{room.members.length} members</p>
//         <If condition={isAdmin}>
//           <label>name:</label>
//           <input
//             type="text"
//             placeholder={room.name}
//             // value={roomName}
//             onChange={(e) => setRoomName(e.target.value)}
//           />
//         </If>

//         <div>Members:</div>
//         <div className="flex">
//           {roomMembers.map((m, i) => {
//             return (
//               <div>
//                 <div>
//                   {m.name}
//                   <If condition={roomAdmins.includes(m)}>
//                     <span>A</span>
//                   </If>
//                 </div>
//                 <If condition={isAdmin && m._id !== user._id}>
//                   <If condition={!roomAdmins.includes(m)}>
//                     <div
//                       onClick={() =>
//                         setRoomAdmins((prev) => {
//                           return [...prev, m];
//                         })
//                       }
//                     >
//                       make admin
//                     </div>
//                   </If>
//                   <If condition={!roomAdmins.includes(m)}>
//                     <div
//                       onClick={() => {
//                         let newArr = roomMembers.filter(
//                           (me) => me._id !== m._id
//                         );
//                         setRoomMembers(newArr);
//                       }}
//                     >
//                       kick
//                     </div>
//                   </If>
//                 </If>
//               </div>
//             );
//           })}
//         </div>
//         <div className="flex">
//           <label>search not members:</label>
//           <input
//             type="text"
//             placeholder="search user"
//             onChange={(e) => setSearchUsersInput(e.target.value)}
//           />
//         </div>
//         <div>
//           <If condition={searchUsersInput !== ""}>
//             {notRoomMembers.map((m) => {
//               return (
//                 <If
//                   condition={
//                     m.name.includes(searchUsersInput) &&
//                     !roomMembers.includes(m)
//                   }
//                 >
//                   <span
//                     onClick={() =>
//                       setRoomMembers((prev) => {
//                         return [...prev, m];
//                       })
//                     }
//                   >
//                     {m.name}
//                   </span>
//                 </If>
//               );
//             })}
//           </If>
//         </div>

//         <hr />

//         <div>color:</div>
//         <div className="flex">
//           <div onClick={() => setNewRoomTheme("#A2DC68")}>greenC</div>
//           <div onClick={() => setNewRoomTheme("#68DCC4")}>blueC</div>
//           <div onClick={() => setNewRoomTheme("#DC68D0")}>purpleC</div>
//           <div onClick={() => setNewRoomTheme("#D8DC68")}>yellowC</div>
//         </div>

//         <input type="color" onChange={(e) => setNewRoomTheme(e.target.value)} />

//         <hr />
//         <div onClick={() => fetchUpdateChatroom()}>save</div>
//         {/* <div onClick={() => setChatSettingsToggle(null)}>save</div> */}
//         {isAdmin ? (
//           <div
//             onClick={() => {
//               fetchDeleteChatroom();
//             }}
//           >
//             <span>icon</span> Delete chatroom
//           </div>
//         ) : (
//           <div>
//             <span>icon</span> Leave chatroom
//           </div>
//         )}
//       </If>
//     </StyledSection>
//   );
// };
