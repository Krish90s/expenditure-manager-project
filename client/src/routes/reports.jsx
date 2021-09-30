import React from "react";
import { makeStyles } from "@material-ui/core";
import { Divider } from "@material-ui/core";
import MonthlyScatter from "../components/monthlyScatter";
import CategoryPie from "../components/categoryPie";
import YearlyBar from "../components/yearlyBar";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "90%",
    maxWidth: "800px",
    margin: "auto",
    marginTop: 40,
    marginBottom: 40,
  },
  separator: {
    marginBottom: 36,
  },
}));
const Reports = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <MonthlyScatter userId={props.match.params.id} />
      <Divider className={classes.separator} />
      <YearlyBar userId={props.match.params.id} />
      <Divider className={classes.separator} />
      <CategoryPie userId={props.match.params.id} />
    </div>
  );
};

export default Reports;
