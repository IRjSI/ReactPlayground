const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-16 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Privacy Policy</h1>

      <p className="text-gray-400 mb-4">
        This Privacy Policy explains how React Playground ("we", "our", or "us")
        collects and uses information.
      </p>

      <h2 className="text-xl mt-8 mb-2">Information We Collect</h2>
      <ul className="text-gray-400 space-y-2">
        <li>• Account information (if you sign in)</li>
        <li>• Usage data (interactions with the platform)</li>
        <li>• Browser-related data for functionality</li>
      </ul>

      <h2 className="text-xl mt-8 mb-2">How We Use Information</h2>
      <ul className="text-gray-400 space-y-2">
        <li>• To run and improve the platform</li>
        <li>• To evaluate submitted code</li>
        <li>• To maintain system security</li>
      </ul>

      <h2 className="text-xl mt-8 mb-2">Third-Party Services</h2>
      <p className="text-gray-400">
        We may use third-party services such as authentication providers (e.g. Google)
        which may collect data according to their own policies.
      </p>

      <h2 className="text-xl mt-8 mb-2">Cookies</h2>
      <p className="text-gray-400">
        We may use cookies or similar technologies to improve user experience.
      </p>

      <p className="text-gray-500 text-sm mt-10">
        Last updated: 2026
      </p>
    </div>
  );
};

export default Privacy;