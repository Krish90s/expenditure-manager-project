import React, { Component } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import Layout from "../components/layout";
import NotFound from "./notfound";
import Reports from "./reports";
import NewExpense from "./new-expenses";
import Expenses from "./expenses";
import EditProfile from "./edit-profile";
import Profile from "./profile";
import Home from "./home";
import { getMe } from "./../services/currentUserService";

class MainRoute extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {},
    };
  }

  async componentDidMount() {
    const { data: user } = await getMe();
    this.setState({ user });
  }

  render() {
    return (
      <React.Fragment>
        <Layout user={this.state.user}>
          <Switch>
            <Route path="/main/page-notfound" component={NotFound} />
            <Route
              path="/main/reports/:id"
              render={(props) => <Reports user={this.state.user} {...props} />}
            />
            <Route
              path="/main/expenses/new"
              render={(props) => (
                <NewExpense user={this.state.user} {...props} />
              )}
            />
            <Route
              path="/main/expenses/:id"
              render={(props) => <Expenses user={this.state.user} {...props} />}
            />
            <Route
              path="/main/Profile/:id/edit"
              render={(props) => (
                <EditProfile user={this.state.user} {...props} />
              )}
            />
            <Route
              path="/main/Profile/:id"
              render={(props) => <Profile user={this.state.user} {...props} />}
            />
            <Route
              path="/main/dashboard/:id"
              render={(props) => <Home user={this.state.user} {...props} />}
            />
            <Redirect
              from="/main"
              exact
              to={`/main/dashboard/${this.state.user._id}`}
            />
            <Redirect to="/main/page-notfound" />
          </Switch>
        </Layout>
      </React.Fragment>
    );
  }
}

export default MainRoute;
