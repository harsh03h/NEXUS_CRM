import React, { useState, useRef, useEffect } from 'react';
import { Camera, Save, User, Mail, Phone, MapPin, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { cn } from '../utils';

export function Profile() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('nexus-profile');
    return saved ? JSON.parse(saved) : {
      name: 'Harsh Gupta',
      email: 'harsh.gupta@nexuscrm.com',
      phone: '+91 98765 43210',
      location: 'Mumbai, India',
      bio: 'Sales Director with 10+ years of experience in B2B enterprise software.'
    };
  });

  const [avatar, setAvatar] = useState(() => localStorage.getItem('nexus-avatar') || '');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('nexus-profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (avatar) {
      localStorage.setItem('nexus-avatar', avatar);
      window.dispatchEvent(new Event('storage')); // trigger update for other components
    }
  }, [avatar]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name.trim() || !profile.email.trim()) {
      showToast('Name and Email are required', 'error');
      return;
    }
    showToast('Profile updated successfully!', 'success');
  };

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (err) {
      showToast('Unable to access camera. Please check permissions.', 'error');
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  useEffect(() => {
    if (isCameraOpen && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraOpen, stream]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setAvatar(dataUrl);
        showToast('Profile picture updated!', 'success');
        closeCamera();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">User Profile</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="relative group w-32 h-32 mb-4">
              <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border-4 border-white dark:border-slate-800 shadow-md">
                {avatar ? (
                  <img src={avatar || undefined} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User size={48} />
                  </div>
                )}
              </div>
              <button
                onClick={openCamera}
                className="absolute bottom-0 right-0 p-2.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-105"
                title="Update Picture"
              >
                <Camera size={18} />
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{profile.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{profile.email}</p>
            <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                Sales Director
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={e => setProfile({...profile, name: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={e => setProfile({...profile, email: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone size={16} />
                    </div>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={e => setProfile({...profile, phone: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <MapPin size={16} />
                    </div>
                    <input
                      type="text"
                      value={profile.location}
                      onChange={e => setProfile({...profile, location: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Bio / About</label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={e => setProfile({...profile, bio: e.target.value})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                />
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/50 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {isCameraOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Take Profile Picture</h3>
              <button onClick={closeCamera} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-black flex justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover rounded-lg mirror"
                style={{ transform: 'scaleX(-1)' }}
              />
            </div>
            <div className="p-4 flex justify-end gap-3">
              <button 
                onClick={closeCamera}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={capturePhoto}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors flex items-center gap-2"
              >
                <Camera size={16} />
                Capture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
