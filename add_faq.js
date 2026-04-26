const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'ce/index.html',
  'pb/index.html',
  'rn/index.html',
  'al/index.html'
];

const faqHtml = `
    <!-- ════════════════════════════════════
         FAQ
    ════════════════════════════════════ -->
    <section class="faq-section white">
      <div class="container">
        <div class="section-title">
          <span class="eyebrow">Dúvidas Frequentes</span>
          <h2>Perguntas Frequentes sobre Telhas Sanduíche</h2>
        </div>
        <div class="faq-accordion">
          <div class="faq-item">
            <button class="faq-question">
              A telha sanduíche faz barulho quando chove?
              <i class="fas fa-chevron-down"></i>
            </button>
            <div class="faq-answer">
              <p>Não! Uma das maiores vantagens da nossa telha termoacústica (sanduíche) com núcleo de EPS de alta densidade é justamente o bloqueio sonoro. Ela reduz drasticamente o barulho de chuva, proporcionando muito mais conforto.</p>
            </div>
          </div>
          <div class="faq-item">
            <button class="faq-question">
              Ela realmente ajuda a diminuir o calor?
              <i class="fas fa-chevron-down"></i>
            </button>
            <div class="faq-answer">
              <p>Sim, o núcleo de isolamento bloqueia a transferência de calor para o interior do ambiente. Isso pode reduzir a temperatura interna em vários graus, gerando economia significativa com ar-condicionado e ventiladores.</p>
            </div>
          </div>
          <div class="faq-item">
            <button class="faq-question">
              Qual a durabilidade da pintura?
              <i class="fas fa-chevron-down"></i>
            </button>
            <div class="faq-answer">
              <p>A Isopolar oferece 10 anos de garantia na pintura. Utilizamos um processo de pintura eletrostática que protege contra corrosão, desbotamento e garante um acabamento impecável por muito mais tempo.</p>
            </div>
          </div>
          <div class="faq-item">
            <button class="faq-question">
              A estrutura do telhado precisa ser reforçada?
              <i class="fas fa-chevron-down"></i>
            </button>
            <div class="faq-answer">
              <p>Pelo contrário! As telhas sanduíche são extremamente leves e autoportantes, o que pode gerar uma economia de até 90% na estrutura de fixação (madeiramento ou metal) em comparação com telhas tradicionais.</p>
            </div>
          </div>
        </div>
        <div class="text-center mt-32">
          <a href="https://wa.me/5584987711011?text=Ol%C3%A1,%20tenho%20uma%20d%C3%BAvida%20sobre%20as%20telhas" class="btn-cta">
            <i class="fab fa-whatsapp"></i> Fale com um Especialista
          </a>
        </div>
      </div>
    </section>
`;

const schemaObj = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "A telha sanduíche faz barulho quando chove?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Não! Uma das maiores vantagens da nossa telha termoacústica (sanduíche) com núcleo de EPS de alta densidade é justamente o bloqueio sonoro. Ela reduz drasticamente o barulho de chuva, proporcionando muito mais conforto."
      }
    },
    {
      "@type": "Question",
      "name": "Ela realmente ajuda a diminuir o calor?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim, o núcleo de isolamento bloqueia a transferência de calor para o interior do ambiente. Isso pode reduzir a temperatura interna em vários graus, gerando economia significativa com ar-condicionado e ventiladores."
      }
    },
    {
      "@type": "Question",
      "name": "Qual a durabilidade da pintura?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A Isopolar oferece 10 anos de garantia na pintura. Utilizamos um processo de pintura eletrostática que protege contra corrosão, desbotamento e garante um acabamento impecável por muito mais tempo."
      }
    },
    {
      "@type": "Question",
      "name": "A estrutura do telhado precisa ser reforçada?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pelo contrário! As telhas sanduíche são extremamente leves e autoportantes, o que pode gerar uma economia de até 90% na estrutura de fixação (madeiramento ou metal) em comparação com telhas tradicionais."
      }
    }
  ]
};

const schemaString = JSON.stringify(schemaObj, null, 2);

files.forEach(file => {
  const filePath = path.join('C:\\Users\\VICTOR\\IAS\\clients\\telha2', file);
  if (!fs.existsSync(filePath)) {
    console.log(`Not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');

  // Inject schema
  if (!content.includes('"@type": "FAQPage"')) {
    const jsonLdStart = content.indexOf('"@graph": [');
    if (jsonLdStart !== -1) {
      content = content.replace(
        /"@graph": \[/,
        `"@graph": [\n      ${schemaString.replace(/\n/g, '\n      ')},`
      );
    }
  }

  // Inject HTML before <!-- ════════════════════════════════════
  //          ONDE ESTAMOS PRESENTES
  if (!content.includes('faq-section')) {
    content = content.replace(
      /(\s*<!-- ════════════════════════════════════\s*ONDE ESTAMOS PRESENTES)/,
      faqHtml + '$1'
    );
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file}`);
});
