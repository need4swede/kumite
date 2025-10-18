import { useMemo, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const matchesSearch = (term, unit) => {
  if (!term) {
    return true;
  }

  const haystack = `${unit.unit} ${unit.title ?? ""} ${unit.languages.join(" ")}`.toLowerCase();
  return haystack.includes(term.toLowerCase());
};

function ChallengeList({ units, selectedUnit, onSelectUnit, isCollapsed, onCollapsedChange }) {
  const [search, setSearch] = useState("");
  const sidebarRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const filtered = useMemo(() => {
    if (!search) {
      return units;
    }
    return units.filter((unit) => matchesSearch(search, unit));
  }, [search, units]);

  // Handle mouse enter with debounce
  const handleMouseEnter = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      onCollapsedChange(false);
    }, 140);
  };

  // Handle mouse leave with focus intelligence
  const handleMouseLeave = (event) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Check if we're moving to a child element
    const relatedTarget = event.relatedTarget;
    if (sidebarRef.current && sidebarRef.current.contains(relatedTarget)) {
      return; // Don't collapse if moving to child element
    }

    debounceTimerRef.current = setTimeout(() => {
      onCollapsedChange(true);
    }, 140);
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className="sidebar"
      data-collapsed={isCollapsed}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="Search challenges..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No challenges found.</p>
      ) : (
        <ul className="unit-list">
          {filtered.map((unit) => {
            const isActive = unit.unit === selectedUnit;
            return (
              <li key={unit.unit}>
                <button
                  className={`unit-button${isActive ? " active" : ""}`}
                  type="button"
                  onClick={() => onSelectUnit(unit.unit)}
                >
                  <div>{unit.unit}</div>
                  {unit.languages.length > 0 ? (
                    <small className="unit-languages">
                      {unit.languages.join(" • ")}
                    </small>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}

ChallengeList.propTypes = {
  units: PropTypes.arrayOf(
    PropTypes.shape({
      unit: PropTypes.string.isRequired,
      title: PropTypes.string,
      languages: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  ).isRequired,
  selectedUnit: PropTypes.string,
  onSelectUnit: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  onCollapsedChange: PropTypes.func.isRequired
};

ChallengeList.defaultProps = {
  selectedUnit: ""
};

export default ChallengeList;
