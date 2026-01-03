import { useContext } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { AuthContext, AuthContextType } from "../context/authContext";
import Home from "../components/Home";
import { 
  Zap, 
  ArrowRight,
  Terminal,
  GitBranch,
  Sparkles
} from "lucide-react";

const LandingPage = () => {
  const { isLoggedIn } = useContext(AuthContext) as AuthContextType;
  
  if (isLoggedIn) return <Home />;

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle,rgba(6,182,212,0.03)_1px,transparent_1px)] [bg-size:50px_50px]" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
          <Header />
        </div>

        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 pt-20 pb-16 max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-400">
              <Sparkles size={16} />
              <span>Practice React like never before</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                Master React Through
                <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-cyan-300 to-cyan-500">
                  Hands-On Coding
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Solve React challenges, track your progress, and level up your frontend development skills.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-400 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25"
              >
                <span>Get Started Free</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-24 bg-gray-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">How it works</h2>
              <p className="text-xl text-gray-400">
                Start solving in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard
                number="01"
                icon={<Terminal className="text-cyan-400" size={32} />}
                title="Choose a Challenge"
                description="Pick from beginner to advanced React challenges covering hooks, state management, and more."
              />
              <StepCard
                number="02"
                icon={<GitBranch className="text-cyan-400" size={32} />}
                title="Write Your Solution"
                description="Code in our interactive editor with syntax highlighting and instant error detection."
              />
              <StepCard
                number="03"
                icon={<Zap className="text-cyan-400" size={32} />}
                title="Submit & Learn"
                description="Get instant feedback, see test results, and learn from the community's solutions."
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-800 max-w-7xl mx-auto">
          <div className="text-center text-gray-400">
            <p>© 2026 React Practice Platform. Built for developers, by developers.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

function StepCard({ number, icon, title, description }: any) {
  return (
    <div className="relative">
      <div className="text-6xl font-bold text-gray-800 absolute -top-4 -left-2">{number}</div>
      <div className="relative bg-gray-900/60 border border-gray-800 rounded-xl p-8 hover:border-cyan-500/50 transition-all">
        <div className="mb-4">{icon}</div>
        <h3 className="text-2xl font-semibold mb-3 text-white">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}

export default LandingPage;