import app from './src/app.js';

const port = 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}. Access it at http://localhost:${port}`);
});