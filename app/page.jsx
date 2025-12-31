"use client";

import { useState, useEffect } from "react";
import { days } from "../data/days";

// Streak Intro Screen
function StreakIntro({ streak, onContinue }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div style={{
      position:"fixed",
      top:0,
      left:0,
      width:"100%",
      height:"100%",
      backgroundColor:"#FBF7F2",
      display:"flex",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center",
      zIndex:9999,
      transition:"opacity 0.5s ease",
      opacity: animate ? 1 : 0
    }}>
      <div style={{
        transform: animate ? "scale(1)" : "scale(0.5)",
        opacity: animate ? 1 : 0,
        transition:"all 1s ease",
        textAlign:"center"
      }}>
        <h1 style={{ fontSize:48, color:"#6B3E26", marginBottom:20 }}>🔥 Your Current Streak 🔥</h1>
        <p style={{ fontSize:36, color:"#8A6A52", marginBottom:40 }}>{streak} {streak === 1 ? "day" : "days"}</p>
        <button 
          onClick={onContinue} 
          style={{
            padding:"12px 24px",
            fontSize:20,
            borderRadius:10,
            border:"none",
            backgroundColor:"#6B3E26",
            color:"#FBF7F2",
            cursor:"pointer",
            transition:"transform 0.2s ease",
          }}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  const [currentDay, setCurrentDay] = useState(1);
  const [dayOpacity, setDayOpacity] = useState(1); 
  const [jumpDay, setJumpDay] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [journal, setJournal] = useState("");
  const [completedDays, setCompletedDays] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);

  const day = days.find(d => d.day === currentDay);
  if (!day) return null;

  // Load localStorage data
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!localStorage.getItem("introSeen")) setShowIntro(true);

    const savedBookmark = localStorage.getItem("bookmarkedDay");
    if (savedBookmark) setCurrentDay(parseInt(savedBookmark));

    const savedStreak = JSON.parse(localStorage.getItem("streak")) || { count: 0, lastDate: null };
    const today = new Date().toISOString().slice(0,10);
    if (savedStreak.lastDate) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
      if (savedStreak.lastDate === yesterday) savedStreak.count += 1;
      else if (savedStreak.lastDate !== today) savedStreak.count = 1;
    } else savedStreak.count = 1;
    savedStreak.lastDate = today;
    localStorage.setItem("streak", JSON.stringify(savedStreak));
    setStreak(savedStreak.count);

    const savedDarkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
    const savedVolume = parseFloat(localStorage.getItem("musicVolume")) || 0.5;
    setDarkMode(savedDarkMode);
    setMusicVolume(savedVolume);

    const audio = document.getElementById("backgroundMusic");
    if (audio) audio.volume = savedVolume;

  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("bookmarkedDay", currentDay);
    const savedJournal = localStorage.getItem(`journal-day-${currentDay}`) || "";
    setJournal(savedJournal);
    const completed = days.filter(d => localStorage.getItem(`journal-day-${d.day}`)).length;
    setCompletedDays(completed);
  }, [currentDay]);

  // Page transition
  const changeDay = (newDay) => {
    setDayOpacity(0);
    setTimeout(() => {
      setCurrentDay(newDay);
      setDayOpacity(1);
    }, 250);
  };

  const nextDay = () => { if (currentDay < 365) changeDay(currentDay + 1); };
  const prevDay = () => { if (currentDay > 1) changeDay(currentDay - 1); };
  const jumpToDay = () => {
    const num = parseInt(jumpDay);
    if (!isNaN(num) && num >=1 && num <=365) changeDay(num);
    setJumpDay("");
  };
  const handleDateChange = (value) => {
    setSelectedDate(value);
    if (!value) return;
    const pickedDate = new Date(value);
    const startOfYear = new Date(pickedDate.getFullYear(),0,1);
    const diffTime = pickedDate - startOfYear;
    const diffDays = Math.floor(diffTime / (1000*60*60*24)) +1;
    if (diffDays>=1 && diffDays<=365) changeDay(diffDays);
  };
  const handleJournalChange = (e) => {
    const value = e.target.value;
    setJournal(value);
    if (typeof window !== "undefined") localStorage.setItem(`journal-day-${currentDay}`, value);
  };

  const handleContinueIntro = () => {
    if (typeof window !== "undefined") localStorage.setItem("introSeen","true");
    setShowIntro(false);
    const audio = document.getElementById("backgroundMusic");
    if (audio) audio.play().catch(err=>console.log("Autoplay prevented", err));
  };

  const toggleMusic = () => {
    const audio = document.getElementById("backgroundMusic");
    if (!audio) return;
    if (audio.paused) audio.play();
    else audio.pause();
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (typeof window !== "undefined") localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setMusicVolume(vol);
    const audio = document.getElementById("backgroundMusic");
    if (audio) audio.volume = vol;
    if (typeof window !== "undefined") localStorage.setItem("musicVolume", vol);
  };

  const clearCache = () => { if (typeof window !== "undefined") localStorage.clear(); alert("Local cache cleared!"); };

  const progressPercent = Math.round((completedDays/365)*100);

  if (showIntro) return <StreakIntro streak={streak} onContinue={handleContinueIntro} />;

  return (
    <div style={{ 
      minHeight:"100vh", 
      backgroundColor: darkMode ? "#2B2B2B":"#FBF7F2", 
      color: darkMode ? "#EDEDED" : "#000000",
      fontFamily:"Georgia, serif", 
      padding:24, 
      transition:"all 0.5s ease" 
    }}>
      
      {/* Audio */}
      <audio id="backgroundMusic" loop>
        <source src="/music/peaceful.mp3" type="audio/mpeg" />
      </audio>

      {/* Header */}
      <header style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>changeDay(1)}>🏠 Home</button>
          <button onClick={()=>setShowSettings(true)}>⚙️ Settings</button>
        </div>
        <h1 style={{ color:"#6B3E26", fontSize:36 }}>Bible in 365 Days</h1>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>setShowResources(true)}>📚 Resources</button>
          <button onClick={()=>window.location.href="mailto:plaworkshop7@gmail.com"}>✉️ Contact</button>
        </div>
      </header>

      {/* Modals */}
      {showSettings && (
        <div style={{ position:"fixed", top:0,left:0,width:"100%",height:"100%", backgroundColor:"rgba(0,0,0,0.5)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:999 }}>
          <div style={{ background: darkMode?"#3A3A3A":"#FFF", color: darkMode?"#EDEDED":"#000", padding:24, borderRadius:12, width:"90%", maxWidth:400, transform:"translateY(-50px)", opacity:0, animation:"slideIn 0.3s forwards" }}>
            <h2>Settings</h2>
            <div><label><input type="checkbox" checked={darkMode} onChange={toggleDarkMode}/> Dark Mode</label></div>
            <div><label>Music Volume: <input type="range" min="0" max="1" step="0.01" value={musicVolume} onChange={handleVolumeChange} /></label></div>
            <div><button onClick={clearCache}>Clear Local Cache</button></div>
            <div style={{ textAlign:"right", marginTop:10 }}><button onClick={()=>setShowSettings(false)}>Close</button></div>
          </div>
        </div>
      )}
      {showResources && (
        <div style={{ position:"fixed", top:0,left:0,width:"100%",height:"100%", backgroundColor:"rgba(0,0,0,0.5)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:999 }}>
          <div style={{ background: darkMode?"#3A3A3A":"#FFF", color: darkMode?"#EDEDED":"#000", padding:24, borderRadius:12, width:"90%", maxWidth:400, transform:"translateY(-50px)", opacity:0, animation:"slideIn 0.3s forwards" }}>
            <h2>Resources</h2>
            <ul>
              <li><a href="https://www.bible.com" target="_blank" style={{ color: darkMode?"#EDEDED":"#000" }}>Bible.com</a></li>
              <li><a href="https://www.youtube.com/@bibleproject" target="_blank" style={{ color: darkMode?"#EDEDED":"#000" }}>Bible Project YouTube</a></li>
            </ul>
            <div style={{ textAlign:"right", marginTop:10 }}><button onClick={()=>setShowResources(false)}>Close</button></div>
          </div>
        </div>
      )}
      <style>{`@keyframes slideIn { from {opacity:0; transform:translateY(-50px);} to {opacity:1; transform:translateY(0);} }`}</style>

      {/* Navigation */}
      <div style={{ display:"flex", justifyContent:"center", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <input 
          type="number" 
          placeholder="Go to day" 
          value={jumpDay} 
          onChange={e=>setJumpDay(e.target.value)} 
          style={{ 
            width:110,
            padding:6, 
            background: darkMode?"#3A3A3A":"#FFF", 
            color: darkMode?"#EDEDED":"#000", 
            border: darkMode?"1px solid #555":"1px solid #ccc",
            borderRadius:6,
            transition:"all 0.3s ease",
            outline:"none"
          }}
          onFocus={e=>e.style.borderColor = darkMode?"#A67C52":"#6B3E26"}
          onBlur={e=>e.style.borderColor = darkMode?"#555":"#ccc"}
        />
        <button 
          onClick={jumpToDay} 
          style={{
            padding:"6px 12px",
            borderRadius:6,
            border:"none",
            backgroundColor:"#6B3E26",
            color:"#FBF7F2",
            cursor:"pointer",
            transition:"transform 0.2s ease"
          }}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
        >
          Go
        </button>

        <input 
          type="date" 
          value={selectedDate} 
          onChange={e=>handleDateChange(e.target.value)} 
          style={{ 
            padding:6, 
            background: darkMode?"#3A3A3A":"#FFF", 
            color: darkMode?"#EDEDED":"#000", 
            border: darkMode?"1px solid #555":"1px solid #ccc",
            borderRadius:6,
            transition:"all 0.3s ease",
            outline:"none"
          }}
          onFocus={e=>e.style.borderColor = darkMode?"#A67C52":"#6B3E26"}
          onBlur={e=>e.style.borderColor = darkMode?"#555":"#ccc"}
        />
      </div>

      {/* Progress bar */}
      <div style={{ margin:"20px 0", textAlign:"center" }}>
        <p>📊 Progress: {completedDays}/365 days ({progressPercent}%)</p>
        <div style={{ width:"80%", height:20, background:"#E2D5C8", margin:"0 auto", borderRadius:10 }}>
          <div style={{ width:`${progressPercent}%`, height:"100%", background:"#6B3E26", borderRadius:10, transition:"width 0.5s ease" }}></div>
        </div>
      </div>

      {/* Day content sections with fade transition */}
      <div style={{ opacity: dayOpacity, transition:"opacity 0.25s ease" }}>
        <section style={{ background: darkMode?"#3A3A3A":"#FFF", border:"1px solid "+(darkMode?"#555":"#E2D5C8"), borderRadius:12, padding:20, marginBottom:20, color: darkMode?"#EDEDED":"#000" }}>
          <h3>📜 Old Testament</h3>
          <p>{day.oldTestament}</p>
          <h3>✝️ New Testament</h3>
          <p>{day.newTestament}</p>
        </section>

        <section style={{ background: darkMode?"#2E2E2E":"#FFF8ED", borderLeft:"6px solid "+(darkMode?"#A67C52":"#6B3E26"), padding:20, marginBottom:20, borderRadius:8, color: darkMode?"#EDEDED":"#000" }}>
          <h3>Reflection</h3>
          <p>{day.reflection}</p>
        </section>

        <section style={{ background: darkMode?"#2E2E2E":"#F5EFE6", borderLeft:"6px solid "+(darkMode?"#C19B77":"#8A6A52"), padding:20, borderRadius:8, color: darkMode?"#EDEDED":"#000" }}>
          <h3>Journaling Prompt</h3>
          <p>{day.prompt}</p>
          <textarea value={journal} onChange={handleJournalChange} placeholder="Write your thoughts here..." style={{ width:"100%", minHeight:120, padding:10, marginTop:10, borderRadius:6, border: darkMode?"1px solid #555":"1px solid #ccc", fontFamily:"Georgia, serif", background: darkMode?"#3A3A3A":"#FFF", color: darkMode?"#EDEDED":"#000" }} />
        </section>
      </div>

      {/* Previous / Next */}
      <div style={{ marginTop:30, textAlign:"center" }}>
        <button onClick={prevDay} disabled={currentDay===1}>Previous</button>
        <button onClick={nextDay} disabled={currentDay===365} style={{ marginLeft:10 }}>Next</button>
      </div>

      {/* Music button */}
      <button onClick={toggleMusic} style={{position:"fixed", bottom:20,right:20,padding:10,borderRadius:8, background:"#6B3E26", color:"#FBF7F2"}}>🎵 Music</button>

      <style>{`@keyframes fadeIn { from {opacity:0;} to {opacity:1;} }`}</style>
    </div>
  );
}
