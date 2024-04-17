import React, { useContext, useEffect, useState } from "react";

import {
  Badge,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Button,
  Switch,
  FormControlLabel,
  Menu,
  MenuItem,
  IconButton,
} from "@material-ui/core";

import { MoreVert, Search } from "@material-ui/icons";

import NewTicketModal from "../NewTicketModal";
import TicketsList from "../TicketsList";
import TabPanel from "../TabPanel";
// import { TagsFilter } from "../TagsFilter";
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../Can";
import TicketsQueueSelect from "../TicketsQueueSelect";
const useStyles = makeStyles((theme) => ({
  ticketsWrapper: {
    position: "relative",
    display: "flex",
    height: "100%",
    flexDirection: "column",
    overflow: "hidden",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  tabsHeader: {
    flex: "none",
    backgroundColor: theme.palette.background.default,
  },
  tabsRoot: {
    minHeight: 40,
    height: 40,
  },
  tab: {
    minWidth: 30,
    width: 60,
    fontSize: 10,
    minHeight: 50,
  },

  settingsIcon: {
    alignSelf: "center",
    marginLeft: "auto",
    padding: 8,
  },

  ticketOptionsBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(1),
  },

  serachInputWrapper: {
    flex: 1,
    backgroundColor: theme.palette.background.default,
    display: "flex",
    borderRadius: 40,
    padding: 4,
    marginRight: theme.spacing(1),
  },

  searchIcon: {
    color: theme.palette.primary.main,
    marginLeft: 6,
    marginRight: 6,
    alignSelf: "center",
  },

  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },

  badge: {
    right: 0,
    fontSize: 10,
  },
  show: {
    display: "block",
  },
  hide: {
    display: "none !important",
  },
  searchContainer: {
    display: "flex",
    margin: 0,
  },
  moreFilter: {
    color: theme.palette.text.primary,
  },
}));

const TicketsManager = () => {
  const classes = useStyles();

  const [searchParam, setSearchParam] = useState("");
  const [tab, setTab] = useState("open");
  const [tabOpen] = useState("open");
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
  const [showAllTickets, setShowAllTickets] = useState(false);
  const { user } = useContext(AuthContext);

  const [openCount, setOpenCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [selectedTags] = useState([]);

  const userQueueIds = user.queues.map((q) => q.id);
  const [selectedQueueIds, setSelectedQueueIds] = useState(userQueueIds || []);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user.profile.toUpperCase() === "ADMIN") {
      setShowAllTickets(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    const searchedTerm = e.target.value.toLowerCase();

    setSearchParam(searchedTerm);
    if (searchedTerm === "") {
      setTab("open");
    } else if (tab !== "search") {
      setTab("search");
    }
  };

  const handleChangeTab = (e, newValue) => {
    setTab(newValue);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(menuOpen ? false : true);
  };
  const applyPanelStyle = (status) => {
    if (tabOpen !== status) {
      return { width: 0, height: 0 };
    }
  };

  return (
    <Paper elevation={0} variant="outlined" className={classes.ticketsWrapper}>
      <NewTicketModal
        modalOpen={newTicketModalOpen}
        onClose={(e) => setNewTicketModalOpen(false)}
      />
      <Paper elevation={0} className={classes.searchContainer}>
        <Search className={classes.searchIcon} />
        <input
          type="text"
          placeholder={i18n.t("tickets.search.placeholder")}
          className={classes.searchInput}
          value={searchParam}
          onChange={handleSearch}
        />
        <IconButton onClick={handleMenu} size="small">
          <div>
            <MoreVert className={classes.moreFilter} />

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
              <MenuItem>
                <Button
                  variant="contained"
                  color="primary"
                  // size="small"
                  fullWidth
                  onClick={() => setNewTicketModalOpen(true)}
                >
                  {i18n.t("ticketsManager.buttons.newTicket")}
                </Button>
              </MenuItem>

              <Can
                role={user.profile}
                perform="tickets-manager:showall"
                yes={() => (
                  <MenuItem onClick={() => {}}>
                    <FormControlLabel
                      label={i18n.t("tickets.buttons.showAll")}
                      labelPlacement="start"
                      control={
                        <Switch
                          size="small"
                          checked={showAllTickets}
                          onChange={() =>
                            setShowAllTickets((prevState) => !prevState)
                          }
                          name="showAllTickets"
                          color="primary"
                        />
                      }
                    />
                  </MenuItem>
                )}
              />

              <MenuItem>
                <TicketsQueueSelect
                  style={{ marginLeft: 6 }}
                  selectedQueueIds={selectedQueueIds}
                  userQueues={user?.queues}
                  onChange={(values) => setSelectedQueueIds(values)}
                />
              </MenuItem>
            </Menu>
          </div>
        </IconButton>
      </Paper>
      <Paper elevation={0} square className={classes.tabsHeader}>
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="icon label tabs example"
          classes={{ root: classes.tabsRoot }}
        >
          <Tab
            value={"open"}
            label={
              <Badge
                className={classes.badge}
                badgeContent={openCount}
                overlap="rectangular"
                max={9999}
                color="secondary"
              >
                Abertos
              </Badge>
            }
            classes={{ root: classes.tab }}
          />
          <Tab
            value={"pending"}
            label={
              <Badge
                className={classes.badge}
                badgeContent={pendingCount}
                overlap="rectangular"
                max={9999}
                color="secondary"
              >
                {i18n.t("ticketsList.pendingHeader")}
              </Badge>
            }
            classes={{ root: classes.tab }}
          />
          <Tab
            value={"closed"}
            label={i18n.t("tickets.tabs.closed.title")}
            classes={{ root: classes.tab }}
          />
        </Tabs>
      </Paper>

      <TabPanel value={tab} name="open" className={classes.ticketsWrapper}>
        <Paper className={classes.ticketsWrapper}>
          <TicketsList
            status="open"
            showAll={showAllTickets}
            selectedQueueIds={selectedQueueIds}
            updateCount={(val) => setOpenCount(val)}
            style={applyPanelStyle("open")}
          />
          <TicketsList
            status="pending"
            selectedQueueIds={selectedQueueIds}
            updateCount={(val) => setPendingCount(val)}
            style={applyPanelStyle("pending")}
          />
        </Paper>
      </TabPanel>

      <TabPanel value={tab} name="pending" className={classes.ticketsWrapper}>
        <TicketsList
          status="pending"
          showAll={true}
          selectedQueueIds={selectedQueueIds}
        />
      </TabPanel>

      <TabPanel value={tab} name="closed" className={classes.ticketsWrapper}>
        <TicketsList
          status="closed"
          showAll={true}
          selectedQueueIds={selectedQueueIds}
        />
      </TabPanel>
      <TabPanel value={tab} name="search" className={classes.ticketsWrapper}>
        <TicketsList
          searchParam={searchParam}
          tags={selectedTags}
          showAll={true}
          selectedQueueIds={selectedQueueIds}
        />
      </TabPanel>
    </Paper>
  );
};

export default TicketsManager;
