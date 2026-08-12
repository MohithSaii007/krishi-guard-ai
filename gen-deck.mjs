import PptxGenJS from "pptxgenjs";
import fs from "fs";

const A="src/assets/";
const img=(f)=>({data:`image/jpeg;base64,${fs.readFileSync(A+f).toString("base64")}`});
const FOREST="174A35", DEEP="0F3325", CREAM="F5F0E6", GOLD="D4AF37", LEAF="2D5A27", CHAR="122620", WHITE="FFFFFF";
const HF="Poppins", BF="Inter";

const p=new PptxGenJS();
p.defineLayout({name:"W16",width:13.333,height:7.5});
p.layout="W16";
p.author="KRISHI-GUARD AI";
p.title="KRISHI-GUARD AI — MSME Idea Hackathon 6.0";

const W=13.333,H=7.5;
function shell(s,{dark=false}={}){
  s.background={color: dark?DEEP:CREAM};
}
function kicker(s,txt,dark=false){
  s.addText(txt.toUpperCase(),{x:1.0,y:0.62,w:9,h:0.32,fontFace:BF,fontSize:12,bold:true,charSpacing:2.2,color:dark?GOLD:LEAF});
}
function title(s,txt,dark=false,opts={}){
  s.addText(txt,{x:1.0,y:1.0,w:opts.w||10.5,h:opts.h||1.1,fontFace:HF,fontSize:opts.fs||36,bold:true,color:dark?WHITE:FOREST,valign:"top",lineSpacing:opts.ls||40});
}
function footer(s,n,dark=false){
  s.addShape(p.ShapeType.line,{x:1.0,y:6.86,w:11.33,h:0,line:{color:dark?WHITE:FOREST,width:0.5,transparency:85}});
  s.addText("KRISHI-GUARD AI  |  MSME Idea Hackathon 6.0",{x:1.0,y:6.95,w:8,h:0.3,fontFace:BF,fontSize:10,color:dark?WHITE:CHAR,transparency:dark?40:45});
  s.addText(`${String(n).padStart(2,"0")} / 10`,{x:11.0,y:6.95,w:1.33,h:0.3,align:"right",fontFace:BF,fontSize:10,bold:true,color:dark?GOLD:FOREST,transparency:dark?0:30});
}
function card(s,{x,y,w,h,fill=WHITE,line=FOREST,trans=25,radius=0.06}){
  s.addShape(p.ShapeType.roundRect,{x,y,w,h,rectRadius:0.14,fill:{color:fill,transparency:trans},line:{color:line,width:0.75,transparency:82}});
}

/* ---------- 1 TITLE ---------- */
let s=p.addSlide();
s.addImage({...img("hero-farmer.jpg"),x:0,y:0,w:W,h:H});
s.addImage({data:`image/png;base64,${fs.readFileSync(A+"overlay-gradient.png").toString("base64")}`,x:0,y:0,w:W,h:H});
s.addText("AI • IoT • EDGE COMPUTING • SMART AGRICULTURE",{x:1.1,y:1.75,w:9,h:0.35,fontFace:BF,fontSize:13,bold:true,charSpacing:2.5,color:GOLD});
s.addText([{text:"KRISHI-GUARD ",options:{color:WHITE}},{text:"AI",options:{color:GOLD}}],{x:1.05,y:2.25,w:11,h:1.35,fontFace:HF,fontSize:72,bold:true});
s.addText("Intelligent Smart Farming & Crop Protection Ecosystem",{x:1.1,y:3.75,w:10.6,h:0.5,fontFace:HF,fontSize:24,color:WHITE,transparency:8});
s.addShape(p.ShapeType.line,{x:1.1,y:4.6,w:3.6,h:0,line:{color:WHITE,width:1,transparency:60}});
s.addText("MSME IDEA HACKATHON 6.0",{x:1.1,y:5.85,w:7,h:0.3,fontFace:BF,fontSize:13,bold:true,charSpacing:2,color:GOLD});
s.addText("Team Name  |  CSE – Data Science  |  Sri Venkateswara College of Engineering, Tirupati",{x:1.1,y:6.2,w:9,h:0.35,fontFace:BF,fontSize:13,color:WHITE,transparency:20});
s.addText("01 / 10",{x:11.2,y:6.2,w:1.1,h:0.3,align:"right",fontFace:BF,fontSize:12,bold:true,color:WHITE,transparency:35});

