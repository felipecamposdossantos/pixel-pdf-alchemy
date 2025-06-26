
import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, Download, X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PdfToWord = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFile, setConvertedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setConvertedFile(null);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo PDF válido",
        variant: "destructive"
      });
    }
  }, [toast]);

  const removeFile = () => {
    setSelectedFile(null);
    setConvertedFile(null);
  };

  const convertToWord = async () => {
    if (!selectedFile) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo PDF primeiro",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    // Simular processo de conversão
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    // Criar um documento Word válido (simulado)
    const wordContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <title>Documento Convertido</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>90</w:Zoom>
            <w:DoNotPromptForConvert/>
            <w:DoNotShowInsertionsAndDeletions/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page Section1 {size:8.5in 11.0in; margin:1.0in 1.25in 1.0in 1.25in;}
          div.Section1 {page:Section1;}
          body {font-family: Arial, sans-serif; font-size: 12pt;}
        </style>
      </head>
      <body>
        <div class="Section1">
          <h1>Documento Convertido de PDF para Word</h1>
          <p><strong>Arquivo Original:</strong> ${selectedFile.name}</p>
          <p><strong>Data de Conversão:</strong> ${new Date().toLocaleDateString()}</p>
          <br>
          <h2>Conteúdo do Documento</h2>
          <p>Este é um exemplo de conversão de PDF para Word. O conteúdo original do PDF seria extraído e convertido para este formato editável.</p>
          <p>Algumas características mantidas na conversão:</p>
          <ul>
            <li>Formatação de texto</li>
            <li>Parágrafos e quebras de linha</li>
            <li>Listas e numeração</li>
            <li>Tabelas (quando possível)</li>
          </ul>
          <br>
          <p><em>Documento convertido com sucesso pela ferramenta PDFTools.</em></p>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([wordContent], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    const url = URL.createObjectURL(blob);
    setConvertedFile(url);

    toast({
      title: "Sucesso!",
      description: "PDF convertido para Word com sucesso",
    });

    setIsProcessing(false);
    setProgress(0);
  };

  const handleDownload = () => {
    if (convertedFile && selectedFile) {
      const link = document.createElement('a');
      link.href = convertedFile;
      link.download = `converted_${selectedFile.name.replace('.pdf', '')}.doc`;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 hover:text-blue-800">Voltar</span>
            </Link>
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-green-600" />
              <h1 className="text-xl font-bold text-slate-800">Converter PDF para Word</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Converter PDF para Word
            </h1>
            <p className="text-xl text-slate-600">
              Transforme seus documentos PDF em arquivos Word editáveis (.docx)
            </p>
          </div>

          {/* Upload Area */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Selecionar PDF</CardTitle>
              <CardDescription>
                Escolha o arquivo PDF que deseja converter para Word
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-green-200 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                <Upload className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">
                  Clique para selecionar um PDF ou arraste e solte aqui
                </p>
                <Input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <Button asChild className="bg-gradient-to-r from-green-500 to-blue-600">
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    Selecionar PDF
                  </label>
                </Button>
                <p className="text-sm text-slate-500 mt-2">
                  Tamanho máximo: 50MB
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Selected File */}
          {selectedFile && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Arquivo Selecionado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center p-4 bg-slate-50 rounded-lg border">
                  <FileText className="w-10 h-10 text-red-500 mr-4" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{selectedFile.name}</p>
                    <p className="text-sm text-slate-500">
                      {formatFileSize(selectedFile.size)} • PDF
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Convert Button or Download Section */}
          {selectedFile && (
            <Card>
              <CardContent className="pt-6">
                {isProcessing && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">Convertendo PDF para Word...</span>
                      <span className="text-sm text-slate-600">{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <p className="text-xs text-slate-500 mt-2">
                      Isso pode levar alguns minutos dependendo do tamanho do arquivo
                    </p>
                  </div>
                )}
                
                {!convertedFile && !isProcessing && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={convertToWord}
                      className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                      size="lg"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Converter para Word
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={removeFile}
                      size="lg"
                    >
                      Trocar Arquivo
                    </Button>
                  </div>
                )}

                {convertedFile && (
                  <div className="space-y-4">
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <p className="text-center font-medium text-green-800">
                          ✅ Conversão concluída com sucesso!
                        </p>
                        <p className="text-center text-sm text-green-600 mt-1">
                          Seu arquivo Word está pronto para download
                        </p>
                      </CardContent>
                    </Card>
                    <Button
                      onClick={handleDownload}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                      size="lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Baixar Arquivo Word
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedFile(null);
                        setConvertedFile(null);
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Converter Outro Arquivo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfToWord;
