"use client";

import { useState, useEffect } from "react";
import { days } from "../data/days";

// Achievement definitions
const achievementsList = [
  { name: "Brass", streak: 30, message: "Congratulations on a full month of reading the Bible!", color: "#B5A642" },
  { name: "Bronze", streak: 50, message: "Amazing! You've reached a 50-day streak!", color: "#CD7F32" },
  { name: "Silver", streak: 100, message: "Incredible! 100 days of dedication!", color: "#C0C0C0" },
  { name: "Gold", streak: 200, message: "Outstanding! 200 days of consistent reading!", color: "#FFD700" },
  { name: "Platinum", streak: 365, message: "Legendary! You completed the full year!", color: "#E5E4E2" },
];

// Streak intro screen
function StreakIntro({ streak, onContinue }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "#FBF7F2", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999,
      transition: "opacity 0.5s ease", opacity: animate ? 1 : 0
    }}>
      <div style={{ transform: animate ? "scale(1)" : "scale(0.5)", opacity: animate ? 1 : 0, transition: "all 1s ease", textAlign: "center" }}>
        <h1 style={{ fontSize: 48, color: "#6B3E26", marginBottom: 20 }}>🔥 Your Current Streak 🔥</h1>
        <p style={{ fontSize: 36, color: "#8A6A52", marginBottom: 40 }}>{streak} {streak === 1 ? "day" : "days"}</p>
        <button onClick={onContinue} style={{
          padding: "12px 24px", fontSize: 20, borderRadius: 10, border: "none", backgroundColor: "#6B3E26", color: "#FBF7F2", cursor: "pointer", transition: "transform 0.2s ease"
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >Continue</button>
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

  // Profile states
  const [profile, setProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", username: "", avatar: "" });
  const [newAchievement, setNewAchievement] = useState(null);

  const day = days.find(d => d.day === currentDay);
  if (!day) return null;

  // ================= Browser-side initialization =================
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Intro
    if (!localStorage.getItem("introSeen")) setShowIntro(true);

    // Bookmarked day
    const savedBookmark = localStorage.getItem("bookmarkedDay");
    if (savedBookmark) setCurrentDay(parseInt(savedBookmark));

    // Streak calculation
    const savedStreak = JSON.parse(localStorage.getItem("streak")) || { count: 0, lastDate: null };
    const today = new Date().toISOString().slice(0, 10);
    if (savedStreak.lastDate) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (savedStreak.lastDate === yesterday) savedStreak.count += 1;
      else if (savedStreak.lastDate !== today) savedStreak.count = 1;
    } else savedStreak.count = 1;
    savedStreak.lastDate = today;
    localStorage.setItem("streak", JSON.stringify(savedStreak));
    setStreak(savedStreak.count);

    // Dark mode
    const savedDarkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
    setDarkMode(savedDarkMode);

    // Music volume
    const savedVolume = parseFloat(localStorage.getItem("musicVolume")) || 0.5;
    setMusicVolume(savedVolume);

    const audio = document.getElementById("backgroundMusic");
    if (audio) audio.volume = savedVolume;

    // Load profile
    const savedProfile = JSON.parse(localStorage.getItem("profile"));
    if (savedProfile) setProfile(savedProfile);

  }, []);

  // ================= Update day & journal =================
  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem("bookmarkedDay", currentDay);

    const savedJournal = localStorage.getItem(`journal-day-${currentDay}`) || "";
    setJournal(savedJournal);

    const completed = days.filter(d => localStorage.getItem(`journal-day-${d.day}`)).length;
    setCompletedDays(completed);

    // Update profile streaks if logged in
    if (profile) {
      const updatedProfile = { ...profile, currentStreak: streak };
      if (!updatedProfile.bestStreak || streak > updatedProfile.bestStreak) updatedProfile.bestStreak = streak;
      setProfile(updatedProfile);
      localStorage.setItem("profile", JSON.stringify(updatedProfile));
    }

  }, [currentDay, streak, profile]);

  // ================= Achievement unlock =================
  useEffect(() => {
    if (!profile) return;
    achievementsList.forEach(a => {
      if (streak >= a.streak && profile.bestStreak < a.streak) {
        setNewAchievement(a);
        setTimeout(() => setNewAchievement(null), 3000);
      }
    });
  }, [streak, profile]);

  // ================= Navigation helpers =================
  const changeDay = (newDay) => { setDayOpacity(0); setTimeout(() => { setCurrentDay(newDay); setDayOpacity(1); }, 250); };
  const nextDay = () => { if (currentDay < 365) changeDay(currentDay + 1); }
  const prevDay = () => { if (currentDay > 1) changeDay(currentDay - 1); }
  const jumpToDay = () => { const num = parseInt(jumpDay); if (!isNaN(num) && num >= 1 && num <= 365) changeDay(num); setJumpDay(""); }

  const handleDateChange = (value) => {
    setSelectedDate(value);
    if (!value) return;
    const pickedDate = new Date(value);
    const startOfYear = new Date(pickedDate.getFullYear(), 0, 1);
    const diffTime = pickedDate - startOfYear;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays >= 1 && diffDays <= 365) changeDay(diffDays);
  }

  const handleJournalChange = (e) => {
    const value = e.target.value;
    setJournal(value);
    if (typeof window !== "undefined") localStorage.setItem(`journal-day-${currentDay}`, value);
  }

  const handleContinueIntro = () => {
    if (typeof window !== "undefined") localStorage.setItem("introSeen", "true");
    setShowIntro(false);
    const audio = document.getElementById("backgroundMusic");
    if (audio) audio.play().catch(err => console.log("Autoplay prevented", err));
  }

  // Progress percentage
  const progressPercent = Math.round((completedDays / 365) * 100);

  if (showIntro) return <StreakIntro streak={streak} onContinue={handleContinueIntro} />;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: darkMode ? "#2B2B2B" : "#FBF7F2",
      color: darkMode ? "#EDEDED" : "#000",
      fontFamily: "Georgia, serif",
      padding: 24,
      transition: "all 0.5s ease"
    }}>

      {/* Audio */}
      <audio id="backgroundMusic" loop>
        <source src="/music/peaceful.mp3" type="audio/mpeg" />
      </audio>

      {/* Achievement animation */}
      {newAchievement && (
        <div style={{
          position: "fixed", top: "30%", left: "50%", transform: "translate(-50%,-50%)",
          backgroundColor: newAchievement.color, padding: 20, borderRadius: 12,
          color: "#000", textAlign: "center", zIndex: 1000,
          animation: "popIn 0.5s ease, fadeOut 0.5s 2.5s ease forwards"
        }}>
          <h2>{newAchievement.name} Achievement!</h2>
          <p>{newAchievement.message}</p>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          0% { transform: translate(-50%,-50%) scale(0.5); opacity:0; }
          100% { transform: translate(-50%,-50%) scale(1); opacity:1; }
        }
        @keyframes fadeOut {
          0% { opacity:1; }
          100% { opacity:0; }
        }
      `}</style>

      {/* Day content */}
      <div style={{ opacity: dayOpacity, transition: "opacity 0.25s ease" }}>
        <h2>Day {day.day}</h2>
        <p style={{ fontWeight: "bold", fontSize: 18, color: "#8B4513" }}>Old Testament: {day.oldTestament}</p>
        <p style={{ fontWeight: "bold", fontSize: 18, color: "#A0522D" }}>New Testament: {day.newTestament}</p>
        <h3 style={{ fontSize: 22, color: "#6B3E26" }}>Reflection</h3>
        <p style={{ fontSize: 18 }}>{day.reflection}</p>
        <h3 style={{ fontSize: 22, color: "#6B3E26" }}>Journaling Prompt</h3>
        <p style={{ fontSize: 18 }}>{day.prompt}</p>

        <textarea value={journal} onChange={handleJournalChange} placeholder="Write your journal entry..." style={{ width: "100%", minHeight: 120, padding: 8, borderRadius: 8, border: "1px solid #ccc", marginTop: 10, resize: "vertical" }}></textarea>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <button onClick={prevDay} disabled={currentDay === 1}>Previous</button>
          <button onClick={nextDay} disabled={currentDay === 365}>Next</button>
        </div>

        <p style={{ marginTop: 10 }}>Progress: {completedDays} days completed ({progressPercent}%)</p>
      </div>

    </div>
  );
}

