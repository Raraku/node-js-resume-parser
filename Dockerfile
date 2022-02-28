FROM node:17

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y \
    curl  \
    git  \
    gcc \
    pkg-config  \
    python3-dev \
    libffi-dev \
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

RUN cd /opt/pyresparser && pip3 install .

# spaCy
RUN pip3 install spacy==2.3.5
RUN python3 -m spacy download en_core_web_sm

# nltk
RUN python3 -m nltk.downloader words
RUN python3 -m nltk.downloader stopwords

COPY . .

ENV NODE_ENV=production

EXPOSE $PORT

CMD [ "node", "app.js" ]