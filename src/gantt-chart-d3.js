/**
 * @author Dimitry Kudrayvtsev
 * @version 2.1
 *
 * Add user and task for small project management
 * @author zhouquan.yezq
 * @version 2.2
 */

d3.gantt = function() {


    var FIT_TIME_DOMAIN_MODE = "fit";
    var FIXED_TIME_DOMAIN_MODE = "fixed";

    var margin = {
		top : 20,
		right : 0,
		bottom : 0,
		left : 60
    };

    var config={
    	height:500,
    	width:982
    }

    var timeDomainStart = d3.time.day.offset(new Date(),-3);
    var timeDomainEnd = d3.time.day.offset(new Date(),+3);
    var timeDomainMode = FIT_TIME_DOMAIN_MODE;// fixed or fit
    var taskTypes = [];
    var taskStatus = [],__tasks=[],__persons=[],__yscale=0;
    var height = 500;
    var width = 982;
    var tickFormat = "%a %d";

    var keyFunction = function(d) {
		return d.startTime + d.y + d.endTime;
    };

    var rectTransform = function(d) {
		return "translate(" + x(d.startTime) + "," + y(d.y) + ")";
    };

    var x, y, xAxis, yAxis;
    /*var x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);

    var y = d3.scale.ordinal().domain(0,__yscale*10).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);

    var xAxis = d3.svg.axis().scale(x).orient("top").tickFormat(d3.time.format('%b %d')).tickSubdivide(false)
	    .tickSize(8).tickPadding(8);

    var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10).tickSize(0);*/

    var initAxis = function() {
		x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);
		y = d3.scale.ordinal().domain([10,20,30,40,50,60]).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);
		xAxis = d3.svg.axis().scale(x).orient("top").tickFormat(d3.time.format('%b %d')).tickSubdivide(false)
			.tickSize(8).tickPadding(8);
		yAxis = d3.svg.axis().scale(y).orient("left").ticks(10).tickSize(0);
    };


    var initTimeDomain = function(tasks) {
		if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
		    if (tasks === undefined || tasks.length < 1) {
				timeDomainStart = d3.time.day.offset(new Date(), -3);
				timeDomainEnd = d3.time.hour.offset(new Date(), +3);
				return;
		    }
		    tasks.sort(function(a, b) {
				return a.endDate - b.endDate;
		    });
		    console.info("timeDomainEnd:",tasks[0].startTime);
		    timeDomainEnd = tasks[tasks.length - 1].endTime;
		    tasks.sort(function(a, b) {
				return a.startTime - b.startTime;
		    });
		    console.info("timeDomainStart:",tasks[0].startTime);
		    timeDomainStart = tasks[0].startTime;
		}
    };

    function gantt() {

		initTimeDomain(__tasks);
		initAxis();
		var svg = d3.select("body")
		.append("svg")
		.attr("class", "chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
	    .attr("class", "gantt-chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

	     svg.selectAll(".chart")
		 .data(__tasks, keyFunction).enter()
		 .append("rect")
		 .attr("rx", 5)
	     .attr("ry", 5)
		 .attr("class", function(d){
		     if(taskStatus[d.status] == null){ return "bar";}
		     	return taskStatus[d.status];
		     })
		 .attr("y", 20)
		 .attr("title",function(d) {return d.desc})
		 .attr("transform", rectTransform)
		 .attr("height", function(d) { return y.rangeBand()/2; })
		 .attr("width", function(d) {
		     return (x(d.endTime) - x(d.startTime));
		 });


		 svg.append("g")
		 .attr("class", "x axis")
		 .attr("transform", "translate(0,20)")//0, " + (height - margin.top - margin.bottom) + "
		 .transition()
		 .call(xAxis);

         //draw the y axis, no scale
		 svg.append("g").attr("class", "y axis").attr("transform", "translate(0,20)")
		 .append("line")
		 .attr("x1",0)
		 .attr("y1",0)
		 .attr("x2",0)
		 .attr("y2",height - margin.top - margin.bottom)
		 .style("stroke", "#444");
		 //svg.append("g").attr("class", "y axis").attr("transform", "translate(0,20)").transition().call(yAxis);


		 //draw the task owner list
		 var ownerlist=svg.append("g").attr("class", "ownerlist").attr("transform", "translate(-50,0)")
		 console.info(__persons);
		 ownerlist.selectAll(".owner").data(__persons).enter()
		 .append("g").attr("class", "owner").attr("transform",function(d){
		 	//debugger;
		 	var height=config.height - margin.top - margin.bottom;
		 	height=height/6*d.vscale-50;
		 	 return "translate(0,"+height+")";
		 })
		 .append("image")
		 .attr("xlink:href","59720_80x80.jpeg")
		 .attr("width",50)
		 .attr("height",50)
		 .attr("style","bradius")
		 //console.info(__persons);
		 //.data(__tasks, keyFunction).enter()
		 /*ownerlist.append("g").attr("class","owner").attr("transform", "translate(0,20)")
		 .append("image")
		 .attr("xlink:href","59720_80x80.jpeg")
		 .attr("width",50)
		 .attr("height",50)
		 .attr("style","bradius")*/


		 	// Draw X-axis grid lines
		/*svg.selectAll("line.x")
		  .data(x)
		  .enter().append("line")
		  .attr("class", "x")
		  .attr("x1", x)
		  .attr("x2", x)
		  .attr("y1", 0)
		  .attr("y2", 300)
		  .style("stroke", "#ccc");

		// Draw Y-axis grid lines
		svg.selectAll("line.y")
		  .data(y)
		  .enter().append("line")
		  .attr("class", "y")
		  .attr("x1", 0)
		  .attr("x2", 450)
		  .attr("y1", y)
		  .attr("y2", y)
		  .style("stroke", "#ccc");*/

		var defaultExtent = [[10, 10], [100, 100]];

		var brush = d3.svg.brush()
		.x(x)
		.y(y)
		//.extent([])
		.on("brushstart", function(){})
		.on("brush", brushed)
		.on("brushend", brushended);

		svg.append("g")
		.attr("class", "brush")
		.attr("height","20")
		.call(brush)
		//.call(brush.event);


		function brushed() {
		  /*var extent = brush.extent();
		  point.each(function(d) { d.selected = false; });
		  search(quadtree, extent[0][0], extent[0][1], extent[1][0], extent[1][1]);
		  point.classed("selected", function(d) { return d.selected; });*/
		}

		function brushended() {
			//brush.clear();
			// alert("create task");
			var selExtent = brush.extent();

			var startTime=selExtent[0][0],endTime=selExtent[1][0],y1=selExtent[0][1],y2=selExtent[1][1];

			console.info("startTime:",startTime,"endTime:",endTime,"y1:",y1,"y2:",y2);
			d3.select(this).transition()
			  .duration(brush.empty() ? 0 : 750)
			  .call(brush.extent(defaultExtent));
		}
		return gantt;

    };


 	/**
	* redraw the chart after change the time period or add task etc
 	*/
    gantt.redraw = function(tasks) {
    	return;
		initTimeDomain(__tasks);
		initAxis();

        var svg = d3.select("svg");

        var ganttChartGroup = svg.select(".gantt-chart");
        var rect = ganttChartGroup.selectAll("rect").data(__tasks, keyFunction);

        rect.enter()
         .insert("rect",":first-child")
         .attr("rx", 5)
         .attr("ry", 5)
	     .attr("class", function(d){
	     if(taskStatus[d.status] == null){ return "bar";}
	     	return taskStatus[d.status];
	     })
		 .transition()
		 .attr("y", 20)
		 .attr("transform", rectTransform)
		 .attr("height", function(d) { return y.rangeBand()/2; })
		 .attr("width", function(d) {
		     return (x(d.endDate) - x(d.startDate));
		     });

	     rect.transition()
	     .attr("transform", rectTransform)
		 .attr("height", function(d) { return y.rangeBand()/2; })
		 .attr("width", function(d) {
		     return (x(d.endDate) - x(d.startDate));
		 });

		rect.exit().remove();

		svg.select(".x").transition().call(xAxis);
		svg.select(".y").transition().call(yAxis);

		return gantt;
    };

    gantt.margin = function(value) {
		if (!arguments.length)
		    return margin;
		margin = value;
		return gantt;
    };

    gantt.timeDomain = function(value) {
		if (!arguments.length)
		    return [ timeDomainStart, timeDomainEnd ];
		timeDomainStart = +value[0], timeDomainEnd = +value[1];
		return gantt;
    };

    /**
     * @param {string}
     *                vale The value can be "fit" - the domain fits the data or
     *                "fixed" - fixed domain.
     */
    gantt.timeDomainMode = function(value) {
		if (!arguments.length)
		    return timeDomainMode;
	        timeDomainMode = value;
	        return gantt;

    };

    gantt.taskTypes = function(value) {
		if (!arguments.length)
		    return taskTypes;
		taskTypes = value;
		return gantt;
    };

    gantt.taskStatus = function(value) {
		if (!arguments.length)
		    return taskStatus;
		taskStatus = value;
		return gantt;
    };

    gantt.width = function(value) {
		if (!arguments.length)
		    return width;
		width = +value;
		return gantt;
    };

    gantt.height = function(value) {
		if (!arguments.length)
		    return height;
		height = +value;
		return gantt;
    };

    gantt.tickFormat = function(value) {
		if (!arguments.length)
		    return tickFormat;
		tickFormat = value;
		return gantt;
    };

    gantt.setContainer=function(ddom) {

    };

    /**
	* parse the data for gantt chart
    */
    gantt.procssData=function(data) {
    	var _data=data.items;
    	__tasks=[];
		_data.forEach(function(v, index) {
			var originalyscale=__yscale;
			var r=v,rystack=[];//rystack will store the endTime for each y scare of one person's task
			r.items.forEach(function(v,index) {
				var task=v;
    			task.ownerId=r.id;
    			task.ownerName=r.name;

				 var hasPlaced=false;
				 rystack.forEach(function(v,index) {
				 	if(task.endTime>v) {
				 		hasPlaced=true;
				 		__yscale++;
				 		task.y=__yscale*10;
				 		return false;
				 	}
				 });

				 if(!hasPlaced) {
				 	rystack.push(task.endTime);
				 	__yscale++;
				    task.y=__yscale*10;
				 }
				 __tasks.push(task);
			});
			//v.yscale=__yscale-originalyscale;
			__persons.push({id:v.id,name:v.name,"taskNumbers":v.items.length,"vscale":originalyscale+1});
		});

    	console.log(" total person number:",_data.length);
    		//every person, use use new y scale

    	return gantt;

    };



    return gantt;
};
