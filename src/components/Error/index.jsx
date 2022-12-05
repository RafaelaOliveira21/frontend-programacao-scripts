import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";

const Error = ({ error }) => {
  return !error ? null : <p className="error">{error}</p>;
};

Error.propTypes = {
  error: PropTypes.string,
};

export default Error;
