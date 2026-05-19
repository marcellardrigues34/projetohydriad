import Eletrica from '@/app/assets/eletrica.jpeg'
import Mecanica from "@/app/assets/mecanica.jpeg"
import Info from "@/app/assets/info.jpeg"
import Barco from '@/app/assets/barquinho.jpeg'
export default function App() {
  return (
    <div className="text-black text-xl w-full flex flex-col justify-center items-center gap-6 p-6">
      <h1 className="font-bold text-2xl">Somos o Projeto: HYDRIAD</h1>

      <p className="w-full text-center">
        O HYDRIAD é um dispositivo ecológico autônomo desenvolvido para monitoramento e recolhimento de
        resíduos sólidos inorgânicos (como plásticos e garrafas PET) em cursos de água correntes. Unindo tecnologia de ponta e sustentabilidade,
        o projeto foi projetado como um ecossistema multidisciplinar focado na preservação dos nossos rios.
      </p>

      <p className="w-full mt-2">Nosso dispositivo é dividido em três pilares fundamentais de engenharia:</p>

      <div className="w-full flex flex-col gap-8">

        {/* Pilar 1 - Mecânica */}
        <div>
          <p className="font-semibold mb-2">Engenharia Mecânica (Estrutura e Propulsão)</p>
          <div className="flex items-start gap-4">
            <img src={Mecanica.src} alt="Engenharia Mecânica" className="w-48 h-auto shrink-0 rounded" />
            <p>
              Desenvolvido com foco em estabilidade, flutuabilidade e eficiência de coleta, o HYDRIAD adota um design em formato de catamarã com "boca aberta",
              construído com tubulação de PVC selada. Essa geometria permite que o lixo flutuante seja direcionado diretamente para a área de captação.
              A propulsão e o recolhimento dos resíduos são feitos através de um sistema de rodas de pás,
              fabricadas via impressão 3D (PLA) e tratadas com blindagem química impermeabilizante e proteção UV para suportar o esforço mecânico e o clima tropical.
            </p>
          </div>
        </div>

        {/* Pilar 2 - Eletrônica */}
        <div>
          <p className="font-semibold mb-2">Engenharia Eletrônica (Sistemas Embarcados e Tração)</p>
          <div className="flex items-start gap-4">
            <img src={Eletrica.src} alt="Engenharia Eletrônica" className="w-48 h-auto shrink-0 rounded" />
            <p>
              O cérebro do barco é composto por microcontroladores de alta performance (como a linha ESP32), responsáveis pela comunicação sem fio e
              pelo controle dos motores DC. O foco do sistema eletroeletrônico está na tração e na dinâmica de rotação das rodas de pás,
              garantindo a força necessária para que os motores realizem tanto o deslocamento do catamarã quanto a captação mecânica dos resíduos na superfície da água.
              Para a monitorização visual, o sistema integra um módulo de câmera focado na transmissão de imagens em tempo real.
            </p>
          </div>
        </div>

        {/* Pilar 3 - Informática */}
        <div>
          <p className="font-semibold mb-2">Informática e Software (Interface e Dados)</p>
          <div className="flex items-start gap-4">
            <img src={Info.src} alt="Informática e Software" className="w-48 h-auto shrink-0 rounded" />
            <p>
              A operação do HYDRIAD conta com um sistema de controle web responsivo, permitindo a pilotagem e o monitoramento remoto através de smartphones ou computadores com baixíssima latência. Além do comando dos motores,
              o software processa os dados salvos e os transforma em um Dashboard de Análise Temporal. Através dessa interface profissional,
              é possível visualizar gráficos semanais e anuais de recolhimento e tendências históricas, transformando o impacto ambiental em dados estatísticos claros.
            </p>
          </div>
        </div>

        <div className="text-black text-xl w-full  gap-6 p-6 ">
             <h1 className="font-bold text-2xl flex flex-col justify-center items-center mb-6">
              Alguns dos nossos resultados
              </h1>
          <div className='flex items-start gap-12'>
            <img src={Barco.src} alt="" className='w-90 h-auto shrink-0 rounded mb-4 ' />
            <video className="w-108 rounded" controls>
              <source src="/barquinho2.mp4" type="video/mp4" />
           </video>
            <video className="w-108 rounded" controls>
              <source src="/site.mp4" type="video/mp4" />
           </video>
           </div>

        </div>
      </div>
    </div>
  );
}