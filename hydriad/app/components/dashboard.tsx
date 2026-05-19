"use client";
import { Battery, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toPng } from "html-to-image"; 
import jsPDF from "jspdf";

import { useEffect, useState } from "react";
import { ref, onValue, runTransaction } from "firebase/database";
import { getAuth } from "firebase/auth";
import { db } from "@/app/firebase/config";
import { FaToggleOn } from "react-icons/fa";
import { FaToggleOff } from "react-icons/fa";

const ORDEM_DIAS = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];
// adicionar//
export async function adicionarColeta(userId: string): Promise<void> {
  const hoje = new Date().toISOString().split("T")[0];

  const refColeta = ref(
    db,
    `usuarios/${userId}/dashboard/histórico/${hoje}`
  );

  await runTransaction(refColeta, (coletasPorDia: number | null) => {
    return (coletasPorDia || 0) + 1;
  });
}

type ColetasPorDia = {
  [data: string]: number;
};

export default function Dashboard() {
  const [dados, setDados] = useState<ColetasPorDia>({});

  // buscar//
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const dashboardRef = ref(
          db,
          `usuarios/${user.uid}/dashboard/histórico`
        );

        onValue(dashboardRef, (snapshot) => {
          if (snapshot.exists()) {
            setDados(snapshot.val());
          } else {
            setDados({});
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // coletas HOJE//
  const hoje = new Date().toISOString().split("T")[0];
  const coletasHoje = dados?.[hoje] ?? 0;

  // 📊 Labels e valores
  const labels = Object.keys(dados).sort();
   const dadosFormatados = ORDEM_DIAS
  .filter((dia) => dados[dia] !== undefined)
  .map((dia) => ({
    dia: dia.charAt(0).toUpperCase() + dia.slice(1),
    valor: dados[dia],
  }));
  

  //Crescimento//
  const ontem = labels[labels.length - 2];
  const hojeKey = labels[labels.length - 1];

  const crescimento =
    ontem && hojeKey && dados[ontem] > 0
      ? Math.round(
          ((dados[hojeKey] - dados[ontem]) / dados[ontem]) * 100
        )
      : 0;

  //EXPORTAR PDF//
  const exportarPDF = async (): Promise<void> => {
    const elemento = document.getElementById("dashboard");
    if (!elemento) return;

    const pdf = new jsPDF("p", "mm", "a4");

    const data = new Date().toLocaleDateString("pt-BR");

    pdf.setFontSize(22);
    pdf.text("RELATÓRIO DE COLETA", 105, 60, { align: "center" });

    pdf.setFontSize(14);
    pdf.text("Monitoramento de Resíduos Sólidos", 105, 80, { align: "center" });

    pdf.setFontSize(12);
    pdf.text(`Data: ${data}`, 105, 100, { align: "center" });

    pdf.addPage();

    const dataUrl = await toPng(elemento, {
      cacheBust: true,
      pixelRatio: 2,
    });

    pdf.addImage(dataUrl, "PNG", 0, 0, 210, 297);
    pdf.save("relatorio.pdf");
  };
   const [bateria, setBateria] = useState<boolean>(false);

   function toggleBateria(){
       setBateria(!bateria);
   }
  return (
    <div className="flex flex-col gap-4">
      {/* DASHBOARD */}
  
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Monitoramento</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 text-sm">Coleta Hoje</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <Trash2 className="text-green-600" size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">{coletasHoje} coletas</p>
        </div>

        <div className="bg-blue-200 rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 ">
            <h3 className="text-slate-500 text-sm">Bateria</h3>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Battery className="text-emerald-600" size={20} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">82%</p>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2 flex">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '82%' }}></div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap g-10">
            <div className={`${bateria ? "bg-green-500" : "bg-red-500"} p-6 rounded-xl w-[250px] flex flex-col gap-4 shadow-xl`}>
              <p className="text-2xl text-white font-semibold">Bateria</p>
              <button className="text-6xl text-white" onClick={toggleBateria}>
                {bateria ? <FaToggleOn /> : <FaToggleOff /> }
              </button>
              <p>{bateria ? 'Ligada': 'Desligada'}</p>
            </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-slate-500 text-sm mb-6">Histórico de Coleta Diária </h3>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosFormatados}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="valor" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
  }
  
