"use client"

import { useState } from 'react';
import Image from 'next/image';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, message } from 'antd';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '@/app/firebase/config';
import Logo from '@/app/assets/loguinho.png.png'
import { signIn, signOut, useSession } from "next-auth/react";

type FieldType = {
  nome: string;
  email: string;
  password: string;
};

export default function Home() {
  const [isModalSignInOpen, setIsModalSignInOpen] = useState<boolean>(false);
  const [isModalSignUpOpen, setIsModalSignUpOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (values: FieldType) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      sessionStorage.setItem('user', userCredential.user.uid);
      message.success("Login efetuado com sucesso!");
      router.push('/painel');
    } catch (error) {
      console.error(error);
      message.error("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (values: FieldType) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await set(ref(db, 'usuarios/' + userCredential.user.uid + '/perfil'), { nome: values.nome });
      sessionStorage.setItem('user', userCredential.user.uid);
      message.success("Cadastro efetuado com sucesso!");
      router.push('/painel');
    } catch (error) {
      console.error(error);
      message.error("Erro ao fazer o cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
    const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/painel" });
  };
  
  return (
    <div className='w-screen h-screen flex items-center justify-center bg-image'>
      <div className='flex flex-col md:flex-row w-[90%] md:w-2/3 lg:w-1/2 items-center justify-center gap-12 md:gap-0 pb-10 md:pb-20 bg-white/10 md:bg-transparent p-8 md:p-0 rounded-3xl backdrop-blur-sm md:backdrop-blur-none shadow-lg md:shadow-none'>
        <div className='w-full flex flex-col justify-center items-center'>
           <img src={Logo.src} alt="" className='w-64' />
        </div>
      <div className='w-full flex flex-col justify-center items-center gap-4'>
          <button 
            onClick={() => setIsModalSignInOpen(true)}
            className='w-56 p-3 bg-blue-400 rounded text-white hover:bg-blue-400 hover:bg-blue-500 hover:text-white rounded-lg cursor-pointer'>
            Entre
          </button>

          <button
            onClick={handleGoogleLogin}
            className='w-56 p-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-center gap-2'>
            <img src="/google.png" alt="Google" width={18} />
            Entrar com Google
          </button>
          <p className='text-black md:text-slate-500'>Não tem uma conta? <button onClick={() => setIsModalSignUpOpen(true)} className='text-black md:text-blue-600 hover:text-blue-300 hover:underline cursor-pointer'>Cadastre-se</button></p>
        </div>

        {/* Sign In Modal */}
        <Modal
          title="Entrar"
          open={isModalSignInOpen}
          footer={false}
          onCancel={() => setIsModalSignInOpen(false)}
          centered
        >
          <div className='w-full flex justify-center items-center pt-6'>
            <Form
              name="login"
              className="w-full px-4 md:px-0"
              initialValues={{ remember: true }}
              onFinish={handleLogin}
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'E-mail incorreto!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Email" size='large' />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Senha incorreta!' }]}
              >
                <Input.Password prefix={<LockOutlined />} type="password" placeholder="Senha" size='large' />
              </Form.Item>

              <Form.Item>
                <Button block type="primary" htmlType="submit" size='large' loading={loading}>
                  Entrar
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
        
        {/* Sign Up Modal */}
        <Modal
          title="Cadastre-se"
          open={isModalSignUpOpen}
          footer={false}
          onCancel={() => setIsModalSignUpOpen(false)}
          centered
        >
          <div className='w-full flex justify-center items-center pt-6'>
            <Form
              name="signup"
              className="w-full px-4 md:px-0"
              initialValues={{ remember: true }}
              onFinish={handleSignUp}
            >
              <Form.Item
                name="nome"
                rules={[{ required: true, message: 'Escreva um nome!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nome completo" size='large' />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'E-mail incorreto!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Email" size='large' />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Senha incorreta!' }]}
              >
                <Input.Password prefix={<LockOutlined />} type="password" placeholder="Senha" size='large' />
              </Form.Item>

              <Form.Item>
                <Button block type="primary" htmlType="submit" size='large' loading={loading}>
                  Cadastrar
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  );
}