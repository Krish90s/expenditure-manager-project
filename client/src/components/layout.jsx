import React from "react";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Container,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import DashboardIcon from "@material-ui/icons/Dashboard";
import BarChartIcon from "@material-ui/icons/BarChart";
import PersonIcon from "@material-ui/icons/Person";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  title: {
    flexGrow: 1,
    textDecoration: "none",
  },
  toolbar: {
    paddingRight: 24,
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(7),
    paddingBottom: theme.spacing(4),
  },
  appBarSpacer: theme.mixins.toolbar,
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  link: {
    textDecoration: "none",
    color: "#2c3e50",
  },
  drawerIcon: {
    color: "#2c3e50",
  },
}));
const Layout = (props) => {
  const classes = useStyles();
  const [openDrawer, setOpen] = React.useState(true);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, openDrawer && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              openDrawer && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component={Link}
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
            to={`/main/dashboard/${props.user._id}`}
          >
            Expenditure Tracker
          </Typography>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                component={Link}
                to={`/main/profile/${props.user._id}`}
                onClick={handleClose}
              >
                Profile
              </MenuItem>
              <MenuItem component={Link} to={`/logout`} onClick={handleClose}>
                Sign Out
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(
            classes.drawerPaper,
            !openDrawer && classes.drawerPaperClose
          ),
        }}
        open={openDrawer}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <div>
            <Link
              to={`/main/dashboard/${props.user._id}`}
              className={classes.link}
            >
              <ListItem button>
                <ListItemIcon>
                  <DashboardIcon className={classes.drawerIcon} />
                </ListItemIcon>
                <ListItemText>Dashboard</ListItemText>
              </ListItem>
            </Link>

            <Link
              to={`/main/Profile/${props.user._id}`}
              className={classes.link}
            >
              <ListItem button>
                <ListItemIcon>
                  <PersonIcon className={classes.drawerIcon} />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </ListItem>
            </Link>

            <Link
              to={`/main/expenses/${props.user._id}`}
              className={classes.link}
            >
              <ListItem button>
                <ListItemIcon>
                  <MonetizationOnIcon className={classes.drawerIcon} />
                </ListItemIcon>
                <ListItemText>Expenses</ListItemText>
              </ListItem>
            </Link>

            <Link
              to={`/main/reports/${props.user._id}`}
              className={classes.link}
            >
              <ListItem button>
                <ListItemIcon>
                  <BarChartIcon className={classes.drawerIcon} />
                </ListItemIcon>
                <ListItemText>Reports</ListItemText>
              </ListItem>
            </Link>
          </div>
        </List>
      </Drawer>
      <div className={classes.appBarSpacer} />
      <main className={classes.content}>
        <Container maxWidth="lg" className={classes.container}>
          {props.children}
        </Container>
      </main>
    </div>
  );
};

export default Layout;
