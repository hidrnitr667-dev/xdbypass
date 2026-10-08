const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/bypass', async (req, res) => {
    const { url } = req.body;

    if (!url || (!url.includes('loot-labs.com') && !url.includes('lootlink.org') && !url.includes('lootdest.org'))) {
        return res.status(400).json({ success: false, error: 'Ingresa una URL válida de Lootlabs o Lootlink' });
    }

    try {
        const linkId = url.split('/').pop().split('?')[0];

        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Referer': url,
            'Origin': new URL(url).origin
        };

        const response = await axios.get(`https://loot-labs.com/api/locate/${linkId}`, { headers });

        if (response.data && response.data.destination) {
            return res.json({
                success: true,
                targetUrl: response.data.destination
            });
        } else {
            return res.status(422).json({
                success: false,
                error: 'No se pudo obtener el enlace de destino.'
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Error de conexión con el servidor de destino.'
        });
    }
});

app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));
