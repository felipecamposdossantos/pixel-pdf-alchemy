
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  FileImage, 
  FileText, 
  FilePlus2, 
  Scissors, 
  Languages, 
  Archive,
  Rotate3D,
  Lock,
  Unlock,
  FileCheck
} from "lucide-react";

const Index = () => {
  const tools = [
    {
      title: "Imagens para PDF",
      description: "Converta JPG, PNG e outras imagens em PDF",
      icon: FileImage,
      color: "from-blue-500 to-purple-600",
      path: "/images-to-pdf"
    },
    {
      title: "PDF para Word",
      description: "Converta seus PDFs em documentos Word editáveis",
      icon: FileText,
      color: "from-green-500 to-blue-600",
      path: "/pdf-to-word"
    },
    {
      title: "Juntar PDFs",
      description: "Combine múltiplos PDFs em um único documento",
      icon: FilePlus2,
      color: "from-purple-500 to-pink-600",
      path: "/merge-pdf"
    },
    {
      title: "Dividir PDF",
      description: "Extraia páginas ou divida seu PDF em vários arquivos",
      icon: Scissors,
      color: "from-orange-500 to-red-600",
      path: "/split-pdf"
    },
    {
      title: "Traduzir PDF",
      description: "Traduza o conteúdo do seu PDF para outros idiomas",
      icon: Languages,
      color: "from-cyan-500 to-blue-600",
      path: "/translate-pdf"
    },
    {
      title: "Comprimir PDF",
      description: "Reduza o tamanho do seu PDF mantendo a qualidade",
      icon: Archive,
      color: "from-indigo-500 to-purple-600",
      path: "/compress-pdf"
    },
    {
      title: "Girar PDF",
      description: "Gire as páginas do seu PDF na orientação correta",
      icon: Rotate3D,
      color: "from-teal-500 to-green-600",
      path: "/rotate-pdf"
    },
    {
      title: "Proteger PDF",
      description: "Adicione senha e proteja seus documentos",
      icon: Lock,
      color: "from-red-500 to-pink-600",
      path: "/protect-pdf"
    },
    {
      title: "Desbloquear PDF",
      description: "Remove senhas e restrições de PDFs protegidos",
      icon: Unlock,
      color: "from-yellow-500 to-orange-600",
      path: "/unlock-pdf"
    },
    {
      title: "Validar PDF",
      description: "Verifique a integridade e validade do seu PDF",
      icon: FileCheck,
      color: "from-emerald-500 to-teal-600",
      path: "/validate-pdf"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PDFTools
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
            Todas as ferramentas de{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PDF
            </span>{" "}
            que você precisa
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Converta, edite, comprima e manipule seus documentos PDF de forma gratuita e segura. 
            Todas as ferramentas em um só lugar, sem necessidade de instalação.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Escolha sua ferramenta
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <Link key={index} to={tool.path} className="group">
                  <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {tool.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-center text-slate-600">
                        {tool.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-2">100% Seguro</h4>
              <p className="text-slate-600">Seus arquivos são processados localmente e excluídos automaticamente</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rotate3D className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-2">Rápido e Fácil</h4>
              <p className="text-slate-600">Interface intuitiva com processamento rápido e resultados instantâneos</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Archive className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 mb-2">Gratuito</h4>
              <p className="text-slate-600">Todas as ferramentas são completamente gratuitas, sem limites</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
