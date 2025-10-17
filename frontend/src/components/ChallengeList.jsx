import { useMemo, useState } from "react";
import PropTypes from "prop-types";

const matchesSearch = (term, unit) => {
  if (!term) {
    return true;
  }

  const haystack = `${unit.unit} ${unit.title ?? ""} ${unit.languages.join(" ")}`.toLowerCase();
  return haystack.includes(term.toLowerCase());
};

function ChallengeList({ units, selectedUnit, onSelectUnit }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) {
      return units;
    }
    return units.filter((unit) => matchesSearch(search, unit));
  }, [search, units]);

  return (
    <aside className="sidebar">
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
                  {unit.title ? (
                    <small className="unit-subtitle">{unit.title}</small>
                  ) : null}
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
  onSelectUnit: PropTypes.func.isRequired
};

ChallengeList.defaultProps = {
  selectedUnit: ""
};

export default ChallengeList;
