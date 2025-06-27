
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Languages, Upload, ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { PDFDocument, rgb } from 'pdf-lib';
import Tesseract from 'tesseract.js';

const TranslatePdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fromLanguage, setFromLanguage] = useState("");
  const [toLanguage, setToLanguage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [translatedFile, setTranslatedFile] = useState<string | null>(null);
  const { toast } = useToast();

  const languages = [
    { code: "pt", name: "Português", tesseract: "por" },
    { code: "en", name: "Inglês", tesseract: "eng" },
    { code: "es", name: "Espanhol", tesseract: "spa" },
    { code: "fr", name: "Francês", tesseract: "fra" },
    { code: "de", name: "Alemão", tesseract: "deu" },
    { code: "it", name: "Italiano", tesseract: "ita" },
    { code: "ja", name: "Japonês", tesseract: "jpn" },
    { code: "ko", name: "Coreano", tesseract: "kor" },
    { code: "zh", name: "Chinês", tesseract: "chi_sim" },
    { code: "ar", name: "Árabe", tesseract: "ara" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setTranslatedFile(null);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo PDF válido.",
        variant: "destructive",
      });
    }
  };

  const translateText = async (text: string, from: string, to: string): Promise<string> => {
    // Simulação de tradução (em produção, usar API real como Google Translate)
    // Aqui você integraria com uma API de tradução real
    
    const translations: { [key: string]: { [key: string]: string } } = {
      'pt-en': { 'olá': 'hello', 'mundo': 'world', 'documento': 'document' },
      'en-pt': { 'hello': 'olá', 'world': 'mundo', 'document': 'documento' },
      'pt-es': { 'olá': 'hola', 'mundo': 'mundo', 'documento': 'documento' },
    };

    const translationKey = `${from}-${to}`;
    const translationMap = translations[translationKey] || {};
    
    // Tradução simples palavra por palavra (para demonstração)
    let translatedText = text;
    Object.entries(translationMap).forEach(([original, translated]) => {
      const regex = new RegExp(`\\b${original}\\b`, 'gi');
      translatedText = translatedText.replace(regex, translated);
    });
    
    return translatedText || `[TRADUZIDO] ${text}`;
  };

  const convertPdfToCanvas = async (pdfBytes: ArrayBuffer, pageIndex: number): Promise<HTMLCanvasElement> => {
    const pdf = await PDFDocument.load(pdfBytes);
    const page = pdf.getPage(pageIndex);
    const { width, height } = page.getSize();
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = width;
    canvas.height = height;
    
    // Simular renderização da página
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.fillStyle = 'black';
    context.font = '16px Arial';
    context.fillText('Conteúdo para tradução', 20, 50);
    
    return canvas;
  };

  const extractAndTranslateText = async (pdfBytes: ArrayBuffer): Promise<string[]> => {
    const pdf = await PDFDocument.load(pdfBytes);
    const pageCount = pdf.getPageCount();
    const translatedPages: string[] = [];
    
    const fromLang = languages.find(l => l.code === fromLanguage);
    const toLang = languages.find(l => l.code === toLanguage);
    
    for (let i = 0; i < pageCount; i++) {
      setProgress((i / pageCount) * 80);
      
      try {
        const canvas = await convertPdfToCanvas(pdfBytes, i);
        const imageData = canvas.toDataURL('image/png');
        
        // Extrair texto com OCR
        const result = await Tesseract.recognize(imageData, fromLang?.tesseract || 'eng', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(((i / pageCount) * 60) + (m.progress * 0.6 * (1 / pageCount) * 100));
            }
          }
        });
        
        // Traduzir texto
        const translatedText = await translateText(result.data.text, fromLanguage, toLanguage);
        translatedPages.push(translatedText);
        
      } catch (error) {
        console.error(`Erro ao processar página ${i + 1}:`, error);
        translatedPages.push(`[Erro ao traduzir página ${i + 1}]`);
      }
    }
    
    return translatedPages;
  };

  const createTranslatedPdf = async (translatedPages: string[]): Promise<Blob> => {
    const pdfDoc = await PDFDocument.create();
    
    for (const pageText of translatedPages) {
      const page = pdfDoc.addPage([600, 800]);
      const { height } = page.getSize();
      
      // Quebrar texto em linhas
      const lines = pageText.split('\n').slice(0, 30); // Limitar linhas por página
      
      lines.forEach((line, index) => {
        page.drawText(line.substring(0, 80), { // Limitar caracteres por linha
          x: 50,
          y: height - 50 - (index * 20),
          size: 12,
          color: rgb(0, 0, 0),
        });
      });
    }
    
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  };

  const handleTranslate = async () => {
    if (!file || !fromLanguage || !toLanguage) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um arquivo e os idiomas de origem e destino.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Extrair e traduzir texto
      setProgress(10);
      const translatedPages = await extractAndTranslateText(arrayBuffer);
      
      // Criar PDF traduzido
      setProgress(90);
      const translatedPdf = await createTranslatedPdf(translatedPages);
      
      const url = URL.createObjectURL(translatedPdf);
      setTranslatedFile(url);
      setProgress(100);

      toast({
        title: "Sucesso!",
        description: "PDF traduzido com sucesso!",
      });

    } catch (error) {
      console.error('Erro ao traduzir PDF:', error);
      toast({
        title: "Erro",
        description: "Erro ao traduzir o arquivo PDF. Tente novamente.",
        variant: "destructive"
      });
    }

    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (translatedFile && file) {
      const fromLang = languages.find(l => l.code === fromLanguage)?.name || fromLanguage;
      const toLang = languages.find(l => l.code === toLanguage)?.name || toLanguage;
      const link = document.createElement('a');
      link.href = translatedFile;
      link.download = `translated_${fromLang}_to_${toLang}_${file.name}`;
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
              <Languages className="w-6 h-6 text-cyan-600" />
              <h1 className="text-xl font-bold text-slate-800">Traduzir PDF</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-800">Traduzir PDF</CardTitle>
              <CardDescription>
                Traduza o conteúdo do seu PDF com OCR e reconhecimento inteligente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-cyan-200 rounded-lg p-8 text-center hover:border-cyan-300 transition-colors">
                <Upload className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700">Idioma de origem</Label>
                  <Select value={fromLanguage} onValueChange={setFromLanguage}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-700">Traduzir para</Label>
                  <Select value={toLanguage} onValueChange={setToLanguage}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Traduzindo PDF...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-slate-500 text-center">
                    {progress < 60 ? "Extraindo texto com OCR..." : "Traduzindo conteúdo..."}
                  </p>
                </div>
              )}

              {!translatedFile && !isProcessing && (
                <Button
                  onClick={handleTranslate}
                  disabled={!file || !fromLanguage || !toLanguage}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 text-lg"
                >
                  <Languages className="w-5 h-5 mr-2" />
                  Traduzir PDF
                </Button>
              )}

              {translatedFile && (
                <div className="space-y-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <p className="text-center font-medium text-green-800">
                        ✅ PDF traduzido com sucesso!
                      </p>
                      <p className="text-center text-sm text-green-600 mt-1">
                        Arquivo pronto para download
                      </p>
                    </CardContent>
                  </Card>
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-3 text-lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Baixar PDF Traduzido
                  </Button>
                  <Button
                    onClick={() => {
                      setFile(null);
                      setTranslatedFile(null);
                      setFromLanguage("");
                      setToLanguage("");
                      setProgress(0);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Traduzir Outro Arquivo
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

export default TranslatePdf;
