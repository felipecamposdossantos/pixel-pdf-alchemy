
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RotateCw, Upload, ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";

const RotatePdf = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(90);
  const [pageRange, setPageRange] = useState("all");
  const [customPages, setCustomPages] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
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
    
    // Simulação do processamento
    setTimeout(() => {
      setIsProcessing(false);
      // Simular arquivo rotacionado
      const blob = new Blob([`PDF rotacionado ${rotation}°`], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setRotatedFile(url);
      toast({
        title: "Sucesso!",
        description: `PDF rotacionado ${rotation}° com sucesso!`,
      });
    }, 2000);
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

  const rotationOptions = [
    { value: 90, label: "90° (Horário)" },
    { value: 180, label: "180° (Inverter)" },
    { value: 270, label: "270° (Anti-horário)" },
  ];

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
                Gire as páginas do seu PDF na orientação correta
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
                <Label className="text-lg font-medium text-slate-700">Ângulo de rotação:</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {rotationOptions.map((option) => (
                    <Card
                      key={option.value}
                      className={`cursor-pointer transition-all ${
                        rotation === option.value ? "ring-2 ring-teal-500 bg-teal-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setRotation(option.value)}
                    >
                      <CardContent className="p-4 text-center">
                        <RotateCw className="w-8 h-8 mx-auto mb-2 text-teal-600" />
                        <p className="font-medium">{option.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-medium text-slate-700">Páginas a girar:</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card
                    className={`cursor-pointer transition-all ${
                      pageRange === "all" ? "ring-2 ring-teal-500 bg-teal-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setPageRange("all")}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-medium">Todas as páginas</h3>
                      <p className="text-sm text-gray-600">Girar todo o documento</p>
                    </CardContent>
                  </Card>
                  <Card
                    className={`cursor-pointer transition-all ${
                      pageRange === "custom" ? "ring-2 ring-teal-500 bg-teal-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setPageRange("custom")}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-medium">Páginas específicas</h3>
                      <p className="text-sm text-gray-600">Ex: 1,3,5-8</p>
                    </CardContent>
                  </Card>
                </div>

                {pageRange === "custom" && (
                  <div>
                    <Label htmlFor="custom-pages">Páginas específicas</Label>
                    <Input
                      id="custom-pages"
                      value={customPages}
                      onChange={(e) => setCustomPages(e.target.value)}
                      placeholder="1,3,5-8"
                      className="mt-2"
                    />
                  </div>
                )}
              </div>

              {!rotatedFile ? (
                <Button
                  onClick={handleRotate}
                  disabled={!file || isProcessing}
                  className="w-full bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-white py-3 text-lg"
                >
                  {isProcessing ? (
                    <>Girando...</>
                  ) : (
                    <>
                      <RotateCw className="w-5 h-5 mr-2" />
                      Girar PDF
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <p className="text-center font-medium text-green-800">
                        ✅ PDF rotacionado com sucesso!
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
                    Baixar PDF Rotacionado
                  </Button>
                  <Button
                    onClick={() => {
                      setFile(null);
                      setRotatedFile(null);
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
