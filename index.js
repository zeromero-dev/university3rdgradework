

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
    
    // Зміна ітерацій
    var iterations = 6;
    
    var x,y;
    var angle = 0;
    
   
    //  F означає малюйте вперед
    //  - означає повернути вліво на 90°
    //  + означає повернути вправо на 90°
    //   А і В ігноруються
    
    // Axiom
    var result = "A";
    
    var rules = {
      A: "-BF+AFA+FB-", // правило 1
      B: "+AF-BFB-FA+"  // правило 2
    };
    
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