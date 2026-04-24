import { useState, useContext } from 'react';
import { AuthContext, AuthContextType } from '../context/authContext';
import LandingPage from '../Pages/LandingPage';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { CheckCircle, PlayCircle, Flame, Code2, LayoutGrid, List } from 'lucide-react';
import { useUser } from '../hooks/useUser';

/* Type */
import { QuestionType } from '../types/types';

/* API */
import { getChallengesAPI } from '../services/API';

/* Components */
import Header from './Header';

const Home = () => {
  const { token, isLoggedIn } = useContext(AuthContext) as AuthContextType;
  const { userInfo } = useUser();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: questions = [], isLoading } = useQuery<QuestionType[]>({
    queryKey: ['challenges', token],
    queryFn: getChallengesAPI,
    enabled: !!token,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  if (!isLoggedIn) return <LandingPage />;

  const completedCount = questions.filter(q => q.solved).length;
  const totalCount = questions.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-cyan-500/30 font-sans">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* User Stats / Hero Section */}
        <div className="mb-12 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="absolute inset-0 bg-linear-to-r from-cyan-900/30 via-[#0a0a0a] to-[#0a0a0a] rounded-3xl blur-3xl -z-10" />
          <div className="bg-[#111]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row items-center gap-8 justify-between relative overflow-hidden">
            {/* Glossy highlight line */}
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent"></div>

            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-cyan-500/30 rounded-full group-hover:bg-cyan-500/50 transition-colors duration-500"></div>
                <img
                  src={userInfo?.user?.avatar || "/undraw_avatar.png"}
                  alt="avatar"
                  className="relative w-20 h-20 rounded-full object-cover border-2 border-cyan-500/50 transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1 text-gray-100">
                  Welcome back, <span className="text-cyan-400">{userInfo?.user?.username || "Developer"}</span>
                </h1>
                <p className="text-gray-400 font-medium">Ready to conquer more React challenges today?</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-[#0a0a0a]/80 rounded-2xl border border-orange-500/20 backdrop-blur-md min-w-27.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <Flame size={26} className="text-orange-500 mb-1 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                <span className="text-2xl font-bold text-gray-100">{userInfo?.user?.streak?.current || 0}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-semibold">Day Streak</span>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-[#0a0a0a]/80 rounded-2xl border border-cyan-500/20 backdrop-blur-md min-w-27.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <Code2 size={26} className="text-cyan-400 mb-1 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                <span className="text-2xl font-bold text-gray-100">{progress}%</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-semibold">Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end mb-8 border-b border-gray-800/60 pb-4 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2 text-gray-100">Available Challenges</h2>
              <p className="text-gray-400 text-sm md:text-base">Master React concepts by writing actual code.</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="flex bg-[#111] border border-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-800 text-cyan-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                  aria-label="Grid View"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-gray-800 text-cyan-400 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                  aria-label="List View"
                >
                  <List size={18} />
                </button>
              </div>

              <div className="hidden md:flex gap-2">
                <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs font-semibold shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                  {completedCount} Solved
                </span>
                <span className="px-3 py-1 bg-[#111] border border-gray-800 text-gray-400 rounded-full text-xs font-semibold">
                  {totalCount - completedCount} Remaining
                </span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
              <p className="text-gray-500 font-medium animate-pulse">Loading challenges...</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
              {questions.map((q, i) => (
                <Link
                  key={q._id}
                  to={`/challenge/${q._id}`}
                  className={`group relative bg-[#111]/50 border border-gray-800 p-6 hover:bg-[#161616] transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_10px_30px_-10px_rgba(6,182,212,0.2)] flex ${viewMode === 'grid'
                    ? "rounded-2xl hover:-translate-y-1 flex-col h-full"
                    : "rounded-xl hover:-translate-x-1 flex-col md:flex-row md:items-center gap-4 md:gap-6"
                    }`}
                >
                  <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit]" />

                  {q.solved && viewMode === 'grid' && (
                    <div className="absolute top-5 right-5 scale-100 transition-transform duration-300 group-hover:scale-110">
                      <CheckCircle className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" size={24} />
                    </div>
                  )}

                  <div className={`text-cyan-500/80 font-mono text-sm font-semibold tracking-wider bg-cyan-950/30 w-max px-2 py-0.5 rounded border border-cyan-900/50 ${viewMode === 'grid' ? "mb-4" : "shrink-0"}`}>
                    CHALLENGE #{String(i + 1).padStart(2, '0')}
                  </div>

                  <h3 className={`font-semibold line-clamp-3 text-gray-200 group-hover:text-white transition-colors leading-snug ${viewMode === 'grid' ? "text-lg md:text-xl mb-6 pr-8" : "text-base md:text-lg flex-1 m-0"}`}>
                    {q.statement}
                  </h3>

                  <div className={`flex items-center ${viewMode === 'grid' ? "justify-between mt-auto pt-5 border-t border-gray-800/50" : "justify-between md:justify-end gap-6 shrink-0 md:min-w-50"}`}>
                    <div className="flex items-center gap-2">
                      {q.solved && viewMode === 'list' && (
                        <CheckCircle className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" size={18} />
                      )}
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${q.result === "valid"
                          ? "text-green-500/80"
                          : q.result
                            ? "text-yellow-500/80"
                            : "text-gray-500"
                          }`}
                      >
                        {q.result === "valid"
                          ? "Completed"
                          : q.result
                            ? "Attempted"
                            : "Not Started"}
                      </span>
                    </div>

                    <span className="flex items-center gap-1.5 text-sm font-semibold text-cyan-400 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
                      Launch <PlayCircle size={16} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main >
    </div >
  );
};

export default Home;
