import React, { useState, useEffect } from "react";
import { alpha } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Divider,
  TextField,
  Button,
  Grid,
} from "@material-ui/core";
import Edit from "@material-ui/icons/Edit";
import {
  DatePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import DeleteExpense from "../components/deleteExpense";

import Icon from "@material-ui/core/Icon";
import { Link } from "react-router-dom";
import { getExpenses, updateExpense } from "../services/expensesService";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    margin: "auto",
    marginTop: 40,
    marginBottom: 40,
  },
  heading: {
    fontSize: "1.5em",
    fontWeight: theme.typography.fontWeightRegular,

    marginTop: 12,
    marginBottom: 4,
  },
  error: {
    verticalAlign: "middle",
  },
  notes: {
    color: "grey",
  },
  panel: {
    margin: 6,
  },
  info: {
    marginRight: 32,
    width: 90,
  },
  amount: {
    fontSize: "2em",
    color: "#2c3e50",
  },
  search: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: "2rem",
  },
  textField: {
    margin: "8px 16px",
    width: 240,
  },
  buttons: {
    textAlign: "right",
  },
  status: {
    marginRight: 8,
  },
  date: {
    fontSize: "0.8em",
    color: "#8b8b8b",
    marginTop: 4,
  },
  header: {},
}));

const Expenses = (props) => {
  const classes = useStyles();

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [expenses, setExpenses] = useState([]);
  const date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  const [firstDay, setFirstDay] = useState(new Date(y, m, 1));
  const [lastDay, setLastDay] = useState(new Date(y, m + 1, 0));

  const allExpenses = async () => {
    const Response = await getExpenses(
      firstDay,
      lastDay,
      props.match.params.id
    );
    setExpenses(Response.data);
    console.log(Response.data);
  };
  useEffect(() => {
    allExpenses();
  }, []);

  const handleSearchFieldChange = (name) => (date) => {
    if (name === "firstDay") {
      setFirstDay(date);
    } else {
      setLastDay(date);
    }
  };

  const handleChange = (name, index) => (event) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index][name] = event.target.value;
    setExpenses(updatedExpenses);
  };

  const handleDateChange = (index) => (date) => {
    const updatedExpenses = [...expenses];
    updatedExpenses[index].incurred_on = date;
    setExpenses(updatedExpenses);
  };

  const clickUpdate = async (index) => {
    let expense = expenses[index];
    await updateExpense(expense);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const removeExpense = (expense) => {
    const updatedExpenses = [...expenses];
    const index = updatedExpenses.indexOf(expense);
    updatedExpenses.splice(index, 1);
    setExpenses(updatedExpenses);
  };

  const searchClicked = async () => {
    const data = await getExpenses(
      { firstDay: firstDay, lastDay: lastDay },
      props.match.params.id
    );
    console.log(data);
  };

  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography style={{ marginBottom: "1rem" }}>
          SHOWING RECORDS
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/main/expenses/new`}
        >
          Add New Expense
        </Button>
      </Grid>

      <div className={classes.search}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            disableFuture
            format="dd/MM/yyyy"
            label="FROM"
            className={classes.textField}
            views={["year", "month", "date"]}
            value={firstDay}
            onChange={handleSearchFieldChange("firstDay")}
          />
          <DatePicker
            format="dd/MM/yyyy"
            label="TO"
            className={classes.textField}
            views={["year", "month", "date"]}
            value={lastDay}
            onChange={handleSearchFieldChange("lastDay")}
          />
        </MuiPickersUtilsProvider>
        <Button variant="contained" color="secondary" onClick={searchClicked}>
          GO
        </Button>
      </div>
      {expenses.map((expense, index) => {
        return (
          <span key={index}>
            <Accordion className={classes.panel}>
              <AccordionSummary expandIcon={<Edit />}>
                <div className={classes.info}>
                  <Typography className={classes.amount}>
                    ₹ {expense.amount}
                  </Typography>
                  <Divider style={{ marginTop: 4, marginBottom: 4 }} />
                  <Typography>{expense.category}</Typography>
                  <Typography className={classes.date}>
                    {new Date(expense.incurred_on).toLocaleDateString()}
                  </Typography>
                </div>
                <div>
                  <Typography className={classes.heading}>
                    {expense.title}
                  </Typography>
                  <Typography className={classes.notes}>
                    {expense.notes}
                  </Typography>
                </div>
              </AccordionSummary>
              <Divider />
              <AccordionDetails style={{ display: "block" }}>
                <div>
                  <TextField
                    label="Title"
                    className={classes.textField}
                    value={expense.title}
                    onChange={handleChange("title", index)}
                    margin="normal"
                  />
                  <TextField
                    label="Amount (₹)"
                    className={classes.textField}
                    value={expense.amount}
                    onChange={handleChange("amount", index)}
                    margin="normal"
                    type="number"
                  />
                </div>
                <div>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                      label="Incurred on"
                      className={classes.textField}
                      views={["year", "month", "date"]}
                      value={expense.incurred_on}
                      onChange={handleDateChange(index)}
                      showTodayButton
                    />
                  </MuiPickersUtilsProvider>
                  <TextField
                    label="Category"
                    className={classes.textField}
                    value={expense.category}
                    onChange={handleChange("category", index)}
                    margin="normal"
                  />
                </div>
                <TextField
                  label="Notes"
                  multiline
                  rows="2"
                  value={expense.notes}
                  onChange={handleChange("notes", index)}
                  className={classes.textField}
                  margin="normal"
                />
                <div className={classes.buttons}>
                  {error && (
                    <Typography component="p" color="error">
                      <Icon color="error" className={classes.error}>
                        error
                      </Icon>
                      {error}
                    </Typography>
                  )}
                  {saved && (
                    <Typography
                      component="span"
                      color="secondary"
                      className={classes.status}
                    >
                      Saved
                    </Typography>
                  )}
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => clickUpdate(index)}
                    className={classes.submit}
                  >
                    Update
                  </Button>
                  <DeleteExpense expense={expense} onRemove={removeExpense} />
                </div>
              </AccordionDetails>
            </Accordion>
          </span>
        );
      })}
    </div>
  );
};

export default Expenses;
