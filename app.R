
# # ####################################################
# # # This script is an example of a psychTestR implementation of
# # # an online polyrhythm study
# # # Date:16/05- 2021
# # # Author: Cecilie Møller
# # # Project: Neuromusic VII - Aarhus Summer School in Music Neuroscience, 2021
# # ###################################################

#install.packages("devtools")
#devtools::install_github("pmcharrison/psychTestR")

library(htmltools)
library(psychTestR)
library(tibble)


# # For jsPsych
jspsych_dir <- "jspsych-6.1.0"

head <- tags$head(
  # jsPsych files
  
  
  # # If you want to use original jspsych.js, use this:
  # includeScript(file.path(jspsych_dir, "jspsych.js")),
  
  # If you want to display text while preloading files (to save time), specify your intro_text
  # in jsPsych.init (in run-jspsych.js) and call jspsych_preloadprogressbar.js here:
  includeScript(file.path(jspsych_dir, "jspsych_preloadprogressbar.js")),
  
  includeScript(
    file.path(jspsych_dir, "plugins/jspsych-html-button-response.js")
  ),
  
  includeScript(
    file.path(jspsych_dir, "plugins/jspsych-audio-button-response.js")
  ),
  
  includeScript(
    file.path(jspsych_dir, "plugins/jspsych-html-slider-response.js")
  ),
  
  # Custom files
  includeScript(
    file.path(
      jspsych_dir,
      "plugins/jspsych_BPM/jspsych-audio-bpm-button-response.js"
    )
  ),
  includeCSS(file.path(jspsych_dir, "css/jspsych.css")),
  includeCSS("css/style.css")
)

ui_exp <- tags$div(
  head,
  includeScript("exp-rand.js"),
  includeScript("new-timeline.js"),
  includeScript("run-jspsych.js"),
  tags$div(id = "js_psych")
)


poly_ratio <- page(
  ui = ui_exp,
  label = "poly_ratio",
  get_answer = function(input, ...)
    input$jspsych_results,
  validate = function(answer, ...)
    nchar(answer) > 0L,
  save_answer = TRUE
)

# PsychTestR elements


intro <- c(
welcome <-
  one_button_page(div(
    HTML("<img src='img/au_logo.png'></img> <img src='img/mib_logo.png'></img>"),
    div(
      h3(strong("Welcome!")),
      p("Thank you for participating in this online experiment which is part of the"),
      p(strong("Aarhus Summer School in Music Neuroscience, June 14-17, 2021!")),
      p("In the experiment you will hear some musical rhythms, and your task is to simply tap along to the beat of the rhythms, using the designated button. Afterwards, we will ask you about your age, gender, and musical background."),
      p("Recommendations: take the test in quiet surroundings, use headphones, and do not use the browser 'Safari'."),
      p("You can expect this to take 7-10 minutes."),
      p("Please note: You have to be at least 18 years old to participate."),
      HTML("<br>"),
      p("The data you generate is completely anonymous and will be used for teaching purposes and shared with students. It may also be shared with other researchers in a publicly available research data repository, provided you allow us to do so when you are done with the experiment. Please note that your participation is completely voluntary and you can leave the experiment at any time by simply closing the browser window. If you have questions, you can always contact us at cecilie@clin.au.dk"),
      )
  ),
  button_text = "I understand. Continue!"
       
    ),


# PAGES
device <-dropdown_page(
  label = "device",
  prompt = div(h4(strong("Device")),
               p("First, we need to know which device you are using to take the test?"),
               p("If possible, use a device with a touchscreen, alternatively a clickpad or mouse, rather than a laptop touchpad."),
               p(strong ("You can not use a keyboard.")),
               p("Please make sure you stick with your chosen input method throughout the test."),
               ),
  save_answer=TRUE,
  choices = c("Select current device", "Smartphone (touchscreen)","Tablet (touchscreen)","Laptop (click button/clickpad)", "Laptop (external mouse)", "Desktop (external mouse)"),
  alternative_choice = TRUE,
  alternative_text = "Other - please state which?",
  next_button_text = "Next",
  max_width_pixels = 250,
  validate = function(answer, ...) {
    if (answer=="Select current device")
      "Which device are you using to take the test? Click the small arrow on the right of the first box to see the options. We ask because it matters for the analyses of the data you provide."
    else if (answer=="") 
      "Please tell us which device you are currently using. If you select 'Other' at the bottom of the list, please state in the designated field which type of device you use to take the test."
    else TRUE
  },
  on_complete = function(answer, state, ...) {
    set_global(key = "device", value = answer, state = state)
  }     
)
)