/* ---------- 2 PROBLEM ---------- */
s=p.addSlide(); shell(s);
s.addImage({...img("farmer-inspect.jpg"),x:0,y:0,w:5.2,h:H,sizing:{type:"cover",w:5.2,h:H}});
s.addShape(p.ShapeType.rect,{x:4.0,y:0,w:1.4,h:H,fill:{color:CREAM,transparency:35}});
s.addText("01 — THE CHALLENGE",{x:5.75,y:0.85,w:6,h:0.3,fontFace:BF,fontSize:12,bold:true,charSpacing:2.2,color:LEAF});
s.addText("Farming decisions are still highly uncertain.",{x:5.7,y:1.2,w:6.9,h:1.1,fontFace:HF,fontSize:32,bold:true,color:FOREST,lineSpacing:36});
s.addText("Farmers often decide without integrated, real-time information about soil, weather, water and crop health.",{x:5.72,y:2.4,w:6.7,h:0.7,fontFace:BF,fontSize:14,color:CHAR,transparency:30,lineSpacing:20});
const probs=[["WATER","Uncertain irrigation requirements"],["SOIL","Limited real-time soil intelligence"],["CROP HEALTH","Disease and pest risks identified late"],["WEATHER","Changing weather affects farm decisions"]];
probs.forEach((it,i)=>{
  const x=5.7+(i%2)*3.5, y=3.25+Math.floor(i/2)*1.28;
  card(s,{x,y,w:3.25,h:1.12});
  s.addText(it[0],{x:x+0.25,y:y+0.16,w:2.8,h:0.28,fontFace:BF,fontSize:12,bold:true,charSpacing:1.4,color:FOREST});
  s.addText(it[1],{x:x+0.25,y:y+0.5,w:2.8,h:0.5,fontFace:BF,fontSize:12,color:CHAR,transparency:30,lineSpacing:15});
});
s.addShape(p.ShapeType.roundRect,{x:5.7,y:5.9,w:6.75,h:0.78,rectRadius:0.1,fill:{color:FOREST}});
s.addShape(p.ShapeType.rect,{x:5.7,y:5.9,w:0.06,h:0.78,fill:{color:GOLD}});
s.addText("Farmers need timely, field-specific intelligence — not just raw data.",{x:5.95,y:5.9,w:6.3,h:0.78,valign:"middle",fontFace:BF,fontSize:14,color:WHITE});
footer(s,2);

