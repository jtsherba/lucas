import d3 from 'd3';
import {strokeHatch} from '../../helpers/colors';

const chart = () => {
  /**
  * PUBLIC VARIABLES
  **/

  let margin = { top: 15, right: 20, bottom: 20, left: 80 };
  let width = 1000;
  let height = 200;
  const chartClass = 'multiLinePlusArea';
  //let xValue = (d) => d.date;
  //let yValue = (d) => +d.value;
  let xDomain = [new Date(2011, 1), new Date(2061, 1)];
  let yDomain = [0, 100];
  //let color = d3.scale.category10();
  let yAxisAnnotation = 'Ordinal Scale';
  let xAxisAnnotation = 'Time Scale';
  const alpha = 0.5;
  const spacing = 12;

  /**
  * PRIVATE VARIABLES
  **/

  let svg;
  let data;
  let chartW;
  let chartH;
  // X scale
  const xScale = d3.time.scale().nice();
  // Second X scale for brush slider
  const xScaleBrush = d3.time.scale().nice();
    // Y scale
  const yScale = d3.scale.linear();

  // X Axis on top of chart
  let xAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .tickFormat(d3.time.format('%Y'))
    .tickValues([new Date(2011, 0), new Date(2021, 0), new Date(2031, 0), new Date(2041, 0), new Date(2051, 0), new Date(2061, 0)])

  // X Axis for brush slider
  const xAxisBrush = d3.svg.axis()
    .scale(xScaleBrush)
    .orient('bottom');
  // First Y axis on the left side of chart
  const yAxis1 = d3.svg.axis()
    .scale(yScale)
    .orient('left')
    .tickFormat(d3.format("s"));
  // Second Y axis on the right side of chart
  // Second Y axis uses the same yScale as first one
  /*const yAxis2 = d3.svg.axis()
    .scale(yScale)
    .outerTickSize(0)
    .orient('left');*/
  // Line function
  const line = d3.svg.line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)));

const area = d3.svg.area()
    .x((d) => xScale(xValue(d)))
    .y0(function(d) { return yScale(+d.min)})
    .y1(function(d) { return yScale(+d.max)});
  // Area function
 /* const area = d3.svg.area()
    .x((d) => xScale(xValue(d)))
    .y0(function(d) { return d.values, function(d) { return yScale(+d.min); }})
    .y1(function(d) { return d.values, function(d) { return yScale(+d.max); }});*/
    //.y0((d) => yScale(yValue(d)))
    //.y1((d) => yScale(yValue(d)));

    //.y0((d) => yScale(yValue(d)))
    //.y1((d) => yScale(yValue(d)+20));
  
  // Events
  const dispatch = d3.dispatch('click', 'mouseout', 'brushmove');

  // TODO: Make it responsive
  // http://stackoverflow.com/questions/20010864/d3-axis-labels-become-too-fine-grained-when-zoomed-in

 function addY(textLabels, yScale){
    textLabels.each(function (d, i) {
       m = this;
       dm = d3.select(m);
        
       //yvalue1 = yScale(parseFloat(da[0][0].textContent));
       dm.attr("y", "0");

 })
}
 function relax(textLabels, yScale) {
    again = false;
   
    textLabels.each(function (d, i) {
        a = this;
        da = d3.select(a);
        
        //yvalue1 = yScale(parseFloat(da[0][0].textContent));
        
        y1 = da.attr("y");

        //y1 = yvalue1
        textLabels.each(function (d, j) {
        b = this;
        
        if (a.innerHTML == b.innerHTML) return;
        db = d3.select(b);
        if (da.attr("text-anchor") != db.attr("text-anchor")) return;
        //yvalue2 = yScale(parseFloat(db[0][0].textContent));
        y2 = db.attr("y");
        //y2 = yvalue2
        //console.log(y1)
        //console.log(y2)
        deltaY = y1 - y2;
      
        if (Math.abs(deltaY) > spacing) return;
        again = true;
        sign = deltaY > 0 ? 1 : -1;
        adjust = sign * alpha;
        da.attr("y",+y1 + adjust);
        db.attr("y",+y2 - adjust);
         //sign = deltaY > 0 ? 1 : -1;
        //adjust = sign * alpha;
        
        //atty1 = yScale(y1 + adjust)
        //atty2 = yScale(y2 - adjust)
     /*   yvalue1 = parseFloat(da[0][0].textContent);
        yvalue2 = parseFloat(db[0][0].textContent);
        
        
        if (yvalue1 >= yvalue2 ){
          
         
          const y1val = parseFloat(y1)-parseFloat(alpha)
          const y2val = parseFloat(y2)+parseFloat(alpha)
          
            da.attr("y",y2val);
            db.attr("y",y1val);
          
        }else if(yvalue1 < yvalue2 ){
         
        
          const y1val = parseFloat(y2)+parseFloat(alpha)
          const y2val = parseFloat(y1)-parseFloat(alpha)
          
            da.attr("y",y1val);
            db.attr("y",y2val);
        }

       // da.attr("y",+y1 + adjust);
       // db.attr("y",+y2 - adjust);
        //da.attr("y",atty1);
        //db.attr("y",atty2);*/
      })
    })
    if(again) {

        relax(textLabels, yScale)
    }
  }

