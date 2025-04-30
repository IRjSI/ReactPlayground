import { useContext, useEffect, useState } from 'react';
import * as Babel from '@babel/standalone';
import Editor from "@monaco-editor/react";
import { One, solution as validateOne } from "../challenges/one";
import { Two, solution as validateTwo } from '../challenges/two';
import { Three, solution as validateThree } from '../challenges/three';
import { Four, solution as validateFour } from '../challenges/four';
import { Five, solution as validateFive } from '../challenges/five';
import axios from 'axios';
import { AuthContext } from '../context/authContext';

const Home = () => {
  const validators = [validateOne, validateTwo, validateThree, validateFour, validateFive];
  const [code, setCode] = useState(`function App() {\n  return <h1>Hello</h1>;\n}`);
  const [output, setOutput] = useState('');
  const [ques, setQues] = useState(0);
  const [completedQues, setCompletedQues] = useState([]);

  const questions = [<One />, <Two />, <Three />, <Four />, <Five />];

  //@ts-ignore
  const { token } = useContext(AuthContext);

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
    setOutput(isValid ? "✅ Correct solution" : "❌ Incorrect solution");
  };

  const nextClick = async () => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/add-challenge`,
      { challenge: ques.toString() },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (response.data.success) {
      console.log(response.data)
      setQues(ques < questions.length - 1 ? ques + 1 : 0)
    }
  }

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/get-challenges`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => {
          setCompletedQues(response.data.data.challenges)
        })
  }, [token])

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md">
        <div className="text-xl font-semibold">
          {/* @ts-ignore */}
          {completedQues.includes(ques.toString()) ? "(solved)" : questions[ques]}
        </div>
        <button
          onClick={() => nextClick()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm"
        >
          Next
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 p-4 overflow-auto bg-gray-900/50">
          <div className="h-full border rounded-xl shadow-inner overflow-hidden">
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
        <div className="w-1/2 p-4 overflow-auto bg-gray-900/50">
          <div className="relative h-full border rounded-xl shadow-inner overflow-hidden flex flex-col">
            <iframe
              sandbox="allow-scripts allow-same-origin"
              srcDoc={html}
              title="preview"
              className="flex-1 w-full border-b bg-gray-100"
            />
            <div className="p-4 flex justify-between items-center border-t">
              <span className="text-sm font-medium">{output}</span>
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
