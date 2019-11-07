# flot-bubbles
Flot plugin to create bubble charts

## Example

* [Open Demo](http://mojoaxel.github.io/flot-bubbles/example/)
* [Show example source](https://github.com/mojoaxel/flot-bubbles/blob/master/example/index.html)

## Docs

```js
var d1 = [[20,20,10], [40,50,20], [70,10,5], [80,80,15]];
var d2 = [[60,25,15], [70,40,6], [30,80,4]];
var options = { 
	series: {
		//color: '#CCC',
		color: function(x, y, value) {
			var red = 55 + value * 10;
			return 'rgba('+red+',50,50,1)';
		},
		bubbles: {
			active: true,
			show: true,
			fill: true,
			linewidth: 2,
			bubblelabel: { show: true },
			radiusCallback: function(r) { return r/ 2; }
		}
	},
	grid:{
		hoverable: true,
		clickable: true
	}
};
var p4 = $.plot( $("#plot"), [ d1, { color: '#AAA', data: d2 }], options );
```

* **data:** Data Array specific for Bubbles chart
   * **[0]:** first data entry
      * **[0]:** Y-value, location of bubble
      * **[1]:** X-value, location of value
      * **[2]:** Size of bubble

* **options:** options for bubbles
   * **series:** series options for bubbles
   * **bubbles:** bubbles only options
      * **active:** activate the plugin (false)
      * **show:** show specific serie. this needs to be overwritten in data (false)
      * **fill:** Fill bubbles (true)
      * **lineWidth:** Line width of circle if fill is false (2)
      * **highlight:** Used to highlight in case of HOVER
         * **opacity:** only Opacity is supported for Highlighting (yet) (0.5)
         * **show:** enable highlighting on hover (false)
      * **drawbubble:** Function call which is used for drawing of one bar for Bubble. This can be replaced by user defined function. Take a closer look to source of examples to see more. (drawbubbleDefault(ctx,serie,x,y,v,r,c,overlay))
      * **bubblelabel:** Specific options how to show label in bubbles
         * **show:** Switches labels on (or off) (false)
         * **fillStyle:** Color of text (black)
      * **editMode:** Default Editmode for bandwidth. See mouse plugin for more information.
      * **nearBy:** data used to support findItem for hover, click etc.
         * **distance:** distance in pixel to find nearest bubble (6)
         * **findMode:** Defines how find happens. (circle)
         * **findItem:** Function call to find item under Cursor. Is overwritten during processRawData hook. This would be the place to add your own find function, which will not be overwritten. (findNearbyItemDefault(mouseX,mouseY,i,serie))
         * **drawEdit:** function to draw edit marker. It is defined in jquery.flot.mouse plugin, and is overwritten in plugin to support specific editmarkers (drawEditDefault(octx,x,y,serie))
         * **drawHover:** Function to draw overlay in case of hover a item. Is overwritten during processRawData hook. This would be the place to add your own hover drawing function. (drawHoverDefault(octx,serie,dataIndex))
      * **findMode:** Choose between selecting either the most nearby bubble, or the first one that is encountered. (nearby)
      * **radiusCallback:** Callback function that can be used to change the size of the drawn bubble. Useful if you want to put big values into your chart but don't want the bubbles to cover up big parts of the chart

### Options

#### Simple

* **series**
   * **bubbles**
      * **active:** [true] boolean
      * **show:** [true] boolean
      * **fill:** [true] boolean
      * **lineWidth:** [2] number
* **grid**
   * **hoverable:** [true] boolean
   * **clickable:** [true] boolean

#### With Label

* **series**
   * **bubbles**
      * **active** [true] boolean
      * **show** [true] boolean
      * **fill** [true] boolean
      * **linewidth** [2] number
      * **bubblelabel:** object
         * **show** [true] boolean
* **grid**
   * **hoverable** [true] boolean
   * **clickable** [true] boolean

#### Userdefined Drawing

* **series**
   * **bubbles**
      * **active** [true] boolean
      * **show** [true] boolean
      * **fill** [true] boolean
      * **lineWidth** [2] number
      * **drawbubble** function
* **grid**
   * **hoverable** [true] boolean
   * **clickable** [true] boolean

#### Editing

* **series**
   * **bubbles**
      * **active** [true] boolean
      * **show** [true] boolean
      * **linewidth** [2] number
      * **editMode** [xy] string
      * **editable** [true] boolean
* **grid**
   * **hoverable** [true] boolean
   * **clickable** [true] boolean
   * **editable** [true] boolean

#### Radius modification

* **series**
   * **bubbles**
      * **active:** [true] boolean
      * **show:** [true] boolean
      * **fill:** [true] boolean
      * **lineWidth:** [2] number
      * **radiusCallback:** function
* **grid**
   * **hoverable:** [true] boolean
   * **clickable:** [true] boolean

## License

Licensed under [MIT](http://opensource.org/licenses/MIT)

This plugin is based on a [plugin](https://github.com/jumjum123/JUMFlot/blob/gh-pages/javascripts/jquery.flot.bubbles.js) by [Juergen Marsch](https://github.com/jumjum123)

## Versions

### 0.3.0
* first release of Juergen Marsch's original code

### 0.3.1
* removed dependency to JUMlib

### 0.3.2
* code cleanup

### 0.3.3
* `series.color` can be of type `function` (thx @stesie)

### 0.4.0
* support 'plothover' events; (issue #2)
* support the `jquery.flot.tooltip` plugin
* code cleanup

### 0.4.1
* bugfix if x or y == 0; (issue #2)

### 0.4.2
* bugfix: only load plugin if options.series.bubbles.active is set; (issue #3)

### 0.4.3
* bugfix: highlight bubbles on hover; (issues #5, #6)

### 0.4.4
* added `radiusCallback`
