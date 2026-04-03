(function() {
    const URL_JSON = '/produtos.json';

    async function ajustarVitrine() {
        try {
            const res = await fetch(URL_JSON);
            const produtos = await res.json();

            // 1. Acha o elemento que diz "Nenhum produto encontrado"
            const elementos = document.querySelectorAll('*');
            let msgErro = null;
            for (let el of elementos) {
                if (el.childNodes.length === 1 && el.innerText === "Nenhum produto encontrado") {
                    msgErro = el;
                    break;
                }
            }

            if (!msgErro) return;

            // 2. Sobe até o container branco principal
            const containerBranco = msgErro.closest('div').parentElement;
            
            if (containerBranco && produtos.length > 0) {
                // Limpa o ícone de interrogação e o texto de erro
                containerBranco.innerHTML = ''; 
                
                // 3. Aplica o Grid que segue a largura do site
                containerBranco.style.display = "grid";
                containerBranco.style.gridTemplateColumns = "repeat(auto-fill, minmax(200px, 1fr))";
                containerBranco.style.gap = "20px";
                containerBranco.style.padding = "20px";

                // 4. Injeta os cards com link interno (não vai mais pro 1688)
                containerBranco.innerHTML = produtos.map(p => `
                    <div style="background:#fff; border:1px solid #f3f4f6; border-radius:12px; padding:12px; transition:all 0.3s; cursor:pointer;" 
                         onmouseover="this.style.boxShadow='0 10px 15px -3px rgba(0,0,0,0.1)'" 
                         onmouseout="this.style.boxShadow='none'">
                        
                        <div style="width:100%; height:180px; overflow:hidden; border-radius:8px; margin-bottom:12px;">
                            <img src="${p.image}" style="width:100%; height:100%; object-fit:contain;">
                        </div>

                        <h3 style="font-size:13px; font-weight:600; color:#1f2937; height:38px; overflow:hidden; margin-bottom:8px; line-height:1.4;">
                            ${p.title}
                        </h3>

                        <div style="display:flex; align-items:center; justify-content:space-between; margin-top:10px;">
                            <span style="color:#7c3aed; font-size:18px; font-weight:800;">R$ ${p.price}</span>
                        </div>

                        <a href="/product/${p.id}" style="display:block; width:100%; background:#7c3aed; color:#fff; text-align:center; padding:10px; border-radius:8px; margin-top:12px; text-decoration:none; font-size:12px; font-weight:bold;">
                            VER DETALHES
                        </a>
                    </div>
                `).join('');
            }
        } catch (e) {
            console.error("Erro ao montar vitrine:", e);
        }
    }

    // Tenta rodar em vários tempos para vencer o carregamento lento do site original
    window.addEventListener('load', ajustarVitrine);
    setTimeout(ajustarVitrine, 1000);
    setTimeout(ajustarVitrine, 3000);
})();
