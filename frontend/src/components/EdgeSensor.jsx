import { useState } from "react";
import PropTypes from "prop-types";

function EdgeSensor({ onReveal, isCollapsed, position }) {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (isCollapsed) {
      onReveal();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div
      className="edge-sensor"
      data-position={position}
      data-hovering={isHovering}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}

EdgeSensor.propTypes = {
  onReveal: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  position: PropTypes.oneOf(["left", "right"])
};

EdgeSensor.defaultProps = {
  position: "left"
};

export default EdgeSensor;
