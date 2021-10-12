import { address, post } from "../../../utils/http";

export const Login = () => {
  const submit = () => {
    document.querySelector(".login-con-form-userpass").submit();
  };

  return (
    <section className="flex center login-con-logsign-con">
      <button className="center login-btn" onClick={submit}>
        Log in
      </button>
      <p className="center login-con-noaccount">
        Dont have account?
        <span>Sign up</span>
      </p>
    </section>
  );
};
