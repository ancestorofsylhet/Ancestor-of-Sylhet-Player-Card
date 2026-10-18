const form = document.getElementById('playerForm');
const photoInput = document.getElementById('photo');
const previewPhoto = document.getElementById('previewPhoto');
const photoPlaceholder = document.getElementById('photoPlaceholder');
const gallery = document.getElementById('gallery');
const emptyState = document.getElementById('emptyState');
const playerCount = document.getElementById('playerCount');
let currentPhoto = '';
let roster = [];
let idCounter = 1;
const $ = id => document.getElementById(id);

function readForm() {
  return { id:idCounter++, name:$('name').value.trim(), device:$('device').value.trim(),
    userId:$('userId').value.trim(), club:$('club').value.trim(), photo:currentPhoto };
}
function updatePreview(p) {
  $('previewName').textContent = p.name || 'YOUR NAME';
  $('previewDevice').textContent = p.device || 'YOUR DEVICE';
  $('previewUserId').textContent = p.userId || 'YOUR USER ID';
  $('previewClub').textContent = p.club || 'YOUR CLUB';
  if (p.photo) { previewPhoto.src=p.photo; previewPhoto.hidden=false; photoPlaceholder.hidden=true; }
  else { previewPhoto.removeAttribute('src'); previewPhoto.hidden=true; photoPlaceholder.hidden=false; }
}
photoInput.addEventListener('change', () => {
  const file = photoInput.files?.[0]; if (!file) return;
  if (!file.type.startsWith('image/')) { alert('Please select an image file.'); photoInput.value=''; return; }
  const reader = new FileReader();
  reader.onload = () => { currentPhoto=String(reader.result); updatePreview(readForm()); };
  reader.readAsDataURL(file);
});
form.addEventListener('input', () => updatePreview(readForm()));
form.addEventListener('submit', e => {
  e.preventDefault();
  const p = readForm(); roster.unshift(p); updatePreview(p); renderGallery();
});
form.addEventListener('reset', () => setTimeout(() => {
  currentPhoto=''; photoInput.value=''; updatePreview({}); 
}, 0));

function buildCard(p) {
  const card=document.createElement('article'); card.className='player-card';
  card.innerHTML=`<div class="card-shine"></div>
    <div class="card-top"><img class="card-logo" src="aos-logo.png" alt="AOS logo">
      <div class="card-title"><span>ANCESTOR OF SYLHET</span><b>AUCTION TOURNAMENT</b><strong>SEASON 27</strong></div><div class="est">EST.<b>2023</b></div></div>
    <div class="card-ribbon">PLAYER CARD</div>
    <div class="card-content"><div class="portrait"><div id="photoPlaceholder"><span>♟</span><small>PLAYER PHOTO</small></div></div>
    <div class="player-info">
      <div class="info-row"><span class="info-icon">♟</span><div><small>PLAYER NAME</small><b class="p-name"></b></div></div>
      <div class="info-row"><span class="info-icon">▯</span><div><small>DEVICE</small><b class="p-device"></b></div></div>
      <div class="info-row"><span class="info-icon">◎</span><div><small>USER ID</small><b class="p-user"></b></div></div>
      <div class="info-row"><span class="info-icon">♜</span><div><small>CLUB NAME</small><b class="p-club"></b></div></div>
    </div></div>
    <div class="card-bottom"><span>NOT JUST A CLUB,<br><b>IT'S A FAMILY</b></span><img src="aos-logo.png" alt=""><span class="est-bottom">ANCESTOR<br>OF SYLHET</span></div>
    <div class="card-footline">ANCESTOR OF SYLHET · AUCTION TOURNAMENT S27</div>`;
  card.querySelector('.p-name').textContent=p.name;
  card.querySelector('.p-device').textContent=p.device;
  card.querySelector('.p-user').textContent=p.userId;
  card.querySelector('.p-club').textContent=p.club;
  const ph=card.querySelector('#photoPlaceholder');
  if(p.photo){const img=document.createElement('img');img.alt='Player photo';img.src=p.photo;ph.replaceWith(img);}
  return card;
}
function renderGallery(){
  gallery.replaceChildren();
  roster.forEach(p=>{
    const item=document.createElement('div');item.className='gallery-item';item.appendChild(buildCard(p));
    const actions=document.createElement('div');actions.className='actions';
    const dl=document.createElement('button');dl.className='btn primary';dl.type='button';dl.textContent='↓ PNG';
    dl.addEventListener('click',()=>downloadCard(p));
    const remove=document.createElement('button');remove.className='btn secondary';remove.type='button';remove.textContent='Remove';
    remove.addEventListener('click',()=>{roster=roster.filter(x=>x.id!==p.id);renderGallery();});
    actions.append(dl,remove);item.appendChild(actions);gallery.appendChild(item);
  });
  playerCount.textContent=roster.length;emptyState.hidden=roster.length>0;
}

