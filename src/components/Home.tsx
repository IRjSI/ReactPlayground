import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as Babel from '@babel/standalone';
import Editor, { loader } from "@monaco-editor/react";
import { AuthContext, AuthContextType } from '../context/authContext';
import { 
  CheckCircle,
  ChevronLeft, 
  ChevronRight,
  Flame,
  MenuIcon,
  X
} from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import LandingPage from '../Pages/LandingPage';
import { io } from "socket.io-client";
import { Link } from 'react-router-dom';
import { useUser } from '../utils/useUser';
import { EditorPanelProps, HeaderProps, PreviewPanelProps, QuestionType, SidebarProps, SolutionType } from '../types/types';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip'

const socket = io("https://reactplaygroundbe-production.up.railway.app");

/* ---------------- THEME ---------------- */
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



/* ---------------- MAIN ---------------- */
const Home = () => {
  // state for code written by the user
  const [code, setCode] = useState(`// React is imported by default.\n// to use hooks, for eg. useState use it like React.useState()\nfunction App() {\n  return <h1>Hello</h1>;\n}`);
  
  const [output, setOutput] = useState('');
  // to trigger useEffect
  const [refetch, setRefetch] = useState(false);
  // number of challenges(for indexing)
  const [ques, setQues] = useState(0);
  // to set all the challenges available in the db
  const [allQues, setAllQues] = useState<QuestionType[]>([]);
  // to set the tag: 'solved' or 'unsolved'
  const [completedQues, setCompletedQues] = useState<QuestionType[]>([]);
  // to set the existing solutions of the user
  const [solutions, setSolutions] = useState<SolutionType[]>([]);
  const [questionMap, setQuestionMap] = useState(false);
  
  // set all the questions statements
  const questions = allQues?.map(q => q.statement) || [];

  const { token, isLoggedIn, logout } = useContext(AuthContext) as AuthContextType;
  const { userInfo } = useUser();

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
  const html = compileCode(code);

  // check if the user submitted code is correct or not
  const compareSolution = async () => {
    // get the iframe
    const iframe = document.querySelector("iframe") as HTMLIFrameElement;
    // set the source as html(compiledCode)
    iframe.srcdoc = html;

    await new Promise(res => iframe.onload = res);

    const iframeDoc = iframe.contentDocument?.documentElement.outerHTML;
    if (!iframeDoc) return setOutput("Iframe not loaded");

    await submitSolution(code);
  };

  async function submitSolution(iframeDoc: string) {
    setOutput("checking...");
    const challengeId = `challenge${ques + 1}Validator`;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/submission/submit`,
        { iframeDoc, challengeId }
      );
      const { solutionId } = res.data;

      // Register for result
      socket.emit("register", solutionId);

      socket.on("solutionResult", async (data: any) => {
        if (data.solutionId !== solutionId) return;

        setOutput(data.result === "valid" ? "Correct Solution" : "Incorrect Solution");

        if (data.result === "valid") {
          setRefetch(p => !p);
          // save progress -> add the challenge to the User's table
          await saveProgress();
          // add solution -> add the solution in the Solution's table
          await addSolution();
        }
      });
    } catch {
      setOutput("error...");
    }
  }

  // save progress -> add the challenge to the User's table
  const saveProgress = async () =>
    axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/challenges/add-challenge`,
      { statement: questions[ques] },
      { headers: { Authorization: `Bearer ${token}` } }
    );

  // add solution -> add the solution in the Solution's table
  const addSolution = async () =>
    axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/solutions/add-solution`,
      { statement: questions[ques], solution: code },
      { headers: { Authorization: `Bearer ${token}` } }
    );

  const nextClick = () => {
    setQues(ques < questions.length - 1 ? ques + 1 : ques);
    setOutput('');
  }
  const prevClick = () => {
    setQues(ques > 0 ? ques - 1 : ques);
    setOutput('');
  }
  const logoutClick = () => logout();

  // ----------- SHORTCUTS -----------

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


  // useEffect to fetch all the challenges nad store in allQues
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/challenges/get-challenges`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setAllQues(res.data.data));
  }, [token, refetch]);

  // useEffect to fetch all the user's completed challenges and solutions
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/challenges/get-user-challenges`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setCompletedQues(res.data.data.challenges));

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/solutions/get-solutions`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setSolutions(res.data.data.solutions));
  }, [token, ques]);

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
        completedQues={completedQues}
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
        completedQues={completedQues}
        setQues={setQues}
      />

      <PanelGroup direction={isMobile ? "vertical" : "horizontal"}>
        <EditorPanel
          code={code}
          setCode={setCode}
          questions={questions}
          ques={ques}
          completedQues={completedQues}
          solutions={solutions}
        />

        <PanelResizeHandle className="w-1 rounded bg-cyan-900 hover:bg-cyan-400 transition-colors cursor-col-resize" />

        <PreviewPanel html={html} output={output} compareSolution={compareSolution} />
      </PanelGroup>
    </div>
  );
};

