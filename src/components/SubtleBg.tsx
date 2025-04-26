export default function SubtleBackground() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#f8fafc] relative overflow-hidden">
        {/* Decorative blurred circle */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-indigo-200 opacity-30 w-[400px] h-[400px] rounded-full blur-3xl" />
  
        {/* Decorative smaller blur */}
        <div className="absolute bottom-10 right-10 bg-pink-200 opacity-20 w-[300px] h-[300px] rounded-full blur-2xl" />
  
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold text-gray-800">Subtle Modern Background</h1>
        </div>
      </div>
    );
  }
  