function arrangeLabels(textLabels) {
  var move = 1;
  while(move > 0) {
    move = 0;
    //svg.selectAll(".place-label")
    textLabels
       .each(function() {
         var that = this,
             a = this.getBoundingClientRect();
         //svg.selectAll(".place-label")
         textLabels
            .each(function() {
              if(this != that) {
                var b = this.getBoundingClientRect();
                /*if((Math.abs(a.left - b.left) * 2 < (a.width + b.width)) &&
                   (Math.abs(a.top - b.top) * 2 < (a.height + b.height))) {*/
                 if (Math.abs(a.top - b.top) * 2 < (a.height + b.height)) {
                  // overlap, move labels
                 /* var dx = (Math.max(0, a.right - b.left) +
                           Math.min(0, a.left - b.right)) * 0.01,*/
                     var dy = (Math.max(0, a.bottom - b.top) +
                           Math.min(0, a.top - b.bottom)) * 0.02,
                      tt = d3.transform(d3.select(this).attr("transform")),
                      to = d3.transform(d3.select(that).attr("transform"));
                  //move += Math.abs(dx) + Math.abs(dy);
                  move += Math.abs(dy);
                
                 // to.translate = [ to.translate[0] + dx, to.translate[1] + dy ];
                  //tt.translate = [ tt.translate[0] - dx, tt.translate[1] - dy ];
                  to.translate = [ to.translate[0], to.translate[1] + dy ];
                  tt.translate = [ tt.translate[0], tt.translate[1] - dy ];
                  d3.select(this).attr("transform", "translate(" + tt.translate + ")");
                  d3.select(that).attr("transform", "translate(" + to.translate + ")");
                  a = this.getBoundingClientRect();
                }
              }
            });
       });
  }
}

  function exports(_selection) {
    _selection.each(function (_data) {
      chartW = width - margin.left - margin.right;
      chartH = height - margin.top - margin.bottom;

      xScale
        .range([0, chartW])
        .domain(xDomain);

      xScaleBrush
        .range([0, chartW])
        .domain(xScale.domain());

      yScale
        .rangeRound([chartH, 0])
        .domain(yDomain);

      // Update tick size for x and y axis
      xAxis.tickSize(-chartH);
      yAxis1.tickSize(-chartW);

      // Select the s*vg element, if it exists.
      svg = d3.select(this).selectAll('svg').data([_data]);
      data = _data;

      /**
      * Append the elements which need to be inserted only once to svgEnter
      * Following is a list of elements that area inserted into the svg once
      **/
      const svgEnter = svg.enter()
          .append('svg')
          .classed(chartClass, true);

      // Add defintions of graphical objects to be used later inside
      // a def container element.
      const defs = svgEnter.append('defs');

      // Add a clip path for hiding parts of graph out of bounds
      defs.append('clipPath')
        .attr('id', 'clip')
        .append('rect')
          .attr('width', chartW)
          .attr('height', chartH);

      // Add a marker style (http://bl.ocks.org/dustinlarimer/5888271)
      defs.append('marker')
        .attr('id', 'marker_stub')
        .attr('markerWidth', 5)
        .attr('markerHeight', 10)
        .attr('markerUnits', 'strokeWidth')
        .attr('orient', 'auto')
        .attr('refX', 0)
        .attr('refY', 0)
        .attr('viewBox', '-1 -5 2 10')
        .append('svg:path')
          .attr('d', 'M 0,0 m -1,-5 L 1,-5 L 1,5 L -1,5 Z')
          .attr('fill', '#DDD');


      // Add a group element called Container that hold all elements in the chart
      const container = svgEnter
        .append('g')
        .classed('', true);

      // Add group element to Container for x axis
      container.append('g').classed('x-axis-group axis', true);

      // Add group element to Container to hold data that will be drawn as area
      container.append('g').classed('timeseries-area', true);

      // Add group element to Container for y axis on left and right of chart
      container.append('g').classed('y-axis-group-1 axis', true);
      container.append('g').classed('y-axis-group-2 axis', true);

      // Add group element to Container tp hold data that will be drawn as lines
      container.append('g').classed('timeseries-line', true);

      container.append('g').classed('mouse-over-effects', true);

      // Group element to hold annotations, explanatory text, legend
      const annotation = container.append('g').classed('annotation', true);

      // Add Y axis label to annotation
      annotation.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 0 - (margin.left - 20))
          .attr('x', 0 - (chartH / 2))
          .attr('dy', '1em')
          .style('text-anchor', 'middle')
          .classed('y-axis-label', true);

     /* annotation.append('text')
        .attr('y', 0 - margin.top)
        .attr('x', (chartW / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .classed('year-label', true);*/

      // Hover line for click events
      container.append('g')
        .append('line')
          .classed('hover-line', true)
          .attr('x1', 0)
          .attr('x2', 0)
          .attr('y1', 0)
          .attr('y2', chartH)
          .style('stroke-opacity', 0);
      
      // Invisible rect for mouse tracking since you
      // can't catch mouse events on a g element
    /* container.append('svg:rect')
        .attr('width', chartW)
        .attr('height', chartH)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', function () {
          dispatch.mouseout();
        })
        .on('click', function () {
          const mouse = d3.mouse(this);
          // Dispatch click event
          dispatch.click(mouse, xScale);
        });*/
    /* let yearRange = []
      _data[0].values.forEach(function(d) {
            
           
           yearRange.push(parseInt(d.key))

      });
     
      let tickValues = []
      for(var i=d3.min(yearRange); i<=d3.max(yearRange)+10;i=i+10) {

        tickValues.push(new Date(i, 0))
      }
    
      xAxis
      .tickValues([new Date(2012, 0), new Date(2021, 0), new Date(2031, 0), new Date(2041, 0), new Date(2051, 0), new Date(2061, 0)])*/
      /* xAxis 
          .tickValues(tickValues)*/

      /*
      *  End of all the elements appended to svg only once
      */

      /*
      *  Following actions happen every time the svg is generated
      */
      // Update the outer dimensions.
      svg.transition()
        .attr('width', width)
        .attr('height', height);

      // Update the inner dimensions.
      svg.select('g')
        .attr({ transform: `translate(${margin.left}, ${margin.top})` });

      // Update the x-axis.
      svg.select('.x-axis-group.axis')
        .attr({ transform: `translate(0, ${chartH})` });

      // Call render chart function
      exports.render();
    });
  }


