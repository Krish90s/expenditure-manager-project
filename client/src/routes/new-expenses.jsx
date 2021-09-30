import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import DateFnsUtils from "@date-io/date-fns";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Link } from "react-router-dom";
import { addExpenses } from "../services/expensesService";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  error: {
    verticalAlign: "middle",
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
    fontSize: "1em",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
  input: {
    display: "none",
  },
  filename: {
    marginLeft: "10px",
  },
}));

const NewExpense = (props) => {
  const classes = useStyles();
  const [values, setValues] = useState({
    title: "",
    category: "",
    amount: "",
    incurred_on: new Date(),
    notes: "",
    error: "",
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleDateChange = (date) => {
    setValues({ ...values, incurred_on: date });
  };
  const clickSubmit = async (e) => {
    e.preventDefault();
    const expense = {
      title: values.title || undefined,
      category: values.category || undefined,
      amount: values.amount || undefined,
      incurred_on: values.incurred_on || undefined,
      notes: values.notes || undefined,
      recorded_by: props.user._id,
    };

    try {
      await addExpenses(expense);
      props.history.push(`/main/expenses/${props.user._id}`);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        setValues({ ...values, error: ex.response.data });
      }
    }
  };
  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            Expense Record
          </Typography>
          <br />
          <TextField
            id="title"
            label="Title"
            className={classes.textField}
            value={values.title}
            onChange={handleChange("title")}
            margin="normal"
          />
          <br />
          <TextField
            id="amount"
            label="Amount ($)"
            className={classes.textField}
            value={values.amount}
            onChange={handleChange("amount")}
            margin="normal"
            type="number"
          />
          <TextField
            id="category"
            label="Category"
            className={classes.textField}
            value={values.category}
            onChange={handleChange("category")}
            margin="normal"
          />
          <br />
          <br />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              label="Incurred on"
              className={classes.textField}
              views={["year", "month", "date"]}
              value={values.incurred_on}
              onChange={handleDateChange}
              showTodayButton
            />
          </MuiPickersUtilsProvider>
          <br />
          <br />
          <TextField
            id="multiline-flexible"
            label="Notes"
            multiline
            rows="2"
            value={values.notes}
            onChange={handleChange("notes")}
            className={classes.textField}
            margin="normal"
          />
          <br /> <br />
          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>
                error
              </Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={clickSubmit}
            className={classes.submit}
          >
            Submit
          </Button>

          <Button
            variant="contained"
            component={Link}
            to={`/expenses`}
            className={classes.submit}
          >
            Cancel
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default NewExpense;