sound_check<-one_button_page(
  
  body = div(h4(strong("Quick sound check")),
             
             p("When you click the button below, you will hear some random sounds that you can use to adjust the volume of your device to a comfortable level."),
             # p("If the experiment fails to load, or you cannot hear the sounds despite having turned up the volume, close the window and open it in a different browser, e.g., Chrome, Firefox or Edge.")
  ),
  button_text = "Play sounds"
)


# DEMOGRAPHICS

age <-dropdown_page(
  label = "age",
  prompt = div(h4(strong("Thanks! We would love to know more about you...")),
               p("You are done with the tapping part and we would like to ask just a few general questions about yourself before you leave us."),
               p(strong ("What is your age?")),
               ),
  save_answer=TRUE,
  choices = c("Please select","18-19 years","20-21","22-23","24-25","26-27","28-29","30-31","32-33","34-35","36-37","38-39","40-41","42-43","44-45","46-47","48-49","50-51","52-53","54-55","56-57","58-59","60-61","62-63","64-65","66-67","68-69","70-71","72-73","74-75","76-77","78-79","80 years or above"),
  next_button_text = "Next",
  max_width_pixels = 250,
  validate = function(answer, ...) {
    if (answer=="Please select")
      "Please state your age (click the small arrow on the right of the box to see the options). We ask because it matters for the analyses of the data you provide."
    #else if (answer=="") 
   #   "Please answer the question. If you select 'Other' at the bottom of the list, please state the name of your browser in the designated field."
    else TRUE
  },
  on_complete = function(answer, state, ...) {
    set_global(key = "age", value = answer, state = state)
  }  
)

gender<-NAFC_page(
  label = "gender",
  prompt = p(strong ("Whats is your gender?")), 
  choices = c("Female", "Male","Other","I prefer not to tell you"),
)


# MUSICAL EXPERIENCE

music_exp <- c(


# ollen
ollen<-NAFC_page(
  label = "ollen",
  prompt = p(strong ("Which title best describes you?")), 
  choices = c("Nonmusician", "Music-loving nonmusician","Amateur musician","Serious amateur musician","Semiprofessional musician","Professional musician"),
  on_complete = function(answer, state, ...) {
    set_global(key = "ollen", value = answer, state = state)
    if (answer == "Nonmusician"|answer =="Music-loving nonmusician") skip_n_pages(state,3)
  }
  ),

#gold-msi item 06 from Gold-MSI musical training subscale

MT_06<-NAFC_page(
  label = "MT_06",
  prompt = p(strong ("I can play the following number of musical instruments:")),
  choices = c("0", "1","2","3","4","5","6 or more"),
),

# gold-msi instrument item
instrument <-dropdown_page(
  label = "instrument",
  prompt = p(strong ("The instrument I play best (including voice) is...")), 
  save_answer=TRUE,
  choices = c("Please select","I don't play any instrument", "alto", "basoon", "cello", "clarinet", "double bass", "drums", "flute", "guitar", "harp", "horn", 
              "oboe", "piano", "saxophone", "trumpet", "tuba", "trombone",  "voice", "violin", "xylophone",  "I prefer not to tell you"),
  alternative_choice = TRUE,
  alternative_text = "Other (please state which)",
  next_button_text = "Next",
  max_width_pixels = 250,
  validate = function(answer, ...) {
    if (answer=="Please select")
      "Please select the instrument you play best from the dropdown menu."
    else if (answer=="") 
      "If your instrument is not on the list, please select 'Other' at the bottom of the list and write the name of the instrument you play best in the designated field."
    else TRUE
  },
  on_complete = function(answer, state, ...) {
    set_global(key = "instrument", value = answer, state = state)
  }
),

# custom made question on instrument experience

years_instrument <- dropdown_page(
  label = "years_instr",
  prompt = p(strong("For how many years have you played a musical instrument (including voice)?")),
  save_answer=TRUE,
  choices = c("Please select", "I don't play any instrument", "Less than one year", "1",	"2",	"3",	"4",	"5",	"6",	"7",	"8",	"9",	"10",	"11",	"12",	"13",	"14",	"15",	"16",	"17",
              "18",	"19",	"20",	"21",	"22",	"23",	"24",	"25",	"26",	"27",	"28",	"29",	"30",	"31",	"32",	"33","34",	"35",	"36",	"37",	"38",	"39",	"40",	"41",	"42",
              "43",	"44",	"45",	"46",	"47",	"48",	"49",	"50",	"51",	"52",	"53",	"54",	"55",	"56",	"57",	"58",	"59",	"60",	"61",	"62",	"63",	"64","65",	"66",	"67",
              "68",	"69",	"70",	"71",	"72",	"73",	"74",	"75",	"76",	"77",	"78",	"79",	"80 years or more", "I prefer not to tell you"),

  next_button_text = "Next",
  max_width_pixels = 250,
  validate = function(answer, ...) {
    if (answer=="Please select")
      "Please provide your best estimate of the number of years you have played a musical instrument (click the small arrow on the right of the box to see the options). We ask because it matters for the analyses of the data you provide."
    else TRUE
  },
  on_complete = function(answer, state, ...) {
    set_global(key = "age", value = answer, state = state)
  }  
) 
)