/* ---------- 3 SOLUTION ---------- */
s=p.addSlide(); shell(s);
kicker(s,"02 — Our Solution");
title(s,"One intelligent ecosystem for the farm.",false,{w:6.2,fs:32});
s.addText("KRISHI-GUARD AI is an AI and IoT-based smart farming ecosystem that collects agricultural information and converts it into actionable recommendations.",{x:7.4,y:1.05,w:4.95,h:1.1,fontFace:BF,fontSize:14,color:CHAR,transparency:28,lineSpacing:21});
const ins=[["SOIL","pH • NPK • Moisture"],["WEATHER","Temp • Humidity • Rainfall"],["WATER","Water / moisture monitoring"],["CROP IMAGING","Drone / crop images"],["FARMER APP","Mobile + Voice AI"]];
ins.forEach((it,i)=>{
  const x=1.0+i*2.29;
  card(s,{x,y:2.5,w:2.05,h:1.32});
  s.addText(it[0],{x:x+0.12,y:2.72,w:1.8,h:0.3,align:"center",fontFace:BF,fontSize:12,bold:true,charSpacing:1.2,color:FOREST});
  s.addText(it[1],{x:x+0.12,y:3.08,w:1.8,h:0.6,align:"center",fontFace:BF,fontSize:11,color:CHAR,transparency:32,lineSpacing:14});
});
s.addShape(p.ShapeType.line,{x:6.665,y:3.9,w:0,h:0.35,line:{color:FOREST,width:1,transparency:60}});
s.addShape(p.ShapeType.roundRect,{x:4.15,y:4.3,w:5.03,h:1.15,rectRadius:0.2,fill:{color:FOREST}});
s.addText("CENTRAL INTELLIGENCE",{x:4.15,y:4.45,w:5.03,h:0.28,align:"center",fontFace:BF,fontSize:11,bold:true,charSpacing:2,color:GOLD});
s.addText("KRISHI-GUARD AI",{x:4.15,y:4.72,w:5.03,h:0.4,align:"center",fontFace:HF,fontSize:22,bold:true,color:WHITE});
s.addText("Edge AI Gateway + Decision Engine",{x:4.15,y:5.1,w:5.03,h:0.28,align:"center",fontFace:BF,fontSize:11,color:WHITE,transparency:32});
["COLLECT","ANALYZE","RECOMMEND","ACT"].forEach((t,i)=>{
  const x=3.55+i*1.62;
  s.addShape(p.ShapeType.roundRect,{x,y:5.85,w:1.35,h:0.5,rectRadius:0.25,fill:{color:WHITE,transparency:20},line:{color:FOREST,width:0.75,transparency:80}});
  s.addText(t,{x,y:5.85,w:1.35,h:0.5,align:"center",valign:"middle",fontFace:BF,fontSize:11,bold:true,color:FOREST});
  if(i<3) s.addText("→",{x:x+1.35,y:5.85,w:0.27,h:0.5,align:"center",valign:"middle",fontFace:BF,fontSize:14,color:LEAF});
});
footer(s,3);

/* ---------- 4 ARCHITECTURE ---------- */
s=p.addSlide(); shell(s,{dark:true});
kicker(s,"03 — System Architecture",true);
title(s,"From farm data to intelligent decisions.",true,{w:3.5,fs:30,ls:34});
["Water monitoring","Market data","Weather data"].forEach((t,i)=>{
  s.addShape(p.ShapeType.line,{x:1.0,y:3.0+i*0.42,w:0.35,h:0,line:{color:LEAF,width:1.25}});
  s.addText(t,{x:1.45,y:2.86+i*0.42,w:3,h:0.3,fontFace:BF,fontSize:12,color:WHITE,transparency:30});
});
s.addShape(p.ShapeType.roundRect,{x:1.0,y:4.7,w:2.9,h:0.55,rectRadius:0.25,fill:{color:WHITE,transparency:94},line:{color:WHITE,width:0.75,transparency:78}});
s.addText("Supporting data sources",{x:1.0,y:4.7,w:2.9,h:0.55,align:"center",valign:"middle",fontFace:BF,fontSize:11,color:WHITE,transparency:18});
function node(x,y,w,t,sub,accent){
  s.addShape(p.ShapeType.roundRect,{x,y,w,h:sub?0.7:0.5,rectRadius:0.1,fill:{color:accent?GOLD:WHITE,transparency:accent?86:92},line:{color:accent?GOLD:WHITE,width:0.9,transparency:accent?45:78}});
  s.addText(t,{x,y:y+(sub?0.08:0),w,h:sub?0.3:0.5,align:"center",valign:"middle",fontFace:BF,fontSize:12,bold:true,color:accent?GOLD:WHITE});
  if(sub) s.addText(sub,{x,y:y+0.38,w,h:0.26,align:"center",fontFace:BF,fontSize:10,color:WHITE,transparency:40});
}
function conn(x,y){s.addShape(p.ShapeType.line,{x,y,w:0,h:0.26,line:{color:LEAF,width:1.25,endArrowType:"triangle"}});}
const CX=8.6;
node(CX-1.0,0.85,2.0,"FARM"); conn(CX,1.35);
node(CX-3.5,1.66,2.15,"SOIL IoT","pH • NPK • Moisture");
node(CX-1.07,1.66,2.15,"WEATHER STATION","Micro-climate");
node(CX+1.36,1.66,2.15,"CROP IMAGING","Drone / camera");
conn(CX,2.36);
node(CX-1.85,2.66,3.7,"EDGE AI GATEWAY","Raspberry Pi / Jetson",true); conn(CX,3.36);
node(CX-1.85,3.66,3.7,"AI DECISION ENGINE"); conn(CX,4.16);
node(CX-1.85,4.42,3.7,"RECOMMENDATION ENGINE"); conn(CX,4.92);
node(CX-1.4,5.18,2.8,"FARMER APP","Mobile • Voice AI",true);
s.addText([{text:"IoT ",options:{color:WHITE}},{text:"→ ",options:{color:LEAF}},{text:"Edge AI ",options:{color:WHITE}},{text:"→ ",options:{color:LEAF}},{text:"Decision Intelligence ",options:{color:WHITE}},{text:"→ ",options:{color:LEAF}},{text:"Farmer",options:{color:WHITE}}],{x:5.0,y:6.15,w:7.3,h:0.35,align:"center",fontFace:BF,fontSize:13,transparency:15});
footer(s,4,true);

