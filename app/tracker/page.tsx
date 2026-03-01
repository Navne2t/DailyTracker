"use client";

import { useState, useEffect } from "react";


const habits = [
  "WakeUp",
  "DSA",
  "NoMast",
  "JavaOpps",
  "JavaBackend",
  "NoSweet",
  "CalorieDeficit",
  "Book",
];

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbysS8F2wWIXA6Pjjn62N5ooAwY6XlVN1oCoCOMTjFvpgQcdVfSqoe8N5So_Rgd8rS4KuQ/exec";

export default function Tracker() {
  const todayDate = new Date();
  const realYear = todayDate.getFullYear();
  const realMonth = todayDate.getMonth();
  const realDay = todayDate.getDate();

  const yesterdayDate = new Date(
  realYear,
  realMonth,
  realDay - 1
);

  const yYear = yesterdayDate.getFullYear();
  const yMonth = yesterdayDate.getMonth();
  const yDay = yesterdayDate.getDate();

  const [mounted, setMounted] = useState(false);
  const [selectedYear, setSelectedYear] = useState(realYear);
  const [selectedMonth, setSelectedMonth] = useState(realMonth);

  const [showScore, setShowScore] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [showStreaks, setShowStreaks] = useState(false);
  const [showIntelligence, setShowIntelligence] = useState(false);
  const [showMomentum, setShowMomentum] = useState(false);
  const [showTrend, setShowTrend] = useState(false);

  const isCurrentMonth =
    selectedYear === realYear && selectedMonth === realMonth;
  const daysInMonth = new Date(
    selectedYear,
    selectedMonth + 1,
    0
  ).getDate();

  const monthName = new Date(
    selectedYear,
    selectedMonth
  ).toLocaleString("default", { month: "long" });

  const storageKey = `${selectedYear}-${selectedMonth + 1}-habit-data`;

  const [data, setData] = useState<any>({});
  // ❤️ hearts per month
  const heartKey = `${selectedYear}-${selectedMonth + 1}-hearts`;
  const [hearts, setHearts] = useState(3);

  const [editedDays, setEditedDays] = useState<number[]>([]);

  const editKey =
    `${selectedYear}-${selectedMonth + 1}-edited-days`;

  

  // Load data
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      setData(JSON.parse(saved));
    } else {
      const initial: any = {};
      habits.forEach((habit) => {
        initial[habit] = {};
        for (let i = 1; i <= daysInMonth; i++) {
          initial[habit][i] = false;
        }
      });
      setData(initial);
    }
    // load hearts
  const savedHearts = localStorage.getItem(heartKey);

  if (savedHearts) {
    setHearts(Number(savedHearts));
  } else {
  setHearts(3);
  }
  const savedEdit = localStorage.getItem(editKey);

  if (savedEdit) {
    setEditedDays(JSON.parse(savedEdit));
  }
  }, [storageKey, daysInMonth, heartKey, editKey]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [data, mounted, storageKey]);
  // save hearts
  useEffect(() => {
  localStorage.setItem(heartKey, hearts.toString());
  }, [hearts, heartKey]);

  useEffect(() => {
    localStorage.setItem(
      editKey,
     JSON.stringify(editedDays)
   );
  }, [editedDays, editKey]);

  const toggle = async (habit: string, day: number) => {

  const isToday =
    selectedYear === realYear &&
    selectedMonth === realMonth &&
    day === realDay;

  const isYesterday =
    selectedYear === yYear &&
    selectedMonth === yMonth &&
    day === yDay;

  // block everything else first
  if (!isToday && !isYesterday) return;

  // yesterday needs heart
  if (isYesterday) {

  const alreadyEdited = editedDays.includes(day);

  // need heart only first time
  if (!alreadyEdited) {

    if (hearts <= 0) return;

    setHearts((h) => h - 1);

    setEditedDays((d) => [...d, day]);

  }

}

  const newValue = !data[habit][day];

  setData((prev: any) => ({
    ...prev,
    [habit]: {
      ...prev[habit],
      [day]: newValue,
    },
  }));
};

  const countCompleted = (habit: string) => {
    if (!data[habit]) return 0;
    const limit = isCurrentMonth ? realDay : daysInMonth;
    let count = 0;
    for (let i = 1; i <= limit; i++) {
      if (data[habit][i]) count++;
    }
    return count;
  };

  const getHabitPercentage = (habit: string) => {
    const completed = countCompleted(habit);
    const possible = isCurrentMonth ? realDay : daysInMonth;
    if (possible === 0) return 0;
    return Math.round((completed / possible) * 100);
  };
  const getMonthScore = (year: number, month: number) => {
  const key = `${year}-${month + 1}-habit-data`;
  const saved = localStorage.getItem(key);

  if (!saved) return 0;

  const parsed = JSON.parse(saved);
  const days = new Date(year, month + 1, 0).getDate();

  let completed = 0;
  let possible = days * habits.length;

  habits.forEach((habit) => {
    for (let i = 1; i <= days; i++) {
      if (parsed[habit]?.[i]) completed++;
    }
  });

  if (possible === 0) return 0;

  return Math.round((completed / possible) * 100);
};

  const getStreakData = (habit: string) => {
    if (!data[habit]) return { current: 0, longest: 0 };

    const limit = isCurrentMonth ? realDay : daysInMonth;
    let current = 0;
    let longest = 0;
    let temp = 0;

    for (let i = 1; i <= limit; i++) {
      if (data[habit][i]) {
        temp++;
        longest = Math.max(longest, temp);
      } else {
        temp = 0;
      }
    }

    for (let i = limit; i >= 1; i--) {
      if (data[habit][i]) current++;
      else break;
    }

    return { current, longest };
  };
  const getMomentumData = () => {
  const atRisk: string[] = [];
  const highMomentum: string[] = [];

  habits.forEach((habit) => {
    const streak = getStreakData(habit);

    if (streak.current >= 3) {
      highMomentum.push(habit);
    }

    if (streak.current === 0 && streak.longest >= 3) {
      atRisk.push(habit);
    }
  });

  return { atRisk, highMomentum };
};

  const totalCompleted = habits.reduce(
    (sum, habit) => sum + countCompleted(habit),
    0
  );

  const totalPossible =
    (isCurrentMonth ? realDay : daysInMonth) * habits.length;  
  
  const disciplineScore =
  totalPossible === 0
    ? 0
    : Math.round((totalCompleted / totalPossible) * 100);

