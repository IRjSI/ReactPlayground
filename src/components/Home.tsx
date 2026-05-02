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
          <div className="bg-[#111]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row items-center gap-6 md:gap-8 justify-between relative overflow-hidden">
            {/* Glossy highlight line */}
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent"></div>

            <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-4 md:gap-6 w-full md:w-auto">
              <div className="relative group shrink-0">
                <div className="absolute inset-0 bg-cyan-500/30 rounded-full group-hover:bg-cyan-500/50 transition-colors duration-500"></div>
                <img
                  src={userInfo?.user?.avatar || "/undraw_avatar.png"}
                  alt="avatar"
                  className="relative w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-cyan-500/50 transition-transform duration-500 group-hover:scale-105"
                />
                {userInfo?.user?.badges?.[0] && (
                  <div className="absolute -top-1.5 -left-1.5 md:-top-2 md:-left-2 z-20 group/badge">
                    {/* Badge Cutout & Icon */}
                    <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 bg-[#111] rounded-full group-hover/badge:scale-110 transition-transform duration-300 cursor-default">
                      <div className="flex items-center justify-center w-[calc(100%-6px)] h-[calc(100%-6px)] bg-linear-to-br from-cyan-400 to-cyan-600 rounded-full">
                        <svg fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M11.103,10.43793a1.78593,1.78593,0,1,0,2.43957.65362A1.786,1.786,0,0,0,11.103,10.43793Zm8.0047,1.93768q-.17587-.201-.37116-.40308.13641-.14337.264-.28649c1.60583-1.80427,2.28357-3.61371,1.65558-4.70154-.60217-1.043-2.39343-1.35382-4.63593-.91779q-.33132.06482-.659.14624-.06272-.21624-.13343-.43C14.467,3.49042,13.2381,1.99921,11.98206,2,10.77765,2.00055,9.61359,3.39709,8.871,5.5575q-.10959.31969-.20276.64471-.21908-.05375-.44-.0993c-2.366-.48578-4.27167-.16584-4.89844.9226-.601,1.04376.02753,2.74982,1.52851,4.47211q.22329.25562.45922.49976c-.18542.191-.361.38189-.52465.57171-1.4646,1.698-2.05719,3.37616-1.45716,4.41541.61969,1.07348,2.49854,1.42437,4.7854.97436q.278-.05511.55292-.124.10071.35156.22095.697c.73932,2.11706,1.89685,3.46863,3.097,3.4682,1.23944-.00073,2.48194-1.45288,3.23474-3.65875.05945-.17432.11573-.35535.16907-.54175q.35514.08835.71485.1568c2.20336.41687,3.95251.089,4.55145-.951C21.28058,15.93109,20.64288,14.12933,19.10767,12.37561ZM4.07019,7.45184c.38586-.67,1.94324-.93139,3.98608-.512q.19584.04027.39838.09a20.464,20.464,0,0,0-.42126,2.67767,20.88659,20.88659,0,0,0-2.10389,1.6936q-.21945-.22695-.42718-.4649l.00006.00006C4.21631,9.46057,3.708,8.08081,4.07019,7.45184Zm3.88666,5.72809c-.51056-.3866-.98505-.78265-1.41571-1.181.43036-.39587.90515-.79059,1.41467-1.17615q-.02746.58915-.02722,1.1792Q7.929,12.59117,7.95685,13.17993Zm-.00061,3.94061a7.23675,7.23675,0,0,1-2.63971.09314,1.766,1.766,0,0,1-1.241-.65631c-.36407-.63067.11176-1.978,1.36432-3.43023q.23621-.273.48791-.53174a20.49026,20.49026,0,0,0,2.10712,1.70007,20.80226,20.80226,0,0,0,.42621,2.712Q8.21011,17.07023,7.95624,17.12054Zm7.10113-8.03936q-.50309-.317-1.01861-.61365-.5073-.292-1.0268-.56207c.593-.24933,1.17591-.46228,1.73865-.63581A18.21775,18.21775,0,0,1,15.05737,9.08118ZM9.679,5.83521c.63623-1.85114,1.57763-2.98053,2.30352-2.98084.77308-.00037,1.77753,1.21826,2.43433,3.19763q.064.19355.121.38928a20.478,20.478,0,0,0-2.52716.9712,20.06145,20.06145,0,0,0-2.519-.98194Q9.578,6.13062,9.679,5.83521ZM9.27863,7.259a18.30717,18.30717,0,0,1,1.72967.642Q9.95746,8.4433,8.96094,9.0824C9.0412,8.4444,9.148,7.83313,9.27863,7.259ZM8.9624,14.91968q.49695.31813,1.00843.61273.52174.30039,1.05737.57556a18.19577,18.19577,0,0,1-1.74445.66492C9.15161,16.1908,9.04364,15.56879,8.9624,14.91968Zm5.45569,3.14551A7.23556,7.23556,0,0,1,13.18,20.39844l-.00006.00006a1.76585,1.76585,0,0,1-1.18841.747c-.72821.00042-1.65766-1.085-2.28992-2.89545q-.11169-.32108-.20551-.648a20.10863,20.10863,0,0,0,2.52918-1.0097,20.79976,20.79976,0,0,0,2.54736.97851Q14.50141,17.81983,14.41809,18.06519Zm.36224-1.32422c-.56921-.176-1.16058-.39252-1.76214-.64551q.50867-.2677,1.02472-.56543.52955-.30579,1.0321-.62689A18.1524,18.1524,0,0,1,14.78033,16.741Zm.44629-4.74268q.00111.91095-.05688,1.82044c-.49268.33343-1.01282.659-1.554.97143-.53894.31116-1.07293.59711-1.59674.8559q-.82682-.39624-1.62176-.854-.79047-.455-1.54468-.969-.06894-.90921-.06946-1.82172l.00012.00019q-.00063-.91187.06794-1.82184c.49255-.33637,1.00891-.66168,1.54278-.96991.53632-.30969,1.077-.59442,1.61469-.85248q.81664.39688,1.60382.85065.78992.454,1.549.95868.06519.91443.06524,1.83166Zm.95673-5.09283c1.92133-.37372,3.37-.12232,3.73291.50622.3866.66962-.16748,2.1485-1.55383,3.70636l-.00006.00006q-.1149.12891-.23841.25891A20.06118,20.06118,0,0,0,15.98,9.68915a20.04054,20.04054,0,0,0-.40546-2.64893Q15.88486,6.96387,16.18335,6.90546Zm-.12988,3.8847A18.16447,18.16447,0,0,1,17.51483,11.978a18.11912,18.11912,0,0,1-1.45672,1.20831q.02325-.59391.02288-1.18842Q16.08072,11.39389,16.05347,10.79016Zm3.8681,5.78876c-.36346.63116-1.76788.89435-3.65222.53784q-.32391-.06115-.66474-.14557a20.069,20.069,0,0,0,.38746-2.68176,19.93914,19.93914,0,0,0,2.13708-1.71588q.17643.18329.33563.36487v-.00007a7.23437,7.23437,0,0,1,1.40308,2.23792A1.76563,1.76563,0,0,1,19.92157,16.57892Z"></path></g></svg>
                      </div>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute top-full left-10 -translate-x-1/2 mt-2 px-3 py-1.5 bg-gray-900 text-cyan-400 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-lg border border-cyan-500/30 opacity-0 group-hover/badge:opacity-100 translate-y-1 group-hover/badge:translate-y-0 pointer-events-none transition-all duration-300 whitespace-nowrap z-30 shadow-[0_5px_15px_rgba(0,0,0,0.5)] flex items-center gap-1.5">
                      Early Player
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2 text-white flex flex-wrap items-center justify-center md:justify-start gap-x-2 md:gap-x-3 gap-y-2">
                  Welcome back, <span className="text-cyan-400">{userInfo?.user?.username || "Developer"}</span>
                </h1>
                <p className="text-gray-400 text-sm md:text-base font-medium">Ready to conquer more React challenges today?</p>
              </div>
            </div>

            <div className="flex w-full md:w-auto justify-center gap-3 md:gap-4">
              <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-[#0a0a0a]/80 rounded-2xl border border-orange-500/20 backdrop-blur-md flex-1 md:flex-none md:min-w-28 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <Flame size={24} className="text-orange-500 mb-1 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] md:w-[26px] md:h-[26px]" />
                <span className="text-xl md:text-2xl font-bold text-gray-100">{userInfo?.user?.streak?.current || 0}</span>
                <span className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-semibold">Day Streak</span>
              </div>

              <div className="flex flex-col items-center justify-center p-3 md:p-4 bg-[#0a0a0a]/80 rounded-2xl border border-cyan-500/20 backdrop-blur-md flex-1 md:flex-none md:min-w-28 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <Code2 size={24} className="text-cyan-400 mb-1 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] md:w-[26px] md:h-[26px]" />
                <span className="text-xl md:text-2xl font-bold text-gray-100">{progress}%</span>
                <span className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-semibold">Completed</span>
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
