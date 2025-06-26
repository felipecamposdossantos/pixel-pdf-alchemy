
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Scissors, Upload, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const SplitPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [splitOption, setSplitOption] = useState<"pages" | "range">("pages");
  const [pageNumbers, setPageNumbers] = useState("");
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

  const handleSplit = async () => {
    if (!file) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo PDF primeiro.",
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
        description: "PDF dividido com sucesso!",
      });
    }, 2000);
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
              <Scissors className="w-6 h-6 text-orange-600" />
              <h1 className="text-xl font-bold text-slate-800">Dividir PDF</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-800">Dividir PDF</CardTitle>
              <CardDescription>
                Extraia páginas específicas ou divida seu PDF em múltiplos arquivos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-orange-200 rounded-lg p-8 text-center hover:border-orange-300 transition-colors">
                <Upload className="w-12 h-12 text-orange-500 mx-auto mb-4" />
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
                <Label className="text-lg font-medium text-slate-700">Opções de divisão:</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className={`cursor-pointer transition-all ${
                      splitOption === "pages" ? "ring-2 ring-orange-500 bg-orange-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSplitOption("pages")}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-medium">Páginas específicas</h3>
                      <p className="text-sm text-gray-600">Ex: 1,3,5-8</p>
                    </CardContent>
                  </Card>
                  <Card 
                    className={`cursor-pointer transition-all ${
                      splitOption === "range" ? "ring-2 ring-orange-500 bg-orange-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSplitOption("range")}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-medium">Intervalo</h3>
                      <p className="text-sm text-gray-600">Ex: 1-10</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Label htmlFor="page-numbers">
                    {splitOption === "pages" ? "Páginas (separadas por vírgula)" : "Intervalo de páginas"}
                  </Label>
                  <Input
                    id="page-numbers"
                    value={pageNumbers}
                    onChange={(e) => setPageNumbers(e.target.value)}
                    placeholder={splitOption === "pages" ? "1,3,5-8" : "1-10"}
                    className="mt-2"
                  />
                </div>
              </div>

              <Button
                onClick={handleSplit}
                disabled={!file || isProcessing}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 text-lg"
              >
                {isProcessing ? (
                  <>Processando...</>
                ) : (
                  <>
                    <Scissors className="w-5 h-5 mr-2" />
                    Dividir PDF
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

export default SplitPdf;
