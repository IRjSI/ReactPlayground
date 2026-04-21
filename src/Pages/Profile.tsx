import { ChevronLeft, LoaderCircle, Trophy, Flame, Target, Calendar } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext, AuthContextType } from "../context/authContext";
import { useUser } from "../hooks/useUser";
import StreakHeatmap from "../components/HeatMap";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { token, logout } = useContext(AuthContext) as AuthContextType;

  const { userInfo } = useUser();

  const logoutClick = () => logout();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "l") {
        const btn = document.getElementById("logout-btn") as HTMLButtonElement;
        btn?.click();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!token) {
      setError("Authentication token missing");
      setLoading(false);
      return;
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle,#0ff_1px,transparent_1px)] [bg-size:40px_40px] opacity-10 animate-moveDots" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,255,0.08)_0%,transparent_50%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,255,255,0.05)_0%,transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
          >
            <ChevronLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-[60vh]">
            <LoaderCircle className="animate-spin text-cyan-400" size={48} />
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
            <p className="text-red-400 text-lg font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* left side - user card*/}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-8 pt-4">
                <Tooltip id="tooltip" className="bg-gray-800 text-cyan-400 border border-cyan-400/30" />

                {/* Profile Header */}
                <div className="mb-8">
                  <div
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Logout (Ctrl + L)"
                    id="logout-btn"
                    className="cursor-pointer group flex items-center gap-4"
                    onClick={logoutClick}
                  >
                    <div className="relative w-20 h-20 shrink-0">
                      <img
                        src={
                          userInfo?.user.avatar
                            ? userInfo.user.avatar
                            : "https://hauntedjukebox.com/wp-content/uploads/2024/08/stalker.jpg"
                        }
                        alt="avatar"
                        className="rounded-full w-full h-full object-cover ring-2 ring-cyan-400/20 group-hover:ring-cyan-400/50 transition-all"
                      />
                    </div>

                    <div>
                      <h1 className="text-2xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                        {userInfo?.user.username || "Guest"}
                      </h1>
                      <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                        Click to logout
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Email</p>
                    <p className="text-base text-cyan-400 font-medium truncate">
                      {userInfo?.user.email || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Google</p>
                    <p
                      className={`text-base font-semibold ${userInfo?.user.provider === "google"
                        ? "text-green-400"
                        : "text-gray-500"
                        }`}
                    >
                      {userInfo?.user.provider === "google" ? "Connected" : "Not linked"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* right side */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              {/* Welcome Banner */}
              <div className="py-4">
                <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-white">
                  Welcome back,{" "}
                  <span className="text-cyan-400">
                    {userInfo?.user.username || "Guest"}
                  </span>
                </h1>
                <p className="text-gray-400 text-lg">
                  Track your React learning journey
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  title="Challenges Completed"
                  value={userInfo?.noOfChallenges || 0}
                  icon={<Target className="text-cyan-400" size={24} />}
                  trend="Total solved"
                />

                <StatCard
                  title="Current Streak"
                  value={userInfo?.user?.streak?.current || 0}
                  icon={<Flame className="text-orange-400" size={24} />}
                  trend="days in a row"
                  highlight
                />

                <StatCard
                  title="Longest Streak"
                  value={userInfo?.user?.streak?.longest || 0}
                  icon={<Trophy className="text-yellow-400" size={24} />}
                  trend="days record"
                />
              </div>

              {/* Activity Heatmap */}
              <div className="pt-6 mt-4 border-t border-gray-800/60">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="text-cyan-400" size={24} />
                  <div>
                    <h2 className="text-xl font-bold text-white">Activity Overview</h2>
                    <p className="text-sm text-gray-400">Your submission history over time</p>
                  </div>
                </div>

                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                  <StreakHeatmap />
                </div>

                <p className="text-xs text-gray-500 mt-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full text-white"></span>
                  Only accepted solutions are counted as submissions
                </p>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 gap-4 mt-6 pt-6 border-t border-gray-800/60">
                <div className="py-2">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">Account Type</span>
                      <span className="text-lg font-medium text-cyan-400">
                        {userInfo?.user.provider === "google" ? "Google" : "Standard"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">Total Progress</span>
                      <span className="text-lg font-medium text-white">
                        {userInfo?.noOfChallenges || 0} challenges
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500 uppercase tracking-wider mb-1">Streak Status</span>
                      <span className="text-lg font-medium text-orange-400">
                        {(userInfo?.user?.streak?.current || 0) > 0 ? "Active 🔥" : "Start today!"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, highlight }: any) {
  return (
    <div
      className={`relative py-4 transition-all ${highlight ? "text-orange-400" : "text-white"
        } group`}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <div className={`${highlight ? "text-orange-400" : "text-cyan-400"}`}>
            {icon}
          </div>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</p>
        </div>

        <div>
          <p className="text-4xl font-bold mb-1">
            {value}
          </p>
          <p className="text-xs text-gray-500">{trend}</p>
        </div>
      </div>
    </div>
  );
}