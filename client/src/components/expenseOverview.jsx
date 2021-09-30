import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { Card, Typography, Divider, Grid, Paper } from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  currentMonthPreview,
  expenseByCategory,
} from "./../services/expensesService";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 800,
    margin: "auto",
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  title2: {
    padding: `32px ₹{theme.spacing(2.5)}px 2px`,
    color: theme.palette.primary.main,
  },

  categorySection: {
    padding: 25,
    paddingTop: 16,
    margin: "auto",
  },
  catDiv: {
    height: "4px",
    margin: "0",
    marginBottom: 8,
  },
  val: {
    width: 200,
    display: "inline-table",
    textAlign: "center",
    margin: 2,
  },
  catTitle: {
    padding: 10,
    backgroundColor: "#f4f6f9",
  },
  catHeading: {
    color: "#2c3e50",
    fontSize: "1.15em",
    padding: "4px 0",
  },
  spent: {
    margin: "16px 10px 10px 0",
    padding: "10px 30px",
    border: "2px solid",
    borderColor: "#2c3e50",
    borderRadius: "0.5em",
    color: "#2c3e50",
  },
  day: {
    fontSize: "0.9em",
    color: "#2c3e50",
  },
  totalSpent: {
    fontSize: "4rem",
    margin: 20,
    marginBottom: 30,
    color: "#2c3e50",
    textAlign: "center",
    fontWeight: 400,
  },
  detailLink: {
    textDecoration: "none",
  },
  expenses: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const ExpenseOverview = (props) => {
  const classes = useStyles();
  const [expensePreview, setExpensePreview] = useState({
    month: 0,
    today: 0,
    yesterday: 0,
  });
  const [expenseCategories, setExpenseCategories] = useState([]);
  const monthlyPreview = async () => {
    const monthlyResponse = await currentMonthPreview(props.userId);
    setExpensePreview(monthlyResponse.data);
  };

  const categoryExpenses = async () => {
    const categoryResponse = await expenseByCategory(props.userId);
    setExpenseCategories(categoryResponse.data);
    console.log(categoryResponse.data);
  };
  useEffect(() => {
    monthlyPreview();
    categoryExpenses();
  }, []);

  return (
    <Card className={classes.card}>
      <Typography
        variant="h4"
        className={classes.title2}
        color="textPrimary"
        style={{ textAlign: "center" }}
      >
        You've spent
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography component="span" className={classes.totalSpent}>
          ₹{expensePreview.month ? expensePreview.month.totalSpent : "0"}
          <span style={{ display: "block", fontSize: "0.3em" }}>
            SO FAR THIS MONTH
          </span>
        </Typography>
        <div style={{ margin: "20px 20px 20px 30px" }}>
          <Typography variant="h5" className={classes.spent}>
            ₹{expensePreview.today ? expensePreview.today.totalSpent : "0"}{" "}
            <span className={classes.day}>TODAY</span>
          </Typography>
          <Typography variant="h5" className={classes.spent}>
            ₹
            {expensePreview.yesterday
              ? expensePreview.yesterday.totalSpent
              : "0"}{" "}
            <span className={classes.day}>YESTERDAY </span>
          </Typography>
          <Typography
            variant="h6"
            color="primary"
            component={Link}
            className={classes.detailLink}
            to={`/main/expenses/${props.userId}`}
          >
            See Detailed Report
          </Typography>
        </div>
      </div>
      <Divider />
      <div className={classes.categorySection}>
        {expenseCategories.map((expense, index) => {
          return (
            <div style={{ justifyContent: "center" }} key={index}>
              <Typography variant="h5" className={classes.catTitle}>
                {expense._id}
              </Typography>
              <Divider className={classes.catDiv} />
              <div className={classes.expenses}>
                <Paper className={classes.paper}>
                  <Grid container spacing={3}>
                    <Grid item xs={6} sm={12}>
                      <div>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={4}>
                            <Typography
                              className={`₹{classes.catHeading} ₹{classes.val}`}
                            >
                              Past Average
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography
                              className={`₹{classes.catHeading} ₹{classes.val}`}
                            >
                              This Month
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography
                              className={`₹{classes.catHeading} ₹{classes.val}`}
                            >
                              {expense.mergedValues.total &&
                              expense.mergedValues.total -
                                expense.mergedValues.average >
                                0
                                ? "spent extra"
                                : "saved"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                    <Grid item xs={6} sm={12}>
                      <div style={{ marginBottom: 3 }}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={4}>
                            <Typography
                              className={classes.val}
                              style={{ color: "#595555", fontSize: "1.25em" }}
                            >
                              ₹{expense.mergedValues.average}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography
                              className={classes.val}
                              style={{
                                color: "#002f6c",
                                fontSize: "1.6em",
                              }}
                            >
                              ₹
                              {expense.mergedValues.total
                                ? expense.mergedValues.total
                                : 0}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography
                              className={classes.val}
                              style={{ color: "#484646", fontSize: "1.25em" }}
                            >
                              ₹
                              {expense.mergedValues.total
                                ? Math.abs(
                                    expense.mergedValues.total -
                                      expense.mergedValues.average
                                  )
                                : expense.mergedValues.average}
                            </Typography>
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                  </Grid>
                </Paper>
              </div>

              <Divider style={{ marginBottom: 10 }} />
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ExpenseOverview;
