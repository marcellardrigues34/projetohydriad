
"use client";

import { useState } from "react";
import { ref, set } from "firebase/database";
import { db } from "@/app/firebase/config";
import { getAuth } from "firebase/auth";


export default function Controle() {
  const auth = getAuth();
  const uid = auth.currentUser?.uid;

  const mover = async (direcao: string) => {
    await set(ref(db, `usuarios/${uid}/controle/direcao`), direcao);
  };

  const parar = async () => {
    await set(ref(db, `usuarios/${uid}/controle/direcao`), "parar");
  };
  return (
    <div className="min-h-screen bg-cover bg-center p-8">
      <h1 className="text-3xl font-bold text-black mb-6 text-center">
         Painel de Controle
      </h1>
    <div className="flex flex-col items-center gap-2">

      {/* Cima */}
      <button
        onPointerDown={() => mover("frente")}
        onPointerUp={parar}
        className="w-14 h-14 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white rounded-xl flex items-center justify-center shadow-md transition"
      >
        ↑
      </button>

      {/* Meio */}
      <div className="flex gap-2">
        <button
          onPointerDown={() => mover("esquerda")}
          onPointerUp={parar}
          className="w-14 h-14 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white rounded-xl flex items-center justify-center shadow-md transition"
        >
          ←
        </button>

        <button
          onPointerDown={() => mover("atrás")}
          onPointerUp={parar}
          className="w-14 h-14 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white rounded-xl flex items-center justify-center shadow-md transition"
        >
          ↓
        </button>

        <button
          onPointerDown={() => mover("direita")}
          onPointerUp={parar}
          className="w-14 h-14 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white rounded-xl flex items-center justify-center shadow-md transition"
        >
          →
        </button>
      </div>
    </div>
    </div>
  );
}