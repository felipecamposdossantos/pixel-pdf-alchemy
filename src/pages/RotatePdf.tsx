
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { RotateCw, RotateCcw, Upload, ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { PDFDocument, degrees } from 'pdf-lib';

const RotatePdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rotatedFile, setRotatedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setRotatedFile(null);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo PDF válido.",
        variant: "destructive",
      });
    }
  };

  const rotatePdf = async (pdfBytes: ArrayBuffer, rotationDegrees: number): Promise<ArrayBuffer> => {
    const pdf = await PDFDocument.load(pdfBytes);
    const pageCount = pdf.getPageCount();
    
    // Rotacionar todas as páginas
    for (let i = 0; i < pageCount; i++) {
      setProgress((i / pageCount) * 90);
      
      const page = pdf.getPage(i);
      page.setRotation(degrees(rotationDegrees));
      
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const rotatedBytes = await pdf.save();
    return rotatedBytes;
  };

  const handleRotate = async () => {
    if (!file) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo PDF primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Rotacionar PDF
      const rotatedBytes = await rotatePdf(arrayBuffer, rotation);
      
      // Criar blob e URL
      const blob = new Blob([rotatedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setRotatedFile(url);
      setProgress(100);

      toast({
        title: "Sucesso!",
        description: `PDF rotacionado ${rotation}° com sucesso!`,
      });

    } catch (error) {
      console.error('Erro ao rotacionar PDF:', error);
      toast({
        title: "Erro",
        description: "Erro ao rotacionar o arquivo PDF. Tente novamente.",
        variant: "destructive"
      });
    }

    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (rotatedFile && file) {
      const link = document.createElement('a');
      link.href = rotatedFile;
      link.download = `rotated_${rotation}deg_${file.name}`;
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
              <RotateCw className="w-6 h-6 text-teal-600" />
              <h1 className="text-xl font-bold text-slate-800">Girar PDF</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-800">Girar PDF</CardTitle>
              <CardDescription>
                Gire todas as páginas do seu PDF na orientação desejada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-teal-200 rounded-lg p-8 text-center hover:border-teal-300 transition-colors">
                <Upload className="w-12 h-12 text-teal-500 mx-auto mb-4" />
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
                <Label className="text-lg font-medium text-slate-700">Ângulo de rotação</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[90, 180, 270, -90].map((angle) => (
                    <Button
                      key={angle}
                      variant={rotation === angle ? "default" : "outline"}
                      onClick={() => setRotation(angle)}
                      className="flex flex-col items-center p-4 h-auto"
                    >
                      {angle === 90 && <RotateCw className="w-6 h-6 mb-2" />}
                      {angle === 180 && <RotateCw className="w-6 h-6 mb-2 transform rotate-180" />}
                      {angle === 270 && <RotateCcw className="w-6 h-6 mb-2" />}
                      {angle === -90 && <RotateCcw className="w-6 h-6 mb-2" />}
                      <span className="text-sm">{angle > 0 ? `${angle}°` : `${Math.abs(angle)}° ←`}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Rotacionando PDF...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {!rotatedFile && !isProcessing && (
                <Button
                  onClick={handleRotate}
                  disabled={!file}
                  className="w-full bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white py-3 text-lg"
                >
                  <RotateCw className="w-5 h-5 mr-2" />
                  Girar PDF {rotation}°
                </Button>
              )}

              {rotatedFile && (
                <div className="space-y-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <p className="text-center font-medium text-green-800">
                        ✅ PDF rotacionado com sucesso!
                      </p>
                      <p className="text-center text-sm text-green-600 mt-1">
                        Todas as páginas foram rotacionadas {rotation}°
                      </p>
                    </CardContent>
                  </Card>
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 text-lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Baixar PDF Rotacionado
                  </Button>
                  <Button
                    onClick={() => {
                      setFile(null);
                      setRotatedFile(null);
                      setProgress(0);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Girar Outro Arquivo
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

export default RotatePdf;
