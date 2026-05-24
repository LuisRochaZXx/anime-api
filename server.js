const express = require('express');
const { execSync } = require('child_process');
const path = require('path');
const app = express();

const GOANIME_PATH = path.join(__dirname, 'goanime');

app.get('/search', (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json({ error: 'Informe ?q=nome_do_anime' });

        // Chama o GoAnime via terminal
        const output = execSync(`${GOANIME_PATH} search "${q}"`, {
            timeout: 15000,
            encoding: 'utf-8'
        });

        res.json({ resultado: output.trim() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/episode', (req, res) => {
    try {
        const { anime, ep } = req.query;
        if (!anime || !ep) return res.json({ error: 'Informe ?anime=NOME&ep=NUMERO' });

        const output = execSync(`${GOANIME_PATH} episode "${anime}" -e ${ep} --print-url`, {
            timeout: 20000,
            encoding: 'utf-8'
        });

        res.json({ url: output.trim() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => res.send('API GoAnime rodando!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
