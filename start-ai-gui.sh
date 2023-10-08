docker build -t azure-ai-gui .
docker run -dp 127.0.0.1:8000:8000 azure-ai-gui