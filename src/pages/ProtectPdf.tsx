
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Lock, Upload, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const ProtectPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [permissions, setPermissions] = useState({
    print: false,
    copy: false,
    edit: false,
    annotate: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo PDF válido.",
        variant: "destructive",
      });
    }
  };

  const handleProtect = async () => {
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
        description: "Por favor, defina uma senha para proteger o PDF.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulação do processamento
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Sucesso!",
        description: "PDF protegido com sucesso!",
      });
    }, 2000);
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setPermissions(prev => ({ ...prev, [permission]: checked }));
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
              <Lock className="w-6 h-6 text-red-600" />
              <h1 className="text-xl font-bold text-slate-800">Proteger PDF</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-800">Proteger PDF</CardTitle>
              <CardDescription>
                Adicione senha e configure permissões para proteger seu documento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-red-200 rounded-lg p-8 text-center hover:border-red-300 transition-colors">
                <Upload className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <Label htmlFor="pdf-upload" className="cursor-pointer">
                  <span className="text-lg font-medium text-slate-700">
                    {file ? file.name : "Clique para selecionar um PDF"}
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

              <div className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Senha de proteção
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite uma senha segura"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirm-password" className="text-sm font-medium text-slate-700">
                    Confirmar senha
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Digite a senha novamente"
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-medium text-slate-700">Permissões (opcional):</Label>
                <Card className="bg-gray-50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="print"
                        checked={permissions.print}
                        onCheckedChange={(checked) => handlePermissionChange("print", checked as boolean)}
                      />
                      <Label htmlFor="print" className="text-sm">Permitir impressão</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="copy"
                        checked={permissions.copy}
                        onCheckedChange={(checked) => handlePermissionChange("copy", checked as boolean)}
                      />
                      <Label htmlFor="copy" className="text-sm">Permitir cópia de texto</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit"
                        checked={permissions.edit}
                        onCheckedChange={(checked) => handlePermissionChange("edit", checked as boolean)}
                      />
                      <Label htmlFor="edit" className="text-sm">Permitir edição</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="annotate"
                        checked={permissions.annotate}
                        onCheckedChange={(checked) => handlePermissionChange("annotate", checked as boolean)}
                      />
                      <Label htmlFor="annotate" className="text-sm">Permitir anotações</Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button
                onClick={handleProtect}
                disabled={!file || !password || isProcessing}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 text-lg"
              >
                {isProcessing ? (
                  <>Protegendo...</>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Proteger PDF
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProtectPdf;
