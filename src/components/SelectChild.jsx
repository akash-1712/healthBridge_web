// src/components/SelectChild.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const env = import.meta.env.VITE_NODE_ENV;

export default function SelectChild() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [childrenList, setChildrenList] = useState([]);

  useEffect(() => {
    if (!user || !token) {
      navigate('/');
      return;
    }

    fetchChildrenList();
  }, [user, token]);

  const fetchChildrenList = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${env === "dev" ? '/api' : '/backend'}/getChildrenList?` +
        new URLSearchParams({
          userId: user.id,
        }).toString(),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        toast.error("Unable to retrieve the child list. Please try again.");
      } else {
        setChildrenList(data.childrenList || []);
      }
    } catch (err) {
      toast.error("Network or server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChildSelect = (child) => {
    navigate('/input-symptoms', {
      state: {
        userId: user.id,
        childId: child._id,
        childInfo: child
      }
    });
  };

  const handleAddChild = () => {
    navigate('/add-child', {
      state: { userId: user.id }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading children...</p>
        </div>
      </div>
    );
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
      {childrenList.length > 0 && (
    <div className="sticky top-26 z-40 bg-white border-b border-gray-200 shadow-sm md:hidden pl-2">
      <div className="container px-4 py-4">
        <div className="max-w-4xl">
          <div className="flex items-center gap-[17px] relative">
            {/* Left aligned button */}
            <div className="">
              <button
                onClick={() => navigate('/')}
                className="text-blue-500 hover:text-blue-700 flex items-center justify-center gap-1 text-3xl"
          style={{ transform: 'translateY(-5px)' }}

              >
                ←
              </button>
            </div>

            {/* Centered heading */}
            <h1 className="text-xl font-bold text-blue-900 text-left">
              Select Child
            </h1>
          </div>
        </div>
      </div>
    </div>
  )}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {childrenList.length === 0 ? (
            // No Children Layout
            <div className="text-center py-20">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <span className="text-4xl">👶</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">No Children Added</h2>
                  <p className="text-gray-600">Add your first child to start a medical visit</p>
                </div>
                <button
                  onClick={handleAddChild}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
                >
                  Add Your First Child
                </button>
              </div>
            </div>
          ) : (
            // Children List Layout
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="items-center justify-center mb-8 relative hidden md:flex">
                {/* Left aligned button */}
                <div className="absolute left-0">
                  <button
                    onClick={() => navigate('/')}
                    className="text-blue-500 hover:text-blue-700 text-lg flex items-center gap-1"
                  >
                    ← <span className="hidden md:inline">Back to Home</span>
                  </button>
                </div>

                {/* Centered heading */}
                <h1 className="text-3xl font-bold text-blue-900 mx-auto">
                  Select Child
                </h1>
              </div>


              {/* Children Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                {childrenList.map((child) => (
                  <div
                    key={child._id}
                    onClick={() => handleChildSelect(child)}
                    className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer hover:bg-blue-100 border-2 border-transparent hover:border-blue-300"
                  >
                    <div className="text-center">
                      {/* Child Avatar */}
                      <div className="w-20 h-20 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-3xl">
                          {child.gender === 'female' ? '👧' : '👦'}
                        </span>
                      </div>

                      {/* Child Info */}
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">
                        {child.name}
                      </h3>
                      {child.age && (
                        <p className="text-gray-600 text-sm">
                          Age: {child.age} years
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Child Button */}
              <div className="text-center border-t pt-6">
                <button
                  onClick={handleAddChild}
                  className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold flex items-center gap-2 mx-auto"
                >
                  <span>➕</span>
                  Add New Child
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
