import { Panel } from "react-resizable-panels";
import { Tooltip } from 'react-tooltip'

/* Type */
import { PreviewPanelProps } from '../types/types';

export function PreviewPanel({ html, output, compareSolution, iframeRef }: PreviewPanelProps) {
  return (
    <Panel defaultSize={48} minSize={25}>
      <div className="h-full rounded-xl bg-gray-900/50 border border-gray-800 p-4 shadow-sm flex flex-col overflow-hidden">
        <div className="w-full flex justify-end items-center mb-4 border-b border-gray-800 pb-2">
            <span className={`${
              output === "Correct Solution"
                ? "text-green-500"
                : output === "Incorrect Solution"
                ? "text-red-500"
                : "text-cyan-400"
            } text-sm font-medium tracking-wide mr-4`}>
              {output}
            </span>
            
            <Tooltip id="tooltip" />
            <button
              data-tooltip-id="tooltip"
              data-tooltip-content="Ctrl + Enter"
              id="submit-btn"
              onClick={compareSolution}
              disabled={output === "checking..."}
              className="px-5 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 font-bold hover:bg-green-500/20 rounded-lg transition text-sm shadow-[0_0_10px_rgba(34,197,94,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
        </div>

        <div className="flex-1 rounded-lg border border-gray-800/50 bg-[#111]/40 overflow-hidden relative">
          <iframe
            ref={iframeRef}
            sandbox="allow-scripts allow-same-origin"
            srcDoc={html}
            title="preview"
            className="absolute inset-0 w-full h-full bg-white"
          />
        </div>
      </div>
    </Panel>
  );
}