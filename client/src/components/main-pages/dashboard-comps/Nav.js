import { api_address, get } from "../../../utils/http";
import { useHistory } from "react-router";

export const Nav = ({
  setDashboardNavState,
  dashboardNavState,
  createChatroom,
  setCreateChatroom,
}) => {
  const history = useHistory();

  const logout = () => {
    localStorage.removeItem("token");
    history.push("/", null);
  };

  return (
    <section className="flex col1-nav-con">
      <div
        className="nav-con-li"
        onClick={() => {
          setDashboardNavState("home");
          if (createChatroom) setCreateChatroom(false);
        }}
      >
        <span>icon</span> HOME
      </div>
      <div
        className="nav-con-li"
        onClick={() => {
          setDashboardNavState("settings");
          if (createChatroom) setCreateChatroom(false);
        }}
      >
        <span>icon</span>SETTINGS
      </div>
      <div onClick={logout} className="nav-con-li">
        <span>icon</span>log out
      </div>
    </section>
  );
};
