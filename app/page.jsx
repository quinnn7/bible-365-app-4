"use client";

import { useState, useEffect } from "react";
import { days } from "../data/days";

// Achievements data
const achievementsList = [
  { name: "Brass", streak: 30, message: "Congrats on a full month of reading the Bible!", color: "#B5A642" },
  { name: "Bronze", streak: 50, message: "50 days of dedication! Amazing!", color: "#CD7F32" },
  { name: "Silver", streak: 100, message: "100 days! Incredible consistency!", color: "#C0C0C0" },
  { name: "Gold", streak: 200, message: "200 days! Outstanding!", color: "#FFD700" },
  { name: "Platinum", streak: 365, message: "365 days! Legendary!", color: "#E5E4E2" },
];

export default function Page() {
  const [isClient, setIsClient] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [journal, setJournal] = useState("");
  const [completedDays, setCompletedDays] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showIntro, setShowIntro] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [jumpDay, setJumpDay] = useState("");
  const [profile, setProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // Ensure client-side rendering
  useEffect(() => setIsClient(true), []);

  // Load localStorage and initialize
  useEffect(() => {
    if (!isClient) return;

    // Bookmark
    const savedBookmark = localStorage.getItem("bookmarkedDay");
    if (savedBookmark) setCurrentDay(parseInt(savedBookmark));

    // Dark mode
    setDarkMode(JSON.parse(localStorage.getItem("darkMode")) || false);

    // Music volume
    setMusicVolume(parseFloat(localStorage.getItem("musicVolume")) || 0.5);

    // Profile
    const savedProfile = JSON.parse(localStorage.getItem("profile"));
    if (savedProfile) setProfile(savedProfile);

    // Streak
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

    // Intro
    if (!localStorage.getItem("introSeen")) setShowIntro(true);

    // Notifications
    if ("Notification" in window && Notification.permission !== "granted") Notification.requestPermission();
    const monthDay = `${new Date().getMonth() + 1}-${new Date().getDate()}`;
    const holidays = { "4-7": "Good Friday", "4-9": "Easter", "12-25": "Christmas" };
    if (holidays[monthDay]) new Notification("Religious Holiday Reminder", { body: `The Bible reminds us the true blessings of ${holidays[monthDay]}` });
    if (!localStorage.getItem(`journal-day-${currentDay}`)) new Notification("Daily Journal Reminder", { body: "Don't forget to complete today's Bible journal!" });
  }, [isClient]);

  const day = days.find((d) => d.day === currentDay);
  if (!day || !isClient) return null;

  // ------------------ Helpers ------------------
  const saveJournal = (value) => {
    setJournal(value);
    localStorage.setItem(`journal-day-${currentDay}`, value);
    const completed = days.filter((d) => localStorage.getItem(`journal-day-${d.day}`)).length;
    setCompletedDays(completed);
  };

  const changeDay = (newDay) => {
    if (newDay < 1 || newDay > 365) return;
    setCurrentDay(newDay);
    localStorage.setItem("bookmarkedDay", newDay);
    const savedJournal = localStorage.getItem(`journal-day-${newDay}`) || "";
    setJournal(savedJournal);
  };

  const nextDay = () => changeDay(currentDay + 1);
  const prevDay = () => changeDay(currentDay - 1);

  const handleContinueIntro = () => {
    localStorage.setItem("introSeen", "true");
    setShowIntro(false);
    const audio = document.getElementById("backgroundMusic");
    if (audio) {
      audio.volume = musicVolume;
      audio.play().catch((err) => console.log("Autoplay prevented", err));
    }
  };

  const clearCache = () => { localStorage.clear(); window.location.reload(); };

  const progressPercent = Math.round((completedDays / 365) * 100);

  // ------------------ Render ------------------
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: darkMode ? "#2B2B2B" : "#FBF7F2",
      color: darkMode ? "#EDEDED" : "#000",
      fontFamily: "Georgia, serif",
      padding: 24,
      transition: "all 0.5s ease"
    }}>
      <audio id="backgroundMusic" loop preload="auto" playsInline>
        <source src="/music/peaceful.mp3" type="audio/mpeg" />
      </audio>

      {/* Streak Intro */}
      {showIntro &&
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "#FBF7F2", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999
        }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: 48, color: "#6B3E26" }}>🔥 Your Current Streak 🔥</h1>
            <p style={{ fontSize: 36, color: "#8A6A52" }}>{streak} {streak === 1 ? "day" : "days"}</p>
            <button onClick={handleContinueIntro} style={{
              padding: "12px 24px", fontSize: 20, borderRadius: 10,
              border: "none", backgroundColor: "#6B3E26", color: "#FBF7F2", cursor: "pointer"
            }}>Continue</button>
          </div>
        </div>
      }

      {/* ------------------ Header ------------------ */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => changeDay(1)}>Home</button>
          <button onClick={() => setShowSettings(true)}>Settings</button>
        </div>
        <h1 style={{ color: "#6B3E26", margin: 0 }}>Bible in 365 Days</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setShowResources(true)}>Resources</button>
          <button onClick={() => setShowContact(true)}>Contact</button>
        </div>
      </header>

      {/* ------------------ Progress Bar ------------------ */}
      <div style={{ height: 20, width: "100%", background: "#DDD", borderRadius: 10, marginBottom: 20 }}>
        <div style={{ height: "100%", width: `${progressPercent}%`, background: "#6B3E26", borderRadius: 10 }}></div>
      </div>

      {/* ------------------ Calendar & Jump ------------------ */}
      <div style={{ marginBottom: 20 }}>
        <input type="number" placeholder="Day 1-365" value={jumpDay} onChange={(e) => setJumpDay(e.target.value)} style={{ width: 80, marginRight: 10 }} />
        <button onClick={() => { const d = parseInt(jumpDay); if (!isNaN(d)) changeDay(d); }}>Go</button>
        <button onClick={() => { setCurrentDay(1); localStorage.removeItem("bookmarkedDay"); }}>Clear Bookmark</button>
      </div>

      {/* ------------------ Daily Reading ------------------ */}
      <h2 style={{ fontSize: 26 }}>Day {day.day}</h2>

      <div style={{ marginBottom: 20 }}>
        <div style={{ background: darkMode ? "#4B4B4B" : "#FDEBD0", padding: 15, borderRadius: 10, marginBottom: 15 }}>
          <strong>Old Testament:</strong> <span style={{ fontWeight: "bold" }}>{day.oldTestament}</span>
        </div>

        <div style={{ background: darkMode ? "#4B4B4B" : "#FDEBD0", padding: 15, borderRadius: 10, marginBottom: 15 }}>
          <strong>New Testament:</strong> <span style={{ fontWeight: "bold" }}>{day.newTestament}</span>
        </div>

        <h3 style={{ fontSize: 22, color: "#6B3E26" }}>Reflection</h3>
        <p style={{ fontSize: 18, marginBottom: 15 }}>{day.reflection}</p>

        <h3 style={{ fontSize: 22, color: "#6B3E26" }}>Journaling Prompt</h3>
        <textarea value={journal} onChange={(e) => saveJournal(e.target.value)} style={{ width: "100%", minHeight: 80, fontSize: 16, padding: 8, borderRadius: 8, resize: "vertical" }} />
      </div>

      {/* ------------------ Navigation Buttons ------------------ */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <button onClick={prevDay} disabled={currentDay === 1}>Previous</button>
        <button onClick={nextDay} disabled={currentDay === 365}>Next</button>
      </div>

      {/* ------------------ Modals (Placeholder) ------------------ */}
      {/* Profile, Settings, Resources, Contact modals can be implemented as separate components */}
    </div>
  );
}
