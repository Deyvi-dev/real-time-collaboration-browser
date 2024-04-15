import express from 'express';
import socketio from 'socket.io';
import http from 'http';
import fs from 'fs';
import path from 'path';

const app = express();
const httpServer = http.createServer(app);
const io = new socketio.Server(httpServer);

app.use('/', express.static(path.resolve(__dirname, '..', 'public')));

app.use('/test', express.static(path.resolve(__dirname, '..', 'public', 'test.html')));
app.use('/guest', express.static(path.resolve(__dirname, '..', 'public', 'guest.html')));

io.on('connection', (socket) => {
    console.log('Nova conexão', socket.id);
    io.emit('new-connect', socket.id);
    socket.on('events', (event) => {
        console.log('Novo evento', event);
        io.emit('receive', event);
        // Grava o evento em um arquivo JSON
        gravarEvento(event);
    });
});

httpServer.listen(3333, () => {
    console.log('Servidor ligado na porta 3333');
});

// Função para gravar evento em arquivo JSON
//@ts-ignore
function gravarEvento(event) {
    const filePath = path.resolve(__dirname, 'eventos.json');
    let eventos = [];

    // Verifica se o arquivo existe
    if (fs.existsSync(filePath)) {
        // Se existir, lê o conteúdo do arquivo
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        eventos = JSON.parse(fileContent);
    }
//@ts-ignore
    // Adiciona o novo evento ao array
    eventos.push(event);

    // Escreve o array atualizado no arquivo JSON
    fs.writeFileSync(filePath, JSON.stringify(eventos, null, 2));
}
