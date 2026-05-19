
"use client";

import { useEffect, useState, useCallback } from "react";

const ESP32_IP = "http://192.168.4.1";

const keyMap: Record<string, string> = {
  ArrowUp: "F",
  ArrowDown: "B",
  ArrowLeft: "L",
  ArrowRight: "R",
  " ": "S",
};

const labels: Record<string, string> = {
  F: "Avançando",
  B: "Ré",
  L: "Virando esquerda",
  R: "Virando direita",
  S: "Parado",
};

export default function BoatController() {
  const [currentCmd, setCurrentCmd] = useState<string | null>(null);
  const [status, setStatus] = useState<{ ok: boolean | null; text: string }>({
    ok: null,
    text: "Conecte-se à rede ESP32_CAR primeiro",
  });

  const sendCmd = useCallback((cmd: string) => {
    fetch(`${ESP32_IP}/${cmd}`)
      .then((r) => {
        if (r.ok) setStatus({ ok: true, text: labels[cmd] || cmd });
      })
      .catch(() =>
        setStatus({ ok: false, text: "Sem conexão — conecte-se à rede ESP32_CAR" })
      );
  }, []);

  const press = useCallback(
    (cmd: string) => {
      setCurrentCmd((prev) => {
        if (prev === cmd) return prev;
        return cmd;
      });
      sendCmd(cmd);
    },
    [sendCmd]
  );

  const release = useCallback(() => {
    setCurrentCmd(null);
    sendCmd("S");
  }, [sendCmd]);

  // Teclado
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const cmd = keyMap[e.key];
      if (!cmd) return;
      e.preventDefault();
      press(cmd);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (!keyMap[e.key]) return;
      release();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [press, release]);

  function btnClass(cmd: string) {
    const isActive = currentCmd === cmd;
    const isStop = cmd === "S";
    return [
      "w-[72px] h-[72px] bg-gray-800 border-2 rounded-xl flex items-center justify-center transition-all duration-75 select-none cursor-pointer",
      isActive
        ? `scale-95 bg-gray-700 ${isStop ? "border-red-500" : "border-blue-500"}`
        : "border-gray-700",
    ].join(" ");
  }

  return (
    <div className=" min-h-screen flex flex-col items-center justify-center gap-6 text-white">
      <div className="w-full max-w-2xl bg-black rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
    <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Câmera Ao Vivo
        </h3>
    </div>
    
    <div className="relative w-full aspect-video bg-neutral-900 flex items-center justify-center">
      <img src="http://172.18.185.71:81/stream" alt="Stream da ESP32-CAM"  className="w-full h-full object-contain block" />
     </div>
    </div>
      
      {/* Status */}
      <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2">
        <span
          className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
            status.ok === null
              ? "bg-gray-600"
              : status.ok
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        />
        <span
          className={`text-xs ${
            status.ok === null
              ? "text-gray-400"
              : status.ok
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {status.text}
        </span>
      </div>

      {/* D-Pad */}
      <div className="grid grid-cols-3 gap-3">
        {/* Linha 1 */}
        <div />
        <button
          className={btnClass("F")}
          onMouseDown={() => press("F")}
          onMouseUp={release}
          onMouseLeave={release}
          onTouchStart={(e) => { e.preventDefault(); press("F"); }}
          onTouchEnd={release}
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-gray-400 pointer-events-none">
            <path d="M12 4l8 8H4z" />
          </svg>
        </button>
        <div />

        {/* Linha 2 */}
        <button
          className={btnClass("L")}
          onMouseDown={() => press("L")}
          onMouseUp={release}
          onMouseLeave={release}
          onTouchStart={(e) => { e.preventDefault(); press("L"); }}
          onTouchEnd={release}
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-gray-400 pointer-events-none">
            <path d="M4 12l8-8v16z" />
          </svg>
        </button>

        <button
          className={btnClass("S")}
          onMouseDown={() => press("S")}
          onMouseUp={release}
          onMouseLeave={release}
          onTouchStart={(e) => { e.preventDefault(); press("S"); }}
          onTouchEnd={release}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-gray-400 pointer-events-none">
            <rect x="5" y="5" width="14" height="14" rx="2" />
          </svg>
        </button>

        <button
          className={btnClass("R")}
          onMouseDown={() => press("R")}
          onMouseUp={release}
          onMouseLeave={release}
          onTouchStart={(e) => { e.preventDefault(); press("R"); }}
          onTouchEnd={release}
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-gray-400 pointer-events-none">
            <path d="M20 12l-8 8V4z" />
          </svg>
        </button>

        {/* Linha 3 */}
        <div />
        <button
          className={btnClass("B")}
          onMouseDown={() => press("B")}
          onMouseUp={release}
          onMouseLeave={release}
          onTouchStart={(e) => { e.preventDefault(); press("B"); }}
          onTouchEnd={release}
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-gray-400 pointer-events-none">
            <path d="M12 20l-8-8h16z" />
          </svg>
        </button>
        <div />
      </div>

      <p className="text-xs text-gray-500">
        Setas do teclado para mover &nbsp;·&nbsp;
        <kbd className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">Espaço</kbd> para parar
      </p>
    </div>
  );
}