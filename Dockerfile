FROM node:17

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y \
    curl  \
    git  \
    pkg-config  \
    cmake \
    libpoppler-cpp-dev  \
    tesseract-ocr  \
    libtesseract-dev  \
    unzip  \
    antiword \
    poppler-utils && \ 
    rm -rf /var/lib/apt/lists/*

# Install PDF converter
RUN wget --no-check-certificate https://dl.xpdfreader.com/xpdf-tools-linux-4.03.tar.gz && \
    tar -xvf xpdf-tools-linux-4.03.tar.gz && cp xpdf-tools-linux-4.03/bin64/pdftotext /usr/local/bin


RUN npm install

COPY . .

ENV NODE_ENV=production

EXPOSE $PORT

CMD [ "node", "app.js" ]