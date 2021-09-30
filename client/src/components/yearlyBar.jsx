import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { VictoryTheme, VictoryAxis, VictoryBar, VictoryChart } from "victory";
import { yearlyExpenses } from "../services/expensesService";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: `32px ${theme.spacing(2.5)}px 2px`,
    color: theme.palette.primary.main,
    display: "inline",
  },
}));
const YearlyBar = (props) => {
  const classes = useStyles();
  const [error, setError] = useState("");
  const [year, setYear] = useState(new Date());
  const [yearlyExpense, setYearlyExpense] = useState([]);
  const monthStrings = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let selectedYear = year.getFullYear();
  const yearlyPlot = async () => {
    const response = await yearlyExpenses(selectedYear, props.userId);
    setYearlyExpense(response.data);
  };

  useEffect(() => {
    yearlyPlot();
  }, []);

  const handleDateChange = async (date) => {
    setYear(date);
    const response = await yearlyExpenses(selectedYear, props.userId);
    setYearlyExpense(response.data);
  };

  return (
    <div>
      <Typography variant="h6" className={classes.title}>
        Your monthly expenditures in
      </Typography>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          value={year}
          onChange={handleDateChange}
          views={["year"]}
          disableFuture
          label="Year"
          animateYearScrolling
          variant="inline"
        />
      </MuiPickersUtilsProvider>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={10}
        height={300}
        width={450}
      >
        <VictoryAxis />
        <VictoryBar
          categories={{
            x: monthStrings,
          }}
          style={{
            data: { fill: "#69f0ae", width: 20 },
            labels: { fill: "#01579b" },
          }}
          data={yearlyExpense.monthTot}
          x={monthStrings["x"]}
          domain={{ x: [0, 13] }}
          labels={({ datum }) => `₹${datum.y}`}
        />
      </VictoryChart>
    </div>
  );
};

export default YearlyBar;
