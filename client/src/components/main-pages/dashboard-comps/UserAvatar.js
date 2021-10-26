import styled from "styled-components";

const StyledDiv = styled("div")`
  background-image: url(../avatars/${(props) => props.img});
`;

export const UserAvatar = ({ user }) => {
  return (
    <section className="flex col1-user-con">
      <StyledDiv
        img={user.avatar}
        className="height100 user-con-avatar"
      ></StyledDiv>
      {/* <div className="height100 user-con-avatar">
        <img src="../src/images/test2.jpg" alt="" />
      </div> */}
      <div className=" flex user-con-user-name">{user.name}</div>
    </section>
  );
};
