import * as Babel from '@babel/standalone';
import { Link, useParams } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getChallengeByIdAPI, getSolutionByChallengeIdAPI, submitCodeAPI } from "../services/API";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AuthContext, AuthContextType } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { Flame, Home } from "lucide-react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Editor, loader } from "@monaco-editor/react";
import { io } from 'socket.io-client';
import { Tooltip } from 'react-tooltip';

const socket = import.meta.env.VITE_ENV === "dev" ? io("http://localhost:4000") : io("https://rpg-proxy.onrender.com");

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

const ChallengeLayout = ({ ques }: { ques: number }) => {
    const { challengeId } = useParams();
    const { userInfo } = useUser();
    const { logout, token } = useContext(AuthContext) as AuthContextType;
    const navigate = useNavigate();
    const [code, setCode] = useState(`// React is imported by default.\n// to use hooks, for eg. useState use it like React.useState()\nfunction App() {\n  return <h1>Hello</h1>;\n}`);
    const [output, setOutput] = useState('');

    const queryClient = useQueryClient();

    const { data: challenge } = useQuery({
        queryKey: ['challenge', challengeId],
        queryFn: () => getChallengeByIdAPI(challengeId!),
        enabled: !!challengeId,
        staleTime: 1000 * 60 * 10,
        retry: 1,
    });

    const { data: solution } = useQuery({
        queryKey: ['solution', challengeId],
        queryFn: () => getSolutionByChallengeIdAPI(challengeId!),
        enabled: !!challengeId,
        staleTime: 1000 * 60 * 10,
        retry: 1,
    });

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
                <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                <script>
                  try {
                    ${compiled}
                    const root = ReactDOM.createRoot(document.getElementById('root'));
                    root.render(React.createElement(App));
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
    const html = useMemo(() => compileCode(code), [code]);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // check if the user submitted code is correct or not
    const compareSolution = async () => {
        <iframe ref={iframeRef} />

        // get the iframe
        const iframe = iframeRef.current;

        if (!iframe) {
            setOutput("Iframe not found");
            return;
        }
        // set the source as html(compiledCode)
        iframe.srcdoc = html;

        // wait for load safely
        await new Promise<void>((resolve) => {
            const handler = () => {
                iframe.onload = null; // cleanup
                resolve();
            };
            iframe.onload = handler;
        });

        const iframeDoc = iframe.contentDocument?.documentElement.outerHTML;
        if (!iframeDoc) return setOutput("Iframe not loaded");

        await submitSolution(code);
    };

    async function submitSolution(iframeDoc: string) {
        setOutput("checking...");
        const validatorKey = `challenge${ques + 1}Validator`;

        try {
            const res = await submitCodeAPI(iframeDoc, validatorKey, challengeId!);
            const { solutionId } = res;

            // Register for result
            socket.emit("register", solutionId);

            socket.off("solutionResult");

            socket.once("solutionResult", async (data: any) => {
                if (data.solutionId !== solutionId) return;

                setOutput(data.result === "valid" ? "Correct Solution" : "Incorrect Solution");

                // // add solution -> add the solution in the Solution's table
                // await addSolution();

                queryClient.invalidateQueries({
                    queryKey: ['solution', token]
                });

            });
        } catch {
            setOutput("error...");
        }
    }

    const logoutClick = () => {
        logout();
        navigate("/");
    }

    useEffect(() => {
        const existing = solution;
        console.log(existing);

        if (existing && existing?.solution) {
            setCode(existing.solution);
        } else {
            setCode(`// React is imported by default.\n// to use hooks, for eg. useState use it like React.useState()\nfunction App() {\n  return <h1>Hello</h1>;\n}`);
        }
    }, [solution]);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="h-screen flex flex-col" id='panel'>


            <div className="flex flex-wrap gap-3 md:gap-0 md:flex-nowrap justify-between items-center p-3 md:p-4 bg-gray-900 text-white border-b border-cyan-700/40 shadow-lg">

                <button
                    onClick={() => navigate("/home")}
                    className="border border-cyan-400/50 p-2 rounded-lg transition-all hover:bg-cyan-500/20 hover:border-cyan-400 shadow-sm cursor-pointer"
                >
                    <Home fill='#00d3f2' stroke='#00d3f2' size={16} />
                </button>

                {/* LEFT CONTROLS */}
                <div className="flex items-center gap-2">
                    {/* Logout */}
                    <div
                        data-tooltip-id="tooltip"
                        data-tooltip-content="Logout (Ctrl + L)"
                        className="cursor-pointer p-2 rounded-lg hover:scale-105 transition"
                        onClick={logoutClick}
                    >
                    </div>
                </div>

                {/* CENTER QUESTION */}
                <div className="flex-1 min-w-50 text-center order-last md:order-0">
                    <div className="text-sm md:text-lg font-semibold truncate px-2">
                        {challenge?.challenge.statement}
                    </div>

                    <div className="mt-1">
                        {challenge?.result === "valid" ? (
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

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-3 ml-auto">
                    {/* Streak */}
                    <span className="flex items-center gap-1.5 text-orange-400 px-2 py-1 rounded-md border border-orange-400/40 bg-orange-500/10 shadow-sm">
                        <Flame size={18} className="fill-orange-400" />
                        <span className="font-semibold">
                            {userInfo?.user?.streak?.current || 0}
                        </span>
                    </span>

                    {/* Avatar */}
                    <Link
                        to="/profile"
                        className="rounded-lg hover:scale-105 transition"
                    >
                        <img
                            src={userInfo?.user.avatar}
                            alt="avatar"
                            className="rounded-lg w-9 h-9 md:w-10 md:h-10 object-cover"
                        />
                    </Link>
                </div>


            </div>

            <PanelGroup direction={isMobile ? "vertical" : "horizontal"}>
                <Panel defaultSize={52} minSize={25}>
                    <div className="h-full p-2 pr-1 bg-gray-900/50">
                        <div className="h-full border border-cyan-800 rounded-lg shadow-inner overflow-hidden">
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

                <PanelResizeHandle className="w-1 rounded bg-cyan-900 hover:bg-cyan-400 transition-colors cursor-col-resize" />

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
                                <span className={`${output === "Correct Solution"
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
            </PanelGroup>


        </div>
    )
}

export default ChallengeLayout;
