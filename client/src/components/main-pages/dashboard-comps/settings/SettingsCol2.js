import { useState, useEffect } from "react";

import { If } from "../../../../utils/If";

import styled from "styled-components";
import { SettingsChatroom } from "./SettingsChatroom";
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

  // useEffect(async () => {
  //   ws.onmessage = async (e) => {
  //     let theMessage = JSON.parse(e.data);
  //     if (theMessage.type === "roomsUpdate") {
  //       if (theMessage.detail === "roomLeave") {
  //         if (
  //           userChatrooms.some((room) => {
  //             return room._id.includes(theMessage.room);
  //           })
  //         ) {
  //           if (
  //             activeChatroom._id === theMessage.room &&
  //             theMessage.user !== user._id
  //           ) {
  //             const abortController = new AbortController();
  //             await fetchChatrooms(abortController.signal, user._id);
  //             setActiveChatroom(activeChatroom);
  //           } else {
  //             setFetchAgain(!fetchAgain);
  //           }
  //         }
  //       }
  //     }
  //   };
  // }, [ws.onmessage]);

  // if (loading) {
  //   return <h2 className="">Loading...</h2>;
  // }

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

// room active
//               <If condition={activeChatroom === room}>
//                 {/* admin */}
//                 <If condition={room.admins.includes(user._id)}>
//                   <p className="chat-settings-members">
//                     {room.members.length} members
//                   </p>

//                   <label className="chat-settings-text">Change name:</label>
//                   <input
//                     className="chat-settings-input-text"
//                     type="text"
//                     placeholder={room.name}
//                     onChange={(e) => setRoomName(e.target.value)}
//                   />

//                   <div className="chat-settings-text">Members:</div>
//                   <div className="flex chat-settings-members-container">
//                     {roomMembers.map((m, i) => {
//                       return (
//                         <div>
//                           <div className="flex chat-settings-current-members">
//                             <div className="current-members">{m.name} </div>
//                             <If condition={roomAdmins.includes(m)}>
//                               <span>A</span>
//                             </If>
//                           </div>
//                           <If condition={m._id !== user._id}>
//                             <If condition={!roomAdmins.includes(m)}>
//                               <div
//                                 className="chat-settings-make-admin"
//                                 onClick={() =>
//                                   setRoomAdmins((prev) => {
//                                     return [...prev, m];
//                                   })
//                                 }
//                               >
//                                 adminize
//                               </div>
//                             </If>
//                             <If condition={!roomAdmins.includes(m)}>
//                               <div
//                                 className="chat-settings-kick"
//                                 onClick={() => {
//                                   let newArr = roomMembers.filter(
//                                     (me) => me._id !== m._id
//                                   );
//                                   setRoomMembers(newArr);
//                                   let newArr2 = notRoomMembers;
//                                   if (!newArr2.includes(m)) newArr2.push(m);
//                                   setNotRoomMembers(newArr2);
//                                 }}
//                               >
//                                 kick
//                               </div>
//                             </If>
//                           </If>
//                         </div>
//                       );
//                     })}
//                   </div>
//                   <div className="flex">
//                     <label className="chat-settings-text">Add member:</label>
//                     <input
//                       className="chat-settings-input-text"
//                       type="text"
//                       placeholder="search member"
//                       value={searchUsersInput}
//                       onChange={(e) => setSearchUsersInput(e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <If condition={searchUsersInput !== ""}>
//                       {notRoomMembers.map((m) => {
//                         return (
//                           <If condition={m !== undefined}>
//                             <If
//                               condition={
//                                 m.name.includes(searchUsersInput) &&
//                                 !roomMembers.includes(m)
//                               }
//                             >
//                               <span
//                                 className="chat-settings-add-member-user"
//                                 onClick={() =>
//                                   setRoomMembers((prev) => {
//                                     return [...prev, m];
//                                   })
//                                 }
//                               >
//                                 {m.name}
//                               </span>
//                             </If>
//                           </If>
//                         );
//                       })}
//                     </If>
//                   </div>

//                   <hr />

//                   <div className="chat-settings-text">Color:</div>
//                   <div className="flex chat-settings-default-colors">
//                     <div
//                       className={`settings-con-green ${
//                         roomTheme === "#A2DC68" ? "chosen-color" : ""
//                       }`}
//                       onClick={() => setRoomTheme("#A2DC68")}
//                     ></div>
//                     <div
//                       className={`settings-con-blue ${
//                         roomTheme === "#68DCC4" ? "chosen-color" : ""
//                       }`}
//                       onClick={() => setRoomTheme("#68DCC4")}
//                     ></div>
//                     <div
//                       className={`settings-con-purple ${
//                         roomTheme === "#DC68D0" ? "chosen-color" : ""
//                       }`}
//                       onClick={() => setRoomTheme("#DC68D0")}
//                     ></div>
//                     <div
//                       className={`settings-con-yellow ${
//                         roomTheme === "#D8DC68" ? "chosen-color" : ""
//                       }`}
//                       onClick={() => setRoomTheme("#D8DC68")}
//                     ></div>
//                   </div>

