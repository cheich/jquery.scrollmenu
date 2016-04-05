# jQuery Scrollmenu
There is no easier way to build a menu as with _jQuery Scrollmenu_.
It will automatically walk through your headings and build anchors and IDs.

## To-do
- First and last element are active even the viewport is out of the content
- Add option to parse existing menu lists
- Return jQuery list instead of the plug-in object (?)
- Make variable header selector like `h{n}` (?)

## How to start
### Insert the JavaScript file
Just insert the JavaScript after the jQuery library

```html
<script type="text/javascript" src="path/to/jquery.scrollmenu.js"></script>
```

### Call the plug-in
Simple call the plug-in after your container selector and insert the menu
wherever you want:

```javascript
(function($) {
  $(document).ready(function() {
    var menu = $('body').scrollmenu(/* options */);
    $('#nav').append(menu.scrollmenu('get'));
  });
}(jQuery));
```

### Style it
There is no style included by default.
If you want to hide all second-level sub-menus you can use this snippet:

```scss
ul.menu {
  ul {
    display: none;
  }   

  li.active {
    > ul {
      display: block !important;
    }
  }
}
```

Or if you just use CSS:

```css
ul.menu ul {
  display: none;
}   

ul.menu li.active > ul {
  display: block !important;
}
```

## Options
### `start`
Start at this header.

Default: `'h2'`

Options: `'h1'`, `'h2'`, `'h3'`, `'h4'`, `'h5'`, `'h6'`

Type: `jQuery selector`

### `depth`
Depth from `start` point; 0 for disabling depth selectors.

Default: `2`

Type: `Integer`

### `jumpSpeed`
Scroll speed when click on a menu item; 0 for disabling.

Default: `400`

Type: `Integer`

### `offsetScroll`
Amount of pixels from the window top.

Default: `0`

Type: `Integer`

### `offsetActive`
Active item offset. Will set the active class on the menu earlier the higher it is.

Default: `0`

Type: `Integer`

### `toggleWhileJumping`
Toggle classes while jumping (scrolling) to a header.

Default: `false`

Type: `Boolean`

### `disableHeaderSelector` (DEPRECATED, use `not` instead)

Selector to disable a header. Will be used within the `.not()` function.

Default: `'[disabled]'`

Type: `jQuery selector`

### `not`
Selector or function to disable a header. Will be used within the `.not()` function.

Default: `'[disabled]'`

Type: `jQuery selector|function`

### `activeClass`
Class name for current list item.

Default: `'active'`

Type: `String`

### `parentClass`
Class name for parent list item of the current item.

Default: `'active'`

Type: `String`

### `menuClass`
Class name for the root list.

Default: `'menu'`

Type: `String`

### `pushToHistory`
Add to browser history (IE>9 required).

Default: `true`

Type: `Boolean`

## Callbacks
### `onJumpBefore(newId, oldId)`
Fired before jumping to a header.

### `onJumpAfter(newId, oldId)`
Fired after jumping to a header.

## License
jQuery Scrollmenu is released under the [MIT license](LICENSE)

## Release Notes
### v0.10.2
- Replaced `disableHeaderSelector` with `not`.  
  `disableHeaderSelector` is now marked as deprecated and will be removed
  in the next major release.

### v0.10.1
- Fixed default `jumpSpeed` value in documentation
- Added .jshintrc

### v0.10.0
- Changed default disable selector to `[disabled]`
- Code optimizations
- New approach to set history (IE>9); Set history as opt-out
- Added callbacks
- Better offset (scroll- and active-offset are now separated)
- Active classes now applied after DOM is ready (initial)

### v0.9.2
- Remove debug information

### v0.9.1
- Fixed generating IDs

### v0.9.0
- Add README.md and documentation
- Add LICENSE
- Add Bower and npm

### v0.5.0
- Add refresh and destroy functions
- Add option to not apply classes while scroll to an header
- Add option to disable a header
- Classes are missing after reloading
- Don't set default parameters since it comes with ECMAScript 6

### v0.4.1
- Some bug-fixes

### v0.4
- First pre-release
