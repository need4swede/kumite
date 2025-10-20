import PropTypes from "prop-types";

function StatusIndicator({ status }) {
  if (!status) {
    return "–";
  }
  return (
    <div className="status">
      <span className={`status-indicator ${status}`} aria-hidden />
      <span>{status.toUpperCase()}</span>
    </div>
  );
}

StatusIndicator.propTypes = {
  status: PropTypes.string
};

StatusIndicator.defaultProps = {
  status: ""
};

function parseExplanationSections(text) {
  if (!text) return null;

  // Split on markdown bold headings (e.g., "**What the challenge was asking**")
  const sections = [];
  const regex = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add content before this heading if any
    const beforeContent = text.slice(lastIndex, match.index).trim();
    if (beforeContent && sections.length === 0) {
      // Content before first heading
      sections.push({ title: null, content: beforeContent });
    }

    // Find the next heading or end of text
    const nextMatch = regex.exec(text);
    const endIndex = nextMatch ? nextMatch.index : text.length;
    regex.lastIndex = match.index + match[0].length;

    // Extract content for this section
    const content = text.slice(match.index + match[0].length, endIndex).trim();

    sections.push({
      title: match[1].trim(),
      content
    });

    lastIndex = endIndex;
    if (nextMatch) {
      regex.lastIndex = nextMatch.index;
    }
  }

  // If no sections were found, return the whole text
  if (sections.length === 0) {
    return [{ title: null, content: text.trim() }];
  }

  return sections;
}

function TestResults({
  result,
  error,
  isRunning,
  explanation,
  explainError,
  isExplanationVisible,
  onExplanationClose
}) {
  if (isRunning) {
    return (
      <section className="panel">
        <h2>Test Results</h2>
        <div className="results">Executing tests...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel">
        <h2>Test Results</h2>
        <div className="results error">
          <StatusIndicator status="error" />
          {error}
        </div>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="panel">
        <h2>Test Results</h2>
        <div className="results">Run the tests to view results.</div>
      </section>
    );
  }

  const { status, exit_code: exitCode, stdout, stderr, duration } = result;
  const explanationSections = parseExplanationSections(explanation);

  return (
    <>
      <section className="panel">
        <div className="panel-header">
          <h2>Test Results</h2>
        </div>
        <div className={`results ${status === "passed" ? "success" : "error"}`}>
          <StatusIndicator status={status} />
          <div style={{ marginBottom: "0.75rem" }}>
            <div>Exit code: {exitCode}</div>
            <div>Duration: {duration.toFixed(2)}s</div>
          </div>
          {stdout ? (
            <div style={{ marginBottom: "1rem" }}>
              <strong>stdout</strong>
              <pre>{stdout}</pre>
            </div>
          ) : null}
          {stderr ? (
            <div>
              <strong>stderr</strong>
              <pre>{stderr}</pre>
            </div>
          ) : null}
          {!stdout && !stderr ? <div>No output.</div> : null}
          {explainError ? (
            <div className="ai-explainer">
              <div className="ai-explainer-error">{explainError}</div>
            </div>
          ) : null}
        </div>
      </section>
      {explanation && explanationSections && isExplanationVisible ? (
        <div className="ai-explanation-modal">
          <div className="ai-explanation-content">
            <div className="ai-explanation-header">
              <h3>AI Explanation</h3>
              <button
                className="ai-explanation-close"
                type="button"
                onClick={onExplanationClose}
                aria-label="Close explanation"
              >
                ✕
              </button>
            </div>
            <div className="ai-explanation-body">
              {explanationSections.map((section, index) => (
                <div key={index} className="ai-explanation-section">
                  {section.content ? (
                    <div className="ai-explanation-text">{section.content}</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

TestResults.propTypes = {
  result: PropTypes.shape({
    status: PropTypes.string.isRequired,
    exit_code: PropTypes.number.isRequired,
    stdout: PropTypes.string.isRequired,
    stderr: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired
  }),
  error: PropTypes.string,
  isRunning: PropTypes.bool,
  explanation: PropTypes.string,
  explainError: PropTypes.string,
  isExplanationVisible: PropTypes.bool,
  onExplanationClose: PropTypes.func
};

TestResults.defaultProps = {
  result: null,
  error: "",
  isRunning: false,
  explanation: "",
  explainError: "",
  isExplanationVisible: true,
  onExplanationClose: () => {}
};

export default TestResults;
