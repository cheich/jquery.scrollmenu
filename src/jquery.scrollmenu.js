/*!
 * jquery.scrollmenu.js v0.4 - 2015-10-31
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
         * @type {Integer}
         */
        var index = 0;
        var deepIndex = 0;

        /**
         * @type {jQuery Object}
         */
        var ul;

        /**
         * ==========================================================
         * = Private functions
         * ==========================================================
         */

        /**
         * Initialization
         * @param {object} settings - Options that should overwrite the defaults
         */
        var init = function(settings) {
            opts = $.extend(true, {}, $.fn.scrollmenu.defaults, settings);
            elem.data('scrollmenu', opts);

            // Find all first level items
            var items = $(elem.find(opts.start));
            ul = build(items).addClass(opts.ulClass);
            
            // Bind onScroll event
            $(document).scroll(function() {
                onScroll();
            });
            
            // Bind scrollTo event
            if (opts.speed) {
                scrollTo();
            }
            
            // Bin options to container element
            elem.data('scrollmenu', {
                options: opts,
                menu: ul,
            });
        };

        /**
         * Build list recursively
         * @param {jQuery object} items - All headers in this level
         * @return {jQuery object} Unordered list
         */
        var build = function(items) {
            var ul = $('<ul />');

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
                    var deepItems = item.nextUntil(item[0].tagName, deepSelector);
                    if (deepItems.length > 0) {
                        deepIndex++;
                        li.append(build(deepItems));
                        deepIndex--;
                    }
                }

                ul.append(li);
            });

            return ul;
        };

        /**
         * Build an `<a>` element from an item
         * @param {jQuery object} item
         * @return {jQuery object}
         */
        var buildReference = function(item) {
            var a = $('<a />');
            
            a.text(item.text());
            a.attr('href', '#' + item.attr('id'));

            return a;
        }

        /**
         * Build an anchor on the current item
         * @param {jQuery object} item         
         * @return {jQuery object}         
         */
        var buildAnchor = function(item) {
            var id = item.attr('id');
            
            // Generate a new ID, if not exists
            if (typeof id == 'undefined') {
                var id = item.text().replace(/(\s+)|([\%#\&\"\']+)/g, function(str, p1, p2) {
                    if (p1) return '-';
                    if (p2) return '';
                }).toLowerCase();
            }

            // Make it unique, if necessary
            if (document.getElementById(id) != null) {
                id = generateUniqueId(id + '-');
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
        var generateUniqueId = function(prefix = '', suffix = '') {
            var id = Math.floor(Math.random() * 26) + Date.now();
            if (document.getElementById(id) != null) {
                return generateUniqueId(prefix, suffix);
            }
            return prefix + id + suffix;
        };
        
        
        /** 
         * ==========================================================
         * = BOF UNDER CONSTRUCTION
         * ==========================================================
         */
        var onScroll = function() {
            ul.find('li').removeClass(opts.activeClass);
            $('[id]').each(function() {
                if ($(this).offset().top <= $(window).scrollTop() + opts.offset) {
                    if ($(this).nextAll('[id]').length == 0 || $(this).nextAll('[id]').offset().top > $(window).scrollTop() + opts.offset) {
                        // Get current element
                        var activeLi = $('ul li a[href="#' + $(this).attr('id') + '"]').parent();
                        
                        // Add `.active` class to current
                        activeLi.addClass(opts.activeClass);
                        
                        // Add `.active` class to parent
                        activeLi.parents('li').addClass(opts.parentClass);
                        
                        return false;
                    }
                }
            });
        };

        /** 
         * ==========================================================
         * = EOF UNDER CONSTRUCTION
         * ==========================================================
         */
        
        /**
         * Scroll to an anchor
         */
        var scrollTo = function() {
            ul.find('a').click(function(e) {
                e.preventDefault();
                var hash = this.hash;
                var offsetTop = $(hash).offset().top;            
                
                $('html, body').animate({
                    scrollTop: offsetTop,
                }, opts.speed, function() {
                    window.location.hash = hash;
                });
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
             * @param {object} settings - New settings
             */
            refresh: function(settings) {
                return elem;
            },

            /**
             * Destroyer
             * Remove all data, classes and inserted elements
             */
            destroy: function() {
                return elem;
            },

            /**
             * Get the built menu
             * @return {jQuery Object} Unordered list
             */
            get: function() {
                return ul;
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
            ul = data.menu;

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
        start: 'h2',           // Start at this header; can also be a selector, but there have to be an integer that can be increased
        depth: 2,              // Depth from `start`point; 0 for disabled depth
        speed: 400,            // Scroll speed when click on a menu item
        offset: 0,             // Scroll position offset; the higher the earlier is the header selected
        activeClass: 'active', // Class name for current list item
        parentClass: 'active', // Class name for parent list item
        ulClass: 'menu',       // Class name for the root list
    };
}(jQuery));