/* ---------------- COMPONENTS ---------------- */

function Header({
  userInfo,
  questions,
  ques,
  setQuestionMap,
  questionMap,
  completedQues,
  nextClick,
  prevClick,
  logoutClick
}: HeaderProps) {
  return (
  <div className="flex justify-between items-center p-4 bg-gray-900 text-white border-b border-cyan-700/40 shadow-lg">

    {/* Sidebar toggle */}
    <div className='flex items-center justify-center gap-2'>

      <button
        onClick={() => setQuestionMap(prev => !prev)}
        className="border border-cyan-400/50 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-cyan-500/20 hover:border-cyan-400 shadow-cyan-500/20 shadow-sm backdrop-blur-lg"
        >
        {questionMap ? <X size={18} /> : <MenuIcon size={18} />}
      </button>

      <button
        onClick={prevClick}
        className={`px-3 py-2 rounded-lg text-sm transition ${
          ques > 0
            ? "bg-blue-600 hover:bg-blue-700 shadow-md"
            : "bg-blue-500 opacity-60 cursor-not-allowed"
        }`}
        disabled={ques < 1}
      >
        <ChevronLeft size={18} />
      </button>

      <button
        onClick={nextClick}
        className={`px-3 py-2 rounded-lg text-sm transition ${
          ques < questions.length - 1
            ? "bg-blue-600 hover:bg-blue-700 shadow-md"
            : "bg-blue-500 opacity-60 cursor-not-allowed"
        }`}
        disabled={ques > questions.length - 2}
      >
        <ChevronRight size={18} />
      </button>

      <Tooltip id="tooltip" />
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content="Logout (Ctrl + L)"
          id="logout-btn"
          className='cursor-pointer rounded-lg transition-all transform hover:scale-105 duration-300'
          onClick={logoutClick}
        ></div>
      
    </div>

    {/* Question + status */}
    <div className="text-center">
      <div className="flex gap-2 justify-center items-center text-lg font-semibold">
        {/* 
          displaying the challenge
          questions -> array of statements
          ques -> 0, 1, 2, ...
        */}
        {questions[ques]}
      </div>

      <div className="mt-1">
        {completedQues.some(i => i.statement === questions[ques]) ? (
          <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 border border-green-400/40 text-green-400">
            Solved
          </span>
        ) : (
          <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 border border-red-400/40 text-red-400">
            Unsolved
          </span>
        )}
      </div>
    </div>

    {/* Right Controls */}
    <div className="flex justify-center items-center gap-4">

      <span className="flex items-center gap-1.5 text-orange-400 px-2 py-1 rounded-md border border-orange-400/40 bg-orange-500/10 shadow-sm shadow-orange-500/30">
        <Flame size={18} className="fill-orange-400" />
        <span className="font-semibold tracking-wide">
          {userInfo?.streak?.current || 0}
        </span>
      </span>

      <Link
        to={"/profile"}
        className="rounded-lg transition transform hover:scale-105"
      >
        <img
          src={userInfo?.avatar}
          alt="avatar"
          className="rounded-lg w-10 h-10 object-cover"
        />
      </Link>
    </div>
  </div>
);
}

