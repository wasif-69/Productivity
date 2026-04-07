"use client";
import ShowHabbit from "@/components/showHabbits";
import Image from "next/image";
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
import { query, orderBy } from "firebase/firestore";
import { Stats } from "fs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function Home() {

  const [docs, setDocs] = useState<any[]>([]);
    const [points, setPoints] = useState(0);
    const [dark, setDark] = useState(false);
  
    const [total, setTotal] = useState({
      PointsTotal: 0,
      TotalDays: 0,
    });
  

    const centuries = React.useMemo(() => {
      return docs.filter(d => d.points >= 100).length;
    }, [docs]);
  
  
  
  
    const getDocsFireStore = async () => {
      const snapshot = await getDocs(
        query(collection(db, "Point"), orderBy("date", "asc"))
      );
  
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
      <div className="min-h-screen bg-white p-6">
    
        {/* Header */}
        <div className="mb-8 border-b-4 border-blue-500 pb-4">
          <h1 className="text-4xl font-extrabold text-blue-600">
            Habit Dashboard
          </h1>
          <p className="text-gray-600">
            Track your progress and stay consistent
          </p>
        </div>
    
        <div className="space-y-10">
    
          <ShowHabbit />
    
          {/* 🔥 Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    
            <div className="bg-blue-500 text-white p-6 rounded-xl shadow border-2 border-blue-500">
              <p>Total Points</p>
              <h2 className="text-4xl font-bold">{total.PointsTotal}</h2>
            </div>
    
            <div className="bg-yellow-400 text-black p-6 rounded-xl shadow border-2 border-blue-500">
              <p>Total Days</p>
              <h2 className="text-4xl font-bold">{total.TotalDays}</h2>
            </div>
    
            <div className="bg-blue-500 text-white p-6 rounded-xl shadow border-2 border-blue-500">
              <p>Average</p>
              <h2 className="text-4xl font-bold">
                {total.TotalDays
                  ? Math.round(total.PointsTotal / total.TotalDays)
                  : 0}
              </h2>
            </div>
    
          </div>
    
          {/* 📊 Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    
            <div className="bg-white p-6 rounded-xl shadow border-2 border-blue-500">
              <h2 className="text-xl font-bold mb-4 text-blue-600">
                Daily Points
              </h2>
              <Bar data={barData} />
            </div>
    
            <div className="bg-white p-6 rounded-xl shadow border-2 border-blue-500">
              <h2 className="text-xl font-bold mb-4 text-blue-600">
                Total Growth
              </h2>
              <Line data={lineData} />
            </div>
    
          </div>
    
          {/* 💯 Centuries */}
          <div className="bg-yellow-400 text-black p-10 rounded-xl shadow border-4 border-blue-500 text-center">
    
            <h2 className="text-3xl font-bold mb-3">
              Centuries
            </h2>
    
            <p className="text-7xl font-extrabold">
              {centuries}
            </p>
    
            <p className="mt-3 text-lg">
              Days with 100+ points
            </p>
    
          </div>
    
        </div>
      </div>
    );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
      <p className="text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
