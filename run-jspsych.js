

// ratio test trials
 var audio = stimuliExpRandomizer.randomizeStimuli('preload');


function run_jspsych() {
  jsPsych.init({
    timeline: timeline,
    display_element: 'js_psych',
    preload_audio: audio,
    use_webaudio: true,
    intro_text: "<h4><strong>Quick sound check</strong></h4>" +
    "<p class='gap-above'>(One moment, please. The experiment is loading. This may take a while on slow connections.)</p>"+
    // "<p class='largegap-above'></p>"+
    // "<p class='largegap-above'>Please adjust the volume of your device to a comfortable level where you can clearly hear the sounds.</p>"+
    "<p class='gap-above'>..........</p>"+
    "<p class='font15'>If the experiment fails to load, close the window and open it in a different browser, e.g., Chrome, Firefox or Edge.</p>",
    on_finish: function() {
      var json_data = jsPsych.data.get().json();
      Shiny.onInputChange("jspsych_results", json_data);
      next_page();
    }
  });
}
run_jspsych();

