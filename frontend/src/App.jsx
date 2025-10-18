import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import ChallengeList from "./components/ChallengeList.jsx";
import CodeEditor from "./components/CodeEditor.jsx";
import TestResults from "./components/TestResults.jsx";
import EdgeSensor from "./components/EdgeSensor.jsx";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const apiClient = axios.create({ baseURL: API_BASE_URL });

function App() {
  const [challenges, setChallenges] = useState([]);
  const [challengesError, setChallengesError] = useState("");
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(true);

  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [challengeError, setChallengeError] = useState("");
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(false);

  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [runError, setRunError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [explainError, setExplainError] = useState("");
  const [isExplaining, setIsExplaining] = useState(false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadChallenges() {
      try {
        const { data } = await apiClient.get("/challenges");
        if (isMounted) {
          setChallenges(data);
          setChallengesError("");
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }
        const message =
          error?.response?.data?.detail ?? "Failed to load challenges.";
        setChallengesError(message);
        setChallenges([]);
      } finally {
        if (isMounted) {
          setIsLoadingChallenges(false);
        }
      }
    }

    loadChallenges();
    return () => {
      isMounted = false;
    };
  }, []);

  const unitData = useMemo(() => {
    const seenUnits = new Set();
    const orderedUnits = [];
    const unitsById = new Map();

    challenges.forEach((languageEntry) => {
      languageEntry.units.forEach((unit) => {
        if (!seenUnits.has(unit.unit)) {
          const aggregate = {
            unit: unit.unit,
            title: unit.title,
            languages: [languageEntry.language]
          };
          orderedUnits.push(aggregate);
          seenUnits.add(unit.unit);
          unitsById.set(unit.unit, aggregate);
        } else {
          const existing = unitsById.get(unit.unit);
          if (!existing.languages.includes(languageEntry.language)) {
            existing.languages.push(languageEntry.language);
          }
        }
      });
    });

    return { orderedUnits, unitsById };
  }, [challenges]);

  const languagesForSelectedUnit = useMemo(() => {
    return unitData.unitsById.get(selectedUnit)?.languages ?? [];
  }, [selectedUnit, unitData]);

  const loadChallenge = useCallback(async (language, unit) => {
    if (!language || !unit) {
      return;
    }

    setIsLoadingChallenge(true);
    setChallenge(null);
    setChallengeError("");
    setResult(null);
    setRunError("");
    setExplanation("");
    setExplainError("");

    try {
      const { data } = await apiClient.get(`/challenges/${language}/${unit}`);
      setChallenge(data);
      setCode(data.starter_code ?? "");
    } catch (error) {
      const message =
        error?.response?.data?.detail ??
        "Unable to load the selected challenge.";
      setChallengeError(message);
      setCode("");
    } finally {
      setIsLoadingChallenge(false);
    }
  }, []);

  useEffect(() => {
    if (isLoadingChallenges || unitData.orderedUnits.length === 0) {
      return;
    }

    setSelectedUnit((current) => {
      if (current && unitData.unitsById.has(current)) {
        return current;
      }
      return unitData.orderedUnits[0].unit;
    });
  }, [isLoadingChallenges, unitData]);

  useEffect(() => {
    if (!selectedUnit) {
      setSelectedLanguage("");
      return;
    }

    setSelectedLanguage((current) => {
      if (current && languagesForSelectedUnit.includes(current)) {
        return current;
      }
      return languagesForSelectedUnit[0] ?? "";
    });
  }, [languagesForSelectedUnit, selectedUnit]);

  useEffect(() => {
    if (!selectedLanguage || !selectedUnit) {
      return;
    }
    if (!languagesForSelectedUnit.includes(selectedLanguage)) {
      return;
    }
    loadChallenge(selectedLanguage, selectedUnit);
  }, [
    languagesForSelectedUnit,
    loadChallenge,
    selectedLanguage,
    selectedUnit
  ]);

  const handleRun = useCallback(async () => {
    if (!selectedLanguage || !selectedUnit) {
      return;
    }

    setIsRunning(true);
    setResult(null);
    setRunError("");
    setExplanation("");
    setExplainError("");
    try {
      const { data } = await apiClient.post(
        `/execute/${selectedLanguage}/${selectedUnit}`,
        { code }
      );
      setResult(data);
    } catch (error) {
      const message =
        error?.response?.data?.detail ?? "Test execution failed unexpectedly.";
      setRunError(message);
    } finally {
      setIsRunning(false);
    }
  }, [code, selectedLanguage, selectedUnit]);

  const handleExplainFailure = useCallback(async () => {
    if (!result || result.status === "passed") {
      return;
    }
    if (!selectedLanguage || !selectedUnit) {
      return;
    }

    setIsExplaining(true);
    setExplainError("");
    try {
      const { data } = await apiClient.post("/ai/explain-failure", {
        language: selectedLanguage,
        unit: selectedUnit,
        code,
        stdout: result.stdout,
        stderr: result.stderr,
        status: result.status,
        exit_code: result.exit_code
      });
      setExplanation(data?.explanation ?? "");
    } catch (error) {
      const message =
        error?.response?.data?.detail ??
        "Unable to generate an explanation for this failure.";
      setExplainError(message);
      setExplanation("");
    } finally {
      setIsExplaining(false);
    }
  }, [code, result, selectedLanguage, selectedUnit]);

  const instructions = useMemo(() => {
    if (challengeError) {
      return challengeError;
    }
    if (isLoadingChallenge) {
      return "Loading challenge details…";
    }
    if (!challenge) {
      return "Select a challenge to view the instructions.";
    }
    return challenge.instructions || "No instructions provided.";
  }, [challenge, challengeError, isLoadingChallenge]);

  const handleSelectUnit = useCallback((unit) => {
    setSelectedUnit(unit);
  }, []);

  const handleSelectLanguage = useCallback((language) => {
    setSelectedLanguage(language);
  }, []);

  return (
    <div className="app-shell">
      <EdgeSensor
        onReveal={() => setIsSidebarCollapsed(false)}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <ChallengeList
        units={unitData.orderedUnits}
        selectedUnit={selectedUnit}
        onSelectUnit={handleSelectUnit}
        isCollapsed={isSidebarCollapsed}
        onCollapsedChange={setIsSidebarCollapsed}
      />
      <div className="main-panel" data-sidebar-collapsed={isSidebarCollapsed}>
        <section className="panel" style={{ flex: "0 0 auto" }}>
          <div className="challenge-header">
            <h2>Challenge</h2>
            {languagesForSelectedUnit.length > 0 ? (
              <label className="language-selector">
                <span className="language-label">Language</span>
                <select
                  className="language-select"
                  value={selectedLanguage}
                  onChange={(event) => handleSelectLanguage(event.target.value)}
                >
                  {languagesForSelectedUnit.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>
          {isLoadingChallenges ? (
            <p className="instructions">Loading available challenges…</p>
          ) : challengesError ? (
            <p className="instructions">{challengesError}</p>
          ) : (
            <div className="instructions">{instructions}</div>
          )}
        </section>
        <div className="two-column">
          <CodeEditor
            value={code}
            language={
              challenge?.language ?? selectedLanguage ?? "plaintext"
            }
            onChange={(newCode) => setCode(newCode ?? "")}
            onRun={handleRun}
            isRunning={isRunning}
            challengeTitle={challenge?.title}
            testFilename={challenge?.test_filename}
          />
          <TestResults
            result={result}
            error={runError}
            isRunning={isRunning}
            explanation={explanation}
            explainError={explainError}
            isExplaining={isExplaining}
            onExplain={handleExplainFailure}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
