/**
 * @license
 * Copyright 2012 Dan Vanderkam (danvdk@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
/*global Dygraph:false */

/*

Current bits of jankiness:
- Direct layout access
- Direct area access

*/

"use strict";

/**
 * Draws the gridlines, i.e. the gray horizontal & vertical lines running the
 * length of the chart.
 *
 * @constructor
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
var grid = function grid() {};

grid.prototype.toString = function () {
  return "Gridline Plugin";
};

grid.prototype.activate = function (g) {
  return {
    willDrawChart: this.willDrawChart
  };
};

grid.prototype.willDrawChart = function (e) {
  // Draw the new X/Y grid. Lines appear crisper when pixels are rounded to
  // half-integers. This prevents them from drawing in two rows/cols.
  var g = e.dygraph;
  var ctx = e.drawingContext;
  var layout = g.layout_;
  var area = e.dygraph.plotter_.area;

  function halfUp(x) {
    return Math.round(x) + 0.5;
  }
  function halfDown(y) {
    return Math.round(y) - 0.5;
  }

  var x, y, i, ticks;
  if (g.getOptionForAxis('drawGrid', 'y')) {
    var axes = ["y", "y2"];
    var strokeStyles = [],
        lineWidths = [],
        drawGrid = [],
        stroking = [],
        strokePattern = [];
    for (var i = 0; i < axes.length; i++) {
      drawGrid[i] = g.getOptionForAxis('drawGrid', axes[i]);
      if (drawGrid[i]) {
        strokeStyles[i] = g.getOptionForAxis('gridLineColor', axes[i]);
        lineWidths[i] = g.getOptionForAxis('gridLineWidth', axes[i]);
        strokePattern[i] = g.getOptionForAxis('gridLinePattern', axes[i]);
        stroking[i] = strokePattern[i] && strokePattern[i].length >= 2;
      }
    }
    ticks = layout.yticks;
    ctx.save();
    // draw grids for the different y axes
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = ticks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var tick = _step.value;

        if (!tick.has_tick) continue;
        var axis = tick.axis;
        if (drawGrid[axis]) {
          ctx.save();
          if (stroking[axis]) {
            if (ctx.setLineDash) ctx.setLineDash(strokePattern[axis]);
          }
          ctx.strokeStyle = strokeStyles[axis];
          ctx.lineWidth = lineWidths[axis];

          x = halfUp(area.x);
          y = halfDown(area.y + tick.pos * area.h);
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + area.w, y);
          ctx.stroke();

          ctx.restore();
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"]) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    ctx.restore();
  }

  // draw grid for x axis
  if (g.getOptionForAxis('drawGrid', 'x')) {
    ticks = layout.xticks;
    ctx.save();
    var strokePattern = g.getOptionForAxis('gridLinePattern', 'x');
    var stroking = strokePattern && strokePattern.length >= 2;
    if (stroking) {
      if (ctx.setLineDash) ctx.setLineDash(strokePattern);
    }
    ctx.strokeStyle = g.getOptionForAxis('gridLineColor', 'x');
    ctx.lineWidth = g.getOptionForAxis('gridLineWidth', 'x');
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = ticks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var tick = _step2.value;

        if (!tick.has_tick) continue;
        x = halfUp(area.x + tick.pos * area.w);
        y = halfDown(area.y + area.h);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, area.y);
        ctx.closePath();
        ctx.stroke();
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
          _iterator2["return"]();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    if (stroking) {
      if (ctx.setLineDash) ctx.setLineDash([]);
    }
    ctx.restore();
  }
};

grid.prototype.destroy = function () {};

exports["default"] = grid;
module.exports = exports["default"];