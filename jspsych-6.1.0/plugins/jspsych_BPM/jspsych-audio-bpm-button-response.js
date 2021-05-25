/**
 * jspsych-audio-bpm-button-response
 * Kristin Diep
 * Cecilie Møller
 * Benjamin Christensen
 *
 * Plugin for playing an audio file and getting multiple keyboard responses within the same trial.
 * Useful for collecting measures of beats per minute (BPM).
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["audio-bpm-button-response"] = (function () {
    var plugin = {};

    jsPsych.pluginAPI.registerPreload('audio-bpm-button-response', 'stimulus', 'audio');

    plugin.info = {
        name: 'audio-bpm-button-response',
        description: '',
        parameters: {
            stimulus: {
                type: jsPsych.plugins.parameterType.AUDIO,
                pretty_name: 'Stimulus',
                default: undefined,
                description: 'The audio to be played.'
            },
            choices: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Choices',
                default: undefined,
                array: true,
                description: 'The button labels.'
            },
            button_html: {
                type: jsPsych.plugins.parameterType.HTML_STRING,
                pretty_name: 'Button HTML',
                default: '<button class="jspsych-btn">%choice%</button>',
                array: true,
                description: 'Custom button. Can make your own style.'
            },
            prompt: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Prompt',
                default: null,
                description: 'Any content here will be displayed below the stimulus.'
            },
            trial_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Trial duration',
                default: null,
                description: 'The maximum duration to wait for a response.'
            },
            margin_vertical: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Margin vertical',
                default: '0px',
                description: 'Vertical margin of button.'
            },
            margin_horizontal: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'Margin horizontal',
                default: '8px',
                description: 'Horizontal margin of button.'
            },
            response_ends_trial: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Response ends trial',
                default: false,
                description: 'If true, the trial will end when user makes a response.'
            },
            trial_ends_after_audio: {
                type: jsPsych.plugins.parameterType.BOOL,
                pretty_name: 'Trial ends after audio',
                default: true,
                description: 'If true, then the trial will end as soon as the audio file finishes playing.'
            },
        }
    }

    plugin.trial = function (display_element, trial) {

        // setup stimulus
        var context = jsPsych.pluginAPI.audioContext();
        if (context !== null) {
            var source = context.createBufferSource();
            source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
            source.connect(context.destination);
        } else {
            var audio = jsPsych.pluginAPI.getAudioBuffer(trial.stimulus);
            audio.currentTime = 0;
        }


        // this array holds handlers from setTimeout calls
        // that need to be cleared if the trial ends early
        var setTimeoutHandlers = [];

        // set up end event if trial needs it
        if (trial.trial_ends_after_audio) {
            if (context !== null) {
                source.onended = function () {
                    end_trial();
                }
            } else {
                audio.addEventListener('ended', end_trial);
            }
        }

        //display buttons
        var buttons = [];
        if (Array.isArray(trial.button_html)) {
            if (trial.button_html.length == trial.choices.length) {
                buttons = trial.button_html;
            } else {
                console.error('Error in image-button-response plugin. The length of the button_html array does not equal the length of the choices array');
            }
        } else {
            for (var i = 0; i < trial.choices.length; i++) {
                buttons.push(trial.button_html);
            }
        }

        var html = '<div id="jspsych-audio-bpm-button-response-btngroup">';
        for (var i = 0; i < trial.choices.length; i++) {
            var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
            html += '<div class="jspsych-audio-bpm-button-response-button" style="cursor: pointer; display: inline-block; margin:' + trial.margin_vertical + ' ' + trial.margin_horizontal + '" id="jspsych-audio-bpm-button-response-button-' + i + '" data-choice="' + i + '">' + str + '</div>';
        }
        html += '</div>';

        //show prompt if there is one
        if (trial.prompt !== null) {
            html += trial.prompt;
        }

        display_element.innerHTML = html;

        for (var i = 0; i < trial.choices.length; i++) {
            display_element.querySelector('#jspsych-audio-bpm-button-response-button-' + i).addEventListener('mousedown', function (e) {
                var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
                // jQuery('body #jspsych-audio-bpm-button-response-button-' + i + ' .jspsych-btn').css('background-color', 'purple');
                console.dir( $(e.target).parent() );
                // jQuery('body').css('background-color', 'purple');
                jQuery('body .jspsych-audio-bpm-button-response-button' + ' .jspsych-btn').css('background-color', 'gold');
                // jQuery('body .jspsych-audio-bpm-button-response-button' + ' .jspsych-btn p').css('color', 'purple');
                window.setTimeout(function() {
                    // jQuery('body .jspsych-audio-bpm-button-response-button' + ' .jspsych-btn p').css('color', 'black');
                    jQuery('body .jspsych-audio-bpm-button-response-button' + ' .jspsych-btn').css('background-color', 'silver');
                  }, 30);
                after_response(choice);
            });
            // $( "body #jspsych-audio-bpm-button-response-button-" + i ).on( "mousedown", function() {
            //     console.log( 'hej on handler virker og i er !' +i );
            //     jQuery('body body .jspsych-audio-bpm-button-response-button' + ' .jspsych-btn').css('background-color', 'purple');
            //     jQuery('body .jspsych-audio-bpm-button-response-button' + ' .jspsych-btn p').css('color', 'purple');
            //     window.setTimeout(function() {
            //         jQuery('body .jspsych-audio-bpm-button-response-button' + ' .jspsych-btn p').css('color', 'black');
            //       }, 50);
            // });
        }

        // store multiple responses
        var response = [];

        // function to handle multiple responses by the subject
        function after_response(choice) {

            // measure rt
            var end_time = performance.now();
            var rt = end_time - start_time;
            var response_i = {
                rt: -1,
                button: -1
            }

            response_i.button = choice;
            response_i.rt = rt;

            response.push(response_i);

        };

        // function to end trial when it is time
        function end_trial() {

            // stop the audio file if it is playing
            // remove end event listeners if they exist
            if (context !== null) {
                source.stop();
                source.onended = function () { }
            } else {
                audio.pause();
                audio.removeEventListener('ended', end_trial);
            }

            // kill any remaining setTimeout handlers
            for (var i = 0; i < setTimeoutHandlers.length; i++) {
                clearTimeout(setTimeoutHandlers[i]);
            }


            var rt_end_trial = "";
            var button_pressed = "";

            if (response.length > 0) {
                rt_end_trial += response[0].rt.toString();
                button_pressed += response[0].button.toString();

                for (var i = 1; i < response.length; i++) {
                    rt_end_trial += "," + response[i].rt.toString();
                    button_pressed += "," + response[i].button.toString();
                }
            }

            // gather the data to store for the trial
            var trial_data = {
                "rt": rt_end_trial,
                "stimulus": trial.stimulus,
                "button_pressed": button_pressed
            };


            // clear the display
            display_element.innerHTML = '';

            // move on to the next trial
            jsPsych.finishTrial(trial_data);
        };

        // start time
        var start_time = performance.now();

        // start audio
        if (context !== null) {
            startTime = context.currentTime;
            source.start(startTime);
        } else {
            audio.play();
        }

        // end trial if time limit is set
        if (trial.trial_duration !== null) {
            jsPsych.pluginAPI.setTimeout(function () {
                end_trial();
            }, trial.trial_duration);
        }

    };

    return plugin;
})();
