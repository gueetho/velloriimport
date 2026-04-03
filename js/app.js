(function() {
    // Busca o arquivo que você criou no GitHub
    const ARQUIVO_JSON = 'produtos.json'; 

    async function carregarVitrine() {
        try {
            const res = await fetch(ARQUIVO_JSON);
            const produtos = await res.json();
            
            const grid = document.querySelector('.grid') || document.body;
            
            grid.innerHTML = produtos.map(item => `
                <div class="product-card" style="border:1px solid #ddd; padding:10px; margin:10px; float:left; width:200px; background:#fff; border-radius:8px;">
                    <img src="${item.image}" style="width:100%; height:150px; object-fit:cover;">
                    <h4 style="font-size:12px; height:35px; overflow:hidden; margin:10px 0;">${item.title}</h4>
                    <p style="color:purple; font-weight:bold;">R$ ${item.price}</p>
                    <a href="${item.url}" target="_blank" style="display:block; background:purple; color:white; text-align:center; padding:5px; text-decoration:none; border-radius:4px; font-size:11px;">Ver na 1688</a>
                </div>
            `).join('');

            console.log("Vitrine carregada com sucesso!");
        } catch (err) {
            console.error("Erro ao carregar o JSON local:", err);
        }
    }

    window.onload = carregarVitrine;
})();
