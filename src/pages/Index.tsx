
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  FileImage, 
  FilePlus2, 
  Archive,
  Rotate3D,
  FileText
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
      title: "Juntar PDFs",
      description: "Combine múltiplos PDFs em um único documento",
      icon: FilePlus2,
      color: "from-purple-500 to-pink-600",
      path: "/merge-pdf"
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
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-blue-100 dark:border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PDFTools
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-slate-800 dark:text-white mb-6">
            Ferramentas de{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PDF
            </span>{" "}
            que funcionam
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
            Manipule seus documentos PDF de forma gratuita e segura. 
            Apenas ferramentas 100% funcionais, sem demonstrações.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-12">
            Ferramentas Disponíveis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {tools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <Link key={index} to={tool.path} className="group">
                  <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tool.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-center text-slate-600 dark:text-slate-400">
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
      <section className="py-16 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">100% Funcional</h4>
              <p className="text-slate-600 dark:text-slate-400">Todas as ferramentas são completamente funcionais</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Rotate3D className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Rápido e Fácil</h4>
              <p className="text-slate-600 dark:text-slate-400">Interface intuitiva com processamento rápido</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Archive className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Gratuito</h4>
              <p className="text-slate-600 dark:text-slate-400">Todas as ferramentas são completamente gratuitas</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
