# Imagen base de Python con Slim para mantenerlo ligero
FROM python:3.12-slim

# Actualizar paquetes e instalar dependencias
RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
    wget \
    && apt-get clean

# Crear directorio de trabajo
WORKDIR /app

# Copiar los archivos del backend
COPY . /app/

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Exponer el puerto para FastAPI
EXPOSE 5000

# Comando para ejecutar el servidor
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
