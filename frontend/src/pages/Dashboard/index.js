import React, { useEffect, useState } from "react";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";

import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { i18n } from "../../translate/i18n";

import Title from "./Title";
import DayChart from "./DayChart";
import UsersChart from "./UsersChart";
import QueueChart from "./QueueChart";
import api from "../../services/api";
import toastError from "../../errors/toastError";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";

import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import "./css/calendar.css";
const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  fixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: 400,
  },
  customFixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: 120,
  },
  customFixedHeightPaperLg: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
  },

  paddingGrid: {
    padding: theme.spacing(2),
  },
  autoComplete: {
    width: 150,
  },
  filtersGrid: {
    padding: theme.spacing(0, 0, 2, 0),
  },
  calendar: {
    background: theme.palette.background.paper,
    marginRight: 24,
  },
  queueSelect: {
    background: theme.palette.background.paper,
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [selectedQueue, setSelectedQueue] = useState("");
  const [queues, setQueues] = useState([]);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);

  const handleSelect = (range) => {
    if (range) {
      setDateRange(range);
    } else {
      setDateRange([new Date(), new Date()]);
    }
  };
  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchTickets = async () => {
        try {
          const { data } = await api.get("/tickets/dash", {
            params: {
              dateRange,
              queueId: selectedQueue,
            },
          });
          setTickets(data.tickets);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          toastError(err);
        }
      };
      fetchTickets();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [selectedQueue, dateRange]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get("/queue/dash");
        setQueues(data);
      } catch (err) {
        toastError(err);
      }
    };
    fetchTickets();
  }, []);

  const getCountByStatus = (tickets, status) => {
    let count = 0;
    tickets.forEach((e) => {
      if (e.status === status) {
        count += 1;
      } else {
        return;
      }
    });
    return count;
  };

  return (
    <div>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container className={classes.filtersGrid}>
          <DateRangePicker
            value={dateRange}
            onChange={handleSelect}
            className={classes.calendar}
          />
          <FormControl
            variant="outlined"
            className={classes.queueSelect}
            size="small"
          >
            <InputLabel>Departamento</InputLabel>
            <Select
              required
              value={selectedQueue}
              className={classes.autoComplete}
              onChange={(e) => {
                setSelectedQueue(e.target.value);
              }}
              label="Departamento"
            >
              <MenuItem value={""}>Todos</MenuItem>
              {queues.map((queue) => (
                <MenuItem
                  key={queue.id}
                  value={queue.id}
                  onClick={() => {
                    if (queue.id === selectedQueue) {
                      setSelectedQueue("");
                    }
                  }}
                >
                  {queue.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Paper
              elevation={0}
              className={classes.customFixedHeightPaper}
              style={{ overflow: "hidden" }}
            >
              <Typography component="h3" variant="h6" color="primary" paragraph>
                {i18n.t("dashboard.messages.inAttendance.title")}
              </Typography>
              <Grid item>
                <Typography component="h1" variant="h4">
                  {getCountByStatus(tickets, "open")}
                </Typography>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              elevation={0}
              className={classes.customFixedHeightPaper}
              style={{ overflow: "hidden" }}
            >
              <Typography component="h3" variant="h6" color="primary" paragraph>
                {i18n.t("dashboard.messages.waiting.title")}
              </Typography>
              <Grid item>
                <Typography component="h1" variant="h4">
                  {getCountByStatus(tickets, "pending")}
                </Typography>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              elevation={0}
              className={classes.customFixedHeightPaper}
              style={{ overflow: "hidden" }}
            >
              <Typography component="h3" variant="h6" color="primary" paragraph>
                {i18n.t("dashboard.messages.closed.title")}
              </Typography>
              <Grid item>
                <Typography component="h1" variant="h4">
                  {getCountByStatus(tickets, "closed")}
                </Typography>
              </Grid>
            </Paper>
          </Grid>
          {/* <Grid item xs={12}>
            <Title>Atendimentos por horário</Title>
            <Paper elevation={0} className={classes.fixedHeightPaper}>
              <TimeChart loading={loading} tickets={tickets} />
            </Paper>
          </Grid> */}

          <Grid item xs={12}>
            <Title>Atendimentos por dia</Title>
            <Paper elevation={0} className={classes.fixedHeightPaper}>
              <DayChart loading={loading} tickets={tickets} />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Title>Atendimentos por usuário</Title>
            <Paper elevation={0} className={classes.fixedHeightPaper}>
              <UsersChart loading={loading} tickets={tickets} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Title>Atendimentos por departamento</Title>
            <Paper elevation={0} className={classes.fixedHeightPaper}>
              <QueueChart loading={loading} tickets={tickets} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
