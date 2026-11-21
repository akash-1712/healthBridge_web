// src/components/InputSymptoms.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';
import { getChatId } from '../../util/getChatId';

import vomitImg from "../assets/images/vomit.jpeg";
import eatingChalkImg from "../assets/images/eating_chalk.jpeg";
import bedWettingImg from "../assets/images/bed_wetting.jpeg";
import looseMotionsImg from "../assets/images/loose_motions.jpeg";
import skinAllergyImg from "../assets/images/skin_allergy.jpeg";
import soreThroatImg from "../assets/images/sore_throat.jpeg";
import earPainImg from "../assets/images/ear_pain.jpeg";
import stomachPainImg from "../assets/images/stomach_pain.jpeg";
import eyeInfectionImg from "../assets/images/eye_infection.jpeg";
import coldCoughImg from "../assets/images/cold_cough.jpeg";
import feverImg from "../assets/images/fever.jpeg";
import bloatingImg from "../assets/images/bloating.jpeg";
import mumpsImg from "../assets/images/mumps.jpeg";
import iconImg from "../assets/images/icon.png";
import { useChat } from '../contexts/ChatContext';

const env = import.meta.env.VITE_NODE_ENV;

// Symptom data with emojis
const symptomData = [
  { id: "1", name: "Vomit", isSelected: false, img: vomitImg },
  { id: "2", name: "Pica(Eating chalk)", isSelected: false, img: eatingChalkImg },
  { id: "3", name: "Bed wetting", isSelected: false, img: bedWettingImg },
  { id: "4", name: "Loose motions", isSelected: false, img: looseMotionsImg },
  { id: "5", name: "Skin allergy", isSelected: false, img: skinAllergyImg },
  { id: "6", name: "Sore throat", isSelected: false, img:soreThroatImg },
  { id: "7", name: "Ear pain", isSelected: false,img : earPainImg },
  { id: "8", name: "Stomach pain", isSelected: false, img: stomachPainImg},
  { id: "9", name: "Eye allergy", isSelected: false, img:eyeInfectionImg },
  { id: "10", name: "Cold cough", isSelected: false, img:coldCoughImg },
  { id: "11", name: "Fever", isSelected: false, img: feverImg},
  { id: "12", name: "Bloating", isSelected: false, img:bloatingImg },
  { id: "13", name: "Mumps", isSelected: false, img: mumpsImg },
  { id: "14", name: "Other", isSelected: false, img: iconImg },
];

