import * as React from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SettingsIcon from "@mui/icons-material/Settings";
import MonitorIcon from "@mui/icons-material/Monitor";
import MemoryIcon from "@mui/icons-material/Memory";
import WorkIcon from "@mui/icons-material/Work";
import TopicIcon from "@mui/icons-material/Topic";
import { Link } from "react-router-dom";
import { MENU } from "../constants/config";
import { Alert } from "@mui/material";

const categories = [
  {
    id: "Главная",
    children: [
      {
        icon: <WorkIcon />,
      },
      {
        id: "missions",
        icon: <TopicIcon />,
      },
      {
        id: "monitoring",
        icon: <MonitorIcon />,
      },
      {
        id: "postprocessing",
        icon: <MemoryIcon />,
      },
    ],
  },
  {
    id: "Система",
    children: [
      { id: "system-settings", icon: <SettingsIcon /> },
      { id: "network-settings", icon: <SettingsIcon /> },
    ],
  },
];

const item = {
  py: "2px",
  px: 3,
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover, &:focus": {
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};

const link = {
  color: "rgba(255, 255, 255, 0.7)",
  textDecoration: "none",
  width: "100%",
};

const mainItem = {
  py: "10px",
  px: 3,
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover, &:focus": {
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};

const itemCategory = {
  boxShadow: "0 -1px 0 rgb(255,255,255,0.1) inset",
  py: 1.5,
  px: 3,
};

export default function Navigator(props) {
  const { location, isControllerConnected, ...other } = props;

  return (
    <Drawer variant="permanent" {...other} id="app-drawer">
      <List disablePadding>
        <ListItem
          sx={{
            ...item,
            ...itemCategory,
            fontSize: 22,
            color: "#fff",
          }}
        >
          MIC
        </ListItem>

        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: "#101F33" }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: "#fff" }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId = "home", icon }) => (
              <ListItem disablePadding>
                <Link
                  to={childId === "home" ? "/" : `/${childId}`}
                  key={childId}
                  style={link}
                >
                  <ListItemButton
                    selected={
                      childId === "home"
                        ? location?.pathname === "/"
                        : location?.pathname === `/${childId}`
                    }
                    sx={item}
                  >
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText>{MENU[childId]}</ListItemText>
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}

            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
      {!isControllerConnected && (
        <Alert severity="error">Контроллер MCM-204 не подключён</Alert>
      )}
    </Drawer>
  );
}
