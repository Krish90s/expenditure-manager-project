import React from "react";
import { makeStyles } from "@material-ui/core";
import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  Divider,
} from "@material-ui/core";
import Edit from "@material-ui/icons/Edit";
import Person from "@material-ui/icons/Person";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(5),
  },
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.protectedTitle,
  },
}));

const Profile = (props) => {
  const classes = useStyles();

  return (
    <Paper className={classes.root} elevation={2}>
      <Typography variant="h6" className={classes.title}>
        My Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <Person />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={props.user.name}
            secondary={props.user.email}
          />{" "}
          <ListItemSecondaryAction>
            <Link to={`/main/Profile/${props.user._id}/edit`}>
              <IconButton aria-label="Edit" color="primary">
                <Edit />
              </IconButton>
            </Link>
            {/* <DeleteUser userId={user._id} /> */}
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={"Joined: " + new Date(props.user.created).toDateString()}
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default Profile;
