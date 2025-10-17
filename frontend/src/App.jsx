import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import ChallengeList from "./components/ChallengeList.jsx";
import CodeEditor from "./components/CodeEditor.jsx";
import TestResults from "./components/TestResults.jsx";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const apiClient = axios.create({ baseURL: API_BASE_URL });

function App() {
  const [challenges, setChallenges] = useState([]);
  const [challengesError, setChallengesError] = useState("");
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(true);

  const [selected, setSelected] = useState({ language: "", unit: "" });
  const [challenge, setChallenge] = useState(null);
  const [challengeError, setChallengeError] = useState("");
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(false);

  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [runError, setRunError] = useState("");
  const [isRunning, setIsRunning] = useState(false);

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

  const selectChallenge = useCallback(
    async (language, unit) => {
      setSelected({ language, unit });
      setIsLoadingChallenge(true);
      setChallenge(null);
      setChallengeError("");
      setResult(null);
      setRunError("");
      try {
        const { data } = await apiClient.get(
          `/challenges/${language}/${unit}`
        );
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
    },
    []
  );

  useEffect(() => {
    if (!isLoadingChallenges && challenges.length > 0 && !selected.language) {
      const fallbackLanguage = challenges[0];
      if (fallbackLanguage?.units?.length) {
        const fallbackUnit = fallbackLanguage.units[0];
        selectChallenge(fallbackLanguage.language, fallbackUnit.unit);
      }
    }
  }, [challenges, isLoadingChallenges, selectChallenge, selected.language]);

  const handleRun = useCallback(async () => {
    if (!selected.language || !selected.unit) {
      return;
    }

    setIsRunning(true);
    setResult(null);
    setRunError("");
    try {
      const { data } = await apiClient.post(
        `/execute/${selected.language}/${selected.unit}`,
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
  }, [code, selected.language, selected.unit]);

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

  return (
    <div className="app-shell">
      <ChallengeList
        challenges={challenges}
        selected={selected}
        onSelect={selectChallenge}
      />
      <div className="main-panel">
        <section className="panel" style={{ flex: "0 0 auto" }}>
          <h2>Challenge</h2>
          {isLoadingChallenges ? (
            <p className="instructions">Loading available challenges…</p>
          ) : challengesError ? (
            <p className="instructions">{challengesError}</p>
          ) : (
            <div className="challenge-details">
              {challenge ? <h3>{challenge.title}</h3> : null}
              <div className="instructions">{instructions}</div>
            </div>
          )}
        </section>
        <div className="two-column">
          <CodeEditor
            value={code}
            language={challenge?.language ?? selected.language ?? "plaintext"}
            onChange={(newCode) => setCode(newCode ?? "")}
            onRun={handleRun}
            isRunning={isRunning}
            challengeTitle={challenge?.title}
            testFilename={challenge?.test_filename}
          />
          <TestResults result={result} error={runError} isRunning={isRunning} />
        </div>
      </div>
    </div>
  );
}

export default App;
