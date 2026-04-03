(function() {
    // Usamos o caminho começando com / para não ter erro de pasta
    const URL_JSON = '/produtos.json'; 

    async function injetarProdutos() {
        console.log("Tentando carregar produtos do JSON...");
        try {
            const res = await fetch(URL_JSON);
            const produtos = await res.json();
            
            // 1. Procura o container que está com a mensagem de "Nenhum produto"
            const divs = document.querySelectorAll('div');
            let alvo = null;

            for (const div of divs) {
                if (div.innerText && div.innerText.includes("Nenhum produto encontrado")) {
                    alvo = div.closest('div').parentElement; 
                    break;
                }
            }

            // 2. Se não achar, usa o 'main' do site
            const container = alvo || document.querySelector('main') || document.body;

            if (container && produtos.length > 0) {
                container.innerHTML = `
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; padding: 20px; max-width: 1200px; margin: 0 auto;">
                        ${produtos.map(p => `
                            <div style="background: white; border: 1px solid #eee; border-radius: 12px; padding: 15px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: 0.3s;">
                                <img src="${p.image}" style="width: 100%; height: 200px; object-fit: contain; border-radius: 8px;">
                                <h3 style="font-size: 14px; margin: 15px 0 10px; color: #333; height: 40px; overflow: hidden; line-height: 1.4;">${p.title}</h3>
                                <p style="color: #7b2cbf; font-weight: bold; font-size: 20px; margin-bottom: 15px;">R$ ${p.price}</p>
                                <a href="${p.url}" target="_blank" style="display: block; background: #7b2cbf; color: white; text-decoration: none; padding: 12px; border-radius: 8px; font-weight: bold; font-size: 13px;">VER DETALHES</a>
                            </div>
                        `).join('')}
                    </div>
                `;
                console.log("Vitrine injetada com sucesso!");
            }
        } catch (e) {
            console.error("Erro ao injetar produtos:", e);
        }
    }

    // Roda depois de 1 e 3 segundos para garantir que o Next.js terminou de carregar
    setTimeout(injetarProdutos, 1500);
    setTimeout(injetarProdutos, 3500);
})();
