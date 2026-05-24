const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// Busca animes
app.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json({ error: 'Informe ?q=nome_do_anime' });

        const { data } = await axios.get(`https://gogoanime.cl/search.html?keyword=${encodeURIComponent(q)}`);
        const $ = cheerio.load(data);

        const results = [];
        $('.last_episode a, .img a').each((i, el) => {
            const title = $(el).attr('title') || $(el).text().trim();
            const link = $(el).attr('href');
            if (title && link) results.push({ title, link });
        });

        res.json(results.slice(0, 10));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => res.send('API de Animes rodando!'));

app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
