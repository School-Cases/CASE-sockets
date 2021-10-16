export const UserAvatar = ({ user }) => {
  return (
    <section className="flex col1-user-con">
      <div className="height100 user-con-avatar">avatar: {user.avatar}</div>
      {/* <div className="height100 user-con-avatar">
        <img src="../src/images/test2.jpg" alt="" />
      </div> */}
      <div>{user.name}</div>
    </section>
  );
};
