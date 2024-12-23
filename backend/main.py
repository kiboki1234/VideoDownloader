from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import subprocess
import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import mimetypes

# Carga las variables de entorno
load_dotenv()

# Configuración de Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("CLOUD_API_KEY"),
    api_secret=os.getenv("CLOUD_API_SECRET")
)

app = FastAPI()

# Habilitar CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Cambia esto a ["http://localhost:3000"] para mayor seguridad
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear directorio temporal para descargas
DOWNLOAD_DIR = "downloads"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

def get_unique_filename(base_name, extension):
    counter = 1
    unique_name = f"{base_name}{extension}"
    while os.path.exists(os.path.join(DOWNLOAD_DIR, unique_name)):
        unique_name = f"{base_name}_{counter}{extension}"
        counter += 1
    return os.path.join(DOWNLOAD_DIR, unique_name)

@app.post("/download/mp4/")
async def download_mp4(url: str = Form(...)):
    try:
        # Extraer título del video y generar nombre basado en el título
        title_command = [
            "yt-dlp",
            "--get-title",
            "--no-playlist",
            url
        ]
        title_result = subprocess.run(title_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        title = title_result.stdout.strip()

        if not title:
            raise HTTPException(status_code=500, detail="No se pudo obtener el título del video.")

        # Reemplazar caracteres inválidos para nombres de archivo
        safe_title = "".join([c if c.isalnum() or c in " -_." else "_" for c in title])

        # Crear ruta de archivo única
        file_path = os.path.join(DOWNLOAD_DIR, f"{safe_title}.mp4")

        # Descargar el video
        command = [
            "yt-dlp",
            "-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]",
            "--merge-output-format", "mp4",
            "-o", file_path,
            "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            url
        ]
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        # Log para depuración
        print(result.stdout.decode("utf-8"))
        print(result.stderr.decode("utf-8"))

        # Verificar si el archivo existe
        if not os.path.exists(file_path):
            raise HTTPException(status_code=500, detail="El archivo no fue generado correctamente.")

        # Devolver la URL para descargar el archivo
        return {"url": f"/download/file/{os.path.basename(file_path)}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/convert/mp3/")
async def convert_to_mp3(url: str = Form(...)):
    try:
        # Obtener el título del video
        title_command = [
            "yt-dlp",
            "--get-title",
            "--no-playlist",
            url
        ]
        title_result = subprocess.run(title_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        title = title_result.stdout.strip()

        if not title:
            raise HTTPException(status_code=500, detail="No se pudo obtener el título del video.")

        # Reemplazar caracteres inválidos
        safe_title = "".join([c if c.isalnum() or c in " -_." else "_" for c in title])

        # Crear archivo de salida
        file_path = os.path.join(DOWNLOAD_DIR, f"{safe_title}.mp3")

        # Descargar y convertir el audio
        command = [
            "yt-dlp",
            "-x",
            "--audio-format", "mp3",
            "-o", file_path,
            "--user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            url
        ]
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        # Log para depuración
        print(result.stdout.decode("utf-8"))
        print(result.stderr.decode("utf-8"))

        # Verificar si el archivo existe
        if not os.path.exists(file_path):
            raise HTTPException(status_code=500, detail="El archivo no fue generado correctamente.")

        # Devolver la URL para descargar el archivo
        return {"url": f"/download/file/{os.path.basename(file_path)}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/download/file/{filename}")
async def get_file(filename: str):
    file_path = os.path.join(DOWNLOAD_DIR, filename)

    # Verificar si el archivo existe antes de enviarlo
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado.")

    # Enviar el archivo como respuesta
    return FileResponse(file_path)
