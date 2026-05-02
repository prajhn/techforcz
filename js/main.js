/* ═══════════════════════════════════════════════════════
   TECHFORCZ CHATBOT ENGINE — Zara
   Response-chaining state machine
   States: greet → interest → name → phone → email →
           service → confirm → done
═══════════════════════════════════════════════════════ */
const CB = {
  open:   false,
  state:  'greet',
  lead:   { name:'', phone:'', email:'', service:'' },
  started: false,

  /* ── conversation script ── */
  script: {
    greet: {
      delay: 600,
      msgs: [
        '👋 Hello! Welcome to <strong>TechForcz</strong> — I\'m <strong>Zara</strong>, your IT consulting assistant.',
        '🚀 We help hospitals, banks, universities, and enterprises transform their technology — from cloud migrations to full network builds, cybersecurity, and IT strategy.',
        'Are you exploring IT solutions for your organisation today?'
      ],
      chips: ['Yes, tell me more', 'I have a specific need', 'Just browsing']
    },
    interest_yes: {
      delay: 400,
      msgs: [
        '✨ Fantastic! TechForcz has delivered <strong>50+ successful projects</strong> with a <strong>98% client retention</strong> rate — our clients stay because we deliver results, not just advice.',
        'We specialise in four core areas — which resonates most with your current situation?'
      ],
      chips: ['Cloud Transformation', 'Network Design', 'IT Strategy', 'Cybersecurity']
    },
    interest_browse: {
      delay: 400,
      msgs: [
        'No worries at all! 😊 Feel free to explore the site at your own pace.',
        'If anything catches your eye — cloud, network, cybersecurity, or IT strategy — just let me know. I\'m here whenever you\'re ready. 👇'
      ],
      chips: ['Tell me about Cloud', 'Tell me about Networks', 'Tell me about Security', 'Book a consultation']
    },
    about_cloud: {
      delay: 400,
      msgs: [
        '☁️ Our <strong>Cloud Transformation</strong> service covers end-to-end migrations on AWS, Azure, and GCP — with zero downtime and a hybrid-cloud architecture built for your scale.',
        'Clients typically see a <strong>30–40% reduction in infrastructure costs</strong> within the first year. Would you like to explore this for your organisation?'
      ],
      chips: ['Yes, I\'m interested', 'Tell me about other services', 'Book a consultation']
    },
    about_network: {
      delay: 400,
      msgs: [
        '🌐 Our <strong>Network Design</strong> team designs, builds, deploys, monitors, and manages enterprise networks — LAN, WAN, SD-WAN, and full NOC operations.',
        'We\'ve rolled out networks across hospitals, campuses, and multi-city corporate offices. Ready to learn what we can do for you?'
      ],
      chips: ['Yes, I\'m interested', 'Tell me about other services', 'Book a consultation']
    },
    about_security: {
      delay: 400,
      msgs: [
        '🔒 Our <strong>Cybersecurity</strong> practice is ISO 27001-aligned — covering risk assessments, compliance frameworks, and security audits tailored to your sector.',
        'One audit identified <strong>critical gaps</strong> a client didn\'t know existed. Protection first, then confidence. Shall we talk about your security posture?'
      ],
      chips: ['Yes, I\'m interested', 'Tell me about other services', 'Book a consultation']
    },
    about_strategy: {
      delay: 400,
      msgs: [
        '🗺️ Our <strong>IT Strategy &amp; Roadmap</strong> service gives you a clear, phased technology plan aligned to your business goals — digital transformation, infrastructure upgrades, and project delivery all under one roof.',
        'We\'ve helped organisations go from legacy systems to modern digital operations in months. Would you like a roadmap for your organisation?'
      ],
      chips: ['Yes, I\'m interested', 'Tell me about other services', 'Book a consultation']
    },
    collect_name: {
      delay: 350,
      msgs: [
        '🙌 Wonderful! Let\'s get you connected with our team.',
        'First — what\'s your <strong>name</strong>? (First name is fine!)'
      ],
      chips: []
    },
    collect_phone: {
      delay: 350,
      msgs: [],   /* dynamic — filled at runtime */
      chips: []
    },
    collect_email: {
      delay: 350,
      msgs: [],
      chips: []
    },
    collect_service: {
      delay: 350,
      msgs: [],
      chips: ['Cloud Transformation', 'Network Design', 'IT Strategy', 'Cybersecurity', 'Not sure yet']
    },
    confirm: {
      delay: 400,
      msgs: [],
      chips: ['Yes, send it!', 'Let me fill the full form']
    },
    done: {
      delay: 300,
      msgs: [],
      chips: []
    },
    beyond: {
      delay: 300,
      msgs: [
        '🤔 That\'s a great question! For anything detailed — pricing, custom requirements, or technical specs — our team is best placed to help you directly.',
        '📋 Please fill in our <strong>Free Consultation form</strong> on this page and we\'ll respond within <strong>2 hours</strong>. Alternatively, I can take your details here and have someone call you back!'
      ],
      chips: ['Take my details here', 'I\'ll fill the form']
    }
  }
};

