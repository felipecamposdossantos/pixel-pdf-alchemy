
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Combine, Upload, Download, X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { PDFDocument } from 'pdf-lib';

const MergePdf = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mergedFile, setMergedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const pdfFiles = selectedFiles.filter(file => file.type === "application/pdf");
    
    if (pdfFiles.length !== selectedFiles.length) {
      toast({
        title: "Aviso",
        description: "Apenas arquivos PDF são aceitos.",
        variant: "destructive",
      });
    }
    
    setFiles(prev => [...prev, ...pdfFiles]);
    setMergedFile(null);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos 2 arquivos PDF para juntar.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const mergedPdf = await PDFDocument.create();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress((i / files.length) * 90);
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pageCount = pdf.getPageCount();
        
        // Copiar todas as páginas do PDF atual
        const pageIndices = Array.from({ length: pageCount }, (_, idx) => idx);
        const pages = await mergedPdf.copyPages(pdf, pageIndices);
        
        pages.forEach(page => mergedPdf.addPage(page));
      }
      
      setProgress(95);
      const pdfBytes = await mergedPdf.save();
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedFile(url);
      setProgress(100);

      toast({
        title: "Sucesso!",
        description: `${files.length} PDFs unidos com sucesso!`,
      });

    } catch (error) {
      console.error('Erro ao juntar PDFs:', error);
      toast({
        title: "Erro",
        description: "Erro ao juntar os arquivos PDF. Tente novamente.",
        variant: "destructive"
      });
    }

    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (mergedFile) {
      const link = document.createElement('a');
      link.href = mergedFile;
      link.download = `PDFs-unidos-${Date.now()}.pdf`;
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
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 hover:text-blue-800">Voltar</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Combine className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-800">Juntar PDFs</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-800">Juntar PDFs</CardTitle>
              <CardDescription>
                Combine múltiplos arquivos PDF em um único documento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center hover:border-blue-300 transition-colors">
                <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <Label htmlFor="pdf-upload" className="cursor-pointer">
                  <span className="text-lg font-medium text-slate-700">
                    Clique para selecionar PDFs
                  </span>
                  <Input
                    id="pdf-upload"
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </Label>
                <p className="text-sm text-slate-500 mt-2">
                  Selecione múltiplos arquivos PDF para juntar
                </p>
              </div>

              {files.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-slate-800">Arquivos selecionados:</h3>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                      <div>
                        <p className="font-medium text-slate-800">{file.name}</p>
                        <p className="text-sm text-slate-500">{formatFileSize(file.size)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Juntando PDFs...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {!mergedFile && !isProcessing && files.length >= 2 && (
                <Button
                  onClick={handleMerge}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg"
                >
                  <Combine className="w-5 h-5 mr-2" />
                  Juntar {files.length} PDFs
                </Button>
              )}

              {mergedFile && (
                <div className="space-y-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <p className="text-center font-medium text-green-800">
                        ✅ PDFs unidos com sucesso!
                      </p>
                      <p className="text-center text-sm text-green-600 mt-1">
                        {files.length} arquivos combinados em um único PDF
                      </p>
                    </CardContent>
                  </Card>
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 text-lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Baixar PDF Unido
                  </Button>
                  <Button
                    onClick={() => {
                      setFiles([]);
                      setMergedFile(null);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Juntar Outros Arquivos
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

export default MergePdf;
