
pr_model = {
    name: 'polynomialRegression',
    degree: 5,
    powers: [0, 1, 2, 3, 4, 5],
    coefficients: [3.497281355201183, -0.0000023354152668160373, 7.596761765447426e-13, -1.182369483889262e-19, 8.264321812779654e-27, -2.0772595276523983e-34]
};

knn_model = {
    name: 'multivariateLinearRegression',
    weights: [[0.000003625546914785349, 5.527790997150253e-8, -0.000003680824824756846],[-0.000005068307907932101, 0.00000550161529434862, -4.333073864164942e-7],[-0.000001681320026561626, -0.00000493232864002429, 0.0000066136486665859535],[4.0994182084334625, 2.83741087682215, 3.0631709147443593]],
    inputs: 3,
    outputs: 3,
    intercept: true
};


////////////////////////////////////////////////////
var players;

$( document ).ready(function() {
    players = new Tone.Players(["./assets/bassoon4.wav", "./assets/altoflutearp.wav", "./assets/clarinets2.wav", "./assets/mutedbrass1.wav", "./assets/piccarp.wav"], function(){
        for (var key in players._players){
            players._players[key].loop = true
            players._players[key].volume.value = 10
            players._players[key].sync().start(0)
        }
        Tone.Transport.start()
    }).toMaster()   
});

////////////////////////////////////////////////////

var capture;
var previousPixels;
var total = 0;
var mysegments = [];
var val;

//training data
var k = 0;
var train = 0
var run = false

var curr_x;
var curr_y;
var intensity;
var boxes = ["rone","rtwo","rthree", "rfour", "rfive"];
var task = ["left1","left2", "middle", "right1", "right2", "none", "intense", "mild", "smoothly", "base", "noisy", "nothing"]

var pr_x = [];
var pr_y = [];
var knn_x = [];
var knn_y = [];
var options = {
  C: 0.01,
  tol: 10e-4,
  maxPasses: 10,
  maxIterations: 10000,
  kernel: 'rbf',
  kernelOptions: {
    sigma: 0.5
  }
};

var indx;
var knn;
var pr;
var degree = 5;

function setup() {
    capture = createCapture(VIDEO);
    var mycanvas = createCanvas(640, 480);
    mycanvas.parent('mycanvas') 
    capture.size(640, 480);
    capture.hide();
    frameRate(15);
}

function draw() {
    capture.loadPixels();
    total = 0;

    if (capture.pixels.length > 0) { // don't forget this!
        if (!previousPixels) {
            previousPixels = copyImage(capture.pixels, previousPixels);
        } else {
            var w = capture.width,
                h = capture.height;
            var i = 0;
            var pixels = capture.pixels;
            var horizon = Array(w).fill(255)
            var thresholdAmount = select('#thresholdAmount').value() * 255. / 100.;
            thresholdAmount *= 3; // 3 for r, g, b
            for (var y = 0; y < h; y++) {
                for (var x = 0; x < w; x++) {
                    // calculate the differences
                    var rdiff = Math.abs(pixels[i + 0] - previousPixels[i + 0]);
                    var gdiff = Math.abs(pixels[i + 1] - previousPixels[i + 1]);
                    var bdiff = Math.abs(pixels[i + 2] - previousPixels[i + 2]);
                    // copy the current pixels to previousPixels
                    previousPixels[i + 0] = pixels[i + 0];
                    previousPixels[i + 1] = pixels[i + 1];
                    previousPixels[i + 2] = pixels[i + 2];
                    var diffs = rdiff + gdiff + bdiff;
                    var output = 255;
                    if (diffs > thresholdAmount) {
                        output = 0
                        horizon[x]-=10
                        total += diffs
                    }
                    if (y > h-40){
                        pixels[i++] = horizon[x];
                        pixels[i++] = horizon[x];
                        pixels[i++] = horizon[x];
                        i++;
                    }else{
                        pixels[i++] = output;
                        pixels[i++] = output;
                        pixels[i++] = output;
                        i++;
                    }
                }
            }
            var prev = 0
            var segment_sum = 0
            mysegments = []
            for (var i = 0; i < horizon.length; i++){
                segment_sum += horizon[i]
                if (i%64 == 0){
                    mysegments.push(segment_sum-prev)
                    prev = segment_sum
                }
            }
        }
    }
    // need this because sometimes the frames are repeated
    if (total > 0) {
        select('#motion').elt.innerText = total;
        capture.updatePixels();
        image(capture, 0, 0, 640, 480);
    }


    switch(train){
        case 0:
            break;
        case 1:
            knn_x.push(mysegments);
            knn_y.push(0)
            break;
        case 2:
            knn_x.push(mysegments);
            knn_y.push(1)
            break;
        case 3:
            knn_x.push(mysegments);
            knn_y.push(2)
            break;
        case 4:
            knn_x.push(mysegments);
            knn_y.push(3)
            break;
        case 5:
            knn_x.push(mysegments);
            knn_y.push(4)
            break;
        case 6:
            knn_x.push(mysegments);
            knn_y.push(5)
            break;
        case 7:
            pr_x.push(total); 
            pr_y.push(4);
            break;
        case 8:
            pr_x.push(total); 
            pr_y.push(3); 
            break;
        case 9:
            pr_x.push(total); 
            pr_y.push(2); 
            break;
        case 10:
            pr_x.push(total); 
            pr_y.push(1); 
            break;
        case 11:
            pr_x.push(total); 
            pr_y.push(0);
            break;
        default:
            break;
    }

    if (run){
        curr_x = knn.predict([mysegments])
        curr_i = pr.predict([total])/2
        indx = 0
        for (var pl in players._players){
            if (curr_x == indx){
                val = players._players[pl].volume.value + Math.log((players._players[pl].volume.value+40)*y_thresh(curr_i))
            }
            else{
                val = players._players[pl].volume.value - Math.log10(players._players[pl].volume.value+11)
            }
            
            players._players[pl].volume.value = val_thresh(val)
            $('#'+boxes[indx]).attr('y', 175 - 5*players._players[pl].volume.value)
            $("#dir").html(String(curr_x))
            $("#inte").html(String(curr_i))
            indx ++;
        }     
    } 
}

function start_train(){
    train++
    select('#trainer').elt.innerText = "Collect - " + task[train%12]
}

function do_train(){
    train = 0;
    console.log("Model training")
    pr = new ML.Regression.PolynomialRegression(pr_x, pr_y, degree); knn = new ML.SL.KNN.default(knn_x, knn_y, options);
    
    console.log("Model trained")
}

function start_run(){
    run = !run;
    console.log("running: ", run)
}

function load_models(){
    $.getJSON("pr_model.json", function(pr_model_json) {
        pr = new ML.Regression.PolynomialRegression(true, pr_model_json);
        console.log("pr loaded"); // this will show the info it in firebug console
    });
    $.getJSON("knn_model.json", function(knn_model_json) {
        knn = ML.SL.KNN.default.load(knn_model_json);
        console.log("knn loaded"); // this will show the info it in firebug console
    });
}

function save_models(){
    download(JSON.stringify(knn.toJSON()), "knn_model.json", 'text/plain')
    download(JSON.stringify(pr.toJSON()), "pr_model.json", 'text/plain')
}
function download(text, name, type) {

    var a = document.createElement("a");
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}

function x_thresh(x){
    return Math.max(0,Math.min(5, (x-1.7)*5))
}
function y_thresh(y){
    return Math.max(0,Math.min(5,y))*10
}
function val_thresh(val){
    return Math.max(-9,Math.min(30,Math.round(val*100)/100))
}
