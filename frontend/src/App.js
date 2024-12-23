import React from 'react';
import Downloader from './components/Downloader';
import './App.css'

function App() {
  return (
    <div className="App">
      <header>
        <h1>Aplicación para Descargar Videos</h1>
      </header>
      <main>
        <Downloader />
      </main>
      <footer style={{ textAlign: 'center', marginTop: '20px', padding: '10px', fontSize: '12px', color: 'white' }}>
                &copy; {new Date().getFullYear()} Kibotech. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default App;