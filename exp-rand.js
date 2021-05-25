// var stimuliExpRandomizer = {},
//     stimuliExpRandomizerRandomNb = Math.floor(Math.random() * 10);

// if (stimuliExpRandomizerRandomNb < 3){
//     stimuliExpRandomizerRandomNb = 0;
// }
// else if (stimuliExpRandomizerRandomNb < 6){
//     stimuliExpRandomizerRandomNb = 1;
// }
// else {
//     stimuliExpRandomizerRandomNb = 2;
// }


var stimuliExpRandomizer = {},
    stimuliExpRandomizerRandomNb = Math.floor(Math.random() * 100);

if (stimuliExpRandomizerRandomNb < 27){
    stimuliExpRandomizerRandomNb = 0;
}
else if (stimuliExpRandomizerRandomNb < 60){
    stimuliExpRandomizerRandomNb = 1;
}
else {
    stimuliExpRandomizerRandomNb = 2;
}

// Aug 3rd 2020 (2 weeks before end of data collection) the numbers above were changed (on server only) 
// to < 18 and < 36 in order to maintain the intended proportions, as apparently more 
// participants dropped out of the ratio (actual proportion = 37.4 %, intended = 40%) 
// than pitch (27.4% vs 27%) and tempo (35.1% vs 33%) experiments. 

// Numbers above were too radical, so Aug 4th 2020 numbers were changed (on server only again) to <50 and <95 leaving 
// only 5% responses to the ratio exp.




// ###########################
/**
 * This function takes a type parameter, deciding
 * if we are asking for preload or exp data.
 * 
 * When requesting preload data, we take a random
 * array of stimulis. This result is stored so that
 * we can return the same array when asking for exp data.
 */
stimuliExpRandomizer.randomizeStimuli = function(type) {
    var randomNb = stimuliExpRandomizerRandomNb,
        sound_check_stim = [
            "sounds/tempo/poly_tempo_loudness_check.mp3",
            "sounds/tempo/poly_tempo_loudness_check.mp3",
            "sounds/tempo/poly_tempo_loudness_check.mp3"
        ],
        dataArray = [
            [                                        
                "sounds/2_3_90_135_three.mp3",
                "sounds/2_3_90_135_two.mp3",
                "sounds/2_3_135_203_three.mp3",
                "sounds/2_3_135_203_two.mp3"
                
            ],
            [
                "sounds/2_3_90_135_three.mp3",
                "sounds/2_3_90_135_two.mp3",
                "sounds/2_3_135_203_three.mp3",
                "sounds/2_3_135_203_two.mp3"
            ],
            [
                "sounds/2_3_90_135_three.mp3",
                "sounds/2_3_90_135_two.mp3",
                "sounds/2_3_135_203_three.mp3",
                "sounds/2_3_135_203_two.mp3"                
            ],

        ],
        spontArray = [
            "sounds/2_3_90_135_spont.mp3",  
            "sounds/2_3_135_203_spont.mp3"];

        // maskArray = [
        //     "sounds/r21_5_6_125ms.mp3",  
        //     "sounds/r21_5_6_167ms.mp3"];


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
            return [sound_check_stim[randomNb],stimuliExpRandomizer.createExpArray(dataArray[randomNb])]
            break;
        case 'spont':
            return stimuliExpRandomizer.createExpArray(spontArray)
        // case 'mask':
        //     return stimuliExpRandomizer.createExpArray(maskArray)    
        default:
            break;
    }
}

stimuliExpRandomizer.createExpArray = function(myArray) {
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