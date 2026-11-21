import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { StreamChat } from "stream-chat";
import { useState } from "react";
import toast from "react-hot-toast";
import { getChatId } from "../../util/getChatId";
import doctorImg from '../assets/images/hb-doctor.svg';
import { useChat } from "../contexts/ChatContext";

const env = import.meta.env.VITE_NODE_ENV;

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { user, token, streamtoken } = useAuth();

  const { setChatClient} = useChat();

  const requestCallToDoctor = async () => {
    if (!user || !token) {
      toast.error("Please login to request a call");
      return;
    }

    setLoading(true);

    try {
      let key = null;
      if (env === "dev") {
        key = import.meta.env.VITE_STREAM_CHAT_KEY;
      } else {
        const keyResponse = await fetch(`/api/getStreamKey`);
        const keyData = await keyResponse.json();

        if (!keyResponse.ok) {
          throw new Error(keyData.error || "Failed to fetch Stream key");
        }

        key = keyData.key;
      }

      const chatClient = StreamChat.getInstance(key);
      setChatClient(chatClient);

      await chatClient.connectUser({ id: user.id }, streamtoken);

      const doctorData = await fetch(
        `${env === "dev" ? '/api' : '/backend'}/getDoctorId`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const doctorJsonData = await doctorData.json();
      if (!doctorData.ok) {
        throw new Error(doctorJsonData);
      }

      const channel = chatClient.channel('messaging', {
        members: [user.id || user.email, doctorJsonData.doctorId],
        name: user.name // Add actual doctor ID
      });

      await channel.watch();

      navigate(`/chat/${getChatId(channel.id, true)}`);
    } catch (error) {
      console.error("Error requesting call:", error);
      toast.error("Failed to request call. Please try again.");
    }
    finally {
      setLoading(false);
    }
  };

  const startVisit = () => {
    if (!user || !token) {
      toast.error("Please login to start a visit");
      return;
    }

    // Navigate to select child screen
    navigate('/select-child');
  };

  return (
    <div className="min-h-[92vh] flex flex-col bg-gradient-to-b from-blue-100 via-blue-200 to-white">
      {/* Main Content */}
      <main className="flex-1 px-6 py-4">
        <div className="max-w-6xl mx-auto h-full">

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-16 items-center h-full relative">
  
  {/* Left Side - Content */}
  <div className="space-y-8">
    
    {/* Welcome Message */}
    <div className="space-y-4">
      <h1 className="text-4xl lg:text-4xl font-bold text-gray-900">
        Welcome{user && <span className="text-gray-500">! {user.name || 'Patient'}</span>}
      </h1>

      <h2 className="text-xl lg:text-3xl font-semibold text-blue-600">
        How can we assist you today?
      </h2>

      <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
        Talk to a pediatrician, book an appointment, or access care resources in one click!
      </p>
    </div>

    {/* Action Buttons */}
    <div className="space-y-4">
      {user ? (
        <>
          <button
            onClick={startVisit}
            className="w-full max-w-md bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-2xl font-semibold text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Visit
          </button>

          <button
            onClick={requestCallToDoctor}
            disabled={loading}
            className="w-full max-w-md bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-6 rounded-2xl font-semibold text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {loading ? 'Connecting...' : 'Quick Chat'}
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => navigate("/signup")}
            className="w-full max-w-md bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-2xl font-semibold text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started - Free
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full max-w-md bg-white hover:bg-gray-50 text-gray-800 py-6 rounded-2xl font-semibold text-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Login
          </button>
        </>
      )}
    </div>

    {/* Simple availability indicator */}
    <div className="flex items-center space-x-10 text-gray-600 pt-4">
      {/* <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div> */}
      {/* <span className="text-lg">Available 24/7 • Average response in 60 seconds</span> */}
      <Link to='/terms' className="hover:underline">Terms and Conditions</Link>
      <Link to='/privacy' className="hover:underline">Privacy Policies</Link>
    </div>
  </div>

  {/* Right Side - Simple Doctor Image */}
  <div className="flex items-center justify-center relative">
    
    {/* Doctor Image Container */}
    <div className="w-80 h-96 lg:w-96 lg:h-[400px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 to-white">
      <img
        src={doctorImg}
        alt="Pediatrician"
        className="w-full h-full object-contain opacity-95"
        style={{
          backgroundColor: 'transparent',
          background: 'none'
        }}
      />
    </div>

    {/* Subtle background decoration */}
    <div className="absolute -z-10 inset-0 bg-gradient-to-br from-blue-100/30 to-green-100/30 rounded-full scale-75 blur-3xl"></div>
  </div>
</div>



          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col h-full space-y-6 mt-6 ">

            {/* Welcome Section */}
            <div className="flex-1 flex flex-col justify-center space-y-6 relative">

              {/* Large Background Doctor Image */}
              {/* <div className="absolute top-0 right-0 w-60 h-60 rounded-2xl opacity-70 overflow-hidden z-0 transform translate-x-4">
    <img 
      src={doctorImg}
      alt="Pediatrician" 
      className="w-full h-full object-cover"
    />
  </div> */}

              <div className="absolute top-0 right-0 w-40 h-60 overflow-hidden z-0 transform translate-x-4">
                <img
                  src={doctorImg}
                  alt="Pediatrician"
                  className="w-full h-full object-cover opacity-90"
                  style={{
                    backgroundColor: 'transparent',
                    background: 'none',
                    mixBlendMode: 'multiply'
                  }}
                />
              </div>






              {/* Content that overlaps - constrained to half width */}
              <div className="relative z-10 w-1/2">
                <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
                {user && <p className="text-lg text-gray-700">{user.name || 'Patient'}</p>}
              </div>

              <h2 className="text-xl font-semibold text-blue-600 relative z-10 w-1/2">
                How can we Assist you today?
              </h2>

              <p className="text-gray-600 leading-relaxed relative z-10 w-1/2">
                Talk to a pediatrician, book an appointment, or access care resources in one click!
              </p>
            </div>


            {/* Full viewport width background */}

            {/* Buttons Section */}
            <div className="relative z-10 space-y-4 pb-8">
              {/* Your buttons here - same as before */}
              {user ? (
                <>
                  <button
                    onClick={startVisit}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-full font-semibold text-lg transition-colors shadow-lg"
                  >
                    Start Visit
                  </button>

                  <button
                    onClick={requestCallToDoctor}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-4 px-6 rounded-full font-semibold text-lg transition-colors shadow-lg"
                  >
                    {loading ? 'Connecting...' : 'Quick Chat'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/signup")}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-full font-semibold text-lg transition-colors shadow-lg"
                  >
                    Get Started
                  </button>

                  <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-full font-semibold text-lg transition-colors shadow-lg"
                  >
                    Login
                  </button>
                </>
              )}

              {/* Secondary Buttons */}
              <div className="space-y-3 pt-2">
                <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-full font-medium border border-gray-200 transition-colors">
                <Link to='/terms' className="block">
                  Terms & Conditions
                </Link>
                </button>

                <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-full font-medium border border-gray-200 transition-colors">
                <Link to='/privacy' className="block">
                  Privacy Policies
                </Link>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>

  );
}
