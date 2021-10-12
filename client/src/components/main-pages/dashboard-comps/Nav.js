import { api_address } from "../../../utils/http";

export const Nav = ({ setDashboardNavState }) => {
  return (
    <section className="flex col1-nav-con">
      <div
        className="nav-con-li"
        onClick={() => {
          setDashboardNavState("home");
        }}
      >
        <span>icon</span> home
      </div>
      <div
        className="nav-con-li"
        onClick={() => {
          setDashboardNavState("settings");
        }}
      >
        <span>icon</span>settings
      </div>
      <a href={api_address + "/user-logout"} className="nav-con-li">
        <span>icon</span>log out
      </a>
    </section>
  );
};
