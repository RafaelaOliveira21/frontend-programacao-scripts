import PropTypes from "prop-types";
import React from "react";
import { VscMenu } from "react-icons/vsc";
import SideBarMenuItemView from "../SideBarMenuItem";
import "./SideBarMenu.scss";

const SideBarMenu = ({ items, expander, setExpander }) => {
  const handleClick = () => setExpander(!expander);

  return (
    <nav className="nav">
      <div>
        <div className="nav__brand">
          <button className="hamburguerIcon" onClick={handleClick}>
            <VscMenu className="nav__icon" />
          </button>
        </div>
        {items.map((item) => (
          <SideBarMenuItemView item={item} key={item.id} />
        ))}
      </div>
    </nav>
  );
};

SideBarMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.any.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,

  expander: PropTypes.bool.isRequired,
  setExpander: PropTypes.func.isRequired,
};

export default SideBarMenu;
