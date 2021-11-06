import styled from "styled-components";

const StyledDiv = styled("div")`
  background-image: url(../avatars/${(props) => props.img});
`;

export const UserAvatar = ({ user }) => {
  return (
    <section className="flex col1-user-con">
      {/* <div className="onlinestatus-con">
        <div className="user-con-onlinestatus"></div>
      </div> */}

      <StyledDiv img={user.avatar} className="height100 user-con-avatar">
        <div className="onlinestatus-con">
          <div className="user-con-onlinestatus"></div>
        </div>
      </StyledDiv>

      <div className=" flex user-con-user-name">{user.name}</div>
    </section>
  );
};
