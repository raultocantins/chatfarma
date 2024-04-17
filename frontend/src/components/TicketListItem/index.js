import React, { useState, useEffect, useRef, useContext } from "react";

import { useHistory, useParams } from "react-router-dom";

import { parseISO, format, isSameDay } from "date-fns";

import {
  Avatar,
  Badge,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography,
  Tooltip,
} from "@material-ui/core";

import { ClearOutlined, Done, Replay, Visibility } from "@material-ui/icons";

import { green } from "@material-ui/core/colors";

import AcceptTicketWithouSelectQueue from "../AcceptTicketWithoutQueueModal";
import MarkdownWrapper from "../MarkdownWrapper";

import { AuthContext } from "../../context/Auth/AuthContext";
import toastError from "../../errors/toastError";
import clsx from "clsx";
import { i18n } from "../../translate/i18n";
import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
  ticket: {
    position: "relative",
  },
  pendingTicket: {
    cursor: "unset",
  },
  noTicketsDiv: {
    display: "flex",
    height: "100px",
    margin: 40,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  noTicketsText: {
    textAlign: "center",
    color: "rgb(104, 121, 146)",
    fontSize: "14px",
    lineHeight: "1.4",
  },
  noTicketsTitle: {
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "600",
    margin: "0px",
  },
  contactNameWrapper: {
    display: "flex",
    justifyContent: "space-between",
  },
  lastMessageTime: {
    justifySelf: "flex-end",
  },
  closedBadge: {
    alignSelf: "center",
    justifySelf: "flex-end",
    marginRight: 32,
    marginLeft: "auto",
  },
  contactLastMessage: {
    paddingRight: 20,
  },
  newMessagesCount: {
    alignSelf: "center",
    marginRight: 0,
    marginLeft: "auto",
  },
  bottomButton: {
    position: "relative",
  },
  badgeStyle: {
    color: "white",
    backgroundColor: green[500],
    margin: 10,
  },
  acceptButton: {
    position: "absolute",
    left: "50%",
  },
  ticketQueueColor: {
    flex: "none",
    width: "5px",
    height: "100%",
    position: "absolute",
    top: "0%",
    left: "0%",
  },
  userTag: {
    position: "absolute",
    marginRight: 5,
    right: 10,
    bottom: 30,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.primary.main,
    border: "1px solid #CCC",
    padding: 1,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 10,
    fontSize: "0.9em",
  },
  Radiusdot: {
    "& .MuiBadge-badge": {
      borderRadius: 2,
      position: "inherit",
      height: 10,
      margin: 2,
      padding: 3,
    },
    "& .MuiBadge-anchorOriginTopRightRectangle": {
      transform: "scale(1) translate(0%, -40%)",
    },
  },
  secondaryContentSecond: {
    display: "flex",
    marginTop: 2,
    alignItems: "flex-start",
    flexWrap: "wrap",
    flexDirection: "row",
    alignContent: "flex-start",
  },
}));

