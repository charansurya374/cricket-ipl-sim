const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

// ===== TEAMS (10 IPL TEAMS) =====
const teams = {
  CSK: ["","Conway","Rahane","Dube","Dhoni","Jadeja","Moeen","Chahar","Deshpande","Theekshana","Pathirana"],
  MI: ["","Rohit","Ishan","SKY","Tilak","Hardik","David","Wadhera","Bumrah","Coetzee","Chawla"],
  RCB: ["","Kohli","Faf","Patidar","Maxwell","Green","DK","Lomror","Siraj","Topley","Karn"],
  KKR: ["","Shreyas","Salt","Rinku","Russell","Narine","Nitish","Varun","Starc","Harshit","Ramandeep"],
  SRH: ["","Head","Abhishek","Markram","Klaasen","Phillips","Samad","Cummins","Bhuvi","Natarajan","Markande"],
  RR: ["","Jaiswal","Buttler","Samson","Parag","Hetmyer","Ashwin","Boult","Chahal","Avesh","Sandeep"],
  DC: ["","Warner","Shaw","Marsh","Pant","Stubbs","Axar","Kuldeep","Nortje","Khaleel","Mukesh"],
  GT: ["","Gill","Saha","Sai","Miller","Tewatia","Rashid","Shami","Noor","Mohit","Spencer"],
  PBKS: ["","Dhawan","Bairstow","Livingstone","Jitesh","Shashank","Sam Curran","Rabada","Arshdeep","Rahul Chahar","Harpreet"],
  LSG: ["","KL Rahul","de Kock","Stoinis","Pooran","Krunal","Ayush","Bishnoi","Wood","Yash","Naveen"]
};

// ===== PLAYER =====
let player = {
  name: "",
  team: "",
  runs: 0,
  balls: 0,
  wickets: 0,
  rating: 80
};

// ===== GAME =====
let game = {
  score: 0,
  wickets: 0,
  balls: 0,
  striker: 0,
  nonStriker: 1
};

// ===== SOCKET =====
io.on("connection", (socket) => {

  // START MATCH
  socket.on("start", ({name, team}) => {

    player.name = name || "You";
    player.team = team;

    teams[team][0] = player.name;

    // reset stats
    player.runs = 0;
    player.balls = 0;
    player.wickets = 0;
    player.rating = 80;

    game = {
      score: 0,
      wickets: 0,
      balls: 0,
      striker: 0,
      nonStriker: 1
    };

    io.emit("update", game);
    io.emit("career", player);
  });

  // PLAY BALL
  socket.on("ball", () => {

    if(game.wickets >= 10 || game.balls >= 120){
      io.emit("matchOver", "Match Finished");
      return;
    }

    let outcomes = [0,1,2,3,4,6,"W"];
    let res = outcomes[Math.floor(Math.random()*outcomes.length)];

    let batsman = teams[player.team][game.striker];

    let over = Math.floor(game.balls / 6);
    let ballNo = game.balls % 6 + 1;

    let commentators = ["Harsha Bhogle","Ravi Shastri","Ian Bishop"];
    let comm = commentators[Math.floor(Math.random()*3)];

    let text = "";

    // ===== RESULT LOGIC =====
    if(res === "W"){
      game.wickets++;

      text = `${comm}: ${over}.${ballNo} ${batsman} goes up in the air... TAKEN!`;

      io.emit("highlight", text);
      io.emit("wicket");

      game.striker = (game.striker + 1) % 11;

    } else {

      game.score += res;

      if(batsman === player.name){
        player.runs += res;
        player.balls++;
      }

      // commentary
      if(res === 0){
        text = `${comm}: ${over}.${ballNo} Dot ball.`;

      } else if(res === 1){
        text = `${comm}: ${over}.${ballNo} Quick single.`;

      } else if(res === 2){
        text = `${comm}: ${over}.${ballNo} Good running, 2 runs.`;

      } else if(res === 3){
        text = `${comm}: ${over}.${ballNo} Excellent running, 3 runs!`;

      } else if(res === 4){
        text = `${comm}: ${over}.${ballNo} Cracking shot! FOUR!`;
        io.emit("highlight", text);

      } else if(res === 6){
        text = `${comm}: ${over}.${ballNo} UP IN THE AIR... SIX!!!`;
        io.emit("highlight", text);
        io.emit("six");
      }

      // strike rotation
      if(res % 2 === 1){
        let temp = game.striker;
        game.striker = game.nonStriker;
        game.nonStriker = temp;
      }
    }

    game.balls++;

    // YOU BOWL RANDOMLY
    if(Math.random() < 0.2 && res === "W"){
      player.wickets++;
    }

    // LEVEL SYSTEM
    if(player.runs > 50) player.rating++;
    if(player.wickets > 2) player.rating++;

    // SEND DATA
    io.emit("update", game);
    io.emit("career", player);
    io.emit("commentary", text);

  });

});

// ===== SERVER =====
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running...");
});