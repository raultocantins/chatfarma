import React, { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import {
  Badge,
  ListItem,
  ListItemIcon,
  MenuItem,
  makeStyles,
  Menu,
  Switch,
  CssBaseline,
  FormControl,
  Select,
  ListItemText,
} from "@material-ui/core";

import {
  AccountTree,
  CheckCircle,
  InsertChart,
  Label,
  PeopleAlt,
  QuestionAnswer,
  RecentActors,
  RemoveCircle,
  Search,
  Settings,
  SignalCellular4Bar,
  ViewColumn,
  WhatsApp,
} from "@material-ui/icons";

import AccountCircle from "@material-ui/icons/AccountCircle";

import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import { Can } from "../components/Can";
import UserModal from "../components/UserModal";
import NotificationsPopOver from "../components/NotificationsPopOver";
import { useLocation } from "react-router-dom/cjs/react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useHistory } from "react-router-dom";
import api from "../services/api";
import ToastSuccess from "../components/ToastSuccess";
import toastError from "../errors/toastError";
const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.secondary.main,
    justifyContent: "center",
    alignContent: "center",
  },
  li: {
    backgroundColor: theme.palette.menuItens.main,
    textAlign: "center",
  },
  sub: {
    backgroundColor: theme.palette.sub.main,
  },
  divider: {
    backgroundColor: theme.palette.divide.main,
  },
  menuItemSelected: {
    backgroundColor: theme.palette.background.default,
    borderLeft: `2px solid ${theme.palette.primary.main}`,
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
  const location = useLocation();
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
        className={location.pathname === to ? classes.menuItemSelected : null}
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        {icon ? (
          <ListItemIcon className={classes.icon} style={{ fontSize: 32 }}>
            {icon}
          </ListItemIcon>
        ) : null}
        <span style={{ fontSize: 8 }}>{label}</span>
      </ListItem>
    </li>
  );
}

const MainListItems = (props) => {
  const history = useHistory();
  const { drawerClose } = props;
  const { whatsApps } = useContext(WhatsAppsContext);
  const { user } = useContext(AuthContext);
  const [connectionWarning, setConnectionWarning] = useState(false);
  const classes = useStyles();
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { handleLogout } = useContext(AuthContext);
  const [storedValue, setValue] = useLocalStorage("theme", { theme: "light" });
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
            flexDirection: "column",
            justifyContent: "center",
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
                  <MenuItem onClick={() => {}}>
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
          <span style={{ fontSize: 8 }}>Perfil</span>
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

      <Can
        role={user.profile}
        perform="drawer-admin-items:view"
        yes={() => (
          <>
            <ListItemLink
              to="/kanban"
              primary="Painel"
              icon={<ViewColumn />}
              label="Painel"
            />
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

      <ListItem
        button
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <ListItemIcon className={classes.icon} style={{ fontSize: 32 }}>
          <Switch
            size="small"
            checked={storedValue.theme === "dark" ? true : false}
            onChange={(_) => {
              setValue({
                theme: storedValue.theme === "dark" ? "light" : "dark",
              });
              history.go(0);
            }}
            name="darkMode"
          />
        </ListItemIcon>

        <span style={{ fontSize: 8 }}>Modo Escuro</span>
      </ListItem>

      <UserModal
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        userId={user?.id}
      />
    </div>
  );
};

export default MainListItems;
