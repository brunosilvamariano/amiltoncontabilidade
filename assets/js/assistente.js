/**
 * ASSISTENTE VIRTUAL CONTÁBIL GUIADO - HAMILTON CONTABILIDADE
 * Fluxo 100% baseado em opções com pós-atendimento
 */

document.addEventListener('DOMContentLoaded', () => {
    const floatingBtn = document.getElementById('bot-floating-button');
    const chatContainer = document.getElementById('bot-chat-container');
    const closeBtn = document.querySelector('.bot-close');
    const messageArea = document.getElementById('bot-messages-list');
    const typingIndicator = document.getElementById('typing-indicator');

    const WHATSAPP_NUMBER = "5547991597258";
    
    let userContext = {
        service: null,
        detail: null
    };

    // Estrutura de Navegação do Chat
    const flow = {
        start: {
            text: "Olá! Seja bem-vindo à Hamilton Contabilidade. 👋<br><br>Sou seu assistente virtual e vou te guiar para o melhor atendimento. Qual dessas opções mais se aproxima do que você precisa hoje?",
            options: [
                { text: "🚀 Abrir uma Empresa", next: "abertura" },
                { text: "🔄 Trocar de Contador", next: "troca" },
                { text: "📊 Gestão de MEI", next: "mei" },
                { text: "📑 Outros Serviços", next: "outros" }
            ]
        },
        abertura: {
            text: "Excelente escolha! Abrir um negócio é um passo importante. Para eu te direcionar ao especialista certo, qual será o perfil da empresa?",
            options: [
                { text: "Serei sócio único", next: "final", context: { service: "Abertura de Empresa", detail: "Individual" } },
                { text: "Terei sócios", next: "final", context: { service: "Abertura de Empresa", detail: "Sociedade" } },
                { text: "Ainda estou decidindo", next: "final", context: { service: "Abertura de Empresa", detail: "Em fase de decisão" } }
            ]
        },
        troca: {
            text: "Entendido. A troca de contador aqui é simples e sem burocracia. Qual o principal motivo da sua busca por um novo escritório?",
            options: [
                { text: "Busco melhor atendimento", next: "final", context: { service: "Troca de Contador", detail: "Melhoria de Atendimento" } },
                { text: "Redução de custos", next: "final", context: { service: "Troca de Contador", detail: "Custo-benefício" } },
                { text: "Mais tecnologia/agilidade", next: "final", context: { service: "Troca de Contador", detail: "Modernização" } }
            ]
        },
        mei: {
            text: "O MEI precisa de atenção especial para não perder benefícios. Como podemos te ajudar hoje?",
            options: [
                { text: "Abrir meu MEI", next: "final", context: { service: "MEI", detail: "Abertura" } },
                { text: "Regularizar pendências", next: "final", context: { service: "MEI", detail: "Regularização" } },
                { text: "Desenquadrar (Cresci!)", next: "final", context: { service: "MEI", detail: "Desenquadramento/Crescimento" } }
            ]
        },
        outros: {
            text: "Temos soluções completas em contabilidade consultiva, fiscal e trabalhista. Qual sua necessidade principal?",
            options: [
                { text: "Imposto de Renda", next: "final", context: { service: "Outros", detail: "IRPF" } },
                { text: "Folha de Pagamento", next: "final", context: { service: "Outros", detail: "Departamento Pessoal" } },
                { text: "Consultoria Tributária", next: "final", context: { service: "Outros", detail: "Planejamento Fiscal" } }
            ]
        }
    };

    // Abrir/Fechar Chat
    floatingBtn.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
        if (chatContainer.classList.contains('active') && messageArea.children.length === 0) {
            renderStep("start");
        }
    });

    closeBtn.addEventListener('click', () => chatContainer.classList.remove('active'));

    function renderStep(stepKey) {
        const step = flow[stepKey];
        showBotMessage(step.text, step.options);
    }

    function showBotMessage(text, options = []) {
        typingIndicator.style.display = 'block';
        messageArea.scrollTop = messageArea.scrollHeight;

        setTimeout(() => {
            typingIndicator.style.display = 'none';
            const msgDiv = document.createElement('div');
            msgDiv.className = 'message bot';
            msgDiv.innerHTML = `<div>${text}</div>`;
            
            if (options.length > 0) {
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'bot-actions';
                options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'action-btn';
                    btn.textContent = opt.text;
                    btn.onclick = () => handleSelection(opt);
                    actionsDiv.appendChild(btn);
                });
                msgDiv.appendChild(actionsDiv);
            }
            
            messageArea.appendChild(msgDiv);
            messageArea.scrollTop = messageArea.scrollHeight;
        }, 800);
    }

    function showUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user';
        msgDiv.textContent = text;
        messageArea.appendChild(msgDiv);
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    function handleSelection(option) {
        showUserMessage(option.text);
        
        if (option.context) {
            userContext = { ...userContext, ...option.context };
        }

        if (option.next === "final") {
            showBotMessage("Perfeito! Já organizei suas informações. Agora vou te conectar com nosso contador especialista para finalizar seu atendimento via WhatsApp.");
            setTimeout(() => {
                const finishBtn = { text: "✅ Falar com Contador agora", action: "send" };
                showBotMessage("Clique no botão abaixo para enviar os detalhes da sua solicitação:", [finishBtn]);
            }, 1000);
        } else if (option.action === "send") {
            finishAndSend();
        } else if (option.action === "restart") {
            messageArea.innerHTML = '';
            renderStep("start");
        } else if (option.action === "close") {
            showBotMessage("A Hamilton Contabilidade agradece seu contato! Estaremos à disposição quando precisar. Tenha um excelente dia! ✨");
            setTimeout(() => {
                chatContainer.classList.remove('active');
            }, 3000);
        } else {
            renderStep(option.next);
        }
    }

    function finishAndSend() {
        const message = `Olá! Vim pelo site da Hamilton Contabilidade e gostaria de um atendimento especializado.

📌 *Resumo da Solicitação:*
💼 *Serviço:* ${userContext.service}
📝 *Detalhe:* ${userContext.detail}

Aguardo o contato para prosseguirmos.`;

        const encodedMsg = encodeURIComponent(message);
        const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;
        
        window.open(link, '_blank');

        // Após abrir o WhatsApp, oferece opções de continuidade
        setTimeout(() => {
            showBotMessage("Sua mensagem foi preparada! Deseja algo mais?", [
                { text: "❓ Tenho outra dúvida", action: "restart" },
                { text: "👋 Encerrar atendimento", action: "close" }
            ]);
        }, 1500);
    }
});
