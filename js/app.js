/**
 * Vellori Adaptador Proativo - RapidAPI Image Search
 * Token: 24467d1637msh7951559869687cbp188e7bjsne507a2d4806a
 */
(function() {
    const RAPID_KEY = '24467d1637msh7951559869687cbp188e7bjsne507a2d4806a';
    const RAPID_HOST = 'api-1688.p.rapidapi.com';

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const [resource, config] = args;

        // Se o site clonado tentar buscar imagem na API da Pindau...
        if (typeof resource === 'string' && resource.includes('/product/get-by-image')) {
            console.log("Iniciando busca por imagem via RapidAPI Vellori...");
            
            const bodyData = JSON.parse(config.body);
            const imgTarget = bodyData.base64EncodedImage;

            // Se for um link (URL), usamos o endpoint GET conforme a imagem f6f549
            if (imgTarget.startsWith('http')) {
                const url = `https://${RAPID_HOST}/items/searchByImage?imageUrl=${encodeURIComponent(imgTarget)}&page=1`;
                return originalFetch(url, {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-key': RAPID_KEY,
                        'x-rapidapi-host': RAPID_HOST
                    }
                });
            } 
            
            // Se for arquivo subido (Base64), enviamos via POST (comum nessa API)
            return originalFetch(`https://${RAPID_HOST}/items/searchByImage`, {
                method: 'POST',
                headers: {
                    'x-rapidapi-key': RAPID_KEY,
                    'x-rapidapi-host': RAPID_HOST,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    base64Image: imgTarget,
                    page: '1'
                })
            });
        }

        return originalFetch(...args);
    };

    console.log("Motor Vellori ativo e aguardando busca por imagem.");
})();