const getHeartMessage = () => {
  if (hearts === 3)
    return "3 hearts available — You can fix 3 past days!";

  if (hearts === 2)
    return "2 hearts left — 2 past-day edits allowed!";

  if (hearts === 1)
    return "1 heart left — Only one correction left!";

  return "No hearts left — Cannot edit past days.";
};

  const goPrev = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const goNext = () => {
    if (
      selectedYear > realYear ||
      (selectedYear === realYear && selectedMonth >= realMonth)
    )
      return;

    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">
        🔥 Habit Heatmap
      </h1>

      {/* Month Navigation + Hearts */}
      <div className="flex items-center gap-4 mb-6">

  <button
    onClick={goPrev}
    className="px-3 py-1 bg-gray-700 rounded"
  >
    ←
  </button>

  <h2 className="text-lg text-gray-300">
    {monthName} {selectedYear}
  </h2>

  <button
    onClick={goNext}
    className="px-3 py-1 bg-gray-700 rounded"
  >
    →
  </button>

  {/* ❤️ Hearts right beside toggle */}
  <div className="relative group ml-4">

  <div className="flex gap-1 text-xl">
    {[1, 2, 3].map((i) => (
      <span key={i}>
        {i <= hearts ? "❤️" : "🩶"}
      </span>
    ))}
  </div>

  {/* Tooltip */}
  <div className="absolute left-full ml-2 bottom-0 hidden group-hover:block
  bg-gray-800 text-white text-xs px-3 py-2 rounded shadow-lg w-52 z-50">

    ❤️ Hearts = Past edit tokens  
    <br />
    {getHeartMessage()}

  </div>

</div>

      </div>

      {/* Heatmap */}
      <div
        className="grid overflow-x-auto"
        style={{
          gridTemplateColumns: `220px repeat(${daysInMonth}, 32px)`,
        }}
      >
        <div className="font-bold">Habit</div>

        {[...Array(daysInMonth)].map((_, i) => (
          <div key={i} className="text-xs text-gray-500 text-center">
            {i + 1}
          </div>
        ))}

        {habits.map((habit) => (
          <div key={habit} className="contents">
            <div className="py-2">
              {habit} ({countCompleted(habit)}/
              {isCurrentMonth ? realDay : daysInMonth})
            </div>

            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const completed = data[habit]?.[day];
              const isToday =
                              selectedYear === realYear &&
                              selectedMonth === realMonth &&
                              day === realDay;

              const isYesterday =
                              selectedYear === yYear &&
                              selectedMonth === yMonth &&
                              day === yDay;

              const alreadyEdited =
                              editedDays.includes(day);

              const clickable =
                              isToday ||
                              (isYesterday && (hearts > 0 || alreadyEdited));
 

              return (
                <div
                  key={`${habit}-${day}`}
                  onClick={() => clickable && toggle(habit, day)}
                  className={`w-6 h-6 m-1 rounded
                            ${
                              completed
                              ? "bg-green-500"
                              : clickable
                              ? "bg-gray-600 cursor-pointer"
                              : "bg-gray-800 opacity-40"
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>

        {/* Analytics Cards Grid */}
        {/* ================= ANALYTICS CARDS GRID ================= */}
<div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

  {/* ================= Discipline Score ================= */}
  <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
    <div
      className="cursor-pointer flex justify-between items-center"
      onClick={() => setShowScore(!showScore)}
    >
      <h3 className="text-lg font-semibold">📊 Discipline Score</h3>
      <span>{showScore ? "▲" : "▼"}</span>
    </div>

    {/* Always visible summary */}
    <div className="mt-4 text-center">
      <div className="text-4xl font-extrabold text-indigo-400">
        {disciplineScore}%
      </div>
      <p className="text-xs text-gray-400 mt-2">
        {disciplineScore >= 75
          ? "Excellent consistency"
          : disciplineScore >= 50
          ? "Good progress"
          : "Needs improvement"}
      </p>
    </div>

    {showScore && (
      <div className="mt-6 text-sm text-gray-300 border-t border-gray-700 pt-4">
        You completed {totalCompleted} out of {totalPossible} total habit
        actions this month.
      </div>
    )}
  </div>

  {/* ================= Habit Performance ================= */}
  <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
    <div
      className="cursor-pointer flex justify-between items-center"
      onClick={() => setShowPerformance(!showPerformance)}
    >
      <h3 className="text-lg font-semibold">📈 Habit Performance</h3>
      <span>{showPerformance ? "▲" : "▼"}</span>
    </div>

    {/* Always visible summary */}
    {(() => {
      const sorted = [...habits].sort(
        (a, b) => getHabitPercentage(b) - getHabitPercentage(a)
      );

      const best = sorted[0];
      const worst = sorted[sorted.length - 1];

      return (
        <div className="mt-4 text-sm text-gray-300">
          <div>
            🏆 Best:{" "}
            <span className="text-green-400 font-semibold">
              {best} ({getHabitPercentage(best)}%)
            </span>
          </div>
          <div className="mt-2">
            ⚠ Weakest:{" "}
            <span className="text-red-400 font-semibold">
              {worst} ({getHabitPercentage(worst)}%)
            </span>
          </div>
        </div>
      );
    })()}

    {showPerformance && (
      <div className="mt-6 space-y-4 border-t border-gray-700 pt-4">
        {habits.map((habit) => {
          const percent = getHabitPercentage(habit);
          return (
            <div key={habit}>
              <div className="flex justify-between text-sm mb-1">
                <span>{habit}</span>
                <span>{percent}%</span>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded-full">
                <div
                  className="h-2 bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>

  {/* ================= Streak Analysis ================= */}
  <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
    <div
      className="cursor-pointer flex justify-between items-center"
      onClick={() => setShowStreaks(!showStreaks)}
    >
      <h3 className="text-lg font-semibold">🔥 Streak Analysis</h3>
      <span>{showStreaks ? "▲" : "▼"}</span>
    </div>

    {/* Always visible summary */}
    {(() => {
      let longestOverall = 0;
      let bestHabit = "";

      habits.forEach((habit) => {
        const streak = getStreakData(habit);
        if (streak.longest > longestOverall) {
          longestOverall = streak.longest;
          bestHabit = habit;
        }
      });

      return (
        <div className="mt-4 text-sm text-gray-300">
          🔥 Longest Streak:{" "}
          <span className="text-indigo-400 font-semibold">
            {bestHabit} ({longestOverall} days)
          </span>
        </div>
      );
    })()}

    {showStreaks && (
      <div className="mt-6 space-y-3 border-t border-gray-700 pt-4">
        {habits.map((habit) => {
          const streak = getStreakData(habit);
          return (
            <div
              key={habit}
              className="bg-gray-700 rounded-lg p-3 text-sm flex justify-between"
            >
              <span>{habit}</span>
              <div className="text-right">
                <div>Current: {streak.current}</div>
                <div>Longest: {streak.longest}</div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>

  {/* ================= Level 4 – Habit Intelligence ================= */}
  <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
    <div
      className="cursor-pointer flex justify-between items-center"
      onClick={() => setShowIntelligence(!showIntelligence)}
    >
      <h3 className="text-lg font-semibold">🧠 Habit Intelligence</h3>
      <span>{showIntelligence ? "▲" : "▼"}</span>
    </div>

    {(() => {
      const sorted = [...habits].sort(
        (a, b) => getHabitPercentage(a) - getHabitPercentage(b)
      );

      const weakest = sorted[0];
      const weakestPercent = getHabitPercentage(weakest);

      let disciplineType = "";
      if (disciplineScore >= 80) disciplineType = "Elite Discipline";
      else if (disciplineScore >= 60) disciplineType = "Strong Builder";
      else if (disciplineScore >= 40)
        disciplineType = "Inconsistent Performer";
      else disciplineType = "Struggling Phase";

      return (
        <div className="mt-4 text-sm text-gray-300 space-y-2">
          <div>
            🎯 Focus Habit:{" "}
            <span className="text-red-400 font-semibold">
              {weakest} ({weakestPercent}%)
            </span>
          </div>
          <div>
            🧭 Discipline Type:{" "}
            <span className="text-indigo-400 font-semibold">
              {disciplineType}
            </span>
          </div>
        </div>
      );
    })()}

    {showIntelligence && (
      <div className="mt-6 border-t border-gray-700 pt-4 text-sm text-gray-300 space-y-3">
        <p>
          Improving your weakest habit will have the biggest impact on
          your overall discipline score.
        </p>
        <p>
          Focus on consistency rather than perfection. Small daily wins
          compound over time.
        </p>
      </div>
    )}
  </div>
  {/* ================= Level 5 – Momentum & Risk ================= */}
  <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
  <div
    className="cursor-pointer flex justify-between items-center"
    onClick={() => setShowMomentum(!showMomentum)}
  >
    <h3 className="text-lg font-semibold">
      📊 Momentum & Risk
    </h3>
    <span>{showMomentum ? "▲" : "▼"}</span>
  </div>

  {(() => {
    const { atRisk, highMomentum } = getMomentumData();

    return (
      <div className="mt-4 text-sm text-gray-300 space-y-2">
        <div>
          🔥 High Momentum:{" "}
          <span className="text-green-400 font-semibold">
            {highMomentum.length}
          </span>
        </div>
        <div>
          ⚠ At Risk:{" "}
          <span className="text-red-400 font-semibold">
            {atRisk.length}
          </span>
        </div>
      </div>
    );
  })()}

  {showMomentum && (
    <div className="mt-6 border-t border-gray-700 pt-4 space-y-4 text-sm text-gray-300">
      {(() => {
        const { atRisk, highMomentum } = getMomentumData();

        return (
          <>
            {/* High Momentum */}
            <div>
              <h4 className="text-green-400 font-semibold mb-2">
                🔥 Building Momentum
              </h4>
              {highMomentum.length === 0 ? (
                <p className="text-gray-400">None yet</p>
              ) : (
                highMomentum.map((h) => (
                  <p key={h}>{h}</p>
                ))
              )}
            </div>

            {/* At Risk */}
            <div>
              <h4 className="text-red-400 font-semibold mb-2">
                ⚠ Streak At Risk
              </h4>
              {atRisk.length === 0 ? (
                <p className="text-gray-400">No habits at risk</p>
              ) : (
                atRisk.map((h) => (
                  <p key={h}>{h}</p>
                ))
              )}
            </div>
          </>
        );
      })()}
    </div>
  )}
  </div>
{/* ================= Level 6 – Monthly Growth ================= */}
  <div className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
  <div
    className="cursor-pointer flex justify-between items-center"
    onClick={() => setShowTrend(!showTrend)}
  >
    <h3 className="text-lg font-semibold">
      📈 Monthly Growth Trend
    </h3>
    <span>{showTrend ? "▲" : "▼"}</span>
  </div>

  {(() => {
    let prevYear = selectedYear;
    let prevMonth = selectedMonth - 1;

    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear -= 1;
    }

    const currentScore = disciplineScore;
    const previousScore = getMonthScore(prevYear, prevMonth);
    const diff = currentScore - previousScore;

    return (
      <div className="mt-4 text-sm text-gray-300 space-y-2">
        <div>
          This Month:{" "}
          <span className="text-indigo-400 font-semibold">
            {currentScore}%
          </span>
        </div>

        <div>
          Last Month:{" "}
          <span className="text-gray-400 font-semibold">
            {previousScore}%
          </span>
        </div>

        <div>
          Change:{" "}
          <span
            className={`font-semibold ${
              diff >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {diff >= 0 ? "↑" : "↓"} {Math.abs(diff)}%
          </span>
        </div>
      </div>
    );
  })()}

  {showTrend && (
    <div className="mt-6 border-t border-gray-700 pt-4 text-sm text-gray-300">
      {disciplineScore >= 80
        ? "You are operating at elite discipline level."
        : disciplineScore >= 60
        ? "You are steadily improving."
        : disciplineScore >= 40
        ? "Consistency needs strengthening."
        : "Focus on building one small habit first."}
    </div>
  )}
  </div>
</div>

    </div>
  );
}