//                   <div className="flex chat-settings-color-pick">
//                     <div className="chat-settings-text">Pick your own:</div>
//                     <input
//                       className="chat-settings-color-picker"
//                       type="color"
//                       onChange={(e) => {
//                         e.target.classList.add("chosen-color");
//                         setRoomTheme(e.target.value);
//                       }}
//                     />
//                   </div>

//                   <hr />

//                   <div
//                     className="chat-settings-delete"
//                     onClick={async () => {
//                       const abortController = new AbortController();
//                       await fetchDeleteChatroom(
//                         abortController.signal,
//                         room._id
//                       );
//                       return () => abortController.abort();
//                     }}
//                   >
//                     <span>X</span> Delete chatroom
//                   </div>
//                   <div
//                     className="chat-settings-save"
//                     onClick={() => fetchUpdateChatroom(room._id)}
//                   >
//                     SAVE
//                   </div>
//                 </If>

//                 {/* not admin */}
//                 <If condition={!room.admins.includes(user._id)}>
//                   <p className="chat-settings-members">
//                     {room.members.length} members
//                   </p>

//                   <div className="chat-settings-text">Members:</div>
//                   <div className="flex chat-settings-members-container">
//                     {roomMembers.map((m, i) => {
//                       return (
//                         <div>
//                           <div className="flex chat-settings-current-members">
//                             <div className="current-members">{m.name}</div>
//                             <If condition={roomAdmins.includes(m)}>
//                               <span>A</span>
//                             </If>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                   <div className="flex">
//                     <label className="chat-settings-text">add members:</label>
//                     <input
//                       className="chat-settings-input-text"
//                       type="text"
//                       placeholder="search user"
//                       value={searchUsersInput}
//                       onChange={(e) => setSearchUsersInput(e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <If condition={searchUsersInput !== ""}>
//                       {notRoomMembers.map((m) => {
//                         return (
//                           <If condition={m !== undefined}>
//                             <If
//                               condition={
//                                 m.name.includes(searchUsersInput) &&
//                                 !roomMembers.includes(m)
//                               }
//                             >
//                               <span
//                                 className="chat-settings-add-member-user"
//                                 onClick={() =>
//                                   setRoomMembers((prev) => {
//                                     return [...prev, m];
//                                   })
//                                 }
//                               >
//                                 {m.name}
//                               </span>
//                             </If>
//                           </If>
//                         );
//                       })}
//                     </If>
//                   </div>

//                   <hr />

//                   <div className="chat-settings-text">color:</div>
//                   <div className="flex chat-settings-default-colors">
//                     <div
//                       className={`settings-con-green ${
//                         roomTheme === "#A2DC68" ? "chosen-color" : ""
//                       }`}
//                       onClick={() => setRoomTheme("#A2DC68")}
//                     ></div>
//                     <div
//                       className={`settings-con-blue ${
//                         roomTheme === "#68DCC4" ? "chosen-color" : ""
//                       }`}
//                       onClick={() => setRoomTheme("#68DCC4")}
//                     ></div>
//                     <div
//                       className={`settings-con-purple ${
//                         roomTheme === "#DC68D0" ? "chosen-color" : ""
//                       }`}
//                       onClick={() => setRoomTheme("#DC68D0")}
//                     ></div>
//                     <div
//                       className={`settings-con-yellow ${
//                         roomTheme === "#D8DC68" ? "chosen-color" : ""
//                       }`}
//                       onClick={() => setRoomTheme("#D8DC68")}
//                     ></div>
//                   </div>

//                   <div className="flex chat-settings-color-pick">
//                     <div className="chat-settings-text">pick:</div>
//                     <input
//                       className="chat-settings-color-picker"
//                       type="color"
//                       onChange={(e) => setRoomTheme(e.target.value)}
//                     />
//                   </div>

//                   <hr />
//                   <div
//                     className="chat-settings-delete"
//                     onClick={async () => {
//                       const abortController = new AbortController();
//                       await fetchLeaveChatroom(
//                         abortController.signal,
//                         room._id
//                       );
//                       return () => abortController.abort();
//                     }}
//                   >
//                     <span>X</span> Leave chatroom
//                   </div>
//                   <div
//                     className="chat-settings-save"
//                     onClick={() => fetchUpdateChatroom(room._id)}
//                   >
//                     SAVE
//                   </div>
//                 </If>
//               </If>
//             </StyledSection>
//           </If>
//         );
//       })}

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