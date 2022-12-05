import { MenuItem } from "@mui/material";
import React from "react";

const ItemAction = ({ onClick, data, onClose, children }) => {
  const handleClick = () => {
    if (onClick) {
      if (onClose) {
        onClose();
      }

      return onClick(data);
    }

    return null;
  };

  return <MenuItem onClick={handleClick}>{children}</MenuItem>;
};

export default ItemAction;
