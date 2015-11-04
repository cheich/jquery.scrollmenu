/*!
 * jquery.scrollmenu.js v0.5.0 - 2015-11-04
 * Copyright 2014 Christoph Heich | ...
 * Released under the MIT license | ...
 */

(function($) {

    $.fn.scrollmenu = function() {

        /**
         * @type {jQuery Object}
         */
        var elem = $(this);

        /**
         * @type {Object}
         */
        var opts = {};

        /**
         * Current index and deep index
         *
         * @type {Integer}
         */
        var index = 0;
        var deepIndex = 0;

        /**
         * @type {jQuery Object}
         */
        var menu;


        /**
         * @type {boolean}
         */
        var isJumpingTo = false;

        /**
         * ==========================================================
         * = Private functions
         * ==========================================================
         */

        /**
         * Initialization
         *
         * @param {object} settings - Options that should overwrite the defaults.
         */
        var init = function(settings) {
            opts = $.extend(true, {}, $.fn.scrollmenu.defaults, settings);
            elem.data('scrollmenu', opts);

            // Find all first level items
            var items = $(elem.find(opts.start).not(opts.disableHeaderSelector));
            menu = build(items).addClass(opts.menuClass);
            
            // Bind onScroll event
            $(window).scroll(function() {
                onScroll();
            });
            
            // Bind jumpTo event to menu anchors
            menu.find('a').click(function(e) {
                e.preventDefault();
                jumpTo(this.hash.substr(1));
            });
            
            // Bind options to container element
            elem.data('scrollmenu', {
                options: opts,
                menu: menu,
            });
        };

        /**
         * Build list recursively
         *
         * @param {jQuery object} items - All headers in this level.
         * @return {jQuery object} Unordered list
         */
        var build = function(items) {
            var menu = $('<ul />');

            // Current items
            items.each(function(index, item) {
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
         *
         * @param {jQuery object} item
         * @return {jQuery object}
         */
        var buildReference = function(item) {
            var a = $('<a />');
            
            a.text(item.text());
            a.attr('href', '#' + item.attr('id'));

            return a;
        };

        /**
         * Build an anchor on the current item.
         *
         * @param {jQuery object} item         
         * @return {jQuery object}         
         */
        var buildAnchor = function(item) {
            var id = item.attr('id');
            
            // Generate a new ID, if not exists
            if (typeof id == 'undefined') {
                var id = item.text().replace(/(\s+)|(#+)/g, function(str, p1, p2) {
                    if (p1) return '-'; // Replace spaces
                    if (p2) return ''; // Replace '#'
                }).toLowerCase();
                item.data('scrollmenu', { generatedId: id });
            }

            // Make it unique, if necessary
            if (!id || $(document.getElementById(id)).length) {
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
         *
         * @param {String} prefix
         * @param {String} suffix
         * @return {String}
         */
        var generateUniqueId = function(prefix, suffix) {
            prefix = typeof prefix !== 'undefined' ? prefix : '';
            suffix = typeof prefix !== 'undefined' ? prefix : '';
        
            var id = Math.floor(Math.random() * 26) + Date.now();
            if ($(document.getElementById(id)).length) {
                return generateUniqueId(prefix, suffix);
            }
            return prefix + id + suffix;
        };
        
        /** 
         * Get current ID 
         * 
         * @param {jQuery object}
         */
        var getCurrent = function() {
            var current = false;

            // Loop through all IDs, filtered by headers
            $('[id]').filter(':header').each(function() {
                if ($(this).offset().top <= $(window).scrollTop() + opts.offset) {
                    if ($(this).nextAll('[id]').length == 0 || $(this).nextAll('[id]').offset().top > $(window).scrollTop() + opts.offset) {                    
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
            if (!(!opts.toggleWhileJumping && isJumpingTo)) {
                toggleClasses();
            }
        };
        
        /**
         * Toggle all classes
         */
        var toggleClasses = function() {
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
         *
         * @param {string} id - The ID to jump to
         * @param {integer} Scroll speed
         */
        var jumpTo = function(id, speed) {
            speed = typeof speed !== 'undefined' ? speed : opts.jumpSpeed;
            
            isJumpingTo = true;
            var offsetTop = $(document.getElementById(id)).offset().top;
            
            $('html, body').animate({
                scrollTop: offsetTop,
            }, speed, function() {            
                // Set location.hash value after animations
                window.location.hash = id;
                
                if (!opts.toggleWhileJumping) {
                    toggleClasses();                    
                }
                
                isJumpingTo = false;
            });
        };

        /** 
         * ==========================================================
         * = Public Methods
         * ==========================================================
         */
        var methods = {

            /**
             * Refresh
             *
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
             *
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
             *
             * @return {jQuery Object} Unordered list
             */
            get: function() {
                return menu;
            }
        };

        /**
         * ==========================================================
         * = Plugin
         * ==========================================================
         */
        
        if (typeof elem.data('scrollmenu') === 'undefined') {
            // Init
            init.apply(this, arguments);
        }else{
            // Retrieve data
            data = elem.data('scrollmenu');
            opts = data.options;
            menu = data.menu;

            // Find methods
            if (arguments[0] in methods) {
                return methods[arguments[0]].apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }

        return elem;
    };

    /**
     * ==========================================================
     * = Default Options
     * ==========================================================
     */
    $.fn.scrollmenu.defaults = {
        start:                  'h2',                       // Start at this header.
        depth:                  2,                          // Depth from `start` point; 0 for disabling depth selectors.
        jumpSpeed:              400,                        // Scroll speed when click on a menu item; 0 for disabling.
        offset:                 0,                          // Scroll position offset; the higher the earlier is the header selected.
        toggleWhileJumping:     false,                      // Toggle classes while jumping (scrolling) to a header.
        disableHeaderSelector:  '[data-disable="true"]',    // Selector to disable a header. Will used in `:not()` function  
        activeClass:            'active',                   // Class name for current list item.
        parentClass:            'active',                   // Class name for parent list item of the current item.
        menuClass:              'menu',                     // Class name for the root list.
    };
}(jQuery));
