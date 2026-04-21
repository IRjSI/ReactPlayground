import {
  ChevronLeft,
  ChevronRight,
  Flame,
  MenuIcon,
  X
} from "lucide-react";
import { Link } from 'react-router-dom';

/* Type */
import { HeaderProps } from '../types/types';

export function Header({
  userInfo,
  questions,
  ques,
  setQuestionMap,
  questionMap,
  nextClick,
  prevClick,
  logoutClick
}: HeaderProps) {

  return (
    <div className="flex flex-wrap gap-3 md:gap-0 md:flex-nowrap justify-between items-center p-3 md:p-4 bg-gray-900 text-white border-b border-cyan-700/40 shadow-lg">

      {/* LEFT CONTROLS */}
      <div className="flex items-center gap-2">
        {/* Sidebar toggle */}
        <button
          onClick={() => setQuestionMap(prev => !prev)}
          className="border border-cyan-400/50 p-2 rounded-lg transition-all hover:bg-cyan-500/20 hover:border-cyan-400 shadow-sm"
        >
          {questionMap ? <X size={18} /> : <MenuIcon size={18} />}
        </button>

        {/* Prev */}
        <button
          onClick={prevClick}
          className={`p-2 rounded-lg transition ${ques > 0
            ? "bg-blue-600 hover:bg-blue-700 shadow-md"
            : "bg-blue-500 opacity-60 cursor-not-allowed"
            }`}
          disabled={ques < 1}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Next */}
        <button
          onClick={nextClick}
          className={`p-2 rounded-lg transition ${ques < questions.length - 1
            ? "bg-blue-600 hover:bg-blue-700 shadow-md"
            : "bg-blue-500 opacity-60 cursor-not-allowed"
            }`}
          disabled={ques > questions.length - 2}
        >
          <ChevronRight size={18} />
        </button>

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
          {questions[ques]?.statement}
        </div>

        <div className="mt-1">
          {questions[ques]?.solved ? (
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
  );
}