function QuestionSidebar({ questionMap, setQuestionMap, questions, completedQues, setQues }: SidebarProps) {
  if (!questionMap) return null;

  return (
    <div className="absolute top-0 left-0 h-full w-1/4 space-y-4 p-4 z-10 rounded-r-xl bg-cyan-800/20 backdrop-blur-lg shadow-lg overflow-y-auto pt-16">
      <button
        onClick={() => setQuestionMap(false)}
        className="absolute top-4 right-4 border border-cyan-400/50 px-2 py-2 text-white rounded-lg text-sm font-semibold transition-all transform hover:scale-105 duration-300 shadow-lg hover:shadow-cyan-500/30 focus:outline-none"
      >
        <X size={18} />
      </button>

      {questions.map((q, i) => (
        <div
          key={i}
          className="flex flex-col p-2 rounded-md cursor-pointer hover:bg-cyan-800/30 transition"
          onClick={() => setQues(i)}
        >
          <span className="text-white font-medium flex items-center justify-between">
            {i + 1}. {q}
            {completedQues.some(x => x.statement === q) && (
              <span className="text-green-500"><CheckCircle size={16} /></span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

function EditorPanel({
  code,
  setCode,
  solutions,
  completedQues,
  questions,
  ques
}: EditorPanelProps) {
  return (
    <Panel defaultSize={52} minSize={25}>
      <div className="h-full p-2 pr-1 bg-gray-900/50">
        <div className="h-full border border-cyan-800 rounded-lg shadow-inner overflow-hidden">
          <Editor
            onChange={(v) => setCode(v || "")}
            defaultLanguage="javascript"
            value={
              completedQues.some(i => i.statement === questions[ques])
                ? solutions.find(s => s.statement === questions[ques])?.solution
                : code
            }
            theme="custom-dark"
            height="100%"
            options={{
              fontSize: 16,
              fontFamily: "'Fira Code', monospace",
              minimap: { enabled: false },
              lineNumbers: "on",
              cursorBlinking: "expand",
              smoothScrolling: true,
              padding: { top: 20 },
              scrollBeyondLastLine: false,
              wordWrap: "on",
              formatOnType: true,
              formatOnPaste: true,
              renderLineHighlight: "gutter",
              tabSize: 2,
              bracketPairColorization: { enabled: true },
              autoClosingBrackets: "always",
              autoClosingQuotes: "always",
              quickSuggestions: true,
              suggestOnTriggerCharacters: true,
              overviewRulerBorder: false,
              scrollbar: {
                verticalScrollbarSize: 5,
                horizontalScrollbarSize: 5,
                alwaysConsumeMouseWheel: false,
              },
            }}
          />
        </div>
      </div>
    </Panel>
  );
}

function PreviewPanel({ html, output, compareSolution }: PreviewPanelProps) {
  return (
    <Panel defaultSize={48} minSize={25}>
      <div className="h-full p-2 pl-1 bg-gray-900/50">
        <div className="relative h-full border border-cyan-800 rounded-lg shadow-inner overflow-hidden flex flex-col">
          <iframe
            sandbox="allow-scripts allow-same-origin"
            srcDoc={html}
            title="preview"
            className="flex-1 w-full border-b bg-gray-100"
          />

          <div className="p-4 flex justify-between items-center border-t border-gray-700">
            <span className={`${
              output === "Correct Solution"
                ? "text-green-500"
                : output === "Incorrect Solution"
                ? "text-red-500"
                : "text-cyan-400"
            } text-sm font-medium`}>
              {output}
            </span>
            
            <Tooltip id="tooltip" />
            <button
              data-tooltip-id="tooltip"
              data-tooltip-content="Ctrl + Enter"
              id="submit-btn"
              onClick={compareSolution}
              disabled={output === "checking..."}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition text-white text-sm"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default Home;
