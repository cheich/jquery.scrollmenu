# jQuery Scrollmenu
There is no easier way to build a menu as with _jQuery Scrollmenu_.
It will automatically walk through your headings and build anchors and IDs.

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

Default: `0`

Type: `Integer`

### `offset`
Scroll position offset; the higher the earlier is the header selected.

Default: `0`

Type: `Integer`

### `toggleWhileJumping`
Toggle classes while jumping (scrolling) to a header.

Default: `false`

Type: `Boolean`

### `disableHeaderSelector`
Selector to disable a header. Will be used within the `:not()` function.

Default: `'[data-disable="true"]'`

Type: `jQuery selector`

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

## Release Notes
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
