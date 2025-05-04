import axios from "axios";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userInfo, setUserInfo] = useState('');
  const [loading, setLoading] = useState(true);

  //@ts-ignore
  const { token } = useContext(AuthContext);
  
  // Mock user data
  const userData = {
    name: "Alex Johnson",
    level: 7,
    points: 3450,
    streak: 12,
    completedChallenges: 47,
    totalChallenges: 120,
    recentActivity: [
      { id: 1, title: "State Management Challenge", difficulty: "Medium", completedAt: "2 hours ago" },
      { id: 2, title: "Custom Hooks Implementation", difficulty: "Hard", completedAt: "Yesterday" },
      { id: 3, title: "Component Lifecycle", difficulty: "Easy", completedAt: "3 days ago" }
    ],
    badges: [
      { id: 1, name: "React Rookie", icon: "🏆", description: "Completed 10 challenges" },
      { id: 2, name: "Hook Master", icon: "🔥", description: "Solved 5 hook-related challenges" },
      { id: 3, name: "Streaker", icon: "⚡", description: "Maintained a 7-day streak" }
    ],
    skills: [
      { name: "JSX", progress: 90 },
      { name: "Hooks", progress: 75 },
      { name: "State Management", progress: 60 },
      { name: "Context API", progress: 45 },
      { name: "Performance", progress: 30 }
    ]
  };

  // Calculate completion percentage
  const completionPercentage = Math.round(userInfo ? ((userInfo?.challenges).length / userData.totalChallenges) * 100 : 0);

  const renderTabContent = () => {
    switch(activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                title="Challenges Completed" 
                value={`${userInfo ? (userInfo?.challenges).length : 0}/${userData.totalChallenges}`}
                icon="📝"
                color="bg-cyan-400"
              />
              <StatCard 
                title="Current Level" 
                value={userData.level} 
                icon="🏅"
                color="bg-purple-400"
              />
              <StatCard 
                title="Current Streak" 
                value={`${userData.streak} days`} 
                icon="🔥"
                color="bg-orange-400"
              />
            </div>
            
            <div className="bg-gradient-to-r from-gray-800/60 via-gray-800/10 to-gray-800/60 border border-cyan-400/50 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-white">Progress Overview</h3>
              <div className="flex items-center mb-2">
                <div className="w-full bg-gray-700 rounded-full h-4 mr-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-4 rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <span className="text-white font-medium">{completionPercentage}%</span>
              </div>
              <p className="text-gray-300 text-sm">You've completed {userInfo ? (userInfo?.challenges).length : 0} out of {userData.totalChallenges} challenges</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-gray-800/60 via-gray-800/10 to-gray-800/60 border border-cyan-400/50 rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-white">Recent Activity</h3>
                <div className="space-y-4">
                  {userData.recentActivity.map(activity => (
                    <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-cyan-500/20 transition duration-200 border border-cyan-400/50">
                      <div>
                        <h4 className="font-medium text-white">{activity.title}</h4>
                        <p className="text-sm text-gray-400">{activity.completedAt}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.difficulty === "Easy" ? "bg-green-400/20 text-green-300" :
                        activity.difficulty === "Medium" ? "bg-yellow-400/20 text-yellow-300" :
                        "bg-red-400/20 text-red-300"
                      }`}>
                        {activity.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-800/60 via-gray-800/10 to-gray-800/60 border border-cyan-400/50 rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-white">Skill Proficiency</h3>
                <div className="space-y-4">
                  {userData.skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-white">{skill.name}</span>
                        <span className="text-gray-400">{skill.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-cyan-300 h-2 rounded-full"
                          style={{ width: `${skill.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "challenges":
        return (
          <div className="bg-gradient-to-r from-gray-800/60 via-gray-800/10 to-gray-800/60 border border-cyan-400/50 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-white">Challenges Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CategoryCard 
                title="Fundamentals" 
                completed={18} 
                total={25}
                icon="🔤"
              />
              <CategoryCard 
                title="State & Props" 
                completed={12} 
                total={20}
                icon="⚙️"
              />
              <CategoryCard 
                title="Hooks" 
                completed={8} 
                total={25}
                icon="🪝"
              />
              <CategoryCard 
                title="Context API" 
                completed={4} 
                total={15}
                icon="🌐"
              />
              <CategoryCard 
                title="Performance" 
                completed={3} 
                total={20}
                icon="⚡"
              />
              <CategoryCard 
                title="Advanced Patterns" 
                completed={2} 
                total={15}
                icon="🧩"
              />
            </div>
          </div>
        );
      case "badges":
        return (
          <div className="bg-gradient-to-r from-gray-800/60 via-gray-800/10 to-gray-800/60 border border-cyan-400/50 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-white">Your Badges</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userData.badges.map(badge => (
                <div key={badge.id} className="bg-gray-800/50 rounded-xl p-6 flex flex-col items-center justify-center text-center transform hover:scale-105 transition duration-300 cursor-pointer border border-cyan-500/30 hover:border-cyan-400/60 shadow-md hover:shadow-cyan-500/20">
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h4 className="text-lg font-bold text-cyan-400 mb-1">{badge.name}</h4>
                  <p className="text-gray-400 text-sm">{badge.description}</p>
                </div>
              ))}
              {/* Locked badge examples */}
              <div className="bg-gray-800/30 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-gray-700/50 opacity-60">
                <div className="text-4xl mb-2">🔒</div>
                <h4 className="text-lg font-bold text-gray-500 mb-1">Context Master</h4>
                <p className="text-gray-500 text-sm">Complete 5 context API challenges</p>
              </div>
              <div className="bg-gray-800/30 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-gray-700/50 opacity-60">
                <div className="text-4xl mb-2">🔒</div>
                <h4 className="text-lg font-bold text-gray-500 mb-1">Component Wizard</h4>
                <p className="text-gray-500 text-sm">Build 3 complex components</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    setLoading(true)
    if (!token) {
      console.warn("Token is not available");
      return;
    }
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/get-user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        setUserInfo(response.data.data);
      })
      .catch((err) => console.error("Error fetching user data:", err))
      .finally(() => setLoading(false))
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle,#0ff_1px,transparent_1px)] [background-size:40px_40px] opacity-20 animate-moveDots" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
      
      {!loading ? (
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <Link to='/home' title="Back" className=""><ChevronLeft /></Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back, {userInfo?.username ? userInfo?.username : 'Guest'}</h1>
            <p className="text-gray-300">Your React mastery journey continues</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-800/60 rounded-full px-4 py-2 border border-cyan-400/30">
              <span className="text-cyan-400">✨</span>
              <span className="font-medium">{userData.points} points</span>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white rounded-full font-medium transition-all transform hover:scale-105 duration-300 shadow-lg hover:shadow-cyan-500/30 focus:outline-none">
              Daily Challenge
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl mb-6 border border-gray-700/50">
          <div className="flex overflow-x-auto">
            <TabButton 
              active={activeTab === "overview"} 
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </TabButton>
            <TabButton 
              active={activeTab === "challenges"} 
              onClick={() => setActiveTab("challenges")}
            >
              Challenges
            </TabButton>
            <TabButton 
              active={activeTab === "badges"} 
              onClick={() => setActiveTab("badges")}
            >
              Badges
            </TabButton>
          </div>
        </div>
        
        {renderTabContent()}
      </div>
      )
      : (
        <div className="flex justify-center items-center h-screen">
          <div className="text-cyan-400 text-xl">
            <LoaderCircle className="animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
}

// Component for tab buttons
function TabButton({ children, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
        active 
          ? "text-cyan-400 border-b-2 border-cyan-400" 
          : "text-gray-400 hover:text-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

// Component for statistics cards
function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-gradient-to-r from-gray-800/60 via-gray-800/10 to-gray-800/60 border border-cyan-400/50 rounded-2xl p-6 shadow-lg hover:shadow-cyan-500/20 transform hover:scale-102 transition duration-300">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 ${color} bg-opacity-20 rounded-full flex items-center justify-center text-xl`}>
          <span>{icon}</span>
        </div>
        <div>
          <h3 className="text-gray-400 text-sm">{title}</h3>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Component for challenge category cards
function CategoryCard({ title, completed, total, icon }: any) {
  const percentage = Math.round((completed / total) * 100);
  
  return (
    <div className="bg-gray-800/50 rounded-xl p-4 hover:bg-gray-700/40 transition duration-300 cursor-pointer border border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-white">{title}</h4>
        <div className="text-lg">{icon}</div>
      </div>
      <div className="flex justify-between text-sm text-gray-400 mb-1">
        <span>{completed}/{total} completed</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-cyan-500 to-cyan-300 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}