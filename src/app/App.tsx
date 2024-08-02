import './styles/normalize.css';
import './styles/global.css';
import { Home } from '../pages/home';
import { SongProvider } from '../shared/providers';

const App: React.FC = () => {
  return (
    <SongProvider>
      <Home />
    </SongProvider>
  );
};

export default App;
