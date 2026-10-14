window.utterances = []; 

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('start-overlay');
    const bgMusic = document.getElementById('bgmusic');
    const startButton = document.getElementById('start');
    const textoContainer = document.getElementById('texto');

    let vozesDisponiveis = [];
    
    function carregarVozes() {
        vozesDisponiveis = window.speechSynthesis.getVoices();
    }
    
    carregarVozes();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = carregarVozes;
    }

    overlay.addEventListener('click', () => {
        overlay.style.display = 'none';

        bgMusic.volume = 0.4;
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => console.error("Erro no áudio de fundo: ", error));
        }

        iniciarNarracao();

        textoContainer.style.animation = 'none';
        setTimeout(() => {
            textoContainer.style.animation = 'scrollText 36s linear forwards';
        }, 100);
    });

    function iniciarNarracao() {
        window.speechSynthesis.cancel();
        window.utterances = []; 

        const elementos = document.querySelectorAll('#texto h1, #texto p, #texto h2');
        let index = 0;

        function falarProximo() {
            if (index < elementos.length) {
                const textoLimpo = elementos[index].innerText;
                const fala = new SpeechSynthesisUtterance(textoLimpo);
                
                window.utterances.push(fala); 

                fala.lang = 'pt-BR';
                
                // VELOCIDADE AUMENTADA (era 0.9, agora é 1.25)
                fala.rate = 1.25; 
                fala.pitch = 1.3; 

                if (vozesDisponiveis.length === 0) carregarVozes();
                
                const vozFeminina = vozesDisponiveis.find(voz => 
                    (voz.lang === 'pt-BR' || voz.lang === 'pt_BR') && 
                    (voz.name.toLowerCase().includes('maria') || 
                     voz.name.toLowerCase().includes('google') || 
                     voz.name.toLowerCase().includes('luciana') || 
                     voz.name.toLowerCase().includes('feminino'))
                );
                
                if (vozFeminina) {
                    fala.voice = vozFeminina;
                } else {
                    const vozPadrao = vozesDisponiveis.find(voz => voz.lang === 'pt-BR' || voz.lang === 'pt_BR');
                    if (vozPadrao) fala.voice = vozPadrao;
                }

                fala.onend = () => {
                    index++;
                    // Pausa ligeiramente menor entre as frases para combinar com a urgência
                    setTimeout(falarProximo, 300); 
                };

                fala.onerror = (e) => {
                    console.error("Erro na voz: ", e);
                    index++;
                    setTimeout(falarProximo, 300);
                };

                window.speechSynthesis.speak(fala);
            }
        }

        falarProximo();
    }

    startButton.addEventListener('click', () => {
        window.speechSynthesis.cancel();
        window.location.href = 'jogo.html'; 
    });
});