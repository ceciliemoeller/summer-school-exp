
// Don't do this (i.e. create a function) if you need to implement it into PsychTestR:
// function new_timeline() {...


var timeline = [];

var test_stimuli_array = stimuliExpRandomizer.randomizeStimuli('exp');
var soundcheck_nb = test_stimuli_array[0]
var test_stimuli = test_stimuli_array[1]
var spont_stimuli = stimuliExpRandomizer.randomizeStimuli('spont');
console.log(soundcheck_nb)



var calibrate = {
  type: "audio-button-response",
  stimulus: soundcheck_nb,
  prompt: 
  "<h4><strong>Quick sound check</strong></h4>" +
  "<p class='gap-above'>Please adjust the volume of your device to a comfortable level where you can clearly hear the sounds. Then click 'Continue!' above.</p>"+
  "<p class='gap-above'>..........</p>"+
  "<p class='font15'>If the experiment fails to load, or you cannot hear the sounds despite having turned up the volume, close the window and open it in a different browser, e.g., Chrome, Firefox or Edge.</p>",
  choices: ["<p class='font15'><strong>Play sound again</strong></p>", "<p class='font15'><strong>Volume is comfortable now.</strong></p>"+
  "<p class='font20'><strong> Continue!</strong></p>"],
  margin_vertical: '2px'
 };

loop_calibrate ={
  timeline:[calibrate],
  loop_function: function(data){
    if(data.values()[0].button_pressed== 0){
        return true;
    } else {
        return false;
    }
}
};



timeline.push(loop_calibrate);


/* assess spontaneous motor tempo (SMT) */
var smt_instr = {
  type: "html-button-response",
  stimulus: "<h4><strong>Your spontaneous tempo</strong></h4>" +
  "<p>To warm up, we would like to start by asking you to tap (press/click) at a steady rate that feels comfortable for you. Please tap with the index finger (on screen or mouse) of your dominant hand.</p>" +
     "<p>Please start tapping when you hear a bell, and continue to do so until you hear a whistle.</p>",

  choices: ["Click here to Start"]
};

timeline.push(smt_instr);

var smt = {
  type: 'audio-bpm-button-response',
  stimulus: 'sounds/spont_tap_10s.mp3',
  prompt: "<p class='largegap-above'>Please tap at a steady rate that feels comfortable for you.</p>",
  choices: ["<p class='font'> <strong>Tap here!</strong></p>"]

};

timeline.push(smt);

/* define instructions trial */
var instructions_I = {
  type: "html-button-response",
  stimulus: 
    // "<p><strong>Nice! You are ready to continue.</strong></p>" +
    "<p><strong>Great! It is time to start the experiment.</strong></p>" +
    "<p>Here is what will happen:</p>" +
    "<p> You will hear some musical rhythms.</p>" +
    "<p>Your task is to simply tap along to the underlying beat of the rhythms, " +
    "as you do for instance, when you are clapping your hands with the audience at a concert.</p>"+
    "<p> To make sure we are on the same page, here are some  <strong>examples of what we mean when we say 'the beat':</strong></p>" +
      "<p> The beat is like a clock’s tick.</p>" +
      "<p>The beat is the steady pulse you feel when listening to music.</p>" +
      "<p>The beat is what you would naturally clap along to, or tap your foot to.</p>" +
      "<p class = 'gap-above'> Please, do not try to imitate the rhythms. " +
    "Your task is to simply tap along to the steady underlying beat.</p>",
   choices: ["I got it! Continue"]
  };
timeline.push(instructions_I);


var instructions_II = {
  type: "html-button-response",
  stimulus: 
    "<p>Note, that you should not tap from the very beginning. " +  
    "When the sound starts, just listen to the musical rhythm. </p> " +
    "<p>Start tapping when you hear the bell sound, and " +
    "please continue tapping until the sound stops.</p>" +
    "<p>..........</p>"+
    "<p>You will be asked to tap to 6 different rhythms.</p>" +
    "<p>Are you ready? Good luck!</p>",
  choices: ["Start the experiment"],
  post_trial_gap: 1000
};
timeline.push(instructions_II);

// Define trials

// var mask = {
//   type: "audio-bpm-button-response",
//   stimulus: jsPsych.timelineVariable('stimulus'),
//   prompt: "<p class='font15'>Use your touch screen, clickpad/button or mouse</p>",
//   choices: ["<p class='font15'> <strong>WAIT until you hear the bell. Then...</strong></p>"+
//   "<p class='font'> <strong>Tap here!</strong></p>"]
//  }

var spont = {
  type: "audio-bpm-button-response",
  stimulus: jsPsych.timelineVariable('stimulus'),
  prompt: "<p class='font15'>Use your touch screen, clickpad/button or mouse</p>",
  choices: ["<p class='font15'> <strong>WAIT until you hear the bell. Then...</strong></p>"+
  "<p class='font'> <strong>Tap here!</strong></p>"]
 }

var test = {
  type: "audio-bpm-button-response",
  stimulus: jsPsych.timelineVariable('stimulus'),
  prompt: "<p class='font15'>Use your touch screen, clickpad/button or mouse</p>",
  // choices: ["<p class='font15'> <strong>When you hear the bell...</strong></p>"+
  choices: ["<p class='font15'> <strong>WAIT until you hear the bell. Then...</strong></p>"+
  "<p class='font'> <strong>Tap here!</strong></p>"]
 }

var rating = {
  type: "html-slider-response",
  stimulus: "<p>In this example, how difficult was it for you to tap to the beat?</p>", 
  labels: ['very easy', 'very difficult'],
  require_movement: true,
  slider_width: 210
};


var spont_procedure = {
  timeline: [spont, rating],
  timeline_variables: spont_stimuli,
  randomize_order: true,
  repetitions: 1
}

timeline.push(spont_procedure);

var test_procedure = {
  // timeline: [mask, test, rating],
  timeline: [test, rating],
  timeline_variables: test_stimuli,
  randomize_order: true,
  repetitions: 1
}

timeline.push(test_procedure);