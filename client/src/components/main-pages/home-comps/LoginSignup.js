import { address, post } from "../../../utils/http";

export const LoginSignup = ({
  loginSignup,
  setLoginSignup,
  usernameInput,
  passwordInput,
  theme,
  avatar,
}) => {
  console.log(passwordInput, usernameInput);
  let loginSingupTexts =
    loginSignup === "login"
      ? ["Log in", "Dont have account?", "Sign up"]
      : ["Sign up", "By singing up you agree osvosv", "terms and conditions"];

  const signupOrTermsCond = () => {
    loginSignup === "login"
      ? setLoginSignup("signup")
      : console.log("terms and condition page");
  };

  const submitFetch = async (btnState) => {
    // const abortController = new AbortController();
    // btnState === "login"
    //   ? await post(`/user-login`, {
    //       name: "as",
    //       password: "as",
    //       avatar: avatar[0],
    //       avatarChange: avatar[1],
    //       theme: theme[0],
    //       themeChange: theme[1],
    //     })
    //   : await post(`/create-user`);
    // return () => abortController.abort();
    document.querySelector(".login-con-form-userpass").submit();
  };

  return (
    <section className="flex center login-con-logsign-con">
      <button
        type="button"
        className="center login-btn"
        // onClick={() => submitFetch(loginSignup)}
        onClick={() => submitFetch()}
      >
        {loginSingupTexts[0]}
      </button>
      <p className="center login-con-noaccount">
        {loginSingupTexts[1]}
        <span onClick={() => signupOrTermsCond()}>{loginSingupTexts[2]}</span>
      </p>
    </section>
  );
};
