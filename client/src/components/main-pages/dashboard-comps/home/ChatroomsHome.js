import React, { useEffect, useState } from "react";

import { post, get } from "../../../../utils/http";
import { If } from "../../../../utils/If";

import styled from "styled-components";
const StyledSection = styled("section")`
  background: linear-gradient(
    235deg,
    ${(props) => props.theme} 25%,
    rgba(255, 255, 255, 1) 25%
  );
`;
const StyledDiv = styled("div")`
  background-image: url(../avatars/${(props) => props.img});
`;

const LastMsgContext = React.createContext("");

// export const ChatroomsHome = ({
//   user,
//   userChatrooms,
//   joinableChatrooms,
//   searchChatrooms,
//   setActiveChatroom,
//   searchJoinableChatroomsCheckbox,
//   setCreateChatroom,
//   // fetchLastMsg,
//   // setFetchLastMsg,
//   // Messages,
//   // setmessages,
//   ws,
// }) => {
//   return (
// <section className="flex dash-home-chatrooms">
//   <div className="flex home-chatrooms-con">
//     {searchJoinableChatroomsCheckbox === false
//       ? userChatrooms.map((room) => {
//           return (
//             <If condition={room.name.includes(searchChatrooms)}>
//               <Chatroom
//                 joinable={"notJoinable"}
//                 setActiveChatroom={setActiveChatroom}
//                 room={room}
//                 user={user}
//                 setCreateChatroom={setCreateChatroom}
//                 // fetchLastMsg={fetchLastMsg}
//                 // setFetchLastMsg={setFetchLastMsg}
//                 // Messages={Messages}
//                 // setmessages={setmessages}
//                 ws={ws}
//               />
//             </If>
//           );
//         })
//       : joinableChatrooms.map((room) => {
//           return (
//             <If condition={room.name.includes(searchChatrooms)}>
//               <Chatroom
//                 joinable={"joinable"}
//                 setActiveChatroom={setActiveChatroom}
//                 room={room}
//                 user={user}
//                 ws={ws}
//               />
//             </If>
//           );
//         })}
//   </div>
// </section>
//   );
// };

// const Chatroom = ({
//   joinable,
//   room,
//   setActiveChatroom,
//   user,
//   setCreateChatroom,
//   // fetchLastMsg,
//   ws,
// }) => {
//   const [lastMessage, setLastMessage] = useState({});
//   const [lastMessageSender, setLastMessageSender] = useState({});
//   const [loading, setLoading] = useState(true);

//   const fetchLastMessage = async (signal) => {
//     console.log("fetch last");
//     let lastMessage = await get(
//       `/protected/get-message/${room.messages.at(-1)}`,
//       signal
//     );
//     setLastMessage(lastMessage.data);

//     if (lastMessage.data !== null) {
//       let lastMessageSenderFetch = await get(
//         `/protected/get-user/${lastMessage.data.sender}`,
//         signal
//       );
//       setLastMessageSender(lastMessageSenderFetch.data);
//     }
//     setLoading(false);
//   };

//   const fetchStarmarkChatroom = async () => {
//     console.log("fetch starmark");

//     await post(`/protected/starmark-chatroom/${room._id}/${user._id}`);
//   };

//   const fetchJoinChatroom = async () => {
//     let res = await post(`/protected/join-chatroom/${room._id}/${user._id}`);
//     ws.send(
//       JSON.stringify({
//         type: "roomsUpdate",
//       })
//     );
//   };

//   useEffect(async () => {
//     if (joinable === "notJoinable") {
//       const abortController = new AbortController();
//       await fetchLastMessage(abortController.signal);
//       return () => abortController.abort();
//     }
//   }, []);

//   if (loading) {
//     <h4>loading ...</h4>;
//   }

//   return (
//     <>
//       {joinable === "notJoinable" ? (
//         <StyledSection
//           theme={room.theme}
//           className="col2-chatroom-con"
//           onClick={() => {
//             setActiveChatroom(room);
//             setCreateChatroom(false);
//           }}
//         >
//           <div className="flex chatroom-con-title-fav-con">
//             <div className="flex fav-con-name-admin">
//               <div className="flex">
//                 <h5>{room.name}</h5>
//                 <If condition={room.admins.includes(user._id)}>
//                   <div className="fav-con-admin-icon">A</div>
//                 </If>
//               </div>
//             </div>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 className={`${
//                   room.starmarked.includes(user._id) ? "starmarked" : ""
//                 } title-fav-con-fav`}
//                 onClick={(e) => {
//                   e.target.classList.toggle("starmarked");
//                   fetchStarmarkChatroom();
//                 }}
//                 d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
//               />
//             </svg>
//           </div>
//           {lastMessage !== null ? (
//             <div className="flex chatroom-con-mes">
//               <StyledDiv
//                 img={lastMessageSender.avatar}
//                 className="con-mes-avatar"
//               ></StyledDiv>
//               <LastMsg value={lastMessage} />
//             </div>
//           ) : (
//             <div className="con-mes-no-message">no messages</div>
//           )}
//         </StyledSection>
//       ) : (
//         <StyledSection className="col2-chatroom-con" theme={room.theme}>
//           <div className="flex chatroom-con-title-fav-con">
//             <h5>{room.name}</h5>
//           </div>
//           <button onClick={() => fetchJoinChatroom()}>JOIN</button>
//         </StyledSection>
//       )}
//     </>
//   );
// };

// export const LastMsg = ({ value }) => {
//   return (
//     <div>
//       <div className="con-mes-message">{value.text}</div>
//       <div className="con-mes-message-time">{value.time}</div>
//     </div>
//   );
// };
