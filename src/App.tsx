import react from 'react';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { AppRoutes } from './pages/Routes';
import { GlobalProvider } from './contexts/GlobalProvider';
import './styles/global.css';
// import 'antd/dist/antd.min.js';

function App() {
  return (
    <GlobalProvider>
      <ConfigProvider
        locale={ptBR}
        theme={{
          token: {
            colorPrimary: '#4338ca',
            colorPrimaryHover: '#4f46e5',
          },
        }}
      >
        <AppRoutes />
      </ConfigProvider>
    </GlobalProvider>
  );
}

export default App;
