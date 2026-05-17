
"use client"
import { Eye, EyeOff } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {auth} from '@/app/firebase/config'
import { useSignInWithEmailAndPassword} from "react-firebase-hooks/auth";

export default function SignIn(){
const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [
      signInWithEmailAndPassword,
      user,
      loading,
      error

    ] = useSignInWithEmailAndPassword(auth);

    const handleSignIn = async () => {
         try{
            console.log(email,senha);
            const res = await signInWithEmailAndPassword(email, senha);

            if(res?.user){
              console.log("Usuário Logado: ", res.user)
              sessionStorage.setItem(`user`, `true`);
              setEmail('');
              setSenha('');
              router.push('/painel');

            }

         }catch(e){
            alert('Login não efetuado')
            console.error(e);

         }
    }

    return(
 <div className="p-5 min-h-screen flex items-center justify-center bg-image">
    <div className="bg-blue-900 p-10 rounded-lg shadow-xl w-96">
          <FaArrowLeft color="#000" size={20} className="mb-4 cursor-pointer" onClick={()=>router.push('/')}  />
         <h1 className="text-white text-2xl mb-5">Login</h1>
         
      <input
      required
      type="email"
      placeholder="Email"
      className="w-full p-3 mb-4 bg-blue-300 rounded outline-none text-black placeholder-gray-500"
      onChange={(e)=>setEmail(e.target.value)}
      value={email}

      />
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

      <button className="w-full p-3 bg-white rounded text-black hover:bg-blue-200"
        onClick={handleSignIn}
      >
  
          Login
          
   </button>
   <div className="text-white text-md mt-5 text-center">
     <p>Primeiro acesso?</p>
     <p className="font-bold cursor-pointer" onClick={()=>router.push('/sign-up')}>Cadastre-se</p>
      
   
       </div>
    </div>
 </div>
    );
}