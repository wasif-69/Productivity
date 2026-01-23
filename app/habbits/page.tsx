"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/Firebase/firebaseconfiq";
import { addDoc, collection, getDocs } from "firebase/firestore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function Page() {
  const [docs, setDocs] = useState<any[]>([]);
  const [points, setPoints] = useState(0);
  const [dark, setDark] = useState(false);

  const [total, setTotal] = useState({
    PointsTotal: 0,
    TotalDays: 0,
  });

  const habbitList = [
    { name: "Books", minimum: "2 Bussiness chapter and JTCOE ", points:15  },
    { name: "Admissions", minimum: "tri-star and us done and italy", points:20  },
    // { name: "BNA", minimum: "Practice on 1 compitition and leetcode 2 questions and team and physics  ", points:15  },
    { name: "Electronics", minimum: "Self Balancing Robot and Work " , points:20  },
    { name: "AI", minimum: "CS50 Lecture#5 full  and practice and Deeplearning computer practice", points:20  },
  { name:"A Level",minimun:" Trignometry complete and practice",points:25}
  ];

  const getDocsFireStore = async () => {
    const snapshot = await getDocs(collection(db, "Habbit"));

    let runningTotal = 0;
    let sum = 0;

    const data = snapshot.docs.map((doc) => {
      const d = doc.data();
      sum += d.points ?? 0;
      runningTotal += d.points ?? 0;

      return {
        id: doc.id,
        points: d.points,
        cumulative: runningTotal,
      };
    });

    setDocs(data);
    setTotal({
      PointsTotal: sum,
      TotalDays: data.length,
    });
  };

  useEffect(() => {
    getDocsFireStore();
  }, []);

  const storePoints = async () => {
    if (points === 0) return alert("Add points first!");

    await addDoc(collection(db, "Habbit"), {
      points,
      date: Date.now(),
    });

    setPoints(0);
    getDocsFireStore();
  };

  /* -------- Graph Data -------- */

  // Bar graph (daily points)
  const barData = {
    labels: docs.map((_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: "Daily Points",
        data: docs.map((d) => d.points),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  // Line graph (total points over days)
  const lineData = {
    labels: docs.map((_, i) => i + 1),
    datasets: [
      {
        label: "Total Points",
        data: docs.map((d) => d.cumulative),
        borderColor: "#22c55e",
        backgroundColor: "#22c55e",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <div>
              <h1 className="text-3xl font-bold">Habit Tracker</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Track habits. Build consistency.
              </p>
            </div>
            <button
              onClick={() => setDark(!dark)}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              {dark ? "☀ Light" : "🌙 Dark"}
            </button>
          </div>

          {/* Points */}
          <div className="bg-blue-600 text-white p-6 rounded-xl shadow flex justify-between items-center">
            <h2 className="text-xl font-semibold">Today’s Points</h2>
            <span className="text-4xl font-bold">{points}</span>
          </div>

          {/* Habits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {habbitList.map((h, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow"
              >
                <h3 className="text-xl font-semibold">{h.name}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {h.minimum}
                </p>
                <p className="font-bold text-blue-500 mt-2">
                  +{h.points} points
                </p>
                <button
                  onClick={() => setPoints(points + h.points)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Points
                </button>
              </div>
            ))}
          </div>

          {/* Store */}
          <button
            onClick={storePoints}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
          >
            Store Today
          </button>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Stat title="Total Points" value={total.PointsTotal} />
            <Stat title="Total Days" value={total.TotalDays} />
            <Stat
              title="Average"
              value={
                total.TotalDays
                  ? Math.round(total.PointsTotal / total.TotalDays)
                  : 0
              }
            />
          </div>

          {/* Graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">
                Daily Points
              </h2>
              <Bar data={barData} />
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">
                Total Points Over Days
              </h2>
              <Line data={lineData} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ---- Reusable Stat Card ---- */
function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <p className="text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
