import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react'; 
import { supabase } from '../../lib/supabase';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Tradução de mensagens de erro do Supabase
  const translateErrorMessage = (message) => {
    const errorMessages = {
      'Invalid login credentials': 'Email ou senha incorretos.',
      'Email not confirmed': 'Email não confirmado. Por favor, verifique sua caixa de entrada.',
      'Invalid email or password': 'Email ou senha inválidos.',
      'Email already registered': 'Este email já está registrado.',
      'User not found': 'Usuário não encontrado.',
      'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
      'Unable to validate email address': 'Não foi possível validar o endereço de email.',
      'Rate limit exceeded': 'Limite de tentativas excedido. Tente novamente mais tarde.'
    };

    return errorMessages[message] || message;
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    // Validar email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
      valid = false;
    }

    // Validar senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validar formulário antes de enviar
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // Armazenar preferência "lembrar-me" se ativada
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      // Se o usuário precisa trocar a senha, redirecione
      if (data?.user?.user_metadata?.must_change_password) {
        navigate('/change-password');
        return;
      }

      // Redirect to dashboard or home page after successful login
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error.message);
      setError(translateErrorMessage(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Remover mensagem de erro do campo quando o usuário começa a digitar
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' });
    }
    setError(''); // Limpar mensagem de erro geral quando o usuário edita um campo
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with gradient background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-left relative">
        <img
          src="https://ky4ov9pv1r.ufs.sh/f/vacIC1PeQNAlDswuZB88a7yWn6wgksjifxH4eGOmQR9DLvlN"
          alt="Background Pattern"
          className="absolute left-0 bottom-0 opacity-100"
        />
        <div className="text-white pl-48 pr-16 py-16 z-10 flex flex-col justify-center w-full">
          <img
            src="https://ky4ov9pv1r.ufs.sh/f/vacIC1PeQNAlhUNzEasnBIAxdQCj9eGRJluP31YK8vSzt2Wo"
            alt="Revvo Logo"
            className="w-40 h-auto mb-8"
          />
          <h1 className="font-onest text-[64px] leading-tight mb-4 font-bold tracking-normal">
            Olá, seja<br />bem-vindo!
          </h1>
          <p className="font-onest text-[20px] font-medium">
            Cadastre-se hoje e subtítulo e etc<br />
            subtítulo e etc subtítulo
          </p>
        </div>
      </div>

      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <img
            src="https://utfs.io/f/vacIC1PeQNAlsDXzKKbIVgqwomYfjGCaLMdyBkcWtsEPlr89"
            alt="Revvo Logo"
            className="h-12 mb-8 mx-auto"
          />
          <h2 className="text-2xl font-onest font-semibold text-center mb-8">Para iniciar, faça seu login</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Insira seu e-mail"
                className={`w-full h-input px-6 border ${formErrors.email ? 'border-red-500' : 'border-gray-2'} rounded-md focus:outline-none focus:border-revvo-blue text-base font-onest`}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isLoading}
                aria-invalid={formErrors.email ? 'true' : 'false'}
              />
              {formErrors.email && (
                <div className="flex items-center mt-1 text-red-500 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  <span>{formErrors.email}</span>
                </div>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Insira sua senha"
                className={`w-full h-input px-6 border ${formErrors.password ? 'border-red-500' : 'border-gray-2'} rounded-md focus:outline-none focus:border-revvo-blue text-base font-onest`}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                disabled={isLoading}
                aria-invalid={formErrors.password ? 'true' : 'false'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-0 p-0 outline-none"
                disabled={isLoading}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-3" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-3" />
                )}
              </button>
              {formErrors.password && (
                <div className="flex items-center mt-1 text-red-500 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  <span>{formErrors.password}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-600 font-onest">Lembrar-me</span>
              </label>
              <button
                type="button"
                className="text-sm text-revvo-blue hover:underline font-onest bg-transparent border-0 p-0 outline-none"
                onClick={() => navigate('/forgot-password')}
                disabled={isLoading}
              >
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              className={`w-full h-input bg-revvo-dark-blue text-white rounded-md transition-colors text-base font-onest font-semibold ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-opacity-90'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
            
            {error && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-red-600 text-sm font-onest">{error}</p>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center">
              <div className="border-t border-gray-2 flex-grow"></div>
              <span className="px-4 text-gray-3 font-onest">ou</span>
              <div className="border-t border-gray-2 flex-grow"></div>
            </div>

            <button 
              className={`mt-4 w-full h-input border border-gray-2 rounded-md flex items-center justify-center gap-2 text-base font-onest font-light ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
              disabled={isLoading}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              Continuar com Google
            </button>

            <p className="mt-6 text-sm font-onest text-[16px]">
              Não possui uma conta?{' '}
              <Link to="/signup" className="text-revvo-blue hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;