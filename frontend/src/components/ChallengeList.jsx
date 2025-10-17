import { useMemo, useState } from "react";
import PropTypes from "prop-types";

const matchesSearch = (term, language, unit) => {
  if (!term) {
    return true;
  }

  const haystack = `${language.language} ${unit.unit} ${unit.title}`.toLowerCase();
  return haystack.includes(term.toLowerCase());
};

function ChallengeList({ challenges, selected, onSelect }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) {
      return challenges;
    }

    return challenges
      .map((language) => {
        const units = language.units.filter((unit) =>
          matchesSearch(search, language, unit)
        );
        return { ...language, units };
      })
      .filter((language) => language.units.length > 0);
  }, [challenges, search]);

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
        filtered.map((language) => (
          <section className="list-section" key={language.language}>
            <h3 className="language-title">{language.language}</h3>
            <ul className="unit-list">
              {language.units.map((unit) => {
                const isActive =
                  selected.language === language.language &&
                  selected.unit === unit.unit;
                return (
                  <li key={`${language.language}-${unit.unit}`}>
                    <button
                      className={`unit-button${isActive ? " active" : ""}`}
                      type="button"
                      onClick={() => onSelect(language.language, unit.unit)}
                    >
                      <div>{unit.title}</div>
                      <small style={{ color: "#64748b" }}>{unit.unit}</small>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </aside>
  );
}

ChallengeList.propTypes = {
  challenges: PropTypes.arrayOf(
    PropTypes.shape({
      language: PropTypes.string.isRequired,
      units: PropTypes.arrayOf(
        PropTypes.shape({
          unit: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired
        })
      ).isRequired
    })
  ).isRequired,
  selected: PropTypes.shape({
    language: PropTypes.string,
    unit: PropTypes.string
  }),
  onSelect: PropTypes.func.isRequired
};

ChallengeList.defaultProps = {
  selected: { language: "", unit: "" }
};

export default ChallengeList;
