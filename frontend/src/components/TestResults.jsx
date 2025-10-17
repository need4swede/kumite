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

function TestResults({
  result,
  error,
  isRunning,
  onExplain,
  isExplaining,
  explanation,
  explainError
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
  const canExplain = typeof onExplain === "function";

  return (
    <section className="panel">
      <h2>Test Results</h2>
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
        {status !== "passed" && canExplain ? (
          <div className="ai-explainer">
            <div className="ai-explainer-header">
              <button
                className="button button-secondary"
                type="button"
                onClick={onExplain}
                disabled={isExplaining}
              >
                {isExplaining ? "Explaining…" : "Explain Error"}
              </button>
              {isExplaining ? (
                <span className="ai-explainer-status">
                  Asking the assistant…
                </span>
              ) : null}
            </div>
            {explainError ? (
              <div className="ai-explainer-error">{explainError}</div>
            ) : null}
            {explanation ? (
              <div className="ai-explainer-content">
                <strong>AI Explanation</strong>
                <div className="ai-explainer-text">{explanation}</div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
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
  onExplain: PropTypes.func,
  isExplaining: PropTypes.bool,
  explanation: PropTypes.string,
  explainError: PropTypes.string
};

TestResults.defaultProps = {
  result: null,
  error: "",
  isRunning: false,
  onExplain: undefined,
  isExplaining: false,
  explanation: "",
  explainError: ""
};

export default TestResults;
