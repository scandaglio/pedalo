d3.json('/pedalo/media/data.json', function(data){

  var rider_1 = data['rider_1'];
  var rider_2 = data['rider_2'];

  var width = 10000,
      height = 200;

  var contWidth = $('#rider_1 .vizRider').width();


  var svg = d3.select('#rider_1 .vizRider').append('svg')
    .attr("width", width)
    .attr("height", height)

  var svg_2 = d3.select('#rider_2 .vizRider').append('svg')
    .attr("width", width)
    .attr("height", height)

  var timeCounter = d3.select('#timer h3')

  // rider 1
  var distanceCounter = d3.select('#rider_1 .km').text('0.000 km')
  var deliveryCounter = d3.select('#rider_1 .delivery').text('0')
  var restaurantsCounter = d3.select('#rider_1 .restaurant').text('0.00 €')
  var foodoraCounter = d3.select('#rider_1 .company').text('0.00 €')
  var riderCounter = d3.select('#rider_1 .rider').text('0.00 €')

  // rider 2
  var distanceCounter_2 = d3.select('#rider_2 .km').text('0.000 km')
  var deliveryCounter_2 = d3.select('#rider_2 .delivery').text('0')
  var restaurantsCounter_2 = d3.select('#rider_2 .restaurant').text('0.00 €')
  var foodoraCounter_2 = d3.select('#rider_2 .company').text('0.00 €')
  var riderCounter_2 = d3.select('#rider_2 .rider').text('0.00 €')

  svg.append('g')
    .attr("transform", "translate(" + contWidth/3 +",0)")
    .append('g')
    .attr("class","gPoint")
    .attr("transform", "translate(0,0)")

  svg_2.append('g')
    .attr("transform", "translate(" + contWidth/3 +",0)")
    .append('g')
    .attr("class","gPoint")
    .attr("transform", "translate(0,0)")

  var totKm = d3.sum(rider_1, function(d){return d.distance});
  var totKm_2 = d3.sum(rider_2, function(d){return d.distance});

  var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
  var fakeDay = '2016-01-01 ';

  rider_1.forEach(function(d,i){

    var time = parseTime(fakeDay + d.time)
    var millisec = time.getTime();
    d.millisec = millisec;
    if(i>0){
      d.timer = (d.millisec - rider_1[0].millisec)/1000;
      d.distanceComulative = rider_1[i-1].distanceComulative + d.distance;
    }else{
      d.distanceComulative = 0;
      d.timer = 0;
    }
  })

  rider_2.forEach(function(d,i){

    var time = parseTime(fakeDay + d.time)
    var millisec = time.getTime();
    d.millisec = millisec;
    if(i>0){
      d.timer = (d.millisec - rider_2[0].millisec)/1000;
      d.distanceComulative = rider_2[i-1].distanceComulative + d.distance;
    }else{
      d.distanceComulative = 0;
      d.timer = 0;
    }
  })

  // var kmScale = d3.scaleLinear()
  //   .domain([0,totKm])
  //   .range([0,width])

  var kmScale = d3.scaleLinear()
    .domain([0,Math.max(totKm,totKm_2)])
    .range([0,width])

  // var kmScale_2 = d3.scaleLinear()
  //   .domain([0,totKm_2])
  //   .range([0,width])

  var colorScale = d3.scaleOrdinal()
    .domain(['home', 'restaurant', 'client'])
    .range(['#f00', '#0f0', '#00f'])

  // var timeScale = d3.scaleLinear()
  //   .range([0,d3.max(rider_1, function(d){return d.timer})])
  //   .domain([0,-width])

  var timeScale = d3.scaleLinear()
    .range([0,Math.max(d3.max(rider_1, function(d){return d.timer}),d3.max(rider_2, function(d){return d.timer}))])
    .domain([0,-width])


  var timerScaleRange = rider_1.map(function(d){
    return kmScale(d.distanceComulative)
  })

  var timerScale = d3.scaleLinear()
    .domain(rider_1.map(function(d){return d.timer}))
    .range(timerScaleRange);

  var timerScaleRange_2 = rider_2.map(function(d){
    return kmScale(d.distanceComulative)
  })

  var timerScale_2 = d3.scaleLinear()
    .domain(rider_2.map(function(d){return d.timer}))
    .range(timerScaleRange_2);


  var rect = svg.append('rect')
      .attr('x', contWidth/3 -8)
      .attr('y', height/2 -15)
      .attr('fill', 'white')
      .attr('width', 30)
      .attr('height', 30)

  var point = svg.append('text')
      .attr('x', contWidth/3 -6)
      .attr('y', height/2 +5)
      .attr('fill', '#d82066')
      .attr('class', 'fa vizBicycle')
      .text('\uf206')

    var line = svg.select('.gPoint')
      .append('line')
      .attr('x1',0)
      .attr('y1',height/2)
      .attr('x2',kmScale(totKm))
      .attr('y2',height/2)
      .attr('stroke-dasharray', '3,3')
      .attr('stroke','black')

    var rects = svg.select('.gPoint').selectAll('.bckText')
      .data(rider_1)
      .enter()
      .append('rect')
      .attr('class', 'bckText')
      .attr('x', function(d){
        return kmScale(d.distanceComulative)-10;
      })
      .attr('y', height/2 -10)
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', 'white')

    var icons = svg.select('.gPoint').selectAll('.icons')
      .data(rider_1)
      .enter()
      .append('text')
      .attr('class', 'icons fa')
      .attr('x', function(d){
        return kmScale(d.distanceComulative) -6;
      })
      .attr('y', height/2 + 5)
      .attr('fill', 'black')
      .text(function(d){
        if(d.type == 'home'){
          return '\uf015';
        }else if(d.type == 'restaurant'){
          return '\uf0f5';
        }else if(d.type == 'client'){
          return '\uf182';
        }
      })

      var desc = svg.select('.gPoint')
        .append('g')
        .attr('transform', 'translate(0,' + -20 +')')
        .selectAll('.desc')
        .data(rider_1)
        .enter()
        .append('text')
        .attr('class', 'desc')
        .attr('text-anchor', 'middle')
        .attr('x', function(d){
          return kmScale(d.distanceComulative);
        })
        .attr('y', height/2)
        .each(function(d){
          var text = d3.select(this);

          if(d.type == 'restaurant'){

            var orders = d.items.length>1?d.items.length + ' ordini':d.items.length + ' ordine';
            var quantity = d3.sum(d.items, function(f){return f.quantity}) + ' porzioni';
            var cost = d3.sum(d.items, function(f){return f.price}) + '€ totale';

            text.append('tspan')
              .text(cost)
              .attr('x', kmScale(d.distanceComulative))

            text.append('tspan')
              .text(quantity)
              .attr('dy', -17)
              .attr('x', kmScale(d.distanceComulative))

            text.append('tspan')
              .text(orders)
              .attr('dy', -17)
              .attr('x', kmScale(d.distanceComulative))

          }else if(d.type == 'client'){

            var cont = d.items[0].tip?d.items[0].tip + '€ di mancia!':'niente mancia...';
            text.append('tspan')
              .text(cont)
          }

        })


    var rect_2 = svg_2.append('rect')
        .attr('x', contWidth/3 -8)
        .attr('y', height/2 -15)
        .attr('fill', 'white')
        .attr('width', 30)
        .attr('height', 30)

    var point_2 = svg_2.append('text')
        .attr('x', contWidth/3 -6)
        .attr('y', height/2 +5)
        .attr('fill', '#d82066')
        .attr('class', 'fa vizBicycle')
        .text('\uf206')

      var line_2 = svg_2.select('.gPoint')
        .append('line')
        .attr('x1',0)
        .attr('y1',height/2)
        .attr('x2',kmScale(totKm_2))
        .attr('y2',height/2)
        .attr('stroke-dasharray', '3,3')
        .attr('stroke','black')

      var rects_2 = svg_2.select('.gPoint').selectAll('.bckText')
        .data(rider_2)
        .enter()
        .append('rect')
        .attr('class', 'bckText')
        .attr('x', function(d){
          return kmScale(d.distanceComulative)-10;
        })
        .attr('y', height/2 -10)
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', 'white')

      var icons_2 = svg_2.select('.gPoint').selectAll('.icons')
        .data(rider_2)
        .enter()
        .append('text')
        .attr('class', 'icons fa')
        .attr('x', function(d){
          return kmScale(d.distanceComulative) -6;
        })
        .attr('y', height/2 + 5)
        .attr('fill', 'black')
        .text(function(d){
          if(d.type == 'home'){
            return '\uf015';
          }else if(d.type == 'restaurant'){
            return '\uf0f5';
          }else if(d.type == 'client'){
            return '\uf182';
          }
        })

        var desc_2 = svg_2.select('.gPoint')
          .append('g')
          .attr('transform', 'translate(0,' + -20 +')')
          .selectAll('.desc')
          .data(rider_2)
          .enter()
          .append('text')
          .attr('class', 'desc')
          .attr('text-anchor', 'middle')
          .attr('x', function(d){
            return kmScale(d.distanceComulative);
          })
          .attr('y', height/2)
          .each(function(d){
            var text = d3.select(this);

            if(d.type == 'restaurant'){

              var orders = d.items.length>1?d.items.length + ' ordini':d.items.length + ' ordine';
              var quantity = d3.sum(d.items, function(f){return f.quantity}) + ' porzioni';
              var cost = d3.sum(d.items, function(f){return f.price}) + '€ totale';

              text.append('tspan')
                .text(cost)
                .attr('x', kmScale(d.distanceComulative))

              text.append('tspan')
                .text(quantity)
                .attr('dy', -17)
                .attr('x', kmScale(d.distanceComulative))

              text.append('tspan')
                .text(orders)
                .attr('dy', -17)
                .attr('x', kmScale(d.distanceComulative))

            }else if(d.type == 'client'){

              var cont = d.items[0].tip?d.items[0].tip + '€ di mancia!':'niente mancia...';
              text.append('tspan')
                .text(cont)
            }

          })

    var friction = 1;
    var x = 0;
    var formatTime = d3.timeFormat("%H:%M:%S");
    $('#race').mousewheel(function(evt, chg) {
        evt.preventDefault();

        x = x - chg;

        if(x>0){
          x = 0
          var tmp = timeScale(x);
          var actualDate = new Date(1970,0,1,19,30)
          actualDate = new Date(actualDate.getTime() + (tmp*1000))
          timeCounter.text(formatTime(actualDate))

          //rider_1
          distanceCounter.text(Math.round(kmScale.invert(timerScale(tmp)))/1000 + ' km')
          svg.select('.gPoint').attr("transform", "translate(" + -timerScale(tmp) +",0)")

          //rider_2
          distanceCounter_2.text(Math.round(kmScale.invert(timerScale_2(tmp)))/1000 + ' km')
          svg_2.select('.gPoint').attr("transform", "translate(" + -timerScale_2(tmp) +",0)")


        }else if (x < -width) {
          x = -width
          var tmp = timeScale(x);
          var actualDate = new Date(1970,0,1,19,30)
          actualDate = new Date(actualDate.getTime() + (tmp*1000))
          timeCounter.text(formatTime(actualDate))

          //rider_1
          //if(kmScale.invert(timerScale(tmp))<=totKm ){
            //var x2 = kmScale(totKm)
            //var tmp2 = timeScale(x2);

            //distanceCounter.text(Math.round(kmScale.invert(timerScale(tmp2)))/1000 + ' km.')
            //svg.select('.gPoint').attr("transform", "translate(" + -timerScale(tmp2) +",0)")
          //distanceCounter.text(Math.round(kmScale.invert(timerScale(tmp)))/1000 + ' km.')
          //svg.select('.gPoint').attr("transform", "translate(" + -timerScale(tmp) +",0)")

          //rider_2
          distanceCounter_2.text(Math.round(kmScale.invert(timerScale_2(tmp)))/1000 + ' km')
          svg_2.select('.gPoint').attr("transform", "translate(" + -timerScale_2(tmp) +",0)")

        }else{
          var tmp = timeScale(x);
          var actualDate = new Date(1970,0,1,19,30)
          actualDate = new Date(actualDate.getTime() + (tmp*1000))
          timeCounter.text(formatTime(actualDate))

          //rider_1
          var bisectTime = d3.bisector(function(d) { return d.timer; }).left;
          var bisecIndex = bisectTime(rider_1, tmp);

          var pointsDone = rider_1.slice(0,bisecIndex);

          var deliveries = pointsDone.filter(function(d){return d.type == 'client'}).length;
          deliveryCounter.text(deliveries);

          var restaurants = d3.sum(pointsDone.map(function(d){
            if(d.type == 'restaurant'){
              return d3.sum(d.items, function(f){return f.price})
            }
          }),function(d){return d})

          restaurants = restaurants - (restaurants*.30)

          restaurantsCounter.text(d3.format(".2f")(restaurants) + ' €')

          var foodora = d3.sum(pointsDone.map(function(d){
            if(d.type == 'restaurant'){
              return d3.sum(d.items, function(f){return f.price+2.9})
            }
          }),function(d){return d})*0.30

          foodoraCounter.text(d3.format(".2f")(foodora) + ' €')

          var rider = d3.sum(pointsDone.map(function(d){
            if(d.type == 'client'){
              return d3.sum(d.items, function(f){return f.tip})
            }
          }),function(d){return d}) + (deliveries*3.6)

          riderCounter.text(d3.format(".2f")(rider) + ' €')

          if(kmScale.invert(timerScale(tmp))<=totKm ){
            distanceCounter.text(Math.round(kmScale.invert(timerScale(tmp)))/1000 + ' km')
            svg.select('.gPoint').attr("transform", "translate(" + -timerScale(tmp) +",0)")
          }else {
            var x2 = kmScale(totKm)
            distanceCounter.text(Math.round(totKm)/1000 + ' km')
            svg.select('.gPoint').attr("transform", "translate(" + -x2 +",0)")
          }

          //rider_2
          var bisectTime_2 = d3.bisector(function(d) { return d.timer; }).left;
          var bisecIndex_2 = bisectTime_2(rider_2, tmp);

          var pointsDone_2 = rider_2.slice(0,bisecIndex_2);

          var deliveries_2 = pointsDone_2.filter(function(d){return d.type == 'client'}).length;
          deliveryCounter_2.text(deliveries_2);

          var restaurants_2 = d3.sum(pointsDone_2.map(function(d){
            if(d.type == 'restaurant'){
              return d3.sum(d.items, function(f){return f.price})
            }
          }),function(d){return d})

          restaurants_2 = restaurants_2 - (restaurants_2*.30)

          restaurantsCounter_2.text(d3.format(".2f")(restaurants_2) + ' €')

          var foodora_2 = d3.sum(pointsDone_2.map(function(d){
            if(d.type == 'restaurant'){
              return d3.sum(d.items, function(f){return f.price+2.9})
            }
          }),function(d){return d})*0.30

          foodoraCounter_2.text(d3.format(".2f")(foodora_2) + ' €')

          var rider_2_ = d3.sum(pointsDone_2.map(function(d){
            if(d.type == 'client'){
              return d3.sum(d.items, function(f){return f.tip})
            }
          }),function(d){return d}) + (deliveries_2*3.6)

          riderCounter_2.text(d3.format(".2f")(rider_2_) + ' €')

          distanceCounter_2.text(Math.round(kmScale.invert(timerScale_2(tmp)))/1000 + ' km')
          svg_2.select('.gPoint').attr("transform", "translate(" + -timerScale_2(tmp) +",0)")
        }

    })

})

function getTransformation(transform) {
  // Create a dummy g for calculation purposes only. This will never
  // be appended to the DOM and will be discarded once this function
  // returns.
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

  // Set the transform attribute to the provided string value.
  g.setAttributeNS(null, "transform", transform);

  // consolidate the SVGTransformList containing all transformations
  // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
  // its SVGMatrix.
  var matrix = g.transform.baseVal.consolidate().matrix;

  // Below calculations are taken and adapted from the private function
  // transform/decompose.js of D3's module d3-interpolate.
  var {a, b, c, d, e, f} = matrix;   // ES6, if this doesn't work, use below assignment
  // var a=matrix.a, b=matrix.b, c=matrix.c, d=matrix.d, e=matrix.e, f=matrix.f; // ES5
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * Math.PI/180,
    skewX: Math.atan(skewX) * Math.PI/180,
    scaleX: scaleX,
    scaleY: scaleY
  };
}
