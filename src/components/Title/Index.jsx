import { Divider, Typography } from "@mui/material";
import React from "react";
import "./styles.scss";

const Title = ({ children }) => {
  return (
    <div className="title">
      <Typography variant="h4" mb={2} component="h1" align="center">
        {children}
      </Typography>
      <Divider variant="fullWidth" />
    </div>
  );
};

export default Title;
