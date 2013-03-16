
# maximize

  This is a simple component to set an element to maximal width or height.
  By calling the listen() method, its size will be changed dynamically.


## Installation

    $ component install luka5/maximize

## Examples

    maximize(el)
      .both()
      .listen(); // => maximizes the element and listens on the window.resize event
    maximize(el, [30,20], 100)
      .both(); // maximizes the element with minimum width/height 100px and expected ``width = 100%-30px`` and ``height = 100%-20px``.
    maximize(el, 20)
      .height()
      .listen(); //maximizes the element with 100%-20px height and listens on resize.

## API

#### maximize(el, [offset, minimum])
  Returns a new instance of ``Maximize``.
  ``el`` can be a element or a query string.
  ``offset`` is discount to the browsers size and can be an array with width and height or a single value.
  ``minimum`` is the minimum size of the element. It can also be an array.

#### Maximize#both()
  Maximizes the width and height of the instance.

#### Maximize#width()
  Maximizes the width of the instance.

#### Maximize#height()
  Maximizes the height of the instance.

#### Maximize#...()#listen()
  Registers the maximize instance to the browsers resize event.


## License

  MIT
