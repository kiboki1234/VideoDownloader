# AppDescargarVideosV1
Esta app permite descargar videos 
COmandos para que funcione el backend con docker

docker build -t video-downloader .  
docker run -p 5000:5000 -v ${PWD}/downloads:/app/downloads video-downloader

y para el frontend 

npm install 
npm start