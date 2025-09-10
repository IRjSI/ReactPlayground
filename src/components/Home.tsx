import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as Babel from '@babel/standalone';
import Editor, { loader } from "@monaco-editor/react";
// import { 
//   solutionOne as validateOne, 
//   solutionTwo as validateTwo, 
//   solutionThree as validateThree, 
//   solutionFour as validateFour, 
//   solutionFive as validateFive, 
//   solutionSix as validateSix, 
//   solutionSeven as validateSeven, 
//   solutionEight as validateEight, 
//   solutionNine as validateNine, 
//   solutionTen as validateTen 
// } from "../challenges/challenges";
import { AuthContext, AuthContextType } from '../context/authContext';
import { 
  CheckCircle,
  ChevronLeft, 
  ChevronRight, 
  LogOutIcon, 
  MenuIcon, 
  X
} from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import LandingPage from '../Pages/LandingPage';

import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

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
      "editor.background": "#0f172a", // slate-900 background
      "editorLineNumber.foreground": "#64748b",
      "editorLineNumber.activeForeground": "#38bdf8", // cyan
      "editorCursor.foreground": "#38bdf8",
      "editorIndentGuide.background": "#334155",
    },
  });
});

const Home = () => {
  // to check the solution submitted by the user
  // const validators = [validateOne, validateTwo, validateThree, validateFour, validateFive, validateSix, validateSeven, validateEight, validateNine, validateTen];

  // state for code written by the user
  const [code, setCode] = useState(`// React is imported by default.\n// to use hooks, for eg. useState use it like React.useState()\nfunction App() {\n  return <h1>Hello</h1>;\n}`);
  // output of the code
  const [output, setOutput] = useState('');
  // to trigger useEffect
  const [refetch, setRefetch] = useState(false);
  // number of challenges(for indexing)
  const [ques, setQues] = useState(0);
  // to set all the challenges available in the db
  const [allQues, setAllQues] = useState([]);
  // to set the question as 'solved' or 'unsolved'
  const [completedQues, setCompletedQues] = useState([]);
  // to set the existing solutions of the user
  const [solutions, setSolutions] = useState<{ statement: string, solution: string }[]>([]);

  const [questionMap, setQuestionMap] = useState(false)

  // set all the questions statements
  const questions = allQues ? allQues.map((ques: { statement: string }) => ques.statement) : []
  
  const { token, isLoggedIn, logout } = useContext(AuthContext) as AuthContextType;

  // for showing the preview
  // Generates an HTML document with compiled user code and React runtime
  const compileCode = (inputCode: string) => {
    try {
      // Use Babel to convert JSX to plain JavaScript using the react preset (refer to Readme for more details)
      const compiledCode = Babel.transform(inputCode, { presets: ['react'] }).code;
      return `
        <html>
          <head></head>
          <body>
            <div id="root"></div>
            <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
            <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
            <script>
              try {
                ${compiledCode}
                ReactDOM.render(React.createElement(App), document.getElementById('root'));
              } catch (err) {
                document.body.innerHTML = '<pre>' + err + '</pre>';
              }
            </script>
          </body>
        </html>
      `;
    } catch (err: any) {
      return `
        <html><body><pre style="color: red;">Compilation Error:\n${err.message}</pre></body></html>
      `;
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
    await new Promise(resolve => { iframe.onload = resolve; });
    const iframeDoc = iframe.contentDocument?.documentElement.outerHTML;
    if (!iframeDoc) return setOutput("Iframe not loaded");
    
    // with the help of the validators check the correctness of the solution
    await submitSolution(code)
    
    
    // if the solution is correct
    
  };

  async function submitSolution(iframeDoc: any) {
    setOutput("checking...");
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/submission/submit`, { iframeDoc });
      const { solutionId } = res.data;

      console.log(res)

      // Register for result
      socket.emit("register", solutionId);

      socket.on("solutionResult", async (data: any) => {
        if (data.solutionId === solutionId) {
          setOutput(data.result == "valid" ? "Correct Solution" : "Incorrect Solution");
          if (data.result == "valid") {
            setRefetch(prev => !prev);
            // save progress -> add the challenge to the User's table
            await saveProgress();
            // add solution -> add the solution in the Solution's table
            await addSolution();
          }
        }
      });
    } catch (error) {
      setOutput("error...")
      console.log(error)
    }
  }

  // save progress -> add the challenge to the User's table
  const saveProgress = async () => {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/challenges/add-challenge`,
      { statement: questions[ques] },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  }

  // add solution -> add the solution in the Solution's table
  const addSolution = async () => {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/solutions/add-solution`,
      { 
        statement: questions[ques],
        solution: code 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  }

  // to display next challenge
  const nextClick = async () => {
    setQues(ques < questions.length - 1 ? ques + 1 : 0)
  }

  // to display previous challenge
  const prevClick = async () => {
    setQues(ques > 0 ? ques - 1 : questions.length - 1)
  }

  // to logout the user
  const logoutClick = () => {
    logout()
  }
  
  // useEffect to fetch all the challenges and store in allQues
  useEffect(() => {
    if (!token) return;

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/challenges/get-challenges`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setAllQues(response.data.data)
      })

  }, [token, refetch])

  // useEffect to fetch all the user's completed challenges and solutions
  useEffect(() => {
    if (!token) return;

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/challenges/get-user-challenges`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setCompletedQues(response.data.data.challenges)
      })

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/solutions/get-solutions`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setSolutions(response.data.data.solutions)
      })
      
  }, [token, ques])
  
  // to redirect to Landing page if not signed in
  if (!isLoggedIn) return <LandingPage />;

  return (
    <div className="h-screen flex flex-col">

      <div className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md">

        <button
          onClick={() => setQuestionMap((prev) => !prev)}
          className="border border-cyan-400/50 px-2 py-2 text-white rounded-lg text-sm font-semibold transition-all transform hover:scale-105 duration-300 shadow-lg hover:shadow-cyan-500/30 focus:outline-none z-20 backdrop-blur-lg"
        >
          {questionMap ? <X size={18} /> : <MenuIcon size={18} />}
        </button>
        
        <div className="text-xl font-semibold">
          <div className='flex gap-2 justify-center items-center'>
            <div>
              {/* 
                displaying the challenge
                questions -> array of statements
                ques -> 0, 1, 2, ...
              */}
              {questions[ques]}
            </div>
          </div>

          <div>
            {/* if completed challenges' statement matches with any of the challenges, it is solved */}
            {completedQues.some((item: { statement: string }) => item.statement === questions[ques]) ? (
              <span className="text-green-500">solved</span>
            ) : (
              <span className="text-red-500">unsolved</span>
            )}
          </div>

        </div>
        <div className='flex justify-center items-center gap-2'>
          <button
            onClick={() => prevClick()}
            className={`px-2 py-2 ${ques > 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-500"} rounded-lg transition text-sm`}
            disabled = {ques < 1}
            >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => nextClick()}
            className={`px-2 py-2 ${ques < questions.length-1 ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-500"} rounded-lg transition text-sm`}
            disabled = {ques > questions.length - 2}
          >
            <ChevronRight size={18} />
          </button>
          <div className='cursor-pointer border border-red-500 bg-red-600/20 px-2 py-2 rounded-lg text-red-500 transition-all transform hover:scale-105 duration-300 shadow-lg hover:shadow-red-500/30 focus:outline-none'>
            <LogOutIcon onClick={logoutClick} size={18} />
          </div>
        </div>
      </div>

      {questionMap && (
        <div className="absolute top-0 left-0 h-full w-1/4 space-y-4 p-4 z-10 rounded-r-xl bg-cyan-800/20 backdrop-blur-lg shadow-lg overflow-y-auto pt-16">
          {questions.map((question, index) => (
            <div
              key={index}
              className="flex flex-col p-2 rounded-md cursor-pointer hover:bg-cyan-800/30 transition"
              onClick={() => setQues(index)}
            >
              <span className="text-white font-medium flex items-center justify-between">
                {index + 1}. {question}
                
                {completedQues.some((item: { statement: string }) => item.statement === question) && (
                  <span className="text-green-500"><CheckCircle size={16} /></span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      <PanelGroup direction="horizontal">
        {/* Left: Editor */}
        <Panel defaultSize={50} minSize={25}>
          <div className="h-full p-2 pr-1 bg-gray-900/50">
            <div className="h-full border border-cyan-800 rounded-lg shadow-inner overflow-hidden">
              <Editor
                onChange={(value) => setCode(value || "")}
                defaultLanguage="javascript"
                value={
                  completedQues.some((item: { statement: string }) => item.statement === questions[ques])
                    ? solutions.find((solution: { statement: string }) => solution.statement === questions[ques])?.solution
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

        {/* Draggable divider */}
        <PanelResizeHandle className="w-1 rounded bg-cyan-900 hover:bg-cyan-400 transition-colors cursor-col-resize" />

        {/* Right: Output */}
        <Panel defaultSize={50} minSize={25}>
          <div className="h-full p-2 pl-1 bg-gray-900/50">
            <div className="relative h-full border border-cyan-800 rounded-lg shadow-inner overflow-hidden flex flex-col">
              <iframe
                sandbox="allow-scripts allow-same-origin"
                srcDoc={html}
                title="preview"
                className="flex-1 w-full border-b bg-gray-100"
              />
              <div className="p-4 flex justify-between items-center border-t border-gray-700">
                <span className={`${output === "Correct Solution" ? "text-green-500" : output === "Incorrect Solution" ? "text-red-500" : "text-cyan-400"} text-sm font-medium`}>{output}</span>
                <button
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
      </PanelGroup>
    </div>
  )
};

export default Home;
