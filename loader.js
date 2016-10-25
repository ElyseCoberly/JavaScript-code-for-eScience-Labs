function loadScript(src, disableInEditor) {
    var head = document.getElementsByTagName("head")[0], script;
    // if (parent && parent.ESL_EDITMODE && disableInEditor) {
    //     return;
    // }
    if (parent && disableInEditor) {
        return;
    }
    script = document.createElement("script");
    script.type = "text/javascript";
    script.src  = src;
    head.appendChild(script);
}

function loadScript(src, disableInEditor, callback) {
    var head = document.getElementsByTagName("head")[0], script;
    // if (parent && parent.ESL_EDITMODE && disableInEditor) {
    //     return;
    // }
    if (parent && disableInEditor) {
        return;
    }
    script = document.createElement("script");
    script.type = "text/javascript";
    script.src  = src;
    script.onreadystatechange = callback;
    script.onload = callback;
    head.appendChild(script);
}

//PDF Tracking
//Download Event Function
function foo(x, obj, pdf_name) {
	var dom = x.document.getElementById("download");
    console.log("download entered");
    dom.addEventListener("click", function(){
        console.log("download clicked");
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
            event : 'gtm.pdf',
            'gtm.element': obj,
            'gtm.elementTarget': '_blank',
            pdfCategory: 'PDF Experiments',
            pdfAction: 'Download',
            'name - pdf' : pdf_name
            // pdfValue: 'PDf Download Time: ' + new Date().toUTCString()
        });
    });
}
    
function openWin(obj){
    var url = obj.getAttribute("href");
    var pdf_viewer = "https://www.esciencelabs.com/sites/default/files/PDF_JS/web/viewer.html"
    var reg = /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/;
    var pathname = reg.exec(url)[1];
    var new_pdf_url = pdf_viewer + "?file=" + pathname;
    var win = window.open(new_pdf_url, '_blank');
    win.focus();
    var startTime = new Date().getTime();
    var endTime;
    var elapsedTime;
    var pdf_name = pathname.split('/').pop();

    //I have to wait 2 sec for rendering the new window, otherwise it will return nothing.
    setTimeout(
        function(){
            dataLayer.push({
                event : 'gtm.pdf.open',
                'gtm.element': obj,
                'gtm.elementTarget': '_blank',
                pdfCategory: 'PDF Experiments',
                pdfAction: 'Open',
                'windows_object': win,
                'name - pdf' : pdf_name
            });
        foo(win, obj, pdf_name);
    }, 2000);
    
    //Close Event Listener
    var closeCheck = setInterval(function () {
        try {
            (win == null || win.closed) && (clearInterval(closeCheck), onWindowClosed()); 
        } catch (ex) { }
    }, 500);
    
    var onWindowClosed = function() {
        endTime = new Date().getTime();
        elapsedTime = (endTime - startTime)/1000;
        
        dataLayer.push({
            event : 'gtm.pdf',
            'gtm.element': obj,
            'gtm.elementTarget': '_blank',
            pdfCategory: 'PDF Experiments',
            pdfAction: 'Close',
            pdfTime: elapsedTime,
            'name - pdf' : pdf_name
        });
    }
}

function loadMathjaxConfig() {
    // if (parent && parent.ESL_EDITMODE) {
    //     return;
    // }
    var head = document.getElementsByTagName("head")[0], script;
    script = document.createElement("script");
    script.type = "text/x-mathjax-config";
    script[(window.opera ? "innerHTML" : "text")]
     = 'MathJax.Hub.Config({ TeX: {extensions: ["cancel.js", "mhchem.js"]}, '
     + 'CommonHTML: {linebreaks: { automatic: true }}, '
     + '"HTML-CSS": {linebreaks: { automatic: true }}, '
     + 'SVG: {linebreaks: { automatic: true }} });';
    head.appendChild(script);
}

