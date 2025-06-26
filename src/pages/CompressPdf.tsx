
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Compass, Upload, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CompressPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState([70]);
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

  const handleCompress = async () => {
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
        description: `PDF comprimido com sucesso! Redução estimada: ${100 - compressionLevel[0]}%`,
      });
    }, 2000);
  };

  const getCompressionText = (level: number) => {
    if (level >= 90) return "Alta qualidade (compressão baixa)";
    if (level >= 70) return "Qualidade média (compressão balanceada)";
    if (level >= 50) return "Baixa qualidade (alta compressão)";
    return "Qualidade mínima (máxima compressão)";
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
              <Compass className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-bold text-slate-800">Comprimir PDF</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-800">Comprimir PDF</CardTitle>
              <CardDescription>
                Reduza o tamanho do seu PDF mantendo a qualidade desejada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-indigo-200 rounded-lg p-8 text-center hover:border-indigo-300 transition-colors">
                <Upload className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
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
                {file && (
                  <p className="text-sm text-gray-600 mt-2">
                    Tamanho atual: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-medium text-slate-700">Nível de compressão</Label>
                <div className="px-4">
                  <Slider
                    value={compressionLevel}
                    onValueChange={setCompressionLevel}
                    max={100}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Máxima compressão</span>
                    <span>Máxima qualidade</span>
                  </div>
                </div>
                <Card className="bg-indigo-50 border-indigo-200">
                  <CardContent className="p-4">
                    <p className="text-center font-medium text-indigo-800">
                      {getCompressionText(compressionLevel[0])}
                    </p>
                    <p className="text-center text-sm text-indigo-600 mt-1">
                      Redução estimada: ~{100 - compressionLevel[0]}%
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Button
                onClick={handleCompress}
                disabled={!file || isProcessing}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 text-lg"
              >
                {isProcessing ? (
                  <>Comprimindo...</>
                ) : (
                  <>
                    <Compass className="w-5 h-5 mr-2" />
                    Comprimir PDF
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

export default CompressPdf;
