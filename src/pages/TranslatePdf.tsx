
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Languages, Upload, ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";

const TranslatePdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fromLanguage, setFromLanguage] = useState("");
  const [toLanguage, setToLanguage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [translatedFile, setTranslatedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const languages = [
    { code: "pt", name: "Português" },
    { code: "en", name: "Inglês" },
    { code: "es", name: "Espanhol" },
    { code: "fr", name: "Francês" },
    { code: "de", name: "Alemão" },
    { code: "it", name: "Italiano" },
    { code: "ja", name: "Japonês" },
    { code: "ko", name: "Coreano" },
    { code: "zh", name: "Chinês" },
    { code: "ar", name: "Árabe" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setTranslatedFile(null);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo PDF válido.",
        variant: "destructive",
      });
    }
  };

  const handleTranslate = async () => {
    if (!file || !fromLanguage || !toLanguage) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo e os idiomas de origem e destino.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulação do processamento
    setTimeout(() => {
      setIsProcessing(false);
      // Simular arquivo traduzido
      const blob = new Blob([`PDF traduzido de ${fromLanguage} para ${toLanguage}`], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setTranslatedFile(url);
      toast({
        title: "Sucesso!",
        description: "PDF traduzido com sucesso!",
      });
    }, 3000);
  };

  const handleDownload = () => {
    if (translatedFile && file) {
      const fromLang = languages.find(l => l.code === fromLanguage)?.name || fromLanguage;
      const toLang = languages.find(l => l.code === toLanguage)?.name || toLanguage;
      const link = document.createElement('a');
      link.href = translatedFile;
      link.download = `translated_${fromLang}_to_${toLang}_${file.name}`;
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
              <Languages className="w-6 h-6 text-cyan-600" />
              <h1 className="text-xl font-bold text-slate-800">Traduzir PDF</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-800">Traduzir PDF</CardTitle>
              <CardDescription>
                Traduza o conteúdo do seu PDF para qualquer idioma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-cyan-200 rounded-lg p-8 text-center hover:border-cyan-300 transition-colors">
                <Upload className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700">Idioma de origem</Label>
                  <Select value={fromLanguage} onValueChange={setFromLanguage}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">Traduzir para</Label>
                  <Select value={toLanguage} onValueChange={setToLanguage}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {!translatedFile ? (
                <Button
                  onClick={handleTranslate}
                  disabled={!file || !fromLanguage || !toLanguage || isProcessing}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 text-lg"
                >
                  {isProcessing ? (
                    <>Traduzindo...</>
                  ) : (
                    <>
                      <Languages className="w-5 h-5 mr-2" />
                      Traduzir PDF
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <p className="text-center font-medium text-green-800">
                        ✅ PDF traduzido com sucesso!
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
                    Baixar PDF Traduzido
                  </Button>
                  <Button
                    onClick={() => {
                      setFile(null);
                      setTranslatedFile(null);
                      setFromLanguage("");
                      setToLanguage("");
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Traduzir Outro Arquivo
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

export default TranslatePdf;
