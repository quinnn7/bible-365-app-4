"use client";

import { useState, useEffect } from "react";
import { days } from "../data/days";

// ------------------ Achievements ------------------
const achievementsList = [
  { name: "Brass", streak: 30, message: "Congrats on a full month of reading the Bible!", color: "#B5A642" },
  { name: "Bronze", streak: 50, message: "50 days of dedication! Amazing!", color: "#CD7F32" },
  { name: "Silver", streak: 100, message: "100 days! Incredible consistency!", color: "#C0C0C0" },
  { name: "Gold", streak: 200, message: "200 days! Outstanding!", color: "#FFD700" },
  { name: "Platinum", streak: 365, message: "365 days! Legendary!", color: "#E5E4E2" },
];

// ------------------ Streak Intro ------------------
function StreakIntro({ streak, onContinue }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimate(true), 100); return () => clearTimeout(t); }, []);
  return (
    <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"#FBF7F2",display:"flex",justifyContent:"center",alignItems:"center",zIndex:9999,transition:"opacity 0.5s ease",opacity: animate?1:0}}>
      <div style={{transform: animate?"scale(1)":"scale(0.5)",opacity: animate?1:0,transition:"all 1s ease",textAlign:"center"}}>
        <h1 style={{fontSize:48,color:"#6B3E26",marginBottom:20}}>🔥 Your Current Streak 🔥</h1>
        <p style={{fontSize:36,color:"#8A6A52",marginBottom:40}}>{streak} {streak===1?"day":"days"}</p>
        <button onClick={onContinue} style={{padding:"12px 24px",fontSize:20,borderRadius:10,border:"none",backgroundColor:"#6B3E26",color:"#FBF7F2",cursor:"pointer",transition:"transform 0.2s ease"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          Continue
        </button>
      </div>
    </div>
  );
}

// ------------------ Profile Modal ------------------
function ProfileModal({ onClose, onLogin, onSignup }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleSubmit = () => {
    if(mode==="login") onLogin({email,password});
    else onSignup({email,password,username,avatar});
  }

  return (
    <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.5)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:9999}}>
      <div style={{background:"#FFF",padding:20,borderRadius:12,width:300,transform:mode==="login"?"scale(1)":"scale(0.9)",transition:"transform 0.3s ease"}}>
        <h2>{mode==="login"?"Log In":"Sign Up"}</h2>
        {mode==="signup" && <>
          <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} style={{width:"100%",marginBottom:8}}/>
          <input type="file" accept="image/png, image/jpeg" onChange={e=>{
            const file = e.target.files[0];
            if(file){
              const reader = new FileReader();
              reader.onload = ()=> setAvatar(reader.result);
              reader.readAsDataURL(file);
            }
          }} style={{width:"100%",marginBottom:8}}/>
        </>}
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:"100%",marginBottom:8}}/>
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:"100%",marginBottom:8}}/>
        <button onClick={handleSubmit} style={{width:"100%",padding:8,marginBottom:8}}>{mode==="login"?"Log In":"Sign Up"}</button>
        <button onClick={()=>setMode(mode==="login"?"signup":"login")} style={{width:"100%",padding:8}}>{mode==="login"?"Switch to Sign Up":"Switch to Log In"}</button>
        <button onClick={onClose} style={{marginTop:8,width:"100%"}}>Close</button>
      </div>
    </div>
  )
}

// ------------------ Profile Page ------------------
function ProfilePage({ profile, onClose }) {
  if(!profile) return null;
  return (
    <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.5)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:9999}}>
      <div style={{background:"#FFF",padding:20,borderRadius:12,width:350}}>
        <h2>Profile</h2>
        <img src={profile.avatar||"/default-avatar.png"} style={{width:80,height:80,borderRadius:"50%"}}/>
        <p>Username: {profile.username}</p>
        <p>Email: {profile.email}</p>
        <p>Current Streak: {profile.currentStreak||0}</p>
        <p>Best Streak: {profile.bestStreak||0}</p>
        <h3>Achievements:</h3>
        <ul>
          {achievementsList.map(a => profile.bestStreak>=a.streak?<li key={a.name} style={{color:a.color}}>{a.name}: {a.message}</li>:null)}
        </ul>
        <button onClick={onClose} style={{marginTop:10}}>Close</button>
      </div>
    </div>
  )
}

