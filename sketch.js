// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/pXAdLGb_M/';

// Variable to store Classifier object
let classifier;

// Variables to set up webcam capture
let video;
let flippedVideo;

// Variables to store the classification
let label = "";
let result = ""; // Label + confidence

// Variable to set backgrounds
let bkgrnd;
let bkgrndAlt;

// Variables relevant to the game flow
  // Status
    let playerWon;
    let gameTied;
  // Player and rival choice
    let playerChoice;
    let rivalChoice;
  // Enemy animations
    let rival;
    let rivalWon;
    let rivalLost;
    let rivalAlt;
    let rivalWonAlt;
    let rivalLostAlt;
    let altSkins;
  // Counters
    let wins;
    let ties;
    let losses;

function preload() {
  
  // Loading rival skins and background
  rival = loadImage("media/Walt.png");
  rivalWon = loadImage("media/WaltWon.png");
  rivalLost = loadImage("media/WaltLost.png");
  bkgrnd = loadImage("media/bg1.jpg");
  rivalAlt = loadImage("media/Saul.png");
  rivalWonAlt = loadImage("media/SaulWon.png");
  rivalLostAlt = loadImage("media/SaulLost.png");
  bkgrndAlt = loadImage("media/bg2.jpg");
  
  // Loading the model
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  
}

function setup() {
  createCanvas(500, 250).parent('forCanvas');
  
  // Initialize game variables
  playerWon = false;
  gameTied = false;
  
  // Create the video
  video = createCapture(VIDEO);
  video.size(300, 230);
  video.hide();
  
  flippedVideo = ml5.flipImage(video)
  
  // Get lay button from DOM and set its function
  button.onclick = function(){ playRPS(); };
  
  // Start classifying
  classifyVideo();
  
  // Initialize stats
  wins = 0;
  ties = 0;
  losses = 0;

  altSkins = false;
  
}

function draw() {
  
  background(bkgrnd,200);
  
  if(label == "Ninguno")
    button.disabled = true;
  else
    button.disabled = false;
  
  // Draw the video
  image(flippedVideo, 0, 0);

  // Draw the label
  fill(255);
  textSize(16);
  text(result, 90, height - 4);  
  
  textSize(60);
  text(toEmoji(label), 120, 125);

  // Inform outcome and draw rival
  if(!playerChoice || gameTied){
    image(rival, 290, 20, 240, 300);
    
    if(gameTied)
      text("🚫", 250, 200);
        
  } else if(playerWon){
    image(rivalLost, 240, 60, 300, 240);
    text("🏆", 115, 200);
  } else{ //player lost
    image(rivalWon, 350, 10, 260, 325);
    text("🏆", 350, 200);
  }
  
  // Rival's choice
  if(rivalChoice){
    text(toEmoji(rivalChoice), 380, 125);
    fill(255);
    textSize(16);
    text(toEnglish(rivalChoice), 360, height - 4);
  }
  
  // Display stats and last choice
  textSize(10);
  text("Wins: " + wins +
       " | Ties: " + ties +
       " | Losses: " + losses, 310, 15);
  
  if(playerChoice)
    text("Last: " + toEmoji(playerChoice), 310, 28);
  
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  
  // If there is an error, reports it to console
  if (error) {
    console.error(error);
    return;
  }

  // To display both tag and confidence (as %) of the
  // result of highest confidence (first of array)
  label = results[0].label;
  result = toEnglish(label) + " (" +
          results[0].confidence.toFixed(2) * 100 + 
          "%)";
  
  // Classifiy again
  classifyVideo();
}

function playRPS(){
  
  // Take the player's choice as it was recognized by
  // the machine learning model
  playerChoice = label;
  
  // Generate a random choice for the CPU rival
  // It generates decimal numbers, including minimum and
  // excluding maximum
  
  let randomNumber = random(0,3);
  
  
  // Assing a label to the numbers to compare them
  if(randomNumber < 1)
    rivalChoice = 'Piedra';
  else if(randomNumber < 2)
    rivalChoice = 'Papel';
  else
    rivalChoice = 'Tijeras';
  
  // Check for tie
  if(playerChoice == rivalChoice){
    
    gameTied = true;
    ties++;
    playerWon = false;
    return;
    
  }else
    gameTied = false;
  
  // Check if player won
  if(playerChoice == 'Tijeras'){
    
    if(rivalChoice == 'Papel')
      playerWon = true;
    else
      playerWon = false;
    
  } else if(playerChoice == 'Papel'){
    
    if(rivalChoice == 'Piedra')
      playerWon = true;
    else
      playerWon = false;
    
  } else{ // player chose rock
    
    if(rivalChoice == 'Tijeras')
      playerWon = true;
    else
      playerWon = false;
    
  }
  
  if(playerWon)
    wins++;
  else if(!playerWon)
    losses++;
  
}

function toEmoji(label){
  
  let emoji;
  
  if(label){
    
    if(label == 'Papel')
      emoji = "✋";
    else if (label == 'Piedra')
      emoji = "✊";
    else if(label == 'Tijeras')
      emoji = "✌";
    else
      emoji = "🤷‍♀️";
  }
  
  return emoji;
}

function toEnglish(label){
  
  let enLbl;
  
  if(label){
    
    if(label == 'Papel')
      enLbl = "Paper";
    else if (label == 'Piedra')
      enLbl = "Rock";
    else if(label == 'Tijeras')
      enLbl = "Scissors";
    else
      enLbl = "None";
  }
  
  return enLbl;
}

function swapSkins(){

  if(altSkins){
    setSkins();
    altSkins = false;
  }
  else {
    setAltSkins();
    altSkins = true;
  }

  let rivalTemp = rival;
  let rivalWonTemp = rivalWon;
  let rivalLostTemp = rivalLost;
  let bkgrndTemp = bkgrnd;
  rival = rivalAlt;
  rivalWon = rivalWonAlt;
  rivalLost = rivalLostAlt;
  bkgrnd = bkgrndAlt;
  rivalAlt = rivalTemp;
  rivalWonAlt = rivalWonTemp;
  rivalLostAlt = rivalLostTemp;
  bkgrndAlt = bkgrndTemp;

}

function setSkins(){

  body.className = "bb";
  title.className = "bb";
  button.className = "bb";
  skinToggler.className = "btn bcs";
  
}

function setAltSkins(){
  
  body.className = "bcs";
  title.className = "bcs";
  button.className = "bcs";
  skinToggler.className = "btn bb";

}



