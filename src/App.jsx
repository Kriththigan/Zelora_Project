import { useState, useRef } from "react";

// Data 

const COLUMNS = [
  { id: "applying",  label: "Applying Period", color: "#f97316" },
  { id: "screening", label: "Screening",       color: "#8b5cf6" },
  { id: "interview", label: "Interview",       color: "#3b82f6" },
  { id: "test",      label: "Test",            color: "#10b981" },
];

const INITIAL_CANDIDATES = [
  { id: 1, name: "Marlon Reynolds", date: "29 Oct, 2023", score: 3.5, referred: true, stage: "applying", hasPhoto: true},
  { id: 2, name: "Regina Hane", date: "29 Oct, 2023", score: 2, referred: false, stage: "applying", hasPhoto: false},
  { id: 3, name: "Curtis Baumbach", date: "29 Oct, 2023", score: 3, referred: true, stage: "applying", hasPhoto: false},
  { id: 4, name: "Jaime Anderson", date: "29 Oct, 2023", score: null, referred: false, stage: "applying", hasPhoto: true},
  { id: 5, name: "Kristi Sipes", date: "20 Oct, 2023", score: 3.5, referred: false, stage: "screening", hasPhoto: true},
  { id: 6, name: "Randy Dibbert", date: "18 Oct, 2023", score: 3.5, referred: false, stage: "screening", hasPhoto: true},
  { id: 7, name: "Jane Anderson", date: "18 Oct, 2023", score: null, referred: false, stage: "screening", hasPhoto: false},
  { id: 8, name: "Shelia Doyle", date: "13 Oct, 2023", score: 4.5, referred: true, stage: "screening", hasPhoto: false},
  { id: 9, name: "Cassandra Hartmann", date: "18 Oct, 2023", score: null, referred: false, stage: "screening", hasPhoto: false},
  { id: 10, name: "Cameron Dickens", date: "03 Sep, 2023", score: 4, referred: false, stage: "interview", hasPhoto: true},
  { id: 11, name: "Merie Vandervort", date: "09 Sep, 2023", score: 4, referred: false, stage: "interview", hasPhoto: true},
  { id: 12, name: "Jasmine Wiza", date: "10 Sep, 2023", score: null, referred: false, stage: "interview", hasPhoto: true},
  { id: 13, name: "Lola Kirlin", date: "03 Sep, 2023", score: 4.5, referred: true, stage: "test", hasPhoto: true},
  { id: 14, name: "Virgil Larkin", date: "03 Sep, 2023", score: null, referred: false, stage: "test", hasPhoto: true},
];

const AVATAR_PALETTES = [
  { bg: "#dbeafe", color: "#1d4ed8"},
  { bg: "#fce7f3", color: "#be185d"},
  { bg: "#dcfce7", color: "#15803d"},
  { bg: "#fef9c3", color: "#854d0e"},
  { bg: "#ede9fe", color: "#6d28d9"},
  { bg: "#ffedd5", color: "#c2410c"},
  { bg: "#f0fdf4", color: "#065f46"},
  { bg: "#fdf2f8", color: "#86198f"},
];