export default function InputSymptoms() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, streamtoken } = useAuth();

  const {setChatClient} = useChat();
  
  // Get data from navigation state
  const { userId, childId, childInfo } = location.state || {};
  
  // State management
  const [symptoms, setSymptoms] = useState(symptomData);
  const [thermoReading, setThermoReading] = useState('');
  const [oxiReading, setOxiReading] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle symptom selection
  const toggleSymptom = (index) => {
    const updatedSymptoms = [...symptoms];
    updatedSymptoms[index].isSelected = !updatedSymptoms[index].isSelected;
    setSymptoms(updatedSymptoms);
  };

  // Get selected symptoms
  const getSelectedSymptoms = () => {
    return symptoms.filter(symptom => symptom.isSelected).map(symptom => symptom.name);
  };

  // Submit details and navigate to chat
  const sendDetails = async () => {
    const selectedSymptoms = getSelectedSymptoms();
    
    if (selectedSymptoms.length === 0) {
      toast.error('Please select at least one symptom');
      return;
    }

    // if (!thermoReading || !oxiReading) {
    //   toast.error('Please provide all readings');
    //   return;
    // }

    setLoading(true);

    try {
      // Book appointment first
      const appointmentData = {
        userId: userId || user.id,
        childId,
        symptomList: selectedSymptoms,
        thermoReading:thermoReading || 'N/A',
        oxiReading:oxiReading || 'N/A',
      };

      const response = await fetch(
        `${env === "dev" ? '/api' : '/backend'}/bookAppointment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(appointmentData)
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        toast.error('Unable to book the appointment. Please try again.');
        return;
      }

      // Get Stream key
      let key = null;
      if (env === "dev") {
        key = import.meta.env.VITE_STREAM_CHAT_KEY;
      } else {
        const keyResponse = await fetch('/api/getStreamKey', { method: 'POST' });
        const keyData = await keyResponse.json();
        if (!keyResponse.ok) throw new Error(keyData.error);
        key = keyData.key;
      }

      // Create Stream Chat channel
      const chatClient = StreamChat.getInstance(key);
      await chatClient.connectUser(
        { id: user.id },
        streamtoken
      );

      setChatClient(chatClient);

      // Get doctor data
      const doctorResponse = await fetch(
        `${env === "dev" ? '/api' : '/backend'}/getDoctorId`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      const doctorData = await doctorResponse.json();

    // Create or get channel
      const channel = chatClient.channel('messaging', {
        members: [user.id, doctorData.doctorId],
        name:user.name // Add actual doctor ID
      });

      await channel.watch();

      navigate(`/chat/${getChatId(channel.id, true)}`, {
        state: {
          symptomList: selectedSymptoms,
          thermoReading,
          oxiReading,
          callToDoctor: true,
          childInfo
        }
      });

    } catch (error) {
      console.error('Error sending details:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !childId) {
    navigate('/select-child');
    return null;
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=2000&q=80&opacity=0.1')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
    <div className="sticky top-26 z-40 bg-white border-b border-gray-200 shadow-sm md:hidden pl-2">
      <div className="container px-4 py-4">
        <div className="max-w-4xl">
          <div className="flex items-center gap-[17px] relative">
            {/* Left aligned button */}
            <button
          onClick={() => navigate('/select-child')}
          className="text-blue-500 hover:text-blue-700 flex items-center justify-center text-3xl h-8 w-8"
          style={{ transform: 'translateY(-5px)' }}
        >
          ←
        </button>

            {/* Centered heading */}
            <h1 className="text-xl font-bold text-blue-900 text-left">
              Medical Consultation
            </h1>
          </div>
        </div>
      </div>
    </div>
      <div className="container mx-auto px-4">

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="hidden md:flex items-center justify-center mb-8 relative">
                {/* Left aligned button */}
                <div className="absolute left-0">
                  <button
                    onClick={() => navigate('/select-child')}
                    className="text-blue-500 hover:text-blue-700 text-lg flex items-center gap-1"
                  >
                    ← <span className="hidden md:inline">Back to Select Child</span>
                  </button>
                </div>

                {/* Centered heading */}
                <h1 className="text-3xl font-bold text-blue-900 mx-auto">
                Medical Consultation
                </h1>
              </div>
          
          {/* Symptoms Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Symptoms</h2>
            
            {/* Symptoms Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
              {symptoms.map((symptom, index) => (
                <div
                  key={symptom.id}
                  onClick={() => toggleSymptom(index)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    symptom.isSelected
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-300 hover:border-gray-400 bg-white'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      <img src={symptom.img} alt={symptom.name}/>
                    </div>
                    <p className={`text-xs font-medium ${
                      symptom.isSelected ? 'text-green-700' : 'text-gray-700'
                    }`}>
                      {symptom.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Symptoms Display */}
            {getSelectedSymptoms().length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Selected Symptoms:</h3>
                <p className="text-blue-700">{getSelectedSymptoms().join(', ')}</p>
              </div>
            )}
          </div>

          {/* Readings Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Health Readings</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🌡️ Thermometer Reading (°C)
                </label>
                <input
                  type="number"
                  value={thermoReading}
                  onChange={(e) => setThermoReading(e.target.value)}
                  placeholder="Enter temperature"
                  step="0.1"
                  min="30"
                  max="45"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🫁 Oximeter Reading (SpO2)
                </label>
                <input
                  type="number"
                  value={oxiReading}
                  onChange={(e) => setOxiReading(e.target.value)}
                  placeholder="Enter SpO2 level"
                  min="70"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {/* Send Details Button */}
          <div className="text-center">
            <button
              onClick={sendDetails}
              disabled={loading}
              className={`px-8 py-4 rounded-lg font-semibold text-white transition ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 active:bg-green-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending Details...</span>
                </div>
              ) : (
                'Send Details to Doctor'
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
