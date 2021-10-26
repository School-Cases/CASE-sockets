import { Container, Row, Col } from "react-bootstrap";

import { useState, useEffect } from "react";

import { LoginSignup } from "./home-comps/LoginSignup";

import { breakpoints } from "../../utils/breakpoints";
import { api_address, post } from "../../utils/http";
import { If } from "../../utils/If";

import avatars from "../../utils/avatars";

import styled from "styled-components";

const StyledDiv = styled("div")`
  background-image: url(../avatars/${(props) => props.img});
`;
export const PageHome = () => {
  console.log(avatars);
  const [W, setW] = useState(window.innerWidth);
  const [loginSignup, setLoginSignup] = useState("login");
  const [avatar, setAvatar] = useState([avatars[0], 0]);
  const [avatarSwitch, setAvatarSwitch] = useState(false);
  const [theme, setTheme] = useState([0, 0]);

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [responseMessage, setResponseMessage] = useState(null);

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
              lg={{ span: avatarSwitch ? 5 : 8, order: 1 }}
              md={{ span: avatarSwitch ? 5 : 8, order: 1 }}
              xs={{ span: 12, order: 1 }}
              className="col-nopad home-con-col1"
            >
              <section className="flex height100 login-con-form-btn">
                <div className="flex login-con-form-userpass">
                  <label htmlFor="name">username:</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="haakon1337"
                    onChange={(e) => setUsernameInput(e.target.value)}
                  />
                  <label htmlFor="password">password:</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="pAssword123!"
                    onChange={(e) => setPasswordInput(e.target.value)}
                  />
                  <input type="number" name="theme" value={theme[0]} hidden />
                  <input type="number" name="avatar" value={avatar[0]} hidden />
                  <input
                    type="number"
                    name="avatarChange"
                    defaultValue={avatar[1]}
                    hidden
                  />
                  <input
                    type="number"
                    name="themeChange"
                    defaultValue={theme[1]}
                    hidden
                  />
                </div>

                <If condition={responseMessage !== null}>
                  <div>{responseMessage}</div>
                </If>

                <If condition={W > breakpoints.medium}>
                  <LoginSignup
                    loginSignup={loginSignup}
                    setLoginSignup={setLoginSignup}
                    usernameInput={usernameInput}
                    passwordInput={passwordInput}
                    theme={theme}
                    avatar={avatar}
                    setResponseMessage={setResponseMessage}
                  />
                </If>
              </section>
            </Col>
            <Col
              lg={{ span: avatarSwitch ? 3 : 4, order: 2 }}
              md={{ span: avatarSwitch ? 3 : 4, order: 2 }}
              xs={{ span: 12, order: 2 }}
              className={`home-con-col2 ${
                W < breakpoints.medium ? "flex" : ""
              } col-nopad`}
            >
              <Col
                lg={{ span: 12, order: 1 }}
                md={{ span: 12, order: 1 }}
                xs={{ span: 6, order: 1 }}
                className="login-con-avatar-con col-nopad"
              >
                <StyledDiv
                  img={avatar[0]}
                  className="chosen-avatar"
                ></StyledDiv>
                <button onClick={() => setAvatarSwitch(!avatarSwitch)}>
                  byt
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
            <If condition={avatarSwitch}>
              <Col
                lg={{ span: 4, order: 3 }}
                md={{ span: 4, order: 3 }}
                xs={{ span: 12, order: 3 }}
                className="flex col-nopad home-con-col3"
              >
                {avatars.map((a) => {
                  return (
                    <StyledDiv
                      img={a}
                      className="avatars"
                      onClick={() => setAvatar([a, 1])}
                    ></StyledDiv>
                  );
                })}
              </Col>
            </If>
          </Row>
        </Container>
      </Container>

      <If condition={W < breakpoints.medium}>
        <LoginSignup
          loginSignup={loginSignup}
          setLoginSignup={setLoginSignup}
          usernameInput={usernameInput}
          passwordInput={passwordInput}
          theme={theme}
          avatar={avatar}
          setResponseMessage={setResponseMessage}
        />
      </If>
    </Container>
  );
};
