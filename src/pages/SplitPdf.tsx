
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Scissors, Upload, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PDFDocument } from 'pdf-lib';

const SplitPdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageNumbers, setPageNumbers] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [splitFiles, setSplitFiles] = useState<{ url: string; name: string; pages: string }[]>([]);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setSplitFiles([]);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo PDF válido.",
        variant: "destructive",
      });
    }
  };

  const parsePageNumbers = (input: string): number[][] => {
    const ranges: number[][] = [];
    const parts = input.split(',').map(p => p.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          const range = [];
          for (let i = start; i <= end; i++) {
            range.push(i - 1); // PDF-lib usa índices baseados em 0
          }
          ranges.push(range);
        }
      } else {
        const pageNum = parseInt(part);
        if (!isNaN(pageNum)) {
          ranges.push([pageNum - 1]); // PDF-lib usa índices baseados em 0
        }
      }
    }
    
    return ranges;
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

    if (!pageNumbers) {
      toast({
        title: "Erro",
        description: "Por favor, especifique as páginas a serem extraídas.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Carregar o PDF original
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const totalPages = originalPdf.getPageCount();
      
      // Analisar os números das páginas
      const pageRanges = parsePageNumbers(pageNumbers);
      
      if (pageRanges.length === 0) {
        throw new Error('Formato de páginas inválido');
      }

      const results: { url: string; name: string; pages: string }[] = [];

      for (let i = 0; i < pageRanges.length; i++) {
        const range = pageRanges[i];
        
        // Atualizar progresso
        setProgress((i / pageRanges.length) * 90);
        
        // Verificar se as páginas existem
        const validPages = range.filter(pageIndex => pageIndex >= 0 && pageIndex < totalPages);
        
        if (validPages.length === 0) {
          continue;
        }

        // Criar novo documento PDF
        const newPdf = await PDFDocument.create();
        
        // Copiar as páginas especificadas
        const pages = await newPdf.copyPages(originalPdf, validPages);
        pages.forEach(page => newPdf.addPage(page));
        
        // Gerar o PDF
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        // Criar nome descritivo
        const pageNumbers = validPages.map(p => p + 1).join(',');
        const fileName = `${file.name.replace('.pdf', '')}-paginas-${pageNumbers}.pdf`;
        
        results.push({
          url,
          name: fileName,
          pages: `Páginas ${pageNumbers}`
        });
      }

      setSplitFiles(results);
      setProgress(100);

      toast({
        title: "Sucesso!",
        description: `PDF dividido em ${results.length} arquivo(s) com sucesso!`,
      });

    } catch (error) {
      console.error('Erro ao dividir PDF:', error);
      toast({
        title: "Erro",
        description: "Erro ao dividir o arquivo PDF. Verifique o formato das páginas.",
        variant: "destructive"
      });
    }

    setIsProcessing(false);
  };

  const handleDownload = (fileData: { url: string; name: string }) => {
    const link = document.createElement('a');
    link.href = fileData.url;
    link.download = fileData.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    splitFiles.forEach((fileData, index) => {
      setTimeout(() => {
        handleDownload(fileData);
      }, index * 500); // Delay entre downloads
    });
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

              <div>
                <Label htmlFor="page-numbers">
                  Páginas a extrair (ex: 1,3,5-8)
                </Label>
                <Input
                  id="page-numbers"
                  value={pageNumbers}
                  onChange={(e) => setPageNumbers(e.target.value)}
                  placeholder="1,3,5-8"
                  className="mt-2"
                />
                <p className="text-sm text-slate-500 mt-2">
                  Use vírgulas para páginas individuais e hífen para intervalos
                </p>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Dividindo PDF...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {splitFiles.length === 0 && !isProcessing && (
                <Button
                  onClick={handleSplit}
                  disabled={!file || !pageNumbers}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 text-lg"
                >
                  <Scissors className="w-5 h-5 mr-2" />
                  Dividir PDF
                </Button>
              )}

              {splitFiles.length > 0 && (
                <div className="space-y-6">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <p className="text-center font-medium text-green-800">
                        ✅ PDF dividido com sucesso!
                      </p>
                      <p className="text-center text-sm text-green-600 mt-1">
                        {splitFiles.length} arquivo(s) pronto(s) para download
                      </p>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    <h3 className="font-medium text-slate-800">Arquivos gerados:</h3>
                    {splitFiles.map((fileData, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                        <div>
                          <p className="font-medium text-slate-800">{fileData.name}</p>
                          <p className="text-sm text-slate-500">{fileData.pages}</p>
                        </div>
                        <Button
                          onClick={() => handleDownload(fileData)}
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-purple-600"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Baixar
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleDownloadAll}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Baixar Todos os Arquivos
                    </Button>
                    
                    <Button
                      onClick={() => {
                        setFile(null);
                        setSplitFiles([]);
                        setPageNumbers("");
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Dividir Outro Arquivo
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SplitPdf;