/* ── helpers ── */
function cbMsgsEl(){ return document.getElementById('cb-messages'); }
function cbScrollBottom(){ const m=cbMsgsEl(); m.scrollTop=m.scrollHeight; }

function cbAddBot(html, delay=0){
  return new Promise(resolve => {
    setTimeout(()=>{
      /* typing indicator */
      const typing = document.createElement('div');
      typing.className = 'cb-typing';
      typing.innerHTML = `<div class="cb-mini-av"><svg viewBox="0 0 24 24"><path fill="white" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div><div class="cb-dots"><div class="cb-dot"></div><div class="cb-dot"></div><div class="cb-dot"></div></div>`;
      cbMsgsEl().appendChild(typing);
      cbScrollBottom();

      setTimeout(()=>{
        typing.remove();
        const wrap = document.createElement('div');
        wrap.className = 'cb-bot-msg';
        wrap.innerHTML = `<div class="cb-mini-av"><svg viewBox="0 0 24 24"><path fill="white" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div><div class="cb-bubble-bot">${html}</div>`;
        cbMsgsEl().appendChild(wrap);
        cbScrollBottom();
        resolve();
      }, 900);
    }, delay);
  });
}

function cbAddUser(text){
  const wrap = document.createElement('div');
  wrap.className = 'cb-user-msg';
  wrap.innerHTML = `<div class="cb-bubble-user">${text}</div>`;
  cbMsgsEl().appendChild(wrap);
  cbScrollBottom();
}

function cbShowChips(chips){
  cbClearChips();
  if(!chips || !chips.length) return;
  const row = document.createElement('div');
  row.className = 'cb-chips';
  row.id = 'cb-chips-row';
  chips.forEach(label=>{
    const btn = document.createElement('button');
    btn.className = 'cb-chip';
    btn.textContent = label;
    btn.onclick = ()=>{ cbClearChips(); cbHandleChip(label); };
    row.appendChild(btn);
  });
  cbMsgsEl().appendChild(row);
  cbScrollBottom();
}

function cbClearChips(){
  const r=document.getElementById('cb-chips-row');
  if(r) r.remove();
}

async function cbRunScript(key){
  const s = CB.script[key];
  if(!s) return;
  for(let i=0;i<s.msgs.length;i++){
    await cbAddBot(s.msgs[i], i===0 ? s.delay : 500);
  }
  cbShowChips(s.chips);
}

