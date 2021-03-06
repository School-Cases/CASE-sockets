import { useHistory } from "react-router";

export const Nav = ({ setNavState, navState }) => {
  const history = useHistory();

  const logout = () => {
    localStorage.removeItem("token");
    history.push("/", null);
  };
  return (
    <section className="flex col1-nav-con">
      <div
        className="flex nav-con-li"
        onClick={async () => {
          setNavState("home");
        }}
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="31.827"
            height="28.927"
            viewBox="0 0 31.827 28.927"
          >
            <g
              id="Component_3_1"
              data-name="Component 3 – 1"
              transform="translate(1.414 1)"
            >
              <g id="home-outline" transform="translate(0 0)">
                <path
                  id="Path_1"
                  data-name="Path 1"
                  d="M80,212v15.028a1.03,1.03,0,0,0,1.04,1.019h6.242v-8.66a1.545,1.545,0,0,1,1.56-1.528h5.2a1.545,1.545,0,0,1,1.56,1.528v8.66h6.242a1.03,1.03,0,0,0,1.04-1.019V212"
                  transform="translate(-76.944 -201.119)"
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  id="Path_2"
                  data-name="Path 2"
                  d="M61,61.261,47.2,48.271a1.107,1.107,0,0,0-1.41,0L32,61.261"
                  transform="translate(-32 -48.017)"
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
                <path
                  id="Path_3"
                  data-name="Path 3"
                  d="M355.056,71.323V64H352v4.394"
                  transform="translate(-331.245 -62.982)"
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </g>
            </g>
          </svg>
        </span>
        <div className={`nav-con-home ${navState === "home" ? "active" : ""}`}>
          HOME
        </div>
      </div>
      <div
        className="flex nav-con-li"
        onClick={() => {
          setNavState("settings");
        }}
      >
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="31.116"
            height="31.834"
            viewBox="0 0 31.116 31.834"
          >
            <g
              id="Component_4_1"
              data-name="Component 4 – 1"
              transform="translate(1.058 1)"
            >
              <g id="settings-outline">
                <path
                  id="settings-outline-2"
                  data-name="settings-outline"
                  d="M62.924,52.478a4.461,4.461,0,1,0,4,4A4.461,4.461,0,0,0,62.924,52.478Zm10.742,4.44a10.758,10.758,0,0,1-.107,1.449l3.151,2.472a.754.754,0,0,1,.171.958L73.9,66.955a.754.754,0,0,1-.916.32l-3.13-1.26a1.123,1.123,0,0,0-1.057.122,11.465,11.465,0,0,1-1.5.874,1.111,1.111,0,0,0-.615.846L66.211,71.2a.772.772,0,0,1-.744.639H59.5a.774.774,0,0,1-.745-.618l-.468-3.333a1.12,1.12,0,0,0-.627-.852,10.824,10.824,0,0,1-1.5-.876,1.115,1.115,0,0,0-1.053-.119L51.985,67.3a.754.754,0,0,1-.916-.319l-2.981-5.158a.753.753,0,0,1,.171-.958l2.663-2.091a1.119,1.119,0,0,0,.418-.981c-.025-.291-.04-.581-.04-.871s.015-.576.04-.861a1.115,1.115,0,0,0-.423-.972l-2.662-2.091a.754.754,0,0,1-.165-.954l2.981-5.158a.754.754,0,0,1,.916-.32l3.13,1.26a1.123,1.123,0,0,0,1.057-.122,11.465,11.465,0,0,1,1.5-.874,1.111,1.111,0,0,0,.615-.846l.469-3.338A.772.772,0,0,1,59.5,42h5.963a.774.774,0,0,1,.745.618l.468,3.333a1.12,1.12,0,0,0,.627.852,10.826,10.826,0,0,1,1.5.876,1.115,1.115,0,0,0,1.053.119l3.129-1.26a.754.754,0,0,1,.916.319l2.981,5.158a.753.753,0,0,1-.171.958l-2.663,2.091a1.119,1.119,0,0,0-.422.981C73.65,56.337,73.665,56.627,73.665,56.917Z"
                  transform="translate(-47.985 -42)"
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </g>
            </g>
          </svg>
        </span>
        <div
          className={`nav-con-settings ${
            navState === "settings" ? "active" : ""
          }`}
        >
          SETTINGS
        </div>
      </div>
      <div onClick={logout} className="flex nav-con-li">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="31"
            height="26.167"
            viewBox="0 0 31 26.167"
          >
            <g id="log-out-outline" transform="translate(1 1)">
              <path
                id="Path_11"
                data-name="Path 11"
                d="M81.969,114.125v3.021a3.008,3.008,0,0,1-2.995,3.021H66.995A3.008,3.008,0,0,1,64,117.146V99.021A3.008,3.008,0,0,1,66.995,96h11.38c1.654,0,3.594,1.353,3.594,3.021v3.021"
                transform="translate(-64 -96)"
                fill="none"
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                id="Path_12"
                data-name="Path 12"
                d="M368,187.979l5.99-5.99L368,176"
                transform="translate(-344.99 -169.906)"
                fill="none"
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <line
                id="Line_1"
                data-name="Line 1"
                x2="19"
                transform="translate(8.625 12.083)"
                fill="none"
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </g>
          </svg>
        </span>
        <div>LOG OUT</div>
      </div>
    </section>
  );
};
