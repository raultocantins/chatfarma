import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import api from "../../services/api";
import Board from "react-trello";
import { differenceInMinutes } from "date-fns";
import Title from "../../components/Title";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignContent: "flex-start",
    width: "100%",
    height: "100vh",
  },
  button: {
    background: "#10a110",
    border: "none",
    padding: "10px",
    color: "white",
    fontWeight: "bold",
    borderRadius: "5px",
  },
  title: {
    padding: theme.spacing(2),
  },
  statusOnlineIcon: {
    color: "#64A764",
  },
  statusOfflineIcon: {
    color: "#A76464",
  },
}));

const Kanban = () => {
  const classes = useStyles();
  const history = useHistory();
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);

  // eslint-disable-next-line
  const fetchTickets = async () => {
    try {
      const { data } = await api.get("/kanban");
      setTickets(data.tickets);
      setUsers(data.users);
    } catch (err) {
      setTickets([]);
    }
  };
  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTickets();
    }, 30000); //atualizando em 30 segundos
    return () => {
      clearInterval(interval);
    };
  }, [fetchTickets]);

  const timeSinceCreation = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const minutesDifference = differenceInMinutes(now, createdDate);
    return `${minutesDifference} minutos`;
  };
  const statusTranslation = {
    pending: "Pendente",
    open: "Aberto",
  };
  const statusOrder = ["open", "pending"];

  const conversationsByStatus = tickets.reduce((acc, conversation) => {
    const { status } = conversation;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(conversation);
    return acc;
  }, {});
  const userOnline = users.filter((e) => e.status === "online");
  const userOffline = users.filter((e) => e.status === "offline");
  const usersOnlineColumn = {
    id: "users",
    title: "Usuários online",
    cards: userOnline.map((user) => ({
      id: user.id,
      draggable: false,
      title: user.name,
      description: (
        <Typography variant="caption">
          Status do atendente:{" "}
          <Typography variant="caption" className={classes.statusOnlineIcon}>
            {user.status}
          </Typography>
        </Typography>
      ),
    })),
  };

  const usersOfflineColumn = {
    id: "users",
    title: "Usuários offline",
    cards: userOffline.map((user) => ({
      id: user.id,
      draggable: false,
      title: user.name,
      description: (
        <Typography variant="caption">
          Status do atendente:{" "}
          <Typography variant="caption" className={classes.statusOfflineIcon}>
            {user.status}
          </Typography>
        </Typography>
      ),
    })),
  };
  const columns = statusOrder.map((status) => ({
    id: status,
    title: statusTranslation[status] || status,

    cards: (conversationsByStatus[status] || []).map((conversation) => ({
      id: conversation.id,
      draggable: false,
      title: conversation.contact.name,
      description: `Tempo de atendimento: ${timeSinceCreation(
        conversation.createdAt
      )}`,
    })),
  }));

  const goToTicket = (id) => {
    history.push(`/tickets/${id}`);
  };

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Title>Painel</Title>
      </div>
      <Board
        data={{ lanes: [...columns, usersOnlineColumn, usersOfflineColumn] }}
        hideCardDeleteIcon={true}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "rgba(252, 252, 252, 0.03)",
        }}
        laneStyle={{ minWidth: "0", flex: "1" }}
        onCardClick={(cardId, _, laneId) => {
          if (laneId === "pending" || laneId === "open") {
            goToTicket(cardId);
          }
        }}
      />
    </div>
  );
};

export default Kanban;
