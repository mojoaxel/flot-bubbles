# flot-bubbles
Flot Charting Library Plugin create Bubble-Charts  http://mojoaxel.github.io/flot-bubbles

## Interactive Example

* [Open Demo](./example/)
* [Show example source](https://github.com/mojoaxel/flot-bubbles/blob/master/example/index.html)

## Docs

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

## License

Licensed under [MIT](http://opensource.org/licenses/MIT)

## Versions

### 0.3.0
* first release of Juergen Marsch's original code

### 0.3.1
* removed dependency to JUMlib
