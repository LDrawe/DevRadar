import express from 'express';

const app = express();

app.use('/',(request, response) => response.send('Hello World!'));

app.listen(3333,() => console.log('💻 Server Online'));