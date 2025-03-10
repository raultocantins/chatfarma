import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import { MoreVert, Replay } from "@material-ui/icons";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import TicketOptionsMenu from "../TicketOptionsMenu";
import ButtonWithSpinner from "../ButtonWithSpinner";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../Can";
import FinishModal from "../FinishModal";

const useStyles = makeStyles((theme) => ({
  actionButtons: {
    marginRight: 6,
    flex: "none",
    alignSelf: "center",
    marginLeft: "auto",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const TicketActionButtons = ({ ticket }) => {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finishModal, setFinishModal] = useState(false);
  const ticketOptionsMenuOpen = Boolean(anchorEl);
  const { user } = useContext(AuthContext);

  const handleOpenTicketOptionsMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseTicketOptionsMenu = (e) => {
    setAnchorEl(null);
  };

  const handleUpdateTicketStatus = async (e, status, userId, sendFarewellMessage) => {
    setLoading(true);
    try {
      await api.put(`/tickets/${ticket.id}`, {
        status: status,
        userId: userId || null,
        sendFarewellMessage: sendFarewellMessage
      });

      setLoading(false);
      if (status === "open") {
        history.push(`/tickets/${ticket.id}`);
      } else {
        history.push("/tickets");
      }
    } catch (err) {
      setLoading(false);
      toastError(err);
    }
  };

  return (
    <div className={classes.actionButtons}>
      {ticket.status === "closed" && (
        <ButtonWithSpinner
          loading={loading}
          startIcon={<Replay />}
          size="small"
          onClick={(e) => handleUpdateTicketStatus(e, "open", user?.id)}
        >
          {i18n.t("messagesList.header.buttons.reopen")}
        </ButtonWithSpinner>
      )}
      {ticket.status === "open" && (
        <>
          <ButtonWithSpinner
            loading={loading}
            startIcon={<Replay />}
            size="small"
            onClick={(e) => handleUpdateTicketStatus(e, "pending", null)}
          >
            {i18n.t("messagesList.header.buttons.return")}
          </ButtonWithSpinner>
          <ButtonWithSpinner
            loading={loading}
            size="small"
            variant="contained"
            color="primary"
            onClick={(_) => setFinishModal(true)}
          >
            {i18n.t("messagesList.header.buttons.resolve")}
          </ButtonWithSpinner>
          <FinishModal
            title='Finalizar Atendimento'
            open={finishModal}
            onClose={() => setFinishModal(false)}
            onConfirm={(e) => handleUpdateTicketStatus(e, "closed", user?.id, e)}
            primaryText='Sim'
            secondaryText='Não'
            contactId={ticket.contactId}
          >
            Você deseja enviar uma mensagem de encerramento ao encerrar o atendimento?
          </FinishModal>
          <IconButton color="primary" onClick={handleOpenTicketOptionsMenu}>
            <MoreVert />
          </IconButton>
          <TicketOptionsMenu
            ticket={ticket}
            anchorEl={anchorEl}
            menuOpen={ticketOptionsMenuOpen}
            handleClose={handleCloseTicketOptionsMenu}
          />
        </>
      )}
      <Can
        role={user.profile}
        perform="drawer-admin-items:view"
        yes={() => (
          <>
            {ticket.status === "pending" && (
              <ButtonWithSpinner
                loading={loading}
                size="small"
                variant="contained"
                color="primary"
                onClick={(e) => handleUpdateTicketStatus(e, "open", user?.id)}
              >
                {i18n.t("messagesList.header.buttons.accept")}
              </ButtonWithSpinner>
            )}
          </>
        )}
      />
    </div>
  );
};

export default TicketActionButtons;
