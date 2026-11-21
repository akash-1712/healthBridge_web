import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const env=import.meta.env.VITE_NODE_ENV;

export default function ForgotPass() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    if(user) navigate('/');
  },[])

  const handleChange = (e) => {
    const val = e.target.value.trim();
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password || !confirmPass) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (form.password !== confirmPass) {
      toast.error("New Password and Confirm Password should be same");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${env==="dev" ?'/api':'/backend'}/resetPass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const resData = await res.json();

      if(!res.ok){
        throw new Error(resData?.message);
      }

      toast.success("Password Reset Successful!");

      // setTimeout(() => {
        navigate("/login");
      // }, 1000);
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[92vh] bg-gradient-to-b from-blue-50 to-white px-6">
  <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
    <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 text-center mb-8">
      Reset Password
    </h2>

    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={form.email}
        onChange={handleChange}
        className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        required
        autoComplete="email"
      />

      <input
        type="password"
        name="password"
        placeholder="New Password"
        value={form.password}
        onChange={handleChange}
        className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        required
        autoComplete="current-password"
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={confirmPass}
        onChange={(e)=> setConfirmPass(e.target.value.trim())}
        className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        required
        autoComplete="confirm-password"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition duration-200 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <svg
            className="animate-spin h-6 w-6 text-white cursor-not-allowed"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        ) : (
          'Reset'
        )}
      </button>
    </form>
  </div>
</div>

  );
}
