import React, { useState, useEffect } from 'react';
import { Upload, Download, Lock, Unlock, Code, Users, Folder, Search, User, LogOut, Settings, Eye, Heart, Calendar, FileCode } from 'lucide-react';

const GitUpWithProfiles = () => {
  const [view, setView] = useState('home');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null);
  
  const [authData, setAuthData] = useState({
    username: '',
    email: '',
    password: '',
    bio: '',
    avatar: ''
  });

  const [uploadData, setUploadData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    file: null,
    tags: [],
    githubUrl: '',
    demoUrl: ''
  });

  const VALID_INVITE_CODE = 'ROOFLY2024';

  // Load data from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('gitup_users');
    const savedProjects = localStorage.getItem('gitup_projects');
    const savedCurrentUser = localStorage.getItem('gitup_current_user');
    
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedCurrentUser) setCurrentUser(JSON.parse(savedCurrentUser));
  }, []);

  const saveData = (newUsers, newProjects) => {
    if (newUsers) {
      localStorage.setItem('gitup_users', JSON.stringify(newUsers));
      setUsers(newUsers);
    }
    if (newProjects) {
      localStorage.setItem('gitup_projects', JSON.stringify(newProjects));
      setProjects(newProjects);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSignup = (e, inviteCode) => {
    e.preventDefault();
    
    if (inviteCode !== VALID_INVITE_CODE) {
      showNotification('Invalid invite code', 'error');
      return;
    }

    if (!authData.username || !authData.email || !authData.password) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    // Check if username exists
    if (users.find(u => u.username === authData.username)) {
      showNotification('Username already exists', 'error');
      return;
    }

    const newUser = {
      id: Date.now(),
      username: authData.username,
      email: authData.email,
      bio: authData.bio || 'Developer at Roofly\'s Team',
      avatar: authData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.username}`,
      joinDate: new Date().toISOString(),
      projects: 0,
      totalDownloads: 0
    };

    const updatedUsers = [...users, newUser];
    saveData(updatedUsers, null);
    setCurrentUser(newUser);
    localStorage.setItem('gitup_current_user', JSON.stringify(newUser));
    
    showNotification(`Welcome to GitUp, ${newUser.username}! 🎉`);
    setView('browse');
    setAuthData({ username: '', email: '', password: '', bio: '', avatar: '' });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    const user = users.find(u => 
      u.username === authData.username && authData.password
    );

    if (user) {
      setCurrentUser(user);
      localStorage.setItem('gitup_current_user', JSON.stringify(user));
      showNotification(`Welcome back, ${user.username}! 👋`);
      setView('browse');
      setAuthData({ username: '', email: '', password: '', bio: '', avatar: '' });
    } else {
      showNotification('Invalid credentials', 'error');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gitup_current_user');
    setView('home');
    showNotification('Logged out successfully');
  };

  const handleUpload = (e) => {
    e.preventDefault();
    
    if (!uploadData.file || !uploadData.name || !currentUser) {
      showNotification('Please fill all required fields', 'error');
      return;
    }

    const newProject = {
      id: Date.now(),
      ...uploadData,
      fileName: uploadData.file.name,
      fileSize: (uploadData.file.size / 1024 / 1024).toFixed(2) + ' MB',
      uploadDate: new Date().toISOString(),
      downloads: 0,
      views: 0,
      likes: 0,
      authorId: currentUser.id,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar
    };

    const updatedProjects = [...projects, newProject];
    const updatedUsers = users.map(u => 
      u.id === currentUser.id 
        ? { ...u, projects: u.projects + 1 }
        : u
    );

    saveData(updatedUsers, updatedProjects);
    setCurrentUser(updatedUsers.find(u => u.id === currentUser.id));
    
    showNotification('Project uploaded successfully! 🚀');
    setUploadData({ name: '', description: '', isPrivate: false, file: null, tags: [], githubUrl: '', demoUrl: '' });
    setView('profile');
  };

  const handleDownload = (project) => {
    const updatedProjects = projects.map(p => 
      p.id === project.id ? { ...p, downloads: p.downloads + 1 } : p
    );
    
    const updatedUsers = users.map(u => 
      u.id === project.authorId 
        ? { ...u, totalDownloads: u.totalDownloads + 1 }
        : u
    );

    saveData(updatedUsers, updatedProjects);
    showNotification(`Downloading ${project.name}...`);
  };

  const handleLike = (project) => {
    const updatedProjects = projects.map(p => 
      p.id === project.id ? { ...p, likes: p.likes + 1 } : p
    );
    saveData(null, updatedProjects);
    showNotification('Liked! ❤️');
  };

  const getUserProjects = (userId) => {
    return projects.filter(p => p.authorId === userId);
  };

  const filteredProjects = projects.filter(p => 
    !p.isPrivate && 
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.authorUsername.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const myProjects = currentUser ? getUserProjects(currentUser.id) : [];

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[128px] animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-8 right-8 z-50 px-6 py-4 rounded-lg shadow-2xl border-2 backdrop-blur-lg animate-[slideIn_0.3s_ease-out] ${
          notification.type === 'success' 
            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' 
            : 'bg-red-500/20 border-red-500 text-red-300'
        }`}>
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-black/50 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div 
                onClick={() => setView('home')} 
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <Code className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    GitUp
                  </h1>
                  <p className="text-xs text-white/50 tracking-wide">by Roofly's Team</p>
                </div>
              </div>
              
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => setView('browse')}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                    view === 'browse' 
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/50' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Browse
                </button>

                <button
                  onClick={() => setView('members')}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                    view === 'members' 
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/50' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Users size={18} />
                  Members
                </button>
                
                {currentUser ? (
                  <>
                    <button
                      onClick={() => setView('upload')}
                      className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                        view === 'upload' 
                          ? 'bg-purple-500 text-black shadow-lg shadow-purple-500/50' 
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Upload size={18} />
                      Upload
                    </button>

                    <div className="relative group">
                      <button
                        onClick={() => {
                          setSelectedProfile(currentUser);
                          setView('profile');
                        }}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
                      >
                        <img src={currentUser.avatar} className="w-8 h-8 rounded-full" alt={currentUser.username} />
                        <span className="font-semibold">{currentUser.username}</span>
                      </button>
                      
                      <div className="absolute right-0 top-full mt-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[200px]">
                        <button
                          onClick={() => {
                            setSelectedProfile(currentUser);
                            setView('profile');
                          }}
                          className="w-full px-4 py-3 hover:bg-white/5 transition-all text-left flex items-center gap-2"
                        >
                          <User size={16} />
                          My Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 hover:bg-white/5 transition-all text-left flex items-center gap-2 text-red-400"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setView('login')}
                      className="px-6 py-2.5 rounded-lg font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setView('signup')}
                      className="px-6 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                    >
                      Join Team
                    </button>
                  </>
                )}
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          
          {/* HOME VIEW */}
          {view === 'home' && (
            <div className="space-y-16 animate-[fadeIn_0.6s_ease-out]">
              <div className="text-center space-y-6 py-20">
                <h2 className="text-7xl font-black tracking-tight leading-tight">
                  Your Team's
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Project Hub
                  </span>
                </h2>
                <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                  Create your profile, share your projects, and build together.
                  A modern platform for developers by developers.
                </p>
                <div className="flex gap-4 justify-center pt-6">
                  <button
                    onClick={() => setView('browse')}
                    className="px-8 py-4 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transform hover:scale-105"
                  >
                    Explore Projects
                  </button>
                  <button
                    onClick={() => setView('signup')}
                    className="px-8 py-4 border-2 border-purple-500 text-purple-400 font-bold rounded-xl hover:bg-purple-500/10 transition-all duration-300"
                  >
                    Create Account
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { icon: Users, label: 'Members', value: users.length },
                  { icon: Folder, label: 'Projects', value: projects.filter(p => !p.isPrivate).length },
                  { icon: Download, label: 'Downloads', value: users.reduce((sum, u) => sum + u.totalDownloads, 0) }
                ].map((stat, i) => (
                  <div 
                    key={i} 
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:border-cyan-500/50 transition-all duration-300 hover:bg-white/10"
                  >
                    <stat.icon className="mx-auto mb-4 text-cyan-400" size={32} />
                    <div className="text-4xl font-black bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-white/50 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SIGNUP VIEW */}
          {view === 'signup' && (
            <div className="max-w-2xl mx-auto animate-[fadeIn_0.6s_ease-out] py-12">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="text-white" size={32} />
                  </div>
                  <h2 className="text-3xl font-black mb-2">Join Roofly's Team</h2>
                  <p className="text-white/60">Create your profile and start sharing projects</p>
                </div>

                <form onSubmit={(e) => {
                  const inviteCode = e.target.inviteCode.value;
                  handleSignup(e, inviteCode);
                }} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-white/80">
                        Username *
                      </label>
                      <input
                        type="text"
                        value={authData.username}
                        onChange={(e) => setAuthData({...authData, username: e.target.value})}
                        placeholder="roofly"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-white/80">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={authData.email}
                        onChange={(e) => setAuthData({...authData, email: e.target.value})}
                        placeholder="roofly@team.dev"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white/80">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={authData.password}
                      onChange={(e) => setAuthData({...authData, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white/80">
                      Bio (optional)
                    </label>
                    <textarea
                      value={authData.bio}
                      onChange={(e) => setAuthData({...authData, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white/80">
                      Invitation Code *
                    </label>
                    <input
                      type="text"
                      name="inviteCode"
                      placeholder="Enter your invite code"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-all uppercase"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                  >
                    Create Account
                  </button>
                </form>

                <p className="text-center text-sm text-white/40 mt-6">
                  Already have an account?{' '}
                  <button onClick={() => setView('login')} className="text-cyan-400 hover:underline">
                    Login here
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* LOGIN VIEW */}
          {view === 'login' && (
            <div className="max-w-md mx-auto animate-[fadeIn_0.6s_ease-out] py-20">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User className="text-white" size={32} />
                  </div>
                  <h2 className="text-3xl font-black mb-2">Welcome Back</h2>
                  <p className="text-white/60">Login to your account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white/80">
                      Username
                    </label>
                    <input
                      type="text"
                      value={authData.username}
                      onChange={(e) => setAuthData({...authData, username: e.target.value})}
                      placeholder="Your username"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white/80">
                      Password
                    </label>
                    <input
                      type="password"
                      value={authData.password}
                      onChange={(e) => setAuthData({...authData, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                  >
                    Login
                  </button>
                </form>

                <p className="text-center text-sm text-white/40 mt-6">
                  Don't have an account?{' '}
                  <button onClick={() => setView('signup')} className="text-cyan-400 hover:underline">
                    Sign up here
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* BROWSE PROJECTS VIEW */}
          {view === 'browse' && (
            <div className="space-y-8 animate-[fadeIn_0.6s_ease-out]">
              <div className="flex items-center justify-between">
                <h2 className="text-4xl font-black">Explore Projects</h2>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input
                    type="text"
                    placeholder="Search projects or users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-all w-80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.length === 0 ? (
                  <div className="col-span-full text-center py-20 text-white/40">
                    <Folder size={64} className="mx-auto mb-4 opacity-20" />
                    <p className="text-xl">No projects yet. Be the first to upload!</p>
                  </div>
                ) : (
                  filteredProjects.map((project, i) => (
                    <div
                      key={project.id}
                      className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div 
                            onClick={() => {
                              const author = users.find(u => u.id === project.authorId);
                              setSelectedProfile(author);
                              setView('profile');
                            }}
                            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                          >
                            <img src={project.authorAvatar} className="w-10 h-10 rounded-full" alt={project.authorUsername} />
                            <div>
                              <p className="font-semibold text-sm">{project.authorUsername}</p>
                              <p className="text-xs text-white/40">
                                {new Date(project.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          {project.isPrivate ? (
                            <Lock size={16} className="text-white/40" />
                          ) : (
                            <Unlock size={16} className="text-cyan-400" />
                          )}
                        </div>
                        
                        <div 
                          onClick={() => {
                            setSelectedProject(project);
                            setView('project');
                          }}
                          className="cursor-pointer"
                        >
                          <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-white/60 text-sm mb-4 line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-white/40 pt-4 border-t border-white/10">
                          <span>{project.fileSize}</span>
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Heart size={14} />
                              {project.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <Download size={14} />
                              {project.downloads}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* MEMBERS VIEW */}
          {view === 'members' && (
            <div className="space-y-8 animate-[fadeIn_0.6s_ease-out]">
              <h2 className="text-4xl font-black">Team Members</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user, i) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      setSelectedProfile(user);
                      setView('profile');
                    }}
                    className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer hover:bg-white/10 hover:-translate-y-1"
                  >
                    <div className="text-center">
                      <img 
                        src={user.avatar} 
                        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-cyan-500/20 group-hover:border-cyan-500 transition-all" 
                        alt={user.username} 
                      />
                      <h3 className="text-xl font-bold mb-1 group-hover:text-cyan-400 transition-colors">
                        {user.username}
                      </h3>
                      <p className="text-white/60 text-sm mb-4 line-clamp-2">
                        {user.bio}
                      </p>
                      
                      <div className="flex items-center justify-around pt-4 border-t border-white/10 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-cyan-400">{user.projects}</div>
                          <div className="text-white/40 text-xs">Projects</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-purple-400">{user.totalDownloads}</div>
                          <div className="text-white/40 text-xs">Downloads</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE VIEW */}
          {view === 'profile' && selectedProfile && (
            <div className="space-y-8 animate-[fadeIn_0.6s_ease-out]">
              <button
                onClick={() => setView('members')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Back to members
              </button>

              {/* Profile Header */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10">
                <div className="flex items-start gap-8">
                  <img 
                    src={selectedProfile.avatar} 
                    className="w-32 h-32 rounded-2xl border-4 border-cyan-500/30" 
                    alt={selectedProfile.username} 
                  />
                  <div className="flex-1">
                    <h2 className="text-4xl font-black mb-2">{selectedProfile.username}</h2>
                    <p className="text-white/60 mb-6">{selectedProfile.bio}</p>
                    
                    <div className="flex items-center gap-8 text-sm">
                      <div>
                        <span className="text-white/40">Joined </span>
                        <span className="font-semibold">
                          {new Date(selectedProfile.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-cyan-400 font-bold text-2xl">{selectedProfile.projects}</span>
                        <span className="text-white/40 ml-2">Projects</span>
                      </div>
                      <div>
                        <span className="text-purple-400 font-bold text-2xl">{selectedProfile.totalDownloads}</span>
                        <span className="text-white/40 ml-2">Total Downloads</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Projects */}
              <div>
                <h3 className="text-2xl font-black mb-6">
                  {currentUser?.id === selectedProfile.id ? 'My Projects' : `${selectedProfile.username}'s Projects`}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getUserProjects(selectedProfile.id).length === 0 ? (
                    <div className="col-span-full text-center py-20 text-white/40">
                      <FileCode size={64} className="mx-auto mb-4 opacity-20" />
                      <p className="text-xl">No projects yet</p>
                    </div>
                  ) : (
                    getUserProjects(selectedProfile.id).map((project) => (
                      <div
                        key={project.id}
                        onClick={() => {
                          setSelectedProject(project);
                          setView('project');
                        }}
                        className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer hover:bg-white/10 hover:-translate-y-1"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-cyan-500/30 group-hover:border-cyan-500 transition-all">
                            <Code className="text-cyan-400" size={24} />
                          </div>
                          {project.isPrivate ? (
                            <Lock size={16} className="text-white/40" />
                          ) : (
                            <Unlock size={16} className="text-cyan-400" />
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-white/60 text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-white/40 pt-4 border-t border-white/10">
                          <span>{project.fileSize}</span>
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Heart size={14} />
                              {project.likes}
                            </span>
                            <span className="flex items-center gap-1">
                              <Download size={14} />
                              {project.downloads}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PROJECT DETAIL VIEW */}
          {view === 'project' && selectedProject && (
            <div className="animate-[fadeIn_0.6s_ease-out]">
              <button
                onClick={() => setView('browse')}
                className="mb-8 text-white/60 hover:text-white transition-colors"
              >
                ← Back to projects
              </button>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 max-w-4xl">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-4xl font-black mb-4">{selectedProject.name}</h2>
                    
                    <div 
                      onClick={() => {
                        const author = users.find(u => u.id === selectedProject.authorId);
                        setSelectedProfile(author);
                        setView('profile');
                      }}
                      className="flex items-center gap-3 mb-6 cursor-pointer hover:opacity-80 transition-opacity w-fit"
                    >
                      <img src={selectedProject.authorAvatar} className="w-10 h-10 rounded-full" alt={selectedProject.authorUsername} />
                      <div>
                        <p className="font-semibold">{selectedProject.authorUsername}</p>
                        <p className="text-sm text-white/40">
                          {new Date(selectedProject.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleLike(selectedProject)}
                      className="px-6 py-3 border-2 border-purple-500 text-purple-400 font-bold rounded-xl hover:bg-purple-500/10 transition-all duration-300 flex items-center gap-2"
                    >
                      <Heart size={20} />
                      {selectedProject.likes}
                    </button>
                    <button
                      onClick={() => handleDownload(selectedProject)}
                      className="px-6 py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/50 flex items-center gap-2"
                    >
                      <Download size={20} />
                      Download
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-white/80">Description</h3>
                    <p className="text-white/60 leading-relaxed">{selectedProject.description}</p>
                  </div>

                  {(selectedProject.githubUrl || selectedProject.demoUrl) && (
                    <div className="flex gap-4">
                      {selectedProject.githubUrl && (
                        <a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/50 transition-all font-semibold"
                        >
                          View on GitHub →
                        </a>
                      )}
                      {selectedProject.demoUrl && (
                        <a
                          href={selectedProject.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/50 transition-all font-semibold"
                        >
                          Live Demo →
                        </a>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                    <div>
                      <h4 className="text-sm text-white/40 mb-1">File Size</h4>
                      <p className="font-semibold">{selectedProject.fileSize}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-white/40 mb-1">Downloads</h4>
                      <p className="font-semibold">{selectedProject.downloads}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-white/40 mb-1">Likes</h4>
                      <p className="font-semibold">{selectedProject.likes}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-white/40 mb-1">File Name</h4>
                      <p className="font-semibold truncate">{selectedProject.fileName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* UPLOAD VIEW */}
          {view === 'upload' && currentUser && (
            <div className="max-w-3xl mx-auto animate-[fadeIn_0.6s_ease-out]">
              <h2 className="text-4xl font-black mb-8">Upload Project</h2>

              <form onSubmit={handleUpload} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-white/80">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={uploadData.name}
                      onChange={(e) => setUploadData({...uploadData, name: e.target.value})}
                      placeholder="My Awesome Project"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-all"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-white/80">
                      Description *
                    </label>
                    <textarea
                      value={uploadData.description}
                      onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                      placeholder="Describe your project..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white/80">
                      GitHub URL (optional)
                    </label>
                    <input
                      type="url"
                      value={uploadData.githubUrl}
                      onChange={(e) => setUploadData({...uploadData, githubUrl: e.target.value})}
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white/80">
                      Demo URL (optional)
                    </label>
                    <input
                      type="url"
                      value={uploadData.demoUrl}
                      onChange={(e) => setUploadData({...uploadData, demoUrl: e.target.value})}
                      placeholder="https://demo.com..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-white/80">
                    Project File (ZIP) *
                  </label>
                  <input
                    type="file"
                    accept=".zip"
                    onChange={(e) => setUploadData({...uploadData, file: e.target.files[0]})}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:text-black file:font-semibold hover:file:bg-cyan-400 file:cursor-pointer focus:outline-none focus:border-cyan-500 transition-all"
                    required
                  />
                  {uploadData.file && (
                    <p className="text-sm text-cyan-400 mt-2">
                      Selected: {uploadData.file.name} ({(uploadData.file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <input
                    type="checkbox"
                    id="private"
                    checked={uploadData.isPrivate}
                    onChange={(e) => setUploadData({...uploadData, isPrivate: e.target.checked})}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-cyan-500"
                  />
                  <label htmlFor="private" className="text-white/80 cursor-pointer flex items-center gap-2">
                    <Lock size={16} />
                    Make this project private
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Upload size={20} />
                  Upload Project
                </button>
              </form>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-20 backdrop-blur-xl bg-black/50">
          <div className="max-w-7xl mx-auto px-6 py-8 text-center text-white/40">
            <p className="font-medium">
              Made with 💜 by <span className="text-cyan-400 font-bold">Roofly's Team</span>
            </p>
            <p className="text-sm mt-2">GitUp - Your team's project hub</p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default GitUpWithProfiles;
