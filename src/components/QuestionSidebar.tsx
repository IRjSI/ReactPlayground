import { CheckCircle, X } from "lucide-react";

/* Type */
import { SidebarProps } from '../types/types';

export function QuestionSidebar({
  questionMap,
  setQuestionMap,
  questions,
  setQues
}: SidebarProps) {

  if (!questionMap) return null;

  return (
    <>
      {/* Overlay (mobile focus) */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
        onClick={() => setQuestionMap(false)}
      />

      {/* Sidebar */}
      <aside className="
        fixed top-0 left-0 h-full
        w-full sm:w-[60%] md:w-[40%] lg:w-1/4
        bg-cyan-900/30 backdrop-blur-xl
        shadow-2xl z-40
        transform transition-transform duration-300
        rounded-r-xl
        pt-16
        overflow-y-auto
      ">
        {/* Close button */}
        <button
          onClick={() => setQuestionMap(false)}
          className="absolute top-4 right-4 border border-cyan-400/50 p-2 rounded-lg hover:scale-105 transition shadow-lg hover:shadow-cyan-500/30"
        >
          <X size={18} />
        </button>

        <div className="space-y-2 px-4 pb-6">
          {questions.map((q, i) => {
            const solved = q.solved;

            return (
              <div
                key={q._id}
                onClick={() => {
                  setQues(i);
                  setQuestionMap(false); // better mobile UX
                }}
                className="
                  flex items-start gap-2
                  p-3 rounded-lg cursor-pointer
                  hover:bg-cyan-800/30
                  transition
                "
              >
                <span className="text-white font-medium text-sm leading-snug flex-1">
                  {i + 1}. {q.statement}
                </span>

                {solved && (
                  <CheckCircle
                    size={18}
                    className="text-green-400 shrink-0 mt-0.5"
                  />
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
