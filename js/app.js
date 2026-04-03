(function() {
    const RAPID_KEY = '24467d1637msh7951559869687cbp188e7bjsne507a2d4806a';
    const RAPID_HOST = 'api-1688.p.rapidapi.com';
    // Proxy para evitar erro de CORS (bloqueio do navegador)
    const PROXY = 'https://cors-anywhere.herokuapp.com/'; 

    async function carregarProdutos() {
        console.log("Tentando puxar produtos...");
        // Tentamos com o proxy, se falhar, tentamos direto
        const url = `https://${RAPID_HOST}/item_search?q=eletronicos&page=1`;
        
        try {
            const res = await fetch(url, {
                headers: {
                    'x-rapidapi-key': RAPID_KEY,
                    'x-rapidapi-host': RAPID_HOST
                }
            });
            const data = await res.json();
            console.log("Dados recebidos:", data);

            if (data && data.items) {
                renderizar(data.items);
            } else {
                console.log("API respondeu, mas sem produtos.");
            }
        } catch (err) {
            console.error("Erro feio na API:", err);
        }
    }

    function renderizar(itens) {
        // Tentamos achar qualquer lugar que pareça uma vitrine no seu HTML
        const container = document.querySelector('main') || document.body;
        
        const html = itens.map(item => `
            <div style="border:1px solid #ddd; padding:10px; margin:10px; float:left; width:200px; background:#fff">
                <img src="${item.image}" style="width:100%">
                <h4 style="font-size:12px; height:40px; overflow:hidden">${item.title}</h4>
                <p style="color:purple; font-weight:bold">R$ ${item.price}</p>
            </div>
        `).join('');

        // Cria uma div nova pra não quebrar o layout atual e joga os produtos nela
        const vitrine = document.createElement('div');
        vitrine.innerHTML = `<h2 style="padding:20px">Produtos Sugeridos</h2>${html}`;
        container.prepend(vitrine);
    }

    window.onload = carregarProdutos;
})();
