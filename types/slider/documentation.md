# Documentation for **slider**

A **slider** is a control made up of 2 parts: the **handle** and the **track**.
The **track** is often in the shape of a straight strip, on which the **handle** is placed.
The position of the **handle** relative to the **track** represents the value of the **slider**.

The two ends of the **track** are the most extreme positions the **handle** can reach, thus representing the two extremums of the **slider**.
As the **handle** moves along the **track**, its value grows linearly in respect to the movement.

You can control the granularity of the value by specifying the step length, which is the least amount the value can grow at a single time.
Note that all possible growth is guaranteed to be a multiple of the step length if it's specified.

## Interaction

Users can interact with the **slider** by dragging the **handle**, clicking on the **track** or pressing the arrow keys while the focus is on the **handle**.

Developers can interact through JavaScript APIs, which will be discussed below.

## HTML

To add a **slider** to the page, simply attach `type="slider"` as an attribute to a `<con-trol>` element.
Here's an example of it:

```html
<con-trol type="slider"
	max="5" min="-5" step="1" value="0"
></con-trol>
```

As shown above, despite the attribute `type`, it also has some extra attributes.
These attributes specify the behaviour of the **slider**.

- `max`: Specifies the maximum limit of a **slider**.
- `min`: Specifies the minimum limit of a **slider**.
- `step`: Specifies the step length of a **slider**. Assign with `0` to get a continuous growth.
- `value`: Specifies the initial value of a **slider**.

## CSS

Unlike the native `<input type="range">`, the visual appearance of a **slider** can be highly custom-defined.
There are many CSS variables available for developers to work with.
Here is a list of them:

- `--width`: Controls the horizontal size of the **slider**.
- `--height`: Controls the vertical size of the **slider**.
- `--track-length`: Controls the length of the **track** along its axis.
- `--track-width`: Controls the thickness of the **track**.
- `--track-padding-ratio`: Controls the horizontal padding of the **track**, in respect of the height of which.
- `--track-border-width`: Controls the thickness of the border of the **track**.
- `--track-border-color`: Controls the color of the border of the **track**.
- `--track-radius-ratio`: Controls the roundness of the end of the **track**. (If set to `1`, the end of which would be rendered as a semicircle.)
- `--track-background`: Controls the background of the **track**.
- `--handle-width`: Controls the horizontal size of the **handle**.
- `--handle-height`: Controls the vertical size of the **handle**.
- `--handle-border-width`: Controls the thickness of the border of the **handle**.
- `--handle-border-color`: Controls the color of the border of the **handle**.
- `--handle-radius-ratio`: Controls the roundness of the **handle**.
- `--handle-background`: Controls the background of the **handle**.

## JavaScript

Many APIs are implemented for developers to interact with and manipulate a **slider** through JavaScript.

### Attribute accessors

Use accessors instead of directly modify the attributes of a **slider** because they are designed to do necessary underlying works when modifying the attributes.

- `.max`: Get/set the maximum limit of a **slider**.
- `.min`: Get/set the minimum limit of a **slider**.
- `.step`: Get/set the step length of a **slider**.
- `.value`: Get/set the value of a **slider**. Setting the value would cause the visual appearance to be automatically updated.

### Event listeners

Different types of events would be fired at different stages when interacting with a **slider**.
You can attach event listeners in order to capture them.
Here is a list of the types and their description:

- `start`: Fired when the value starts to change.
- `change`: Fired when the value is changed.
- `slide`: Kept Firing when user is changing the value continuously.
- `jump`: Fired when set to a specific value.
- `set`: Fired when the value stops changing.

Notes:

- `start` is fired before the value changes, whilst others are all fired afterwards.
- `change` is always fired before `slide` and `jump`.
- Dragging the **handle** would fire a `start` event, followed by a series of `change` and `slide` events, and finally a `set` event.
- Clicking on the **track** or setting the value through JavaScript are both considered as discontinuous, thus would fire a `start` event, followed by a `change` and a `jump` event, and finally a `set` event.
- Manipulating the slider by the arrow keys on the keyboard is considered as both continuous and discontinuous (since one can either press the key or hold the key down), thus would fire a `start` event, followed by a series of `change`, `jump` and `slide` events, and finally a `set` event.