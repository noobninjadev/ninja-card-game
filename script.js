// -------------------- Card Decks --------------------
const blackCards = [
  "Why can't I sleep at night?",
  "What's that smell?",
  "I got 99 problems but ____ ain't one.",
  "In the new Disney Channel Original Movie, Hannah Montana struggles with ____ for the first time.",
  "When I am Prime Minister, I will create the Ministry of ____.",
  "____: kid-tested, mother-approved.",
  "What's the next big thing in tech?",
  "Sorry, I couldn't finish my homework because of ____",
  "Welcome! Sit back, relax and enjoy ____",
  "I was injured in a ____ accident",
  "My Dad and I enjoy ____ together",
  "Subscribe for more tips on ____",
  "Pay attention. I will now show you the basics of ____",
  "____ is fun and games until someone gets hurt",
  "In the blue corner, weighing 100 pounds wringing wet, it's Gary ____ Green",
  "They call me Captain ____",
  "All I want for Christmas is ____"
];

const whiteCards = [
  "A ninja sneaking through the shadows",
  "Confetti everywhere",
  "Tim Tams for breakfast",
  "An army of kangaroos",
  "Coding until 3am",
  "Vegemite on everything",
  "Your mum’s tier list",
  "Rhea poo",
  "Snot bubbles",
  "Toe jam",
  "Happiness",
  "The Dark Lord",
  "My stupid sisters boyfriend",
  "Vomit",
  "A dead body",
  "Boogers",
  "Licking a goat",
  "Naked Grandma",
  "One weird looking toe",
  "Goblins",
  "Cheeto fingers",
  "Fire farts",
  "Love",
  "China",
  "Santa Claus",
  "Bad parenting",
  "Harry Potter",
  "Picking my nose",
  "Not wearing pants",
  "Idiots",
  "A tank",
  "Chewing desk gum",
  "Boobies!",
  "Snow White",
  "Taking a selfie",
  "For the lolz",
  "Profanity",
  "Sharks with wings",
  "Total world domination",
  "Freddy Krueger",
  "A dentist",
  "A baby with a beard",
  "Big Money Stacks",
  "Illegal drugs",
  "Human sacrifice",
  "Going beast mode",
  "Skibidi",
  "67!",
  "Sigma",
  "Doom scrolling on the toilet",
  "Emotions",
  "Crab walking to get more toilet paper",
  "Singing in the shower",
  "Ninjas",
  "The garbage truck",
  "Nipples",
  "Drinking a bottle of tomato sauce",
  "Personal space",
  "Jousting in party hats",
  "Bacon",
  "Global Warming",
  "My butthole",
  "A fart bad enough to gag a maggot",
  "Strathfield Station"
];

// -------------------- Emoji Eruption --------------------
function emojiEruption() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const emojis = ["😂", "🤣", "😆", "😹", "😁"];

  for (let i = 0; i < 12; i++) {
    const emoji = document.createElement("div");
    emoji.className = "laugh-emoji";
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    emoji.style.left = `${centerX + (Math.random() * 200 - 100)}px`;
    emoji.style.top = `${centerY + (Math.random() * 200 - 100)}px`;

    const offsetX = (Math.random() - 0.5) * 300;
    emoji.style.setProperty("--x", `${offsetX}px`);

    setTimeout(() => {
      document.body.appendChild(emoji);
      setTimeout(() => emoji.remove(), 1200);
    }, i * 100);
  }
}


// -------------------- Theme Toggle --------------------
document.addEventListener("DOMContentLoaded", () => {
  updateScoreboard();

  const toggleBtn = document.getElementById('theme-toggle');

  const setIcon = () => {
    if (document.body.classList.contains('light-mode')) {
      toggleBtn.textContent = '☀️';
    } else if (document.body.classList.contains('ninja-mode')) {
      toggleBtn.textContent = '🥷';
    } else {
      toggleBtn.textContent = '🌙';
    }
  };

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  } else if (savedTheme === 'ninja') {
    document.body.classList.add('ninja-mode');
  } // else defaults to dark mode
  setIcon();

  toggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('light-mode')) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('ninja-mode');
      localStorage.setItem('theme', 'ninja');
    } else if (document.body.classList.contains('ninja-mode')) {
      document.body.classList.remove('ninja-mode');
      localStorage.setItem('theme', 'dark'); // no class needed if dark is default
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }

    setIcon();

    toggleBtn.classList.add('rotate');
    toggleBtn.addEventListener('animationend', () => {
      toggleBtn.classList.remove('rotate');
    }, { once: true });
  });
});

