import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Menu } from "@mui/material";
import React, { useState } from "react";
import ItemAction from "./ItemAction";

const TableActions = ({ options }) => {
  const [anchorEl, setActions] = useState(null);

  const handleClick = (event) => setActions(event.currentTarget);
  const handleClose = () => setActions(null);

  return (
    <>
      <IconButton
        aria-label="More"
        aria-owns="action-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      {anchorEl ? (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {options.map((option) => (
            <ItemAction
              key={option.content}
              data={option.data}
              onClose={handleClose}
              onClick={option.onClick}
            >
              {option.content}
            </ItemAction>
          ))}
        </Menu>
      ) : null}
    </>
  );
};

export default TableActions;
