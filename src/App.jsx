import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { StreamVideoProvider } from './contexts/StreamVideoProvider'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Signup from './components/SignUp'
import LogIn from './components/LogIn'
import IncomingCallScreen from './components/IncomingCallScreen'
import CallScreen from './components/CallScreen'

import './App.css'
import ChatPage from './components/ChatPage'
import SelectChild from './components/SelectChild'
import AddChild from './components/AddChild'
import InputSymptoms from './components/InputSymptoms'
import NotFound from './components/NotFound'
import PaymentForm from './components/PaymentForm'
import { ChatProvider } from './contexts/ChatContext'
import IncomingAudioCallScreen from './components/IncomingAudioCallScreen'
import Contact from './components/Contact'
import Privacy from './components/Privacy'
import ForgotPass from './components/ForgotPass'

function App() {
  return (
    <AuthProvider>
      <StreamVideoProvider>
        <ChatProvider>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path='/login' element={<LogIn />} />
            <Route path='/forgot-password' element={<ForgotPass />} />
            <Route path='/chat/:channelId' element={<ChatPage />} />
            <Route path="/select-child" element={<SelectChild />} />
            <Route path="/add-child" element={<AddChild />} />
            <Route path="/input-symptoms" element={<InputSymptoms />} />

            <Route path="/call" element={
              <>
                <IncomingCallScreen />
                <CallScreen />
              </>
            } />
            <Route path='/audio-call' element= {<IncomingAudioCallScreen/>} />
            <Route path="/pay" element={<PaymentForm />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        </ChatProvider>
      </StreamVideoProvider>
    </AuthProvider>
  )
}

export default App
