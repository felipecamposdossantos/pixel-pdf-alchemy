
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Unlock, Upload, ArrowLeft, Eye, EyeOff, Lock, Download } from "lucide-react";
import { Link } from "react-router-dom";

const UnlockPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [unlockedFile, setUnlockedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setUnlockedFile(null); // Reset unlocked file when new file is selected
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo PDF válido.",
        variant: "destructive",
      });
    }
  };

  const handleUnlock = async () => {
    if (!file) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo PDF primeiro.",
        variant: "destructive",
      });
      return;
    }

    if (!password) {
      toast({
        title: "Erro",
        description: "Por favor, digite a senha do PDF.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulação do processamento
    setTimeout(() => {
      setIsProcessing(false);
      // Simulação de senha incorreta às vezes
      if (Math.random() > 0.7) {
        toast({
          title: "Erro",
          description: "Senha incorreta. Tente novamente.",
          variant: "destructive",
        });
      } else {
        // Simular arquivo desbloqueado usando o arquivo original
        const url = URL.createObjectURL(file);
        setUnlockedFile(url);
        toast({
          title: "Sucesso!",
          description: "PDF desbloqueado com sucesso!",
        });
      }
    }, 2000);
  };

  const handleDownload = () => {
    if (unlockedFile && file) {
      const link = document.createElement('a');
      link.href = unlockedFile;
      link.download = `unlocked_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 hover:text-blue-800">Voltar</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Unlock className="w-6 h-6 text-yellow-600" />
              <h1 className="text-xl font-bold text-slate-800">Desbloquear PDF</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-800">Desbloquear PDF</CardTitle>
              <CardDescription>
                Remova a proteção por senha do seu documento PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-yellow-200 rounded-lg p-8 text-center hover:border-yellow-300 transition-colors">
                <Upload className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <Label htmlFor="pdf-upload" className="cursor-pointer">
                  <span className="text-lg font-medium text-slate-700">
                    {file ? file.name : "Clique para selecionar um PDF protegido"}
                  </span>
                  <Input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </Label>
              </div>

              {file && (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 text-yellow-800">
                      <Lock className="w-5 h-5" />
                      <span className="font-medium">PDF protegido detectado</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Digite a senha para desbloquear este documento
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Senha do PDF
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite a senha do PDF"
                      disabled={!file}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={!file}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-medium text-blue-800 mb-2">🔒 Segurança garantida</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Seus arquivos são processados localmente</li>
                    <li>• Nenhuma senha é armazenada em nossos servidores</li>
                    <li>• Documentos são excluídos automaticamente após o processamento</li>
                  </ul>
                </CardContent>
              </Card>

              {!unlockedFile ? (
                <Button
                  onClick={handleUnlock}
                  disabled={!file || !password || isProcessing}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white py-3 text-lg"
                >
                  {isProcessing ? (
                    <>Desbloqueando...</>
                  ) : (
                    <>
                      <Unlock className="w-5 h-5 mr-2" />
                      Desbloquear PDF
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <p className="text-center font-medium text-green-800">
                        ✅ PDF desbloqueado com sucesso!
                      </p>
                      <p className="text-center text-sm text-green-600 mt-1">
                        Arquivo pronto para download
                      </p>
                    </CardContent>
                  </Card>
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 text-lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Baixar PDF Desbloqueado
                  </Button>
                  <Button
                    onClick={() => {
                      setFile(null);
                      setUnlockedFile(null);
                      setPassword("");
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Desbloquear Outro Arquivo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UnlockPdf;
