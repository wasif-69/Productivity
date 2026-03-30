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
    <div className="bg-white h-full w-full text-black">
      <div className="bg-amber-300 p-5 border-amber-600 border-2 font-bold" >Total Points: {points}</div>
      {Habbit.map((val, key) => (
        <div key={key} className="text-black w-1/6 bg-orange-400 flex gap-50 p-1 ">
          <input value={val.habbit} name={val.id} onChange={(e) => { ChangeHabbit(val.id, e.target.value) }} />
          <input value={val.points} name={val.id} onChange={(e) => { ChangePoints(val.id, e.target.value) }} />
          <button className="" onClick={()=>{setpoints(points+Number(val.points))}} >Add</button>
          <button onClick={()=>{DeleteDocs(val.id)}} >Delete</button>
        </div>
      ))}
      <button className="bg-amber-300 p-5 border-amber-600 border-2 font-bold" onClick={() => { AddHabbit() }}>Add Habbit</button>
      <button className="bg-amber-300 p-5 border-amber-600 border-2 font-bold" onClick={() => { saveHabbit() }}>Save</button>
      
      <button className="bg-amber-300 p-5 border-amber-600 border-2 font-bold" onClick={()=>{StorePoints()}} >Store Points</button>
    </div>
  )
}

export default ShowHabbit