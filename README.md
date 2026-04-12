# Projeto: Telha 2 🏢

**Projeto de landing page de alta conversão para painéis e telhas translúcidas, segmentado para os estados do Nordeste (AL, CE, PB, RN).**

Este projeto faz parte da arquitetura corporativa da agência **IAS**, migrado a partir de protótipos antigos (`Downloads/telha2`) e reconstruído focado em otimização de conversão e arquitetura DEO.

---

## 🏗️ Catálogo de Decisões & Histórico

Este documento atua como a memória institucional de todas as mudanças infraestruturais aplicadas no projeto.

### 1. Refatoração Mobile-First (Fuga do Ecosystem Wix)
- **O Problema Original:** O projeto iniciou através de um "export" do Wix, que entregava um código HTML/CSS engessado. Os elementos tinham posições em pixels fixos, o que destruía totalmente o layout ao carregar no celular.
- **A Execução:** Removemos 100% da injeção de código Wix e escrevemos a aplicação do zero utilizando _Custom Code_ (HTML e CSS puros). Preservamos todos os ativos visuais (imagens, ícones e fontes originais), mas o esqueleto tornou-se verdadeiramente responsivo.

### 2. Eliminação do Modal "Bottom-Drawer"
- **O Problema Original:** Foi relatado um sério bug no qual o componente "drawer" (que abria por baixo) para conversão escondia o conteúdo no mobile e frequentemente quebrava na experiência do cliente, criando atrito na geração de leads.
- **A Execução:** Substituímos o componente falho. A experiência do usuário foi reconfigurada para usar formulários estáticos na própria página, âncoras (`scroll-to-action`) limpas ou acionamento livre de atrito direcionado ao WhatsApp.

### 3. Integração de Webhook & Rastreamento Inteligente
- **Estratégia de Captação sem Form:** Em abordagens passadas, decidimos preparar uma estrutura via scripts JavaScript (ex: `inject_gtm.js`) que puxam dinamicamente todas as Tags Parametrizadas (UTM parameters, gclid, fbclid, etc.).
- **Passagem de Bastão (Hand-off):** Em vez de forçar o usuário a digitar o nome, o site embute os rastreadores ocultamente no próprio texto do WhatsApp ou joga as UTMs no payload encaminhado ao webhood do n8n. Quando o Lead envia o recado, o motor do n8n no seu back-end o absorve com dados totais de performance da agência.

### 4. Segmentação Geográfica
- Foram introduzidas subpastas dedicadas às divisões regionais (ex: `/al`, `/ce`, `/pb`, `/rn`). Esse mapeamento atende dinamicamente os textos da landing page, garantindo sinergia com os criativos dos anúncios veiculados nas praças do Nordeste.

---

## 📍 Integração DEO (Directive, Orchestration, Execution)

Na arquitetura da Agência IAS:
- **Execution:** Este projeto reflete a camada tática. Os códigos front-end rodam focados em UI perfeita.
- **Orchestration:** Não adicionamos integrações densas de BD no Front-end; os botões de ação e Webhooks se comunicam diretamente com a orquestração do `n8n_auto`.
- **Global Knowledge:** Todos os aprendizados de conversão aplicados aqui baseiam-se em lógicas armazenadas dentro do root workspace.

---
_Documentação gerada pela IA Antigravity para preservação segura de contexto da Agência_
