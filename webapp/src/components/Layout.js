import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Navigator from "./Navigator";
import Header from "./Header";
import { useLocation } from "react-router";
import { MENU } from "../constants/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { setFiles } from "../store/slices/fileSlice";
import { SOCKET_EVENTS } from "../../../common/enums.mjs";
import SocketService from "../utils/SocketService";
import { setLoading, setSuccess } from "../store/slices/missionSlice";
import {
  setConnected,
  startLoading,
  stopLoading,
} from "../store/slices/controllerSlice";
import { useConnectControllerMutation } from "../store/api";
import { Alert } from "@mui/material";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

let theme = createTheme({
  palette: {
    primary: {
      light: "#63ccff",
      main: "#009be5",
      dark: "#006db3",
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#081627",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
        contained: {
          boxShadow: "none",
          "&:active": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: theme.spacing(1),
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: theme.palette.common.white,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          margin: "0 16px",
          minWidth: 0,
          padding: 0,
          [theme.breakpoints.up("md")]: {
            padding: 0,
            minWidth: 0,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(255,255,255,0.15)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#4fc3f7",
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 14,
          fontWeight: theme.typography.fontWeightMedium,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "inherit",
          minWidth: "auto",
          marginRight: theme.spacing(2),
          "& svg": {
            fontSize: 20,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
        },
      },
    },
  },
};

const drawerWidth = 256;

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const { is_connected: isControllerConnected, loading: isControllerLoading } = useSelector(
    (state) => state.controller
  );

  const [mobileOpen, setMobileOpen] = useState(false);
  const [pageHeading, setPageHeading] = useState("");
  const location = useLocation();

  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const [
    connectController,
    { isLoading: isConnectLoading, isError: isConnectError },
  ] = useConnectControllerMutation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const { socket } = new SocketService();

    socket.on("connect", () => {
      console.log("Connected to socket!");
      // axios.get('/test-socket').then((res) => console.log(res))
    });

    // socket.on(SOCKET_EVENTS.METRICS_UPDATE, (data) => {
    //   console.log("Received new metrics file!");
    //   console.log(data);
    // });

    socket.on(SOCKET_EVENTS.MISSION_COMPLETE, (data) => {
      console.log("Mission completed!");
      dispatch(setSuccess());
    });

    socket.on(SOCKET_EVENTS.FILE_CHANGE, (res) => {
      console.log("File change");
      dispatch(setFiles(res.data[""] || {}));
    });

    socket.on("error", () => {
      console.log("Socket error");
    });

    handleConnectController();
  }, []);

  useEffect(() => {
    setPageHeading(MENU[location.pathname.slice(1)]);
  }, [location]);

  async function handleConnectController() {
    try {
      dispatch(startLoading());
      await connectController().unwrap();
      dispatch(setConnected(true));
      dispatch(stopLoading());
    } catch (err) {
      console.log(err);
      dispatch(setConnected(false));
      dispatch(stopLoading());
      toast.error("не удалось подключиться к контроллеру MCM-204", {
        autoClose: false,
        position: "bottom-right",
      });
    }
  }

  const is_controller_connected = isControllerLoading || isControllerConnected;
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {isSmUp ? null : (
            <Navigator
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              isControllerConnected={is_controller_connected}
            />
          )}

          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            sx={{ display: { sm: "block", xs: "none" } }}
            location={location}
            isControllerConnected={is_controller_connected}
          />

        </Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Header onDrawerToggle={handleDrawerToggle} heading={pageHeading} />
          <Box
            component="main"
            sx={{ flex: 1, py: 6, px: 4, bgcolor: "#eaeff1" }}
          >
            {children}
          </Box>
          <Box component="footer" sx={{ p: 2, bgcolor: "#eaeff1" }}>
            <Copyright />
          </Box>
        </Box>
        <ToastContainer />
      </Box>
    </ThemeProvider>
  );
}