/* ---------- 5 HOW IT WORKS ---------- */
s=p.addSlide(); shell(s);
s.addImage({...img("aerial-field.jpg"),x:0,y:0,w:W,h:H,transparency:92});
kicker(s,"04 — How It Works");
title(s,"The intelligence loop",false,{fs:34});
s.addText("A continuous field-to-farmer cycle that turns sensing into decision support.",{x:1.02,y:2.05,w:8,h:0.4,fontFace:BF,fontSize:14,color:CHAR,transparency:30});
const steps=[["01","COLLECT","Soil, weather, water & crop data"],["02","CONNECT","IoT gateway gathers field information"],["03","ANALYZE","Edge AI processes agricultural data"],["04","DECIDE","AI identifies risks and requirements"],["05","ACT","Farmer receives recommendations"]];
steps.forEach((st,i)=>{
  const x=1.0+i*2.29;
  card(s,{x,y:2.9,w:2.05,h:1.85});
  s.addText("STEP "+st[0],{x:x+0.2,y:3.08,w:1.65,h:0.26,fontFace:BF,fontSize:11,bold:true,charSpacing:1.2,color:GOLD});
  s.addText(st[1],{x:x+0.2,y:3.42,w:1.7,h:0.35,fontFace:HF,fontSize:17,bold:true,color:FOREST});
  s.addText(st[2],{x:x+0.2,y:3.85,w:1.68,h:0.8,fontFace:BF,fontSize:11,color:CHAR,transparency:30,lineSpacing:14});
  if(i<4) s.addText("→",{x:x+2.05,y:3.6,w:0.24,h:0.4,align:"center",fontFace:BF,fontSize:14,color:LEAF});
});
s.addShape(p.ShapeType.line,{x:1.0,y:5.55,w:3.4,h:0,line:{color:FOREST,width:0.75,transparency:85}});
s.addShape(p.ShapeType.roundRect,{x:4.6,y:5.28,w:4.15,h:0.55,rectRadius:0.27,fill:{color:FOREST}});
s.addText("SENSE → PROCESS → RECOMMEND → LEARN",{x:4.6,y:5.28,w:4.15,h:0.55,align:"center",valign:"middle",fontFace:BF,fontSize:11,bold:true,charSpacing:1,color:WHITE});
s.addShape(p.ShapeType.line,{x:8.95,y:5.55,w:3.38,h:0,line:{color:FOREST,width:0.75,transparency:85}});
footer(s,5);

