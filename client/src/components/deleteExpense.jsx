import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { removeExpense } from "../services/expensesService";

const DeleteExpense = (props) => {
  const [open, setOpen] = useState(false);
  const clickButton = () => {
    setOpen(true);
  };
  const deleteExpense = async () => {
    await removeExpense(props.expense._id);
    setOpen(false);
    props.onRemove(props.expense);
  };
  const handleRequestClose = () => {
    setOpen(false);
  };
  return (
    <span>
      <IconButton aria-label="Delete" onClick={clickButton}>
        <DeleteIcon />
      </IconButton>

      <Dialog open={open} onClose={handleRequestClose}>
        <DialogTitle>{"Delete " + props.expense.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.expense.title}.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={deleteExpense}
            color="secondary"
            autoFocus="autoFocus"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
};

DeleteExpense.propTypes = {
  expense: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default DeleteExpense;
