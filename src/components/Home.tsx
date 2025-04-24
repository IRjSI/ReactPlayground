import { useState } from 'react';
import * as Babel from '@babel/standalone';
import Editor from "@monaco-editor/react";

const Home = () => {
  const [code, setCode] = useState(`function App() {\n  return <h1>Hello</h1>;\n}`);
  const [output, setOutput] = useState('');

  const compileCode = (inputCode: string) => {
    try {
      // convert jsx to regular js
      // presets: ['react'] => tells babel to support react JSX syntax
      // .code => gives the actual code(JavaScript string output)

      /* example
      input: `function App() { return <h1>Hello</h1>; }`
      output: `function App() { return React.createElement("h1", null, "Hello"); }`
      */

      const compiledCode = Babel.transform(inputCode, { presets: ['react'] }).code;

      // html document is returned(as a string) which will be passed in iframe (srcDoc)
      // this html will run the compiled js code in the iframe
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

  const compareSolution = () => {
    const iframe = document.querySelector("iframe") as HTMLIFrameElement;
    const iframeDoc = iframe?.contentDocument;    
  
    if (!iframeDoc) {
      console.log("Iframe not loaded");
      return;
    }

    // solution validation
  
    const button = iframeDoc.querySelector("button");
  
    if (button && button.innerText === "Click Me") {
      setOutput("✅ Correct solution");
    } else {
      setOutput("❌ Incorrect solution");
    }
  };

  const html = compileCode(code);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">

      {/* editor */}
      <div className="border rounded-lg p-2">
        <Editor
          onChange={(value) => setCode(value || '')}
          defaultLanguage="JavaScript"
          height={"100%"}
          defaultValue={code}
          theme='vs-dark'
        />
        
      </div>

      {/* output */}
      <div className="border rounded-lg p-2 relative">
        <div className='bg-white'>
          <iframe
            sandbox="allow-scripts allow-same-origin"
            srcDoc={html}
            title="preview"
            className="w-full h-[80vh] border border-gray-300 rounded-lg shadow-md"
          />
        </div>
        <div>
          {output}
        </div>
        <button className="absolute top-5 right-5 ml-4 px-2 rounded-sm border-2 border-blue-500/20 bg-blue-500" onClick={() => compareSolution()}>Submit</button>
      </div>

    </div>
  );
};

export default Home;
