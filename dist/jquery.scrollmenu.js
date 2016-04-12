/*!
 * jQuery Scrollmenu v0.10.3 <https://github.com/cheich/jquery.scrollmenu>
 * Copyright 2014-2016 Christoph Heich <http://christoph-heich.de>
 * Released under the MIT license <https://github.com/cheich/jquery.scrollmenu/blob/master/LICENSE>
 */
"use strict";!function(t,e,n,r){var a,i,o,s={},l=0,d=0,u=!1,f=function(n){s=t.extend(!0,{},t.fn.scrollmenu.defaults,n);var i=t(a.find(s.start).not(s.not).not(s.disableHeaderSelector));o=c(i).addClass(s.menuClass),t(window).scroll(function(){g()}),t(e).ready(function(){r.hash&&C(r.hash.substr(1),0),y()}),o.find("a").click(function(t){t.preventDefault(),C(this.hash.substr(1),s.jumpSpeed)}),a.data("scrollmenu",{options:s,menu:o})},c=function(e){var n=t("<ul />");return e.each(function(e,r){r=h(t(r));var a=t("<li />");if(a.append(p(t(r))),l<s.depth){var i=s.start.replace(/\d+/,function(t){return parseInt(t)+l+1}),o=r.nextUntil(r[0].tagName,i).not(s.not).not(s.disableHeaderSelector);o.length>0&&(l++,a.append(c(o)),l--)}n.append(a)}),n},p=function(e){var n=t("<a />");return d=0,n.text(e.text()),n.attr("href","#"+e.attr("id")),n},h=function(e){var n=e.attr("id");if("undefined"==typeof n&&(n=e.text().replace(/(\s+)|(#+)/g,function(t,e,n){return e?"-":n?"":void 0}).toLowerCase(),e.data("scrollmenu",{generatedId:n})),!n||t('[id="'+n+'"]').length>1){var r={oldId:n};n=m(n+"-"),r.generatedId=n,e.data("scrollmenu",r)}return e.attr("id",n),e},m=function(n,r){n="undefined"!=typeof n?n:"",r="undefined"!=typeof r?r:"",d++;var a=n+d+r;return t(e.getElementById(a)).length?m(n,r):a},v=function(){var e=!1;return t("[id]").filter(":header").each(function(){var n=t(window).scrollTop()+s.offsetActive;return t(this).offset().top<=n&&(0===t(this).nextAll("[id]").length||t(this).nextAll("[id]").offset().top>n)?(e=t(this).attr("id"),!1):void 0}),e},g=function(){(s.toggleWhileJumping||!u)&&y()},y=function(){var e=v(),n=o.find("li a").filter(function(){return t(this).attr("href")=="#"+e}).parent();n.addClass(s.activeClass);var r=n.parents("li");r=r.length?r:n,r.addClass(s.parentClass),n.add(r).siblings().removeClass(s.activeClass).removeClass(s.parentClass)},C=function(a,i){var o=v();u=!0,s.onJumpBefore.apply(this,[a,o]);var l=t(e.getElementById(a)).offset().top-s.offsetScroll;t("html, body").animate({scrollTop:l},i,function(){s.toggleWhileJumping||y(),u=!1,s.onJumpAfter.apply(this,[a,o])}),n&&n.pushState&&s.pushToHistory&&n.pushState({},e.title,r.pathname+"#"+a)},w={refresh:function(t){w.destroy(),"undefined"==typeof t&&(t=s),f(t)},destroy:function(){t(":header").filter(function(){return!!t(this).data("scrollmenu")}).each(function(){var e=t(this).data("scrollmenu");"generatedId"in e&&e.generatedId==t(this).attr("id")&&("oldId"in e?t(this).attr("id",e.oldId):t(this).removeAttr("id"))}),o.remove()},get:function(){return o}};t.fn.scrollmenu=function(){if(a=t(this),"undefined"==typeof a.data("scrollmenu"))f.apply(this,arguments),a.data("scrollmenu",i);else if(arguments[0]in w)return i=a.data("scrollmenu"),s=i.options,o=i.menu,w[arguments[0]].apply(this,Array.prototype.slice.call(arguments,1));return a},t.fn.scrollmenu.defaults={start:"h2",depth:2,jumpSpeed:400,offsetScroll:0,offsetActive:0,toggleWhileJumping:!1,disableHeaderSelector:"[disabled]",not:"[disabled]",activeClass:"active",parentClass:"active",menuClass:"menu",pushToHistory:!0,onJumpBefore:function(){},onJumpAfter:function(){}}}(jQuery,window.document,window.history,window.location);
//# sourceMappingURL=jquery.scrollmenu.js.map
