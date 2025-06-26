
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { FileImage, Upload, Download, X, Move } from "lucide-react";
import { Link } from "react-router-dom";
import jsPDF from 'jspdf';

const ImagesToPdf = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast({
        title: "Aviso",
        description: "Apenas arquivos de imagem são aceitos",
        variant: "destructive"
      });
    }
    
    setSelectedFiles(prev => [...prev, ...imageFiles]);
    setPdfUrl(null);
  }, [toast]);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const convertToPdf = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos uma imagem",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const pdf = new jsPDF();
      let isFirstPage = true;

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Atualizar progresso
        setProgress((i / selectedFiles.length) * 90);

        // Converter imagem para base64
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        // Criar uma imagem para obter dimensões
        const img = new Image();
        await new Promise((resolve) => {
          img.onload = resolve;
          img.src = base64;
        });

        // Calcular dimensões para caber na página
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        
        const maxWidth = pageWidth - (margin * 2);
        const maxHeight = pageHeight - (margin * 2);
        
        let { width, height } = img;
        
        // Redimensionar se necessário
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Centralizar imagem na página
        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;

        if (!isFirstPage) {
          pdf.addPage();
        }
        
        pdf.addImage(base64, 'JPEG', x, y, width, height);
        isFirstPage = false;
      }

      setProgress(100);

      // Gerar PDF
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      toast({
        title: "Sucesso!",
        description: "PDF criado com sucesso",
      });

    } catch (error) {
      console.error('Erro ao converter:', error);
      toast({
        title: "Erro",
        description: "Erro ao converter imagens para PDF",
        variant: "destructive"
      });
    }

    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `imagens-convertidas-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileImage className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PDFTools
              </h1>
            </Link>
            <Button variant="outline" asChild>
              <Link to="/">← Voltar</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileImage className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Converter Imagens para PDF
            </h1>
            <p className="text-xl text-slate-600">
              Transforme suas imagens JPG, PNG, GIF em um único arquivo PDF
            </p>
          </div>

          {/* Upload Area */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Selecionar Imagens</CardTitle>
              <CardDescription>
                Escolha as imagens que deseja converter em PDF. Você pode selecionar múltiplas imagens.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">
                  Clique para selecionar imagens ou arraste e solte aqui
                </p>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Selecionar Imagens
                  </label>
                </Button>
                <p className="text-sm text-slate-500 mt-2">
                  Formatos suportados: JPG, PNG, GIF, BMP, WEBP
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Imagens Selecionadas ({selectedFiles.length})</CardTitle>
                <CardDescription>
                  As imagens serão adicionadas ao PDF na ordem mostrada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors"
                    >
                      <FileImage className="w-8 h-8 text-blue-500 mr-3" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{file.name}</p>
                        <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Convert Button */}
          {selectedFiles.length > 0 && !pdfUrl && (
            <Card>
              <CardContent className="pt-6">
                {isProcessing && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">Convertendo imagens...</span>
                      <span className="text-sm text-slate-600">{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={convertToPdf}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="lg"
                  >
                    {isProcessing ? (
                      "Convertendo..."
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Converter para PDF
                      </>
                    )}
                  </Button>
                  
                  {!isProcessing && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedFiles([]);
                        setPdfUrl(null);
                      }}
                      size="lg"
                    >
                      Limpar Tudo
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Download Section */}
          {pdfUrl && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Download className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">PDF Criado com Sucesso!</h3>
                  <p className="text-slate-600">Seu arquivo PDF está pronto para download.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleDownload}
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                      size="lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Baixar PDF
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedFiles([]);
                        setPdfUrl(null);
                      }}
                      size="lg"
                    >
                      Converter Outras Imagens
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagesToPdf;
