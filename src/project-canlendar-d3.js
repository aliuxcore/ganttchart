/**
 *
 * Project Calendar
 * @author zhouquan.yezq@alibaba-inc.com
 * @version 1.0
 *
 */

d3.proCalendar = function() {

    var margin = {
		top : 20,
		right : 0,
		bottom : 20,
		left : 40
    };

    var height = 100;
    var width = 982,padding=10;
    var minTime, maxTime,maxNumber,originalData=[];

    function proCalendar() {

		var x = d3.time.scale()
		.domain([minTime, maxTime])
		.range([0, width]).clamp(true);

		var y = d3.scale.linear()
		.domain([maxNumber,0])
		.range([0, height]);


	    var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(10).ticks(4).tickSize(0);

		var brush = d3.svg.brush()
		.x(x)
		.extent([minTime+(maxTime-minTime)/2,maxTime])
		.on("brushend", brushended);

		var svg = d3.select("#proCalendarContainer").append("svg")

		svg.attr("class", "")
		.attr("width", width + margin.left + margin.right)
		.attr("height", margin.top+margin.bottom+height)
		.append("g")
		.attr("transform", "translate(0,0)");

		var chart=svg.append("g")
		.attr("class","chart")
		.attr("transform", "translate("+margin.left+",0)")

		chart.append("rect")
		.attr("class", "grid-background")
		.attr("width", width)
		.attr("transform", "translate(0,0)")
		.attr("height", height);

		//draw the y lines
		chart.selectAll("line.y")
		.data(y.ticks(5))
		.enter().append("line")
		.attr("class", "y")
		.attr("x1", 0)
		.attr("x2", width)
		.attr("y1", y)
		.attr("y2", y)
		.style("stroke", "#e7e7e7");



		chart.append("g")
		.attr("class", "x time")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickFormat(function(d) {
			var format=d3.time.format("%m");
			if(format(d)=="01") {
				return d3.time.format("%Y")(d);
			}else {
				return d3.time.format("%m/%d")(d);
			}
		})
		.tickPadding(0))
		.selectAll("text")
		.attr("x", 6)
		.style("text-anchor", null);

		// Add the y-axis.
		chart.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(0,6)")
		.call(yAxis);

		// An area generator, for the light fill.
		var area = d3.svg.area()
		    .interpolate("monotone")
		    .x(function(d) {   console.info(d.time); return x(d.time); })
		    .y0(height)
		    .y1(function(d) { console.info(d.number); return y(d.number); });

		var lineFunction = d3.svg.line()
		.x(function(d) {  return x(d.time); })
		.y(function(d) { return y(d.number); })
		.interpolate("monotone");

		// Add the area path.
		chart.append("path")
		.attr("d",  area(proCalendar.processLineData(originalData)))
		.attr("class", "area")
		.attr("fill", "#e7e7e7");

		var gBrush = chart.append("g")
		.attr("class", "brush")
		.call(brush)
		//.call(brush.event); //why this line cause the script error

		gBrush.selectAll("rect")
		.attr("height", height);

		function brushended() {
			if (!d3.event.sourceEvent) return; // only transition after input
			var extent0 = brush.extent(),
			extent1 = extent0.map(d3.time.day.round);

			// if empty when rounded, use floor & ceil instead
			if (extent1[0] >= extent1[1]) {
			extent1[0] = d3.time.day.floor(extent0[0]);
			extent1[1] = d3.time.day.ceil(extent0[1]);
			}

			d3.select(this).transition()
			.call(brush.extent(extent1))
			.call(brush.event);
		}
		return proCalendar;

    };

    /**
	* parse the data for proCalendar chart
	* @param {JSON} {"items":[{"number":100,"time":1381507200000},...]}
    */
    proCalendar.processData=function(data) {
    	var _data=data.items,__time=[],__number=[];
    	originalData=_data;
    	_data.forEach(function(v,index){
    		__time.push(v.time);
    		__number.push(v.number);
    	});
    	minTime=d3.min(__time);
    	maxTime=d3.max(__time);
    	maxNumber=d3.max(__number);
    	return proCalendar;

    };

    proCalendar.processLineData=function(){
        var __arr=[];
    	originalData.forEach(function(v,index){
            var r={
            	"number":v.number,
            	"time":v.time
            };
			__arr.push(r);
    	});
    	return __arr;
    };
    return proCalendar;
};
