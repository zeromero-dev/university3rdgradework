/*
  This Pen is based on an L-system and Turtle graphics. Read more about L-systems:
  https://codepen.io/DonKarlssonSan/blog/i-love-fractals
  
  Here is the recursive version:
  https://codepen.io/DonKarlssonSan/pen/qdVWgG
  
  The Hilbert Curve: https://en.wikipedia.org/wiki/Hilbert_curve
 
*/

(function () {
    // I've tried to scale the size of each step
    // It kind of works for: 0 <= iterations <= 8
    function incX(angle) {
      return Math.round(Math.cos(angle)*min/(Math.pow(iterations+1, 2.2)));
    }
    function incY(angle) {
      // Y increases downwards on the canvas -->
      // switch sign so it's the same as Cartesian.
      return Math.round(Math.sin(angle)*min/(Math.pow(iterations+1, 2.2)))*-1;
    }
    
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var min = Math.min(canvas.width, canvas.height);
    var ctx = canvas.getContext("2d");
    
    // Try changing this!
    var iterations = 6;
    
    var x,y;
    var angle = 0;
    
    //
    // L-system
    //
    // Alphabet : A, B
    // Constants : F + −
    // Axiom : A
    // Production rules:
    // A → − B F + A F A + F B −
    // B → + A F − B F B − F A +
    // Here, "F" means "draw forward", 
    //       "−" means "turn left 90°", 
    //       "+" means "turn right 90°" and 
    //       "A" and "B" are ignored during drawing.
    
    // Axiom
    var result = "A";
    
    var rules = {
      A: "-BF+AFA+FB-", // Rule 1
      B: "+AF-BFB-FA+"  // Rule 2
    };
    
    // Production
    for(var i = 0; i < iterations; ++i) {
      result = replaceAll(result, rules);
    }
  
    function replaceAll(str, mapObj){
      var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
  
      return str.replace(re, function(matched){
          return mapObj[matched];
      });
    }
    
    var numberOfF = (result.match(/F/g) || []).length;
    var currentFIndex = 0;
    
    x = Math.round(canvas.width / (iterations + 1));
    y = Math.round(canvas.height - canvas.height / (iterations + 1));
    
    
    
    //for(var index = 0; index < result.length; ++index) {
    var index = 0;
    function draw() {
      if(index === result.length) {
        return;
      }
      if(result[index] === "F") {
        var color = currentFIndex / numberOfF * 360;
        ctx.strokeStyle = "hsl(" + color + ", 100%, 50%)";
        ctx.beginPath();
        ctx.moveTo(x, y);
        x += incX(angle);
        y += incY(angle);
        ctx.lineTo(x, y);
        ctx.stroke();
        ++currentFIndex;
      } else if(result[index] === "+") {
        angle -= Math.PI/2;
      } else if(result[index] === "-") {
        angle += Math.PI/2;
      }    
      ++index;
      if(index % 4 === 0) {
        requestAnimationFrame(draw);
      } else {
        draw();
      }
    }
    draw();
  })();