/**
  * PUBLIC GETTERS AND SETTERS
  **/

  exports.width = function (_) {
    if (!_) return width;
    width = parseInt(_);
    return this;
  };

  exports.height = function (_) {
    if (!_) return height;
    height = parseInt(_);
    return this;
  };

  exports.margin = function (_) {
    if (!_) return margin;
    margin = _;
    return this;
  };

  exports.color = function (_) {
    if (!_) return color;
    color = _;
    return this;
  };

  exports.yValue = function (_) {
    if (!_) return yValue;
    yValue = _;
    return this;
  };

  exports.xValue = function (_) {
    if (!_) return xValue;
    xValue = _;
    return this;
  };

  exports.yDomain = function (_) {
    if (!_) return yDomain;
    yDomain = _;
    return this;
  };

  exports.xDomain = function (_) {
    if (!_) return xDomain;
    xDomain = _;
    return this;
  };

  exports.yAxisAnnotation = function (_) {
    if (!_) return yAxisAnnotation;
    yAxisAnnotation = _;
    return this;
  };

  exports.xAxis = function (_) {
    if (!_) return xAxis;
    xAxis = _;
    return this;
  };

 /**
  * PUBLIC FUNCTIONS
  **/

  /*exports.getColor = function (seriesName) {
    if (!seriesName) return '#000';
    return color(seriesName);
  };*/

  exports.render = function () {
    this.drawAxes();
    this.drawLabels();
    this.drawArea();
    this.drawLines();
    this.drawMouseOverElements();
  };


  exports.onBrush = function (brush) {
    xScale.domain(brush.empty() ? xScaleBrush.domain() : brush.extent());
    this.drawAxes();
    this.drawArea();
    this.drawLines();
  };

  

  exports.drawAxes = function () {
    // Update the y-axis.
    svg.select('.y-axis-group-1.axis')
      .transition().duration(1000)
      .call(yAxis1);

    // Update second y axis
    /*svg.select('.y-axis-group-2.axis')
      .transition().duration(1000)
      .call(yAxis2);*/

   

    // Update y axis label
   /*svg.select('.y-axis-label')
      .text(yAxisAnnotation);*/

    // Update the x-axis.
    svg.select('.x-axis-group.axis')
      .transition().duration(1000)
      .call(xAxis);
  };

  exports.drawLabels = function () {
    
    /*svg.select('.year-label')
      .transition().duration(1000)
      .text('')
      .text("Stateclass Area Over Time");*/

     svg.select('.y-axis-label')
      .transition().duration(1000)
      .text('')
      .text(yAxisAnnotation);
  };

  exports.drawLines = function () {
   
    const lineData = data.filter((series) => {
        return series;
    });

    const lineGroupContainer = svg.select('g.timeseries-line');
    //const lineGroups = lineGroupContainer.selectAll('g').data(lineData);
    const lineGroups = lineGroupContainer.selectAll('path.line').data(lineData);
    const lineLabels = lineGroupContainer.selectAll('text').data(lineData);


    // Add a group element for every timeseries. The path (line) for each time series
    // is added to this group element. This is useful for changing the drawing order of
    // lines on hover or click events.
   
    // D3 UPDATE


    lineGroups.transition().duration(1000)
      .attr('class', 'line')
      .attr('d', (d) => line(d.values))
      .style("stroke-dasharray", (d) => (strokeHatch(d.name.split(" / ")[1])))
      .style('stroke', (d) => color(d.name.split(" / ")[0]));

    // D3 ENTER
    lineGroups.enter()
      .append('g')
        .attr('class', (d) => d.name)
      .append('path')
        .attr('class', 'line')
        .attr('d', (d) => line(d.values))
        //.style("stroke-dasharray", (d) => (dashed(d.name.split(":")[1])))
        .style("stroke-dasharray", (d) => (strokeHatch(d.name.split(" / ")[1])))
        .style('stroke', (d) => color(d.name.split(" / ")[0]));

    // D3 EXIT
    // If exits need to happen, apply a transition and remove DOM elements
    // when the transition has finished
    lineGroups.exit()
      .remove();
    lineLabels.exit()
      .remove();
  };

   exports.drawArea = function () {
    
    const areaData = data.filter((series) => {
        return series;
    });

    const areaGroupContainer = svg.select('g.timeseries-area');
    const areaGroups = areaGroupContainer.selectAll('path.area').data(areaData);
  
    // D3 UPDATE
    areaGroups.transition().duration(1000)
      .attr('class', 'area')
      .attr('d', (d) => area(d.values));

    // D3 ENTER
    areaGroups.enter()
      .append('g')
        .attr('class', (d) => d.name)
      .append('path')
        .attr('class', 'area')
        .attr('d', (d) => area(d.values));

    // D3 EXIT
    // If exits need to happen, apply a transition and remove DOM elements
    // when the transition has finished
    areaGroups.exit()
      .remove();
  };

  exports.drawMouseOverElements = function () {
   
    // Mouse over effect

    const mouseG = svg.select('g.mouse-over-effects');

    // Add black vertical line to follow mouse
    mouseG.append('path') 
      .attr('class', 'mouse-line')
      .style('stroke', 'black')
      .style('stroke-width', '1px')
      .style('opacity', '0');

    // Select all plotted lines
    const lines = d3.select('#one').selectAll('.line');
  
    //const verticleBar= mouseG.select('.mouse-line')
    // Add circles at intersection of all plotted lines and black vertical line
    mouseG.selectAll('.mouse-per-line').remove()

    const mousePerLine = mouseG.selectAll('.mouse-per-line')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'mouse-per-line');


    mousePerLine.append('circle')
      .attr('r', 3)
      .style('stroke', '#888')
      .style('fill', 'none')
      .style('stroke-width', '2px')
      .style('opacity', '0');

    mousePerLine.append('text')
      .attr("class","valueLabel")
      .attr('transform', 'translate(10,3)')
      .attr('y', '0');
    

   /* mouseG.append('svg:rect')
       .attr("class","legendrct")
      .attr('width', 150) // can't catch mouse events on a g element
      .attr('height', 100)
      .attr('fill', 'red')
      .style('opacity', '0');*/
      
    // Append a rect to catch mouse movements on canvas
    mouseG.append('svg:rect')
      .attr('width', chartW) // can't catch mouse events on a g element
      .attr('height', chartH)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function () { // on mouse out hide line, circles and text
        d3.select('#one').select('.mouse-line')
          .style('opacity', '0');
       /* d3.select('#one').select('.legendrct')
          .style('opacity', '0');*/
        d3.select('#one').selectAll('.mouse-per-line circle')
          .style('opacity', '0');
        d3.select('#one').selectAll('.mouse-per-line text')
          .style('opacity', '0');
      })
      .on('mouseover', function () { // on mouse in show line, circles and text
        d3.select('#one').select('.mouse-line')
          .style('opacity', '1');
       /* d3.select('#one').select('.legendrct')
          .style('opacity', '1');*/
        d3.select('#one').selectAll('.mouse-per-line circle')
          .style('opacity', '1');
        d3.select('#one').selectAll('.mouse-per-line text')
          .style('opacity', '1');


      })
      .on('mousemove', function () { 
   // mouse moving over canvas
        
        const mouse = d3.mouse(this);
        d3.select('#one').select('.mouse-line')
          .attr('d', () => {
            let d = `M${mouse[0]}, ${chartH}`;
            d += ` ${mouse[0]}, 0`;
            return d;
          });
          

      /*  const mouseHor = mouse[0]+10
        const mouseVer = (chartH/2)-50

        d3.select('#one').select('.legendrct')
          
          .attr("transform", function(d) { return "translate("+mouseHor+","+mouseVer+")"});*/

          

      d3.select('#one').selectAll('.mouse-per-line')
          .attr('transform', function (d) {
            const x0 = xScale.invert(mouse[0]).getFullYear();
            const bisect = d3.bisector((c) => parseInt(c.key)).right;
            const idx = bisect(d.values, x0);
            const d0 = d.values[idx - 1];
            const d1 = d.values[idx];
            
            let datum;
          //  let variablename = d.name.split(" / ")[0]
           // let scenario = d.name.split(" / ")[1]
            //let textcolor = color(d.name.split(" / ")[0])

            if (d1) {
              datum = x0 - parseInt(d0.key) > parseInt(d1.key) - x0 ? d1 : d0;
            } else {
              datum = d0;
            }
            //console.log(datum)
            //let textval = variablename + " " + scenario + " " + datum.values
            d3.select(this).select('text')
              .text(datum.values)


             // .style('fill', textcolor);

              
             
            return `translate(${mouse[0]}, ${yScale(datum.values)})`;

          });

          let textLabels = d3.select('#one').selectAll('text.valueLabel')
          textLabels
            .attr('transform', 'translate(10,3)')
          //addY(textLabels, yScale)
          arrangeLabels(textLabels)
          //relax2(textLabels, yScale)
          
      });
  };

  exports.updateTicks = function(ticks){
    xAxis
      .tickValues(ticks)
    svg.select('.x-axis-group.axis')
      .transition().duration(1000)
      .call(xAxis);
    

  };

  exports.moveTooltip = function (year) {

    d3.select('#one').select('.mouse-line')
      .style('opacity', '1');
    d3.select('#one').selectAll('.mouse-per-line circle')
      .style('opacity', '1');
    d3.select('#one').selectAll('.mouse-per-line text')
      .style('opacity', '1');

    const mouse = xScale(new Date(year, 0, 1));
    d3.select('#one').select('.mouse-line')
      .attr('d', () => {
        let d = `M${mouse}, ${chartH}`;
        d += ` ${mouse}, 0`;
        return d;
      });

    d3.select('#one').selectAll('.mouse-per-line')
      .attr('transform', function (d) {
        const x0 = year;
        const bisect = d3.bisector((c) => parseInt(c.key)).right;
        const idx = bisect(d.values, x0);
        const d0 = d.values[idx - 1];
        const d1 = d.values[idx];
        let datum;
        if (d1) {
          datum = x0 - parseInt(d0.key) > parseInt(d1.key) - x0 ? d1 : d0;
        } else {
          datum = d0;
        }

        d3.select(this).select('text')
          .text(datum.values);
        
        return `translate(${mouse}, ${yScale(datum.values)})`;
      });
  };

    exports.resetTooltip = function (year) {

    d3.select('#one').select('.mouse-line')
      .style('opacity', '1');
    d3.select('#one').selectAll('.mouse-per-line circle')
      .style('opacity', '1');
    d3.select('#one').selectAll('.mouse-per-line text')
      .style('opacity', '1');

    const mouse = xScale(new Date(year, 0, 1));
    d3.select('#one').select('.mouse-line')
      .attr('d', () => {
        let d = `M${mouse}, ${chartH}`;
        d += ` ${mouse}, 0`;
        return d;
      });

    d3.select('#one').selectAll('.mouse-per-line')
      .attr('transform', function (d) {
        const x0 = year;
        const bisect = d3.bisector((c) => parseInt(c.key)).right;
        const idx = bisect(d.values, x0);
        const d0 = d.values[idx - 1];
        const d1 = d.values[idx];
        let datum;
        if (d1) {
          datum = x0 - parseInt(d0.key) > parseInt(d1.key) - x0 ? d1 : d0;
        } else {
          datum = d0;
        }

        d3.select(this).select('text')
          .text(datum.values);
        
        return `translate(${mouse}, ${yScale(datum.values)})`;
      });
  };


  d3.rebind(exports, dispatch, 'on');


  return exports;
};

export default chart;
