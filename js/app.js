/**
 * Vellori Adaptador Proativo - RapidAPI (Image Search + Vitrine)
 */
(function() {
    const RAPID_KEY = '24467d1637msh7951559869687cbp188e7bjsne507a2d4806a';
    const RAPID_HOST = 'api-1688.p.rapidapi.com';

    const originalFetch = window.fetch;

    // 1. Interceptor de Buscas (Imagem e Texto)
    window.fetch = async (...args) => {
        const [resource, config] = args;

        // BUSCA POR IMAGEM (Upload ou Link)
        if (typeof resource === 'string' && resource.includes('/product/get-by-image')) {
            console.log("Iniciando busca por imagem via RapidAPI...");
            const bodyData = JSON.parse(config.body);
            const imgTarget = bodyData.base64EncodedImage;

            if (imgTarget.startsWith('http')) {
                const url = `https://${RAPID_HOST}/items/searchByImage?imageUrl=${encodeURIComponent(imgTarget)}&page=1`;
                return originalFetch(url, {
                    method: 'GET',
                    headers: { 'x-rapidapi-key': RAPID_KEY, 'x-rapidapi-host': RAPID_HOST }
                });
            } 
            
            return originalFetch(`https://${RAPID_HOST}/items/searchByImage`, {
                method: 'POST',
                headers: {
                    'x-rapidapi-key': RAPID_KEY,
                    'x-rapidapi-host': RAPID_HOST,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ base64Image: imgTarget, page: '1' })
            });
        }

        return originalFetch(...args);
    };

    // 2. Função para carregar Produtos na Vitrine (Automático)
    async function carregarVitrine(termo = 'eletronicos') {
        console.log("Carregando vitrine inicial...");
        const url = `https://${RAPID_HOST}/item_search?q=${encodeURIComponent(termo)}&page=1`;
        
        try {
            const res = await originalFetch(url, {
                headers: { 'x-rapidapi-key': RAPID_KEY, 'x-rapidapi-host': RAPID_HOST }
            });
            const data = await res.json();
            
            if (data && data.items) {
                renderizarProdutos(data.items);
            }
        } catch (err) {
            console.error("Erro ao carregar vitrine:", err);
        }
    }

    // 3. Renderizar no HTML (Ajustado para o layout do site)
    function renderizarProdutos(itens) {
        const grid = document.querySelector('.grid') || document.querySelector('[class*="grid"]');
        if (!grid) return;

        grid.innerHTML = itens.map(item => `
            <div class="product-card border p-2 rounded shadow-sm bg-white">
                <img src="${item.image}" alt="${item.title}" class="w-full h-40 object-contain">
                <h3 class="text-sm font-bold mt-2 h-10 overflow-hidden">${item.title}</h3>
                <p class="text-purple-700 font-bold">R$ ${(parseFloat(item.price) * 0.8).toFixed(2)}</p>
                <button class="w-full bg-purple-600 text-white py-1 mt-2 rounded text-xs">Ver Detalhes</button>
            </div>
        `).join('');
    }

    // Iniciar vitrine ao carregar a página
    if (document.readyState === 'complete') {
        carregarVitrine();
    } else {
        window.addEventListener('load', carregarVitrine);
    }

    console.log("Motor Vellori Proativo V2 Ativo.");
})();
