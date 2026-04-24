import { useContext } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { AuthContext, AuthContextType } from "../context/authContext";
import Home from "../components/Home";
import {
  ArrowRight,
  Terminal,
  Cpu,
  Activity,
} from "lucide-react";

const LandingPage = () => {
  const { isLoggedIn } = useContext(AuthContext) as AuthContextType;

  if (isLoggedIn) return <Home />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="fixed inset-0 opacity-[0.04] bg-[radial-gradient(circle,white_1px,transparent_1px)] background-size-[40px_40px]" />

      <div className="relative z-10">
        <div className="px-6 py-4 max-w-6xl mx-auto">
          <Header />
        </div>

        <section className="px-6 pt-24 pb-20 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>
              <h1 className="text-5xl font-semibold leading-tight tracking-tight">
                Your React code
                <br />
                <span>gets executed.</span>
              </h1>

              <p className="mt-6 text-gray-400 text-lg max-w-lg">
                Not parsed. Not compared.
                <br />
                It runs in a browser, gets clicked, tested, and either breaks, or passes.
              </p>

              <div className="mt-8">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-md font-medium transition"
                >
                  Run your first solution
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <TerminalWindow>
              <div className="text-gray-500">$ submit solution</div>

              <div className="text-cyan-400">→ queued</div>
              <div className="text-cyan-400">→ worker picked job</div>
              <div className="text-cyan-400">→ launching browser</div>
              <div className="text-cyan-400">→ simulating click()</div>
              <div className="text-cyan-400">→ verifying DOM</div>

              <div className="text-green-400">✓ passed</div>
            </TerminalWindow>

          </div>
        </section>

        <section className="px-6 py-20 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">

            <Feature
              icon={<Terminal size={20} />}
              title="Write Real Code"
              desc="No MCQs. No fake environments. Just React."
            />

            <Feature
              icon={<Cpu size={20} />}
              title="Executed in Browser"
              desc="Your code runs in a real DOM, not a mock runtime."
            />

            <Feature
              icon={<Activity size={20} />}
              title="Async Evaluation"
              desc="Worker-based execution with real behavioral validation."
            />
          </div>
        </section>

        <section className="px-6 py-24 max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-12 text-center">
            What you’ll actually face
          </h2>

          <CodeWindow title="App.jsx">
            <pre>
              {`function App() {
  const [on, setOn] = useState(false);

  return (
    <button onClick={() => setOn(!on)}>
      {on ? "ON" : "OFF"}
    </button>
  );
}`}
            </pre>

            <div className="mt-6 text-gray-500">// test</div>
            <div className="mt-2 text-cyan-400">→ click button</div>
            <div className="text-cyan-400">→ expect "ON"</div>
            <div className="text-cyan-400">→ click again</div>
            <div className="text-cyan-400">→ expect "OFF"</div>
          </CodeWindow>
        </section>

        <section className="px-6 py-24 max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-12 text-center">
            Why this feels different
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            <div className="border border-gray-800 rounded-xl p-6">
              <h3 className="font-medium mb-4 text-gray-400">Typical platforms</h3>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li>• Compare output</li>
                <li>• Static test cases</li>
                <li>• No real UI interaction</li>
                <li>• Pass ≠ correct behavior</li>
              </ul>
            </div>

            <div className="border border-cyan-500/40 rounded-xl p-6 bg-cyan-500/5">
              <h3 className="font-medium mb-4 text-cyan-400">This system</h3>
              <ul className="space-y-2 text-sm">
                <li>• Runs in real browser</li>
                <li>• Simulates user actions</li>
                <li>• Validates DOM behavior</li>
                <li>• Fails if UX is wrong</li>
              </ul>
            </div>

          </div>
        </section>

        <section className="px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold">
            This is not practice.
          </h2>
          <p className="text-gray-400 mt-3">
            It’s execution under constraints.
          </p>

          <div className="mt-8">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black rounded-md transition"
            >
              Try it
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        <footer className="px-6 py-10 text-center text-gray-500 text-sm border-t border-gray-800">
          <div>© React Playground 2026</div>

          <div className="mt-2">
            <Link to="/privacy" className="hover:text-white underline">
              Privacy Policy
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

function Feature({ icon, title, desc }: any) {
  return (
    <div className="border border-gray-800 p-6 rounded-lg bg-[#0f0f0f]">
      <div className="mb-4 text-cyan-400">{icon}</div>
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{desc}</p>
    </div>
  );
}

function CodeWindow({ title, children }: any) {
  return (
    <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
      
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#111]">
        
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>

        <div className="text-xs text-gray-500 font-mono">
          {title}
        </div>

        <div className="w-12" />
      </div>

      <div className="p-5 font-mono text-sm text-gray-300 overflow-x-auto">
        {children}
      </div>
    </div>
  );
}

function TerminalWindow({ children }: any) {
  return (
    <div className="bg-[#0b0b0b] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
      
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#111]">
        
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>

        <div className="text-xs text-gray-500 font-mono">
          execution.log
        </div>

        <div className="w-12" />
      </div>

      <div className="p-5 font-mono text-sm text-gray-300 space-y-2">
        {children}
      </div>
    </div>
  );
}

export default LandingPage;