/* ---------- 6 AI INTELLIGENCE ---------- */
s=p.addSlide(); shell(s,{dark:true});
kicker(s,"05 — AI Intelligence",true);
title(s,"The brain behind the farm.",true,{fs:34});
const mods=[["SOIL INTELLIGENCE","Analyzes soil parameters for better farm management."],["DISEASE PREDICTION","Identifies potential crop disease risks."],["PEST PREDICTION","Early warnings regarding possible pest problems."],["IRRIGATION OPTIMIZATION","Soil, water and weather based irrigation guidance."],["FERTILIZER OPTIMIZATION","Supports fertilizer planning from soil and crop data."],["MARKET INTELLIGENCE","Provides market-related agricultural information."]];
mods.forEach((m,i)=>{
  const left=i<3; const x=left?1.0:8.85; const y=2.3+(i%3)*1.32;
  s.addShape(p.ShapeType.roundRect,{x,y,w:3.5,h:1.12,rectRadius:0.12,fill:{color:WHITE,transparency:93},line:{color:WHITE,width:0.75,transparency:82}});
  s.addText(m[0],{x:x+0.28,y:y+0.14,w:3,h:0.28,fontFace:BF,fontSize:12,bold:true,color:WHITE});
  s.addText(m[1],{x:x+0.28,y:y+0.46,w:3,h:0.56,fontFace:BF,fontSize:11,color:WHITE,transparency:38,lineSpacing:14});
});
s.addShape(p.ShapeType.ellipse,{x:5.05,y:2.55,w:3.2,h:3.2,fill:{color:DEEP},line:{color:LEAF,width:1.25,transparency:45}});
s.addShape(p.ShapeType.ellipse,{x:5.55,y:3.05,w:2.2,h:2.2,fill:{type:"none"},line:{color:GOLD,width:0.75,transparency:70}});
s.addText("AI",{x:5.05,y:3.35,w:3.2,h:0.9,align:"center",fontFace:HF,fontSize:54,bold:true,color:GOLD});
s.addText("DECISION ENGINE",{x:5.05,y:4.25,w:3.2,h:0.3,align:"center",fontFace:BF,fontSize:13,bold:true,color:WHITE});
s.addText("Neural inference at the edge",{x:5.05,y:4.56,w:3.2,h:0.28,align:"center",fontFace:BF,fontSize:11,color:WHITE,transparency:42});
s.addText([{text:"Multiple agricultural signals ",options:{color:WHITE}},{text:"→ ",options:{color:GOLD}},{text:"one intelligent decision layer",options:{color:WHITE}}],{x:2.5,y:6.28,w:8.3,h:0.35,align:"center",fontFace:BF,fontSize:14,transparency:20});
footer(s,6,true);

