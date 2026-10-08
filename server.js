const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/bypass', async (req, res) => {
    const { url } = req.body;

    if (!url || (!url.includes('lootlabs.com') && !url.includes('links.lootlabs.gg') && !url.includes('lootlink.org') && !url.includes('lootdest.org'))) {
        return res.status(400).json({ success: false, error: 'Ingresa una URL válida de Lootlabs o Lootlink.' });
    }

    try {
        const parsedUrl = new URL(url);
        const dataParam = parsedUrl.searchParams.get('data') || parsedUrl.pathname.split('/').pop();

        if (!dataParam) {
            return res.status(400).json({ success: false, error: 'No se pudo extraer el identificador del enlace.' });
        }

        // Petición mejorada simulando un navegador real para evitar bloqueos
        const response = await axios.get(`https://lootlabs.com/api/v1/links/target?id=${dataParam}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Referer': url,
                'Origin': parsedUrl.origin
            }
        });

        if (response.data && (response.data.destination || response.data.url)) {
            return res.json({
                success: true,
                targetUrl: response.data.destination || response.data.url
            });
        } else {
            return res.status(422).json({
                success: false,
                error: 'No se pudo obtener el enlace de destino.'
            });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ 
            success: false, 
            error: 'Error de conexión con el servidor de destino.' 
        });
    }
});

app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));