// ------------------ Settings Modal ------------------
function SettingsModal({ darkMode, setDarkMode, musicVolume, setMusicVolume, onClear, onClose }) {
  return (
    <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.5)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:9999}}>
      <div style={{background:"#FFF",padding:20,borderRadius:12,width:300}}>
        <h2>Settings</h2>
        <label>
          <input type="checkbox" checked={darkMode} onChange={()=>{setDarkMode(!darkMode); localStorage.setItem("darkMode", JSON.stringify(!darkMode));}}/>
          Dark Mode
        </label>
        <div>
          <label>Music Volume: {Math.round(musicVolume*100)}%</label>
          <input type="range" min={0} max={1} step={0.01} value={musicVolume} onChange={e=>{setMusicVolume(parseFloat(e.target.value)); localStorage.setItem("musicVolume", e.target.value);}}/>
        </div>
        <button onClick={onClear} style={{marginTop:10}}>Clear Cache</button>
        <button onClick={onClose} style={{marginTop:10}}>Close</button>
      </div>
    </div>
  );
}

// ------------------ Resources Modal ------------------
function ResourcesModal({ onClose }) {
  return (
    <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.5)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:9999}}>
      <div style={{background:"#FFF",padding:20,borderRadius:12,width:300}}>
        <h2>Resources</h2>
        <p><a href="https://www.bible.com/" target="_blank">Bible.com</a></p>
        <p><a href="https://www.youtube.com/@bibleproject" target="_blank">BibleProject YouTube</a></p>
        <button onClick={onClose} style={{marginTop:10}}>Close</button>
      </div>
    </div>
  );
}

// ------------------ Contact Modal ------------------
function ContactModal({ onClose }) {
  return (
    <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.5)",display:"flex",justifyContent:"center",alignItems:"center",zIndex:9999}}>
      <div style={{background:"#FFF",padding:20,borderRadius:12,width:300}}>
        <h2>Contact</h2>
        <p>Email: <a href="mailto:plaworkshop7@gmail.com">plaworkshop7@gmail.com</a></p>
        <button onClick={onClose} style={{marginTop:10}}>Close</button>
      </div>
    </div>
  );
}

