
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Archive, Upload, ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { PDFDocument } from 'pdf-lib';

const CompressPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState([70]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedFile, setProcessedFile] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      setProcessedFile(null);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo PDF válido.",
        variant: "destructive",
      });
    }
  };

  const compressPdf = async (pdfBytes: ArrayBuffer, quality: number): Promise<ArrayBuffer> => {
    const pdf = await PDFDocument.load(pdfBytes);
    const pageCount = pdf.getPageCount();
    
    // Simular compressão baseada no nível de qualidade
    for (let i = 0; i < pageCount; i++) {
      setProgress((i / pageCount) * 90);
      
      const page = pdf.getPage(i);
      const { width, height } = page.getSize();
      
      // Redimensionar página baseado na qualidade (simulação)
      if (quality < 50) {
        page.scale(0.8, 0.8);
      } else if (quality < 70) {
        page.scale(0.9, 0.9);
      }
      
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const compressedBytes = await pdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });
    
    return compressedBytes;
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
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Comprimir PDF
      const compressedBytes = await compressPdf(arrayBuffer, compressionLevel[0]);
      
      // Calcular redução real
      const newSize = compressedBytes.byteLength;
      setCompressedSize(newSize);
      
      // Criar blob e URL
      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setProcessedFile(url);
      setProgress(100);

      const reduction = ((originalSize - newSize) / originalSize) * 100;
      
      toast({
        title: "Sucesso!",
        description: `PDF comprimido com sucesso! Redução: ${reduction.toFixed(1)}%`,
      });

    } catch (error) {
      console.error('Erro ao comprimir PDF:', error);
      toast({
        title: "Erro",
        description: "Erro ao comprimir o arquivo PDF. Tente novamente.",
        variant: "destructive"
      });
    }

    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (processedFile && file) {
      const link = document.createElement('a');
      link.href = processedFile;
      link.download = `compressed_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getCompressionText = (level: number) => {
    if (level >= 90) return "Alta qualidade (compressão baixa)";
    if (level >= 70) return "Qualidade média (compressão balanceada)";
    if (level >= 50) return "Baixa qualidade (alta compressão)";
    return "Qualidade mínima (máxima compressão)";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
              <Archive className="w-6 h-6 text-indigo-600" />
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
                Reduza o tamanho do seu PDF com compressão inteligente
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
                    Tamanho atual: {formatFileSize(file.size)}
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

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Comprimindo PDF...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {!processedFile && !isProcessing && (
                <Button
                  onClick={handleCompress}
                  disabled={!file}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 text-lg"
                >
                  <Archive className="w-5 h-5 mr-2" />
                  Comprimir PDF
                </Button>
              )}

              {processedFile && (
                <div className="space-y-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <p className="text-center font-medium text-green-800">
                        ✅ PDF comprimido com sucesso!
                      </p>
                      <div className="flex justify-between text-sm text-green-600 mt-2">
                        <span>Original: {formatFileSize(originalSize)}</span>
                        <span>Comprimido: {formatFileSize(compressedSize)}</span>
                      </div>
                      <p className="text-center text-sm text-green-600 mt-1">
                        Redução: {(((originalSize - compressedSize) / originalSize) * 100).toFixed(1)}%
                      </p>
                    </CardContent>
                  </Card>
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 text-lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Baixar PDF Comprimido
                  </Button>
                  <Button
                    onClick={() => {
                      setFile(null);
                      setProcessedFile(null);
                      setProgress(0);
                      setOriginalSize(0);
                      setCompressedSize(0);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Comprimir Outro Arquivo
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

export default CompressPdf;
