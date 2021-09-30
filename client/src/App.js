import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import SignIn from "./routes/signIn";
import SignUp from "./routes/signUp";
import Logout from "./routes/logout";
import MainRoute from "./routes/main";

const App = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route path="/logout" component={Logout} />
        <Route path="/main" component={MainRoute} />
        <Route path="/signup" component={SignUp} />
        <Route path="/signin" component={SignIn} />
        <Redirect from="/" exact to="/signin" />
      </Switch>
    </React.Fragment>
  );
};

export default App;
