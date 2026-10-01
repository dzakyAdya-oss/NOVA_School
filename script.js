const D={
Senin:[['07.40','09.00','Koding','Pak Aan'],['09.20','10.40','Pendidikan Pancasila','Bu Elvi'],['10.40','12.00','Bahasa Inggris','Bu Dwi'],['12.30','13.50','Sejarah','Bu Yani']],
Selasa:[['07.00','09.00','Perkembangan Teknologi Bidang Teknik Jaringan','Bu Iis'],['09.20','10.40','Proses Bisnis di Bidang TJKT','Pak Fandi'],['10.40','12.00','Matematika','Bu In In'],['12.30','13.50','Bahasa Jawa','Bu Elvi']],
Rabu:[['07.00','08.20','Bahasa Indonesia','Pak Slamet'],['08.20','10.00','Bahasa Inggris','Bu Dwi'],['10.00','11.20','Proyek IPAS','Bu Andin'],['11.20','12.00','Bahasa Indonesia','Pak Slamet'],['12.30','13.50','Seni Budaya','Bu Dewi']],
Kamis:[['07.00','10.00','Informatika','Pak Taufik'],['10.00','12.00','PAI','Bu Iis'],['12.30','13.50','Profesi & Kewirausahaan di TJKT','Bu Khatun']],
Jumat:[['07.40','09.00','Kecakapan Kerja Dasar','Bu Fita'],['09.20','10.40','Matematika','Bu In In'],['10.40','11.20','Bahasa Indonesia','Pak Slamet']],
Sabtu:[['07.40','10.00','Pendidikan Jasmani, Olahraga','Arif Wibowo'],['10.00','11.20','Proses Bisnis di Bidang TJKT','Pak Fandi'],['11.20','13.00','Proyek IPAS','Bu Andin']]
};
const days=Object.keys(D), J=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];let day=J[new Date().getDay()];if(day==='Minggu')day='Senin';
let tasks=JSON.parse(localStorage.getItem('nova_tasks')||'[]');let note=localStorage.getItem('nova_note')||'';
const $=x=>document.getElementById(x), mins=s=>{let[a,b]=s.split('.').map(Number);return a*60+b}, esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function renderDays(){$('days').innerHTML=days.map(x=>`<button class="day ${x===day?'active':''}" onclick="pick('${x}')">${x.slice(0,3)}<br><b>${x===J[new Date().getDay()]?'•':''}</b></button>`).join('')}
function pick(x){
  day=x;
  renderDays();
  renderSchedule();
  const active=document.querySelector('.day.active');
  if(active)active.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
}
function renderSchedule(){let n=mins(new Date().getHours()+'.'+new Date().getMinutes()),today=J[new Date().getDay()],list=D[day];$('lessons').innerHTML=list.map(x=>{let c=day===today&&n>=mins(x[0])&&n<mins(x[1]),z=day===today&&n>=mins(x[1]);return `<div class="lesson ${c?'current':''} ${z?'done':''}"><div class="lt">${x[0]} – ${x[1]}</div><div><div class="ln">${esc(x[2])}</div><div class="lg">${esc(x[3])}</div></div><div class="badge">${c?'BERLANGSUNG':z?'SELESAI':'JADWAL'}</div></div>`}).join('')}
function nextLesson(now){let n=now.getHours()*60+now.getMinutes(),today=J[now.getDay()];if(D[today]){let nx=D[today].find(x=>n<mins(x[0]));if(nx)return {day:today,lesson:nx,today:true}}let startIndex=days.indexOf(today);if(startIndex<0)startIndex=-1;for(let step=1;step<=days.length;step++){let nd=days[(startIndex+step+days.length)%days.length],list=D[nd]||[];if(list.length)return {day:nd,lesson:list[0],today:false}}return null}
let lastCurrentSubject=localStorage.getItem('nova_last_subject')||'';
function renderNow(){let now=new Date(),n=now.getHours()*60+now.getMinutes(),today=J[now.getDay()],list=D[today]||[],cur=list.find(x=>n>=mins(x[0])&&n<mins(x[1]));
if(cur && lastCurrentSubject && lastCurrentSubject!==cur[2]) toast('Sekarang: '+cur[2]+' 📚');
lastCurrentSubject=cur?cur[2]:'';
localStorage.setItem('nova_last_subject',lastCurrentSubject);$('clock').textContent=now.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});$('date').textContent=new Intl.DateTimeFormat('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(now);$('greet').textContent=(now.getHours()<11?'Selamat pagi':now.getHours()<15?'Selamat siang':now.getHours()<18?'Selamat sore':'Selamat malam')+' 👋';
if(cur){let p=Math.min(100,Math.max(0,(n-mins(cur[0]))/(mins(cur[1])-mins(cur[0]))*100));$('status').textContent='● berlangsung';$('current').innerHTML=`<div class="subject">${esc(cur[2])}</div><div class="teacher">👤 ${esc(cur[3])}</div><div class="time">${cur[0]} – ${cur[1]}</div><div class="bar"><i style="width:${p}%"></i></div><div class="current-meta"><span class="muted">Progress pelajaran</span><span>${Math.round(p)}%</span></div>`}else{$('status').textContent=n<(list[0]?mins(list[0][0]):0)?'sebelum sekolah':'selesai';$('current').innerHTML=`<div class="subject">${n<(list[0]?mins(list[0][0]):0)?'Belum mulai':'Selesai 🎉'}</div><div class="teacher">${n<(list[0]?mins(list[0][0]):0)?'Pelajaran pertama: '+esc(list[0][2]):'Semua pelajaran hari ini sudah lewat.'}</div>`}
let upcoming=nextLesson(now);if(upcoming){$('nextDay').textContent=upcoming.today?'Hari ini':upcoming.day;$('next').innerHTML=`<time>${upcoming.today?'':upcoming.day+' • '}${upcoming.lesson[0]} – ${upcoming.lesson[1]}</time><b>${esc(upcoming.lesson[2])}</b><span class="muted">👤 ${esc(upcoming.lesson[3])}</span>`}else{$('nextDay').textContent='-';$('next').innerHTML='<b>Tidak ada jadwal.</b>'}}
function getSubjects(){let map=new Map();for(let d of days)for(let x of D[d]){if(!map.has(x[2]))map.set(x[2],[]);map.get(x[2]).push(d)}return map}
function renderTaskSubjects(){let select=$('taskSubject'),subjects=[...getSubjects().keys()].sort((a,b)=>a.localeCompare(b,'id'));select.innerHTML='<option value="">Pilih mata pelajaran...</option><option value="__general">Lainnya / umum</option>'+subjects.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('');updateTaskDays()}
function updateTaskDays(){
  let subject=$('taskSubject').value,daySelect=$('taskDay');
  if(!subject){daySelect.disabled=true;daySelect.innerHTML='<option value="">Pilih mata pelajaran dulu...</option>';return}
  daySelect.disabled=false;
  if(subject==='__general'){daySelect.innerHTML='<option value="__none">Tanpa hari</option>'+days.map(d=>`<option value="${d}">${d}</option>`).join('');return}
  let valid=getSubjects().get(subject)||[];
  daySelect.innerHTML='<option value="__none">Tanpa hari</option>'+valid.map(d=>`<option value="${d}">${d}</option>`).join('');
}
function renderTasks(){let done=tasks.filter(x=>x.done).length;$('taskmeta').textContent=`${done}/${tasks.length} selesai`;$('tasklist').innerHTML=tasks.length?tasks.map((x,i)=>{let meta=[x.subject,x.day||'Tanpa hari'].filter(Boolean).join(' • ');return `<div class="task ${x.done?'done':''}"><button class="check ${x.done?'on':''}" onclick="tasks[${i}].done=!tasks[${i}].done;saveTasks()">${x.done?'✓':''}</button><div class="taskbody"><b>${esc(x.text)}</b><small>${esc(meta)}</small></div><button class="x" onclick="tasks.splice(${i},1);saveTasks()">×</button></div>`}).join(''):'<div class="empty">Belum ada tugas. Tambahkan tugas pertama kamu di bawah.</div>'}
function addTask(){
  let v=$('taskin').value.trim(),subject=$('taskSubject').value,taskDay=$('taskDay').value;
  if(!v){toast('Tulis tugas terlebih dahulu');return}
  if(!subject){toast('Pilih mata pelajaran terlebih dahulu');return}
  if(!taskDay){toast('Pilih hari tugas atau Tanpa hari');return}
  let normalizedSubject=subject==='__general'?'Lainnya / umum':subject;
  tasks.push({text:v,subject:normalizedSubject,day:taskDay==='__none'?'':taskDay,done:false});
  $('taskin').value='';saveTasks();toast('Tugas ditambahkan ✓')
}
function saveTasks(){localStorage.setItem('nova_tasks',JSON.stringify(tasks));renderTasks()}
function openSearch(){$('stitle').textContent='Cari jadwal & fitur';$('sbody').innerHTML='<input class="search" id="search" placeholder="Cari mapel, guru, hari..." oninput="search()"><div class="results" id="results"></div>';$('modal').classList.add('show');setTimeout(()=>$('search').focus(),30);search()}function search(){let q=($('search').value||'').toLowerCase(),o=[];for(let d of days)for(let x of D[d])if((d+' '+x.join(' ')).toLowerCase().includes(q))o.push(`<div class="result"><b>${esc(x[2])}</b><small>${d} • ${x[0]}–${x[1]} • ${esc(x[3])}</small></div>`);$('results').innerHTML=o.slice(0,15).join('')||'<div class="muted">Tidak ditemukan.</div>'}function closeModal(){$('modal').classList.remove('show')}
function tjktTools(){
  openTool('TJKT Tools',`
    <div class="results">
      <button class="result" style="text-align:left;color:var(--t);cursor:pointer" onclick="subnet()"><b>🌐 Subnet Calculator</b><small>Network, broadcast, dan jumlah host</small></button>
      <div class="result"><b>🔢 Binary / Decimal</b><small>Tool siap ditambahkan nanti</small></div>
      <div class="result"><b>🔌 Port Reference</b><small>HTTP, HTTPS, DNS, SSH, FTP, dan lainnya</small></div>
      <div class="result"><b>📡 CIDR Reference</b><small>Prefix, mask, dan host dalam satu tabel</small></div>
    </div>`);
}
function subnet(){openTool('Subnet Calculator',`<input class="search" id="cidr" value="192.168.1.0/24" placeholder="IP/CIDR"><button class="add" style="margin-top:9px;width:100%" onclick="doSubnet()">Hitung</button><div class="results" id="subout"></div>`)}
function doSubnet(){let v=$('cidr').value.trim(),m=v.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)\/(\d|[12]\d|3[0-2])$/);if(!m){$('subout').innerHTML='<div class="muted">Format tidak valid.</div>';return}let p=+m[5],ip=m.slice(1,5).map(Number),mask=p?((0xffffffff<<(32-p))>>>0):0,n=((ip[0]<<24|ip[1]<<16|ip[2]<<8|ip[3])>>>0&mask)>>>0,b=(n|(~mask>>>0))>>>0,s=x=>[(x>>>24)&255,(x>>>16)&255,(x>>>8)&255,x&255].join('.'),h=p>=31?2**(32-p):Math.max(0,2**(32-p)-2);$('subout').innerHTML=`<div class="result"><b>Network</b><small>${s(n)}/${p}</small></div><div class="result"><b>Broadcast</b><small>${s(b)}</small></div><div class="result"><b>Usable host</b><small>${h.toLocaleString('id-ID')}</small></div>`}
function openTool(t,b){$('stitle').textContent=t;$('sbody').innerHTML=b;$('modal').classList.add('show')}
let pt,pomoSec=1500;function pomodoro(){openTool('Focus Timer',`<div style="text-align:center;font-size:56px;font-weight:900" id="pomo">25:00</div><div style="display:flex;gap:7px"><button class="add" style="flex:1" onclick="startPomo()">Start</button><button class="icon" style="flex:1" onclick="resetPomo()">Reset</button></div>`)}function updateP(){let m=String(Math.floor(pomoSec/60)).padStart(2,'0'),s=String(pomoSec%60).padStart(2,'0');if($('pomo'))$('pomo').textContent=m+':'+s}function startPomo(){clearInterval(pt);pt=setInterval(()=>{pomoSec--;updateP();if(pomoSec<=0){clearInterval(pt);toast('Focus selesai 🎉')}},1000);toast('Pomodoro dimulai')}function resetPomo(){clearInterval(pt);pomoSec=1500;updateP()}
function copySchedule(){let today=J[new Date().getDay()],list=D[today]||[];if(!list.length){toast('Tidak ada jadwal hari ini');return}let t='Jadwal '+today+'\n'+list.map(x=>`${x[0]} – ${x[1]} : ${x[2]} (${x[3]})`).join('\n');if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(t).then(()=>toast('Jadwal '+today+' disalin 📋')).catch(()=>fallbackCopy(t,today))}else fallbackCopy(t,today)}
function fallbackCopy(t,today){let ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.focus();ta.select();try{document.execCommand('copy');toast('Jadwal '+today+' disalin 📋')}catch(e){toast('Gagal menyalin jadwal')}ta.remove()}
function todaySchedule(){let today=J[new Date().getDay()];if(!D[today]){toast('Hari ini tidak ada jadwal');return}pick(today);go('scheduleCard')}
function focusNote(){$('note').focus();go('note')}
function go(id){$(id).scrollIntoView({behavior:'smooth',block:'center'})}
function applyTheme(mode){
  const root=document.documentElement;
  const safe=mode==='light'?'light':'dark';
  root.dataset.theme=safe;
  localStorage.setItem('nova_theme',safe);
  const btn=$('themeBtn');
  btn.textContent=safe==='light'?'🌙':'☀️';
  btn.setAttribute('aria-label',safe==='light'?'Ubah ke dark mode':'Ubah ke light mode');
  btn.title=safe==='light'?'Aktifkan dark mode':'Aktifkan light mode';
}
function theme(){
  const current=document.documentElement.dataset.theme||'dark';
  applyTheme(current==='dark'?'light':'dark');
  toast(current==='dark'?'Mode terang aktif ☀️':'Mode gelap aktif 🌙');
}
function toast(s){let e=$('toast');e.textContent=s;e.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>e.classList.remove('show'),1700)}
$('note').value=note;$('note').oninput=e=>localStorage.setItem('nova_note',e.target.value);
const savedTheme=localStorage.getItem('nova_theme');
applyTheme(savedTheme==='light'?'light':'dark');renderDays();renderSchedule();renderTaskSubjects();renderTasks();renderNow();setInterval(()=>{renderNow();renderSchedule()},1000);document.onkeydown=e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch()}if(e.key==='Escape')closeModal()};
