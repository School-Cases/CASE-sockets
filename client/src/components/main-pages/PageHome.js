import { Container, Row, Col } from "react-bootstrap";

import { useState, useEffect } from "react";

import { LoginSignup } from "./home-comps/LoginSignup";

import { breakpoints } from "../../utils/breakpoints";
import { api_address, post } from "../../utils/http";

export const PageHome = () => {
  const [W, setW] = useState(window.innerWidth);
  const [loginSignup, setLoginSignup] = useState("login");
  const [avatar, setAvatar] = useState([0, 0]);
  //   const [avatarChange, setAvatarChange] = useState(0);
  const [theme, setTheme] = useState([0, 0]);

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  useEffect(() => {
    let changeW = window.addEventListener("resize", () =>
      setW(window.innerWidth)
    );
    return window.removeEventListener("resize", changeW);
  }, [W]);

  return (
    <Container
      className={`page page-home ${
        W < breakpoints.medium ? "page-home-mobile" : "page-home-desktop"
      }`}
    >
      <Container className="flex login-con">
        <h3>{loginSignup === "login" ? "Welcome" : "Create account"}</h3>

        <Container className="height100">
          <Row className="height100">
            <Col
              lg={{ span: 8, order: 1 }}
              md={{ span: 8, order: 1 }}
              xs={{ span: 12, order: 1 }}
              className="col-nopad"
            >
              <section className="flex height100 login-con-form-btn">
                <form
                  action={
                    loginSignup === "login"
                      ? api_address + "/user-login"
                      : api_address + "/create-user"
                  }
                  method="post"
                  className="flex login-con-form-userpass"
                >
                  <label htmlFor="name">username:</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="haakon1337"
                    // onChange={(e) => setUsernameInput(e.target.value)}
                    // onChange={(e) => console.log(e.target.value)}
                  />
                  <label htmlFor="password">password:</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="pAssword123!"
                    // onChange={(e) => setPasswordInput(e.target.value)}
                  />
                  <input type="number" name="theme" value={theme[0]} hidden />
                  <input type="number" name="avatar" value={avatar[0]} hidden />
                  <input
                    type="number"
                    name="avatarChange"
                    value={avatar[1]}
                    hidden
                  />
                  <input
                    type="number"
                    name="themeChange"
                    value={theme[1]}
                    hidden
                  />
                </form>

                {W > breakpoints.medium ? (
                  <LoginSignup
                    loginSignup={loginSignup}
                    setLoginSignup={setLoginSignup}
                    username={usernameInput}
                    password={passwordInput}
                    theme={theme}
                    avatar={avatar}
                  />
                ) : null}
              </section>
            </Col>
            <Col
              lg={{ span: 4, order: 2 }}
              md={{ span: 4, order: 2 }}
              xs={{ span: 12, order: 2 }}
              className={`${W < breakpoints.medium ? "flex" : ""} col-nopad`}
            >
              <Col
                lg={{ span: 12, order: 1 }}
                md={{ span: 12, order: 1 }}
                xs={{ span: 6, order: 1 }}
                className="login-con-avatar-con col-nopad"
              >
                <button
                  onClick={() => {
                    setAvatar([0, 1]);
                  }}
                >
                  avatar 1
                </button>
                <button
                  onClick={() => {
                    setAvatar([1, 1]);
                  }}
                >
                  avatar 2
                </button>
                <button
                  onClick={() => {
                    setAvatar([2, 1]);
                  }}
                >
                  avatar 3
                </button>
                <button
                  onClick={() => {
                    setAvatar([3, 1]);
                  }}
                >
                  avatar 4
                </button>
              </Col>
              <Col
                lg={{ span: 12, order: 2 }}
                md={{ span: 12, order: 2 }}
                xs={{ span: 6, order: 2 }}
                className="login-con-theme-con col-nopad"
              >
                <button onClick={() => setTheme([0, 1])}>olf theme</button>
                <button onClick={() => setTheme([1, 1])}>poke theme</button>
              </Col>
            </Col>
          </Row>
        </Container>
      </Container>

      {W < breakpoints.medium ? (
        <LoginSignup
          loginSignup={loginSignup}
          setLoginSignup={setLoginSignup}
        />
      ) : null}
    </Container>
  );
};
