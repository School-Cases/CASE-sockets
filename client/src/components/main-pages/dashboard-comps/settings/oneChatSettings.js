// import { useState, useEffect } from "react";
// import { get, post } from "../../../../utils/http";

// import { If } from "../../../../utils/If";

// import styled from "styled-components";

// export const Chatroom = ({
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