function CA_Track(e){
    var elements;
    var i;
    var text;
    window.dataLayer = window.dataLayer || [];

    elements = e.find(".cp-frameset");
    
    console.log(safari);

    for (i = 0; i < elements.length; i++) {

        //select the text content for Safari and other types broswers
        if(safari)
            text = elements[i].getAttribute("aria-label");
        else
            text = elements[i].textContent;

        if (text.indexOf('Learning Objectives') != -1){
            CA_Start_Time = new Date().getTime();
        }

        // console.log(text.indexOf('Button'));
        if (text.indexOf('Button') != -1){
            if (text.indexOf('next') != -1){
                if (count_CA == 0) {
                    elements[i].addEventListener("click", function(){
                        console.log("start");
                        dataLayer.push({
                            'event': 'Animation_CA_Start',
                            'CA_Category': 'Concept Animation',
                            'CA_Action': "Start Concept Animation",
                            'CA_Status': 'Active'
                        });
                        count_CA++;
                        setTimeout(function(){
                            CA_Track(e);
                        }, 2000);
                    });
                } else {
                    elements[i].addEventListener("click", function(){
                        console.log("next");
                        dataLayer.push({
                            'event': 'Animation_CA',
                            'CA_Category': 'Concept Animation',
                            'CA_Action': "Next Button Clicked",
                            'CA_Status': 'Active'
                        });

                        setTimeout(function(){
                            CA_Track(e);
                        }, 2000);
                    });
                }
            } else {
                elements[i].addEventListener("click", function(){
                    console.log("Previous");
                    dataLayer.push({
                        'event': 'Animation_CA',
                        'CA_Category': 'Concept Animation',
                        'CA_Action': "Previous Button Clicked",
                        'CA_Status': 'Active'
                    }); 

                    setTimeout(function(){
                        CA_Track(e);
                    }, 2000);
                });
            }

        } else if (text.indexOf('Audio') != -1) {
            elements[i].addEventListener("click", function(){
                 console.log("Audio");
                dataLayer.push({
                    'event': 'Animation_CA',
                    'CA_Category': 'Concept Animation',
                    'CA_Action': "Audio Button Clicked",
                    'CA_Status': 'Active'
                });
            });
        } else if (text.indexOf('Please continue') != -1) {
                console.log("complete");
                dataLayer.push({
                    'event': 'Animation_CA_Complete',
                    'CA_Category': 'Concept Animation',
                    'CA_Action': "Complete Concept Animation",
                    'CA_Status': 'Active',
                    'CA_Total_Time': (new Date().getTime() - CA_Start_Time)/1000,
                });
        }
    }
}

var helper = function(e){
    
    window.dataLayer = window.dataLayer || [];
    // dataLayer.push({
    //     'event': 'Animation_LD',
    //     'LD_Category': 'Lab Drill',
    //     'LD_Action': "Next Page",
    // });

    // console.log("next page");
    setTimeout(function(){
        flag_drag = 0;
        // console.log("reload1");
        LD_Track(e);
        question_start_time = new Date().getTime();
    }, 3000);
}

