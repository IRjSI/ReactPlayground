import * as Babel from '@babel/standalone';
import { useParams } from "react-router-dom";
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

            <Header logoutClick={logoutClick} userInfo={userInfo} challenge={challenge} />

            <PanelGroup direction={isMobile ? "vertical" : "horizontal"}>
                <EditorPanel code={code} setCode={setCode} />

                <PanelResizeHandle className="w-1 rounded bg-cyan-900 hover:bg-cyan-400 transition-colors cursor-col-resize" />

                <PreviewPanel compareSolution={compareSolution} html={html} iframeRef={iframeRef} output={output} />
            </PanelGroup>

        </div>
    )
}

export default ChallengeLayout;
