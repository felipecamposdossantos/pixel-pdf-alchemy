
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, FileText, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [browserName, setBrowserName] = useState('');

  useEffect(() => {
    // Detectar iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Detectar browser
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      setBrowserName('Chrome');
    } else if (userAgent.includes('Edg')) {
      setBrowserName('Edge');
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      setBrowserName('Safari');
    } else if (userAgent.includes('Firefox')) {
      setBrowserName('Firefox');
    }

    // Detectar se já está instalado
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Event listener para o prompt de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log('PWA install prompt disponível');
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Para dispositivos iOS - mostrar prompt manual após alguns segundos
    if (iOS && !standalone) {
      const timer = setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-prompt-dismissed');
        if (!dismissed || Date.now() - parseInt(dismissed) > 24 * 60 * 60 * 1000) {
          setShowPrompt(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Para outros navegadores - mostrar prompt se suportado
    if (!iOS && !standalone) {
      const timer = setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-prompt-dismissed');
        if (!dismissed || Date.now() - parseInt(dismissed) > 24 * 60 * 60 * 1000) {
          setShowPrompt(true);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      console.log('Mostrando prompt de instalação');
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('Resultado da instalação:', outcome);
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
        console.log('PWA instalado com sucesso!');
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    console.log('Prompt de instalação dispensado');
  };

  // Não mostrar se já está instalado
  if (isStandalone || !showPrompt) return null;

  const getInstallInstructions = () => {
    if (isIOS) {
      return "Toque no botão de compartilhar e selecione 'Adicionar à Tela de Início'";
    }
    return "Instale o app para acesso rápido e uma experiência otimizada";
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:right-4 md:max-w-sm">
      <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-blue-200 dark:border-slate-600 shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-500">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-bold text-slate-800 dark:text-white text-base">
                  Instalar PDFTools
                </h3>
                <Smartphone className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 leading-relaxed">
                {getInstallInstructions()}
              </p>
              {browserName && !isIOS && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Compatível com {browserName}
                </p>
              )}
              <div className="flex space-x-2">
                {!isIOS && deferredPrompt && (
                  <Button 
                    onClick={handleInstallClick}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs px-4 py-2 h-9 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Instalar App
                  </Button>
                )}
                <Button 
                  onClick={handleDismiss}
                  variant="outline"
                  size="sm"
                  className="text-xs px-4 py-2 h-9 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  {isIOS ? "Entendi" : "Não agora"}
                </Button>
              </div>
            </div>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="p-1 h-8 w-8 flex-shrink-0 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
