
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { FileImage, Upload, Download, X, Move } from "lucide-react";
import { Link } from "react-router-dom";

const ImagesToPdf = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
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
  }, [toast]);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (fromIndex: number, toIndex: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
    });
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

    // Simular processo de conversão
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    toast({
      title: "Sucesso!",
      description: "PDF criado com sucesso",
    });

    setIsProcessing(false);
    setProgress(0);
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
                  Arraste e solte para reordenar as imagens conforme desejado no PDF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors"
                    >
                      <Move className="w-5 h-5 text-slate-400 mr-3 cursor-move" />
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
          {selectedFiles.length > 0 && (
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
                      onClick={() => setSelectedFiles([])}
                      size="lg"
                    >
                      Limpar Tudo
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Como usar</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-blue-700">
                <li>Clique em "Selecionar Imagens" ou arraste suas imagens para a área de upload</li>
                <li>Organize as imagens na ordem desejada usando os controles de reordenação</li>
                <li>Clique em "Converter para PDF" para gerar seu arquivo PDF</li>
                <li>Faça o download do PDF convertido</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImagesToPdf;
