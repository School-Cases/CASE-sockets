import { api_address, get } from "../../../utils/http";

export const Nav = ({ setDashboardNavState, dashboardNavState }) => {
  const fetchUserLogout = async () => {
    const abortController = new AbortController();
    let res = await get(`/protected/user-logout`, abortController.signal);
    if (res.success) {
      console.log("yay");
    }
  };
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
      <div onClick={() => fetchUserLogout()} className="nav-con-li">
        <span>icon</span>log out
      </div>
    </section>
  );
};
