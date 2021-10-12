import { address, post } from "../../../utils/http";

export const LoginSignup = () => {
  const submitFetch = async (signal) => {
    await post(`/create-user`, signal);
    // const abortController = new AbortController();
    // await fetchChatrooms(abortController.signal);
    // return () => abortController.abort();
  };

  return (
    <section className="flex center login-con-logsign-con">
      <button className="center login-btn" onClick={submitFetch}>
        Sign up
      </button>
      <p className="center login-con-noaccount">
        By singing up you agree osvosv
        <span>terms and conditions</span>
      </p>
    </section>
  );
};
