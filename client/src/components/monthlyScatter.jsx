import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import {
  VictoryTheme,
  VictoryScatter,
  VictoryChart,
  VictoryTooltip,
  VictoryLabel,
} from "victory";

import { plotExpenses } from "../services/expensesService";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: `32px ${theme.spacing(2.5)}px 2px`,
    color: theme.palette.primary.main,
    display: "inline",
  },
}));
const MonthlyScatter = (props) => {
  const classes = useStyles();
  const [error, setError] = useState("");
  const [plot, setPlot] = useState([]);
  const [month, setMonth] = useState(new Date());

  const monthlyPlot = async () => {
    const response = await plotExpenses(month, props.userId);
    setPlot(response.data);
  };

  useEffect(() => {
    monthlyPlot();
  }, []);

  const handleDateChange = (date) => {
    setMonth(date);
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <Typography variant="h6" className={classes.title}>
        Expenses scattered over{" "}
      </Typography>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          value={month}
          onChange={handleDateChange}
          views={["year", "month"]}
          disableFuture
          label="Month"
          animateYearScrolling
          variant="inline"
        />
      </MuiPickersUtilsProvider>
      <VictoryChart
        theme={VictoryTheme.material}
        height={400}
        width={550}
        domainPadding={40}
      >
        <VictoryScatter
          style={{
            data: { fill: "#01579b", stroke: "#69f0ae", strokeWidth: 2 },
            labels: { fill: "#01579b", fontSize: 10, padding: 8 },
          }}
          bubbleProperty="y"
          maxBubbleSize={15}
          minBubbleSize={5}
          labels={({ datum }) => `₹${datum.y} on ${datum.x}th`}
          labelComponent={<VictoryTooltip />}
          data={plot}
          domain={{ x: [0, 31] }}
        />
        <VictoryLabel
          textAnchor="middle"
          style={{ fontSize: 14, fill: "#8b8b8b" }}
          x={270}
          y={390}
          text={`day of month`}
        />
        <VictoryLabel
          textAnchor="middle"
          style={{ fontSize: 14, fill: "#8b8b8b" }}
          x={6}
          y={190}
          angle={270}
          text={`Amount (₹)`}
        />
      </VictoryChart>
    </div>
  );
};

export default MonthlyScatter;