const TicketListItem = ({ ticket, userId }) => {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { ticketId } = useParams();
  const isMounted = useRef(true);
  const { user } = useContext(AuthContext);
  const [
    acceptTicketWithouSelectQueueOpen,
    setAcceptTicketWithouSelectQueueOpen,
  ] = useState(false);
  const [, setTag] = useState([]);
  const [, setUserName] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const fetchTicket = async () => {
        try {
          const { data } = await api.get("/tickets/" + ticket.id);
          setTag(data?.contact?.tags);
        } catch (err) {}
      };
      fetchTicket();
    }, 500);
    return () => {
      if (delayDebounceFn !== null) {
        clearTimeout(delayDebounceFn);
      }
    };
  }, [ticket.id, user, history]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleAcepptTicket = async (id) => {
    setLoading(true);
    try {
      await api.put(`/tickets/${id}`, {
        status: "open",
        userId: user?.id,
      });
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
    if (isMounted.current) {
      setLoading(false);
    }
    history.push(`/tickets/${id}`);
  };

  const queueName = (selectedTicket) => {
    let name = null;
    let color = null;
    user.queues.forEach((userQueue) => {
      if (userQueue.id === selectedTicket.queueId) {
        name = userQueue.name;
        color = userQueue.color;
      }
    });
    return {
      name,
      color,
    };
  };

  const handleOpenAcceptTicketWithouSelectQueue = () => {
    setAcceptTicketWithouSelectQueueOpen(true);
  };

  const handleReopenTicket = async (id) => {
    setLoading(true);
    try {
      await api.put(`/tickets/${id}`, {
        status: "open",
        userId: user?.id,
      });
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
    if (isMounted.current) {
      setLoading(false);
    }
    history.push(`/tickets/${id}`);
  };

  const handleViewTicket = async (id) => {
    setLoading(true);
    try {
      await api.put(`/tickets/${id}`, {
        status: "pending",
      });
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
    if (isMounted.current) {
      setLoading(false);
    }
    history.push(`/tickets/${id}`);
  };

  const handleClosedTicket = async (id) => {
    setLoading(true);
    try {
      await api.put(`/tickets/${id}`, {
        status: "closed",
        userId: user?.id,
      });
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
    if (isMounted.current) {
      setLoading(false);
    }
    history.push(`/tickets/${id}`);
  };

  const handleSelectTicket = (id) => {
    history.push(`/tickets/${id}`);
  };

  if (ticket.status === "pending") {
  } else {
    const fetchUserName = async () => {
      try {
        const { data } = await api.get("/users/" + ticket.userId, {});
        setUserName(data["name"]);
      } catch (err) {
        toastError(err);
      }
    };
    fetchUserName();
  }

  return (
    <React.Fragment key={ticket.id}>
      <AcceptTicketWithouSelectQueue
        modalOpen={acceptTicketWithouSelectQueueOpen}
        onClose={(e) => setAcceptTicketWithouSelectQueueOpen(false)}
        ticketId={ticket.id}
      />
      <ListItem
        dense
        button
        onClick={(e) => {
          if (ticket.status === "pending") return;
          handleSelectTicket(ticket.id);
        }}
        selected={ticketId && +ticketId === ticket.id}
        className={clsx(classes.ticket, {
          [classes.pendingTicket]: ticket.status === "pending",
        })}
      >
        <Tooltip
          arrow
          placement="right"
          title={
            ticket.queue?.name ||
            ticket?.name ||
            i18n.t("ticketsList.items.queueless")
          }
        >
          <span
            style={{
              backgroundColor:
                ticket.queue?.color || queueName(ticket)?.color || "#7C7C7C",
            }}
            className={classes.ticketQueueColor}
          ></span>
        </Tooltip>
        <Tooltip
          arrow
          placement="right"
          title={
            ticket.queue?.name ||
            ticket?.name ||
            i18n.t("ticketsList.items.queueless")
          }
        >
          <ListItemAvatar>
            <Badge
              className={classes.newMessagesCount}
              badgeContent={ticket.unreadMessages}
              max={9999}
              classes={{
                badge: classes.badgeStyle,
              }}
            >
              <Avatar
                style={{
                  width: "50px",
                  height: "50px",
                }}
                src={ticket?.contact?.profilePicUrl}
              />
            </Badge>
          </ListItemAvatar>
        </Tooltip>

        <ListItemText
          disableTypography
          primary={
            <span>
              <div>
                {ticket.whatsappId && (
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    style={{
                      position: "absolute",
                      right: 15,
                      top: 13,
                      height: 16,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {isSameDay(parseISO(ticket.updatedAt), new Date()) ? (
                      <>{format(parseISO(ticket.updatedAt), "HH:mm")}</>
                    ) : (
                      <>{format(parseISO(ticket.updatedAt), "dd/MM/yyyy")}</>
                    )}
                  </Typography>
                )}
              </div>
              <Typography
                noWrap
                component="span"
                variant="body2"
                color="textPrimary"
              >
                {ticket.contact.name}
              </Typography>
              <br></br>
            </span>
          }
          secondary={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                <Typography
                  className={classes.contactLastMessage}
                  noWrap
                  variant="caption"
                  color="textSecondary"
                >
                  {ticket.lastMessage ? (
                    <MarkdownWrapper>
                      {ticket.lastMessage.slice(0, 20) +
                        (ticket.lastMessage.length > 20 ? " ..." : "")}
                    </MarkdownWrapper>
                  ) : (
                    <br />
                  )}
                </Typography>
              </span>

              <div>
                {ticket.status === "pending" &&
                  (ticket.queue === null || ticket.queue === undefined) && (
                    <Tooltip title={i18n.t("ticketsList.items.accept")}>
                      <IconButton
                        size="small"
                        className={classes.bottomButton}
                        color="primary"
                        onClick={(e) =>
                          handleOpenAcceptTicketWithouSelectQueue()
                        }
                        loading={loading}
                      >
                        <Done />
                      </IconButton>
                    </Tooltip>
                  )}

                {ticket.status === "pending" && ticket.queue !== null && (
                  <Tooltip title={i18n.t("ticketsList.items.accept")}>
                    <IconButton
                      size="small"
                      className={classes.bottomButton}
                      color="primary"
                      onClick={(e) => handleAcepptTicket(ticket.id)}
                    >
                      <Done />
                    </IconButton>
                  </Tooltip>
                )}

                {ticket.status === "pending" && (
                  <Tooltip title={i18n.t("ticketsList.items.spy")}>
                    <IconButton
                      size="small"
                      className={classes.bottomButton}
                      color="primary"
                      onClick={(e) => handleViewTicket(ticket.id)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                )}

                {ticket.status === "pending" && (
                  <Tooltip title={i18n.t("ticketsList.items.close")}>
                    <IconButton
                      size="small"
                      className={classes.bottomButton}
                      color="primary"
                      onClick={(e) => handleClosedTicket(ticket.id)}
                    >
                      <ClearOutlined />
                    </IconButton>
                  </Tooltip>
                )}

                {ticket.status === "open" && (
                  <Tooltip title={i18n.t("ticketsList.items.return")}>
                    <IconButton
                      size="small"
                      className={classes.bottomButton}
                      color="primary"
                      onClick={(e) => handleViewTicket(ticket.id)}
                    >
                      <Replay />
                    </IconButton>
                  </Tooltip>
                )}

                {ticket.status === "open" && (
                  <Tooltip title={i18n.t("ticketsList.items.close")}>
                    <IconButton
                      size="small"
                      className={classes.bottomButton}
                      color="primary"
                      onClick={(e) => handleClosedTicket(ticket.id)}
                    >
                      <ClearOutlined />
                    </IconButton>
                  </Tooltip>
                )}

                {ticket.status === "closed" && (
                  <IconButton
                    size="small"
                    className={classes.bottomButton}
                    color="primary"
                    onClick={(e) => handleReopenTicket(ticket.id)}
                  >
                    <Replay />
                  </IconButton>
                )}

                {ticket.status === "closed" && (
                  <IconButton
                    size="small"
                    className={classes.bottomButton}
                    color="primary"
                  ></IconButton>
                )}
              </div>
            </div>
          }
        />
      </ListItem>

      <Divider variant="inset" component="li" />
    </React.Fragment>
  );
};

export default TicketListItem;
