// ================= TEAMS =================
let teams = {

Mumbai: ["Rohit","Ishan","Surya","Tilak","Hardik","Tim David","Shepherd","Chawla","Bumrah","Coetzee","Madhwal"],
Chennai: ["Ruturaj","Conway","Rahane","Dube","Dhoni","Jadeja","Moeen","Chahar","Theekshana","Pathirana","Deshpande"],
Bangalore: ["Faf","Kohli","Patidar","Maxwell","Green","DK","Lomror","Siraj","Topley","Karn","Dayal"],
Kolkata: ["Shreyas","Salt","Venky","Rana","Rinku","Russell","Narine","Starc","Varun","Harshit","Suyash"],
Delhi: ["Warner","Shaw","Marsh","Pant","Stubbs","Axar","Lalit","Kuldeep","Nortje","Khaleel","Ishant"],
Hyderabad: ["Head","Abhishek","Markram","Klaasen","Tripathi","Nitish","Shahbaz","Cummins","Bhuvi","Natarajan","Markande"],
Rajasthan: ["Jaiswal","Buttler","Samson","Parag","Hetmyer","Jurel","Ashwin","Boult","Chahal","Avesh","Sandeep"],
Punjab: ["Dhawan","Bairstow","Livingstone","Curran","Jitesh","Shashank","Brar","Rabada","Arshdeep","Chahar","Harshal"],
Lucknow: ["Rahul","deKock","Stoinis","Pooran","Badoni","Hooda","Krunal","Bishnoi","Wood","Naveen","Mohsin"],
Gujarat: ["Gill","Saha","Sudharsan","Miller","Tewatia","Shankar","Rashid","Shami","Noor","Umesh","Spencer"]

};

// ================= SCHEDULE =================
let teamNames = Object.keys(teams);
let schedule = [];

for (let i = 0; i < teamNames.length; i++) {
  for (let j = i + 1; j < teamNames.length; j++) {
    schedule.push({
      home: teamNames[i],
      away: teamNames[j],
      played: false,
      result: ""
    });
  }
}

// ================= POINTS =================
let points = {};
teamNames.forEach(t => {
  points[t] = { pts: 0, played: 0, won: 0, lost: 0 };
});

// ================= MATCH STATE =================
let matchIndex = 0;

let currentTeam = "";
let opponent = "";

let score = 0;
let wickets = 0;
let balls = 0;
let innings = 1;
let target = 0;

let striker = 0;
let nonStriker = 1;

// ================= START MATCH =================
function startMatch() {

  let m = schedule[matchIndex];

  currentTeam = m.home;
  opponent = m.away;

  resetInnings();
  innings = 1;

  document.getElementById("matchTitle").innerText = currentTeam + " vs " + opponent;
  document.getElementById("commentary").innerHTML = "";

  updateUI();
  showPage('match');
}

// ================= RESET =================
function resetInnings() {
  score = 0;
  wickets = 0;
  balls = 0;
  striker = 0;
  nonStriker = 1;
}

// ================= PLAY BALL =================
function playBall() {

  if (balls >= 120 || wickets >= 10) {
    endInnings();
    return;
  }

  let outcomes = [0,1,2,3,4,6,"W"];
  let res = outcomes[Math.floor(Math.random() * outcomes.length)];

  let player = teams[currentTeam][striker];

  let over = Math.floor(balls / 6) + "." + (balls % 6 + 1);

  let text = "";

  if (res === "W") {
    wickets++;
    text = `${over} ${player} OUT!`;
    striker++;
  } else {
    score += res;

    if (res === 0) text = `${over} ${player} dot ball`;
    if (res === 4) text = `${over} ${player} FOUR! 🔥`;
    if (res === 6) text = `${over} ${player} SIX! 🚀`;
    if (res === 1 || res === 2 || res === 3) text = `${over} ${player} ${res} run(s)`;

    if (res % 2 === 1) {
      [striker, nonStriker] = [nonStriker, striker];
    }
  }

  balls++;

  if (balls % 6 === 0) {
    [striker, nonStriker] = [nonStriker, striker];
  }

  addComment(text);

  if (innings === 2 && score >= target) {
    endMatch(currentTeam);
    return;
  }

  updateUI();
}

// ================= END INNINGS =================
function endInnings() {

  if (innings === 1) {

    target = score + 1;

    [currentTeam, opponent] = [opponent, currentTeam];

    resetInnings();
    innings = 2;

    addComment("Innings Break");

  } else {

    let winner = (score >= target) ? currentTeam : opponent;
    endMatch(winner);
  }

  updateUI();
}

// ================= END MATCH =================
function endMatch(winner) {

  let m = schedule[matchIndex];
  let loser = (winner === m.home) ? m.away : m.home;

  points[winner].pts += 2;
  points[winner].won++;
  points[winner].played++;

  points[loser].lost++;
  points[loser].played++;

  m.played = true;
  m.result = winner + " won";

  addComment("🏆 " + winner + " wins!");

  updatePointsTable();
  loadSchedule();

  setTimeout(() => {
    matchIndex++;
    if (matchIndex < schedule.length) {
      startMatch();
    } else {
      alert("League Finished!");
    }
  }, 2000);
}

// ================= COMMENTARY =================
function addComment(text) {
  let div = document.getElementById("commentary");
  div.innerHTML = text + "<br>" + div.innerHTML;
}

// ================= AUTO =================
function autoPlay() {
  let i = setInterval(() => {
    if (balls >= 120 || wickets >= 10) clearInterval(i);
    else playBall();
  }, 120);
}

function simInnings() {
  while (balls < 120 && wickets < 10) {
    playBall();
  }
}

function simMatch() {
  simInnings();
  simInnings();
}

// ================= UI =================
function updateUI() {

  document.getElementById("score").innerText =
    `${score}/${wickets} (${(balls/6).toFixed(1)})`;

  document.getElementById("players").innerText =
    `Striker: ${teams[currentTeam][striker] || "-"} | Non-Striker: ${teams[currentTeam][nonStriker] || "-"}`;

  document.getElementById("nextMatch").innerText =
    schedule[matchIndex]?.home + " vs " + schedule[matchIndex]?.away;
}

// ================= SCHEDULE UI =================
function loadSchedule() {

  let html = "<tr><th>#</th><th>Match</th><th>Status</th></tr>";

  schedule.forEach((m, i) => {
    html += `
      <tr>
        <td>${i+1}</td>
        <td>${m.home} vs ${m.away}</td>
        <td>${m.played ? m.result : "Upcoming"}</td>
      </tr>
    `;
  });

  document.getElementById("scheduleTable").innerHTML = html;
}

// ================= POINTS TABLE =================
function updatePointsTable() {

  let html = "<tr><th>Team</th><th>P</th><th>W</th><th>L</th><th>Pts</th></tr>";

  Object.keys(points).forEach(t => {
    let p = points[t];
    html += `<tr>
      <td>${t}</td>
      <td>${p.played}</td>
      <td>${p.won}</td>
      <td>${p.lost}</td>
      <td>${p.pts}</td>
    </tr>`;
  });

  document.getElementById("pointsTable").innerHTML = html;
}

// ================= PAGE NAV =================
function showPage(p) {
  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
  document.getElementById(p).classList.add('active');
}

// ================= INIT =================
loadSchedule();
updatePointsTable();
updateUI();
