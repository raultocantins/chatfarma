import React, { useState, useEffect, useReducer } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

import api from "../../services/api";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import toastError from "../../errors/toastError";
import { Box, Button, Collapse, FormControl, InputLabel, MenuItem, Select, Typography } from "@material-ui/core";
import { KeyboardArrowDownOutlined, KeyboardArrowUpOutlined } from "@material-ui/icons";
import MoneyFormat from "../../utils/moneyFormat";
import { formateDateWithHours } from "../../utils/dateUtils";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
const reducer = (state, action) => {
  if (action.type === "LOAD_SALES") {
    const contactLists = action.payload;
    const newContactLists = [];

    contactLists.forEach((contactList) => {
      const contactListIndex = state.findIndex((u) => u.id === contactList.id);
      if (contactListIndex !== -1) {
        state[contactListIndex] = contactList;
      } else {
        newContactLists.push(contactList);
      }
    });

    return [...state, ...newContactLists];
  }

  if (action.type === "RESET_AND_LOAD_SALES") {
    return action.payload;
  }

  if (action.type === "RESET") {
    return [];
  }
};

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  title: {
    padding: theme.spacing(2),
  },
  calendar: {
    background: theme.palette.background.paper,
    height: 40,
    margin: 5,
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

}));

const SalesLists = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [salesList, dispatch] = useReducer(reducer, []);
  const [selectedUser, setSelectedUser] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [data, setData] = useState([]);

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

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, []);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchContactLists = async () => {
        try {
          const { data } = await api.get("/sales");
          dispatch({ type: "LOAD_SALES", payload: data.sales });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchContactLists();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, []);


  const loadMore = async () => {
    setPageNumber((prevState) => prevState + 1);
    setLoading(true);
    try {
      const { data } = await api.get("/sales", {
        params: { pageNumber },
      });
      dispatch({ type: "LOAD_SALES", payload: data.sales });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  };

  const handleScroll = (e) => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };

  const handleSelect = (range) => {
    if (range) {
      setDateRange(range);
    } else {
      setDateRange([null, null]);
    }
  };

  const searchSales = async () => {
    setLoading(true);
    setPageNumber(1);
    try {
      const { data } = await api.get("/sales", {
        params: {
          selectedUser,
          startDate: dateRange[0],
          endDate: dateRange[1],
          pageNumber: 1
        },
      });
      dispatch({ type: "RESET_AND_LOAD_SALES", payload: data.sales });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
      setLoading(false);
    }
  };
  return (
    <MainContainer>
      <MainHeader>
        <div className={classes.title}>
          <Title>Lista de vendas</Title>
        </div>
      </MainHeader>
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
        <Button
          variant="contained"
          color="primary"
          className={classes.searchBtn}
          onClick={() => searchSales()}
        >
          Buscar
        </Button>
      </div>
      <div
        className={classes.mainPaper}
        variant="outlined"
        onScroll={handleScroll}
      >
        <Table >
          <TableHead>
            <TableRow>
              <TableCell align="left">
                Detalhes
              </TableCell>
              <TableCell align="center">
                ID da venda
              </TableCell>
              <TableCell align="center">
                Data da venda
              </TableCell>
              <TableCell align="center">
                Status da venda
              </TableCell>
              <TableCell align="center">
                Atendente
              </TableCell>
              <TableCell align="center">
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesList.map((sale) => <Row key={sale.id} sale={sale} />)}
            {loading && <TableRowSkeleton columns={5} />}
          </TableBody>
        </Table>

      </div>
    </MainContainer>
  );
};


function Row(props) {
  const { sale } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow >
        <TableCell>
          <IconButton aria-label="expand row" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
          </IconButton>
        </TableCell>
        <TableCell align="center" scope="row">
          {sale.id}
        </TableCell>
        <TableCell align="center" scope="row">
          {formateDateWithHours(sale.createdAt)}
        </TableCell>
        <TableCell align="center">     {sale.condition.name}</TableCell>
        <TableCell align="center">     {sale.user.name}</TableCell>
        <TableCell align="center">
          <IconButton

            onClick={(e) => {
            }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </TableCell>

      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Produtos
              </Typography>
              <Table aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>ID do produto</TableCell>
                    <TableCell align="center">Nome do Produto</TableCell>
                    <TableCell align="center">Quantidade</TableCell>
                    <TableCell align="right">Preço Total (R$)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sale.productList.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell component="th" scope="row">
                        {product.id}
                      </TableCell>
                      <TableCell component="th" scope="row" align="center">
                        {product.name}
                      </TableCell>
                      <TableCell align="center">{product.quantity}</TableCell>
                      <TableCell align="right">
                        <MoneyFormat value={product.amount * product.quantity} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default SalesLists;