// -------------------- Game State --------------------
let round = 0;
const players = ["Player 1", "Player 2", "Player 3"];
let judgeIndex = 0;
const scores = { "Player 1": 0, "Player 2": 0, "Player 3": 0 };
let submissions = []; // track played cards
let gameOver = false; // flag to mark when a game has ended

// Map players to visual sides in your layout
const playerSideMap = {
  "Player 1": "left",
  "Player 2": "right",
  "Player 3": "right" // judge (if ever needed)
};

function setMascotSide(el, side) {
  if (!el) return;
  el.classList.remove('to-left', 'to-right');
  el.classList.add(side === 'left' ? 'to-left' : 'to-right');
}


// -------------------- Utility --------------------
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Decks
let blackDeck = shuffle([...blackCards]);
let whiteDeck = shuffle([...whiteCards]);

function playShuffleSound() {
  const audio = new Audio("media/shuffle.mp3");
  audio.play();
}

// Call when deck reshuffles
if (blackDeck.length === 0) {
  blackDeck = shuffle([...blackCards]);
  playShuffleSound("media/shuffle.mp3");
}
if (whiteDeck.length < 4) {
  whiteDeck = shuffle([...whiteCards]);
  playShuffleSound("media/shuffle.mp3");
}

// DOM elements
const blackCardArea = document.getElementById("black-card-area");
const drawBtn = document.getElementById("draw-btn");

// 👉 Add star animation utility here
function animateStarToScore(playerId) {
  const scoreEl = document.getElementById(`score-${playerId.toLowerCase()}`);
  if (!scoreEl) return;

  const rect = scoreEl.getBoundingClientRect();

  const star = document.createElement("div");
  star.className = "star";
  star.textContent = "⭐";

  if (playerId.toLowerCase() === "player1") {
    star.classList.add("star-left");
  } else {
    star.classList.add("star-right");
  }

  star.style.left = rect.left + "px";
  star.style.top = rect.top + "px";

  document.body.appendChild(star);

  setTimeout(() => star.remove(), 1000);
}

// -------------------- Round + Judge --------------------
function updateRound() {
  round++;
  document.getElementById("round-counter").textContent = `Round: ${round}`;
}

function nextJudge() {
  judgeIndex = 2; // Player 3 is always the judge
}

// -------------------- Scoring --------------------
function awardPoint(player) {
  scores[player]++;
}

function showWinner(message) {
  const banner = document.getElementById("winner-banner");
  banner.textContent = message;
  banner.classList.add("show");
}

function updateScoreboard() {
  document.getElementById("score-player1").textContent = scores["Player 1"];
  document.getElementById("score-player2").textContent = scores["Player 2"];

  const p1ScoreEl = document.getElementById("score-player1");
  const p2ScoreEl = document.getElementById("score-player2");
  [p1ScoreEl, p2ScoreEl].forEach(el => {
    el.classList.add("updated");
    setTimeout(() => el.classList.remove("updated"), 300);
  });
}

// -------------------- Confetti Burst --------------------
function confettiBurst() {
  const colors = ["#e63946", "#f1faee", "#a8dadc", "#457b9d", "#ffbe0b"];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.left = Math.random() * window.innerWidth + "px";
    piece.style.top = "-20px";
    document.body.appendChild(piece);

    setTimeout(() => piece.remove(), 3000);
  }
}

// -------------------- Game End --------------------
function checkGameEnd(roundWinner, roundLoser) {
  for (const player in scores) {
    if (scores[player] >= 5) {
      const winner = roundWinner;
      const loser = roundLoser && roundLoser !== winner ? roundLoser : null;

      showWinner(`🏆 ${player} wins the game with 5 points!`);
      confettiBurst();
      updateScoreboard();
      endGame(winner, loser);

      function playVictorySound(file) {
      const audio = new Audio("media/victory.mp3");
      audio.play();
      }
      playVictorySound("media/game-victory");
      
      /*function playLolSound(file) {
      const audio = new Audio("media/laughter.mp3");
      audio.play();
      }
      playLolSound("media/game-laughter");*/

      submissions = [];
      gameOver = true; // mark game finished
      return;
    }
  }
}

