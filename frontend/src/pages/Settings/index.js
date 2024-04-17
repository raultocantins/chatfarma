import React, { useState } from "react";
import {
  makeStyles,
  Typography,
  Tabs,
  Tab,
  Box,
  Container,
} from "@material-ui/core";

import PropTypes from "prop-types";
import Integrations from "../Integrations";
import Api from "../Api";
import ApiDocs from "../ApiDocs";
import SettingsKey from "../ApiKey/";
import Options from "./options";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.scrollbarStyles,
    background: theme.palette.background.default,
    width: "100%",
    maxWidth: "100%",
    minHeight: "100%",
  },
  mainPaper: {
    overflowY: "scroll",
    ...theme.scrollbarStyles,
    background: theme.palette.background.default,
  },
}));

const Settings = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <Container className={classes.root}>
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Api" {...a11yProps(0)} />
            <Tab label="Integrações" {...a11yProps(1)} />
            <Tab label="Documentação" {...a11yProps(2)} />
            <Tab label="Chave Api" {...a11yProps(3)} />
            <Tab label="Opções" {...a11yProps(4)} />
          </Tabs>
        </Box>
      </Box>

      <div className={classes.mainPaper}>
        <CustomTabPanel value={value} index={0}>
          <Api />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Integrations />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <ApiDocs />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <SettingsKey />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
          <Options />
        </CustomTabPanel>
      </div>
    </Container>
  );
};

export default Settings;