/* ── chip handler — the response chain brain ── */
async function cbHandleChip(label){
  cbAddUser(label);
  const l = label.toLowerCase();

  if(l.includes('yes, tell me more') || l.includes('specific need')){
    CB.state='interest'; await cbRunScript('interest_yes');
  } else if(l.includes('browsing')){
    CB.state='browse'; await cbRunScript('interest_browse');
  } else if(l.includes('cloud')){
    CB.state='cloud'; await cbRunScript('about_cloud');
  } else if(l.includes('network')){
    CB.state='network'; await cbRunScript('about_network');
  } else if(l.includes('security') || l.includes('cyber')){
    CB.state='security'; await cbRunScript('about_security');
  } else if(l.includes('strategy') || l.includes('it strat')){
    CB.state='strategy'; await cbRunScript('about_strategy');
  } else if(l.includes('interested') || l.includes('consultation') || l.includes('details here')){
    CB.state='name'; await cbRunScript('collect_name');
  } else if(l.includes('fill the form') || l.includes("i'll fill")){
    await cbAddBot('Perfect! Scroll up to find our <strong>Free Consultation form</strong> — just a few fields and our team will be in touch within 2 hours. 💙', 300);
    document.getElementById('contact')?.scrollIntoView({behavior:'smooth',block:'start'});
  } else if(l.includes('other services')){
    await cbAddBot('Here\'s what else we offer — tap to learn more:', 300);
    cbShowChips(['Cloud Transformation','Network Design','IT Strategy','Cybersecurity']);
  } else if(l.includes('yes, send it!')){
    await cbSubmitLead();
  } else {
    await cbRunScript('beyond');
  }
}

/* ── text input handler ── */
async function cbHandleText(text){
  cbClearChips();
  cbAddUser(text);
  const t = text.trim();

  if(CB.state === 'name'){
    CB.lead.name = t;
    CB.state = 'phone';
    CB.script.collect_phone.msgs = [
      `Great to meet you, <strong>${t.split(' ')[0]}</strong>! 🙌`,
      'What\'s the best <strong>phone number</strong> to reach you on?'
    ];
    await cbRunScript('collect_phone');

  } else if(CB.state === 'phone'){
    if(!/^[\d\s\+\-\(\)]{7,15}$/.test(t)){
      await cbAddBot('Hmm, that doesn\'t look quite right. Could you enter a valid <strong>phone number</strong>? (e.g. +91 98765 43210)', 300);
      return;
    }
    CB.lead.phone = t;
    CB.state = 'email';
    CB.script.collect_email.msgs = [
      '📱 Got it!',
      'And your <strong>email address</strong>? We\'ll send you a confirmation and useful resources.'
    ];
    await cbRunScript('collect_email');

  } else if(CB.state === 'email'){
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)){
      await cbAddBot('That email doesn\'t look right. Could you double-check it?', 300);
      return;
    }
    CB.lead.email = t;
    CB.state = 'service';
    CB.script.collect_service.msgs = [
      '✅ Perfect!',
      'Last one — which <strong>service</strong> are you most interested in? (Or tap "Not sure yet" — that\'s fine too!)'
    ];
    await cbRunScript('collect_service');

  } else if(CB.state === 'service'){
    CB.lead.service = t;
    await cbShowConfirm();

  } else {
    /* unrecognised free-text during other states */
    await cbRunScript('beyond');
  }
}

async function cbShowConfirm(){
  CB.state = 'confirm';
  CB.script.confirm.msgs = [
    `📋 Here\'s what I\'ve got:\n\n<strong>Name:</strong> ${CB.lead.name}<br><strong>Phone:</strong> ${CB.lead.phone}<br><strong>Email:</strong> ${CB.lead.email}<br><strong>Service:</strong> ${CB.lead.service}`,
    'Shall I send these details to the TechForcz team right away?'
  ];
  await cbRunScript('confirm');
}

