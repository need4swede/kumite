import { useState } from "react";
import PropTypes from "prop-types";

function EdgeSensor({ onReveal, isSidebarCollapsed }) {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (isSidebarCollapsed) {
      onReveal();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div
      className="edge-sensor"
      data-hovering={isHovering}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}

EdgeSensor.propTypes = {
  onReveal: PropTypes.func.isRequired,
  isSidebarCollapsed: PropTypes.bool.isRequired
};

export default EdgeSensor;