function endGame(winner, loser) {
  const celebratingEl = document.querySelector('.celebrating-ninja');
  const defeatedEl = document.querySelector('.defeated-ninja');

  // Position by winner/loser side
  const winnerSide = playerSideMap[winner] || 'right';
  const loserSide  = loser ? (playerSideMap[loser] || 'left') : null;

  setMascotSide(celebratingEl, winnerSide);
  if (loserSide) setMascotSide(defeatedEl, loserSide);


  if (celebratingEl) celebratingEl.classList.add('is-active');
  if (defeatedEl && loser) defeatedEl.classList.add('is-active');
}

function drawNewBlackCard() {
  const celebratingEl = document.querySelector('.celebrating-ninja');
  const defeatedEl = document.querySelector('.defeated-ninja');

  if (celebratingEl) celebratingEl.classList.remove('is-active');
  if (defeatedEl) defeatedEl.classList.remove('is-active');
}

// -------------------- Judge Flow --------------------
function enableJudgeSelection() {
  const playedCards = document.querySelectorAll(".white-card.played");
  if (playedCards.length === 0) return;

  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * playedCards.length);
    const chosenCard = playedCards[randomIndex];

    // Find winner by matching card text
    const winnerSubmission = submissions.find(s => s.cardText === chosenCard.textContent);
    const winnerPlayer = winnerSubmission ? winnerSubmission.player : null;

    chosenCard.classList.add("winning-card");

    if (winnerPlayer) {
      awardPoint(winnerPlayer);
      emojiEruption();
      showWinner(`${winnerPlayer} wins this round! 🎉`);
      updateScoreboard();
      animateStarToScore(winnerPlayer.replace(" ", "").toLowerCase());

      function playRoundSound(file) {
      const audio = new Audio("media/round-win.mp3");
      audio.play();
      }
      playRoundSound("media/round-win.mp3");
    }

    // Find loser (any non-winner submission)
    const loserSubmission = submissions.find(s => s.player !== winnerPlayer);
    const loserPlayer = loserSubmission ? loserSubmission.player : null;

    checkGameEnd(winnerPlayer, loserPlayer);

    submissions = [];
    nextJudge();
  }, 2000);
}

// -------------------- Draw Button Logic --------------------
drawBtn.addEventListener("click", () => {
  drawNewBlackCard();

  const banner = document.getElementById("winner-banner");
  banner.textContent = "\u00A0";
  banner.classList.remove("show");

  // Reset scores + round if last game ended
  if (gameOver) {
    for (const p in scores) {
      scores[p] = 0;
    }
    round = 0;
    updateScoreboard();
    document.getElementById("round-counter").textContent = `Round: ${round}`;
    gameOver = false;
  }

  if (blackDeck.length === 0) {
    blackDeck = shuffle([...blackCards]);
    playShuffleSound();
  }
  if (whiteDeck.length < 4) {
    whiteDeck = shuffle([...whiteCards]);
    playShuffleSound();
  }

  updateRound();
  nextJudge();

  const black = blackDeck.pop();
  blackCardArea.innerHTML = `<div class="black-card">${black}</div>`;
  const cardEl = blackCardArea.querySelector(".black-card");
  setTimeout(() => cardEl.classList.add("show"), 50);

  // Clear only hand containers, not headers
  document.querySelector("#player1-area .player-hand-container").innerHTML = "";
  document.querySelector("#player2-area .player-hand-container").innerHTML = "";
  document.getElementById("played-left").innerHTML = "";
  document.getElementById("played-right").innerHTML = "";

  submissions = [];

  for (let i = 0; i < players.length; i++) {
    if (i === judgeIndex) continue;

    const area = document.querySelector(`#player${i+1}-area .player-hand-container`);
    const hand = document.createElement("div");
    hand.className = "player-hand";

    for (let h = 0; h < 3; h++) {
      const white = whiteDeck.pop();
      const card = document.createElement("div");
      card.className = "white-card";
      card.textContent = white;

      card.addEventListener("click", () => {
        if (hand.classList.contains("submitted")) return;

        const played = document.createElement("div");
        played.className = "white-card played";
        played.textContent = white;

        if (players[i] === "Player 1") {
          document.getElementById("played-left").appendChild(played);
        } else {
          document.getElementById("played-right").appendChild(played);
        }

        submissions.push({ player: players[i], cardText: white });
        hand.classList.add("submitted");

        function playFlipSound(file) {
        const audio = new Audio("media/card-flip.mp3");
        audio.play();
        }
        playFlipSound("media/card-flip.mp3");

        if (submissions.length === players.length - 1) {
          enableJudgeSelection();
        }
      });

      hand.appendChild(card);
    }

    area.appendChild(hand);
  }
});

