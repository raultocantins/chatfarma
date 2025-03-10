import React, { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  Badge,
  ListItem,
  ListItemIcon,
  MenuItem,
  makeStyles,
  Menu,
  CssBaseline,
  FormControl,
  Select,
  ListItemText,
} from "@material-ui/core";

import {
  AccountTree,
  AddBoxRounded,
  CheckCircle,
  ExpandLessOutlined,
  ExpandMoreOutlined,
  InsertChart,
  Label,
  MonetizationOn,
  Notifications,
  PeopleAlt,
  QuestionAnswer,
  RecentActors,
  RemoveCircle,
  Search,
  Settings,
  SettingsApplications,
  SignalCellular4Bar,
  WhatsApp,
} from "@material-ui/icons";

import AccountCircle from "@material-ui/icons/AccountCircle";

import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import { Can } from "../components/Can";
import UserModal from "../components/UserModal";
import NotificationsPopOver from "../components/NotificationsPopOver";
import api from "../services/api";
import ToastSuccess from "../components/ToastSuccess";
import toastError from "../errors/toastError";
const useStyles = makeStyles((theme) => ({
  icon: {
    color: "#ffff",
  },
  li: {
    textAlign: "center",
    color: "#ffff"
  },
  sub: {
    backgroundColor: theme.palette.sub.main,
  },
  divider: {
    backgroundColor: theme.palette.divide.main,
  },
  statusOnlineIcon: {
    color: "#64A764",
    fontSize: 20,
    padding: 5,
  },
  statusOfflineIcon: {
    color: "#A76464",
    fontSize: 20,
    padding: 5,
  },
}));

function ListItemLink(props) {
  const { icon, to, label } = props;
  const classes = useStyles();
  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <li className={classes.li}>
      <ListItem
        button
        component={renderLink}
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignContent: "center",
        }}
      >
        {icon ? (
          <ListItemIcon className={classes.icon} style={{ fontSize: 32 }}>
            {icon}
          </ListItemIcon>
        ) : null}

        <span style={{ fontSize: 13, whiteSpace: 'normal', textAlign: 'center' }}>{label}</span>

      </ListItem>
    </li>
  );
}


function ListItemLinkExpanded(props) {
  const { label, isExpanded, onClick } = props;
  const classes = useStyles();

  return (
    <li className={classes.li} onClick={onClick} >
      <ListItem
        button
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignContent: "center",
        }}

      >
        <ListItemIcon className={classes.icon} style={{ fontSize: 32 }}>
          <Notifications />
        </ListItemIcon>
        <span style={{ fontSize: 13, whiteSpace: 'normal', textAlign: 'center' }}>{label}</span>
        <ListItemIcon className={classes.icon} style={{ fontSize: 32 }} >
          {isExpanded ?
            <ExpandLessOutlined /> : <ExpandMoreOutlined />}
        </ListItemIcon>

      </ListItem>
    </li>
  );
}



