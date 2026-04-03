import { Panel } from "react-resizable-panels";
import { Tooltip } from 'react-tooltip'

/* Type */
import { PreviewPanelProps } from '../types/types';

export function PreviewPanel({ html, output, compareSolution, iframeRef }: PreviewPanelProps) {
  return (
    <Panel defaultSize={48} minSize={25}>
      <div className="h-full p-2 pl-1 bg-gray-900/50">
        <div className="relative h-full border border-cyan-800 rounded-lg shadow-inner overflow-hidden flex flex-col">
          <iframe
            ref={iframeRef}
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