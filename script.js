window.addEventListener('load', function() {

    // --- SELECIONANDO OS NOVOS ELEMENTOS ---
    const statusIndicator = document.getElementById('statusIndicator');
    const limparTextoBtn = document.getElementById('limparTextoBtn');
    const copiarTextoBtn = document.getElementById('copiarTextoBtn');
    
    // --- LÓGICA DE TRADUÇÃO POR VOZ ---
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const iniciarVozBtn = document.getElementById('iniciarVozBtn');
    const textoTranscritoVozEl = document.getElementById('textoTranscritoVoz');

    if (!window.SpeechRecognition) {
        iniciarVozBtn.disabled = true;
        alert("Seu navegador não suporta o reconhecimento de fala. Tente usar o Google Chrome.");
    } else {
        const recognition = new SpeechRecognition();
        let lastFinalTranscript = '';
        recognition.lang = 'pt-BR';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            iniciarVozBtn.textContent = '🎙️ Ouvindo... Pode falar!';
            iniciarVozBtn.style.backgroundColor = '#dc3545';
            statusIndicator.classList.add('listening'); // ATIVA O INDICADOR
            lastFinalTranscript = '';
            textoTranscritoVozEl.textContent = '...';
        };

        recognition.onend = () => {
            iniciarVozBtn.textContent = '▶️ Iniciar Tradução de Voz';
            iniciarVozBtn.style.backgroundColor = '#007bff';
            statusIndicator.classList.remove('listening'); // DESATIVA O INDICADOR
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = 0; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            textoTranscritoVozEl.textContent = finalTranscript + interimTranscript;

            if (finalTranscript.trim() !== '' && finalTranscript !== lastFinalTranscript) {
                lastFinalTranscript = finalTranscript;
                if (window.vlibras && window.vlibras.widget) {
                    window.vlibras.widget.play(finalTranscript);
                }
            }
        };

        iniciarVozBtn.addEventListener('click', () => {
            if (iniciarVozBtn.textContent.includes('Ouvindo')) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });
    }

    // --- LÓGICA DE TRADUÇÃO POR TEXTO ---
    const iniciarTextoBtn = document.getElementById('iniciarTextoBtn');
    const textoParaTraduzirEl = document.getElementById('textoParaTraduzir');

    iniciarTextoBtn.addEventListener('click', () => {
        const texto = textoParaTraduzirEl.value;
        if (texto.trim() === "") {
            alert("Por favor, digite ou cole algum texto para traduzir.");
            return;
        }
        textoTranscritoVozEl.textContent = texto;
        if (window.vlibras && window.vlibras.widget) {
            window.vlibras.widget.play(texto);
        }
    });

    // --- LÓGICA DOS NOVOS BOTÕES ---

    // Lógica para o botão LIMPAR
    limparTextoBtn.addEventListener('click', () => {
        textoParaTraduzirEl.value = ''; // Limpa a caixa de texto
        textoTranscritoVozEl.textContent = '...'; // Limpa o resultado da transcrição
    });

    // Lógica para o botão COPIAR
    copiarTextoBtn.addEventListener('click', () => {
        const textoParaCopiar = textoTranscritoVozEl.textContent;
        // Verifica se há algo para copiar além do placeholder
        if (textoParaCopiar && textoParaCopiar !== '...') {
            navigator.clipboard.writeText(textoParaCopiar).then(() => {
                // Feedback visual para o usuário
                copiarTextoBtn.textContent = '✅ Copiado!';
                setTimeout(() => {
                    copiarTextoBtn.textContent = '📋 Copiar';
                }, 2000); // Volta ao normal depois de 2 segundos
            }).catch(err => {
                console.error('Falha ao copiar texto: ', err);
            });
        }
    });

});
