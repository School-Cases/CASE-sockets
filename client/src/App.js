import { BrowserRouter, Switch } from "react-router-dom";
import { GuardProvider, GuardedRoute } from "react-router-guards";

import { PageHome } from "./components/main-pages/PageHome";
import { PageDashboard } from "./components/main-pages/PageDashboard";
import { Test } from "./components/Test";
import { get } from "./utils/http";

import { useEffect } from "react";

// import { ws } from "./utils/ws";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style/temp.scss";

const requireLogin = async (to, from, next) => {
  const res = await get("/logged-in");

  console.log(res);

  if (to.meta.auth === undefined) return next();
  if (to.meta.auth && !res.data) return next.redirect("/");
  if (!to.meta.auth && res.data) return next.redirect("/dashboard");

  return next();
};

const Loading = () => {
  return <p>Loading...</p>;
};

const NotFound = () => {
  return <p>Not Found</p>;
};

function App() {
  console.log("hehe");
  return (
    <div className="App">
      <BrowserRouter>
        <GuardProvider
          guards={[requireLogin]}
          loading={Loading}
          error={NotFound}
        >
          <Switch>
            <GuardedRoute
              path="/"
              exact
              component={PageHome}
              meta={{ auth: false }}
            />
            <GuardedRoute
              path="/dashboard"
              exact
              component={Test}
              meta={{ auth: true }}
            />
            <GuardedRoute path="*" component={NotFound} />
          </Switch>
        </GuardProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
