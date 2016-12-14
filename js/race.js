d3.json('/pedalo/media/data.json', function(data){

  var rider_1 = data['rider_1'];
  var rider_2 = data['rider_2'];

  var width = 10000,
      height = 100;

  var svg = d3.select('#viz').append('svg')
    .attr("width", width)
    .attr("height", height)

  var svg_2 = d3.select('#viz').append('svg')
    .attr("width", width)
    .attr("height", height)

  var timeCounter = d3.select('#viz').append('div')

  // rider 1
  var distanceCounter = d3.select('#viz').append('div')
  var deliveryCounter = d3.select('#viz').append('div')
  var restaurantsCounter = d3.select('#viz').append('div')
  var foodoraCounter = d3.select('#viz').append('div')
  var riderCounter = d3.select('#viz').append('div')

  // rider 2
  var distanceCounter_2 = d3.select('#viz').append('div')
  var deliveryCounter_2 = d3.select('#viz').append('div')
  var restaurantsCounter_2 = d3.select('#viz').append('div')
  var foodoraCounter_2 = d3.select('#viz').append('div')
  var riderCounter_2 = d3.select('#viz').append('div')

  svg.append('g')
    .attr("transform", "translate(" + $('#viz').width()/2 +",0)")
    .append('g')
    .attr("class","gPoint")
    .attr("transform", "translate(0,0)")

  svg_2.append('g')
    .attr("transform", "translate(" + $('#viz').width()/2 +",0)")
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

  var point = svg.append('circle')
      .attr('cx', $('#viz').width()/2)
      .attr('cy', height/2)
      .attr('r',4.5)
      .attr('fill', '#f00')

  var points = svg.select('.gPoint').selectAll('.points')
    .data(rider_1)
    .enter()
    .append('circle')
    .attr('class', 'points')
    .attr('cx', function(d){
      return kmScale(d.distanceComulative)
    })
    .attr('cy', height/2)
    .attr('r',5)
    .attr('fill', 'white')
    .attr('stroke', function(d){
      return colorScale(d.type)
    })
    .each(function(d){

      $(this).popover({
                'container': 'body',
                'title': d.type,
                'content': d.time
            });
    })

    var point_2 = svg_2.append('circle')
        .attr('cx', $('#viz').width()/2)
        .attr('cy', height/2)
        .attr('r',4.5)
        .attr('fill', '#f00')

    var points_2 = svg_2.select('.gPoint').selectAll('.points')
      .data(rider_2)
      .enter()
      .append('circle')
      .attr('class', 'points')
      .attr('cx', function(d){
        return kmScale(d.distanceComulative)
        //return kmScale_2(d.distanceComulative)
      })
      .attr('cy', height/2)
      .attr('r',5)
      .attr('fill', 'white')
      .attr('stroke', function(d){
        return colorScale(d.type)
      })
      .each(function(d){

        $(this).popover({
                  'container': 'body',
                  'title': d.type,
                  'content': d.time
              });
      })

    var friction = 1;
    var x = 0;
    var formatTime = d3.timeFormat("%H:%M:%S");
    $('#viz').mousewheel(function(evt, chg) {
        evt.preventDefault();

        x = x - chg;

        if(x>0){
          x = 0
          var tmp = timeScale(x);
          var actualDate = new Date(1970,0,1,19,30)
          actualDate = new Date(actualDate.getTime() + (tmp*1000))
          timeCounter.text(formatTime(actualDate))

          //rider_1
          distanceCounter.text(Math.round(kmScale.invert(timerScale(tmp)))/1000 + ' km.')
          svg.select('.gPoint').attr("transform", "translate(" + -timerScale(tmp) +",0)")

          //rider_2
          distanceCounter_2.text(Math.round(kmScale.invert(timerScale_2(tmp)))/1000 + ' km.')
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
          distanceCounter_2.text(Math.round(kmScale.invert(timerScale_2(tmp)))/1000 + ' km.')
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
          deliveryCounter.text('consegne: ' + deliveries);

          var restaurants = d3.sum(pointsDone.map(function(d){
            if(d.type == 'restaurant'){
              return d3.sum(d.items, function(f){return f.price})
            }
          }),function(d){return d})

          restaurants = restaurants - (restaurants*.30)

          restaurantsCounter.text("totale ristoranti: " + d3.format(".2f")(restaurants) + '€')

          var foodora = d3.sum(pointsDone.map(function(d){
            if(d.type == 'restaurant'){
              return d3.sum(d.items, function(f){return f.price+2.9})
            }
          }),function(d){return d})*0.30

          foodoraCounter.text("totale foodora: " + d3.format(".2f")(foodora) + '€')

          var rider = d3.sum(pointsDone.map(function(d){
            if(d.type == 'client'){
              return d3.sum(d.items, function(f){return f.tip})
            }
          }),function(d){return d}) + (deliveries*3.6)

          riderCounter.text("totale rider: " + d3.format(".2f")(rider) + '€')

          if(kmScale.invert(timerScale(tmp))<=totKm ){
            distanceCounter.text(Math.round(kmScale.invert(timerScale(tmp)))/1000 + ' km.')
            svg.select('.gPoint').attr("transform", "translate(" + -timerScale(tmp) +",0)")
          }else {
            var x2 = kmScale(totKm)
            distanceCounter.text(Math.round(totKm)/1000 + ' km.')
            svg.select('.gPoint').attr("transform", "translate(" + -x2 +",0)")
          }

          //rider_2
          var bisectTime_2 = d3.bisector(function(d) { return d.timer; }).left;
          var bisecIndex_2 = bisectTime_2(rider_2, tmp);

          var pointsDone_2 = rider_2.slice(0,bisecIndex_2);

          var deliveries_2 = pointsDone_2.filter(function(d){return d.type == 'client'}).length;
          deliveryCounter_2.text('consegne: ' + deliveries_2);

          var restaurants_2 = d3.sum(pointsDone_2.map(function(d){
            if(d.type == 'restaurant'){
              return d3.sum(d.items, function(f){return f.price})
            }
          }),function(d){return d})

          restaurants_2 = restaurants_2 - (restaurants_2*.30)

          restaurantsCounter_2.text("totale ristoranti: " + d3.format(".2f")(restaurants_2) + '€')

          var foodora_2 = d3.sum(pointsDone_2.map(function(d){
            if(d.type == 'restaurant'){
              return d3.sum(d.items, function(f){return f.price+2.9})
            }
          }),function(d){return d})*0.30

          foodoraCounter_2.text("totale foodora: " + d3.format(".2f")(foodora_2) + '€')

          var rider_2_ = d3.sum(pointsDone_2.map(function(d){
            if(d.type == 'client'){
              return d3.sum(d.items, function(f){return f.tip})
            }
          }),function(d){return d}) + (deliveries_2*3.6)

          riderCounter_2.text("totale rider: " + d3.format(".2f")(rider_2_) + '€')

          distanceCounter_2.text(Math.round(kmScale.invert(timerScale_2(tmp)))/1000 + ' km.')
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