# COMMENTS

duplets <- dropdown_page(
  label = "duplets",
  prompt = p(strong("Have you taken this exact same test before? (It's fine if you have)")),
  save_answer=TRUE,
  choices = c("Please select", "No", "Yes, once before", "Yes, twice before",	"Yes, three times before",	"Yes, four times before",	"Yes, five times before",	"Yes, six or more times before"),
  # alternative_choice = TRUE,
  # alternative_text = "I prefer not to tell you",
  next_button_text = "Next",
  max_width_pixels = 250,
  validate = function(answer, ...) {
    if (answer=="Please select")
      "Please let us know if you tried this exact same test before. We ask because it matters for the analyses of the data you provide. If you like, you can provide additional comments in the next and final question."
    else TRUE
  },
  on_complete = function(answer, state, ...) {
    set_global(key = "age", value = answer, state = state)
  }  
)

comments <- text_input_page(
  label = "comments",
  one_line = FALSE,
  width = "400px",
  prompt = div(
    HTML("<br>"),
    p(strong("Optional: Is there anything else you would like to tell us?")),
    HTML("<br>"),
      p("Here, you can provide comments about your experience of participating in this experiment, if you think it may be useful for the researchers to know."),
    p("Please do not write any personal information such as full name, email address, phone number etc."),
    p("You are also welcome to contact us by email on cecilie@clin.au.dk")
  ),
  save_answer = T,
  button_text = "Next"
)
consent<-NAFC_page(
  label="consent",
  prompt=div(
      HTML("<img src='img/au_logo.png'></img> <img src='img/mib_logo.png'></img>"),
               div(
            h3(strong("Thanks very much!")),
            p("We hope you enjoyed taking part in this demonstration of a scientific experiment investigating beat perception in music."),
            p("The data you provided is very valuable to us. We will use it for teaching purposes and possibly also for development of new experiments, in which case we may want to share your anonymous data with other researchers in a publicly available research data repository."),

            HTML("<br>"),
            p("Are you happy with that?")
             )
            ),
choices = c("YES, you can use my data as described","NO, please use my data only for teaching purposes"),
on_complete = function(answer, state, ...) {
  set_global(key = "consent", value = answer, state = state)
}
)


done<-final_page(div(
  HTML("<img src='img/au_logo.png'></img> <img src='img/mib_logo.png'></img>"),
  div(
    h3(strong("Thanks very much!")),
    p("You can close the browser window now.")
  )
))
elts <- join(
   intro,
   elt_save_results_to_disk(complete = FALSE),
   sound_check,
   poly_ratio,
   elt_save_results_to_disk(complete = FALSE), # anything that is saved here counts as completed
   age,
   gender,
   elt_save_results_to_disk(complete = FALSE),
   # demographics,
   elt_save_results_to_disk(complete = FALSE),
   music_exp,
   elt_save_results_to_disk(complete = FALSE),
   duplets,
   elt_save_results_to_disk(complete = FALSE),
   comments,
   consent,
   elt_save_results_to_disk(complete = TRUE),
   done
)


 make_test(
     elts = elts,
     opt = test_options(title="Aarhus Summer School in Music Neuroscience, 2021",
                        admin_password="", # write a secret password here
                        enable_admin_panel=TRUE,
                        researcher_email="cecilie@clin.au.dk",
                        problems_info="Problems? Contact cecilie@clin.au.dk",
                        display = display_options(
                         full_screen = TRUE,
                         css = c(file.path(jspsych_dir, "css/jspsych.css"),"css/style.css")
         )))

# shiny::runApp(".")


