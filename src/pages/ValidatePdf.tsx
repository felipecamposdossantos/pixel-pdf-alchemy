
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileCheck, Upload, ArrowLeft, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const ValidatePdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setValidationResult(null);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo PDF válido.",
        variant: "destructive",
      });
    }
  };

  const handleValidate = async () => {
    if (!file) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo PDF primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulação do processamento e validação
    setTimeout(() => {
      setIsProcessing(false);
      
      // Resultado simulado da validação
      const mockResult = {
        valid: Math.random() > 0.3,
        version: "1.4",
        pages: Math.floor(Math.random() * 50) + 1,
        size: (file.size / 1024 / 1024).toFixed(2),
        encrypted: Math.random() > 0.7,
        metadata: {
          title: "Documento de Exemplo",
          author: "Usuario",
          creator: "Editor PDF",
          creationDate: new Date().toLocaleDateString("pt-BR"),
        },
        issues: Math.random() > 0.5 ? [
          "Fonte não incorporada detectada",
          "Imagem com resolução baixa encontrada"
        ] : [],
        compliance: {
          "PDF/A": Math.random() > 0.5,
          "PDF/X": Math.random() > 0.6,
          "PDF/UA": Math.random() > 0.7,
        }
      };
      
      setValidationResult(mockResult);
      
      toast({
        title: mockResult.valid ? "Validação concluída!" : "Problemas encontrados",
        description: mockResult.valid ? "PDF válido e sem problemas." : "PDF contém alguns problemas.",
        variant: mockResult.valid ? "default" : "destructive",
      });
    }, 2000);
  };

  const getStatusIcon = (valid: boolean) => {
    return valid ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const getStatusBadge = (valid: boolean) => {
    return (
      <Badge variant={valid ? "default" : "destructive"}>
        {valid ? "Válido" : "Inválido"}
      </Badge>
    );
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
              <FileCheck className="w-6 h-6 text-emerald-600" />
              <h1 className="text-xl font-bold text-slate-800">Validar PDF</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-800">Validar PDF</CardTitle>
              <CardDescription>
                Verifique a integridade, conformidade e propriedades do seu PDF
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-emerald-200 rounded-lg p-8 text-center hover:border-emerald-300 transition-colors">
                <Upload className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
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

              <Button
                onClick={handleValidate}
                disabled={!file || isProcessing}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 text-lg"
              >
                {isProcessing ? (
                  <>Validando...</>
                ) : (
                  <>
                    <FileCheck className="w-5 h-5 mr-2" />
                    Validar PDF
                  </>
                )}
              </Button>

              {validationResult && (
                <div className="space-y-4">
                  <Card className={`${validationResult.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-lg">Status da Validação</h3>
                        {getStatusBadge(validationResult.valid)}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(validationResult.valid)}
                        <span className={validationResult.valid ? 'text-green-800' : 'text-red-800'}>
                          {validationResult.valid ? 'PDF válido e sem problemas detectados' : 'PDF contém problemas que requerem atenção'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Propriedades do Documento</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Versão PDF</Label>
                          <p className="text-sm">{validationResult.version}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Páginas</Label>
                          <p className="text-sm">{validationResult.pages}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Tamanho</Label>
                          <p className="text-sm">{validationResult.size} MB</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Criptografado</Label>
                          <p className="text-sm">{validationResult.encrypted ? 'Sim' : 'Não'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Conformidade</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(validationResult.compliance).map(([standard, compliant]) => (
                          <div key={standard} className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              {compliant ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                              )}
                            </div>
                            <Label className="text-sm font-medium">{standard}</Label>
                            <p className="text-xs text-gray-600">
                              {compliant ? 'Compatível' : 'Não compatível'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {validationResult.issues.length > 0 && (
                    <Card className="bg-yellow-50 border-yellow-200">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                          Problemas Encontrados
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc list-inside space-y-1">
                          {validationResult.issues.map((issue: string, index: number) => (
                            <li key={index} className="text-sm text-yellow-800">{issue}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ValidatePdf;
