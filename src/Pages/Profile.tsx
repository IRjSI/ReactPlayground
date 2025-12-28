import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext, AuthContextType } from "../context/authContext";
import { useUser } from "../utils/useUser";
import StreakHeatmap from "../components/HeatMap";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { token } = useContext(AuthContext) as AuthContextType;

  const { userInfo } = useUser();

  useEffect(() => {
    if (!token) {
      setError("Authentication token missing");
      setLoading(false);
      return;
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle,#0ff_1px,transparent_1px)] [bg-size:40px_40px] opacity-20 animate-moveDots" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_60%)]" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/home" className="flex items-center gap-2 text-cyan-400 mb-6">
          <ChevronLeft /> Back
        </Link>

        {loading && (
          <div className="flex justify-center items-center h-[60vh]">
            <LoaderCircle className="animate-spin text-cyan-400" size={40} />
          </div>
        )}

        {!loading && error && (
          <div className="text-center text-red-400 text-lg">{error}</div>
        )}

        {!loading && !error && (
          <>
            <div className="bg-gray-800/40 border border-cyan-400/40 rounded-2xl p-6 shadow-lg mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back,{" "}
                  <span className="text-cyan-400">
                    {userInfo?.username || "Guest"}
                  </span>
                </h1>
                <p className="text-gray-300 mt-1">
                  Your React learning progress overview
                </p>
              </div>

              <div className='cursor-pointer rounded-lg transition-all transform hover:scale-105 duration-300'>
                {userInfo?.avatar ?
                  (
                    <img
                      src={userInfo.avatar}
                      alt="avatar"
                      className="rounded-lg w-20 h-20 object-cover"
                    />
                  ) : (
                    <img
                      src={"https://hauntedjukebox.com/wp-content/uploads/2024/08/stalker.jpg"}
                      alt="avatar"
                      className="rounded-lg w-20 h-20 object-cover"
                    />
                  )
                }
              </div>
              
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Challenges Completed"
                value={userInfo?.challenges?.length || 0}
              />

              <StatCard
                title="Current Streak 🔥"
                value={`${userInfo?.streak?.current || 0} days`}
              />

              <StatCard
                title="Longest Streak 🏆"
                value={`${userInfo?.streak?.longest || 0} days`}
              />
            </div>

            <div className="my-6">
              <StreakHeatmap />
            </div>

          </>
        )}

      </div>
    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div className="bg-linear-to-r from-gray-800/60 via-gray-800/20 to-gray-800/60 border border-cyan-400/40 rounded-2xl p-6 shadow-lg hover:shadow-cyan-500/20 transition">
      <h3 className="text-gray-300 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
