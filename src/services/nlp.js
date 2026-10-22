const CATEGORIES={
"Food & Mess":["food mess meal canteen cafeteria lunch dinner breakfast stale taste hygiene undercooked menu drinking water","poor food quality mess food cold rice insects plate"],
"Hostel & Accommodation":["hostel room accommodation dormitory bed bathroom water leakage plumbing warden hot water fan room mate","water leaking ceiling hostel floor washroom"],
"Infrastructure & Maintenance":["infrastructure maintenance broken projector classroom bench furniture lift electrical wiring laboratory equipment repair","sparking wire broken chair ceiling leak equipment not working"],
"Academics & Faculty":["academic faculty professor lecturer timetable syllabus attendance exam marks lecture class schedule teaching","faculty timetable conflict exam result lecture"],
"IT & Wi-Fi":["wifi wi-fi internet network connectivity router login portal computer lab bandwidth","internet slow disconnected wifi password"],
"Cleanliness & Sanitation":["cleanliness sanitation garbage waste dustbin dirty washroom pest smell drainage cleaning","overflowing garbage unclean toilet"],
"Transport & Parking":["transport bus shuttle parking vehicle traffic route driver late arrival","college bus late parking space"],
"Administration":["administration scholarship fees certificate admission office paperwork ID card refund","scholarship application delay fee receipt"],
"Safety & Security":["safety security harassment threat emergency unsafe guard fire alarm exposed wire sparking","dangerous electrical fault students threat"],
"Other":["other general complaint suggestion service"]
};
const SYNONYMS={"leaking":"leak","leaked":"leak","leaks":"leak","internet":"wifi","wi-fi":"wifi","canteen":"mess","cafeteria":"mess","washroom":"bathroom","toilet":"bathroom","dorm":"hostel","dormitory":"hostel","lecturer":"faculty","professor":"faculty","garbage":"waste","rubbish":"waste","sparking":"spark","sparks":"spark","unusable":"broken","malfunctioning":"broken","disconnected":"disconnect"};
const STOP=new Set("the a an and or but is are was were be been to of in on at for with this that it my our their we i have has had please kindly very from near by as not".split(" "));
const norm=s=>s.toLowerCase().replace(/[^a-z0-9\s-]/g," ").split(/\s+/).filter(Boolean).map(t=>SYNONYMS[t]||t);
const phrases=Object.fromEntries(Object.entries(CATEGORIES).map(([k,v])=>[k,v.flatMap(x=>x.split(/[,;]/)).map(x=>x.trim().toLowerCase()).filter(Boolean)]));
export function analyzeComplaint(title,description){
 const raw=`${title} ${description}`;const tokens=norm(raw),joined=` ${tokens.join(" ")} `;
 const scores=Object.entries(phrases).map(([category,terms])=>{let score=0,matched=[];for(const phrase of terms){const p=norm(phrase).join(" ");if(p.length>3&&joined.includes(` ${p} `)){score+=p.includes(" ")?2.8:1.15;matched.push(phrase)}else if(p.length>4&&tokens.includes(p)){score+=1;matched.push(phrase)}} 
 // TF-IDF-style term weighting: rare descriptive terms weigh more than common words.
 const unique=[...new Set(tokens)];for(const t of unique){if(t.length>3&&!STOP.has(t)&&terms.some(x=>norm(x).includes(t))&&!matched.includes(t)){score+=.55;matched.push(t)}}
 return {category,score,matched:[...new Set(matched)].slice(0,6)};}).sort((a,b)=>b.score-a.score);
 const total=scores.reduce((s,x)=>s+x.score,0),best=scores[0],second=scores[1];
 const confidence=best.score<1?Math.min(.42,.2+tokens.length*.015):Math.min(.97,.48+(best.score/(best.score+Math.max(.5,second.score)))*.45);
 const category=best.score<.7?"Other":best.category;
 const safety=/\b(spark|sparking|exposed wire|fire|assault|harass|threat|emergency|dangerous|electrical fault|injur|violence)\b/i.test(raw);
 const high=/\b(entire|whole floor|no water|multiple|urgent|immediately|severe|flood|unsafe|critical|outage|blocked)\b/i.test(raw);
 const medium=/\b(delay|broken|not working|leak|poor|slow|unavailable|repeated|complaint)\b/i.test(raw);
 const priority=safety?"Critical":high?"High":medium?"Medium":"Low";
 const negative=/\b(terrible|poor|bad|dirty|stale|broken|leak|slow|delay|unsafe|disgusting|angry|worst|failure|not working|unacceptable)\b/i.test(raw);
 const positive=/\b(great|good|thank|excellent|appreciate|resolved|helpful)\b/i.test(raw);
 const urgency=safety||/\b(now|immediately|urgent|emergency|asap)\b/i.test(raw)?"Urgent":high||medium?"Elevated":"Normal";
 const keywords=[...new Set(tokens.filter(t=>t.length>3&&!STOP.has(t)))].slice(0,8);
 return {category,subcategory:best.matched[0]||"General",confidence:Math.round(confidence*100),priority,sentiment:negative?"Negative":positive?"Positive":"Neutral",urgency,keywords,evidence:best.matched.slice(0,5),scores:scores.slice(0,4)};
}
export const SLA={Critical:4,High:24,Medium:72,Low:168};
export const DEPARTMENTS=["Hostel & Facilities","Catering Services","IT Services","Academic Affairs","Campus Operations","Administration","Security"];
export function departmentFor(category){return {"Food & Mess":"Catering Services","Hostel & Accommodation":"Hostel & Facilities","Infrastructure & Maintenance":"Campus Operations","Academics & Faculty":"Academic Affairs","IT & Wi-Fi":"IT Services","Cleanliness & Sanitation":"Campus Operations","Transport & Parking":"Campus Operations","Administration":"Administration","Safety & Security":"Security","Other":"Administration"}[category]||"Administration";}
