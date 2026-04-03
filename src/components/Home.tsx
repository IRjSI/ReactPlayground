import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as Babel from '@babel/standalone';
import { loader } from "@monaco-editor/react";
import { AuthContext, AuthContextType } from '../context/authContext';
import { PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import LandingPage from '../Pages/LandingPage';
import { io } from "socket.io-client";
import { useUser } from '../hooks/useUser';
import 'react-tooltip/dist/react-tooltip.css';
import { useQuery, useQueryClient } from '@tanstack/react-query';

/* Type */
import { QuestionType } from '../types/types';

/* Components */
import { Header } from './Header_home';
import { QuestionSidebar } from './QuestionSidebar';
import { EditorPanel } from './EditorPanel';
import { PreviewPanel } from './PreviewPanel';

/* API */
import { getSolutionsAPI, getChallengesAPI, submitCodeAPI, addSolutionAPI } from '../services/API';

// const socket = io("http://localhost:4000");
const socket = import.meta.env.VITE_ENV === "dev" ? io("http://localhost:4000") : io("https://rpg-proxy.onrender.com");

loader.init().then((monaco) => {
  monaco.editor.defineTheme("custom-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "80cbc4" },
      { token: "string", foreground: "c3e88d" },
      { token: "number", foreground: "f78c6c" },
    ],
    colors: {
      "editor.background": "#0f172a",
      "editorLineNumber.foreground": "#64748b",
      "editorLineNumber.activeForeground": "#38bdf8",
      "editorCursor.foreground": "#38bdf8",
      "editorIndentGuide.background": "#334155",
    },
  });
});

const Home = () => {
  // state for code written by the user
  const [code, setCode] = useState(`// React is imported by default.\n// to use hooks, for eg. useState use it like React.useState()\nfunction App() {\n  return <h1>Hello</h1>;\n}`);
  
  const [output, setOutput] = useState('');
  // to trigger useEffect
  // const [refetch, setRefetch] = useState(false);
  /* use tanstack query's mutation instead */
  const queryClient = useQueryClient();

  // number of challenges(for indexing)
  const [ques, setQues] = useState(0);
  const [questionMap, setQuestionMap] = useState(false);

  const { token, isLoggedIn, logout } = useContext(AuthContext) as AuthContextType;
  const { userInfo } = useUser();
  
  const { data: solutions = []} = useQuery({
    queryKey: ['solutions', token],
    queryFn: getSolutionsAPI,
    enabled: !!token,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
  
  const { data: questions = []} = useQuery<QuestionType[]>({
    queryKey: ['challenges', token],
    queryFn: getChallengesAPI,
    enabled: !!token,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  // set all the questions statements
  // const questions = allQues?.map(q => q.statement) || [];

  // for showing the preview
  // Generates an HTML document with compiled user code and React runtime
  const compileCode = (inputCode: string) => {
    try {
      // Use Babel to convert JSX to plain JavaScript using the react preset (refer to Readme for more details)
      const compiled = Babel.transform(inputCode, { presets: ["react"] }).code;
      return `
        <html>
          <body>
            <div id="root"></div>
            <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
            <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
            <script>
              try {
                ${compiled}
                ReactDOM.render(React.createElement(App), document.getElementById('root'));
              } catch(e) {
                document.body.innerHTML = '<pre>' + e + '</pre>';
              }
            </script>
          </body>
        </html>`;
    } catch (err: any) {
      return `<html><body><pre style="color:red">Compilation Error:\n${err.message}</pre></body></html>`;
    }
  };

  // to store html returned
  const html = useMemo(() => compileCode(code), [code]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // check if the user submitted code is correct or not
  const compareSolution = async () => {
    <iframe ref={iframeRef} />

    // get the iframe
    const iframe = iframeRef.current;

    if (!iframe) {
      setOutput("Iframe not found");
      return;
    }
    // set the source as html(compiledCode)
    iframe.srcdoc = html;

    // wait for load safely
    await new Promise<void>((resolve) => {
      const handler = () => {
        iframe.onload = null; // cleanup
        resolve();
      };
      iframe.onload = handler;
    });

    const iframeDoc = iframe.contentDocument?.documentElement.outerHTML;
    if (!iframeDoc) return setOutput("Iframe not loaded");

    await submitSolution(code);
  };

  async function submitSolution(iframeDoc: string) {
    setOutput("checking...");
    const challengeId = `challenge${ques + 1}Validator`;

    try {
      const res = await submitCodeAPI(iframeDoc, challengeId);
      const { solutionId } = res;

      // Register for result
      socket.emit("register", solutionId);

      socket.off("solutionResult");

      socket.once("solutionResult", async (data: any) => {
        if (data.solutionId !== solutionId) return;

        setOutput(data.result === "valid" ? "Correct Solution" : "Incorrect Solution");

        if (data.result === "valid") {
          // add solution -> add the solution in the Solution's table
          await addSolution();

          queryClient.invalidateQueries({
            queryKey: ['solutions', token]
          });

          queryClient.invalidateQueries({
            queryKey: ['challenges', token]
          });
        }
      });
    } catch {
      setOutput("error...");
    }
  }

  // add solution -> add the solution in the Solution's table
  const addSolution = async () => {
    const challengeId = questions[ques]._id;
    await addSolutionAPI(challengeId, code);
  }

  const nextClick = () => {
    setQues(ques < questions.length - 1 ? ques + 1 : ques);
    setOutput('');
  }
  const prevClick = () => {
    setQues(ques > 0 ? ques - 1 : ques);
    setOutput('');
  }
  const logoutClick = () => logout();

  useEffect(() => {
    const currentQ = questions[ques];
    if (!currentQ) return;

    const existing = solutions.find(
      (s: any) => s.challenge.toString() === currentQ._id.toString()
    );

    if (existing) {
      setCode(existing.solution);
    } else {
      setCode(`// React is imported by default.\n// to use hooks, for eg. useState use it like React.useState()\nfunction App() {\n  return <h1>Hello</h1>;\n}`);
    }
  }, [ques, questions, solutions]);

  // shortcut for ctrl + s to stop browser from interfering
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        e.stopPropagation(); 
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  
  // shortcut for submitting the solution
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        const btn = document.getElementById("submit-btn") as HTMLButtonElement;
        btn?.click();
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  
  // shortcut for logging out
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "l") {
        const btn = document.getElementById("logout-btn") as HTMLButtonElement;
        btn?.click();
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isLoggedIn) return <LandingPage />;

  return (
    <div className="h-screen flex flex-col" id='panel'>
      <Header
        userInfo={userInfo}
        questions={questions}
        ques={ques}
        setQues={setQues}
        questionMap={questionMap}
        setQuestionMap={setQuestionMap}
        logoutClick={logoutClick}
        nextClick={nextClick}
        prevClick={prevClick}
      />

      <QuestionSidebar
        questionMap={questionMap}
        setQuestionMap={setQuestionMap}
        questions={questions}
        setQues={setQues}
      />

      <PanelGroup direction={isMobile ? "vertical" : "horizontal"}>
        <EditorPanel
          code={code}
          setCode={setCode}
          questions={questions}
          ques={ques}
          solutions={solutions}
        />

        <PanelResizeHandle className="w-1 rounded bg-cyan-900 hover:bg-cyan-400 transition-colors cursor-col-resize" />

        <PreviewPanel html={html} output={output} compareSolution={compareSolution} iframeRef={iframeRef} />
      </PanelGroup>
    </div>
  );
};

export default Home;
