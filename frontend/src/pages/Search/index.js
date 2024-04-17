import React, { useEffect, useState } from "react";
import { Visibility } from "@material-ui/icons";

import {
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  TextField,
  CircularProgress,
  Avatar,
} from "@material-ui/core";

import MainContainer from "../../components/MainContainer";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import Title from "../../components/Title";

import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { formateDateWithHours } from "../../utils/dateUtils";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";

import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import "../Dashboard/css/calendar.css";
const filter = createFilterOptions({
  trim: true,
});
const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  customTableCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    padding: theme.spacing(2),
  },
  maxWidth: {
    width: 150,
    margin: 5,
  },

  searchBtn: {
    margin: 10,
  },
  filters: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    margin: theme.spacing(0, 2, 0, 2),
  },
  avatar: {
    width: "50px",
    height: "50px",
    marginRight: 10,
  },
  contactCell: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  calendar: {
    background: theme.palette.background.paper,
    height: 40,
    margin: 5,
  },
}));

const Search = () => {
  const classes = useStyles();
  const history = useHistory();
  const [data, setData] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedQueue, setSelectedQueue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchParam, setSearchParam] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingContact, setLoadingContact] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/search/filters");
        setData(data);
        setLoading(false);
      } catch (err) {
        toastError(err);
        setLoading(false);
      }
    })();
  }, []);

  const searchTickets = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/search/tickets", {
        params: {
          selectedUser,
          selectedQueue,
          selectedStatus,
          selectedContact,
          startDate: dateRange[0],
          endDate: dateRange[1],
        },
      });
      setTickets(data.tickets);
      setLoading(false);
    } catch (err) {
      toastError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParam.length < 3) {
      setLoadingContact(false);
      return;
    }
    setLoadingContact(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchContacts = async () => {
        try {
          const { data } = await api.get("contacts", {
            params: { searchParam },
          });
          setOptions(data.contacts);
          setLoadingContact(false);
        } catch (err) {
          setLoadingContact(false);
          toastError(err);
        }
      };

      fetchContacts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam]);
  const handleSelectOption = (e, newValue) => {
    if (newValue == null) {
      setSelectedContact(null);
    } else {
      if (newValue?.number) {
        setSelectedContact(newValue.id);
      }
    }
  };

  const renderOption = (option) => {
    if (option.number) {
      return `${option.name} - ${option.number}`;
    }
  };

  const renderOptionLabel = (option) => {
    if (option.number) {
      return `${option.name} - ${option.number}`;
    }
  };

  const createAddContactOption = (filterOptions, params) => {
    const filtered = filter(filterOptions, params);

    if (params.inputValue !== "" && !loading && searchParam.length >= 3) {
      filtered.push({
        name: `${params.inputValue}`,
      });
    }

    return filtered;
  };

  const goToTicketHistory = (id) => {
    history.push(`/tickets/${id}`);
  };

  const handleSelect = (range) => {
    if (range) {
      setDateRange(range);
    } else {
      setDateRange([null, null]);
    }
  };

  const statusToText = (status) => {
    switch (status) {
      case "open":
        return "Aberto";
      case "pending":
        return "Pendente";
      case "closed":
        return "Fechado";
      default:
        return "";
    }
  };

  return (
    <MainContainer>
      <div className={classes.title}>
        <Title>Pesquisa</Title>
      </div>
      <div className={classes.filters}>
        <DateRangePicker
          value={dateRange}
          onChange={handleSelect}
          className={classes.calendar}
        />
        <FormControl
          variant="outlined"
          className={classes.maxWidth}
          size="small"
        >
          <Autocomplete
            clearOnBlur
            autoHighlight
            freeSolo
            clearOnEscape
            options={options}
            loading={loadingContact}
            size="small"
            getOptionLabel={renderOptionLabel}
            renderOption={renderOption}
            filterOptions={createAddContactOption}
            onChange={(e, newValue) => handleSelectOption(e, newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Contato"
                variant="outlined"
                onChange={(e) => setSearchParam(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loadingContact ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
          />
        </FormControl>

        <FormControl
          variant="outlined"
          className={classes.maxWidth}
          size="small"
        >
          <InputLabel>Usuário</InputLabel>
          <Select
            label="Usuário"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {data?.users?.map((user) => (
              <MenuItem
                key={user.id}
                value={user.id}
                onClick={(_) => {
                  if (user.id === selectedUser) {
                    setSelectedUser("");
                  }
                }}
              >
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          variant="outlined"
          className={classes.maxWidth}
          size="small"
        >
          <InputLabel>Departamento</InputLabel>
          <Select
            label="Departamento"
            value={selectedQueue}
            onChange={(e) => setSelectedQueue(e.target.value)}
          >
            {data?.queues?.map((queue) => (
              <MenuItem
                key={queue.id}
                value={queue.id}
                onClick={(_) => {
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
        <FormControl
          variant="outlined"
          className={classes.maxWidth}
          size="small"
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            label="Status"
          >
            {[
              { name: "Aberto", status: "open" },
              { name: "Pendente", status: "pending" },
              { name: "Fechado", status: "closed" },
            ].map((status) => (
              <MenuItem
                key={status.status}
                value={status.status}
                onClick={(_) => {
                  if (status.status === selectedStatus) {
                    setSelectedStatus("");
                  }
                }}
              >
                {status.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          className={classes.searchBtn}
          disabled={
            !(
              selectedUser ||
              selectedQueue ||
              selectedStatus ||
              selectedContact ||
              (dateRange[0] != null && dateRange[1] != null)
            )
          }
          onClick={() => searchTickets()}
        >
          Buscar
        </Button>
      </div>
      <div className={classes.mainPaper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="left">Contato</TableCell>
              <TableCell align="center">Departamento</TableCell>
              <TableCell align="center">Atendente</TableCell>
              <TableCell align="center">Data de criação</TableCell>
              <TableCell align="center">Data da última atualização</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">
                {i18n.t("queues.table.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {tickets?.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className={classes.contactCell}>
                    {
                      <Avatar
                        src={ticket?.contact?.profilePicUrl}
                        className={classes.avatar}
                      />
                    }
                    {ticket?.contact?.name}
                  </TableCell>

                  <TableCell align="center">
                    {ticket?.queue?.name ?? "Sem departamento"}
                  </TableCell>
                  <TableCell align="center">
                    {ticket?.user?.name ?? "Sem atendente"}
                  </TableCell>
                  <TableCell align="center">
                    {formateDateWithHours(ticket?.createdAt)}
                  </TableCell>
                  <TableCell align="center">
                    {formateDateWithHours(ticket?.updatedAt)}
                  </TableCell>
                  <TableCell align="center">
                    {statusToText(ticket?.status)}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => goToTicketHistory(ticket.id)}
                    >
                      <Visibility color="secondary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {loading && <TableRowSkeleton columns={4} />}
            </>
          </TableBody>
        </Table>
      </div>
    </MainContainer>
  );
};

export default Search;
