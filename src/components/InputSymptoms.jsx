import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';
import { getChatId } from '../../util/getChatId';
import { useChat } from '../contexts/ChatContext';
import PageLayout from './ui/PageLayout';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { buildApiUrl } from '../util/api';

// Symptom data with emojis (replacing images with emojis for better performance)
const symptomData = [
  { id: "1", name: "Vomit", emoji: "🤮" },
  { id: "2", name: "Pica (Eating chalk)", emoji: "🪨" },
  { id: "3", name: "Bed wetting", emoji: "🛏️💧" },
  { id: "4", name: "Loose motions", emoji: "💩" },
  { id: "5", name: "Skin allergy", emoji: "🔴🩹" },
  { id: "6", name: "Sore throat", emoji: "😣👄" },
  { id: "7", name: "Ear pain", emoji: "👂💥" },
  { id: "8", name: "Stomach pain", emoji: "🤕🤲" },
  { id: "9", name: "Eye allergy", emoji: "👁️💧" },
  { id: "10", name: "Cold cough", emoji: "🤧😷" },
  { id: "11", name: "Fever", emoji: "🌡️🔥" },
  { id: "12", name: "Bloating", emoji: "🎈😟" },
  { id: "13", name: "Mumps", emoji: "🦠😶" },
  { id: "14", name: "Other", emoji: "❓" },
];

export default function InputSymptoms() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, streamtoken } = useAuth();

  const { setChatClient } = useChat();

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

  const validate = () => {
    const selectedSymptoms = getSelectedSymptoms();

    if (selectedSymptoms.length === 0) {
      toast.error('Please select at least one symptom');
      return false;
    }
    return true;
  };

  // Submit details and navigate to chat
  const sendDetails = async () => {
    if (!validate()) return;

    const selectedSymptoms = getSelectedSymptoms();
    setLoading(true);

    try {
      // Book appointment first
      const appointmentData = {
        userId: userId || user.id,
        childId,
        symptomList: selectedSymptoms,
        thermoReading: thermoReading || 'N/A',
        oxiReading: oxiReading || 'N/A',
      };

      const response = await fetch(
        buildApiUrl('bookAppointment'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointmentData),
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        toast.error('Unable to book the appointment. Please try again.');
        return;
      }

      // Get Stream key
      let key = null;
      if (import.meta.env.VITE_NODE_ENV === 'dev') {
        key = import.meta.env.VITE_STREAM_CHAT_KEY;
      } else {
        const keyResponse = await fetch(buildApiUrl('getStreamKey'), { method: 'POST' });
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
        buildApiUrl('getDoctorId'),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const doctorData = await doctorResponse.json();

      // Create or get channel
      const channel = chatClient.channel('messaging', {
        members: [user.id, doctorData.doctorId],
        name: user.name,
      });

      await channel.watch();

      navigate(`/chat/${getChatId(channel.id, true)}`, {
        state: {
          symptomList: selectedSymptoms,
          thermoReading,
          oxiReading,
          callToDoctor: true,
          childInfo,
        },
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

  const selectedSymptoms = getSelectedSymptoms();

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/select-child')}>
              ← Back to Select Child
            </Button>
            <h1 className="text-3xl font-bold text-text-primary mt-2">Medical Consultation</h1>
            <p className="text-text-secondary mt-1">
              {childInfo?.name ? `For ${childInfo.name}` : 'Enter symptoms and health readings'}
            </p>
          </div>
        </div>

        {/* Child Info Card */}
        {childInfo && (
          <Card variant="default" padding="md" className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-2xl">
                {childInfo.gender === 'female' ? '👧' : '👦'}
              </div>
              <div>
                <p className="font-semibold text-text-primary">{childInfo.name}</p>
                <p className="text-sm text-text-secondary">
                  {childInfo.age ? `Age: ${childInfo.age} years` : ''}
                  {childInfo.gender && childInfo.age ? ' • ' : ''}
                  {childInfo.gender ? (childInfo.gender === 'female' ? 'Girl' : 'Boy') : ''}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Symptoms Section */}
        <Card variant="elevated" padding="lg">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-text-primary mb-2">Select Symptoms</h2>
            <p className="text-text-secondary text-sm">Tap to select all that apply</p>
          </div>

          {/* Symptoms Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
            {symptoms.map((symptom, index) => (
              <button
                key={symptom.id}
                type="button"
                onClick={() => toggleSymptom(index)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${symptom.isSelected
                    ? 'border-success-500 bg-success-50 dark:bg-success-900/20 shadow-md'
                    : 'border-border-primary hover:border-primary-300 dark:hover:border-primary-600'
                  }
                `}
                aria-pressed={symptom.isSelected}
              >
                <span className="text-3xl" aria-hidden="true">{symptom.emoji}</span>
                <span className={`text-sm font-medium text-center ${symptom.isSelected ? 'text-success-700 dark:text-success-300' : 'text-text-secondary'}`}>
                  {symptom.name}
                </span>
              </button>
            ))}
          </div>

          {/* Selected Symptoms Display */}
          {selectedSymptoms.length > 0 && (
            <div className="bg-bg-tertiary rounded-xl p-4">
              <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Badge variant="success" size="sm" dot>Selected</Badge>
                Selected Symptoms:
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map((symptom, i) => (
                  <Badge key={i} variant="info" size="sm">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Readings Section */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-xl font-semibold text-text-primary mb-6">Health Readings</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Thermometer Reading (°C)"
              type="number"
              name="thermoReading"
              placeholder="Enter temperature"
              value={thermoReading}
              onChange={(e) => setThermoReading(e.target.value)}
              step="0.1"
              min="30"
              max="45"
              leftIcon={<span className="text-xl" aria-hidden="true">🌡️</span>}
              helperText="Normal range: 36.1°C - 37.2°C"
            />

            <Input
              label="Oximeter Reading (SpO₂)"
              type="number"
              name="oxiReading"
              placeholder="Enter SpO₂ level"
              value={oxiReading}
              onChange={(e) => setOxiReading(e.target.value)}
              min="70"
              max="100"
              leftIcon={<span className="text-xl" aria-hidden="true">🫁</span>}
              helperText="Normal range: 95% - 100%"
            />
          </div>
        </Card>

        {/* Send Details Button */}
        <div className="flex justify-center">
          <Button
            variant="success"
            size="xl"
            fullWidth={false}
            onClick={sendDetails}
            disabled={loading}
            className="min-w-[280px]"
          >
            {loading ? 'Sending Details...' : 'Send Details to Doctor'}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
