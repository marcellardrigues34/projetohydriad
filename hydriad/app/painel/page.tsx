"use client"
import { FaUser } from "react-icons/fa";
import LogoEmpresa from "@/app/assets/loguinho.png.png";
import {signOut} from 'firebase/auth';
import { auth } from "@/app/firebase/config"; 
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FaProjectDiagram } from "react-icons/fa";
import { HiMiniChartBarSquare } from "react-icons/hi2";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";

import Sobre from "../components/sobre";
import Dashboard from "../components/dashboard";
import Controle from "../components/controle";


import { useAuthState } from "react-firebase-hooks/auth";
import { getDatabase, ref, get } from "firebase/database";

export default function Painel(){
  const router = useRouter();
  const [opcaoMenu, setOpcaOMenu] = useState<string>('Sobre');

  const [user, loading ] = useAuthState(auth);
  const [nome, setNome]  = useState<string>("");
  const [checked, setChecked ] = useState<boolean>(false);


   useEffect(()=>{
    if(!loading){
      const userSession = sessionStorage.getItem('user')

      if(!user && !userSession){
          router.push('/')
      }else{
        setChecked(true)
        if(user){
           const db = getDatabase();
           const perfilRef = ref(db, `usuarios/${user.uid}/perfil`);
           get(perfilRef).then(snapshot =>{
            if(snapshot.exists()){
              const perfil = snapshot.val()
              setNome(perfil.nome );
            }
           })
        }
      }
    }
   },[user, loading, router])
  if(!checked){
      return(
        <p>Carregando...</p>
      );

  }
  return(
   <main className="w-screen min-h-screen flex text-white">
    <div className="bg-image w-[20%] px-10 py-20 flex flex-col items-center justify-between ">
     <div>
     <img className="w-[80%] mb-10" src={LogoEmpresa.src} alt="" />
            {/* OPÇÕES PAINEL */}
        <ul className="w-full">
        <li className={opcaoMenu == 'Sobre' ? " cursor-pointer text-xl text-black p-4 flex gap-4 border-r-blue-500 bg-blue-400 border-r-10 ml-10 items-center rounded hover:bg-blue-300 hover:transition-all hover:duration-600 hover-ml-10 " : "text-xl text-black p-4 flex gap-4 items-center rounded hover:bg-blue-500 hover:transition-all hover:duration-600 "} onClick={()=>setOpcaOMenu('Sobre')}> <FaProjectDiagram /> Sobre</li>
        <li className={opcaoMenu == 'Dashboard' ? "cursor-pointer text-xl text-black p-4 flex gap-4 border-r-blue-500 bg-blue-400 border-r-10 ml-10 items-center rounded hover:bg-blue-300 hover:transition-all hover:duration-600 hover-ml-10 " : "text-xl text-black p-4 flex gap-4 items-center rounded hover:bg-blue-500 hover:transition-all hover:duration-600 "} onClick={()=>setOpcaOMenu('Dashboard')}><HiMiniChartBarSquare  /> Dashboard</li>
        <li className={opcaoMenu == 'Controle' ? "cursor-pointer text-xl text-black p-4 flex gap-4 border-r-blue-500 bg-blue-400 border-r-10 ml-10 items-center rounded hover:bg-blue-300 hover:transition-all hover:duration-600 hover-ml-10 " : "text-xl text-black p-4 flex gap-4 items-center rounded hover:bg-blue-500 hover:transition-all hover:duration-600 "} onClick={()=>setOpcaOMenu('Controle')}> <HiAdjustmentsHorizontal   /> Controle</li>
       
        </ul>
     </div>
     {/* Substitua o button "Sair" por isso */}
    <div className="w-full text-center">
  <p className="text-black text-sm mb-3">{user?.email}</p>
  <hr className="border-white/20 mb-3" />
  <button 
    onClick={() => {
      signOut(auth)
      sessionStorage.removeItem('user')
      router.push('/')
    }}
    className="w-full p-4 bg-red-600 rounded-full text-white font-bold hover:bg-red-500 transition-all"
  >
    Sair
  </button>
</div>
    </div>

    <div className="w-[80%] bg-gray-200 p-10 " color="">
      <div className="text-black h-20 p-10 flex justify-end items-center gap-4">
        <p className="flex items-center justify-center text-xl gap-2 bg-white shadow-xl p-4 rounded-lg -mt-20">{nome ? nome : "Usuário"}<FaUser size={30}/></p>
      </div>
    <div>
       {/*## COMPONENTES PAINEL  */} 

    </div>
       {opcaoMenu == 'Sobre' && (
       <Sobre/>
       )}
 
          {opcaoMenu == 'Dashboard' && (
        <Dashboard/>
       )}

       {opcaoMenu == 'Controle' && (
        <Controle/>
       )}
    </div>

  </main >
  );

}