function downloadCard(p){
  const canvas=document.createElement('canvas');canvas.width=1000;canvas.height=1350;
  const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
  const bg=ctx.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#031108');bg.addColorStop(.5,'#0c3a20');bg.addColorStop(1,'#020a05');
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  ctx.save();ctx.globalAlpha=.13;ctx.strokeStyle='#e9bd3b';ctx.lineWidth=3;
  for(let x=-h;x<w+h;x+=45){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x-h*.6,h);ctx.stroke();}ctx.restore();
  ctx.strokeStyle='#f5c84d';ctx.lineWidth=7;ctx.strokeRect(18,18,w-36,h-36);ctx.lineWidth=2;ctx.strokeStyle='#f5c84d66';ctx.strokeRect(36,36,w-72,h-72);
  const logo=new Image();logo.onload=()=>drawCard(logo);logo.onerror=()=>drawCard(null);logo.src='aos-logo.png';
  function drawCard(logoImg){
    if(logoImg){ctx.save();ctx.beginPath();ctx.arc(145,135,85,0,Math.PI*2);ctx.clip();ctx.drawImage(logoImg,60,50,170,170);ctx.restore();ctx.strokeStyle='#f5c84d';ctx.lineWidth=4;ctx.beginPath();ctx.arc(145,135,87,0,Math.PI*2);ctx.stroke();}
    ctx.textAlign='center';ctx.fillStyle='#f8d875';ctx.font='900 51px Arial';ctx.fillText('ANCESTOR OF SYLHET',550,110);
    ctx.fillStyle='#fff';ctx.font='800 25px Arial';ctx.fillText('AUCTION TOURNAMENT',550,158);
    ctx.fillStyle='#f5c84d';ctx.font='900 25px Arial';ctx.fillText('S E A S O N   2 7',550,198);
    ctx.fillStyle='#f5c84d';ctx.fillRect(65,240,870,4);ctx.fillStyle='#f8d875';ctx.font='900 42px Arial';ctx.fillText('PLAYER CARD',500,300);ctx.fillRect(65,325,870,4);
    const drawDetails=()=>{
      ctx.strokeStyle='#f5c84d';ctx.lineWidth=8;ctx.strokeRect(65,365,365,520);
      if(p.photo){const img=new Image();img.onload=()=>{ctx.save();ctx.beginPath();ctx.rect(80,380,335,490);ctx.clip();const s=Math.max(335/img.width,490/img.height);const iw=img.width*s,ih=img.height*s;ctx.drawImage(img,80+(335-iw)/2,380+(490-ih)/2,iw,ih);ctx.restore();drawInfo();};img.onerror=drawInfo;img.src=p.photo;}
      else{ctx.fillStyle='#14291b';ctx.fillRect(80,380,335,490);ctx.fillStyle='#f5c84d';ctx.font='120px Arial';ctx.fillText('♟',247,640);ctx.fillStyle='#fff';ctx.font='18px Arial';ctx.fillText('PLAYER PHOTO',247,710);drawInfo();}
    };
    const drawInfo=()=>{
      const rows=[['PLAYER NAME',p.name],['DEVICE',p.device],['USER ID',p.userId],['CLUB NAME',p.club]];let y=420;
      rows.forEach(([label,value])=>{ctx.fillStyle='#0005';ctx.fillRect(470,y-30,465,95);ctx.strokeStyle='#f5c84d88';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(470,y+65);ctx.lineTo(935,y+65);ctx.stroke();ctx.textAlign='left';ctx.fillStyle='#f5c84d';ctx.font='900 22px Arial';ctx.fillText(label,492,y);ctx.fillStyle='#fff';ctx.font=`700 ${String(value).length>25?20:27}px Arial`;wrapText(ctx,String(value),492,y+38,420,31);y+=115;});
      if(logoImg){ctx.save();ctx.globalAlpha=.7;ctx.beginPath();ctx.arc(500,1060,75,0,Math.PI*2);ctx.clip();ctx.drawImage(logoImg,425,985,150,150);ctx.restore();}
      ctx.textAlign='left';ctx.fillStyle='#f5c84d';ctx.font='italic 900 37px Arial';ctx.fillText("NOT JUST A CLUB,",70,1010);ctx.fillStyle='#fff';ctx.fillText("IT'S A FAMILY",70,1060);
      ctx.fillStyle='#20e783';ctx.font='900 35px Arial';ctx.fillText('ANCESTOR OF SYLHET',70,1125);
      ctx.fillStyle='#f5c84d';ctx.fillRect(170,1190,660,2);ctx.textAlign='center';ctx.font='800 22px Arial';ctx.fillText('AUCTION TOURNAMENT · SEASON 27',500,1235);
      ctx.font='800 16px Arial';ctx.fillText('EST. 2023',500,1270);
      canvas.toBlob(blob=>{if(!blob){alert('Could not create PNG. Please try again.');return;}const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=(p.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')||'aos-player')+'-season-27.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);},'image/png');
    };
    function wrapText(c,text,x,y,maxWidth,lineHeight){let line='',n=0;for(const word of text.split(/\s+/)){const test=line?line+' '+word:word;if(c.measureText(test).width>maxWidth&&line){c.fillText(line,x,y+n*lineHeight);n++;line=word;if(n>=2)break;}else line=test;}if(line&&n<2)c.fillText(line,x,y+n*lineHeight);}
    drawDetails();
  }
}
$('downloadPng').addEventListener('click',()=>{
  if(!$('name').value.trim()||!$('device').value.trim()||!$('userId').value.trim()||!$('club').value.trim()){alert('Please complete all required fields first.');return;}
  downloadCard(readForm());
});
$('downloadCsv').addEventListener('click',()=>{
  if(!roster.length){alert('Create at least one player card first.');return;}
  const quote=v=>'"'+String(v).replace(/"/g,'""')+'"';
  const csv='\ufeff'+[['Name','Device','User ID','Club Name'],...roster.map(p=>[p.name,p.device,p.userId,p.club])].map(r=>r.map(quote).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download='AOS-Season-27-players.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
updatePreview({});renderGallery();
