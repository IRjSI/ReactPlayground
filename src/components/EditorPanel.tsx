import { Panel } from "react-resizable-panels";
import Editor from "@monaco-editor/react";

/* Type */
import { EditorPanelProps } from '../types/types';

export function EditorPanel({
  code,
  setCode,
  solutions,
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
              (() => {
                const currentQ = questions[ques];

                if (!currentQ?.solved) return code;

                const existing = solutions.find(
                  s => s.challenge === currentQ._id
                );

                return existing?.solution || code;
              })()
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


