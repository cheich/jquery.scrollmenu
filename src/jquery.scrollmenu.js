
'use strict';

(function($, document, history, location) {

  /**
   * Element
   * @type {jQuery Object}
   */
  var elem;

  /**
   * Stored data
   * @type {Object}
   */
  var data;

  /**
   * Options
   * @type {Object}
   */
  var opts = {};

  /**
   * Current deep index.
   * @type {Integer}
   */
  var deepIndex = 0;

  /**
   * Counter for generating unique IDs - increased by one if ID exists.
   * @type {Integer}
   */
  var uniqueId = 0;

  /**
   * Whole menu.
   * @type {jQuery Object}
   */
  var menu;

  /**
   * Set to 'true' while jumping to a header.
   * @type {boolean}
   */
  var isJumping = false;

  ////////////////////////
  // Private functions  //
  ////////////////////////

  /**
   * Initialization
   * @param {object} settings - Options that should overwrite the defaults.
   */
  var init = function(settings) {
    opts = $.extend(true, {}, $.fn.scrollmenu.defaults, settings);

    // Find all first level items
    var items = $(elem.find(opts.start).not(opts.disableHeaderSelector));
    menu = build(items).addClass(opts.menuClass);

    // Bind onScroll event
    $(window).scroll(function() {
      onScroll();
    });

    $(document).ready(function() {
      if (location.hash) {
        jumpTo(location.hash.substr(1), 0);
      }
      setClasses();
    });

    // Bind jumpTo event to menu anchors
    menu.find('a').click(function(e) {
      e.preventDefault();
      jumpTo(this.hash.substr(1), opts.jumpSpeed);
    });

    // Bind options to container element
    elem.data('scrollmenu', {
      options: opts,
      menu: menu,
    });
  };

  /**
   * Build list recursively
   * @param {jQuery object} items - All headers in this level.
   * @return {jQuery object} Unordered list
   */
  var build = function(items) {
    var menu = $('<ul />');

    // Current items
    items.each(function(i, item) {
      item = buildAnchor($(item));
      var li = $('<li />');
      li.append(buildReference($(item)));

      if (deepIndex < opts.depth) {
        // Deep selector
        var deepSelector = opts.start.replace(/\d+/, function(str) {
          return parseInt(str) + deepIndex + 1;
        });

        // Deep items
        var deepItems = item.nextUntil(item[0].tagName, deepSelector).not(opts.disableHeaderSelector);
        if (deepItems.length > 0) {
          deepIndex++;
          li.append(build(deepItems));
          deepIndex--;
        }
      }

      menu.append(li);
    });

    return menu;
  };

  /**
   * Build an `<a>` element from an item.
   * @param {jQuery object} item
   * @return {jQuery object}
   */
  var buildReference = function(item) {
    var a = $('<a />');
    uniqueId = 0;

    a.text(item.text());
    a.attr('href', '#' + item.attr('id'));

    return a;
  };

  /**
   * Build an anchor (ID) for the current item.
   * @param {jQuery object} item
   * @return {jQuery object}
   */
  var buildAnchor = function(item) {
    var id = item.attr('id');

    // Generate a new ID, if not exists
    if (typeof id === 'undefined') {
      id = item.text().replace(/(\s+)|(#+)/g, function(str, p1, p2) {
        if (p1) return '-'; // Replace spaces
        if (p2) return ''; // Replace '#'
      }).toLowerCase();
      item.data('scrollmenu', { generatedId: id });
    }

    // Make it unique, if necessary
    // The `[id="' + id + '"]` selector is the only way to check for
    // duplicated IDs
    if (!id || $('[id="' + id + '"]').length > 1) {
      var data = { oldId: id };

      id = generateUniqueId(id + '-');

      data.generatedId = id;
      item.data('scrollmenu', data);
    }

    item.attr('id', id);
    return item;
  };

  /**
   * Generate a new unique id
   * @param {String} prefix
   * @param {String} suffix
   * @return {String}
   */
  var generateUniqueId = function(prefix, suffix) {
    prefix = (typeof prefix !== 'undefined') ? prefix : '';
    suffix = (typeof suffix !== 'undefined') ? suffix : '';
    uniqueId++;

    var id = prefix + uniqueId + suffix;
    if ($(document.getElementById(id)).length) {
      return generateUniqueId(prefix, suffix);
    }
    return id;
  };

  /**
   * Get current ID
   * @param {jQuery object}
   */
  var getCurrent = function() {
    var current = false;

    // Loop through all IDs, filtered by headers
    $('[id]').filter(':header').each(function() {
      var offsetActive = $(window).scrollTop() + opts.offsetActive;
      if ($(this).offset().top <= offsetActive) {
        if ($(this).nextAll('[id]').length === 0 || $(this).nextAll('[id]').offset().top > offsetActive) {
          current = $(this).attr('id');
          return false;
        }
      }
    });

    return current;
  };

  /**
   * Bind scroll event
   */
  var onScroll = function() {
    // Toggle classes while scrolling (special on jumping)
    if (!(!opts.toggleWhileJumping && isJumping)) {
      setClasses();
    }
  };

  /**
   * Set and reset all classes as required
   */
  var setClasses = function() {
    var current = getCurrent();

    // Find active `<li>`.
    var activeLi = menu.find('li a').filter(function() {
      return $(this).attr('href') == '#' + current;
    }).parent();

    // Add `.active` class to current.
    activeLi.addClass(opts.activeClass);

    // Add `.active` class to parent.
    var parent = activeLi.parents('li').addClass(opts.parentClass);

    // First, remove all `.active` classes.
    activeLi.add(parent).siblings().removeClass(opts.activeClass);
  };

  /**
   * Jump to a heading
   * @param {string} id - The ID to jump to
   * @param {integer} Scroll speed
   */
  var jumpTo = function(id, speed) {
    var current = getCurrent();
    isJumping = true;
    opts.onJumpBefore.apply(this, [id, current]);
    var scrollTop = $(document.getElementById(id)).offset().top - opts.offsetScroll;

    $('html, body').animate({
      scrollTop: scrollTop,
    }, speed, function() {
      if (!opts.toggleWhileJumping) {
        setClasses();
      }
      isJumping = false;
      opts.onJumpAfter.apply(this, [id, current]);
    });

    // Add to history
    if (!!(history && history.pushState) && opts.pushToHistory) {
      history.pushState({}, document.title, location.pathname + '#' + id);
    }
  };

  ////////////////////
  // Public Methods //
  ////////////////////

  var methods = {

    /**
     * Refresh
     * @param {object} settings - New settings
     */
    refresh: function(settings) {
      // Reset all
      methods.destroy();

      // Start new
      if (typeof settings === 'undefined') {
        settings = opts;
      }
      init(settings);
    },

    /**
     * Destroyer
     * Remove all data, classes and inserted elements.
     */
    destroy: function() {
      // Get all headers, filter by data.scrollmenu
      $(':header').filter(function() {
        return !!$(this).data('scrollmenu');
      }).each(function() {
        var data = $(this).data('scrollmenu');

        // Reset old ID, if set (and no new one is set)
        if (('generatedId' in data) && data.generatedId == $(this).attr('id')) {
          if ('oldId' in data) {
            $(this).attr('id', data.oldId);
          }else{
            $(this).removeAttr('id');
          }
        }
      });

      // Remove inserted menu
      menu.remove();
    },

    /**
     * Get the built menu
     * @return {jQuery Object} Unordered list
     */
    get: function() {
      return menu;
    }
  };

  /////////////
  // Plugin  //
  /////////////

  $.fn.scrollmenu = function() {
    elem = $(this);

    if (typeof elem.data('scrollmenu') === 'undefined') {
      // Init
      init.apply(this, arguments);
      elem.data('scrollmenu', data);
    }else{
      // Find methods
      if (arguments[0] in methods) {
        data = elem.data('scrollmenu');
        opts = data.options;
        menu = data.menu;

        return methods[arguments[0]].apply(this, Array.prototype.slice.call(arguments, 1));
      }
    }

    return elem;
  };

  /////////////////////
  // Default Options //
  /////////////////////

  $.fn.scrollmenu.defaults = {
    start:                  'h2',           // Start at this header.
    depth:                  2,              // Depth from `start` point; 0 for disabling depth selectors.
    jumpSpeed:              400,            // Scroll speed when click on a menu item; 0 for disabling.
    offsetScroll:           0,              // Amount of pixels from the window top.
    offsetActive:           0,              // Active item offset. Will set the active class on the menu earlier the higher it is.
    toggleWhileJumping:     false,          // Toggle classes while jumping (scrolling) to a header.
    disableHeaderSelector:  '[disabled]',   // Selector to disable a header. Will be used within the `:not()` function.
    activeClass:            'active',       // Class name for current list item.
    parentClass:            'active',       // Class name for parent list item of the current item.
    menuClass:              'menu',         // Class name for the root list.
    pushToHistory:          true,           // Add to browser history (IE>9 required).

    onJumpBefore:           function() {},  // Fired before jumping to a header.
    onJumpAfter:            function() {},  // Fired after jumping to a header.
  };
}(jQuery, window.document, window.history, window.location));
