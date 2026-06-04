import os

def create_file(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')
    print(f"✅ Creat: {filepath}")

# ==========================================
# 1. utils.js (Validările extrase)
# ==========================================
utils_js = r"""
export function valPet(p) {
  const e = {};
  if (!p.name || p.name.trim().length < 2) e.name = "Min 2 caractere";
  if (!p.species) e.species = "Selectează";
  if (!p.breed) e.breed = "Selectează";
  if (p.age === "" || p.age < 0 || p.age > 30) e.age = "0–30";
  if (p.weight === "" || p.weight <= 0 || p.weight > 200) e.weight = "0.01–200";
  if (!p.gender) e.gender = "Selectează";
  return e;
}

export function valAppt(a) {
  const e = {};
  if (!a.petId) e.petId = "Selectează";
  if (!a.service) e.service = "Selectează";
  if (!a.date) e.date = "Selectează";
  if (!a.time) e.time = "Selectează";
  if (!a.provider || a.provider.trim().length < 2) e.provider = "Min 2 caractere";
  if (!a.location || a.location.trim().length < 2) e.location = "Min 2 caractere";
  return e;
}

export function valAuth(d, reg) {
  const e = {};
  if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = "Email invalid";
  if (!d.password || d.password.length < 6) e.password = "Min 6 caractere";
  if (reg) {
    if (!d.name || d.name.trim().length < 2) e.name = "Min 2 caractere";
    if (!d.phone || !/^07\d{8}$/.test(d.phone)) e.phone = "07XXXXXXXX";
    if (d.password !== d.confirm) e.confirm = "Nu coincid";
  }
  return e;
}
"""

# ==========================================
# 2. styles.css (CSS-ul extras)
# ==========================================
styles_css = r"""
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Lora:wght@600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{font-family:'Nunito',sans-serif;background:#F7FAFA;color:#1A2332}

@keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fi{from{opacity:0}to{opacity:1}}
@keyframes sr{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
@keyframes pop{from{opacity:0;transform:scale(.93)}to{opacity:1;transform:scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes tin{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes tout{to{opacity:0;transform:translateX(30px)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}

.fu{animation:fu .5s ease both}.fi{animation:fi .4s ease both}.sr{animation:sr .5s ease both}.pop{animation:pop .35s ease both}
.d1{animation-delay:.06s}.d2{animation-delay:.12s}.d3{animation-delay:.18s}.d4{animation-delay:.24s}.d5{animation-delay:.3s}

.b{display:inline-flex;align-items:center;gap:7px;padding:9px 20px;border:none;border-radius:11px;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;text-decoration:none}
.b:active{transform:scale(.97)}
.bp{background:#0D9488;color:#fff}.bp:hover{background:#0F766E;box-shadow:0 6px 20px #0D948840}
.bo{background:#fff;color:#0D9488;border:1.5px solid #0D9488}.bo:hover{background:#0D9488;color:#fff}
.bd{background:#EF4444;color:#fff}.bd:hover{background:#DC2626}
.bg{background:transparent;color:#64748B;border:none}.bg:hover{background:#f1f5f9;color:#1A2332}
.bs{padding:5px 13px;font-size:13px;border-radius:9px}

.ig{display:flex;flex-direction:column;gap:4px}.ig label{font-size:12px;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:.3px}
.ig input,.ig select,.ig textarea{padding:9px 13px;border:1.5px solid #E2E8F0;border-radius:11px;font-family:inherit;font-size:14px;transition:all .2s;background:#fff;color:#1A2332}
.ig input:focus,.ig select:focus,.ig textarea:focus{outline:none;border-color:#0D9488;box-shadow:0 0 0 3px #0D948815}
.ie input,.ie select{border-color:#EF4444!important}.er{font-size:11px;color:#EF4444;font-weight:600}

.c{background:#FFFFFF;border-radius:16px;border:1px solid #E2E8F0;box-shadow:0 1px 3px rgba(0,0,0,.03);transition:all .25s}
.c:hover{box-shadow:0 6px 24px rgba(0,0,0,.07)}

.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}

.tw{position:fixed;top:16px;right:16px;z-index:10000;display:flex;flex-direction:column;gap:8px}
.tt{padding:12px 20px;border-radius:12px;color:#fff;font-size:14px;font-weight:600;animation:tin .3s ease,tout .3s ease 2.6s forwards;box-shadow:0 6px 20px rgba(0,0,0,.12)}

@media(max-width:1024px){.dg{grid-template-columns:1fr!important}.strow{grid-template-columns:repeat(2,1fr)!important}}
@media(max-width:768px){.strow{grid-template-columns:1fr!important}.nl{display:none!important}.mb{display:flex!important}.hw{flex-direction:column!important;text-align:center!important}.hw h1{font-size:30px!important}.sg{grid-template-columns:1fr!important}.fg{grid-template-columns:1fr!important}.sbs{flex-direction:column!important}.mi{width:95%!important;margin:8px!important;max-height:95vh!important}.tw{right:8px;left:8px}.spg{grid-template-columns:1fr!important}}
@media(max-width:480px){.hw h1{font-size:24px!important}.b{padding:7px 14px;font-size:13px}}

::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#f1f5f9}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
"""

# ==========================================
# 3. utils.test.js (Testele Unitare)
# ==========================================
utils_test_js = r"""
import { valPet, valAppt, valAuth } from './utils';

describe('CRUD Client-Side Validation Tests', () => {
  test('valPet: ar trebui sa detecteze erori pe toate campurile obligatorii', () => {
    const invalidPet = { name: "A", species: "", breed: "", age: -5, weight: 500, gender: "" };
    const errors = valPet(invalidPet);
    
    expect(errors.name).toBe("Min 2 caractere");
    expect(errors.species).toBe("Selectează");
    expect(errors.breed).toBe("Selectează");
    expect(errors.age).toBe("0–30");
    expect(errors.weight).toBe("0.01–200");
    expect(errors.gender).toBe("Selectează");
  });

  test('valPet: ar trebui sa valideze corect un animal (Create/Update)', () => {
    const validPet = { name: "Max", species: "Câine", breed: "Labrador", age: 3, weight: 28.5, gender: "Mascul" };
    const errors = valPet(validPet);
    expect(Object.keys(errors).length).toBe(0);
  });

  test('valAppt: validare programare fara date (Create/Update)', () => {
    const invalidAppt = { petId: null, service: "", date: "", time: "", provider: "D", location: "L" };
    const errors = valAppt(invalidAppt);
    expect(errors.petId).toBe("Selectează");
    expect(errors.provider).toBe("Min 2 caractere");
  });

  test('valAuth: ar trebui sa verifice corect credentialele', () => {
    const errors = valAuth({ email: "invalid-email", password: "123" }, false);
    expect(errors.email).toBe("Email invalid");
    expect(errors.password).toBe("Min 6 caractere");
  });
});
"""

# ==========================================
# 4. petvet.spec.js (Testele E2E Playwright)
# ==========================================
petvet_spec_js = r"""
import { test, expect } from '@playwright/test';

const URL = 'http://localhost:3000'; // Ajusteaza portul daca folosesti Vite (ex: 5173)

test.describe('E2E Tests - Silver Challenge PetVet', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test('Feature 1: Autentificarea si accesul la Dashboard', async ({ page }) => {
    await page.click('button:has-text("Conectare")');
    await page.fill('input[type="email"]', 'demo@petvet.ro');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button.bp:has-text("Conectare")');

    if (await page.isVisible('text=Ce servicii cauți')) {
      await page.click('text=Coafor & Grooming');
      await page.click('button:has-text("Continuă")');
      await page.click('button:has-text("Începe!")');
    }

    await expect(page.locator('h2:has-text("Bun venit!")')).toBeVisible();
  });

  test('Feature 2: Adaugarea unui pacient in lista (Master/Detail CRUD)', async ({ page }) => {
    await page.click('button:has-text("Conectare")');
    await page.fill('input[type="email"]', 'demo@petvet.ro');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button.bp:has-text("Conectare")');

    await page.click('button:has-text("Animalele mele")');
    await page.click('button:has-text("Adaugă")');
    
    await page.fill('input[placeholder="Max"]', 'GriveiTest');
    await page.selectOption('select:near(label:has-text("Specie"))', 'Câine');
    await page.selectOption('select:near(label:has-text("Rasă"))', 'Beagle');
    await page.selectOption('select:near(label:has-text("Gen"))', 'Mascul');
    await page.fill('input[type="number"]:near(label:has-text("Vârstă"))', '2');
    await page.fill('input[type="number"]:near(label:has-text("Greutate"))', '14');
    
    await page.click('button.bp:has-text("Adaugă")');
    
    await expect(page.locator('text=GriveiTest adăugat!')).toBeVisible();
    await expect(page.locator('h3:has-text("GriveiTest")')).toBeVisible();
  });

  test('Feature 3: Filtrarea programarilor (Read/Filter)', async ({ page }) => {
    await page.click('button:has-text("Conectare")');
    await page.fill('input[type="email"]', 'vet@petvet.ro');
    await page.fill('input[type="password"]', 'vet123');
    await page.click('button.bp:has-text("Conectare")');

    await page.click('button:has-text("Programări")');
    await page.fill('input[placeholder="Caută..."]', 'Tuns');
    
    const rows = page.locator('tbody tr');
    await expect(rows).toContainText(['Tuns']);
  });
});
"""

# ==========================================
# 5. App.jsx (Componenta principala curatata de logica si css)
# ==========================================
app_jsx = r"""
import { useState, useEffect, useCallback, useRef } from "react";
import './styles.css';
import { valPet, valAppt, valAuth } from './utils';

/* ═══════════════ COOKIES (Silver — monitoring & preferences) ═══════════════ */
const CK = {
  set(n,v,d=30){const x=new Date();x.setTime(x.getTime()+d*864e5);document.cookie=`${n}=${encodeURIComponent(JSON.stringify(v))};expires=${x.toUTCString()};path=/`},
  get(n){const m=document.cookie.match(new RegExp(`(?:^|; )${n}=([^;]*)`));try{return m?JSON.parse(decodeURIComponent(m[1])):null}catch{return null}},
  del(n){document.cookie=`${n}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`}
};

function useTracker(user){
  const track=useCallback((action,details={})=>{if(!user)return;const k=`log_${user.email}`,l=CK.get(k)||[];l.push({action,details,ts:new Date().toISOString()});if(l.length>60)l.shift();CK.set(k,l,30)},[user]);
  const pref=useCallback((key,val)=>{if(!user)return;const k=`prf_${user.email}`,p=CK.get(k)||{};p[key]=val;p._ts=new Date().toISOString();CK.set(k,p,365)},[user]);
  const getLog=useCallback(()=>user?CK.get(`log_${user.email}`)||[]:[], [user]);
  const getPrefs=useCallback(()=>user?CK.get(`prf_${user.email}`)||{}:{}, [user]);
  return {track,pref,getLog,getPrefs};
}

/* ═══════════════ DATA & CONSTANTS ═══════════════ */
const SPECIES=["Câine","Pisică","Papagal","Hamster","Iepure","Pește"];
const BREEDS={"Câine":["Labrador","Golden Retriever","Bulldog","Husky","Beagle","Bichon","German Shepherd","Ciobănesc românesc"],"Pisică":["Persană","Siameză","British Shorthair","Maine Coon","Ragdoll","Sphynx","Bengal","Europeană"],"Papagal":["Ara","Cacadu","Peruș","Nimfă","Jako"],"Hamster":["Syrian","Dwarf","Roborovski"],"Iepure":["Holland Lop","Rex","Angora","Flemish Giant"],"Pește":["Guppy","Betta","Neon Tetra","Goldfish"]};
const EMO={"Câine":"🐕","Pisică":"🐈","Papagal":"🦜","Hamster":"🐹","Iepure":"🐰","Pește":"🐟"};

const CATS=[
  {id:"grooming",icon:"✂️",title:"Coafor & Grooming",desc:"Tuns, spălat, styling blană, tăiat unghii, curățat urechi",color:"#EC4899",bg:"linear-gradient(135deg,#FDF2F8,#FCE7F3)",services:["Tuns complet","Spălat & Uscat","Tăiat unghii","Curățat urechi","Styling blană","Deparazitare externă"]},
  {id:"medical",icon:"🏥",title:"Servicii Medicale",desc:"Consultații, vaccinări, analize, chirurgie, radiografie, ecografie",color:"#0D9488",bg:"linear-gradient(135deg,#F0FDFA,#CCFBF1)",services:["Consultație generală","Vaccinare","Deparazitare","Sterilizare","Control dental","Radiografie","Analize sânge","Ecografie","Chirurgie minoră"]},
  {id:"boarding",icon:"🏠",title:"Cazare & Pet Hotel",desc:"Cazare zi/noapte, dietă specială, monitorizare 24/7",color:"#F59E0B",bg:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",services:["Cazare zi","Cazare noapte","Cazare săptămânală","Cazare VIP","Cazare dietă specială"]},
  {id:"walking",icon:"🐕‍🦺",title:"Plimbare & Activități",desc:"Plimbări zilnice, jogging, socializare, antrenament",color:"#8B5CF6",bg:"linear-gradient(135deg,#F5F3FF,#EDE9FE)",services:["Plimbare 30 min","Plimbare 60 min","Jogging","Socializare parc","Antrenament bază","Plimbare grup"]}
];
const ALL_SERVICES=CATS.flatMap(c=>c.services);
const ST_OPTS=["Confirmată","În așteptare","Anulată","Finalizată"];
const ST_C={"Confirmată":"#059669","În așteptare":"#D97706","Anulată":"#DC2626","Finalizată":"#6366F1"};

const INIT_PETS=[
  {id:1,name:"Max",species:"Câine",breed:"Labrador",age:3,weight:28.5,gender:"Mascul",chip:"RO-900111222",notes:"Alergic la pui. Prietenos.",photo:"🐕",vacc:true,lastVet:"2026-01-15"},
  {id:2,name:"Luna",species:"Pisică",breed:"British Shorthair",age:5,weight:4.2,gender:"Femelă",chip:"RO-900444555",notes:"Sterilizată. Preferă hrană umedă.",photo:"🐈",vacc:true,lastVet:"2025-12-20"},
  {id:3,name:"Coco",species:"Papagal",breed:"Nimfă",age:4,weight:0.09,gender:"Mascul",chip:"",notes:"Vorbește câteva cuvinte.",photo:"🦜",vacc:false,lastVet:"2025-10-05"},
  {id:4,name:"Biscuit",species:"Hamster",breed:"Syrian",age:1,weight:0.14,gender:"Mascul",chip:"",notes:"Activ noaptea.",photo:"🐹",vacc:false,lastVet:"2026-02-10"},
  {id:5,name:"Bella",species:"Câine",breed:"Golden Retriever",age:2,weight:24,gender:"Femelă",chip:"RO-900777888",notes:"Jucăușă, iubește apa.",photo:"🐕",vacc:true,lastVet:"2026-02-20"},
  {id:6,name:"Mimi",species:"Pisică",breed:"Siameză",age:6,weight:3.9,gender:"Femelă",chip:"RO-900222333",notes:"Calmă, preferă locuri înalte.",photo:"🐈",vacc:true,lastVet:"2026-01-10"},
];

const INIT_APPTS=[
  {id:1,petId:1,service:"Vaccinare",cat:"medical",date:"2026-04-15",time:"10:00",provider:"Dr. Maria Ionescu",location:"PetVet Central",status:"Confirmată",notes:"Rapel vaccin anual",owner:"Alex Popescu"},
  {id:2,petId:2,service:"Control dental",cat:"medical",date:"2026-04-20",time:"14:30",provider:"Dr. Andrei Popescu",location:"PetVet Central",status:"Confirmată",notes:"Verificare tartru",owner:"Alex Popescu"},
  {id:3,petId:1,service:"Tuns complet",cat:"grooming",date:"2026-03-10",time:"09:00",provider:"Salon PetStyle",location:"PetVet Grooming",status:"Finalizată",notes:"Tuns + unghii",owner:"Alex Popescu"},
  {id:4,petId:3,service:"Consultație generală",cat:"medical",date:"2026-05-02",time:"11:00",provider:"Dr. Elena Vasilescu",location:"PetVet Aviației",status:"În așteptare",notes:"Penaj neobișnuit",owner:"Alex Popescu"},
  {id:5,petId:5,service:"Plimbare 60 min",cat:"walking",date:"2026-04-10",time:"08:00",provider:"PetWalk Team",location:"Parcul Herăstrău",status:"Confirmată",notes:"Plimbare + socializare",owner:"Alex Popescu"},
  {id:6,petId:2,service:"Cazare noapte",cat:"boarding",date:"2026-04-18",time:"18:00",provider:"PetVet Hotel",location:"PetVet Central",status:"În așteptare",notes:"3 nopți, hrană premium",owner:"Alex Popescu"},
  {id:7,petId:4,service:"Consultație generală",cat:"medical",date:"2026-04-25",time:"16:00",provider:"Dr. Elena Vasilescu",location:"PetVet Aviației",status:"În așteptare",notes:"Control rutină",owner:"Alex Popescu"},
  {id:8,petId:1,service:"Deparazitare",cat:"medical",date:"2026-02-28",time:"08:30",provider:"Dr. Maria Ionescu",location:"PetVet Central",status:"Finalizată",notes:"Deparazitare internă+externă",owner:"Alex Popescu"},
  {id:9,petId:6,service:"Spălat & Uscat",cat:"grooming",date:"2026-03-20",time:"13:00",provider:"Salon PetStyle",location:"PetVet Grooming",status:"Finalizată",notes:"Blană lungă, balsam special",owner:"Alex Popescu"},
  {id:10,petId:5,service:"Socializare parc",cat:"walking",date:"2026-04-12",time:"09:00",provider:"PetWalk Team",location:"Parcul IOR",status:"Confirmată",notes:"Grup de 4 câini",owner:"Alex Popescu"},
];

const T="#0D9488",TL="#14B8A6",TD="#0F766E",BG="#F7FAFA",CARD="#FFFFFF",TX="#1A2332",TX2="#64748B",BD="#E2E8F0",RED="#EF4444",GRN="#22C55E",AMB="#F59E0B";

/* ═══════════════ ICONS ═══════════════ */
const Ic=({d,s=18,c="currentColor",...p})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d={d}/></svg>;
const ic={search:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",plus:"M12 5v14M5 12h14",edit:"M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",trash:"M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6",eye:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",cL:"M15 18l-6-6 6-6",cR:"M9 18l6-6-6-6",menu:"M3 12h18M3 6h18M3 18h18",x:"M18 6L6 18M6 6l12 12",user:"M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z",home:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",chart:"M18 20V10M12 20V4M6 20v-6",out:"M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",cal:"M16 2v4M8 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",heart:"M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",check:"M20 6L9 17l-5-5",shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"};

/* ═══════════════ TOASTS ═══════════════ */
function Toasts({items}){return <div className="tw">{items.map(t=><div key={t.id} className="tt" style={{background:t.tp==="success"?"#059669":t.tp==="error"?RED:T}}>{t.m}</div>)}</div>}

/* ═══════════════ SERVICE PICKER ═══════════════ */
function ServicePicker({onDone,tracker}){
  const [sel,setSel]=useState([]);
  const [step,setStep]=useState(0);
  const toggle=id=>setSel(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const go=()=>{
    if(!sel.length)return;
    if(step===0){setStep(1);return}
    const svcs=CATS.filter(c=>sel.includes(c.id)).flatMap(c=>c.services);
    CK.set("pv_cats",sel,365);CK.set("pv_svcs",svcs,365);
    if(tracker){tracker.track("service_pick",{cats:sel.join(",")});tracker.pref("categories",sel.join(","))}
    onDone(sel,svcs);
  };
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.55)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:99999,padding:16}}>
      <div className="c pop" style={{width:700,maxWidth:"96vw",maxHeight:"92vh",overflow:"auto",padding:0}}>
        <div style={{padding:"30px 30px 0",textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:10,animation:"float 3s ease-in-out infinite"}}>🐾</div>
          <h2 style={{fontFamily:"'Lora',serif",fontSize:24,fontWeight:700,marginBottom:6}}>{step===0?"Ce servicii cauți pentru prietenul tău?":"Excelent! Iată selecția ta:"}</h2>
          <p style={{color:TX2,fontSize:14,marginBottom:4}}>{step===0?"Poți selecta mai multe categorii":"Poți schimba oricând din Profil"}</p>
        </div>
        {step===0&&(
          <div className="spg" style={{padding:"20px 30px 8px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {CATS.map(cat=>{
              const on=sel.includes(cat.id);
              return(
                <div key={cat.id} onClick={()=>toggle(cat.id)} style={{background:on?cat.bg:"#FAFBFC",border:`2px solid ${on?cat.color:BD}`,borderRadius:18,padding:22,cursor:"pointer",transition:"all .25s",transform:on?"scale(1.02)":"scale(1)",boxShadow:on?`0 6px 20px ${cat.color}20`:"none",position:"relative"}}>
                  {on&&<div style={{position:"absolute",top:10,right:10,width:26,height:26,borderRadius:"50%",background:cat.color,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic d={ic.check} s={14} c="#fff"/></div>}
                  <div style={{width:50,height:50,borderRadius:14,background:on?`${cat.color}18`:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,marginBottom:12,boxShadow:on?"none":"0 1px 6px rgba(0,0,0,.05)",transition:"all .2s"}}>{cat.icon}</div>
                  <h3 style={{fontSize:16,fontWeight:800,marginBottom:4,color:on?cat.color:TX}}>{cat.title}</h3>
                  <p style={{fontSize:12,color:TX2,lineHeight:1.5}}>{cat.desc}</p>
                  {on&&<div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:4}}>{cat.services.slice(0,3).map((s,i)=><span key={i} style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6,background:`${cat.color}12`,color:cat.color}}>{s}</span>)}{cat.services.length>3&&<span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6,background:"#f1f5f9",color:TX2}}>+{cat.services.length-3}</span>}</div>}
                </div>
              );
            })}
          </div>
        )}
        {step===1&&(
          <div style={{padding:"18px 30px 8px",display:"flex",flexDirection:"column",gap:12}}>
            {CATS.filter(c=>sel.includes(c.id)).map(cat=>(
              <div key={cat.id} style={{background:cat.bg,borderRadius:14,padding:18,border:`1.5px solid ${cat.color}25`}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><span style={{fontSize:22}}>{cat.icon}</span><h4 style={{fontSize:15,fontWeight:800,color:cat.color}}>{cat.title}</h4></div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{cat.services.map((s,i)=><span key={i} style={{fontSize:12,fontWeight:600,padding:"5px 12px",borderRadius:8,background:"#fff",color:TX,border:`1px solid ${BD}`}}>{s}</span>)}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{padding:"18px 30px 26px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <span style={{fontSize:13,color:TX2}}>{sel.length===0?"Selectează cel puțin una":<><b style={{color:T,fontSize:18}}>{sel.length}</b> {sel.length===1?"categorie":"categorii"}</>}</span>
          <div style={{display:"flex",gap:8}}>
            {step===1&&<button className="b bo" onClick={()=>setStep(0)}>← Înapoi</button>}
            <button className="b bp" onClick={go} style={{padding:"10px 28px",opacity:sel.length?1:.5,cursor:sel.length?"pointer":"not-allowed"}}>{step===0?"Continuă →":"Începe! 🎉"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ NAV ═══════════════ */
function Nav({pg,go,user,role,onLogout}){
  const [mob,setMob]=useState(false);
  const links=user?[
    {id:"dashboard",l:"Acasă",i:ic.home},
    {id:"pets",l:role==="vet"?"Pacienți":"Animalele mele",i:ic.heart},
    {id:"appointments",l:"Programări",i:ic.cal},
    {id:"stats",l:"Statistici",i:ic.chart},
    {id:"profile",l:"Profil",i:ic.user},
  ]:[];
  const roleBadge=role==="vet"?{label:"Medic",color:"#059669",bg:"#DCFCE7"}:{label:"Proprietar",color:T,bg:"#CCFBF1"};

  return(
    <nav style={{background:"#fff",borderBottom:`1px solid ${BD}`,position:"sticky",top:0,zIndex:1000,backdropFilter:"blur(10px)",backgroundColor:"rgba(255,255,255,.92)"}}>
      <div style={{maxWidth:1320,margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60}}>
        <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>go(user?"dashboard":"landing")}>
          <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${T},${TL})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🐾</div>
          <span style={{fontSize:19,fontWeight:900,fontFamily:"'Lora',serif"}}>Pet<span style={{color:T}}>Vet</span></span>
          {user&&<span className="badge" style={{background:roleBadge.bg,color:roleBadge.color,marginLeft:6,fontSize:10}}>{roleBadge.label}</span>}
        </div>
        <div className="nl" style={{display:"flex",alignItems:"center",gap:2}}>
          {!user&&<><button className="b bg" onClick={()=>go("landing")}>Acasă</button><button className="b bg" onClick={()=>go("login")}>Conectare</button><button className="b bp" onClick={()=>go("register")}>Creează cont</button></>}
          {user&&links.map(l=><button key={l.id} className="b bg" onClick={()=>go(l.id)} style={{color:pg===l.id?T:TX2,background:pg===l.id?`${T}10`:"transparent",borderRadius:10,fontWeight:pg===l.id?800:600}}><Ic d={l.i} s={14}/>{l.l}</button>)}
          {user&&<button className="b bg" onClick={onLogout} style={{color:RED}}><Ic d={ic.out} s={14}/></button>}
        </div>
        <button className="mb" style={{display:"none",background:"none",border:"none",cursor:"pointer",padding:6}} onClick={()=>setMob(!mob)}><Ic d={mob?ic.x:ic.menu} s={22} c={TX}/></button>
      </div>
      {mob&&<div style={{padding:"6px 20px 14px",borderTop:`1px solid ${BD}`,display:"flex",flexDirection:"column",gap:2,background:"#fff"}}>
        {!user&&<><button className="b bg" onClick={()=>{go("landing");setMob(false)}}>Acasă</button><button className="b bg" onClick={()=>{go("login");setMob(false)}}>Conectare</button><button className="b bp" onClick={()=>{go("register");setMob(false)}}>Creează cont</button></>}
        {user&&links.map(l=><button key={l.id} className="b bg" onClick={()=>{go(l.id);setMob(false)}} style={{justifyContent:"flex-start",color:pg===l.id?T:TX2}}><Ic d={l.i} s={14}/>{l.l}</button>)}
        {user&&<button className="b bg" onClick={()=>{onLogout();setMob(false)}} style={{justifyContent:"flex-start",color:RED}}><Ic d={ic.out} s={14}/> Deconectare</button>}
      </div>}
    </nav>
  );
}

/* ═══════════════ LANDING ═══════════════ */
function Landing({go}){
  return(
    <div>
      <section style={{background:`linear-gradient(160deg,#F0FDFA 0%,#CCFBF1 50%,#F0FDFA 100%)`,padding:"70px 20px",overflow:"hidden"}}>
        <div className="hw fu" style={{maxWidth:1180,margin:"0 auto",display:"flex",alignItems:"center",gap:50}}>
          <div style={{flex:1}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#fff",padding:"5px 14px",borderRadius:18,marginBottom:18,fontSize:12,fontWeight:700,color:T,boxShadow:"0 2px 10px rgba(0,0,0,.05)"}}>🏆 Platforma completă de pet care</div>
            <h1 style={{fontFamily:"'Lora',serif",fontSize:48,fontWeight:700,lineHeight:1.14,marginBottom:18}}>Tot ce are nevoie prietenul tău, <span style={{color:T}}>într-un singur loc.</span></h1>
            <p style={{fontSize:16,color:TX2,lineHeight:1.7,marginBottom:28,maxWidth:460}}>Programări la veterinar, grooming, cazare și plimbări — totul organizat digital, fie că ești proprietar sau medic veterinar.</p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button className="b bp" style={{padding:"12px 28px",fontSize:15}} onClick={()=>go("register")}>Începe gratuit →</button>
              <button className="b bo" style={{padding:"12px 28px",fontSize:15}} onClick={()=>go("login")}>Am deja cont</button>
            </div>
          </div>
          <div className="sr" style={{flex:1,display:"flex",justifyContent:"center"}}>
            <div style={{width:320,height:320,borderRadius:"42% 58% 55% 45%/50% 42% 58% 50%",background:`linear-gradient(135deg,${T}18,${TL}22)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              <span style={{fontSize:120,animation:"float 4s ease-in-out infinite"}}>🐾</span>
              <span style={{position:"absolute",top:8,right:35,fontSize:48,animation:"float 3s ease-in-out infinite .5s"}}>🐕</span>
              <span style={{position:"absolute",bottom:15,left:8,fontSize:44,animation:"float 3.5s ease-in-out infinite 1s"}}>🐈</span>
            </div>
          </div>
        </div>
      </section>
      <section style={{padding:"70px 20px",maxWidth:1180,margin:"0 auto"}}>
        <div className="fu" style={{textAlign:"center",marginBottom:44}}>
          <h2 style={{fontFamily:"'Lora',serif",fontSize:32,marginBottom:8}}>Serviciile noastre</h2>
          <p style={{color:TX2,fontSize:15}}>4 categorii complete pentru animalul tău de companie</p>
        </div>
        <div className="sg" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
          {CATS.map((cat,i)=>(
            <div key={cat.id} className="c fu" style={{padding:24,animationDelay:`${i*.07}s`,cursor:"default"}}>
              <div style={{width:48,height:48,borderRadius:14,background:`${cat.color}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:12}}>{cat.icon}</div>
              <h3 style={{fontSize:16,fontWeight:800,marginBottom:4,color:cat.color}}>{cat.title}</h3>
              <p style={{fontSize:13,color:TX2,lineHeight:1.55}}>{cat.desc}</p>
              <div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:4}}>{cat.services.slice(0,2).map((s,j)=><span key={j} style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:`${cat.color}10`,color:cat.color,fontWeight:700}}>{s}</span>)}<span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:"#f1f5f9",color:TX2,fontWeight:700}}>+{cat.services.length-2}</span></div>
            </div>
          ))}
        </div>
      </section>
      <section className="fu" style={{padding:"50px 20px",margin:"0 20px 50px",borderRadius:20,background:`linear-gradient(135deg,${T},${TD})`,textAlign:"center"}}>
        <h2 style={{fontFamily:"'Lora',serif",fontSize:28,color:"#fff",marginBottom:8}}>Pregătit să începi?</h2>
        <p style={{color:"rgba(255,255,255,.8)",fontSize:15,marginBottom:22}}>Cont gratuit — fără angajament.</p>
        <button className="b" style={{background:"#fff",color:T,padding:"12px 32px",fontSize:15,fontWeight:800}} onClick={()=>go("register")}>Creează cont gratuit</button>
      </section>
      <footer style={{borderTop:`1px solid ${BD}`,padding:"24px 20px",textAlign:"center",color:TX2,fontSize:12}}>© 2026 PetVet — Platforma completă de pet care.</footer>
    </div>
  );
}

/* ═══════════════ AUTH ═══════════════ */
function Auth({type,go,onLogin,toast}){
  const reg=type==="register";
  const [f,setF]=useState({name:"",email:"",phone:"",password:"",confirm:"",role:"owner"});
  const [e,setE]=useState({});
  const [showP,setShowP]=useState(false);
  const upd=(k,v)=>{setF(p=>({...p,[k]:v}));if(e[k])setE(p=>{const n={...p};delete n[k];return n})};

  const submit=()=>{
    const errs=valAuth(f,reg);setE(errs);if(Object.keys(errs).length)return;
    if(reg){
      const users=CK.get("pv_users")||[];
      if(users.find(u=>u.email===f.email)){toast("Email deja înregistrat!","error");return}
      users.push({name:f.name,email:f.email,phone:f.phone,password:f.password,role:f.role});
      CK.set("pv_users",users,365);toast("Cont creat!","success");go("login");
    }else{
      const users=CK.get("pv_users")||[];
      const found=users.find(u=>u.email===f.email&&u.password===f.password);
      if(!found){
        if(f.email==="demo@petvet.ro"&&f.password==="demo123"){onLogin({name:"Alex Popescu",email:"demo@petvet.ro",phone:"0745123456",role:"owner"});toast("Bine ai venit!","success");return}
        if(f.email==="vet@petvet.ro"&&f.password==="vet123"){onLogin({name:"Dr. Maria Ionescu",email:"vet@petvet.ro",phone:"0723456789",role:"vet"});toast("Bine ai venit, Doctore!","success");return}
        toast("Email sau parolă incorectă!","error");return;
      }
      onLogin(found);toast(`Bine ai venit, ${found.name}!`,"success");
    }
  };

  return(
    <div style={{minHeight:"calc(100vh - 60px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,background:`linear-gradient(160deg,#F0FDFA,${BG})`}}>
      <div className="c pop" style={{padding:36,maxWidth:420,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:26}}>
          <div style={{fontSize:46,marginBottom:8}}>{reg?"🐾":"👋"}</div>
          <h2 style={{fontFamily:"'Lora',serif",fontSize:24,marginBottom:4}}>{reg?"Creează cont":"Bine ai revenit!"}</h2>
          <p style={{color:TX2,fontSize:13}}>{reg?"Alege rolul și completează datele":"Conectează-te la contul tău"}</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {reg&&<><div className={`ig ${e.name?"ie":""}`}><label>Nume</label><input placeholder="Ion Popescu" value={f.name} onChange={ev=>upd("name",ev.target.value)}/>{e.name&&<span className="er">{e.name}</span>}</div>
          <div className="ig"><label>Rol</label>
            <div style={{display:"flex",gap:8}}>
              {[{v:"owner",l:"🐾 Proprietar",c:T},{v:"vet",l:"🏥 Medic Veterinar",c:"#059669"}].map(r=>(
                <button key={r.v} type="button" className="b" onClick={()=>upd("role",r.v)} style={{flex:1,justifyContent:"center",background:f.role===r.v?`${r.c}12`:"#f8fafc",color:f.role===r.v?r.c:TX2,border:`1.5px solid ${f.role===r.v?r.c:BD}`,fontWeight:f.role===r.v?800:600}}>{r.l}</button>
              ))}
            </div>
          </div></>}
          <div className={`ig ${e.email?"ie":""}`}><label>Email</label><input type="email" placeholder="email@exemplu.ro" value={f.email} onChange={ev=>upd("email",ev.target.value)}/>{e.email&&<span className="er">{e.email}</span>}</div>
          {reg&&<div className={`ig ${e.phone?"ie":""}`}><label>Telefon</label><input placeholder="07XXXXXXXX" value={f.phone} onChange={ev=>upd("phone",ev.target.value)}/>{e.phone&&<span className="er">{e.phone}</span>}</div>}
          <div className={`ig ${e.password?"ie":""}`}><label>Parolă</label><div style={{position:"relative"}}><input type={showP?"text":"password"} placeholder="Min 6 caractere" value={f.password} onChange={ev=>upd("password",ev.target.value)} style={{width:"100%",paddingRight:44}}/><button onClick={()=>setShowP(!showP)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:TX2,fontSize:11,fontWeight:700}}>{showP?"Ascunde":"Arată"}</button></div>{e.password&&<span className="er">{e.password}</span>}</div>
          {reg&&<div className={`ig ${e.confirm?"ie":""}`}><label>Confirmă parola</label><input type="password" placeholder="Repetă" value={f.confirm} onChange={ev=>upd("confirm",ev.target.value)}/>{e.confirm&&<span className="er">{e.confirm}</span>}</div>}
          <button className="b bp" style={{width:"100%",justifyContent:"center",padding:"11px",marginTop:4}} onClick={submit}>{reg?"Creează cont":"Conectare"}</button>
          <p style={{textAlign:"center",fontSize:13,color:TX2,marginTop:4}}>{reg?"Ai cont? ":"Nu ai cont? "}<span style={{color:T,cursor:"pointer",fontWeight:800}} onClick={()=>go(reg?"login":"register")}>{reg?"Conectează-te":"Creează unul"}</span></p>
          {!reg&&<div style={{textAlign:"center",fontSize:11,color:TX2,background:"#f8fafc",padding:"8px 10px",borderRadius:10,lineHeight:1.6}}>
            Proprietar: <b>demo@petvet.ro</b> / <b>demo123</b><br/>
            Medic: <b>vet@petvet.ro</b> / <b>vet123</b>
          </div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ SHARED MODALS ═══════════════ */
function Modal({children,onClose,title,w=580}){return(<div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.45)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:14}} onClick={ev=>ev.target===ev.currentTarget&&onClose()}><div className="mi c pop" style={{width:w,maxHeight:"90vh",overflow:"auto",padding:0}}><div style={{padding:"16px 22px",borderBottom:`1px solid ${BD}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"#fff",zIndex:1,borderRadius:"16px 16px 0 0"}}><h3 style={{fontSize:16,fontWeight:800}}>{title}</h3><button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",padding:3}}><Ic d={ic.x} s={16} c={TX2}/></button></div>{children}</div></div>)}
function Confirm({msg,onYes,onNo}){return(<div style={{position:"fixed",inset:0,background:"rgba(15,23,42,.45)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:99999,padding:14}}><div className="c pop" style={{width:360,padding:28,textAlign:"center"}}><div style={{fontSize:44,marginBottom:12}}>⚠️</div><h3 style={{fontSize:16,fontWeight:800,marginBottom:8}}>Confirmare</h3><p style={{color:TX2,fontSize:13,marginBottom:20,lineHeight:1.5}}>{msg}</p><div style={{display:"flex",gap:8,justifyContent:"center"}}><button className="b bo" onClick={onNo}>Anulează</button><button className="b bd" onClick={onYes}>Șterge</button></div></div></div>)}

/* ═══════════════ PET FORM ═══════════════ */
function PetForm({pet,onSave,onClose}){
  const [f,setF]=useState(pet||{name:"",species:"",breed:"",age:"",weight:"",gender:"",chip:"",notes:"",vacc:false});
  const [e,setE]=useState({});
  const upd=(k,v)=>{setF(p=>{const n={...p,[k]:v};if(k==="species")n.breed="";return n});if(e[k])setE(p=>{const n={...p};delete n[k];return n})};
  const save=()=>{const errs=valPet(f);setE(errs);if(Object.keys(errs).length)return;onSave(f)};
  return(
    <Modal title={pet?"Editează":"Adaugă animal"} onClose={onClose}>
      <div style={{padding:22,display:"flex",flexDirection:"column",gap:14}}>
        <div className="fg" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div className={`ig ${e.name?"ie":""}`}><label>Nume *</label><input placeholder="Max" value={f.name} onChange={ev=>upd("name",ev.target.value)}/>{e.name&&<span className="er">{e.name}</span>}</div>
          <div className={`ig ${e.species?"ie":""}`}><label>Specie *</label><select value={f.species} onChange={ev=>upd("species",ev.target.value)}><option value="">Selectează</option>{SPECIES.map(s=><option key={s}>{s}</option>)}</select>{e.species&&<span className="er">{e.species}</span>}</div>
          <div className={`ig ${e.breed?"ie":""}`}><label>Rasă *</label><select value={f.breed} onChange={ev=>upd("breed",ev.target.value)} disabled={!f.species}><option value="">Selectează</option>{(BREEDS[f.species]||[]).map(b=><option key={b}>{b}</option>)}</select>{e.breed&&<span className="er">{e.breed}</span>}</div>
          <div className={`ig ${e.gender?"ie":""}`}><label>Gen *</label><select value={f.gender} onChange={ev=>upd("gender",ev.target.value)}><option value="">Selectează</option><option>Mascul</option><option>Femelă</option></select>{e.gender&&<span className="er">{e.gender}</span>}</div>
          <div className={`ig ${e.age?"ie":""}`}><label>Vârstă (ani) *</label><input type="number" min="0" max="30" value={f.age} onChange={ev=>upd("age",Number(ev.target.value))}/>{e.age&&<span className="er">{e.age}</span>}</div>
          <div className={`ig ${e.weight?"ie":""}`}><label>Greutate (kg) *</label><input type="number" min="0" step="0.01" value={f.weight} onChange={ev=>upd("weight",Number(ev.target.value))}/>{e.weight&&<span className="er">{e.weight}</span>}</div>
          <div className="ig"><label>Microchip</label><input placeholder="RO-900..." value={f.chip||""} onChange={ev=>upd("chip",ev.target.value)}/></div>
          <div className="ig" style={{display:"flex",alignItems:"flex-end"}}><label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"8px 0"}}><input type="checkbox" checked={f.vacc||false} onChange={ev=>upd("vacc",ev.target.checked)} style={{width:16,height:16,accentColor:T}}/><span style={{fontSize:13,fontWeight:700}}>Vaccinat</span></label></div>
        </div>
        <div className="ig"><label>Observații</label><textarea rows={2} placeholder="Alergii, preferințe..." value={f.notes||""} onChange={ev=>upd("notes",ev.target.value)} style={{resize:"vertical"}}/></div>
      </div>
      <div style={{padding:"12px 22px",borderTop:`1px solid ${BD}`,display:"flex",justifyContent:"flex-end",gap:8,position:"sticky",bottom:0,background:"#fff",borderRadius:"0 0 16px 16px"}}>
        <button className="b bo" onClick={onClose}>Anulează</button><button className="b bp" onClick={save}>{pet?"Salvează":"Adaugă"}</button>
      </div>
    </Modal>
  );
}

/* ═══════════════ APPOINTMENT FORM ═══════════════ */
function ApptForm({appt,pets,svcs,onSave,onClose}){
  const services=svcs||ALL_SERVICES;
  const [f,setF]=useState(appt||{petId:"",service:"",cat:"",date:"",time:"",provider:"",location:"PetVet Central",status:"În așteptare",notes:""});
  const [e,setE]=useState({});
  const upd=(k,v)=>{setF(p=>{const n={...p,[k]:v};if(k==="service"){const cat=CATS.find(c=>c.services.includes(v));n.cat=cat?cat.id:""}return n});if(e[k])setE(p=>{const n={...p};delete n[k];return n})};
  const save=()=>{const errs=valAppt(f);setE(errs);if(Object.keys(errs).length)return;onSave(f)};
  const groupedSvcs=CATS.filter(cat=>cat.services.some(s=>services.includes(s))).map(cat=>({...cat,services:cat.services.filter(s=>services.includes(s))}));
  return(
    <Modal title={appt?"Editează programare":"Programare nouă"} onClose={onClose} w={540}>
      <div style={{padding:22,display:"flex",flexDirection:"column",gap:14}}>
        <div className="fg" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div className={`ig ${e.petId?"ie":""}`}><label>Animal *</label><select value={f.petId} onChange={ev=>upd("petId",Number(ev.target.value))}><option value="">Selectează</option>{pets.map(p=><option key={p.id} value={p.id}>{p.photo} {p.name}</option>)}</select>{e.petId&&<span className="er">{e.petId}</span>}</div>
          <div className={`ig ${e.service?"ie":""}`}><label>Serviciu *</label><select value={f.service} onChange={ev=>upd("service",ev.target.value)}><option value="">Selectează</option>{groupedSvcs.map(cat=><optgroup key={cat.id} label={`${cat.icon} ${cat.title}`}>{cat.services.map(s=><option key={s}>{s}</option>)}</optgroup>)}</select>{e.service&&<span className="er">{e.service}</span>}</div>
          <div className={`ig ${e.date?"ie":""}`}><label>Data *</label><input type="date" value={f.date} onChange={ev=>upd("date",ev.target.value)}/>{e.date&&<span className="er">{e.date}</span>}</div>
          <div className={`ig ${e.time?"ie":""}`}><label>Ora *</label><input type="time" value={f.time} onChange={ev=>upd("time",ev.target.value)}/>{e.time&&<span className="er">{e.time}</span>}</div>
          <div className={`ig ${e.provider?"ie":""}`}><label>{f.cat==="grooming"?"Salon":"Veterinar"} *</label><input placeholder="Dr. Maria..." value={f.provider} onChange={ev=>upd("provider",ev.target.value)}/>{e.provider&&<span className="er">{e.provider}</span>}</div>
          <div className={`ig ${e.location?"ie":""}`}><label>Locație *</label><input placeholder="PetVet Central" value={f.location} onChange={ev=>upd("location",ev.target.value)}/>{e.location&&<span className="er">{e.location}</span>}</div>
          <div className="ig"><label>Status</label><select value={f.status} onChange={ev=>upd("status",ev.target.value)}>{ST_OPTS.map(s=><option key={s}>{s}</option>)}</select></div>
        </div>
        <div className="ig"><label>Observații</label><textarea rows={2} placeholder="Detalii..." value={f.notes||""} onChange={ev=>upd("notes",ev.target.value)} style={{resize:"vertical"}}/></div>
      </div>
      <div style={{padding:"12px 22px",borderTop:`1px solid ${BD}`,display:"flex",justifyContent:"flex-end",gap:8,position:"sticky",bottom:0,background:"#fff",borderRadius:"0 0 16px 16px"}}>
        <button className="b bo" onClick={onClose}>Anulează</button><button className="b bp" onClick={save}>{appt?"Salvează":"Programează"}</button>
      </div>
    </Modal>
  );
}

/* ═══════════════ PET DETAIL ═══════════════ */
function PetDetail({pet,appts,onClose,onEdit}){
  const pa=appts.filter(a=>a.petId===pet.id).sort((a,b)=>b.date.localeCompare(a.date));
  return(
    <Modal title="" onClose={onClose} w={520}>
      <div style={{background:`linear-gradient(135deg,${T},${TD})`,padding:"26px 22px",color:"#fff",margin:"-1px -1px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{width:62,height:62,borderRadius:16,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34}}>{pet.photo||EMO[pet.species]||"🐾"}</div>
          <div><h2 style={{fontSize:20,fontWeight:800,marginBottom:2}}>{pet.name}</h2><p style={{opacity:.85,fontSize:13}}>{pet.species} • {pet.breed} • {pet.gender}</p>
          <div style={{display:"flex",gap:4,marginTop:4}}>{pet.vacc&&<span className="badge" style={{background:"rgba(255,255,255,.18)",color:"#fff",fontSize:10}}>✅ Vaccinat</span>}{pet.chip&&<span className="badge" style={{background:"rgba(255,255,255,.18)",color:"#fff",fontSize:10}}>📡 Chip</span>}</div></div>
        </div>
      </div>
      <div style={{padding:22}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:18}}>
          {[{l:"Vârstă",v:`${pet.age} ani`,i:"🎂"},{l:"Greutate",v:`${pet.weight} kg`,i:"⚖️"},{l:"Ultima vizită",v:pet.lastVet||"N/A",i:"📅"}].map((x,i)=><div key={i} style={{textAlign:"center",padding:12,background:"#f8fafb",borderRadius:12}}><div style={{fontSize:20,marginBottom:3}}>{x.i}</div><div style={{fontSize:15,fontWeight:800}}>{x.v}</div><div style={{fontSize:10,color:TX2}}>{x.l}</div></div>)}
        </div>
        {pet.notes&&<div style={{marginBottom:14}}><h4 style={{fontSize:11,fontWeight:800,color:TX2,marginBottom:5,textTransform:"uppercase"}}>Observații</h4><div style={{background:"#f8fafb",borderRadius:10,padding:12,fontSize:13,lineHeight:1.5}}>{pet.notes}</div></div>}
        {pa.length>0&&<div><h4 style={{fontSize:11,fontWeight:800,color:TX2,marginBottom:8,textTransform:"uppercase"}}>Programări ({pa.length})</h4><div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:180,overflowY:"auto"}}>{pa.map(a=>{const cat=CATS.find(c=>c.id===a.cat);return(<div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"#f8fafb",borderRadius:10}}><div><div style={{fontSize:13,fontWeight:700}}>{cat?cat.icon+" ":""}{a.service}</div><div style={{fontSize:11,color:TX2}}>{a.date} • {a.time}</div></div><span className="badge" style={{background:`${ST_C[a.status]}15`,color:ST_C[a.status]}}>{a.status}</span></div>)})}</div></div>}
      </div>
      <div style={{padding:"12px 22px",borderTop:`1px solid ${BD}`,display:"flex",justifyContent:"flex-end",gap:8}}><button className="b bo" onClick={onClose}>Închide</button><button className="b bp" onClick={onEdit}><Ic d={ic.edit} s={14}/>Editează</button></div>
    </Modal>
  );
}

/* ═══════════════ SVG CHARTS ═══════════════ */
function Pie({data,w=190,h=190}){const tot=data.reduce((s,d)=>s+d.v,0);if(!tot)return<div style={{width:w,height:h,display:"flex",alignItems:"center",justifyContent:"center",color:TX2,fontSize:12}}>—</div>;let a=0;const r=Math.min(w,h)/2-8,cx=w/2,cy=h/2;return(<div><svg width={w} height={h}>{data.map((d,i)=>{const pct=d.v/tot,st=a;a+=pct*360;const en=a,la=pct>.5?1:0,x1=cx+r*Math.cos((st-90)*Math.PI/180),y1=cy+r*Math.sin((st-90)*Math.PI/180),x2=cx+r*Math.cos((en-90)*Math.PI/180),y2=cy+r*Math.sin((en-90)*Math.PI/180);return<path key={i} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${la} 1 ${x2},${y2} Z`} fill={d.c} opacity={.85} style={{transition:"all .5s"}}><title>{d.l}: {d.v}</title></path>})}</svg><div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8,justifyContent:"center"}}>{data.map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:11}}><div style={{width:8,height:8,borderRadius:2,background:d.c}}/>{d.l}: {d.v}</div>)}</div></div>)}

function Bar({data,w=360,h=210}){const max=Math.max(...data.map(d=>d.v),1);const bW=Math.min(34,(w-56)/data.length-6),cH=h-34;return(<svg width={w} height={h}><line x1={38} y1={6} x2={38} y2={cH} stroke={BD} strokeWidth={1}/><line x1={38} y1={cH} x2={w-6} y2={cH} stroke={BD} strokeWidth={1}/>{[0,.25,.5,.75,1].map((p,i)=><g key={i}><line x1={38} y1={cH-(cH-6)*p} x2={w-6} y2={cH-(cH-6)*p} stroke={BD} strokeWidth={.5} strokeDasharray="3"/><text x={34} y={cH-(cH-6)*p+4} textAnchor="end" fontSize={9} fill={TX2}>{Math.round(max*p)}</text></g>)}{data.map((d,i)=>{const ht=(d.v/max)*(cH-6),x=48+i*((w-56)/data.length);return<g key={i}><rect x={x} y={cH-ht} width={bW} height={ht} rx={4} fill={d.c||T} opacity={.85} style={{transition:"all .5s"}}><title>{d.l}: {d.v}</title></rect><text x={x+bW/2} y={cH+13} textAnchor="middle" fontSize={9} fill={TX2}>{d.l}</text><text x={x+bW/2} y={cH-ht-3} textAnchor="middle" fontSize={9} fill={TX} fontWeight="700">{d.v}</text></g>})}</svg>)}

function Radar({data,w=220,h=220}){const cx=w/2,cy=h/2,r=Math.min(cx,cy)-26,n=data.length;if(n<3)return null;const max=Math.max(...data.map(d=>d.v),1),step=2*Math.PI/n;const pt=(i,val)=>{const a=i*step-Math.PI/2,dist=(val/max)*r;return[cx+dist*Math.cos(a),cy+dist*Math.sin(a)]};return(<svg width={w} height={h}>{[.25,.5,.75,1].map((lv,li)=><polygon key={li} points={data.map((_,i)=>pt(i,max*lv).join(",")).join(" ")} fill="none" stroke={BD} strokeWidth={.7}/>)}{data.map((_,i)=>{const[ex,ey]=pt(i,max);return<line key={i} x1={cx} y1={cy} x2={ex} y2={ey} stroke={BD} strokeWidth={.4}/>})}<polygon points={data.map((d,i)=>pt(i,d.v).join(",")).join(" ")} fill={`${T}25`} stroke={T} strokeWidth={2} style={{transition:"all .5s"}}/>{data.map((d,i)=>{const[px,py]=pt(i,d.v),[lx,ly]=pt(i,max*1.2);return<g key={i}><circle cx={px} cy={py} r={3} fill={T} stroke="#fff" strokeWidth={2}/><text x={lx} y={ly+4} textAnchor="middle" fontSize={9} fill={TX2} fontWeight="600">{d.l}</text></g>})}</svg>)}

function LineC({data,w=360,h=170}){if(!data.length)return null;const max=Math.max(...data.map(d=>d.v),1);const pL=38,pR=8,pT=8,pB=26,cW=w-pL-pR,cH=h-pT-pB;const pts=data.map((d,i)=>[pL+(i/Math.max(data.length-1,1))*cW,pT+cH-(d.v/max)*cH]);const pathD=pts.map((p,i)=>`${i===0?"M":"L"}${p[0]},${p[1]}`).join(" ");const areaD=`${pathD} L${pts[pts.length-1][0]},${pT+cH} L${pts[0][0]},${pT+cH} Z`;return(<svg width={w} height={h}><defs><linearGradient id="lg1" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={T} stopOpacity={.22}/><stop offset="100%" stopColor={T} stopOpacity={0}/></linearGradient></defs><path d={areaD} fill="url(#lg1)"/><path d={pathD} fill="none" stroke={T} strokeWidth={2.5} style={{transition:"all .5s"}}/>{pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r={3} fill="#fff" stroke={T} strokeWidth={2}><title>{data[i].l}: {data[i].v}</title></circle>)}{data.map((d,i)=><text key={i} x={pts[i][0]} y={pT+cH+15} textAnchor="middle" fontSize={8} fill={TX2}>{d.l}</text>)}</svg>)}

/* ═══════════════ DASHBOARD ═══════════════ */
function Dash({pets,appts,go,TK,role,svcs}){
  useEffect(()=>{TK.track("page_view",{page:"dashboard"});TK.pref("lastPage","dashboard")},[]);
  const cats=CK.get("pv_cats")||[];const activeCats=CATS.filter(c=>cats.includes(c.id));
  const upcoming=[...appts].filter(a=>a.status!=="Finalizată"&&a.status!=="Anulată").sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);
  const stats=[{l:role==="vet"?"Pacienți":"Animalele mele",v:pets.length,i:"🐾",c:T},{l:"Programări active",v:appts.filter(a=>a.status==="Confirmată"||a.status==="În așteptare").length,i:"📅",c:"#F97316"},{l:"Finalizate",v:appts.filter(a=>a.status==="Finalizată").length,i:"✅",c:GRN},{l:role==="vet"?"Vaccinați":"Vaccinați",v:pets.filter(p=>p.vacc).length,i:"💉",c:"#8B5CF6"}];

  return(
    <div style={{maxWidth:1280,margin:"0 auto",padding:"22px 20px 50px"}}>
      <div className="fu" style={{marginBottom:20}}>
        <h2 style={{fontFamily:"'Lora',serif",fontSize:26,marginBottom:3}}>{role==="vet"?"Panou medic 🏥":"Bun venit! 👋"}</h2>
        <p style={{color:TX2,fontSize:13}}>{role==="vet"?"Gestionează pacienții și programările":"Iată ce se întâmplă cu prietenii tăi"}</p>
      </div>
      {activeCats.length>0&&<div className="fu" style={{display:"flex",gap:10,marginBottom:18,flexWrap:"wrap"}}>{activeCats.map(cat=><div key={cat.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",background:cat.bg,borderRadius:12,border:`1.5px solid ${cat.color}25`,cursor:"pointer",transition:"all .2s"}} onClick={()=>go("appointments")} onMouseEnter={ev=>ev.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={ev=>ev.currentTarget.style.transform="translateY(0)"}><span style={{fontSize:18}}>{cat.icon}</span><div><div style={{fontSize:12,fontWeight:800,color:cat.color}}>{cat.title}</div><div style={{fontSize:10,color:TX2}}>{cat.services.length} servicii</div></div></div>)}</div>}
      <div className="strow fu" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>{stats.map((s,i)=><div key={i} className="c" style={{padding:"16px 18px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onClick={()=>go(i<1?"pets":"appointments")}><div style={{width:44,height:44,borderRadius:12,background:`${s.c}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{s.i}</div><div><div style={{fontSize:22,fontWeight:900,color:s.c}}>{s.v}</div><div style={{fontSize:12,color:TX2}}>{s.l}</div></div></div>)}</div>
      <div className="dg" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="c fu" style={{padding:0,overflow:"hidden"}}><div style={{padding:"14px 18px",borderBottom:`1px solid ${BD}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><h3 style={{fontSize:14,fontWeight:800}}>🐾 {role==="vet"?"Pacienți":"Animalele mele"}</h3><button className="b bp bs" onClick={()=>go("pets")}><Ic d={ic.cR} s={12}/></button></div><div style={{padding:14,display:"flex",flexDirection:"column",gap:8}}>{pets.slice(0,4).map(p=><div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 12px",background:"#f8fafb",borderRadius:12,cursor:"pointer",transition:"all .15s"}} onClick={()=>go("pets")} onMouseEnter={ev=>ev.currentTarget.style.background=`${T}06`} onMouseLeave={ev=>ev.currentTarget.style.background="#f8fafb"}><div style={{width:40,height:40,borderRadius:10,background:`${T}10`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{p.photo}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{p.name}</div><div style={{fontSize:11,color:TX2}}>{p.species} • {p.breed} • {p.age}a</div></div>{p.vacc&&<span className="badge" style={{background:"#DCFCE7",color:"#166534",fontSize:10}}>Vacc</span>}</div>)}</div></div>
        <div className="c sr" style={{padding:0,overflow:"hidden"}}><div style={{padding:"14px 18px",borderBottom:`1px solid ${BD}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><h3 style={{fontSize:14,fontWeight:800}}>📅 Programări viitoare</h3><button className="b bp bs" onClick={()=>go("appointments")}>Toate</button></div><div style={{padding:14,display:"flex",flexDirection:"column",gap:8}}>{upcoming.length===0&&<p style={{color:TX2,fontSize:13,padding:14,textAlign:"center"}}>Nicio programare activă</p>}{upcoming.map(a=>{const pet=pets.find(p=>p.id===a.petId);const cat=CATS.find(c=>c.id===a.cat);return(<div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 12px",background:"#f8fafb",borderRadius:12,cursor:"pointer",transition:"all .15s"}} onClick={()=>go("appointments")}><div style={{width:40,height:40,borderRadius:10,background:cat?`${cat.color}12`:`${AMB}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{cat?cat.icon:"📅"}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{a.service}</div><div style={{fontSize:11,color:TX2}}>{pet?.name||"?"} • {a.date} • {a.time}</div></div><span className="badge" style={{background:`${ST_C[a.status]}12`,color:ST_C[a.status]}}>{a.status}</span></div>)})}</div></div>
      </div>
    </div>
  );
}

/* ═══════════════ PETS PAGE ═══════════════ */
function PetsPage({pets,setPets,appts,toast,TK,role}){
  const [mod,setMod]=useState(null);const [sel,setSel]=useState(null);const [del,setDel]=useState(null);const [q,setQ]=useState("");
  useEffect(()=>{TK.track("page_view",{page:"pets"});TK.pref("lastPage","pets")},[]);
  const fil=pets.filter(p=>!q||p.name.toLowerCase().includes(q.toLowerCase())||p.species.toLowerCase().includes(q.toLowerCase()));
  const add=f=>{const np={...f,id:Math.max(0,...pets.map(p=>p.id))+1,photo:EMO[f.species]||"🐾",lastVet:new Date().toISOString().split("T")[0]};setPets(p=>[...p,np]);setMod(null);toast(`${np.name} adăugat!`,"success");TK.track("add_pet",{name:np.name})};
  const upd=f=>{setPets(p=>p.map(pet=>pet.id===sel.id?{...pet,...f,photo:EMO[f.species]||"🐾"}:pet));setMod(null);setSel(null);toast("Salvat!","success");TK.track("update_pet",{name:f.name})};
  const rm=pet=>{setPets(p=>p.filter(x=>x.id!==pet.id));setDel(null);toast(`${pet.name} șters.`,"info");TK.track("delete_pet",{name:pet.name})};
  return(
    <div style={{maxWidth:1280,margin:"0 auto",padding:"22px 20px 50px"}}>
      <div className="fu" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}}>
        <div><h2 style={{fontFamily:"'Lora',serif",fontSize:24,marginBottom:2}}>{role==="vet"?"Pacienți 🏥":"Animalele mele 🐾"}</h2><p style={{color:TX2,fontSize:13}}>{pets.length} înregistrări</p></div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}><div style={{position:"relative"}}><Ic d={ic.search} s={14} c={TX2} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)"}}/><input placeholder="Caută..." value={q} onChange={e=>setQ(e.target.value)} style={{padding:"8px 10px 8px 30px",border:`1.5px solid ${BD}`,borderRadius:10,fontFamily:"inherit",fontSize:13,width:180}}/></div><button className="b bp" onClick={()=>setMod("add")}><Ic d={ic.plus} s={14}/>Adaugă</button></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {fil.map((p,i)=><div key={p.id} className="c fu" style={{padding:0,overflow:"hidden",animationDelay:`${i*.04}s`}}>
          <div style={{background:`linear-gradient(135deg,${T}08,${TL}06)`,padding:"18px 18px 12px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:50,height:50,borderRadius:14,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,boxShadow:"0 2px 8px rgba(0,0,0,.05)"}}>{p.photo}</div>
            <div style={{flex:1}}><h3 style={{fontSize:16,fontWeight:800}}>{p.name}</h3><p style={{fontSize:12,color:TX2}}>{p.species} • {p.breed}</p></div>
          </div>
          <div style={{padding:"12px 18px 16px"}}>
            <div style={{display:"flex",gap:14,marginBottom:10,fontSize:12}}><span><b>{p.age}</b> ani</span><span><b>{p.weight}</b> kg</span><span>{p.gender}</span></div>
            <div style={{display:"flex",gap:4,marginBottom:12}}>{p.vacc&&<span className="badge" style={{background:"#DCFCE7",color:"#166534"}}>✅ Vaccinat</span>}{p.chip&&<span className="badge" style={{background:"#E0E7FF",color:"#3730A3"}}>📡 Chip</span>}</div>
            <div style={{display:"flex",gap:4}}><button className="b bg bs" onClick={()=>{setSel(p);setMod("view")}}><Ic d={ic.eye} s={13}/>Detalii</button><button className="b bg bs" onClick={()=>{setSel(p);setMod("edit")}}><Ic d={ic.edit} s={13}/></button><button className="b bg bs" style={{color:RED}} onClick={()=>setDel(p)}><Ic d={ic.trash} s={13}/></button></div>
          </div>
        </div>)}
        {fil.length===0&&<p style={{color:TX2,padding:36,gridColumn:"1/-1",textAlign:"center"}}>Niciun rezultat.</p>}
      </div>
      {mod==="add"&&<PetForm onSave={add} onClose={()=>setMod(null)}/>}
      {mod==="edit"&&sel&&<PetForm pet={sel} onSave={upd} onClose={()=>{setMod(null);setSel(null)}}/>}
      {mod==="view"&&sel&&<PetDetail pet={sel} appts={appts} onClose={()=>{setMod(null);setSel(null)}} onEdit={()=>setMod("edit")}/>}
      {del&&<Confirm msg={`Ștergi "${del.name}"?`} onYes={()=>rm(del)} onNo={()=>setDel(null)}/>}
    </div>
  );
}

/* ═══════════════ APPOINTMENTS PAGE ═══════════════ */
function ApptsPage({appts,setAppts,pets,toast,TK,svcs,role}){
  const [mod,setMod]=useState(null);const [sel,setSel]=useState(null);const [del,setDel]=useState(null);
  const [q,setQ]=useState("");const [fSt,setFSt]=useState("");const [fCat,setFCat]=useState("");
  const [sk,setSk]=useState("date");const [sd,setSd]=useState("desc");const [pg,setPg]=useState(1);const pp=6;
  useEffect(()=>{TK.track("page_view",{page:"appointments"});TK.pref("lastPage","appointments")},[]);

  const fil=appts.filter(a=>{const pet=pets.find(p=>p.id===a.petId);const mq=!q||a.service.toLowerCase().includes(q.toLowerCase())||(pet?.name||"").toLowerCase().includes(q.toLowerCase());const ms=!fSt||a.status===fSt;const mc=!fCat||a.cat===fCat;return mq&&ms&&mc}).sort((a,b)=>{const d=sd==="asc"?1:-1;return(a[sk]||"").localeCompare(b[sk]||"")*d});
  const tp=Math.max(1,Math.ceil(fil.length/pp));const paged=fil.slice((pg-1)*pp,pg*pp);
  useEffect(()=>{if(pg>tp)setPg(1)},[fil.length]);
  const doSort=k=>{if(sk===k)setSd(d=>d==="asc"?"desc":"asc");else{setSk(k);setSd("asc")}TK.track("sort",{key:k})};
  const SI=({col})=><span style={{opacity:sk===col?1:.3,fontSize:10,marginLeft:3}}>{sk===col&&sd==="desc"?"▼":"▲"}</span>;

  const add=f=>{const na={...f,id:Math.max(0,...appts.map(a=>a.id))+1,petId:Number(f.petId)};setAppts(p=>[...p,na]);setMod(null);toast("Programare creată!","success");TK.track("add_appt",{service:na.service})};
  const upd=f=>{setAppts(p=>p.map(a=>a.id===sel.id?{...a,...f,petId:Number(f.petId)}:a));setMod(null);setSel(null);toast("Actualizat!","success");TK.track("update_appt")};
  const rm=a=>{setAppts(p=>p.filter(x=>x.id!==a.id));setDel(null);toast("Șters.","info");TK.track("delete_appt")};

  return(
    <div style={{maxWidth:1280,margin:"0 auto",padding:"22px 20px 50px"}}>
      <div className="fu" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:10}}>
        <div><h2 style={{fontFamily:"'Lora',serif",fontSize:24,marginBottom:2}}>Programări 📅</h2><p style={{color:TX2,fontSize:13}}>{appts.length} totale</p></div>
        <button className="b bp" onClick={()=>setMod("add")}><Ic d={ic.plus} s={14}/>Programare nouă</button>
      </div>
      <div className="c fu" style={{padding:"12px 16px",marginBottom:16,display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}>
        <div style={{position:"relative",flex:"1 1 180px"}}><Ic d={ic.search} s={14} c={TX2} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)"}}/><input placeholder="Caută..." value={q} onChange={e=>{setQ(e.target.value);setPg(1)}} style={{width:"100%",padding:"7px 10px 7px 30px",border:`1.5px solid ${BD}`,borderRadius:10,fontFamily:"inherit",fontSize:13}}/></div>
        <select value={fCat} onChange={e=>{setFCat(e.target.value);setPg(1)}} style={{padding:"7px 10px",border:`1.5px solid ${BD}`,borderRadius:10,fontFamily:"inherit",fontSize:12,background:"#fff"}}><option value="">Toate categoriile</option>{CATS.map(c=><option key={c.id} value={c.id}>{c.icon} {c.title}</option>)}</select>
        <select value={fSt} onChange={e=>{setFSt(e.target.value);setPg(1)}} style={{padding:"7px 10px",border:`1.5px solid ${BD}`,borderRadius:10,fontFamily:"inherit",fontSize:12,background:"#fff"}}><option value="">Toate statusurile</option>{ST_OPTS.map(s=><option key={s}>{s}</option>)}</select>
      </div>
      <div className="c fu" style={{marginBottom:16,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:"#f8fafb"}}>{[{k:"petId",l:"Animal"},{k:"cat",l:"Categorie"},{k:"service",l:"Serviciu"},{k:"date",l:"Data"},{k:"time",l:"Ora"},{k:"provider",l:"Furnizor"},{k:"status",l:"Status"}].map(col=><th key={col.k} onClick={()=>doSort(col.k)} style={{padding:"10px 12px",textAlign:"left",fontWeight:700,color:TX2,fontSize:10,textTransform:"uppercase",letterSpacing:.4,cursor:"pointer",userSelect:"none",borderBottom:`1px solid ${BD}`,whiteSpace:"nowrap"}}>{col.l}<SI col={col.k}/></th>)}<th style={{padding:"10px 12px",borderBottom:`1px solid ${BD}`,fontWeight:700,color:TX2,fontSize:10,textTransform:"uppercase"}}>Acțiuni</th></tr></thead>
          <tbody>{paged.length===0?<tr><td colSpan={8} style={{padding:36,textAlign:"center",color:TX2}}>Nicio programare.</td></tr>:paged.map(a=>{const pet=pets.find(p=>p.id===a.petId);const cat=CATS.find(c=>c.id===a.cat);return(<tr key={a.id} style={{borderBottom:`1px solid ${BD}`,transition:"background .12s"}} onMouseEnter={ev=>ev.currentTarget.style.background="#f8fafb"} onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}><td style={{padding:"9px 12px",fontWeight:700}}>{pet?.photo||"🐾"} {pet?.name||"?"}</td><td style={{padding:"9px 12px"}}>{cat?<span className="badge" style={{background:`${cat.color}12`,color:cat.color}}>{cat.icon} {cat.title}</span>:"—"}</td><td style={{padding:"9px 12px"}}>{a.service}</td><td style={{padding:"9px 12px"}}>{a.date}</td><td style={{padding:"9px 12px"}}>{a.time}</td><td style={{padding:"9px 12px"}}>{a.provider}</td><td style={{padding:"9px 12px"}}><span className="badge" style={{background:`${ST_C[a.status]}12`,color:ST_C[a.status]}}>{a.status}</span></td><td style={{padding:"9px 12px"}}><div style={{display:"flex",gap:2}}><button className="b bg bs" style={{padding:3}} onClick={()=>{setSel(a);setMod("edit")}}><Ic d={ic.edit} s={13}/></button><button className="b bg bs" style={{padding:3,color:RED}} onClick={()=>setDel(a)}><Ic d={ic.trash} s={13}/></button></div></td></tr>)})}</tbody>
        </table>
        <div style={{padding:"10px 16px",borderTop:`1px solid ${BD}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <span style={{fontSize:12,color:TX2}}>{(pg-1)*pp+1}–{Math.min(pg*pp,fil.length)} din {fil.length}</span>
          <div style={{display:"flex",gap:2}}><button className="b bg bs" disabled={pg===1} onClick={()=>setPg(p=>p-1)}><Ic d={ic.cL} s={12}/></button>{Array.from({length:tp},(_,i)=><button key={i} className="b bs" onClick={()=>setPg(i+1)} style={{background:pg===i+1?T:"transparent",color:pg===i+1?"#fff":TX2,minWidth:30,justifyContent:"center"}}>{i+1}</button>)}<button className="b bg bs" disabled={pg===tp} onClick={()=>setPg(p=>p+1)}><Ic d={ic.cR} s={12}/></button></div>
        </div>
      </div>
      {mod==="add"&&<ApptForm pets={pets} svcs={svcs} onSave={add} onClose={()=>setMod(null)}/>}
      {mod==="edit"&&sel&&<ApptForm appt={sel} pets={pets} svcs={svcs} onSave={upd} onClose={()=>{setMod(null);setSel(null)}}/>}
      {del&&<Confirm msg={`Ștergi "${del.service}"?`} onYes={()=>rm(del)} onNo={()=>setDel(null)}/>}
    </div>
  );
}

/* ═══════════════ STATS PAGE ═══════════════ */
function StatsPage({pets,appts,setAppts,toast,TK,svcs}){
  const [mod,setMod]=useState(null);const [sel,setSel]=useState(null);const [del,setDel]=useState(null);const [ei,setEi]=useState(null);
  useEffect(()=>{TK.track("page_view",{page:"stats"});TK.pref("lastPage","stats")},[]);

  const specD=SPECIES.map((s,i)=>({l:s,v:pets.filter(p=>p.species===s).length,c:[T,"#F97316","#8B5CF6",RED,"#3B82F6","#EC4899"][i]})).filter(d=>d.v>0);
  const catD=CATS.map(c=>({l:c.title.split(" ")[0],v:appts.filter(a=>a.cat===c.id).length,c:c.color}));
  const stD=ST_OPTS.map(s=>({l:s,v:appts.filter(a=>a.status===s).length,c:ST_C[s]}));
  const mD=Array.from({length:6},(_,i)=>{const m=new Date(2026,i);return{l:m.toLocaleString("ro",{month:"short"}),v:appts.filter(a=>{const d=new Date(a.date);return d.getMonth()===i&&d.getFullYear()===2026}).length}});
  const raD=SPECIES.map(s=>({l:s.substring(0,5),v:pets.filter(p=>p.species===s).reduce((sum,p)=>sum+p.weight,0)/Math.max(pets.filter(p=>p.species===s).length,1)})).filter(d=>d.v>0);

  const qUpd=(id,field,val)=>{setAppts(p=>p.map(a=>a.id===id?{...a,[field]:val}:a));setEi(null);toast("Actualizat!","success");TK.track("inline_edit",{id,field})};
  const addA=f=>{const na={...f,id:Math.max(0,...appts.map(a=>a.id))+1,petId:Number(f.petId)};setAppts(p=>[...p,na]);setMod(null);toast("Adăugat!","success")};
  const updA=f=>{setAppts(p=>p.map(a=>a.id===sel.id?{...a,...f,petId:Number(f.petId)}:a));setMod(null);setSel(null);toast("Salvat!","success")};
  const delA=a=>{setAppts(p=>p.filter(x=>x.id!==a.id));setDel(null);toast("Șters.","info")};

  return(
    <div style={{maxWidth:1400,margin:"0 auto",padding:"22px 20px 50px"}}>
      <div className="fu" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div><h2 style={{fontFamily:"'Lora',serif",fontSize:24,marginBottom:2}}>Statistici & Date 📊</h2><p style={{color:TX2,fontSize:13}}>Graficele se actualizează live la modificări</p></div>
        <button className="b bp" onClick={()=>setMod("add")}><Ic d={ic.plus} s={14}/>Programare nouă</button>
      </div>
      <div className="sbs" style={{display:"flex",gap:20,alignItems:"flex-start"}}>
        <div className="c fu" style={{flex:"1 1 54%",overflow:"hidden"}}>
          <div style={{padding:"12px 16px",borderBottom:`1px solid ${BD}`,fontWeight:800,fontSize:13}}>📋 Programări ({appts.length}) — click valori pt editare rapidă</div>
          <div style={{overflowX:"auto",maxHeight:480,overflowY:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr style={{background:"#f8fafb",position:"sticky",top:0,zIndex:1}}>{["Animal","Categorie","Serviciu","Data","Status","Acțiuni"].map(h=><th key={h} style={{padding:"8px 10px",textAlign:"left",fontWeight:700,color:TX2,fontSize:10,textTransform:"uppercase",borderBottom:`1px solid ${BD}`,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
              <tbody>{appts.map(a=>{const pet=pets.find(p=>p.id===a.petId);const cat=CATS.find(c=>c.id===a.cat);return(<tr key={a.id} style={{borderBottom:`1px solid ${BD}`,transition:"background .12s"}} onMouseEnter={ev=>ev.currentTarget.style.background="#f8fafb"} onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>
                <td style={{padding:"8px 10px",fontWeight:700}}>{pet?.photo||"🐾"} {pet?.name||"?"}</td>
                <td style={{padding:"8px 10px"}}>{cat?<span style={{fontSize:14}}>{cat.icon}</span>:"—"}</td>
                <td style={{padding:"8px 10px"}}>{ei?.id===a.id&&ei?.f==="service"?<select autoFocus defaultValue={a.service} onChange={ev=>qUpd(a.id,"service",ev.target.value)} onBlur={ev=>qUpd(a.id,"service",ev.target.value)} style={{padding:"2px 4px",border:`1px solid ${T}`,borderRadius:6,fontSize:11}}>{(svcs||ALL_SERVICES).map(s=><option key={s}>{s}</option>)}</select>:<span style={{cursor:"pointer"}} onClick={()=>setEi({id:a.id,f:"service"})}>{a.service}</span>}</td>
                <td style={{padding:"8px 10px"}}>{ei?.id===a.id&&ei?.f==="date"?<input autoFocus type="date" defaultValue={a.date} onBlur={ev=>qUpd(a.id,"date",ev.target.value)} style={{padding:"2px 4px",border:`1px solid ${T}`,borderRadius:6,fontSize:11}}/>:<span style={{cursor:"pointer"}} onClick={()=>setEi({id:a.id,f:"date"})}>{a.date}</span>}</td>
                <td style={{padding:"8px 10px"}}>{ei?.id===a.id&&ei?.f==="status"?<select autoFocus defaultValue={a.status} onChange={ev=>qUpd(a.id,"status",ev.target.value)} onBlur={ev=>qUpd(a.id,"status",ev.target.value)} style={{padding:"2px 4px",border:`1px solid ${T}`,borderRadius:6,fontSize:11}}>{ST_OPTS.map(s=><option key={s}>{s}</option>)}</select>:<span className="badge" style={{background:`${ST_C[a.status]}12`,color:ST_C[a.status],cursor:"pointer"}} onClick={()=>setEi({id:a.id,f:"status"})}>{a.status}</span>}</td>
                <td style={{padding:"8px 10px"}}><div style={{display:"flex",gap:2}}><button className="b bg bs" style={{padding:3}} onClick={()=>{setSel(a);setMod("edit")}}><Ic d={ic.edit} s={12}/></button><button className="b bg bs" style={{padding:3,color:RED}} onClick={()=>setDel(a)}><Ic d={ic.trash} s={12}/></button></div></td>
              </tr>)})}</tbody>
            </table>
          </div>
        </div>
        <div style={{flex:"1 1 46%",display:"flex",flexDirection:"column",gap:16}}>
          <div className="c sr" style={{padding:20}}><h4 style={{fontSize:13,fontWeight:800,marginBottom:12}}>🐾 Animale pe specii</h4><div style={{display:"flex",justifyContent:"center"}}><Pie data={specD}/></div></div>
          <div className="c sr d1" style={{padding:20}}><h4 style={{fontSize:13,fontWeight:800,marginBottom:12}}>📊 Programări pe categorii</h4><div style={{display:"flex",justifyContent:"center",overflow:"auto"}}><Bar data={catD} w={340} h={190}/></div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div className="c sr d2" style={{padding:20}}><h4 style={{fontSize:12,fontWeight:800,marginBottom:10}}>🎯 Greutate medie</h4><div style={{display:"flex",justifyContent:"center"}}><Radar data={raD} w={180} h={180}/></div></div>
            <div className="c sr d3" style={{padding:20}}><h4 style={{fontSize:12,fontWeight:800,marginBottom:10}}>❤️ Status</h4><div style={{display:"flex",justifyContent:"center"}}><Pie data={stD} w={165} h={165}/></div></div>
          </div>
          <div className="c sr d4" style={{padding:20}}><h4 style={{fontSize:13,fontWeight:800,marginBottom:12}}>📈 Programări lunare</h4><div style={{display:"flex",justifyContent:"center",overflow:"auto"}}><LineC data={mD} w={340} h={160}/></div></div>
        </div>
      </div>
      {mod==="add"&&<ApptForm pets={pets} svcs={svcs} onSave={addA} onClose={()=>setMod(null)}/>}
      {mod==="edit"&&sel&&<ApptForm appt={sel} pets={pets} svcs={svcs} onSave={updA} onClose={()=>{setMod(null);setSel(null)}}/>}
      {del&&<Confirm msg={`Ștergi "${del.service}"?`} onYes={()=>delA(del)} onNo={()=>setDel(null)}/>}
    </div>
  );
}

/* ═══════════════ PROFILE ═══════════════ */
function Profile({user,TK,role,onResetSvcs}){
  const log=TK.getLog();const prefs=TK.getPrefs();
  const savedCats=CK.get("pv_cats")||[];const activeCats=CATS.filter(c=>savedCats.includes(c.id));
  useEffect(()=>{TK.track("page_view",{page:"profile"})},[]);
  return(
    <div style={{maxWidth:780,margin:"0 auto",padding:"22px 20px 50px"}}>
      <div className="c fu" style={{padding:0,overflow:"hidden",marginBottom:20}}>
        <div style={{background:`linear-gradient(135deg,${T},${TD})`,padding:"32px 24px",color:"#fff"}}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <div style={{width:62,height:62,borderRadius:18,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,fontWeight:900}}>{(user.name||"U")[0]}</div>
            <div><h2 style={{fontSize:20,fontWeight:800}}>{user.name}</h2><p style={{opacity:.85,fontSize:13}}>{user.email}</p>
            <span className="badge" style={{background:"rgba(255,255,255,.18)",color:"#fff",marginTop:4,fontSize:10}}>{role==="vet"?"🏥 Medic":"🐾 Proprietar"}</span></div>
          </div>
        </div>
        <div style={{padding:"20px 24px",borderBottom:`1px solid ${BD}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><h3 style={{fontSize:14,fontWeight:800}}>🎯 Servicii active</h3>{onResetSvcs&&<button className="b bo bs" onClick={onResetSvcs}>Schimbă</button>}</div>
          {activeCats.length===0?<p style={{color:TX2,fontSize:13}}>Nicio categorie.</p>:<div style={{display:"flex",flexWrap:"wrap",gap:8}}>{activeCats.map(cat=><div key={cat.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",background:cat.bg,borderRadius:12,border:`1.5px solid ${cat.color}20`}}><span style={{fontSize:18}}>{cat.icon}</span><div><div style={{fontSize:12,fontWeight:800,color:cat.color}}>{cat.title}</div><div style={{fontSize:10,color:TX2}}>{cat.services.length} servicii</div></div></div>)}</div>}
        </div>
        <div style={{padding:"20px 24px"}}><h3 style={{fontSize:14,fontWeight:800,marginBottom:12}}>🍪 Preferințe (Cookie)</h3><div style={{background:"#f8fafb",borderRadius:12,padding:14,fontSize:12,lineHeight:1.7}}>{Object.keys(prefs).length===0?<span style={{color:TX2}}>—</span>:Object.entries(prefs).map(([k,v])=><div key={k}><b>{k}:</b> {typeof v==="string"?v:JSON.stringify(v)}</div>)}</div></div>
      </div>
      <div className="c fu d1" style={{padding:"20px 24px"}}><h3 style={{fontSize:14,fontWeight:800,marginBottom:12}}>📋 Activitate (Cookie Log)</h3>{log.length===0?<p style={{color:TX2,fontSize:13}}>—</p>:<div style={{maxHeight:360,overflowY:"auto"}}>{[...log].reverse().slice(0,25).map((a,i)=><div key={i} style={{padding:"8px 0",borderBottom:i<24?`1px solid ${BD}`:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontWeight:700,fontSize:13}}>{a.action}</span>{a.details&&Object.keys(a.details).length>0&&<span style={{color:TX2,fontSize:12,marginLeft:6}}>{Object.entries(a.details).map(([k,v])=>`${k}: ${v}`).join(", ")}</span>}</div><span style={{fontSize:11,color:TX2,whiteSpace:"nowrap"}}>{new Date(a.ts).toLocaleString("ro")}</span></div>)}</div>}</div>
    </div>
  );
}

/* ═══════════════ APP ═══════════════ */
export default function App(){
  const [pg,setPg]=useState("landing");
  const [user,setUser]=useState(null);
  const [role,setRole]=useState("owner");
  const [pets,setPets]=useState(INIT_PETS);
  const [appts,setAppts]=useState(INIT_APPTS);
  const [toasts,setToasts]=useState([]);
  const [showPicker,setShowPicker]=useState(false);
  const [svcs,setSvcs]=useState(null);
  const tid=useRef(0);
  const TK=useTracker(user);

  useEffect(()=>{
    const s=CK.get("pv_session");
    if(s){setUser(s);setRole(s.role||"owner");
      const sc=CK.get("pv_cats"),ss=CK.get("pv_svcs");
      if(sc&&ss){setSvcs(ss);setPg("dashboard")}else{setShowPicker(true);setPg("dashboard")}
    }
  },[]);

  const toast=(m,tp="info")=>{const id=++tid.current;setToasts(p=>[...p,{id,m,tp}]);setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3000)};

  const login=u=>{
    setUser(u);setRole(u.role||"owner");CK.set("pv_session",u,7);
    const sc=CK.get("pv_cats"),ss=CK.get("pv_svcs");
    if(sc&&ss){setSvcs(ss);setPg("dashboard")}else{setShowPicker(true);setPg("dashboard")}
  };

  const pickDone=(cats,services)=>{setSvcs(services);setShowPicker(false);toast(`${cats.length} ${cats.length===1?"categorie activată":"categorii activate"} 🎉`,"success")};

  const logout=()=>{CK.del("pv_session");TK.track("logout");setUser(null);setSvcs(null);setPg("landing");toast("Deconectat.","info")};

  const resetSvcs=()=>{CK.del("pv_cats");CK.del("pv_svcs");setSvcs(null);setShowPicker(true);toast("Alege din nou serviciile.","info")};

  const activeSvcs=svcs||ALL_SERVICES;

  return(
    <>
      <Toasts items={toasts}/>
      <Nav pg={pg} go={setPg} user={user} role={role} onLogout={logout}/>
      {showPicker&&user&&<ServicePicker onDone={pickDone} tracker={TK}/>}
      {pg==="landing"&&<Landing go={setPg}/>}
      {pg==="login"&&<Auth type="login" go={setPg} onLogin={login} toast={toast}/>}
      {pg==="register"&&<Auth type="register" go={setPg} onLogin={login} toast={toast}/>}
      {pg==="dashboard"&&user&&!showPicker&&<Dash pets={pets} appts={appts} go={setPg} TK={TK} role={role} svcs={activeSvcs}/>}
      {pg==="pets"&&user&&<PetsPage pets={pets} setPets={setPets} appts={appts} toast={toast} TK={TK} role={role}/>}
      {pg==="appointments"&&user&&<ApptsPage appts={appts} setAppts={setAppts} pets={pets} toast={toast} TK={TK} svcs={activeSvcs} role={role}/>}
      {pg==="stats"&&user&&<StatsPage pets={pets} appts={appts} setAppts={setAppts} toast={toast} TK={TK} svcs={activeSvcs}/>}
      {pg==="profile"&&user&&<Profile user={user} TK={TK} role={role} onResetSvcs={resetSvcs}/>}
    </>
  );
}
"""

# ==========================================
# Creeaza fisierele
# ==========================================
create_file("src/utils.js", utils_js)
create_file("src/styles.css", styles_css)
create_file("src/utils.test.js", utils_test_js)
create_file("tests/petvet.spec.js", petvet_spec_js)
create_file("src/App.jsx", app_jsx)

print("\n🎉 Totul e gata! Nu uita să instalezi bibliotecile de testare:")
print("npm install --save-dev jest @testing-library/react @testing-library/jest-dom @playwright/test")
print("npx playwright install")