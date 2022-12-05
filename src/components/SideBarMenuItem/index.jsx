import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

const SideBarMenuItemView = ({ item }) => {
  const [active, setActive] = React.useState(false);

  const handleClick = () => setActive(!active);

  return (
    <div className="nav__list">
      <Link to={item.url} className={`nav__link`} onClick={handleClick}>
        <item.icon size="32" />
        <span className="nav__name"> {item.label} </span>
      </Link>
    </div>
  );
};

SideBarMenuItemView.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.any.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default SideBarMenuItemView;
