import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { PageHome } from "./components/main-pages/PageHome";
import { PageDashboard } from "./components/main-pages/PageDashboard";

import { Login } from "./components/main-pages/home-comps/Login";
import { Signup } from "./components/main-pages/home-comps/Signup";

import { parse } from "./utils/parse";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style/temp.scss";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <Switch>
            <Route path="/" component={PageHome} exact />
            {/* <Route path="/login" component={Login} exact />
            <Route path="/signup" component={Signup} exact /> */}
            <Route path="/dashboard/:id" component={PageDashboard} exact />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
