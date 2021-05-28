// This randomizer is for use when participants must be randomly allocated
// to one of three separate experiments. Here, we only present one experiment
// but the quickest fix that ensures proper preload was to just enter the same stims three times
// ... sorry ;)

var stimuliExpRandomizer = {},
    stimuliExpRandomizerRandomNb = Math.floor(Math.random() * 100);

if (stimuliExpRandomizerRandomNb < 27) {
    stimuliExpRandomizerRandomNb = 0;
}
else if (stimuliExpRandomizerRandomNb < 60) {
    stimuliExpRandomizerRandomNb = 1;
}
else {
    stimuliExpRandomizerRandomNb = 2;
}

// ###########################
/**
 * This function takes a type parameter, deciding
 * if we are asking for preload or exp data.
 * 
 * When requesting preload data, we take a random
 * array of stimulis. This result is stored so that
 * we can return the same array when asking for exp data.
 */
stimuliExpRandomizer.randomizeStimuli = function (type) {
    var randomNb = stimuliExpRandomizerRandomNb,
        sound_check_stim = [
            "sounds/tempo/poly_tempo_loudness_check.mp3",
            "sounds/tempo/poly_tempo_loudness_check.mp3",
            "sounds/tempo/poly_tempo_loudness_check.mp3"
        ],
        dataArray = [
            [
                "sounds/2_3_90_135_three_short.mp3",
                "sounds/2_3_90_135_two_short.mp3",
                "sounds/2_3_135_203_three_short.mp3",
                "sounds/2_3_135_203_two_short.mp3",
                "sounds/2_3_90_135_three_long.mp3",
                "sounds/2_3_90_135_two_long.mp3",
                "sounds/2_3_135_203_three_long.mp3",
                "sounds/2_3_135_203_two_long.mp3"

            ],
            [
                "sounds/2_3_90_135_three_short.mp3",
                "sounds/2_3_90_135_two_short.mp3",
                "sounds/2_3_135_203_three_short.mp3",
                "sounds/2_3_135_203_two_short.mp3",
                "sounds/2_3_90_135_three_long.mp3",
                "sounds/2_3_90_135_two_long.mp3",
                "sounds/2_3_135_203_three_long.mp3",
                "sounds/2_3_135_203_two_long.mp3"
            ],
            [
                "sounds/2_3_90_135_three_short.mp3",
                "sounds/2_3_90_135_two_short.mp3",
                "sounds/2_3_135_203_three_short.mp3",
                "sounds/2_3_135_203_two_short.mp3",
                "sounds/2_3_90_135_three_long.mp3",
                "sounds/2_3_90_135_two_long.mp3",
                "sounds/2_3_135_203_three_long.mp3",
                "sounds/2_3_135_203_two_long.mp3"
            ],

        ],
        spontArray = [
            "sounds/2_3_90_135_spont.mp3",
            "sounds/2_3_135_203_spont.mp3"];


    switch (type) {
        case 'preload':
            myNewArray = [];
            spontArray.forEach(element => {
                dataArray[randomNb].push(element)
            });
            console.log('number is ' + randomNb)
            return dataArray[randomNb]
            break;
        case 'exp':
            console.log('number is ' + randomNb)
            return [sound_check_stim[randomNb], stimuliExpRandomizer.createExpArray(dataArray[randomNb])]
            break;
        case 'spont':
            return stimuliExpRandomizer.createExpArray(spontArray)

        default:
            break;
    }
}

stimuliExpRandomizer.createExpArray = function (myArray) {
    var myObj = {},
        myNewArray = [];
    myArray.forEach(element => {
        myObj = { 'stimulus': element };
        myNewArray.push(myObj)
    });
    console.log("createExpArray")
    console.dir(myNewArray)
    return myNewArray;
}