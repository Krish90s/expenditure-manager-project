import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { Typography, Button } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { VictoryPie, VictoryTheme, VictoryLabel } from "victory";

import { plotByCategory } from "../services/expensesService";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: `16px ${theme.spacing(2.5)}px 2px`,
    color: theme.palette.primary.main,
    display: "inline",
  },
  search: {
    display: "flex",
    alignItems: "center",
  },
  textField: {
    margin: "8px 16px",
    width: 240,
  },
}));

const CategoryPie = (props) => {
  const classes = useStyles();
  const [error, setError] = useState("");
  const [expenses, setExpenses] = useState([]);
  const date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  const [firstDay, setFirstDay] = useState(new Date(y, m, 1));
  const [lastDay, setLastDay] = useState(new Date(y, m + 1, 0));

  const plotCategory = async () => {
    const response = await plotByCategory(firstDay, lastDay, props.userId);
    setExpenses(response.data.monthAVG);
  };

  useEffect(() => {
    plotCategory();
  }, []);

  const handleDateChange = (name) => (date) => {
    if (name === "firstDay") {
      setFirstDay(date);
    } else {
      setLastDay(date);
    }
  };
  const searchClicked = async (e) => {
    e.preventDefault();
    const response = await plotByCategory(firstDay, lastDay, props.userId);
    setExpenses(response.data.monthAVG);
  };
  return (
    <div>
      <div className={classes.search}>
        <Typography variant="h6" className={classes.title}>
          Expenditures per category{" "}
        </Typography>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            disableFuture
            format="dd/MM/yyyy"
            label="FROM"
            views={["year", "month", "date"]}
            value={firstDay}
            className={classes.textField}
            onChange={handleDateChange("firstDay")}
          />
          <DatePicker
            format="dd/MM/yyyy"
            label="TO"
            views={["year", "month", "date"]}
            value={lastDay}
            className={classes.textField}
            onChange={handleDateChange("lastDay")}
          />
        </MuiPickersUtilsProvider>
        <Button variant="contained" color="secondary" onClick={searchClicked}>
          GO
        </Button>
      </div>

      <div style={{ width: 550, margin: "auto" }}>
        <svg viewBox="0 0 320 320">
          <VictoryPie
            standalone={false}
            data={expenses}
            innerRadius={50}
            theme={VictoryTheme.material}
            labelRadius={({ innerRadius }) => innerRadius + 14}
            labelComponent={
              <VictoryLabel
                angle={0}
                style={[
                  {
                    fontSize: "11px",
                    fill: "#0f0f0f",
                  },
                  {
                    fontSize: "10px",
                    fill: "#013157",
                  },
                ]}
                text={({ datum }) => `${datum.x}\n ₹${datum.y}`}
              />
            }
          />
          <VictoryLabel
            textAnchor="middle"
            style={{ fontSize: 14, fill: "#8b8b8b" }}
            x={175}
            y={170}
            text={`Spent \nper category`}
          />
        </svg>
      </div>
    </div>
  );
};

export default CategoryPie;
