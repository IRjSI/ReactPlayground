import * as Babel from '@babel/standalone';
import { useLocation, useParams } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getChallengeByIdAPI, getSolutionByChallengeIdAPI, submitCodeAPI } from "../services/API";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AuthContext, AuthContextType } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { loader } from "@monaco-editor/react";
import { io } from 'socket.io-client';
import { EditorPanel } from './EditorPanel';
import { PreviewPanel } from './PreviewPanel';
import { Header } from './Header_home';

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

const ChallengeLayout = () => {
    const state = useLocation();
    const { ques } = state.state;
    const { challengeId } = useParams();
    const { userInfo } = useUser();
    const { logout } = useContext(AuthContext) as AuthContextType;
    const navigate = useNavigate();
    const [code, setCode] = useState(`// React is imported by default.\n// to use hooks, for eg. useState use it like React.useState()\nfunction App() {\n  return <h1>Hello</h1>;\n}`);
    const [output, setOutput] = useState('');

    const queryClient = useQueryClient();

    const { data: challenge, isLoading: isChallengeLoading } = useQuery({
        queryKey: ['challenge', challengeId],
        queryFn: () => getChallengeByIdAPI(challengeId!),
        enabled: !!challengeId,
        staleTime: 1000 * 60 * 10,
        retry: 1,
    });

    const { data: solution, isLoading: isSolutionLoading } = useQuery({
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
        const validatorKey = `challenge${ques}Validator`;

        try {
            const res = await submitCodeAPI(iframeDoc, validatorKey, challengeId!);
            const { solutionId } = res;

            // Register for result
            socket.emit("register", solutionId);

            socket.off("solutionResult");

            socket.once("solutionResult", async (data: any) => {
                if (data.solutionId !== solutionId) return;

                setOutput(data.result === "valid" ? "Correct Solution" : "Incorrect Solution");

                queryClient.invalidateQueries({
                    queryKey: ['solution', challengeId]
                });

                // Also invalidate challenges so the Home page updates
                queryClient.invalidateQueries({
                    queryKey: ['challenges']
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

    // skeleton
    if (isChallengeLoading || isSolutionLoading) {
        return (
            <div className="h-screen flex flex-col bg-[#0a0a0a]">
                <div className="h-[90px] border-b border-cyan-700/40 bg-gray-900 px-4 flex items-center justify-between shadow-lg">
                    <div className="w-9 h-9 rounded-lg bg-gray-800 animate-pulse" />
                    <div className="w-1/3 h-6 rounded-md bg-gray-800 animate-pulse" />
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-8 rounded-md bg-gray-800 animate-pulse" />
                        <div className="w-10 h-10 rounded-lg bg-gray-800 animate-pulse" />
                    </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row gap-4 p-4">
                    <div className="flex-1 rounded-xl bg-gray-900/50 border border-gray-800 p-4 shadow-sm flex flex-col">
                        <div className="space-y-4 pt-4 flex-1">
                            <div className="w-3/4 h-5 bg-gray-800/80 rounded animate-pulse" />
                            <div className="w-1/2 h-5 bg-gray-800/60 rounded animate-pulse" />
                            <div className="w-5/6 h-5 bg-gray-800/80 rounded animate-pulse ml-4" />
                            <div className="w-2/3 h-5 bg-gray-800/60 rounded animate-pulse ml-4" />
                            <div className="w-1/3 h-5 bg-gray-800/80 rounded animate-pulse" />
                        </div>
                    </div>

                    <div className="flex-1 rounded-xl bg-gray-900/50 border border-gray-800 p-4 shadow-sm flex flex-col">
                        <div className="w-full flex justify-end mb-4 border-b border-gray-800 pb-2">
                            <div className="w-24 h-8 bg-gray-800 rounded animate-pulse" />
                        </div>
                        <div className="flex-1 bg-[#111]/40 rounded-lg border border-gray-800/50 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-[#0a0a0a]" id='panel'>

            <Header logoutClick={logoutClick} userInfo={userInfo} challenge={challenge} />

            <div className="flex-1 overflow-hidden p-4">
                <PanelGroup direction={isMobile ? "vertical" : "horizontal"} className='gap-1'>
                    <EditorPanel code={code} setCode={setCode} />

                    <PanelResizeHandle className="w-1 h-full flex-shrink-0 relative group">
                        <div className="absolute inset-y-0 inset-x-1.5 md:inset-x-0 md:inset-y-1.5 bg-gray-800 rounded-full group-hover:bg-cyan-500/50 transition-colors" />
                    </PanelResizeHandle>

                    <PreviewPanel compareSolution={compareSolution} html={html} iframeRef={iframeRef} output={output} />
                </PanelGroup>
            </div>

        </div>
    )
}

export default ChallengeLayout;
