"use client"

import { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, message } from 'antd';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '@/app/firebase/config';
import Logo from '@/app/assets/loguinho.png.png'
import { signIn } from "next-auth/react";

type FieldType = {
  nome: string;
  email: string;
  password: string;
};

export default function Home() {
  const [isModalSignInOpen, setIsModalSignInOpen] = useState<boolean>(false);
  const [isModalSignUpOpen, setIsModalSignUpOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>("");
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

  const handleForgotPassword = async (email: string) => {
    if (!email) {
      message.warning("Digite seu e-mail no campo acima primeiro.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      message.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    } catch (error) {
      console.error(error);
      message.error("Erro ao enviar e-mail. Verifique se o e-mail está correto.");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-image">

      {/* Card principal */}
      <div className="relative w-[90%] max-w-4xl h-[550px] rounded-2xl overflow-hidden shadow-2xl flex bg-white">

        {/* Lado esquerdo — logo + boas-vindas */}
        <div className="relative w-[50%] flex-shrink-0 flex flex-col items-center justify-center gap-4 z-10">
          <div className="absolute inset-0 bg-image bg-cover bg-center" />
          <div className="absolute inset-0 bg-blue-900/80" />

          <img src={Logo.src} alt="Logo" className="relative z-10 w-68 drop-shadow-lg" />
          <div className="relative z-10 text-center px-6">
            <h1 className="text-white text-4xl font-semibold tracking-wide">Bem-vindo!</h1>
            <p className="text-blue-200 text-xl mt-1">Acesse sua conta para continuar</p>
          </div>
        </div>

        {/* Onda separadora */}
        <div className="absolute left-[41%] top-0 h-full z-20 pointer-events-none w-[110px]">
          <svg viewBox="0 0 110 460" preserveAspectRatio="none" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M55 0 C25 80, 85 160, 55 230 C25 300, 85 380, 55 460 L110 460 L110 0 Z" fill="white" />
          </svg>
        </div>

        {/* Lado direito — botões */}
        <div className="flex-1 flex flex-col justify-center items-center px-10 py-8 bg-white z-10 gap-3">
          <p className="text-black text-xl mb-2">Entre com sua conta</p>

          <button
            onClick={() => setIsModalSignInOpen(true)}
            className="w-67 py-2.5 bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white text-xl font-medium rounded-full transition-all duration-150 shadow-sm"
          >
            Entrar
          </button>

          <button
            onClick={handleGoogleLogin}
            className="w-67 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.98] text-gray-700 text-xl rounded-full transition-all duration-150 flex items-center justify-center gap-2"
          >
            <img src="/google.png" alt="Google" width={16} />
            Entrar com Google
          </button>

          <p className="text-xl text-black mt-1">
            Não tem uma conta?{" "}
            <button
              onClick={() => setIsModalSignUpOpen(true)}
              className="text-blue-500 hover:text-blue-600 underline transition-colors"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </div>

      {/* Modal — Entrar */}
      <Modal title="Entrar" open={isModalSignInOpen} footer={false} onCancel={() => setIsModalSignInOpen(false)} centered>
        <div className="w-full flex justify-center items-center pt-6">
          <Form name="login" className="w-full px-4 md:px-0" initialValues={{ remember: true }} onFinish={handleLogin}>

            <Form.Item name="email" rules={[{ required: true, message: 'E-mail incorreto!' }]}>
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                size="large"
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Senha incorreta!' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Senha" size="large" />
            </Form.Item>

            {/* Link esqueci minha senha */}
            <Form.Item>
              <button
                type="button"
                onClick={() => handleForgotPassword(loginEmail)}
                className="text-blue-500 hover:text-blue-600 underline text-sm"
              >
                Esqueci minha senha
              </button>
            </Form.Item>

            <Form.Item>
              <Button block type="primary" htmlType="submit" size="large" loading={loading}>
                Entrar
              </Button>
            </Form.Item>

          </Form>
        </div>
      </Modal>

      {/* Modal — Cadastro */}
      <Modal title="Cadastre-se" open={isModalSignUpOpen} footer={false} onCancel={() => setIsModalSignUpOpen(false)} centered>
        <div className="w-full flex justify-center items-center pt-6">
          <Form name="signup" className="w-full px-4 md:px-0" initialValues={{ remember: true }} onFinish={handleSignUp}>
            <Form.Item name="nome" rules={[{ required: true, message: 'Escreva um nome!' }]}>
              <Input prefix={<UserOutlined />} placeholder="Nome completo" size="large" />
            </Form.Item>
            <Form.Item name="email" rules={[{ required: true, message: 'E-mail incorreto!' }]}>
              <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Senha incorreta!' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Senha" size="large" />
            </Form.Item>
            <Form.Item>
              <Button block type="primary" htmlType="submit" size="large" loading={loading}>
                Cadastrar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
