"use client"
import { db } from "@/Firebase/firebaseconfiq";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {toast} from "react-toastify"

interface HabbitType {
  id: string,
  habbit: string,
  points: string
}

const ShowHabbit = () => {

  const [Habbit, setHabbit] = useState<HabbitType[]>([])
  const [status, setStatus] = useState(false)
  const [points,setpoints]=useState<number>(0)

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
    console.log(data)
    setHabbit(data)
  }

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
      console.log(data)
      setHabbit(data)
    }
    FetchHabbits()
  }, [status])

  const ChangeHabbit = (id: string, habbit: string) => {
    // alert(`The id${id} and habbit is ${habbit}`)
    const NewHabbits = Habbit.map((val) => {
      if (val.id == id) {
        return (
          { "id": id, "habbit": habbit, "points": val.points }
        )
      }
      return (val)
    })
    setHabbit(NewHabbits)

  }

  const ChangePoints = (id: string, points: string) => {

    const NewHabbits = Habbit.map((val) => {
      if (val.id == id) {
        return (
          { "id": id, "habbit": val.habbit, "points": points }
        )
      }
      return (val)
    })
    setHabbit(NewHabbits)
  }

  const saveHabbit = async () => {
    for (let index = 0; index < Habbit.length; index++) {
      const element = Habbit[index];
      const docRef = doc(db, "Habbit", element.id)
      try {
        await updateDoc(docRef, {
          "habbit": element.habbit,
          "points": element.points
        })
      }
      catch {
        await addDoc(collection(db, "Habbit"), {
          "id": element.id,
          "habbit": element.habbit,
          "points": element.points
        })
      }

    }
    toast.success("updated")
    setStatus(!status)
  }

  const AddHabbit = () => {
    const NewHabbit = [...Habbit]
    const id = Math.random().toString(36).substring(2, 10);
    NewHabbit.push({ "id": id, "habbit": "New Habbit!", "points": "0" })
    setHabbit(NewHabbit)
  }

  const StorePoints=async ()=>{

    const dataRef=collection(db,"Point")
    await addDoc(dataRef,{
      points:points,
      date:Date.now()
    })
    toast.success("Points Added")
  }

  const DeleteDocs=async (uid:string)=>{
    
    const docref=doc(db,"Habbit",uid)
    await deleteDoc(docref)
    toast.success("Habbit Deleted")
    FetchHabbits()
    // setHabbit(newHabbit)
    // saveHabbit()

    
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-500">
  
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-600">
          Habits
        </h2>
  
        <div className="bg-yellow-400 text-black px-5 py-2 rounded-lg font-bold border-2 border-blue-500">
          Points: {points}
        </div>
      </div>
  
      {/* Habits List */}
      <div className="space-y-4">
  
        {Habbit.map((val) => (
          <div
            key={val.id}
            className="flex text-black flex-col md:flex-row items-center gap-3 p-4 border-2 border-blue-500 rounded-xl"
          >
            {/* Habit Name */}
            <input
              className="flex-1 p-2 border-2 border-blue-400 rounded-lg focus:outline-none"
              value={val.habbit}
              onChange={(e) => ChangeHabbit(val.id, e.target.value)}
            />
  
            {/* Points */}
            <input
              type="number"
              className="w-24 p-2 border-2 border-yellow-400 rounded-lg focus:outline-none"
              value={val.points}
              onChange={(e) => ChangePoints(val.id, e.target.value)}
            />
  
            {/* Add */}
            <button
              onClick={() => setpoints(points + Number(val.points))}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Add
            </button>
  
            {/* Delete */}
            <button
              onClick={() => DeleteDocs(val.id)}
              className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold border-2 border-blue-500"
            >
              Delete
            </button>
          </div>
        ))}
  
      </div>
  
      {/* Actions */}
      <div className="flex flex-wrap gap-4 mt-6">
  
        <button
          onClick={AddHabbit}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold"
        >
          Add Habit
        </button>
  
        <button
          onClick={saveHabbit}
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold border-2 border-blue-500"
        >
          Save
        </button>
  
        <button
          onClick={StorePoints}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold"
        >
          Store Points
        </button>
  
      </div>
    </div>
  );
}

export default ShowHabbit