async function cbSubmitLead(){
  CB.state = 'done';
  await cbAddBot('🚀 Sending your details now…', 300);

  /* silent Web3Forms POST */
  const W3F = document.querySelector('script[src]');
  const key = typeof W3F_KEY !== 'undefined' ? W3F_KEY : '';
  if(key && key !== 'YOUR_WEB3FORMS_ACCESS_KEY'){
    try{
      await fetch('https://api.web3forms.com/submit',{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify({
          access_key: key,
          subject: 'Chat Lead — ' + CB.lead.name,
          from_name: 'TechForcz Chatbot (Zara)',
          replyto: CB.lead.email,
          'Full Name': CB.lead.name,
          'Phone': CB.lead.phone,
          'Email': CB.lead.email,
          'Service': CB.lead.service,
          'Source': 'Website Chatbot',
          botcheck: ''
        })
      });
    }catch(e){ console.warn('Chat lead send error',e); }
  }

  /* WhatsApp ping to team */
  const wa = encodeURIComponent(
    '💬 *New Chat Lead — TechForcz Zara Bot*\n\n' +
    '👤 *Name:* ' + CB.lead.name + '\n' +
    '📞 *Phone:* ' + CB.lead.phone + '\n' +
    '📧 *Email:* ' + CB.lead.email + '\n' +
    '🛠 *Service:* ' + CB.lead.service + '\n\n' +
    '_Captured via website chatbot_'
  );
  setTimeout(()=>window.open('https://wa.me/918050941079?text='+wa,'_blank','noopener'),800);

  CB.script.done.msgs = [
    `🎉 <strong>Done, ${CB.lead.name.split(' ')[0]}!</strong> Your details have been sent to our team.`,
    '⏱ We\'ll reach out within <strong>2 hours</strong> — usually much sooner!',
    '💙 In the meantime, feel free to explore our services on this page. Thank you for choosing TechForcz — <em>Driven by Excellence</em>.'
  ];
  await cbRunScript('done');
  document.getElementById('cb-input-row').style.display='none';
}

/* ── main input send ── */
function cbSend(){
  const inp = document.getElementById('cb-input');
  const text = inp.value.trim();
  if(!text) return;
  inp.value = '';
  if(['name','phone','email','service'].includes(CB.state)){
    /* chip-selected service goes through handleChip for service state */
    cbHandleText(text);
  } else {
    cbHandleText(text);
  }
}

/* ── service chip during service state ── */
const _origHandleChip = cbHandleChip;
async function cbHandleChipWithService(label){
  if(CB.state === 'service'){
    cbClearChips();
    cbAddUser(label);
    CB.lead.service = label;
    await cbShowConfirm();
  } else {
    await cbHandleChip(label);
  }
}
/* override chip handler for service state */
document.addEventListener('click', e=>{
  if(e.target.classList.contains('cb-chip') && CB.state==='service'){
    /* already handled by inline onclick, re-check service state */
  }
});

/* patch chip onclick to use service-aware handler */
function cbShowChips(chips){
  cbClearChips();
  if(!chips||!chips.length) return;
  const row=document.createElement('div');
  row.className='cb-chips';row.id='cb-chips-row';
  chips.forEach(label=>{
    const btn=document.createElement('button');
    btn.className='cb-chip';btn.textContent=label;
    btn.onclick=()=>{
      cbClearChips();
      if(CB.state==='service'){
        cbAddUser(label);
        CB.lead.service=label;
        cbShowConfirm();
      } else {
        cbHandleChip(label);
      }
    };
    row.appendChild(btn);
  });
  cbMsgsEl().appendChild(row);
  cbScrollBottom();
}

/* ── toggle open/close ── */
function cbToggle(){
  CB.open = !CB.open;
  document.getElementById('cb-window').classList.toggle('open', CB.open);
  document.getElementById('cb-launcher').classList.toggle('open', CB.open);
  document.getElementById('cb-notif').style.display = 'none';

  if(CB.open && !CB.started){
    CB.started = true;
    cbRunScript('greet');
  }
  if(CB.open){
    setTimeout(()=>document.getElementById('cb-input').focus(), 350);
  }
}

/* ── auto-open notif after 4 seconds ── */
setTimeout(()=>{
  const n = document.getElementById('cb-notif');
  if(n) n.style.display='flex';
}, 4000);