/* ---------- 7 FARMER EXPERIENCE ---------- */
s=p.addSlide(); shell(s);
kicker(s,"06 — Farmer Experience");
title(s,"Intelligence in the farmer's hand.",false,{w:5.4,fs:28,ls:34});
s.addText("Recommendations reach the farmer in a simple, understandable format — on mobile and by voice.",{x:1.02,y:2.15,w:5.4,h:0.7,fontFace:BF,fontSize:14,color:CHAR,transparency:30,lineSpacing:21});
[["REAL-TIME INSIGHTS"],["ACTIONABLE RECOMMENDATIONS"],["FARMER-FRIENDLY INTERFACE"],["VOICE-ENABLED INTERACTION"]].forEach((pt,i)=>{
  const y=3.05+i*0.72;
  card(s,{x:1.0,y,w:5.4,h:0.6});
  s.addShape(p.ShapeType.ellipse,{x:1.22,y:y+0.21,w:0.16,h:0.16,fill:{color:LEAF}});
  s.addText(pt[0],{x:1.55,y,w:4.6,h:0.6,valign:"middle",fontFace:BF,fontSize:12,bold:true,charSpacing:1,color:FOREST});
});
// phone mock
const PX=6.95, PY=1.0, PW=2.55, PH=5.35;
s.addShape(p.ShapeType.roundRect,{x:PX,y:PY,w:PW,h:PH,rectRadius:0.14,fill:{color:CHAR},line:{color:CHAR,width:1}});
s.addShape(p.ShapeType.roundRect,{x:PX+0.11,y:PY+0.11,w:PW-0.22,h:PH-0.22,rectRadius:0.12,fill:{color:DEEP}});
s.addText("KRISHI-GUARD",{x:PX+0.3,y:PY+0.35,w:2,h:0.24,fontFace:BF,fontSize:10,bold:true,charSpacing:1.4,color:GOLD});
s.addText("Good Morning",{x:PX+0.28,y:PY+0.6,w:2.1,h:0.36,fontFace:HF,fontSize:19,bold:true,color:WHITE});
s.addText("FIELD 01 • TIRUPATI",{x:PX+0.3,y:PY+0.96,w:2,h:0.22,fontFace:BF,fontSize:9,color:WHITE,transparency:45});
s.addShape(p.ShapeType.roundRect,{x:PX+0.28,y:PY+1.28,w:PW-0.56,h:1.2,rectRadius:0.1,fill:{color:WHITE,transparency:90}});
s.addText("SOIL MOISTURE",{x:PX+0.42,y:PY+1.38,w:1.6,h:0.2,fontFace:BF,fontSize:9,color:WHITE,transparency:40});
s.addText("27%",{x:PX+0.42,y:PY+1.6,w:0.9,h:0.36,fontFace:HF,fontSize:20,bold:true,color:WHITE});
s.addShape(p.ShapeType.roundRect,{x:PX+1.3,y:PY+1.72,w:0.62,h:0.26,rectRadius:0.13,fill:{color:GOLD,transparency:75}});
s.addText("LOW",{x:PX+1.3,y:PY+1.72,w:0.62,h:0.26,align:"center",valign:"middle",fontFace:BF,fontSize:8,bold:true,color:GOLD});
s.addShape(p.ShapeType.roundRect,{x:PX+0.42,y:PY+2.12,w:1.72,h:0.1,rectRadius:0.05,fill:{color:WHITE,transparency:85}});
s.addShape(p.ShapeType.roundRect,{x:PX+0.42,y:PY+2.12,w:0.47,h:0.1,rectRadius:0.05,fill:{color:GOLD}});
[["IRRIGATION","Advised",LEAF],["RAIN FORECAST","Low",WHITE],["CROP HEALTH","Normal",LEAF]].forEach((r,i)=>{
  const y=PY+2.62+i*0.44;
  s.addShape(p.ShapeType.roundRect,{x:PX+0.28,y,w:PW-0.56,h:0.36,rectRadius:0.08,fill:{color:WHITE,transparency:93}});
  s.addText(r[0],{x:PX+0.42,y,w:1.3,h:0.36,valign:"middle",fontFace:BF,fontSize:9,color:WHITE,transparency:35});
  s.addText(r[1],{x:PX+1.23,y,w:0.9,h:0.36,align:"right",valign:"middle",fontFace:BF,fontSize:9,bold:true,color:r[2]==LEAF?"7FBF6A":WHITE});
});
s.addShape(p.ShapeType.roundRect,{x:PX+0.28,y:PY+4.1,w:PW-0.56,h:0.5,rectRadius:0.25,fill:{color:GOLD}});
s.addText("ASK IN TELUGU  •  VOICE",{x:PX+0.28,y:PY+4.1,w:PW-0.56,h:0.5,align:"center",valign:"middle",fontFace:BF,fontSize:9,bold:true,charSpacing:0.8,color:CHAR});
s.addImage({...img("farmer-phone.jpg"),x:9.85,y:1.0,w:2.48,h:5.35,sizing:{type:"cover",w:2.48,h:5.35},rounding:false});
footer(s,7);

/* ---------- 8 DIFFERENTIATION ---------- */
s=p.addSlide(); shell(s);
kicker(s,"07 — What Makes It Different?");
title(s,"More than smart farming. Integrated farm intelligence.",false,{w:9.5,fs:32});
const cards5=[["01","IoT","Real-time farm sensing"],["02","EDGE AI","Local intelligent processing"],["03","CROP IMAGING","Visual crop monitoring"],["04","RESOURCE INTELLIGENCE","Irrigation & fertilizer guidance"],["05","FARMER INTELLIGENCE","Simple actionable guidance"]];
cards5.forEach((c,i)=>{
  const x=1.0+i*2.29;
  s.addShape(p.ShapeType.roundRect,{x,y:2.5,w:2.05,h:2.15,rectRadius:0.14,fill:{color:FOREST}});
  s.addText(c[0],{x:x+0.22,y:2.68,w:0.8,h:0.26,fontFace:BF,fontSize:12,bold:true,color:GOLD});
  s.addText(c[1],{x:x+0.22,y:3.55,w:1.65,h:0.5,fontFace:BF,fontSize:13,bold:true,color:WHITE,lineSpacing:16});
  s.addText(c[2],{x:x+0.22,y:4.05,w:1.65,h:0.52,fontFace:BF,fontSize:11,color:WHITE,transparency:38,lineSpacing:14});
});
card(s,{x:1.0,y:5.05,w:11.33,h:1.35});
s.addText("+",{x:1.3,y:5.2,w:0.6,h:0.9,fontFace:HF,fontSize:38,bold:true,color:GOLD,valign:"middle"});
s.addText("Instead of disconnected agricultural tools, KRISHI-GUARD AI brings multiple intelligence layers into one ecosystem.",{x:2.1,y:5.05,w:9.8,h:1.35,valign:"middle",fontFace:BF,fontSize:15,color:CHAR,transparency:22,lineSpacing:22});
footer(s,8);

/* ---------- 9 BUSINESS ---------- */
s=p.addSlide(); shell(s);
kicker(s,"08 — From Prototype to Impact");
title(s,"Users, development path & resources.",false,{fs:32});
// col1
card(s,{x:1.0,y:2.45,w:3.55,h:4.0});
s.addText("Who is it for?",{x:1.32,y:2.72,w:3,h:0.35,fontFace:HF,fontSize:19,bold:true,color:FOREST});
["FARMERS","FARMER PRODUCER ORGANIZATIONS","AGRI-MSMEs","AGRICULTURAL ORGANIZATIONS"].forEach((u,i)=>{
  const y=3.3+i*0.72;
  s.addShape(p.ShapeType.ellipse,{x:1.36,y:y+0.14,w:0.14,h:0.14,fill:{color:LEAF}});
  s.addText(u,{x:1.66,y:y-0.04,w:2.7,h:0.5,valign:"middle",fontFace:BF,fontSize:11,bold:true,color:CHAR,transparency:18,lineSpacing:14});
});
// col2
s.addShape(p.ShapeType.roundRect,{x:4.89,y:2.45,w:3.55,h:4.0,rectRadius:0.14,fill:{color:FOREST}});
s.addText("Prototype → Pilot → Scale",{x:5.19,y:2.72,w:3,h:0.35,fontFace:HF,fontSize:17,bold:true,color:WHITE});
[["PHASE 1","IoT + Farm Monitoring"],["PHASE 2","AI Recommendations"],["PHASE 3","Advanced Crop Intelligence"]].forEach((ph,i)=>{
  const y=3.28+i*0.72;
  s.addShape(p.ShapeType.roundRect,{x:5.19,y,w:2.95,h:0.6,rectRadius:0.1,fill:{color:WHITE,transparency:93},line:{color:WHITE,width:0.75,transparency:85}});
  s.addText(ph[0],{x:5.35,y:y+0.06,w:2.6,h:0.22,fontFace:BF,fontSize:9,bold:true,charSpacing:1,color:GOLD});
  s.addText(ph[1],{x:5.35,y:y+0.28,w:2.6,h:0.26,fontFace:BF,fontSize:11,color:WHITE,transparency:18});
});
s.addShape(p.ShapeType.roundRect,{x:5.19,y:5.48,w:2.95,h:0.8,rectRadius:0.08,fill:{color:WHITE,transparency:92}});
s.addShape(p.ShapeType.rect,{x:5.19,y:5.48,w:0.05,h:0.8,fill:{color:GOLD}});
s.addText("TARGET PROTOTYPE",{x:5.38,y:5.54,w:2.6,h:0.2,fontFace:BF,fontSize:9,color:WHITE,transparency:42});
s.addText("TRL 4 – 5",{x:5.38,y:5.74,w:1.6,h:0.26,fontFace:BF,fontSize:13,bold:true,color:WHITE});
s.addText("To be confirmed against prototype validation",{x:5.38,y:6.0,w:2.6,h:0.22,fontFace:BF,fontSize:8,color:WHITE,transparency:55});
// col3
card(s,{x:8.78,y:2.45,w:3.55,h:4.0});
s.addText("Prototype Requirements",{x:9.08,y:2.72,w:3.1,h:0.35,fontFace:HF,fontSize:17,bold:true,color:FOREST});
["Soil sensors","Weather sensors","Edge device","Camera","Connectivity","Web / mobile application"].forEach((r,i)=>{
  const y=3.28+i*0.34;
  s.addShape(p.ShapeType.ellipse,{x:9.1,y:y+0.1,w:0.11,h:0.11,fill:{color:LEAF}});
  s.addText(r,{x:9.35,y:y-0.02,w:2.8,h:0.3,valign:"middle",fontFace:BF,fontSize:12,color:CHAR,transparency:25});
});
s.addShape(p.ShapeType.roundRect,{x:9.08,y:5.45,w:2.95,h:0.85,rectRadius:0.1,fill:{color:"8A6A3B",transparency:92},line:{color:"8A6A3B",width:0.75,dashType:"dash",transparency:50}});
s.addText("PROTOTYPE COST",{x:9.26,y:5.52,w:2.6,h:0.22,fontFace:BF,fontSize:9,bold:true,charSpacing:1,color:"8A6A3B"});
s.addText("₹ ________",{x:9.26,y:5.74,w:2.6,h:0.3,fontFace:HF,fontSize:16,bold:true,color:FOREST});
s.addText("To be finalised after component costing",{x:9.26,y:6.04,w:2.6,h:0.22,fontFace:BF,fontSize:8,color:CHAR,transparency:55});
footer(s,9);

/* ---------- 10 IMPACT ---------- */
s=p.addSlide();
s.addImage({...img("aerial-field.jpg"),x:0,y:0,w:W,h:H});
s.addShape(p.ShapeType.rect,{x:0,y:0,w:W,h:H,fill:{color:DEEP,transparency:14}});
s.addText("09 — THE IMPACT",{x:1.1,y:1.15,w:6,h:0.3,fontFace:BF,fontSize:12,bold:true,charSpacing:2.2,color:GOLD});
s.addText("From Farm Data\nto Intelligent Decisions.",{x:1.05,y:1.55,w:9.5,h:1.7,fontFace:HF,fontSize:48,bold:true,color:WHITE,lineSpacing:56});
["SMARTER RESOURCE USE","BETTER CROP MONITORING","DATA-DRIVEN DECISIONS","FARMER EMPOWERMENT"].forEach((t,i)=>{
  const x=1.0+i*2.85;
  s.addShape(p.ShapeType.roundRect,{x,y:3.6,w:2.6,h:1.15,rectRadius:0.14,fill:{color:WHITE,transparency:90},line:{color:WHITE,width:0.75,transparency:80}});
  s.addShape(p.ShapeType.ellipse,{x:x+0.28,y:3.82,w:0.3,h:0.3,fill:{color:GOLD}});
  s.addText(t,{x:x+0.28,y:4.2,w:2.1,h:0.45,fontFace:BF,fontSize:12,bold:true,charSpacing:0.8,color:WHITE,lineSpacing:15});
});
s.addText([{text:"KRISHI-GUARD ",options:{color:WHITE}},{text:"AI",options:{color:GOLD}}],{x:1.05,y:5.25,w:6,h:0.45,fontFace:HF,fontSize:24,bold:true});
s.addText("Intelligent Smart Farming & Crop Protection Ecosystem",{x:1.08,y:5.72,w:7,h:0.3,fontFace:BF,fontSize:13,color:WHITE,transparency:28});
s.addText("From Farm Data to Intelligent Decisions.",{x:1.08,y:6.12,w:7,h:0.4,fontFace:HF,fontSize:19,bold:true,color:GOLD});
s.addText("THANK YOU",{x:9.6,y:6.15,w:2.73,h:0.3,align:"right",fontFace:BF,fontSize:12,bold:true,charSpacing:1.5,color:WHITE,transparency:35});

await p.writeFile({fileName:"/tmp/deck/KRISHI-GUARD-AI.pptx"});
console.log("done");
