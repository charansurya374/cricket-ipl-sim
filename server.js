// ---------------- TEAMS ----------------
const teams = ["MI","CSK","RCB","KKR","SRH","DC","PBKS","RR","GT","LSG"];

// ---------------- POINTS TABLE ----------------
let table = {};
teams.forEach(t => {
  table[t] = {played:0, win:0, loss:0, points:0};
});

// ---------------- MATCH SYSTEM ----------------
let matches = [];
let matchIndex = 0;
let currentMatch = null;

// ---------------- MATCH STATE ----------------
let runs = 0, wickets = 0, balls = 0;
let interval = null;
let running = false;

// ---------------- GENERATE 70 MATCHES ----------------
function generateMatches() {
  matches = [];

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push([teams[i], teams[j]]);
      matches.push([teams[j], teams[i]]);
    }
  }

  // shuffle
  matches.sort(() => Math.random() - 0.5);

  // take only 70 matches
  matches = matches.slice(0, 70);
}

// ---------------- START LEAGUE ----------------
function startLeague() {
  generateMatches();
  matchIndex = 0;
  nextMatch();
}

// ---------------- NEXT MATCH ----------------
function nextMatch() {
  if (matchIndex >= matches.length) {
    addCommentary("League Finished");
    return;
  }

  currentMatch = matches[matchIndex];

  document.getElementById("matchTitle").innerText =
    currentMatch[0] + " vs " + currentMatch[1];

  resetMatch();

  running = true;

  interval = setInterval(playBall, 800);
}

// ---------------- STOP ----------------
function stopMatch() {
  clearInterval(interval);
  running = false;
}

// ---------------- RESET MATCH ----------------
function resetMatch() {
  runs = 0;
  wickets = 0;
  balls = 0;

  document.getElementById("score").innerText = "0/0 (0.0)";
  document.getElementById("commentary").innerHTML = "";
}

// ---------------- PLAY BALL ----------------
function playBall() {

  if (!running) return;

  if (balls >= 30 || wickets >= 10) { // short match demo
    finishMatch();
    return;
  }

  balls++;

  let outcome = getOutcome();

  if (outcome === "W") {
    wickets++;
  } else {
    runs += outcome;
  }

  updateScore();
  addCommentary(generateCommentary(outcome));
}

// ---------------- OUTCOME ----------------
function getOutcome() {
  const outcomes = [0,1,1,2,3,4,6,"W"];
  return outcomes[Math.floor(Math.random() * outcomes.length)];
}

// ---------------- SCORE UPDATE ----------------
function updateScore() {
  let overs = Math.floor(balls / 6) + "." + (balls % 6);

  document.getElementById("score").innerText =
    runs + "/" + wickets + " (" + overs + ")";
}

// ---------------- COMMENTARY ----------------
function addCommentary(text) {
  const div = document.getElementById("commentary");
  div.innerHTML = "<p>" + text + "</p>" + div.innerHTML;
}

// ---------------- COMMENTARY ENGINE ----------------
let commentaryPool = [
  "good length outside off",
  "short ball on middle",
  "full on the pads",
  "slower ball outside off",
  "back of a length",
  "angling into the batter",
  "wide outside off",
  "on a yorker length",
  "bouncer directed at the head",
  "pitched up inviting the drive"
];

function generateCommentary(outcome) {

  let line = commentaryPool[Math.floor(Math.random() * commentaryPool.length)];
  let ballText = formatBall();

  let result = "";

  if (outcome === "W") {
    result = "OUT caught at deep midwicket";
  } 
  else if (outcome === 0) {
    result = "no run";
  } 
  else if (outcome === 4) {
    result = "FOUR";
  } 
  else if (outcome === 6) {
    result = "SIX";
  } 
  else {
    result = outcome + " run";
  }

  return ballText + " " + line + ", " + result;
}

// ---------------- BALL FORMAT ----------------
function formatBall() {
  let over = Math.floor((balls - 1) / 6);
  let ball = ((balls - 1) % 6) + 1;
  return over + "." + ball;
}

// ---------------- FINISH MATCH ----------------
function finishMatch() {

  clearInterval(interval);
  running = false;

  let team1 = currentMatch[0];
  let team2 = currentMatch[1];

  let score1 = runs;
  let score2 = Math.floor(Math.random() * 200);

  let winner;

  if (score1 > score2) {
    winner = team1;
  } else {
    winner = team2;
  }

  updatePoints(team1, team2, winner);

  addCommentary("Match Finished: " + winner + " won");

  matchIndex++;

  setTimeout(nextMatch, 2000);
}

// ---------------- UPDATE POINTS ----------------
function updatePoints(t1, t2, winner) {

  table[t1].played++;
  table[t2].played++;

  if (winner === t1) {
    table[t1].win++;
    table[t1].points += 2;
    table[t2].loss++;
  } else {
    table[t2].win++;
    table[t2].points += 2;
    table[t1].loss++;
  }

  renderTable();
}

// ---------------- RENDER TABLE ----------------
function renderTable() {

  let html = `
  <tr>
    <th>Team</th><th>P</th><th>W</th><th>L</th><th>Pts</th>
  </tr>`;

  let sorted = Object.entries(table)
    .sort((a, b) => b[1].points - a[1].points);

  sorted.forEach(([team, data]) => {
    html += `
    <tr>
      <td>${team}</td>
      <td>${data.played}</td>
      <td>${data.win}</td>
      <td>${data.loss}</td>
      <td>${data.points}</td>
    </tr>`;
  });

  document.getElementById("pointsTable").innerHTML = html;
}
