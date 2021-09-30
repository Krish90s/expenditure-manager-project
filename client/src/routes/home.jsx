import React from "react";
import ExpenseOverview from "../components/expenseOverview";

const Home = (props) => {
  return (
    <div>
      <ExpenseOverview user={props.user} userId={props.match.params.id} />
    </div>
  );
};

export default Home;
