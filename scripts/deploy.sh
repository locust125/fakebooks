docker buildx build -t fractal_web --platform linux/amd64 .   &&
docker tag fractal_web gcr.io/pdvmovil-1ca62/fractal_web      &&
docker push gcr.io/pdvmovil-1ca62/fractal_web   