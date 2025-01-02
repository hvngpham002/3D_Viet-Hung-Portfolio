/* eslint-disable @typescript-eslint/naming-convention */
import React, { Suspense, useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

// Initialize EmailJS with your public key
emailjs.init(import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY);
import { useTranslation } from 'react-i18next';
import { Canvas } from '@react-three/fiber';
import Sif from '../models/Sif';
import Bonfire from '../models/Bonfire';

interface FormData {
  name: string;
  email: string;
  message: string;
}
declare global {
  interface ImportMetaEnv {
    readonly VITE_APP_EMAILJS_SERVICE_ID: string;
    readonly VITE_APP_EMAILJS_TEMPLATE_ID: string;
    readonly VITE_APP_EMAILJS_PUBLIC_KEY: string;
  }
}

const Contact = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormData>({ name: '', email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentAnimation, setCurrentAnimation] = useState('idle');

  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFocus = () => {
    setCurrentAnimation('idle');
  }

  const handleBlur = () => {
    setCurrentAnimation('running');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');

    try {
      await emailjs.send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Viet Hung Pham",
          from_email: form.email,
          to_email: "hung.v.pham002@gmail.com",
          message: form.message,
        }
      );

      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
      console.error('Error sending email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateCanvasHeight = () => {
      if (formRef.current && canvasContainerRef.current) {
        const h1 = formRef.current.previousElementSibling as HTMLElement;
        const form = formRef.current;
        const button = formRef.current.querySelector('button') as HTMLElement;
        
        if (h1 && form && button) {
          const totalHeight = h1.offsetHeight + form.offsetHeight + button.offsetHeight;
          canvasContainerRef.current.style.height = `${totalHeight}px`;
        }
      }
    };
   
    updateCanvasHeight();
    window.addEventListener('resize', updateCanvasHeight);
    return () => window.removeEventListener('resize', updateCanvasHeight);
   }, []);

  return (
    <section className="relative flex lg:flex-row flex-col max-container h-screen">
      <div className="flex-1 min-w-[50%] flex flex-col h-full overflow-y-auto">
        <h1 className="text-2xl font-semibold dark:text-white">
          {t('Want To Work With Me?')}
        </h1>
        <form 
          ref={formRef}
          className="w-full flex flex-col gap-7 mt-14" 
          onSubmit={handleSubmit}
        >
          <label className="text-black-500 font-semibold dark:text-white">
            {t('Name')}:
            <input 
              type="text" 
              name="name" 
              className="input dark:bg-gray-800 dark:text-white" 
              placeholder={t('Sir Astorias, The Abysswalker')}
              required 
              value={form.name}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label className="text-black-500 font-semibold dark:text-white">
            {t('Email')}:
            <input 
              type="email" 
              name="email" 
              className="input dark:bg-gray-800 dark:text-white" 
              placeholder={t('sif@gmail.com')}
              required 
              value={form.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label className="text-black-500 font-semibold dark:text-white">
            {t('Message')}:
            <textarea 
              name="message" 
              rows={4} 
              className="textarea dark:bg-gray-800 dark:text-white" 
              placeholder={t('Let me know how I can be of service!')}
              required
              value={form.message}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className={`btn ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? t('Sending...') : t('Send Message')}
          </button>

          {status === 'success' && (
            <p className="text-green-500 mt-4">{t('Message sent successfully!')}</p>
          )}
          {status === 'error' && (
            <p className="text-red-500 mt-4">{t('Failed to send message. Please try again.')}</p>
          )}
        </form>
      </div>
      <div ref={canvasContainerRef} className="lg:w-1/2 w-full lg:h-full border border-white" >
          <Canvas shadows camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}>
            <directionalLight intensity={2.5} position={[0, 0, 1]} />
            <ambientLight intensity={1} />
            <Suspense fallback={null}>
              <Bonfire 
                position={[3.0, -3.0, -10.0]} 
                rotation={[0, -0.5, 0]} 
                scale={[1, 1, 1]}/>
              <Sif 
                position={[-0.6, -2.0, 0]} 
                rotation={[0, -0.4, 0]} 
                scale={[1.85, 1.85, 1.85]} 
                currentAnimation={currentAnimation}
                />
            </Suspense>
          </Canvas>
      </div>
    </section>
  );
};

export default Contact;