function LD_Track(e){
    // console.log("reload2");
    window.dataLayer = window.dataLayer || [];

    elements = e.find(".cp-frameset");

    for (var i = 0; i < elements.length; i++) {
        if (elements[i].id.indexOf("SmartShape") != -1) {
            flag_drag = 1;
            break;   
        }
    }

    console.log("flag_drag:", flag_drag);
    
    for (var i = 0; i < elements.length; i++) {
        // console.log(safari);
        if(safari) {
            text = elements[i].getAttribute("aria-label");
            if(text == null)
                text = "null";
        }
        else
            text = elements[i].textContent;

        // console.log(elements[i]);
        // console.log(elements[i].getAttribute("aria-label"));

        if (text.indexOf('Button') != -1){
            elements[i].addEventListener("click", function(){
                console.log("Start LabDrill");
                LD_Start_Time = new Date().getTime();
                question_start_time = LD_Start_Time;
                dataLayer.push({
                    'event': 'Animation_LD_Start',
                    'LD_Category': 'Lab Drill',
                    'LD_Action': "Start Lab Drill",
                });
                // Set trials number as 0
                trials_on_question = 0;

                setTimeout(function(){
                    LD_Track(e);
                }, 1000);
            });
        } else if (text.indexOf('Results') != -1) {
            console.log("Complete LabDrill");
            dataLayer.push({
                'event': 'Animation_LD_Complete',
                'LD_Category': 'Lab Drill',
                'LD_Action': "Complete Lab Drill",
                'LD_Total_Time': (new Date().getTime() - LD_Start_Time)/1000,
            });
        } else if (flag_drag == 0){
            if(text.indexOf("Submit") != -1) {
                elements[i].addEventListener("click", function cd(){         
                    this.removeEventListener("click", cd);
                    // console.log("Submit");
                    LD_Track(e);
                });
            } else if (text.indexOf('Question') != -1) {
                // If question_number is null, assign the value
                if (text.match(/\d/))
                    question_number = text.match(/\d/)[0];

            } else if (text.indexOf('Correct') != -1){
                if (elements[i].style.visibility == "visible"){
                    console.log("Correct: Question", question_number);
                    dataLayer.push({
                        'event': 'Animation_LD',
                        'LD_Category': 'Lab Drill',
                        'LD_Action': "Question" + question_number + " Answered",
                        'LD_Trials': trials_on_question + 1,
                        'LD_Time': (new Date().getTime() - question_start_time)/1000,
                    });

                    // console.log("Question ", question_number);
                    // console.log("Trial Numbers on Question: ", trials_on_question + 1);
                    // console.log("Time on Question: ", new Date().getTime() - question_start_time);
                    
                    trials_on_question = 0;

                    e.find('#main_container')[0].addEventListener("click", function abc(){
                        e.find('#main_container')[0].removeEventListener("click", abc);
                        helper(e);
                    });
                }
            } else if (text.indexOf('Incorrect') != -1){
                if (elements[i].style.visibility == "visible") {
                    console.log("Incorrect");
                    // dataLayer.push({
                    //     'event': 'Animation_LD',
                    //     'LD_Category': 'Lab Drill',
                    //     'LD_Action': "Incorrect Answer",
                    // });
                    trials_on_question = trials_on_question + 1;
                }
            }
        } else if (flag_drag == 1) {
            console.log(elements[i].id.indexOf("si"));
            if(elements[i].id.indexOf("si") != -1) {
                elements[i].addEventListener("click", function cd(){         
                    this.removeEventListener("click", cd);
                    // console.log("Submit2");
                    
                    setTimeout(function(){LD_Track(e);} , 1000);
                });
            } else if (text.indexOf('Correct') != -1){

                if (elements[i].style.visibility == "visible"){
                    console.log("Correct: Question", question_number);
                    dataLayer.push({
                        'event': 'Animation_LD',
                        'LD_Category': 'Lab Drill',
                        'LD_Action': "Question" + question_number + " Answered",
                        'LD_Trials': trials_on_question + 1,
                        'LD_Time': new Date().getTime() - question_start_time,
                    });
                    
                    trials_on_question = 0;

                    setTimeout(function(){helper(e);}, 3000);
                }
            } else if (text.indexOf('Incorrect') != -1){

                    if (elements[i].style.visibility == "visible") {
                        console.log("Incorrect");
                        // console.log("Incorrect");
                        // dataLayer.push({
                        //     'event': 'Animation_LD',
                        //     'LD_Category': 'Lab Drill',
                        //     'LD_Action': "Incorrect Answer",
                        // });
                        trials_on_question = trials_on_question + 1;
                    }

            } else if (text.indexOf('Q') != -1) {
                // If question_number is null, assign the value
                    // console.log("question_number:", text);
                    question_number = text.match(/\d/)[0];
            } 
        } 
    }
}

// Flash Tracking
var iframe_CA;
var iframe_LD;
var CA_Start_Time;
var LD_Start_Time;

// Lab Drill Variables
var elements;
var text;
var trials_on_question;
var time_on_question;
var question_number;
var question_start_time;
var flag_drag = 0;
var safari;
var count_CA = 0;//Tell the start of Concept Animation

console.log(navigator.appVersion);
console.log(navigator.userAgent);

if(navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1){
    safari = true;
} else {
    safari = false;
}

var iframe_sets = document.querySelectorAll('iframe');

for ( var j = 0; j < iframe_sets.length; j++ ) {
    if (iframe_sets[j].getAttribute('src').indexOf("Forensics_CA") != -1)
        iframe_CA = iframe_sets[j];
    else if(iframe_sets[j].getAttribute('src').indexOf("Forensics_LD") != -1)
        iframe_LD = iframe_sets[j];
}

// Concept Animation Tracking
if(iframe_CA){
    iframe_CA.addEventListener("load", function (e) {
        setTimeout(function(){
            CA_Track($(iframe_CA).contents());
        }, 5000);
    });
}

// Lab Drill Tracking
if(iframe_LD){
    iframe_LD.addEventListener("load", function (e) {
        setTimeout(function(){
            LD_Track($(iframe_LD).contents());
        }, 5000);
    });
}

loadScript('Esci.js', false);
loadMathjaxConfig();
loadScript('https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML', false);
loadScript('https://esciencelabs.com/sites/default/files/jStickyNote/jquery-ui-1.10.4.custom.min.js', false);
loadScript('https://esciencelabs.com/sites/default/files/jStickyNote/jquery.stickynote.js', false);
loadScript('https://esciencelabs.com/sites/default/files/jStickyNote/jquery.ui.touch-punch.min.js', false);