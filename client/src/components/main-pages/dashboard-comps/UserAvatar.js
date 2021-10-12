export const UserAvatar = ({ user }) => {
  return (
    <section className="flex col1-user-con">
      <div className="height100 user-con-avatar">avatar: {user.avatar}</div>
      <div>{user.name}</div>
    </section>
  );
};
