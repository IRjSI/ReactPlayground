import { Panel } from "react-resizable-panels";
import Editor from "@monaco-editor/react";

/* Type */
import { EditorPanelProps } from '../types/types';

export function EditorPanel({
  code,
  setCode,
}: EditorPanelProps) {

  return (
    <Panel defaultSize={48} minSize={25}>
      <div className="h-full rounded-xl bg-gray-900/50 border border-gray-800 p-4 shadow-sm flex flex-col overflow-hidden text-gray-200">
        <div className="flex-1 rounded-lg border border-gray-800/50 bg-[#111]/40 shadow-inner overflow-hidden relative">
          <Editor
            onChange={(v) => setCode(v || "")}
            defaultLanguage="javascript"
            value={code}
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


