import PropTypes from "prop-types";
import Editor from "@monaco-editor/react";

const languageMapping = {
  python: "python",
  javascript: "javascript"
};

function CodeEditor({
  value,
  language,
  onChange,
  onRun,
  isRunning,
  challengeTitle,
  testFilename
}) {
  const monacoLanguage = languageMapping[language] ?? "plaintext";

  return (
    <section className="panel">
      <div className="toolbar">
        <div className="info">
          {challengeTitle ? (
            <>
              <strong>{challengeTitle}</strong>
            </>
          ) : (
            "Select a challenge to start coding."
          )}
        </div>
        <div className="toolbar-actions">
          <button
            className="button"
            type="button"
            onClick={onRun}
            disabled={!challengeTitle || isRunning}
          >
            {isRunning ? "Running..." : "Run Tests"}
          </button>
        </div>
      </div>
      <div style={{ height: "50vh", minHeight: "24rem" }}>
        <Editor
          theme="vs-dark"
          language={monacoLanguage}
          value={value}
          onChange={onChange}
          options={{
            automaticLayout: true,
            fontFamily: "JetBrains Mono, Fira Code, Menlo, monospace",
            fontSize: 14,
            minimap: { enabled: false },
            tabSize: 2,
            scrollBeyondLastLine: false,
            smoothScrolling: true
          }}
        />
      </div>
    </section>
  );
}

CodeEditor.propTypes = {
  value: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onRun: PropTypes.func.isRequired,
  isRunning: PropTypes.bool,
  challengeTitle: PropTypes.string,
  testFilename: PropTypes.string
};

CodeEditor.defaultProps = {
  isRunning: false,
  challengeTitle: "",
  testFilename: ""
};

export default CodeEditor;
