/*
 * The MIT License

Copyright (c) 2010, 2011, 2012, 2013 by Juergen Marsch
Copyright (c) 2015 by Stefan Siegl
Copyright (c) 2015 by Alexander Wunschik

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
(function($) {
	"use strict";

	var pluginName = "bubbles";
	var pluginVersion = "0.4.1";

	var options = {
		series: {
			bubbles: {
				active: false,
				show: false,
				fill: true,
				lineWidth: 2,
				highlight: {
					opacity: 0.5
				},
				drawbubble: drawbubbleDefault,
				bubblelabel: {
					show: false,
					fillStyle: "black"
				}
			}
		}
	};

	var defaultOptions = {
		series: {
			editMode: 'xy', //could be "none", "x", "y", "xy", "v"
			nearBy: {
				distance: 6,
				findMode: "circle"
			}
		}
	};

	function drawbubbleDefault(ctx, serie, x, y, v, r, c, overlay) {
		ctx.fillStyle = c;
		ctx.strokeStyle = c;
		ctx.lineWidth = serie.bubbles.lineWidth;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2, true);
		ctx.closePath();
		if (serie.bubbles.fill) {
			ctx.fill();
		} else {
			ctx.stroke();
		}
		if (serie.bubbles.bubblelabel.show) {
			drawbubbleLabel(ctx, serie, x, y, v);
		}
		// based on a patch from Nikola Milikic
		function drawbubbleLabel(ctx, serie, x, y, v) {
			var xtext, ytext, vsize, f;
			ctx.fillStyle = serie.bubbles.bubblelabel.fillStyle;
			f = serie.xaxis.font;
			vsize = ctx.measureText(v);
			xtext = x - vsize.width / 2;
			ytext = y + 4;
			ctx.fillText(v, xtext, ytext);
		}
	};

	function extendEmpty(org, ext) {
		for (var i in ext) {
			if (!org[i]) {
				org[i] = ext[i];
			} else {
				if (typeof ext[i] === "object") {
					extendEmpty(org[i], ext[i]);
				}
			}
		}
	};

	function init(plot) {
		var offset = null;
		var opt = null;
		var series = null;
		var eventHolder = null;

		plot.hooks.processOptions.push(processOptions);
		plot.hooks.bindEvents.push(bindEvents);

		function processOptions(plot, options) {
			if (options.series.bubbles.active) {
				extendEmpty(options, defaultOptions);
				opt = options;
				plot.hooks.drawSeries.push(drawSeries);
			}
		};

		function bindEvents(plot, eHolder) {
			eventHolder = eHolder;
			var options = plot.getOptions();
			if (options.series.bubbles && options.grid.hoverable) {
				eventHolder.unbind('mousemove').mousemove(onMouseMove);
			}

			if (options.series.bubbles && options.grid.clickable) {
				eventHolder.unbind('click').click(onClick);
			}
		};

		function onMouseMove(event) {
			triggerEvent("plothover", event, function(s) {
				return s["hoverable"] != false;
			});
		};

		function onClick(event) {
			triggerEvent("plotclick", event, function(s) {
				return s["clickable"] != false;
			});
		};

		function triggerEvent(eventname, event, seriesFilter) {
			var offset = eventHolder.offset();
			var canvasX = event.pageX - offset.left - plot.getPlotOffset().left;
			var canvasY = event.pageY - offset.top - plot.getPlotOffset().top;
			var pos = plot.c2p({
				left: canvasX,
				top: canvasY
			});
			var item = findNearbyItem(canvasX, canvasY, seriesFilter);

			pos.pageX = event.pageX;
			pos.pageY = event.pageY;

			if (item) {
				item.pageX = parseInt(item.series.xaxis.p2c(item.datapoint[0]) + offset.left + plot.getPlotOffset().left);
				item.pageY = parseInt(item.series.yaxis.p2c(item.datapoint[1]) + offset.top + plot.getPlotOffset().top);
			}

			plot.getPlaceholder().trigger(eventname, [pos, item]);
		};

		function findNearbyItem(mouseX, mouseY, seriesFilter) {
			var item = null;
			var iSeries;
			var iPoints;

			var series = plot.getData();
			for (iSeries = series.length - 1; iSeries >= 0; --iSeries) {
				if (!seriesFilter(series[iSeries])) {
					continue;
				}

				var s = series[iSeries];
				var axisx = s.xaxis;
				var axisy = s.yaxis;
				var points = s.datapoints.points;
				var pointsize = s.datapoints.pointsize;
				var mx = axisx.c2p(mouseX);
				var my = axisy.c2p(mouseY);

				if (s.bubbles.show) {
					for (iPoints = 0; iPoints < points.length; iPoints += pointsize) {
						var x = points[iPoints];
						var y = points[iPoints + 1];
						if (typeof x != 'number' || typeof y != 'number') {
							continue;
						}

						var newmaxDistance = radiusAtPoint(s, [x, y]) || 0;
						var newSmallDist = newmaxDistance * newmaxDistance + 1;
						var maxx = newmaxDistance / axisx.scale;
						var maxy = newmaxDistance / axisy.scale;

						if (x - mx > maxx || x - mx < -maxx ||
							y - my > maxy || y - my < -maxy) {
							continue;
						}

						var dx = Math.abs(axisx.p2c(x) - mouseX);
						var dy = Math.abs(axisy.p2c(y) - mouseY);
						var dist = dx * dx + dy * dy;

						if (dist < newSmallDist) {
							newSmallDist = dist;
							item = [iSeries, iPoints / pointsize];
						}
					}
				}
			}

			if (item) {
				iSeries = item[0];
				iPoints = item[1];
				var pointsize = series[iSeries].datapoints.pointsize;

				return {
					datapoint: series[iSeries].datapoints.points.slice(iPoints * pointsize, (iPoints + 1) * pointsize),
					dataIndex: iPoints,
					series: series[iSeries],
					seriesIndex: iSeries
				};
			}

			return null;
		};

		function radiusAtPoint(series, point) {
			var points = series.datapoints.points;
			var pointsize = series.datapoints.pointsize;

			for (var iPoints = points.length; iPoints > 1; iPoints -= pointsize) {
				var x = points[iPoints - 2];
				var y = points[iPoints - 1];
				if (point[0] == x && point[1] == y) {
					var radius_index = (iPoints - 2) / pointsize;
					return parseInt(series.yaxis.scale * series.data[radius_index][2] / 2, 0);
				}
			}
			return 0;
		};

		function drawSeries(plot, ctx, series) {
			if (series.bubbles.show) {
				offset = plot.getPlotOffset();
				for (var iPoints = 0; iPoints < series.data.length; iPoints++) {
					drawbubble(ctx, series, series.data[iPoints], series.color);
				}
			}
		};

		function drawbubble(ctx, series, data, c, overlay) {
			var x = offset.left + series.xaxis.p2c(data[0]);
			var y = offset.top + series.yaxis.p2c(data[1]);
			var v = data[2];
			var r = parseInt(series.yaxis.scale * data[2] / 2, 0);
			if (typeof c === 'function') {
				c = c.apply(this, data);
			}
			series.bubbles.drawbubble(ctx, series, x, y, v, r, c, overlay);
		}

	};

	$.plot.plugins.push({
		init: init,
		options: options,
		name: pluginName,
		version: pluginVersion
	});
})(jQuery);