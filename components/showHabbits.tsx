"use client"
import { db } from "@/Firebase/firebaseconfiq";
import { collection, getDoc, getDocs, query } from "firebase/firestore";
import { useEffect, useEffectEvent, useState } from "react";



const ShowHabbit = () => {

  const [Habbit, setHabbit] = useState([])
  useEffect(() => {
    const FetchHabbits = async () => {

      const snapshot = await getDocs(collection(db, "Habbit"));
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          habbit: d.habbit,
          points: d.points,
        };
      });
      alert("Habbit enters")
      alert(data.length)
      setHabbit(data)
    }
    FetchHabbits()
  }, [])

  const saveHabbit=(id:string)=>{


  }

  return (
    <div className="bg-white h-200 w-100 text-black">
      {Habbit.map((val, key) => (
        <div key={key} className="text-black">
          <input value={val.habbit}  />
          <input value={val.points} />
        </div>
      ))}
      <button onClick={saveHabbit}>Save</button>
    </div>
  )
}

export default ShowHabbit