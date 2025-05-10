import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home } from 'lucide-react';

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-semibold text-neutral-800 mt-4">Página não encontrada</h2>
        <p className="text-neutral-600 mt-2 mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link to="/">
          <Button icon={<Home size={18} />}>
            Voltar para a página inicial
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;