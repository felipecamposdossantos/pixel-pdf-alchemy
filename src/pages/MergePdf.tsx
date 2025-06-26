
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { FilePlus2, Upload, Download, X, Move, ArrowUp, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

const MergePdf = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== files.length) {
      toast({
        title: "Aviso",
        description: "Apenas arquivos PDF são aceitos",
        variant: "destructive"
      });
    }
    
    setSelectedFiles(prev => [...prev, ...pdfFiles]);
  }, [toast]);

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveFile = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= selectedFiles.length) return;

    setSelectedFiles(prev => {
      const newFiles = [...prev];
      [newFiles[fromIndex], newFiles[toIndex]] = [newFiles[toIndex], newFiles[fromIndex]];
      return newFiles;
    });
  };

  const mergePdfs = async () => {
    if (selectedFiles.length < 2) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos 2 arquivos PDF para juntar",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simular processo de mesclagem
    for (let i = 0; i <= 100; i += 8) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    toast({
      title: "Sucesso!",
      description: "PDFs unidos com sucesso",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <FilePlus2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FilePlus2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Juntar PDFs
            </h1>
            <p className="text-xl text-slate-600">
              Combine múltiplos arquivos PDF em um único documento
            </p>
          </div>

          {/* Upload Area */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Selecionar PDFs</CardTitle>
              <CardDescription>
                Escolha os arquivos PDF que deseja juntar. Mínimo de 2 arquivos necessário.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-purple-200 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">
                  Clique para selecionar PDFs ou arraste e solte aqui
                </p>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-600">
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    Selecionar PDFs
                  </label>
                </Button>
                <p className="text-sm text-slate-500 mt-2">
                  Você pode selecionar múltiplos arquivos de uma vez
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>PDFs Selecionados ({selectedFiles.length})</CardTitle>
                <CardDescription>
                  Os arquivos serão unidos na ordem mostrada abaixo. Use os botões para reordenar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center space-x-2 mr-4">
                        <span className="text-sm font-medium text-slate-500 bg-slate-200 rounded-full w-6 h-6 flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div className="flex flex-col space-y-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveFile(index, 'up')}
                            disabled={index === 0}
                            className="h-5 w-5 p-0"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveFile(index, 'down')}
                            disabled={index === selectedFiles.length - 1}
                            className="h-5 w-5 p-0"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <FilePlus2 className="w-8 h-8 text-red-500 mr-3" />
                      
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
                
                {selectedFiles.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Total:</strong> {selectedFiles.length} arquivos • {' '}
                      <strong>Tamanho:</strong> {formatFileSize(selectedFiles.reduce((total, file) => total + file.size, 0))}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Merge Options */}
          {selectedFiles.length >= 2 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Opções de Mesclagem</CardTitle>
                <CardDescription>
                  Configure como os PDFs serão unidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="add-bookmarks" defaultChecked className="rounded" />
                      <label htmlFor="add-bookmarks" className="text-sm text-slate-700">
                        Adicionar marcadores por arquivo
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="optimize-size" className="rounded" />
                      <label htmlFor="optimize-size" className="text-sm text-slate-700">
                        Otimizar tamanho do arquivo
                      </label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="preserve-metadata" defaultChecked className="rounded" />
                      <label htmlFor="preserve-metadata" className="text-sm text-slate-700">
                        Preservar metadados
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="add-page-numbers" className="rounded" />
                      <label htmlFor="add-page-numbers" className="text-sm text-slate-700">
                        Adicionar numeração de páginas
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Merge Button */}
          {selectedFiles.length >= 2 && (
            <Card>
              <CardContent className="pt-6">
                {isProcessing && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">Unindo PDFs...</span>
                      <span className="text-sm text-slate-600">{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={mergePdfs}
                    disabled={isProcessing}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    size="lg"
                  >
                    {isProcessing ? (
                      "Unindo PDFs..."
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Juntar PDFs ({selectedFiles.length} arquivos)
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
          <Card className="mt-8 bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800">Como usar</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-purple-700">
                <li>Selecione pelo menos 2 arquivos PDF que deseja juntar</li>
                <li>Use os botões de seta para reordenar os arquivos conforme necessário</li>
                <li>Configure as opções de mesclagem conforme desejado</li>
                <li>Clique em "Juntar PDFs" para criar o arquivo único</li>
                <li>Faça o download do PDF unificado</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MergePdf;
