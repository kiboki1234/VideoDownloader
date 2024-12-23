import React from 'react';
import Downloader from './components/Downloader';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Aplicación para Descargar Videos</h1>
      </header>
      <main>
        <Downloader />
      </main>
      <footer>
        <p>Desarrollado por [Tu Nombre]</p>
      </footer>
    </div>
  );
}

export default App;