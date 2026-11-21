import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const env=import.meta.env.VITE_NODE_ENV;

export default function Signup() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1 = form, Step 2 = verify
  const [serverCode, setServerCode] = useState("");
  const [userCode, setUserCode] = useState("");
  const codeInputRef = useRef(null);

  // Autofocus verification code input when step changes to 2
  useEffect(() => {
    if(user) navigate('/');

    if (step === 2 && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [step]);

  const handleChange = (e) => {
    const val = e.target.value.trim();
    setForm({ ...form, [e.target.name]: val});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${env==="dev" ? '/api': '/backend'}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Verification step failed");

      const data = await res.json();
      setServerCode(String(data.udata[0].VerificationCode));

      toast.success("Verification email sent! Please check your inbox.");
      setStep(2);
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (userCode.trim() !== serverCode.trim()) {
      toast.error("Invalid verification code.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${env==="dev" ? '/api':'/backend'}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Final signup failed");

      const resData = await res.json();

      toast.success("Signup successful! Redirecting...");
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
      setUserCode("");
      localStorage.setItem("authToken", resData.authToken);
      localStorage.setItem('streamtoken', resData.token);
      localStorage.setItem("user", JSON.stringify(resData.user));
      login(resData.user, resData.authToken, resData.token);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[92vh] bg-gradient-to-b from-blue-50 to-white px-6">
  <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
    <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 text-center mb-8">
      {step === 1 ? "Create an Account" : "Verify Your Email"}
    </h2>

    {/* Step 1 - Signup Form */}
    {step === 1 && (
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
          autoComplete="name"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
          autoComplete="email"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
          autoComplete="new-password"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition duration-200 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin cursor-not-allowed"></div>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
    )}

    {/* Step 2 - Code Verification */}
    {step === 2 && (
      <div className="space-y-6">
        <input
          type="text"
          placeholder="Enter Verification Code"
          ref={codeInputRef}
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          disabled={loading}
          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <div className="flex gap-4">
          <button
            onClick={handleVerifyCode}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition duration-200 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin cursor-not-allowed"></div>
            ) : (
              "Confirm"
            )}
          </button>
          <button
            onClick={() => {
              setStep(1);
              setUserCode("");
            }}
            disabled={loading}
            className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-xl hover:bg-gray-400 active:bg-gray-500 transition duration-200"
          >
            Back
          </button>
        </div>
      </div>
    )}
  </div>
</div>

  );
}
