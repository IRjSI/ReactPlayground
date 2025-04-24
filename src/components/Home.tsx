import { useState } from 'react';
import * as Babel from '@babel/standalone';
import Editor from "@monaco-editor/react";

const Home = () => {
  const [code, setCode] = useState(`function App() {\n  return <h1>Hello</h1>;\n}`);

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

  const html = compileCode(code);

  return (
    <div className="grid grid-cols-2 gap-4 h-full p-4">

      {/* editor */}
      <div className="border rounded-lg p-2">
        <Editor
          onChange={(value) => setCode(value || '')}
          height="90vh"
          defaultLanguage="JavaScript"
          defaultValue={code}
          theme='vs-dark'
        />
        
      </div>

      {/* output */}
      <div className="border rounded-lg p-2">
        <div className='bg-white'>
          <iframe
            sandbox="allow-scripts"
            srcDoc={html}
            title="preview"
            style={{ width: "100%", height: "90vh", border: "1px solid #ccc" }}
          />
        </div>
      </div>

    </div>
  );
};

export default Home;
