import { useContext, useEffect, useState } from 'react';
import * as Babel from '@babel/standalone';
import Editor from "@monaco-editor/react";
import { solution as validateOne } from "../challenges/one";
import { solution as validateTwo } from '../challenges/two';
import { solution as validateThree } from '../challenges/three';
import { solution as validateFour } from '../challenges/four';
import { solution as validateFive } from '../challenges/five';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import LandingPage from '../Pages/LandingPage';
import { ChevronLeft, ChevronRight, LogOutIcon, User } from "lucide-react";
import { Link } from 'react-router-dom';

const Home = () => {
  const validators = [validateOne, validateTwo, validateThree, validateFour, validateFive];
  const [code, setCode] = useState(`function App() {\n  return <h1>Hello</h1>;\n}`);
  const [output, setOutput] = useState('');
  const [refetch, setRefetch] = useState(false);
  const [ques, setQues] = useState(0);
  const [completedQues, setCompletedQues] = useState([]);
  const [allQues, setAllQues] = useState([]);
  const [solutions, setSolutions] = useState([]);

  // const questions = [<One />, <Two />, <Three />, <Four />, <Five />];
  // const questions = [                                                 
  //   "Challenge 1: Write a jsx that returns a button",
  //   "Challenge 2: Make a button that changes <i>it's</i> text(to 'click') on click",
  //   "Challenge 3: Have an input box and show the live input below it",
  //   "Challenge 4: Show a list of fruits using .map()",
  //   "Challenge 5: User types a fruit in input → clicks 'Add' → adds to list"
  // ];

  const questions = allQues ? allQues.map((ques: any) => ques.statement) : []

  //@ts-ignore                        
  const { token, isLoggedIn, logout } = useContext(AuthContext);

  const compileCode = (inputCode: string) => {
    try {
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

  const html = compileCode(code);

  const compareSolution = async () => {
    const iframe = document.querySelector("iframe") as HTMLIFrameElement;
    iframe.srcdoc = html;
    await new Promise(resolve => { iframe.onload = resolve; });
    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) return setOutput("❌ Iframe not loaded");
    
    const isValid = await validators[ques](iframeDoc, html);
    setOutput(isValid ? "correct" : "incorrect");

    //@ts-ignore
    if (isValid && !completedQues.includes(ques.toString())) {
      setRefetch(prev => !prev)
      await saveProgress();
      await addSolution();
    }
  };

  const addSolution = async () => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/add-solution`,
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

    if (response.data.success) {
      console.log(response.data);
    }
  }

  const saveProgress = async () => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/challenges/add-challenge`,
      { statement: questions[ques] },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (response.data.success) {
      console.log(response.data);
      //@ts-ignore
      setCompletedQues([...completedQues, ques.toString()]);
    }
  }

  const nextClick = async () => {
    setQues(ques < questions.length - 1 ? ques + 1 : 0)
  }

  const prevClick = async () => {
    setQues(ques > 0 ? ques - 1 : questions.length - 1)
  }

  const logoutClick = () => {
    logout()
  }
  
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

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/get-solutions`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setSolutions(response.data.data.solutions)
      })
      
  }, [token])
  
  if (!isLoggedIn) return <LandingPage />;

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md">
      <Link to={'/profile'} className="border border-cyan-400/50 px-2 py-2 text-white rounded-full text-sm font-semibold transition-all transform hover:scale-105 duration-300 shadow-lg hover:shadow-cyan-500/30 focus:outline-none">
        <User size={18} />
      </Link>
        <div className="text-xl font-semibold">
          {/* @ts-ignore */}
          <div className='flex gap-2 justify-center items-center'>
            {/* <div className='w-8 h-8 flex items-center justify-center rounded-full bg-green-500'>
              {ques+1}
            </div> */}
            <div>
              {questions[ques]}
            </div>
          </div>

          <div>
            {completedQues.some((item: { statement: string }) => item.statement === questions[ques]) ? (
              <span className="text-green-500">solved</span>
            ) : (
              <span className="text-red-500">unsolved</span>
            )}
          </div>

        </div>
        <div className='flex justify-center items-center gap-1'>
          <button
            onClick={() => prevClick()}
            className={`px-2 py-2 ${ques > 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-500"} rounded-lg transition text-sm`}
            disabled = {ques < 1}
            >
            <ChevronLeft />
          </button>
          <button
            onClick={() => nextClick()}
            className={`px-2 py-2 mr-1 ${ques < questions.length-1 ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-500"} rounded-lg transition text-sm`}
            disabled = {ques > questions.length - 2}
            >
            <ChevronRight />
          </button>
          <div className='cursor-pointer border border-red-500 bg-red-600/20 px-2 py-2 rounded-full text-red-500 transition-all transform hover:scale-105 duration-300 shadow-lg hover:shadow-red-500/30 focus:outline-none'>
            <LogOutIcon onClick={logoutClick} size={18} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 h-full overflow-hidden">
        <div className="p-4 overflow-auto bg-gray-900/50">
          <div className="h-full border rounded-md shadow-inner overflow-hidden">
            <Editor
              onChange={(value) => setCode(value || '')}
              defaultLanguage="javascript"
              value={code}
              theme="vs-dark"
              height="100%"
              options={{
                fontSize: 16,
                fontFamily: "'Fira Code', monospace",
                minimap: { enabled: false },
                lineNumbers: 'on',
                cursorBlinking: 'expand',
                smoothScrolling: true,
                padding: { top: 20 },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                formatOnType: true,
                formatOnPaste: true,
                renderLineHighlight: 'gutter',
                tabSize: 2,
                bracketPairColorization: { enabled: true },
                autoClosingBrackets: 'always',
                autoClosingQuotes: 'always',
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

        {/* Output */}
        <div className="p-4 overflow-auto bg-gray-900/50">
          <div className="relative h-full border rounded-md shadow-inner overflow-hidden flex flex-col">
            <iframe
              sandbox="allow-scripts allow-same-origin"
              srcDoc={html}
              title="preview"
              className="flex-1 w-full border-b bg-gray-100"
            />
            <div className="p-4 flex justify-between items-center border-t">
              <span className={`${output === "correct" ? "text-green-500 text-sm font-medium" : "text-red-500 text-sm font-medium"}`}>{output === 'correct' ? '✅ Correct Solution' : '❌ Incorrect Solution'}</span>
              <button
                onClick={() => compareSolution()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition text-white text-sm"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
