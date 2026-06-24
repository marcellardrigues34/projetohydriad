"use client" 
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth';
import {auth} from '@/app/firebase/config'
import { FaArrowLeft } from "react-icons/fa";

export default function SignUp() {
    const [nome, setNome] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const router = useRouter();
    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
    const [erroSenha, setErroSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    
    function validarSenha(senha: string) {
    if (senha.length < 6) {
      return "Senha muito fraca (mínimo 6 caracteres)";
    }
     
    if (!/[A-Z]/.test(senha)) {
      return "Adicione pelo menos 1 letra maiúscula";
    }

    if (!/\d/.test(senha)) {
      return "Adicione pelo menos 1 número";
    }

    return "";
}
    const handleSignUp = async () => {
     const erro = validarSenha(senha);

  if (erro) {
    setErroSenha(erro);
    return; 
  }

  setErroSenha(""); 
    try{ 
        const res = await createUserWithEmailAndPassword(email, senha);
        console.log({res});

        sessionStorage.setItem('user', true as any);

        setEmail('');
        setSenha('');
        router.push('/');
    }catch (e){
        console.error(e);
      }
    }
    return(
    <div className="p-5 min-h-screen flex items-center justify-center bg-image">
           <div className="bg-blue-900/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-96">
           <FaArrowLeft className="mb-4 cursor-pointer " size={20} color="#000" onClick={()=>router.push('/')}/>
            <h1 className="text-white text-2xl mb-5">Cadastro</h1>

            
               {/* Input de Nome */}  
           <input
           type="nome"
           placeholder="Nome "
           className="w-full p-3 mb-4 bg-blue-300 rounded outline-none text-black placeholder-gray-500"
           onChange={(e)=>setNome(e.target.value)}
           value={nome}
           />
            {/* Input de Email */}  
           <input
           type="email"
           placeholder="Email"
           className="w-full p-3 mb-4 bg-blue-300 rounded outline-none text-black placeholder-gray-500"
           onChange={(e)=>setEmail(e.target.value)}
           value={email}
           />
            {/* Input de Senha */} 
            <div className="relative mb-4">
            <input
           type={mostrarSenha ? "text" : "password"}
           placeholder="Senha"
           className=" w-full p-3 mb-4 bg-blue-300 rounded outline-none text-black placeholder-gray-500"
           onChange={(e)=>setSenha(e.target.value)}
           value={senha}
           /> 
            <button
             type="button"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            className="absolute right-4 top-[40%] -translate-y-1/2 flex items-center jusfity-center text-black z-10 "
            >
             {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          </div>
           {erroSenha && (
            <p className="text-red-500 text-sm mb-2">{erroSenha}</p>
)}

           <button
            className="w-full p-3 bg-white rounded text-black cursor-pointer hover:bg-blue-200 transition"
            onClick={handleSignUp}
           >
            
            Cadastro-se
            
            </button>

            <div className="text-black text-md mt-5 text-center">
                <p>Já tem uma conta?</p>
                <p className="font-bold cursor-pointer" onClick={()=>router.push('/sign-in')}>Faça Login</p>
            </div>
           </div>
        </div>
    );
}