const MainListItems = (props) => {
  const { drawerClose } = props;
  const { whatsApps } = useContext(WhatsAppsContext);
  const { user } = useContext(AuthContext);
  const [connectionWarning, setConnectionWarning] = useState(false);
  const classes = useStyles();
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const { handleLogout } = useContext(AuthContext);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  const handleOpenUserModal = () => {
    setUserModalOpen(true);
    handleCloseMenu();
  };

  const handleClickLogout = () => {
    handleCloseMenu();
    handleLogout();
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(menuOpen ? false : true);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const updateUserStatus = async (status) => {
    const userData = { status };
    try {
      await api.put(`/users/status/${user.id}`, userData);
      ToastSuccess("Status atualizado com sucesso");
    } catch (err) {
      toastError(err);
    }
  };

  const statusToText = (status) => {
    switch (status) {
      case "online":
        return "Disponível";
      case "offline":
        return "Aparecer offline";
      default:
        return "";
    }
  };

  return (
    <div onClick={drawerClose}>
      <CssBaseline />
      <li className={classes.li}>
        <ListItem
          button
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignContent: "center",
          }}
          onClick={handleMenu}
        >
          <ListItemIcon className={classes.icon}>
            {
              <div>
                <AccountCircle />

                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={menuOpen}
                  onClose={handleCloseMenu}
                >
                  <MenuItem onClick={() => { }}>
                    <FormControl fullWidth margin="dense">
                      <Select
                        displayEmpty
                        variant="outlined"
                        value={[user.status]}
                        onChange={(v) => {
                          updateUserStatus(v.target.value);
                        }}
                        MenuProps={{
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left",
                          },
                          transformOrigin: {
                            vertical: "top",
                            horizontal: "left",
                          },
                          getContentAnchorEl: null,
                        }}
                        renderValue={() => (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {user.status === "online" ? (
                              <CheckCircle
                                className={classes.statusOnlineIcon}
                              />
                            ) : (
                              <RemoveCircle
                                className={classes.statusOfflineIcon}
                              />
                            )}
                            {statusToText(user.status)}
                          </div>
                        )}
                      >
                        {["online", "offline"].map((status) => (
                          <MenuItem dense key={status} value={status}>
                            {status === "online" ? (
                              <CheckCircle
                                className={classes.statusOnlineIcon}
                              />
                            ) : (
                              <RemoveCircle
                                className={classes.statusOfflineIcon}
                              />
                            )}
                            <ListItemText primary={statusToText(status)} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </MenuItem>
                  <MenuItem onClick={handleOpenUserModal}>
                    {i18n.t("mainDrawer.appBar.user.profile")}
                  </MenuItem>
                  <MenuItem onClick={handleClickLogout}>
                    {i18n.t("mainDrawer.appBar.user.logout")}
                  </MenuItem>
                </Menu>
              </div>
            }
          </ListItemIcon>
          <span style={{ fontSize: 13 }}>Perfil</span>
        </ListItem>
      </li>

      <ListItemLink
        to="/"
        primary="Dashboard"
        icon={<InsertChart />}
        label="Dashboard"
      />

      <ListItemLink
        to="/tickets"
        primary={i18n.t("mainDrawer.listItems.tickets")}
        icon={user.id && <NotificationsPopOver icon={<WhatsApp />} />}
        label="Conversas"
      />
      <ListItemLink
        to="/contacts"
        primary={i18n.t("mainDrawer.listItems.contacts")}
        icon={<RecentActors />}
        label="Contatos"
      />
      <ListItemLink
        to="/quickAnswers"
        primary={i18n.t("mainDrawer.listItems.quickAnswers")}
        icon={<QuestionAnswer />}
        label="Respostas"
      />
      <ListItemLink
        to="/tags"
        primary={i18n.t("mainDrawer.listItems.tags")}
        icon={<Label />}
        label="Tags"
      />
      <ListItemLink
        to="/search"
        primary={i18n.t("mainDrawer.listItems.tags")}
        icon={<Search />}
        label="Pesquisa"
      />

      <ListItemLink
        to="/sales"
        primary="Vendas"
        icon={<MonetizationOn />}
        label="Vendas"
      />

      <ListItemLinkExpanded
        primary={i18n.t("mainDrawer.listItems.campaigns")}
        label={i18n.t("mainDrawer.listItems.campaigns")}
        isExpanded={isExpanded}
        onClick={() => setExpanded(!isExpanded)}
      />

      {
        isExpanded ? <>

          <ListItemLink
            to="/campaigns"
            primary='Criar Campanha'
            icon={<AddBoxRounded />}
            label='Criar Campanha'
          />
          <ListItemLink
            to="/contact-lists"
            primary='Listas de Contatos'
            icon={<RecentActors />}
            label='Listas de Contatos'
          />


          <ListItemLink
            to="/campaigns-config"
            primary='Configurações de campanha'
            icon={<SettingsApplications />}
            label='Configurações'
          />
        </> : null
      }



      <Can
        role={user.profile}
        perform="drawer-admin-items:view"
        yes={() => (
          <>
            <ListItemLink
              to="/connections"
              primary={i18n.t("mainDrawer.listItems.connections")}
              label="Conexões"
              icon={
                <Badge
                  badgeContent={connectionWarning ? "!" : 0}
                  color="error"
                  overlap="rectangular"
                >
                  <SignalCellular4Bar />
                </Badge>
              }
            />
            <ListItemLink
              to="/users"
              primary={i18n.t("mainDrawer.listItems.users")}
              icon={<PeopleAlt />}
              label="Usuários"
            />
            <ListItemLink
              to="/queues"
              primary={i18n.t("mainDrawer.listItems.queues")}
              icon={<AccountTree />}
              label="Departamentos"
            />

            <ListItemLink
              to="/settings"
              primary={i18n.t("mainDrawer.listItems.settings")}
              icon={<Settings />}
              label="Configurações"
            />
          </>
        )}
      />

      <UserModal
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        userId={user?.id}
      />
    </div>
  );
};

export default MainListItems;
