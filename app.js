const form=document.querySelector("#build-form"),preview=document.querySelector("#preview"),frameBox=document.querySelector("#preview-frame-box"),statusText=document.querySelector("#preview-status"),message=document.querySelector("#message"),copyButton=document.querySelector("#copy-code"),downloadButton=document.querySelector("#download-code"),desktopButton=document.querySelector("#desktop-btn"),mobileButton=document.querySelector("#mobile-btn");
let generatedHTML="",generatedFiles={};
const pagePicker=document.querySelector("#page-preview-select");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clean=s=>String(s||"").trim().replace(/\s+/g," ");
const presets={
 salon:{name:"Bloom Beauty Studio",type:"salon",description:"A friendly beauty salon offering hair styling, braids, manicures and self-care appointments. Help clients explore services and book a visit.",style:"earth"},
 restaurant:{name:"The Garden Table",type:"restaurant",description:"A welcoming restaurant serving fresh, delicious meals for families, friends and special occasions. Highlight our menu, atmosphere and reservations.",style:"earth"},
 portfolio:{name:"Alex Creative Portfolio",type:"portfolio",description:"A modern personal portfolio showcasing selected projects, skills, creative process and ways for potential clients to get in touch.",style:"midnight"},
 shop:{name:"Moyo Market",type:"shop",description:"A stylish online shop showcase for a curated collection of useful everyday products. Feature product categories, quality and a clear contact call to action.",style:"light"},
 farm:{name:"Green Acres Farm",type:"farm",description:"A local farm supplying fresh eggs, vegetables and seasonal produce. Explain what is available, how to order and how customers can contact the farm.",style:"earth"},
 agency:{name:"Northstar Creative",type:"agency",description:"A creative studio helping small businesses with branding, web design, content and digital strategy. Showcase services and invite enquiries.",style:"midnight"}
};
document.querySelectorAll("[data-preset]").forEach(button=>button.addEventListener("click",()=>{const p=presets[button.dataset.preset];if(!p)return;document.querySelector("#site-name").value=p.name;document.querySelector("#site-type").value=p.type;document.querySelector("#description").value=p.description;const radio=document.querySelector('input[name="style"][value="'+p.style+'"]');if(radio)radio.checked=true;document.querySelector("#site-name").focus();message.textContent="Starter brief loaded. Edit any field, then generate your website.";document.querySelectorAll("[data-preset]").forEach(b=>b.classList.toggle("selected",b===button));}));
function createSite({name,type,description,style,email}){
const themes={
 midnight:{bg:"#0b1220",panel:"#121d30",text:"#f5f7fb",muted:"#a9b6ca",accent:"#78edcc",button:"#78edcc",buttonText:"#081b18",card:"#17243a",line:"#2b3b53",soft:"#20354a"},
 light:{bg:"#f6f8f5",panel:"#ffffff",text:"#17231d",muted:"#647268",accent:"#287453",button:"#193d2d",buttonText:"#ffffff",card:"#edf3ed",line:"#dce5dd",soft:"#e2eee5"},
 earth:{bg:"#f4ede3",panel:"#fffaf2",text:"#392a20",muted:"#786656",accent:"#a3633b",button:"#593b2b",buttonText:"#ffffff",card:"#eee0cf",line:"#e4d3bf",soft:"#e6d4bf"}
};
const t=themes[style]||themes.midnight;
const configs={
 business:{eyebrow:"A better way to do business",headline:"Good work. Thoughtfully done.",intro:"Useful solutions, personal service, and quality you can feel.",services:[["Made for your needs","Practical solutions shaped around your goals."],["Quality in every detail","A careful, considered approach from start to finish."],["People come first","Friendly support and clear communication."]],tag:"A trusted local business"},
 portfolio:{eyebrow:"Selected work & ideas",headline:"Creative work with purpose.",intro:"A collection of projects, experiments, and ideas built with care.",services:[["Featured projects","A curated selection of recent work and outcomes."],["My process","Research, thoughtful design, and practical execution."],["Let's collaborate","Have an idea? Let's explore what we can make together."]],tag:"Design · Craft · Curiosity"},
 agency:{eyebrow:"Strategy meets creativity",headline:"Make your next move matter.",intro:"Clear thinking and thoughtful digital experiences for ambitious teams.",services:[["Brand & identity","Build a recognisable, consistent brand."],["Web experiences","Modern, responsive websites designed around your audience."],["Creative direction","Turn your ideas into a clear, confident story."]],tag:"Small team. Big-picture thinking"},
 restaurant:{eyebrow:"Fresh flavours, warm welcomes",headline:"Gather around something good.",intro:"Good food and good company make the moments that matter.",services:[["Our menu","Discover favourites, seasonal plates, and something new."],["Made with care","Thoughtful ingredients and attention to every plate."],["Your next visit","Get in touch to ask about availability and special occasions."]],tag:"Good food · Good company"},
 shop:{eyebrow:"Thoughtfully picked for you",headline:"Find something you'll love.",intro:"Explore a considered collection of products chosen for everyday living.",services:[["Featured collection","Discover a few highlights from our collection."],["Quality first","Useful products selected with care and attention."],["Need a hand?","Contact us for product questions and ordering information."]],tag:"A collection with character"},
 school:{eyebrow:"Learn, grow, discover",headline:"A place to reach your potential.",intro:"A welcoming learning community built around curiosity and possibility.",services:[["Learning that matters","Explore learning opportunities and programmes."],["A supportive community","People and guidance to help every learner grow."],["Take the next step","Contact our team to learn more about admissions and activities."]],tag:"Curiosity starts here"},
 event:{eyebrow:"Save a place for inspiration",headline:"Bring people together.",intro:"A shared experience for connection, ideas, and memorable moments.",services:[["What to expect","Discover the highlights and activities planned."],["The details","Keep key event information easy to find."],["Join us","Reach out with questions and participation details."]],tag:"Meet · Share · Experience"},
 salon:{eyebrow:"Your moment to feel refreshed",headline:"A little care goes a long way.",intro:"Thoughtful beauty services in a welcoming space made for you.",services:[["Hair & styling","Explore styles and services tailored to your look."],["Beauty & self-care","Make time for a fresh, relaxing experience."],["Book a visit","Contact us to ask about services and appointments."]],tag:"Your time. Your style."},
 farm:{eyebrow:"Fresh from our farm",headline:"Good things grow with care.",intro:"Locally grown produce and farm-fresh goods, supplied with care.",services:[["Fresh produce","Ask what seasonal fruits and vegetables are available."],["Farm-fresh eggs","Learn about availability and ordering."],["Order locally","Contact us to discuss quantities and collection or delivery."]],tag:"Fresh · Local · Carefully grown"},
 fitness:{eyebrow:"Build strength at your pace",headline:"Progress starts with one step.",intro:"Supportive coaching and practical wellness options for your goals.",services:[["Personal training","Sessions shaped around your experience and goals."],["Group classes","Move, learn, and build consistency with others."],["Your next step","Get in touch to learn about sessions and schedules."]],tag:"Move well. Feel stronger."},
 realestate:{eyebrow:"Find a place to call yours",headline:"Your next chapter starts at home.",intro:"Explore property opportunities with clear information and personal guidance.",services:[["Homes to explore","Discover properties that match your priorities."],["Local guidance","Get help understanding the next steps."],["Arrange a viewing","Contact us to ask about listings and viewings."]],tag:"Property · Guidance · Possibility"},
 technology:{eyebrow:"Practical digital solutions",headline:"Make technology work for you.",intro:"Helpful technology services that solve real problems and support growth.",services:[["Web & digital","Build a useful, modern online presence."],["Support & setup","Get help setting up the tools you rely on."],["Let's discuss your needs","Tell us what you are trying to achieve." ]],tag:"Technology made practical"},
 photography:{eyebrow:"Stories worth remembering",headline:"Keep the moments that matter.",intro:"Thoughtful photography for people, places, products, and milestones.",services:[["Portraits","Natural portraits that reflect personality."],["Events & stories","Capture the energy and details of meaningful occasions."],["Plan a shoot","Get in touch to discuss your vision and availability."]],tag:"Light · Story · Feeling"}
};
const c=configs[type]||configs.business;
const title=esc(name),detail=esc(description),contact=email?"mailto:"+encodeURIComponent(email):"#contact";
const serviceCards=c.services.map((s,i)=>'<article class="bp-card"><div class="bp-number">0'+(i+1)+'</div><h3>'+esc(s[0])+'</h3><p>'+esc(s[1])+'</p><span class="bp-card-mark">↗</span></article>').join("");
const highlights=["Clear information","Thoughtful service","Built around you"].map((x,i)=>'<div class="bp-highlight"><span>0'+(i+1)+'</span><b>'+x+'</b></div>').join("");
return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(c.intro)}"><title>${title}</title><style>
:root{--bg:${t.bg};--panel:${t.panel};--text:${t.text};--muted:${t.muted};--accent:${t.accent};--button:${t.button};--buttonText:${t.buttonText};--card:${t.card};--line:${t.line};--soft:${t.soft}}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:85px}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.65 Inter,Arial,sans-serif}a{color:inherit;text-decoration:none}.bp-wrap{width:min(1120px,calc(100% - 40px));margin:auto}.bp-nav{height:76px;display:flex;align-items:center;justify-content:space-between;gap:18px}.bp-brand{font-weight:850;font-size:19px;letter-spacing:-.7px}.bp-brand i{font-style:normal;color:var(--accent)}.bp-links{display:flex;align-items:center;gap:24px;font-size:12px;color:var(--muted)}.bp-links a:hover{color:var(--accent)}.bp-button{display:inline-flex;align-items:center;justify-content:center;gap:12px;background:var(--button);color:var(--buttonText);padding:13px 17px;border-radius:8px;font-size:12px;font-weight:800;border:1px solid transparent}.bp-button:hover{transform:translateY(-1px);filter:brightness(1.04)}.bp-ghost{border-color:var(--line);background:transparent;color:var(--text)}.bp-hero{position:relative;overflow:hidden;margin:20px auto 90px;border:1px solid var(--line);border-radius:22px;background:linear-gradient(130deg,var(--panel),var(--bg));padding:clamp(32px,7vw,82px)}.bp-orb{position:absolute;width:300px;height:300px;border-radius:50%;background:var(--accent);opacity:.09;filter:blur(80px);right:5%;top:5%}.bp-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:var(--accent);font-weight:800}.bp-eyebrow:before{content:"";display:block;width:20px;height:1px;background:var(--accent)}.bp-hero h1{position:relative;max-width:750px;font-size:clamp(43px,7vw,78px);line-height:1.01;letter-spacing:-.065em;margin:22px 0}.bp-hero h1 span{color:var(--accent)}.bp-hero p{max-width:610px;color:var(--muted);font-size:15px;line-height:1.9}.bp-hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:27px}.bp-tag{margin-top:32px;color:var(--muted);font-size:10px;letter-spacing:.8px}.bp-section{margin:0 auto 90px}.bp-section-head{display:flex;justify-content:space-between;align-items:end;gap:25px;margin-bottom:27px}.bp-section h2{font-size:clamp(29px,4vw,43px);line-height:1.1;letter-spacing:-.045em;margin:12px 0}.bp-section-head p{max-width:400px;color:var(--muted);font-size:12px}.bp-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.bp-card{position:relative;min-height:205px;border:1px solid var(--line);border-radius:14px;padding:25px;background:var(--card);transition:transform .18s,border-color .18s}.bp-card:hover{transform:translateY(-3px);border-color:var(--accent)}.bp-number{font-size:10px;color:var(--accent);font-weight:800;letter-spacing:1px}.bp-card h3{font-size:19px;letter-spacing:-.5px;margin:26px 0 9px}.bp-card p{color:var(--muted);font-size:12px;line-height:1.8}.bp-card-mark{position:absolute;right:22px;top:21px;color:var(--accent)}.bp-about{display:grid;grid-template-columns:.8fr 1.2fr;gap:45px;align-items:start;padding:clamp(24px,5vw,48px);border:1px solid var(--line);border-radius:18px;background:var(--panel)}.bp-about p{margin:0;color:var(--muted);font-size:14px;line-height:1.95}.bp-highlights{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:24px}.bp-highlight{border-top:1px solid var(--line);padding-top:13px}.bp-highlight span{display:block;color:var(--accent);font-size:10px;margin-bottom:8px}.bp-highlight b{font-size:11px}.bp-contact{display:flex;align-items:center;justify-content:space-between;gap:25px;padding:35px 0;border-block:1px solid var(--line)}.bp-contact h2{font-size:clamp(27px,4vw,40px);line-height:1.1;letter-spacing:-.04em;margin:10px 0}.bp-contact p{color:var(--muted);font-size:12px}.bp-footer{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:25px 0 35px;color:var(--muted);font-size:10px}.bp-footer p{max-width:450px}.bp-footer small{display:block;color:var(--muted)}@media(max-width:700px){.bp-wrap{width:min(100% - 28px,1120px)}.bp-nav{height:65px}.bp-links{gap:12px;font-size:10px}.bp-links a:nth-child(2){display:none}.bp-hero{margin:12px auto 60px;padding:34px 24px;border-radius:16px}.bp-hero h1{font-size:clamp(42px,12vw,62px)}.bp-hero p{font-size:13px}.bp-section{margin-bottom:60px}.bp-section-head{display:block}.bp-grid{grid-template-columns:1fr}.bp-card{min-height:unset}.bp-card h3{margin-top:16px}.bp-about{grid-template-columns:1fr;gap:15px}.bp-highlights{gap:8px}.bp-highlight b{font-size:10px}.bp-contact{align-items:flex-start;flex-direction:column}.bp-footer{align-items:flex-start;flex-direction:column}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;transition:none!important}}
</style></head><body><header class="bp-wrap bp-nav"><a class="bp-brand" href="#">${title}<i> ✦</i></a><nav class="bp-links"><a href="#services">Services</a><a href="#about">About</a><a href="#contact">Contact ↗</a></nav><a class="bp-button bp-ghost" href="#contact">Let's talk ↗</a></header><main class="bp-wrap"><section class="bp-hero"><div class="bp-orb"></div><div class="bp-eyebrow">${esc(c.eyebrow)}</div><h1>${esc(c.headline.split(" ").slice(0,-1).join(" "))} <span>${esc(c.headline.split(" ").slice(-1).join(" "))}</span></h1><p>${detail}</p><div class="bp-hero-actions"><a class="bp-button" href="#services">${esc(c.services[0][0])} <span>↗</span></a><a class="bp-button bp-ghost" href="#about">Discover ${title}</a></div><div class="bp-tag">${esc(c.tag)} &nbsp;·&nbsp; Made with care</div></section><section class="bp-section" id="services"><div class="bp-section-head"><div><div class="bp-eyebrow">What we offer</div><h2>Thoughtful work.<br>Clear next steps.</h2></div><p>Explore a few ways we can help. Every detail can be edited to reflect your real services, offers, and story.</p></div><div class="bp-grid">${serviceCards}</div></section><section class="bp-section bp-about" id="about"><div><div class="bp-eyebrow">A little about us</div><h2>Good things start with understanding.</h2></div><div><p>${detail}<br><br>We believe the best experience starts with listening, clear information, and a thoughtful approach. This starter page gives you a clean foundation to add your real story, team, photos, and details.</p><div class="bp-highlights">${highlights}</div></div></section><section class="bp-contact" id="contact"><div><div class="bp-eyebrow">Start a conversation</div><h2>Have something in mind?</h2><p>Questions, enquiries, or a project to discuss? We'd love to hear from you.</p></div><a class="bp-button" href="${contact}">${email?"Contact us by email":"Add your contact details"} ↗</a></section></main><footer class="bp-wrap bp-footer"><a class="bp-brand" href="#">${title}<i> ✦</i></a><p>Starter template generated by BuildPilot. Replace sample content, add real contact details and images, and test all links before publishing.</p><small>© ${new Date().getFullYear()} ${title}</small></footer></body></html>`;
}
function makeZip(fileMap){
  const encoder=new TextEncoder(),entries=[],localParts=[],centralParts=[];
  const crcTable=new Uint32Array(256);
  for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?(0xedb88320^(c>>>1)):(c>>>1);crcTable[n]=c>>>0;}
  const crc32=bytes=>{let c=0xffffffff;for(const b of bytes)c=crcTable[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0;};
  const stamp=new Date(),dosTime=(stamp.getHours()<<11)|(stamp.getMinutes()<<5)|Math.floor(stamp.getSeconds()/2),dosDate=((Math.max(1980,stamp.getFullYear())-1980)<<9)|((stamp.getMonth()+1)<<5)|stamp.getDate();
  const concat=parts=>{const length=parts.reduce((n,p)=>n+p.length,0),out=new Uint8Array(length);let offset=0;for(const p of parts){out.set(p,offset);offset+=p.length;}return out;};
  const safeFiles=Object.entries(fileMap).filter(([name,data])=>/^[a-zA-Z0-9._-]+\.html$/.test(name)&&typeof data==="string");
  for(const [name,text] of safeFiles){
    const nameBytes=encoder.encode(name),dataBytes=encoder.encode(text),crc=crc32(dataBytes),localOffset=localParts.reduce((n,p)=>n+p.length,0);
    const local=new Uint8Array(30+nameBytes.length),lv=new DataView(local.buffer);
    lv.setUint32(0,0x04034b50,true);lv.setUint16(4,20,true);lv.setUint16(6,0x0800,true);lv.setUint16(8,0,true);lv.setUint16(10,dosTime,true);lv.setUint16(12,dosDate,true);lv.setUint32(14,crc,true);lv.setUint32(18,dataBytes.length,true);lv.setUint32(22,dataBytes.length,true);lv.setUint16(26,nameBytes.length,true);lv.setUint16(28,0,true);local.set(nameBytes,30);
    localParts.push(local,dataBytes);
    const central=new Uint8Array(46+nameBytes.length),cv=new DataView(central.buffer);
    cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint16(8,0x0800,true);cv.setUint16(10,0,true);cv.setUint16(12,dosTime,true);cv.setUint16(14,dosDate,true);cv.setUint32(16,crc,true);cv.setUint32(20,dataBytes.length,true);cv.setUint32(24,dataBytes.length,true);cv.setUint16(28,nameBytes.length,true);cv.setUint16(30,0,true);cv.setUint16(32,0,true);cv.setUint16(34,0,true);cv.setUint16(36,0,true);cv.setUint32(38,0,true);cv.setUint32(42,localOffset,true);central.set(nameBytes,46);centralParts.push(central);
  }
  const localBytes=concat(localParts),centralBytes=concat(centralParts),end=new Uint8Array(22),ev=new DataView(end.buffer);
  ev.setUint32(0,0x06054b50,true);ev.setUint16(4,0,true);ev.setUint16(6,0,true);ev.setUint16(8,safeFiles.length,true);ev.setUint16(10,safeFiles.length,true);ev.setUint32(12,centralBytes.length,true);ev.setUint32(16,localBytes.length,true);ev.setUint16(20,0,true);
  return new Blob([localBytes,centralBytes,end],{type:"application/zip"});
}
function previewHTML(filename){
  const source=generatedFiles[filename]||"";
  const bridge='<script>document.addEventListener("click",function(event){var link=event.target.closest("a[href]");if(!link)return;var href=link.getAttribute("href")||"";var match=href.match(/^(index|services|about|contact)\\.html(?:#.*)?$/);if(match){event.preventDefault();parent.postMessage({type:"buildpilot-preview-page",page:match[1]+".html",hash:(href.split("#")[1]||"")},"*");}});<\\/script>';
  return source.includes("</body>")?source.replace("</body>",bridge+"</body>"):source+bridge;
}
window.addEventListener("message",event=>{
  if(event.source!==preview.contentWindow||!event.data||event.data.type!=="buildpilot-preview-page")return;
  const page=event.data.page;
  if(!generatedFiles[page])return;
  if(pagePicker)pagePicker.value=page;
  preview.srcdoc=previewHTML(page);
  if(event.data.hash)setTimeout(()=>{try{preview.contentDocument?.getElementById(event.data.hash)?.scrollIntoView();}catch{}},50);
});
function setGeneratedFiles(files){
  generatedFiles=files||{};generatedHTML=generatedFiles["index.html"]||Object.values(generatedFiles)[0]||"";
  const names=Object.keys(generatedFiles);
  if(pagePicker){
    pagePicker.replaceChildren();
    names.forEach(filename=>{const option=document.createElement("option");option.value=filename;option.textContent=({ "index.html":"Home page","services.html":"Services page","about.html":"About page","contact.html":"Contact page"})[filename]||filename;pagePicker.appendChild(option);});
    pagePicker.hidden=names.length<2;
    pagePicker.value=generatedFiles["index.html"]?"index.html":names[0];
  }
  preview.srcdoc=previewHTML(pagePicker&&pagePicker.value&&generatedFiles[pagePicker.value]?pagePicker.value:"index.html");frameBox.classList.add("has-site");
  statusText.textContent=names.length>1?"AI website ready · "+names.length+" pages":"Website draft ready";
  copyButton.disabled=!generatedHTML;downloadButton.disabled=!generatedHTML;
}
if(pagePicker)pagePicker.addEventListener("change",()=>{const page=generatedFiles[pagePicker.value];if(page)preview.srcdoc=previewHTML(pagePicker.value);});
form.addEventListener("submit",async e=>{
  e.preventDefault();
  const name=clean(document.querySelector("#site-name").value),description=clean(document.querySelector("#description").value),type=document.querySelector("#site-type").value,style=document.querySelector('input[name="style"]:checked').value,email=clean(document.querySelector("#email").value);
  if(!name||!description){message.textContent="Add a brand name and short description to continue.";return}
  const button=form.querySelector(".generate");
  button.disabled=true;button.textContent="Designing your pages…";message.textContent="Asking AI for a coordinated four-page website. This may take a little longer.";statusText.textContent="Building your website";
  try{
    let aiSuccess=false;
    try{
      const response=await fetch("/.netlify/functions/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,description,type,style,email})});
      const data=await response.json().catch(()=>({}));
      if(response.ok&&data.files&&typeof data.files["index.html"]==="string"&&Object.keys(data.files).length>=2){
        setGeneratedFiles(data.files);aiSuccess=true;
        message.textContent="Your AI website package is ready. Choose pages in the preview menu, then download the ZIP to get every HTML page. Review all content and test links before publishing.";
      }else{throw new Error(data.error||"AI generation is unavailable.");}
    }catch(error){
      const fallback=createSite({name,type,description,style,email});
      setGeneratedFiles({"index.html":fallback});
      message.textContent="A single-page template draft was created because multi-page AI generation could not finish: "+(error?.message||"AI service unavailable")+" You can try again later.";
    }
    document.querySelector("#export-title").textContent=name+" — "+(aiSuccess?Object.keys(generatedFiles).length+" pages ready":"template draft ready");
    document.querySelector("#export-desc").textContent=aiSuccess?"Preview each page and download the complete website ZIP.":"Download the fallback HTML template.";
    frameBox.scrollIntoView({behavior:"smooth",block:"nearest"});
  }catch(error){
    statusText.textContent="Could not build draft";message.textContent="Something went wrong. Please check the fields and try again.";
  }finally{button.disabled=false;button.innerHTML="<span>✦</span> Generate website draft <span>→</span>";}
});
copyButton.addEventListener("click",async()=>{if(!generatedHTML)return;try{await navigator.clipboard.writeText(generatedHTML);message.textContent="Homepage HTML copied. Other pages are included in the website ZIP export.";}catch{message.textContent="Clipboard access is unavailable here. Use Download website .zip instead."; }});
downloadButton.addEventListener("click",()=>{
  if(!generatedHTML)return;
  const name=(document.querySelector("#site-name").value.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"my-website");
  const multiPage=Object.keys(generatedFiles).length>1;
  const blob=multiPage?makeZip(generatedFiles):new Blob([generatedHTML],{type:"text/html;charset=utf-8"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=multiPage?name+".zip":name+".html";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
  message.textContent=multiPage?"Website ZIP downloaded. Extract it and open index.html; all four HTML pages are included.":"Template HTML downloaded. This fallback is a single page.";
});
desktopButton.addEventListener("click",()=>{frameBox.classList.remove("mobile");desktopButton.classList.add("active");mobileButton.classList.remove("active");});
mobileButton.addEventListener("click",()=>{frameBox.classList.add("mobile");mobileButton.classList.add("active");desktopButton.classList.remove("active");});
