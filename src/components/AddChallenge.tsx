import axios from "axios";
import { ArrowRight, Loader2 } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const AddChallenge = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    statement: "",
    description: "",
    difficulty: "easy",
    solution: "",
    tests: [""], // array of strings
  });

  //@ts-ignore
  const { token } =useContext(AuthContext);

  const handleChange = (e: any) => {
    const { value, name } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleArrayChange = (index: number, field: string, value: string): void => {
    setFormData((prev: any) => {
      const newArray = [...prev[field]] // create copy of the array(field = tests), so newArray = tests
      newArray[index] = value // update value at a particular index
      // return the object with updated array
      return {
        ...prev,
        [field]: newArray // updated array
      }
    })
  }

  const addArrayItem = (field: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: [...prev[field], ""] // adds an empty string at the end of the array
    }));
  };

  const removeArrayItem = (index: number,field: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: number, i: number) => i !== index)
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    // console.log("Submitting challenge:", formData);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/challenges/create-challenge`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log(response.data)
      setFormData({
        statement: "",
        difficulty: "",
        description: "",
        solution: "",
        tests: [""]
      })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle,#0ff_1px,transparent_1px)] [background-size:40px_40px] opacity-20 animate-moveDots" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_60%)]" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400 drop-shadow-[0_0_8px_cyan]">Create Challenge</h1>
          <button 
            onClick={() => navigate("/home")}
            className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="border border-cyan-400 bg-gradient-to-r from-gray-800/60 via-gray-800/10 to-gray-800/60 backdrop-blur-lg rounded-xl shadow-lg p-6 hover:shadow-cyan-500/20 transition-all">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="col-span-1">
              <label htmlFor="statement" className="block text-sm font-medium text-gray-300 mb-1">Challenge statement</label>
              <input
                id="statement"
                name="statement"
                type="text"
                required
                value={formData.statement}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 focus:border-cyan-400 rounded-lg p-3 text-white focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all"
                placeholder="Enter challenge statement"
              />
            </div>

            <div className="col-span-1">
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 focus:border-cyan-400 rounded-lg p-3 text-white focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              rows={6}
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 focus:border-cyan-400 rounded-lg p-3 text-white focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all"
              placeholder="Write the challenge description and requirements here."
            />
          </div>

          <div className="mb-6">
            <label htmlFor="solution" className="block text-sm font-medium text-gray-300 mb-1">Solution</label>
            <textarea
              id="solution"
              name="solution"
              rows={6}
              value={formData.solution}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 focus:border-cyan-400 rounded-lg p-3 text-white focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all font-mono"
              placeholder="// Provide the solution code"
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-300">Testcases</label>
              <button
                type="button"
                onClick={() => addArrayItem("tests")}
                className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
              >
                <span>Add Testcases</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {formData.tests.map((test, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={test}
                  onChange={(e) => handleArrayChange(index, "tests", e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 focus:border-cyan-400 rounded-lg p-3 text-white focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all"
                  placeholder={`test ${index + 1}`}
                />
                {formData.tests.length > 0 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index,"tests")}
                    className="bg-red-500/20 hover:bg-red-500/30 w-10 flex items-center justify-center rounded-lg text-red-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}

          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white rounded-full font-semibold transition-all transform hover:scale-105 duration-300 shadow-lg hover:shadow-cyan-500/30 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>Create Challenge</span>
                  <ArrowRight />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChallenge;