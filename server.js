// ================= TEAMS =================
const teams = ["CSK","MI","RCB","KKR","SRH","DC","RR","PBKS","GT","LSG"];

// ================= REAL PLAYERS =================
let squad = {
CSK:["Ruturaj Gaikwad","Conway","Rahane","Dube","Dhoni","Jadeja","Moeen","Chahar","Theekshana","Pathirana","Deshpande"],
MI:["Rohit","Ishan","SKY","Tilak","Hardik","Tim David","Shepherd","Chawla","Bumrah","Coetzee","Madhwal"],
RCB:["Kohli","Faf","Patidar","Maxwell","Green","DK","Lomror","Karn","Siraj","Topley","Dayal"],
KKR:["Shreyas","Salt","Venky","Rana","Rinku","Russell","Narine","Ramandeep","Starc","Varun","Harshit"],
SRH:["Head","Abhishek","Markram","Klaasen","Tripathi","Nitish","Shahbaz","Cummins","Bhuvi","Natarajan","Markande"],
DC:["Warner","Shaw","Marsh","Pant","Stubbs","Axar","Lalit","Kuldeep","Nortje","Khaleel","Ishant"],
RR:["Jaiswal","Buttler","Samson","Parag","Hetmyer","Jurel","Ashwin","Boult","Avesh","Chahal","Sandeep"],
PBKS:["Dhawan","Bairstow","Livingstone","Curran","Jitesh","Shashank","Brar","Rabada","Arshdeep","Chahar","Harshal"],
GT:["Gill","Saha","Sudharsan","Miller","Tewatia","Shankar","Rashid","Noor","Shami","Umesh","Spencer"],
LSG:["Rahul","deKock","Stoinis","Pooran","Badoni","Hooda","Krunal","Bishnoi","Wood","Naveen","Mohsin"]
};

// ================= SCHEDULE =================
let schedule=[];
for(let i=0;i<teams.length;i++){
 for(let j=i+1;j<teams.length;j++){
  schedule.push([teams[i],teams[j]]);
 }
}

// ================= TABLE =================
let table={};
teams.forEach(t=>table[t]={pts:0});

// ================= MATCH =================
let matchIndex=0;

let match={
 batting:"",
 bowling:"",
 score:0,
 wickets:0,
 balls:0,
 target:0,
 innings:1,
 striker:0,
 nonStriker:1
};

// ================= START =================
function startMatch(){
 let m=schedule[matchIndex];
 match.batting=m[0];
 match.bowling=m[1];

 reset();
 match.innings=1;
 clearCommentary();

 updateUI();
}

function reset(){
 match.score=0;
 match.wickets=0;
 match.balls=0;
 match.striker=0;
 match.nonStriker=1;
}

// ================= PLAY BALL =================
function playBall(){

 if(match.balls>=120 || match.wickets>=10){
  endInnings();
  return;
 }

 let outcomes=[0,1,2,3,4,6,"W"];
 let res=outcomes[Math.floor(Math.random()*outcomes.length)];

 let strikerName = squad[match.batting][match.striker];

 let overBall = Math.floor(match.balls/6) + "." + (match.balls%6+1);

 let text="";

 if(res==="W"){
  match.wickets++;
  text=`${overBall} ${strikerName} OUT! 😱`;
  match.striker++;
 }
 else{
  match.score+=res;

  if(res===0) text=`${overBall} ${strikerName} dot ball`;
  if(res===4) text=`${overBall} ${strikerName} FOUR! 🔥`;
  if(res===6) text=`${overBall} ${strikerName} SIX! 🚀`;
  if(res===1||res===2||res===3) text=`${overBall} ${strikerName} ${res} run(s)`;

  if(res%2===1){
   [match.striker,match.nonStriker]=[match.nonStriker,match.striker];
  }
 }

 match.balls++;

 if(match.balls%6===0){
  [match.striker,match.nonStriker]=[match.nonStriker,match.striker];
 }

 addCommentary(text);

 if(match.innings===2 && match.score>=match.target){
  endMatch(match.batting);
 }

 updateUI();
}

// ================= END INNINGS =================
function endInnings(){

 if(match.innings===1){

  match.target=match.score+1;

  [match.batting,match.bowling]=[match.bowling,match.batting];

  reset();
  match.innings=2;

 } else {

  if(match.score>=match.target){
   endMatch(match.batting);
  } else {
   endMatch(match.bowling);
  }
 }
}

// ================= END MATCH =================
function endMatch(winner){
 table[winner].pts+=2;

 alert("Winner: "+winner);

 matchIndex++;

 if(matchIndex>=schedule.length){
  alert("League Finished!");
 } else {
  startMatch();
 }
}

// ================= AUTO =================
function autoPlay(){
 let i=setInterval(()=>{
  if(match.balls>=120) clearInterval(i);
  else playBall();
 },120);
}

function simulateInnings(){
 while(match.balls<120){
  playBall();
 }
}

function simulateMatch(){
 simulateInnings();
 simulateInnings();
}

// ================= COMMENTARY =================
function addCommentary(text){
 let div=document.getElementById("commentary");
 div.innerHTML = text + "<br>" + div.innerHTML;
}

function clearCommentary(){
 document.getElementById("commentary").innerHTML="";
}

// ================= UI =================
function updateUI(){

 if(!match.batting) return;

 document.getElementById("match").innerHTML=`
 <h2>${match.batting} vs ${match.bowling}</h2>
 <h1>${match.score}/${match.wickets}</h1>
 <p>Overs: ${(match.balls/6).toFixed(1)}</p>
 <p>Striker: ${squad[match.batting][match.striker] || "-"}</p>
 <p>Non-Striker: ${squad[match.batting][match.nonStriker] || "-"}</p>
 ${match.innings===2?`<p>Target: ${match.target}</p>`:""}
 `;
}

 let html="<h2>Points Table</h2>";
 teams.forEach(t=>{
  html+=`<p>${t} - ${table[t].pts}</p>`;
 });

 document.getElementById("table").innerHTML=html;
}

// ================= INIT =================
startMatch();
