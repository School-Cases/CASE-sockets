import { api_address } from "../../../../utils/http";

export const UserSettings = ({ user }) => {
  console.log(user);
  return (
    <section>
      <div className="user-settings-input-con">
        <label htmlFor="name">Name:</label>
        <input type="text" name="name" id="" placeholder={user.name} />
      </div>
      <div className="user-settings-input-con">
        <label htmlFor="newPassword">New password:</label>
        <input type="password" name="newPassword" id="" />
      </div>
      <div className="user-settings-input-con">
        <label htmlFor="password">Current password:</label>
        <input type="password" name="password" id="" />
      </div>

      <div className="user-settings-input-con">
        <label htmlFor="avatar">Avatar:</label>
        <div>avatarImg</div>
        <input type="number" name="avatar" id="" />
      </div>
      <div className="user-settings-input-con">
        <label htmlFor="theme">Theme:</label>
        <div>theme img1</div>
        <div>theme img2</div>
        <input type="number" name="theme" id="" />
      </div>
    </section>
  );
};