// ------------------ Main Page ------------------
export default function Page() {
  const [currentDay,setCurrentDay]=useState(1);
  const [dayOpacity,setDayOpacity]=useState(1);
  const [journal,setJournal]=useState("");
  const [completedDays,setCompletedDays]=useState(0);
  const [streak,setStreak]=useState(0);
  const [showIntro,setShowIntro]=useState(false);
  const [darkMode,setDarkMode]=useState(false);
  const [musicVolume,setMusicVolume]=useState(0.5);
  const [jumpDay,setJumpDay]=useState("");
  const [profile,setProfile]=useState(null);
  const [showProfileModal,setShowProfileModal]=useState(false);
  const [showProfilePage,setShowProfilePage]=useState(false);
  const [showSettings,setShowSettings]=useState(false);
  const [showResources,setShowResources]=useState(false);
  const [showContact,setShowContact]=useState(false);

  const day = days.find(d=>d.day===currentDay);
  if(!day) return null;

  useEffect(()=>{
    if(typeof window==="undefined")return;
    if(!localStorage.getItem("introSeen")) setShowIntro(true);
    const savedBookmark = localStorage.getItem("bookmarkedDay");
    if(savedBookmark) setCurrentDay(parseInt(savedBookmark));

    const savedStreak = JSON.parse(localStorage.getItem("streak"))||{count:0,lastDate:null};
    const today = new Date().toISOString().slice(0,10);
    if(savedStreak.lastDate){
      const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
      if(savedStreak.lastDate===yesterday)savedStreak.count+=1;
      else if(savedStreak.lastDate!==today)savedStreak.count=1;
    } else savedStreak.count=1;
    savedStreak.lastDate=today;
    localStorage.setItem("streak",JSON.stringify(savedStreak));
    setStreak(savedStreak.count);

    const savedDarkMode = JSON.parse(localStorage.getItem("darkMode"))||false;
    setDarkMode(savedDarkMode);

    const savedVolume = parseFloat(localStorage.getItem("musicVolume"))||0.5;
    setMusicVolume(savedVolume);

    const savedProfile = JSON.parse(localStorage.getItem("profile"));
    if(savedProfile) setProfile(savedProfile);

    // ------------------ Notifications ------------------
    if("Notification" in window && Notification.permission!=="granted") Notification.requestPermission();
    const todayDate = new Date();
    const monthDay = `${todayDate.getMonth()+1}-${todayDate.getDate()}`;
    const holidays = {
      "4-7":"Good Friday",
      "4-9":"Easter",
      "12-25":"Christmas"
    };
    if(holidays[monthDay]){
      new Notification("Religious Holiday Reminder", {body:`The Bible reminds us the true blessings of ${holidays[monthDay]}`});
    }
    if(!localStorage.getItem(`journal-day-${currentDay}`)){
      new Notification("Daily Journal Reminder", {body:"Don't forget to complete today's Bible journal!"});
    }

  },[]);

  useEffect(()=>{
    if(typeof window==="undefined")return;
    localStorage.setItem("bookmarkedDay",currentDay);
    const savedJournal = localStorage.getItem(`journal-day-${currentDay}`)||"";
    setJournal(savedJournal);
    const completed = days.filter(d=>localStorage.getItem(`journal-day-${d.day}`)).length;
    setCompletedDays(completed);

    if(profile){
      const updatedProfile={...profile,currentStreak:streak};
      if(!updatedProfile.bestStreak || streak>updatedProfile.bestStreak) updatedProfile.bestStreak=streak;
      setProfile(updatedProfile);
      localStorage.setItem("profile",JSON.stringify(updatedProfile));
    }
  },[currentDay,streak,profile]);

  const changeDay=(newDay)=>{setDayOpacity(0); setTimeout(()=>{setCurrentDay(newDay); setDayOpacity(1)},300);}
  const nextDay=()=>{if(currentDay<365)changeDay(currentDay+1);}
  const prevDay=()=>{if(currentDay>1)changeDay(currentDay-1);}
  const handleJournalChange=(e)=>{const value=e.target.value; setJournal(value); if(typeof window!=="undefined") localStorage.setItem(`journal-day-${currentDay}`,value);}
  const handleContinueIntro=()=>{
    if(typeof window==="undefined") return;
    localStorage.setItem("introSeen","true");
    setShowIntro(false);
    const audio=document.getElementById("backgroundMusic");
    if(audio){ audio.volume=musicVolume; audio.play().catch(err=>console.log("Autoplay prevented",err)); }
  }

  const handleLogin=(data)=>{
    const saved = JSON.parse(localStorage.getItem("profile"));
    if(saved && saved.email===data.email && saved.password===data.password){
      setProfile(saved);
      setShowProfileModal(false);
    } else alert("Invalid login");
  }
  const handleSignup=(data)=>{
    setProfile({...data,currentStreak:0,bestStreak:0});
    localStorage.setItem("profile",JSON.stringify({...data,currentStreak:0,bestStreak:0}));
    setShowProfileModal(false);
  }
  const clearCache=()=>{localStorage.clear(); window.location.reload();}
  const progressPercent = Math.round((completedDays/365)*100);

  if(showIntro) return <StreakIntro streak={streak} onContinue={handleContinueIntro}/>;

  return (
    <div style={{minHeight:"100vh",backgroundColor:darkMode?"#2B2B2B":"#FBF7F2",color:darkMode?"#EDEDED":"#000",fontFamily:"Georgia, serif",padding:24,transition:"all 0.5s ease"}}>
      <audio id="backgroundMusic" loop preload="auto">
        <source src="/music/peaceful.mp3" type="audio/mpeg"/>
      </audio>

      {/* ------------------ Header ------------------ */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setCurrentDay(1)}>Home</button>
          <button onClick={()=>setShowSettings(true)}>Settings</button>
        </div>
        <h1 style={{textAlign:"center",color:"#8B4513"}}>Bible in 365 Days</h1>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setShowResources(true)}>Resources</button>
          <button onClick={()=>setShowContact(true)}>Contact</button>
        </div>
      </div>

      {/* ------------------ Profile Circle ------------------ */}
      <div style={{textAlign:"center",marginBottom:20}}>
        <button onClick={()=>{profile?setShowProfilePage(true):setShowProfileModal(true)}} style={{borderRadius:"50%",width:80,height:80,overflow:"hidden",border:"2px solid #8B4513"}}>
          <img src={profile?.avatar||"/default-avatar.png"} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        </button>
      </div>

      {/* ------------------ Progress Bar ------------------ */}
      <div style={{height:12,width:"100%",background:"#ddd",borderRadius:6,marginBottom:20}}>
        <div style={{width:`${progressPercent}%`,height:"100%",background:"#6B3E26",borderRadius:6,transition:"width 0.5s ease"}}></div>
      </div>

      {/* ------------------ Calendar / Jump to Day ------------------ */}
      <div style={{marginBottom:20}}>
        <input type="number" placeholder="Go to day" value={jumpDay} onChange={e=>setJumpDay(e.target.value)} style={{width:100,marginRight:10}}/>
        <button onClick={()=>{const dayNum=parseInt(jumpDay); if(dayNum>=1 && dayNum<=365) changeDay(dayNum)}}>Go</button>
        <button onClick={()=>localStorage.removeItem("bookmarkedDay")}>Clear Bookmark</button>
      </div>

      {/* ------------------ Day Content ------------------ */}
      <div style={{opacity:dayOpacity,transition:"opacity 0.3s ease, transform 0.3s ease",transform: dayOpacity===0?"translateY(20px)":"translateY(0px)",padding:20,backgroundColor:darkMode?"#3B3B3B":"#FFF8E7",borderRadius:12,marginBottom:20}}>
        <h2 style={{textAlign:"center", fontSize:28, marginBottom:20, color:"#8B4513"}}>Day {day.day}</h2>

        <div style={{background: darkMode?"#4B4B4B":"#FDEBD0", padding:15, borderRadius:10, marginBottom:15}}>
          <strong>Old Testament:</strong> <span style={{fontWeight:"bold"}}>{day.oldTestament}</span>
        </div>

        <div style={{background: darkMode?"#4B4B4B":"#FDEBD0", padding:15, borderRadius:10, marginBottom:15}}>
          <strong>New Testament:</strong> <span style={{fontWeight:"bold"}}>{day.newTestament}</span>
        </div>

        <h3 style={{fontSize:22,color:"#6B3E26"}}>Reflection</h3>
        <p style={{fontSize:18,marginBottom:15}}>{day.reflection}</p>

        <h3 style={{fontSize:22,color:"#6B3E26"}}>Journaling Prompt</h3>
        <textarea value={journal} onChange={handleJournalChange} style={{width:"100%",minHeight:80,fontSize:16,padding:8,borderRadius:8,resize:"vertical"}}/>
      </div>

      {/* ------------------ Navigation Buttons ------------------ */}
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <button onClick={prevDay} disabled={currentDay===1}>Previous</button>
        <button onClick={nextDay} disabled={currentDay===365}>Next</button>
      </div>

      {/* ------------------ Modals ------------------ */}
      {showProfileModal && <ProfileModal onClose={()=>setShowProfileModal(false)} onLogin={handleLogin} onSignup={handleSignup}/>}
      {showProfilePage && <ProfilePage profile={profile} onClose={()=>setShowProfilePage(false)}/>}
      {showSettings && <SettingsModal darkMode={darkMode} setDarkMode={setDarkMode} musicVolume={musicVolume} setMusicVolume={setMusicVolume} onClear={clearCache} onClose={()=>setShowSettings(false)}/>}
      {showResources && <ResourcesModal onClose={()=>setShowResources(false)}/>}
      {showContact && <ContactModal onClose={()=>setShowContact(false)}/>}
    </div>
  );
}
