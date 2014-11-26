/*!
 * Bootstrap v3.2.0 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') { throw new Error('Bootstrap\'s JavaScript requires jQuery') }

/* ========================================================================
 * Bootstrap: transition.js v3.2.0
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.2.0
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.2.0'

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.2.0
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.2.0'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    $el[val](data[state] == null ? this.options[state] : data[state])

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    Plugin.call($btn, 'toggle')
    e.preventDefault()
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.2.0
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element).on('keydown.bs.carousel', $.proxy(this.keydown, this))
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.2.0'

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true
  }

  Carousel.prototype.keydown = function (e) {
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.2.0
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.2.0'

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      Plugin.call(actives, 'hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(350)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') option = !option
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var href
    var $this   = $(this)
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle="collapse"][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.2.0
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.2.0'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.trigger('focus')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $parent = getParent($(this))
      var relatedTarget = { relatedTarget: this }
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role="menu"], [role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.2.0
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options        = options
    this.$body          = $(document.body)
    this.$element       = $(element)
    this.$backdrop      =
    this.isShown        = null
    this.scrollbarWidth = 0

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.2.0'

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.$body.addClass('modal-open')

    this.setScrollbar()
    this.escape()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.$body.removeClass('modal-open')

    this.resetScrollbar()
    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(150) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  Modal.prototype.checkScrollbar = function () {
    if (document.body.clientWidth >= window.innerWidth) return
    this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '')
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.2.0
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.2.0'

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(document.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $parent      = this.$element.parent()
        var parentDim    = this.getPosition($parent)

        placement = placement == 'bottom' && pos.top   + pos.height       + actualHeight - parentDim.scroll > parentDim.height ? 'top'    :
                    placement == 'top'    && pos.top   - parentDim.scroll - actualHeight < 0                                   ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth      > parentDim.width                                    ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth      < parentDim.left                                     ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(150) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var arrowDelta          = delta.left ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowPosition       = delta.left ? 'left'        : 'top'
    var arrowOffsetPosition = delta.left ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], arrowPosition)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    this.$element.removeAttr('aria-describedby')

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element.trigger('hidden.bs.' + that.type)
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(150) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element
    var el     = $element[0]
    var isBody = el.tagName == 'BODY'
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : null, {
      scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop(),
      width:  isBody ? $(window).width()  : $element.outerWidth(),
      height: isBody ? $(window).height() : $element.outerHeight()
    }, isBody ? { top: 0, left: 0 } : $element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template))
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    clearTimeout(this.timeout)
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.2.0
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.2.0'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').empty()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.2.0
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var process  = $.proxy(this.process, this)

    this.$body          = $('body')
    this.$scrollElement = $(element).is('body') ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', process)
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.2.0'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = 'offset'
    var offsetBase   = 0

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.offsets = []
    this.targets = []
    this.scrollHeight = this.getScrollHeight()

    var self     = this

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop <= offsets[0]) {
      return activeTarget != (i = targets[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')

    var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.2.0
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.2.0'

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.2.0
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      =
    this.unpin        =
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.2.0'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin != null) this.$element.css('top', '')

    var affixType = 'affix' + (affix ? '-' + affix : '')
    var e         = $.Event(affixType + '.bs.affix')

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

    this.$element
      .removeClass(Affix.RESET)
      .addClass(affixType)
      .trigger($.Event(affixType.replace('affix', 'affixed')))

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - this.$element.height() - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

/**
 * Copyright (c) 2011-2014 Felix Gnass
 * Licensed under the MIT license
 */
(function(root, factory) {

  /* CommonJS */
  if (typeof exports == 'object')  module.exports = factory()

  /* AMD module */
  else if (typeof define == 'function' && define.amd) define(factory)

  /* Browser global */
  else root.Spinner = factory()
}
(this, function() {
  "use strict";

  var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
    , animations = {} /* Animation rules keyed by their name */
    , useCssAnimations /* Whether to use CSS animations or setTimeout */

  /**
   * Utility function to create elements. If no tag name is given,
   * a DIV is created. Optionally properties can be passed.
   */
  function createEl(tag, prop) {
    var el = document.createElement(tag || 'div')
      , n

    for(n in prop) el[n] = prop[n]
    return el
  }

  /**
   * Appends children and returns the parent.
   */
  function ins(parent /* child1, child2, ...*/) {
    for (var i=1, n=arguments.length; i<n; i++)
      parent.appendChild(arguments[i])

    return parent
  }

  /**
   * Insert a new stylesheet to hold the @keyframe or VML rules.
   */
  var sheet = (function() {
    var el = createEl('style', {type : 'text/css'})
    ins(document.getElementsByTagName('head')[0], el)
    return el.sheet || el.styleSheet
  }())

  /**
   * Creates an opacity keyframe animation rule and returns its name.
   * Since most mobile Webkits have timing issues with animation-delay,
   * we create separate rules for each line/segment.
   */
  function addAnimation(alpha, trail, i, lines) {
    var name = ['opacity', trail, ~~(alpha*100), i, lines].join('-')
      , start = 0.01 + i/lines * 100
      , z = Math.max(1 - (1-alpha) / trail * (100-start), alpha)
      , prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase()
      , pre = prefix && '-' + prefix + '-' || ''

    if (!animations[name]) {
      sheet.insertRule(
        '@' + pre + 'keyframes ' + name + '{' +
        '0%{opacity:' + z + '}' +
        start + '%{opacity:' + alpha + '}' +
        (start+0.01) + '%{opacity:1}' +
        (start+trail) % 100 + '%{opacity:' + alpha + '}' +
        '100%{opacity:' + z + '}' +
        '}', sheet.cssRules.length)

      animations[name] = 1
    }

    return name
  }

  /**
   * Tries various vendor prefixes and returns the first supported property.
   */
  function vendor(el, prop) {
    var s = el.style
      , pp
      , i

    prop = prop.charAt(0).toUpperCase() + prop.slice(1)
    for(i=0; i<prefixes.length; i++) {
      pp = prefixes[i]+prop
      if(s[pp] !== undefined) return pp
    }
    if(s[prop] !== undefined) return prop
  }

  /**
   * Sets multiple style properties at once.
   */
  function css(el, prop) {
    for (var n in prop)
      el.style[vendor(el, n)||n] = prop[n]

    return el
  }

  /**
   * Fills in default values.
   */
  function merge(obj) {
    for (var i=1; i < arguments.length; i++) {
      var def = arguments[i]
      for (var n in def)
        if (obj[n] === undefined) obj[n] = def[n]
    }
    return obj
  }

  /**
   * Returns the absolute page-offset of the given element.
   */
  function pos(el) {
    var o = { x:el.offsetLeft, y:el.offsetTop }
    while((el = el.offsetParent))
      o.x+=el.offsetLeft, o.y+=el.offsetTop

    return o
  }

  /**
   * Returns the line color from the given string or array.
   */
  function getColor(color, idx) {
    return typeof color == 'string' ? color : color[idx % color.length]
  }

  // Built-in defaults

  var defaults = {
    lines: 12,            // The number of lines to draw
    length: 7,            // The length of each line
    width: 5,             // The line thickness
    radius: 10,           // The radius of the inner circle
    rotate: 0,            // Rotation offset
    corners: 1,           // Roundness (0..1)
    color: '#000',        // #rgb or #rrggbb
    direction: 1,         // 1: clockwise, -1: counterclockwise
    speed: 1,             // Rounds per second
    trail: 100,           // Afterglow percentage
    opacity: 1/4,         // Opacity of the lines
    fps: 20,              // Frames per second when using setTimeout()
    zIndex: 2e9,          // Use a high z-index by default
    className: 'spinner', // CSS class to assign to the element
    top: '50%',           // center vertically
    left: '50%',          // center horizontally
    position: 'absolute'  // element position
  }

  /** The constructor */
  function Spinner(o) {
    this.opts = merge(o || {}, Spinner.defaults, defaults)
  }

  // Global defaults that override the built-ins:
  Spinner.defaults = {}

  merge(Spinner.prototype, {

    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target b calling
     * stop() internally.
     */
    spin: function(target) {
      this.stop()

      var self = this
        , o = self.opts
        , el = self.el = css(createEl(0, {className: o.className}), {position: o.position, width: 0, zIndex: o.zIndex})
        , mid = o.radius+o.length+o.width

      css(el, {
        left: o.left,
        top: o.top
      })
        
      if (target) {
        target.insertBefore(el, target.firstChild||null)
      }

      el.setAttribute('role', 'progressbar')
      self.lines(el, self.opts)

      if (!useCssAnimations) {
        // No CSS animation support, use setTimeout() instead
        var i = 0
          , start = (o.lines - 1) * (1 - o.direction) / 2
          , alpha
          , fps = o.fps
          , f = fps/o.speed
          , ostep = (1-o.opacity) / (f*o.trail / 100)
          , astep = f/o.lines

        ;(function anim() {
          i++;
          for (var j = 0; j < o.lines; j++) {
            alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)

            self.opacity(el, j * o.direction + start, alpha, o)
          }
          self.timeout = self.el && setTimeout(anim, ~~(1000/fps))
        })()
      }
      return self
    },

    /**
     * Stops and removes the Spinner.
     */
    stop: function() {
      var el = this.el
      if (el) {
        clearTimeout(this.timeout)
        if (el.parentNode) el.parentNode.removeChild(el)
        this.el = undefined
      }
      return this
    },

    /**
     * Internal method that draws the individual lines. Will be overwritten
     * in VML fallback mode below.
     */
    lines: function(el, o) {
      var i = 0
        , start = (o.lines - 1) * (1 - o.direction) / 2
        , seg

      function fill(color, shadow) {
        return css(createEl(), {
          position: 'absolute',
          width: (o.length+o.width) + 'px',
          height: o.width + 'px',
          background: color,
          boxShadow: shadow,
          transformOrigin: 'left',
          transform: 'rotate(' + ~~(360/o.lines*i+o.rotate) + 'deg) translate(' + o.radius+'px' +',0)',
          borderRadius: (o.corners * o.width>>1) + 'px'
        })
      }

      for (; i < o.lines; i++) {
        seg = css(createEl(), {
          position: 'absolute',
          top: 1+~(o.width/2) + 'px',
          transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
          opacity: o.opacity,
          animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1/o.speed + 's linear infinite'
        })

        if (o.shadow) ins(seg, css(fill('#000', '0 0 4px ' + '#000'), {top: 2+'px'}))
        ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')))
      }
      return el
    },

    /**
     * Internal method that adjusts the opacity of a single line.
     * Will be overwritten in VML fallback mode below.
     */
    opacity: function(el, i, val) {
      if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
    }

  })


  function initVML() {

    /* Utility function to create a VML tag */
    function vml(tag, attr) {
      return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
    }

    // No CSS transforms but VML support, add a CSS rule for VML elements:
    sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')

    Spinner.prototype.lines = function(el, o) {
      var r = o.length+o.width
        , s = 2*r

      function grp() {
        return css(
          vml('group', {
            coordsize: s + ' ' + s,
            coordorigin: -r + ' ' + -r
          }),
          { width: s, height: s }
        )
      }

      var margin = -(o.width+o.length)*2 + 'px'
        , g = css(grp(), {position: 'absolute', top: margin, left: margin})
        , i

      function seg(i, dx, filter) {
        ins(g,
          ins(css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx}),
            ins(css(vml('roundrect', {arcsize: o.corners}), {
                width: r,
                height: o.width,
                left: o.radius,
                top: -o.width>>1,
                filter: filter
              }),
              vml('fill', {color: getColor(o.color, i), opacity: o.opacity}),
              vml('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
            )
          )
        )
      }

      if (o.shadow)
        for (i = 1; i <= o.lines; i++)
          seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')

      for (i = 1; i <= o.lines; i++) seg(i)
      return ins(el, g)
    }

    Spinner.prototype.opacity = function(el, i, val, o) {
      var c = el.firstChild
      o = o.shadow && o.lines || 0
      if (c && i+o < c.childNodes.length) {
        c = c.childNodes[i+o]; c = c && c.firstChild; c = c && c.firstChild
        if (c) c.opacity = val
      }
    }
  }

  var probe = css(createEl('group'), {behavior: 'url(#default#VML)'})

  if (!vendor(probe, 'transform') && probe.adj) initVML()
  else useCssAnimations = vendor(probe, 'animation')

  return Spinner

}));

/**
 * Copyright (c) 2011-2014 Felix Gnass
 * Licensed under the MIT license
 */

/*

Basic Usage:
============

$('#el').spin(); // Creates a default Spinner using the text color of #el.
$('#el').spin({ ... }); // Creates a Spinner using the provided options.

$('#el').spin(false); // Stops and removes the spinner.

Using Presets:
==============

$('#el').spin('small'); // Creates a 'small' Spinner using the text color of #el.
$('#el').spin('large', '#fff'); // Creates a 'large' white Spinner.

Adding a custom preset:
=======================

$.fn.spin.presets.flower = {
  lines: 9
  length: 10
  width: 20
  radius: 0
}

$('#el').spin('flower', 'red');

*/

(function(factory) {

  if (typeof exports == 'object') {
    // CommonJS
    factory(require('jquery'), require('spin'))
  }
  else if (typeof define == 'function' && define.amd) {
    // AMD, register as anonymous module
    define(['jquery', 'spin'], factory)
  }
  else {
    // Browser globals
    if (!window.Spinner) throw new Error('Spin.js not present')
    factory(window.jQuery, window.Spinner)
  }

}(function($, Spinner) {

  $.fn.spin = function(opts, color) {

    return this.each(function() {
      var $this = $(this),
        data = $this.data();

      if (data.spinner) {
        data.spinner.stop();
        delete data.spinner;
      }
      if (opts !== false) {
        opts = $.extend(
          { color: color || $this.css('color') },
          $.fn.spin.presets[opts] || opts
        )
        data.spinner = new Spinner(opts).spin(this)
      }
    })
  }

  $.fn.spin.presets = {
    tiny: { lines: 8, length: 2, width: 2, radius: 3 },
    small: { lines: 8, length: 4, width: 3, radius: 5 },
    large: { lines: 10, length: 8, width: 4, radius: 8 }
  }

}));

/*!
 * iCheck v2.0.0, http://git.io/arlzeA
 * ===================================
 * Cross-platform checkboxes and radio buttons customization
 *
 * (c) Damir Sultanov - http://fronteed.com
 * MIT Licensed
 */

(function(win, doc, $) {

  // prevent multiple includes
  if (!win.ichecked) {
    win.ichecked = function() {
      $ = win.jQuery || win.Zepto;

      // default options
      var defaults = {

        // auto init on domready
        autoInit: true,

        // auto handle ajax loaded inputs
        autoAjax: true,

        // remove 300ms click delay on touch devices
        tap: true,

        // customization class names
        checkboxClass: 'icheckbox',
        radioClass: 'iradio',

        checkedClass: 'checked',
        disabledClass: 'disabled',
        indeterminateClass: 'indeterminate',

        hoverClass: 'hover',
        // focusClass: 'focus',
        // activeClass: 'active',

        // default callbacks
        callbacks: {
          ifCreated: false
        },

        // appended class names
        classes: {
          base: 'icheck',
          div: '#-item', // {base}-item
          area: '#-area-', // {base}-area-{value}
          input: '#-input', // {base}-input
          label: '#-label' // {base}-label
        }
      };

      // extend default options
      win.icheck = $.extend(defaults, win.icheck);

      // useragent sniffing
      var ua = win.navigator.userAgent;
      var ie = /MSIE [5-8]/.test(ua) || doc.documentMode < 9;
      var operaMini = /Opera Mini/.test(ua);

      // classes cache
      var baseClass = defaults.classes.base;
      var divClass = defaults.classes.div.replace('#', baseClass);
      var areaClass = defaults.classes.area.replace('#', baseClass);
      var nodeClass = defaults.classes.input.replace('#', baseClass);
      var labelClass = defaults.classes.label.replace('#', baseClass);

      // unset init classes
      delete defaults.classes;

      // default filter
      var filter = 'input[type=checkbox],input[type=radio]';

      // clickable areas container
      var areas = {};

      // hashes container
      var hashes = {};

      // hash recognizer
      var recognizer = new RegExp(baseClass + '\\[(.*?)\\]');

      // hash extractor
      var extract = function(className, matches, value) {
        if (!!className) {
          matches = recognizer.exec(className);

          if (matches && hashes[matches[1]]) {
            value = matches[1];
          }
        }

        return value;
      };

      // detect computed style support
      var computed = win.getComputedStyle;

      // detect pointer events support
      var isPointer = win.PointerEvent || win.MSPointerEvent;

      // detect touch events support
      var isTouch = 'ontouchend' in win;

      // detect mobile users
      var isMobile = /mobile|tablet|phone|ip(ad|od)|android|silk|webos/i.test(ua);

      // setup events
      var mouse = ['mouse', 'down', 'up', 'over', 'out']; // bubbling hover
      var pointer = win.PointerEvent ? ['pointer', mouse[1], mouse[2], mouse[3], mouse[4]] : ['MSPointer', 'Down', 'Up', 'Over', 'Out'];
      var touch = ['touch', 'start', 'end'];
      var noMouse = (isTouch && isMobile) || isPointer;

      // choose events
      var hoverStart = noMouse ? (isTouch ? touch[0] + touch[1] : pointer[0] + pointer[3]) : mouse[0] + mouse[3];
      var hoverEnd = noMouse ? (isTouch ? touch[0] + touch[2] : pointer[0] + pointer[4]) : mouse[0] + mouse[4];
      var tapStart = noMouse ? (isTouch ? false : pointer[0] + pointer[1]) : mouse[0] + mouse[1];
      var tapEnd = noMouse ? (isTouch ? false : pointer[0] + pointer[2]) : mouse[0] + mouse[2];
      var hover = !operaMini ? hoverStart + '.i ' + hoverEnd + '.i ' : '';
      var tap = !operaMini && tapStart ? tapStart + '.i ' + tapEnd + '.i' : '';

      // styles options
      var styleTag;
      var styleList;
      var styleArea = defaults.areaStyle !== false ? 'position:absolute;display:block;content:"";top:#;bottom:#;left:#;right:#;' : 0;
      var styleInput = 'position:absolute!;display:block!;outline:none!;' + (defaults.debug ? '' : 'opacity:0!;z-index:-99!;clip:rect(0 0 0 0)!;');

      // styles addition
      var style = function(rules, selector, area) {
        if (!styleTag) {

          // create container
          styleTag = doc.createElement('style');

          // append to header
          (doc.head || doc.getElementsByTagName('head')[0]).appendChild(styleTag);

          // webkit hack
          if (!win.createPopup) {
            styleTag.appendChild(doc.createTextNode(''));
          }

          styleList = styleTag.sheet || styleTag.styleSheet;
        }

        // choose selector
        if (!selector) {
          selector = 'div.' + (area ? areaClass + area + ':after' : divClass + ' input.' + nodeClass);
        }

        // replace shorthand rules
        rules = rules.replace(/!/g, ' !important');

        // append styles
        if (styleList.addRule) {
          styleList.addRule(selector, rules, 0);
        } else {
          styleList.insertRule(selector + '{' + rules + '}', 0);
        }
      };

      // append input's styles
      style(styleInput);

      // append styler's styles
      if ((isTouch && isMobile) || operaMini) {

        // force custor:pointer for mobile devices
        style('cursor:pointer!;', 'label.' + labelClass + ',div.' + divClass);
      }

      // append iframe's styles
      style('display:none!', 'iframe.icheck-frame'); // used to handle ajax-loaded inputs

      // class toggler
      var toggle = function(node, className, status, currentClass, updatedClass, addClass, removeClass) {
        currentClass = node.className;

        if (!!currentClass) {
          updatedClass = ' ' + currentClass + ' ';

          // add class
          if (status === 1) {
            addClass = className;

          // remove class
          } else if (status === 0) {
            removeClass = className;

          // add and remove class
          } else {
            addClass = className[0];
            removeClass = className[1];
          }

          // add class
          if (!!addClass && updatedClass.indexOf(' ' + addClass + ' ') < 0) {
            updatedClass += addClass + ' ';
          }

          // remove class
          if (!!removeClass && ~updatedClass.indexOf(' ' + removeClass + ' ')) {
            updatedClass = updatedClass.replace(' ' + removeClass + ' ', ' ');
          }

          // trim class
          updatedClass = updatedClass.replace(/^\s+|\s+$/g, '');

          // update class
          if (updatedClass !== currentClass) {
            node.className = updatedClass;
          }

          // return updated class
          return updatedClass;
        }
      };

      // traces remover
      var tidy = function(node, key, trigger, settings, className, parent) {
        if (hashes[key]) {
          settings = hashes[key];
          className = settings.className;
          parent = $(closest(node, 'div', className));

          // prevent overlapping
          if (parent.length) {

            // input
            $(node).removeClass(nodeClass + ' ' + className).attr('style', settings.style);

            // label
            $('label.' + settings.esc).removeClass(labelClass + ' ' + className);

            // parent
            $(parent).replaceWith($(node));

            // callback
            if (trigger) {
              callback(node, key, trigger);
            }
          }

          // unset current key
          hashes[key] = false;
        }
      };

      // nodes inspector
      var inspect = function(object, node, stack, direct, indirect) {
        stack = [];
        direct = object.length;

        // inspect object
        while (direct--) {
          node = object[direct];

          // direct input
          if (node.type) {

            // checkbox or radio button
            if (~filter.indexOf(node.type)) {
              stack.push(node);
            }

          // indirect input
          } else {
            node = $(node).find(filter);
            indirect = node.length;

            while (indirect--) {
              stack.push(node[indirect]);
            }
          }
        }

        return stack;
      };

      // parent searcher
      var closest = function(node, tag, className, parent) {
        while (node && node.nodeType !== 9) {
          node = node.parentNode;

          if (node && node.tagName == tag.toUpperCase() && ~node.className.indexOf(className)) {
            parent = node;
            break;
          }
        }

        return parent;
      };

      // callbacks farm
      var callback = function(node, key, name) {
        name = 'if' + name;

        // callbacks are allowed
        if (hashes[key].callbacks !== false) {

          // direct callback
          if (typeof hashes[key].callbacks[name] == 'function') {
            hashes[key].callbacks[name](node, hashes[key]);
          }

          // indirect callback
          if (hashes[key].callbacks[name] !== false) {
            $(node).trigger(name);
          }
        }
      };

      // selection processor
      var process = function(data, options, ajax, silent) {

        // get inputs
        var elements = inspect(data);
        var element = elements.length;

        // loop through inputs
        while (element--) {
          var node = elements[element];
          var nodeAttr = node.attributes;
          var nodeAttrCache = {};
          var nodeAttrLength = nodeAttr.length;
          var nodeAttrName;
          var nodeAttrValue;
          var nodeData = {};
          var nodeDataCache = {}; // merged data
          var nodeDataProperty;
          var nodeId = node.id;
          var nodeInherit;
          var nodeInheritItem;
          var nodeInheritLength;
          var nodeString = node.className;
          var nodeStyle;
          var nodeType = node.type;
          var queryData = $.cache ? $.cache[node[$.expando]] : 0; // cached data
          var settings;
          var key = extract(nodeString);
          var keyClass;
          var handle;
          var styler;
          var stylerClass = '';
          var stylerStyle;
          var area = false;
          var label;
          var labelDirect;
          var labelIndirect;
          var labelKey;
          var labelString;
          var labels = [];
          var labelsLength;
          var fastClass = win.FastClick ? ' needsclick' : '';

          // parse options from HTML attributes
          while (nodeAttrLength--) {
            nodeAttrName = nodeAttr[nodeAttrLength].name;
            nodeAttrValue = nodeAttr[nodeAttrLength].value;

            if (~nodeAttrName.indexOf('data-')) {
              nodeData[nodeAttrName.substr(5)] = nodeAttrValue;
            }

            if (nodeAttrName == 'style') {
              nodeStyle = nodeAttrValue;
            }

            nodeAttrCache[nodeAttrName] = nodeAttrValue;
          }

          // parse options from jQuery or Zepto cache
          if (queryData && queryData.data) {
            nodeData = $.extend(nodeData, queryData.data);
          }

          // parse merged options
          for (nodeDataProperty in nodeData) {
            nodeAttrValue = nodeData[nodeDataProperty];

            if (nodeAttrValue == 'true' || nodeAttrValue == 'false') {
              nodeAttrValue = nodeAttrValue == 'true';
            }

            nodeDataCache[nodeDataProperty.replace(/checkbox|radio|class|id|label/g, function(string, position) {
              return position === 0 ? string : string.charAt(0).toUpperCase() + string.slice(1);
            })] = nodeAttrValue;
          }

          // merge options
          settings = $.extend({}, defaults, win.icheck, nodeDataCache, options);

          // input type filter
          handle = settings.handle;

          if (handle !== 'checkbox' && handle !== 'radio') {
            handle = filter;
          }

          // prevent unwanted init
          if (settings.init !== false && ~handle.indexOf(nodeType)) {

            // tidy before processing
            if (key) {
              tidy(node, key);
            }

            // generate random key
            while(!hashes[key]) {
              key = Math.random().toString(36).substr(2, 5); // 5 symbols

              if (!hashes[key]) {
                keyClass = baseClass + '[' + key + ']';
                break;
              }
            }

            // prevent unwanted duplicates
            delete settings.autoInit;
            delete settings.autoAjax;

            // save settings
            settings.style = nodeStyle || '';
            settings.className = keyClass;
            settings.esc = keyClass.replace(/(\[|\])/g, '\\$1');
            hashes[key] = settings;

            // find direct label
            labelDirect = closest(node, 'label', '');

            if (labelDirect) {

              // normalize "for" attribute
              if (!!!labelDirect.htmlFor && !!nodeId) {
                labelDirect.htmlFor = nodeId;
              }

              labels.push(labelDirect);
            }

            // find indirect label
            if (!!nodeId) {
              labelIndirect = $('label[for="' + nodeId + '"]');

              // merge labels
              while (labelIndirect.length--) {
                label = labelIndirect[labelIndirect.length];

                if (label !== labelDirect) {
                  labels.push(label);
                }
              }
            }

            // loop through labels
            labelsLength = labels.length;

            while (labelsLength--) {
              label = labels[labelsLength];
              labelString = label.className;
              labelKey = extract(labelString);

              // remove previous key
              if (labelKey) {
                labelString = toggle(label, baseClass + '[' + labelKey + ']', 0);
              } else {
                labelString = (!!labelString ? labelString + ' ' : '') + labelClass;
              }

              // update label's class
              label.className = labelString + ' ' + keyClass + fastClass;
            }

            // prepare styler
            styler = doc.createElement('div');

            // parse inherited options
            if (!!settings.inherit) {
              nodeInherit = settings.inherit.split(/\s*,\s*/);
              nodeInheritLength = nodeInherit.length;

              while (nodeInheritLength--) {
                nodeInheritItem = nodeInherit[nodeInheritLength];

                if (nodeAttrCache[nodeInheritItem] !== undefined) {
                  if (nodeInheritItem == 'class') {
                    stylerClass += nodeAttrCache[nodeInheritItem] + ' ';
                  } else {
                    styler.setAttribute(nodeInheritItem, nodeInheritItem == 'id' ? baseClass + '-' + nodeAttrCache[nodeInheritItem] : nodeAttrCache[nodeInheritItem]);
                  }
                }
              }
            }

            // set input's type class
            stylerClass += settings[nodeType + 'Class'];

            // set styler's key
            stylerClass += ' ' + divClass + ' ' + keyClass;

            // append area styles
            if (settings.area && styleArea) {
              area = ('' + settings.area).replace(/%|px|em|\+|-/g, '') | 0;

              if (area) {

                // append area's styles
                if (!areas[area]) {
                  style(styleArea.replace(/#/g, '-' + area + '%'), false, area);
                  areas[area] = true;
                }

                stylerClass += ' ' + areaClass + area;
              }
            }

            // update styler's class
            styler.className = stylerClass + fastClass;

            // update node's class
            node.className = (!!nodeString ? nodeString + ' ' : '') + nodeClass + ' ' + keyClass;

            // replace node
            node.parentNode.replaceChild(styler, node);

            // append node
            styler.appendChild(node);

            // append additions
            if (!!settings.insert) {
              $(styler).append(settings.insert);
            }

            // set relative position
            if (area) {

              // get styler's position
              if (computed) {
                stylerStyle = computed(styler, null).getPropertyValue('position');
              } else {
                stylerStyle = styler.currentStyle.position;
              }

              // update styler's position
              if (stylerStyle == 'static') {
                styler.style.position = 'relative';
              }
            }

            // operate
            operate(node, styler, key, 'updated', true, false, ajax);
            hashes[key].done = true;

            // ifCreated callback
            if (!silent) {
              callback(node, key, 'Created');
            }
          }
        }
      };

      // operations center
      var operate = function(node, parent, key, method, silent, before, ajax) {
        var settings = hashes[key];
        var states = {};
        var changes = {};

        // current states
        states.checked = [node.checked, 'Checked', 'Unchecked'];

        if ((!before || ajax) && method !== 'click') {
          states.disabled = [node.disabled, 'Disabled', 'Enabled'];
          states.indeterminate = [node.getAttribute('indeterminate') == 'true' || !!node.indeterminate, 'Indeterminate', 'Determinate'];
        }

        // methods
        if (method == 'updated' || method == 'click') {
          changes.checked = before ? !states.checked[0] : states.checked[0];

          if ((!before || ajax) && method !== 'click') {
            changes.disabled = states.disabled[0];
            changes.indeterminate = states.indeterminate[0];
          }

        } else if (method == 'checked' || method == 'unchecked') {
          changes.checked = method == 'checked';

        } else if (method == 'disabled' || method == 'enabled') {
          changes.disabled = method == 'disabled';

        } else if (method == 'indeterminate' || method == 'determinate') {
          changes.indeterminate = method !== 'determinate';

        // "toggle" method
        } else {
          changes.checked = !states.checked[0];
        }

        // apply changes
        change(node, parent, states, changes, key, settings, method, silent, before, ajax);
      };

      // state changer
      var change = function(node, parent, states, changes, key, settings, method, silent, before, ajax, loop) {
        var type = node.type;
        var typeCapital = type == 'radio' ? 'Radio' : 'Checkbox';
        var property;
        var value;
        var classes;
        var inputClass;
        var label;
        var labelClass = 'LabelClass';
        var form;
        var radios;
        var radiosLength;
        var radio;
        var radioKey;
        var radioStates;
        var radioChanges;
        var changed;
        var toggled;

        // check parent
        if (!parent) {
          parent = closest(node, 'div', settings.className);
        }

        // continue if parent exists
        if (parent) {

          // detect changes
          for (property in changes) {
            value = changes[property];

            // update node's property
            if (states[property][0] !== value && method !== 'updated' && method !== 'click') {
              node[property] = value;
            }

            // update ajax attributes
            if (ajax) {
              if (value) {
                node.setAttribute(property, property);
              } else {
                node.removeAttribute(property);
              }
            }

            // update key's property
            if (settings[property] !== value) {
              settings[property] = value;
              changed = true;

              if (property == 'checked') {
                toggled = true;

                // find assigned radios
                if (!loop && value && (!!hashes[key].done || ajax) && type == 'radio' && !!node.name) {
                  form = closest(node, 'form', '');
                  radios = 'input[name="' + node.name + '"]';
                  radios = form && !ajax ? $(form).find(radios) : $(radios);
                  radiosLength = radios.length;

                  while (radiosLength--) {
                    radio = radios[radiosLength];
                    radioKey = extract(radio.className);

                    // toggle radios
                    if (node !== radio && hashes[radioKey] && hashes[radioKey].checked) {
                      radioStates = {checked: [true, 'Checked', 'Unchecked']};
                      radioChanges = {checked: false};

                      change(radio, false, radioStates, radioChanges, radioKey, hashes[radioKey], 'updated', silent, before, ajax, true);
                    }
                  }
                }
              }

              // cache classes
              classes = [
                settings[property + 'Class'], // 0, example: checkedClass
                settings[property + typeCapital + 'Class'], // 1, example: checkedCheckboxClass
                settings[states[property][1] + 'Class'], // 2, example: uncheckedClass
                settings[states[property][1] + typeCapital + 'Class'], // 3, example: uncheckedCheckboxClass
                settings[property + labelClass] // 4, example: checkedLabelClass
              ];

              // value == false
              inputClass = [classes[3] || classes[2], classes[1] || classes[0]];

              // value == true
              if (value) {
                inputClass.reverse();
              }

              // update parent's class
              toggle(parent, inputClass);

              // update labels's class
              if (!!settings.mirror && !!classes[4]) {
                label = $('label.' + settings.esc);

                while (label.length--) {
                  toggle(label[label.length], classes[4], value ? 1 : 0);
                }
              }

              // callback
              if (!silent || loop) {
                callback(node, key, states[property][value ? 1 : 2]); // ifChecked or ifUnchecked
              }
            }
          }

          // additional callbacks
          if (!silent || loop) {
            if (changed) {
              callback(node, key, 'Changed'); // ifChanged
            }

            if (toggled) {
              callback(node, key, 'Toggled'); // ifToggled
            }
          }

          // cursor addition
          if (!!settings.cursor && !isMobile) {

            // 'pointer' for enabled
            if (!settings.disabled && !settings.pointer) {
              parent.style.cursor = 'pointer';
              settings.pointer = true;

            // 'default' for disabled
            } else if (settings.disabled && settings.pointer) {
              parent.style.cursor = 'default';
              settings.pointer = false;
            }
          }

          // update settings
          hashes[key] = settings;
        }
      };

      // plugin definition
      $.fn.icheck = function(options, fire) {

        // detect methods
        if (/^(checked|unchecked|indeterminate|determinate|disabled|enabled|updated|toggle|destroy|data|styler)$/.test(options)) {
          var items = inspect(this);
          var itemsLength = items.length;

          // loop through inputs
          while (itemsLength--) {
            var item = items[itemsLength];
            var key = extract(item.className);

            if (key) {

              // 'data' method
              if (options == 'data') {
                return hashes[key];

              // 'styler' method
              } else if (options == 'styler') {
                return closest(item, 'div', hashes[key].className);

              } else {
                if (options == 'destroy') {
                  tidy(item, key, 'Destroyed');
                } else {
                  operate(item, false, key, options);
                }

                // callback
                if (typeof fire == 'function') {
                  fire(item);
                }
              }
            }
          }

        // basic setup
        } else if (typeof options == 'object' || !options) {
          process(this, options || {});
        }

        // chain
        return this;
      };

      // cached last key
      var lastKey;

      // bind label and styler
      $(doc).on('click.i ' + hover + tap, 'label.' + labelClass + ',div.' + divClass, function(event) {
        var self = this;
        var key = extract(self.className);

        if (key) {
          var emitter = event.type;
          var settings = hashes[key];
          var className = settings.esc; // escaped class name
          var div = self.tagName == 'DIV';
          var input;
          var target;
          var partner;
          var activate;
          var states = [
            ['label', settings.activeLabelClass, settings.hoverLabelClass],
            ['div', settings.activeClass, settings.hoverClass]
          ];

          // reverse array
          if (div) {
            states.reverse();
          }

          // active state
          if (emitter == tapStart || emitter == tapEnd) {

            // toggle self's active class
            if (!!states[0][1]) {
              toggle(self, states[0][1], emitter == tapStart ? 1 : 0);
            }

            // toggle partner's active class
            if (!!settings.mirror && !!states[1][1]) {
              partner = $(states[1][0] + '.' + className);

              while (partner.length--) {
                toggle(partner[partner.length], states[1][1], emitter == tapStart ? 1 : 0);
              }
            }

            // fast click
            if (div && emitter == tapEnd && !!settings.tap && isMobile && isPointer && !operaMini) {
              activate = true;
            }

          // hover state
          } else if (emitter == hoverStart || emitter == hoverEnd) {

            // toggle self's hover class
            if (!!states[0][2]) {
              toggle(self, states[0][2], emitter == hoverStart ? 1 : 0);
            }

            // toggle partner's hover class
            if (!!settings.mirror && !!states[1][2]) {
              partner = $(states[1][0] + '.' + className);

              while (partner.length--) {
                toggle(partner[partner.length], states[1][2], emitter == hoverStart ? 1 : 0);
              }
            }

            // fast click
            if (div && emitter == hoverEnd && !!settings.tap && isMobile && isTouch && !operaMini) {
              activate = true;
            }

          // click
          } else if (div) {
            if (!(isMobile && (isTouch || isPointer)) || !!!settings.tap || operaMini) {
              activate = true;
            }
          }

          // trigger input's click
          if (activate) {

            // currentTarget hack
            setTimeout(function() {
              target = event.currentTarget || {};

              if (target.tagName !== 'LABEL') {
                if (!settings.change || (+new Date() - settings.change > 100)) {
                  input = $(self).find('input.' + className).click();

                  if (ie || operaMini) {
                    input.change();
                  }
                }
              }
            }, 2);
          }
        }

      // bind input
      }).on('click.i change.i focusin.i focusout.i keyup.i keydown.i', 'input.' + nodeClass, function(event) {
        var self = this;
        var key = extract(self.className);

        if (key) {
          var emitter = event.type;
          var settings = hashes[key];
          var className = settings.esc; // escaped class name
          var parent = emitter == 'click' ? false : closest(self, 'div', settings.className);
          var label;
          var states;

          // click
          if (emitter == 'click') {
            hashes[key].change = +new Date();

            // prevent event bubbling to parent
            event.stopPropagation();

          // change
          } else if (emitter == 'change') {

            if (parent && !self.disabled) {
              operate(self, parent, key, 'click'); // 'click' method
            }

          // focus state
          } else if (~emitter.indexOf('focus')) {
            states = [settings.focusClass, settings.focusLabelClass];

            // toggle parent's focus class
            if (!!states[0] && parent) {
              toggle(parent, states[0], emitter == 'focusin' ? 1 : 0);
            }

            // toggle label's focus class
            if (!!settings.mirror && !!states[1]) {
              label = $('label.' + className);

              while (label.length--) {
                toggle(label[label.length], states[1], emitter == 'focusin' ? 1 : 0);
              }
            }

          // keyup or keydown (event fired before state is changed, except Opera 9-12)
          } else if (parent && !self.disabled) {

            // keyup
            if (emitter == 'keyup') {

              // spacebar or arrow
              if (self.type == 'checkbox' && event.keyCode == 32 && settings.keydown || self.type == 'radio' && !self.checked) {
                operate(self, parent, key, 'click', false, true); // 'toggle' method
              }

              hashes[key].keydown = hashes[lastKey].keydown = false;

            // keydown
            } else {
              lastKey = key;
              hashes[key].keydown = true;
            }
          }
        }

      // domready
      }).ready(function() {

        // auto init
        if (win.icheck.autoInit) {
          $('.' + baseClass).icheck();
        }

        // auto ajax
        if (win.jQuery) {

          // body selector cache
          var body = doc.body || doc.getElementsByTagName('body')[0];

          // apply converter
          $.ajaxSetup({
            converters: {
              'text html': function(data) {
                if (win.icheck.autoAjax && body) {
                  var frame = doc.createElement('iframe'); // create container
                  var frameData;

                  // set attributes
                  if (!ie) {
                    frame.style = 'display:none';
                  }

                  frame.className = 'iframe.icheck-frame';
                  frame.src ='about:blank';

                  // append container to document
                  body.appendChild(frame);

                  // save container's content
                  frameData = frame.contentDocument ? frame.contentDocument : frame.contentWindow.document;

                  // append data to content
                  frameData.open();
                  frameData.write(data);
                  frameData.close();

                  // remove container from document
                  body.removeChild(frame);

                  // setup object
                  frameData = $(frameData);

                  // customize inputs
                  process(frameData.find('.' + baseClass), {}, true);

                  // extract HTML
                  frameData = frameData[0];
                  data = (frameData.body || frameData.getElementsByTagName('body')[0]).innerHTML;
                  frameData = null; // prevent memory leaks
                }

                return data;
              }
            }
          });
        }
      });
    };

    // expose iCheck as an AMD module
    if (typeof define == 'function' && define.amd) {
      define('icheck', [win.jQuery ? 'jquery' : 'zepto'], win.ichecked);
    } else {
      win.ichecked();
    }
  }
}(window, document));

;(function ($, window, document, undefined) {
  'use strict';

  window.icheck = {
    autoInit: false
  , autoAjax: false
  };

  $(document).on('ready ajaxSuccess', function () {

    // Initialize or re-initialize iCheck
    $('input:not(.icheck-input)').icheck();

  });

  $(function () {

    // Programmatically hide buttons that are supposed to be hidden. This
    // ensures that the initial display state is correctly stored and applied
    // if the button is later shown.
    $('.Button.Hidden').removeClass('Hidden').hide();

    // Attach spinner to the .InProgress element in flyouts
    $(document).on('click', '.ToggleFlyout', function (e) {
      $('.InProgress', e.currentTarget).spin({
          lines  : 11
        , radius : 5
        , length : 5
        , width  : 2
        });
    });

    // Attach spinner to the .TinyProgress element when editing comment
    $(document).on('click', '.EditComment', function (e) {
      $('.TinyProgress', $(e.currentTarget).closest('.Item'))
        .empty()
        .spin({
          lines  : 9
        , radius : 3
        , length : 3
        , width  : 2
        });
    });

    // Attach spinner to the .MorePager when loading more content
    $(document).on('click', '.MorePager a', function (e) {
      $(e.currentTarget).parent()
        .spin({
          lines  : 9
        , radius : 3
        , length : 3
        , width  : 2
        });
    });

    var overlay = '.Overlay'
      , dialog  = '> .Popup';

    /**
     * Show the modal backdrop, but hide the actual modal dialog while it's
     * loading.
     *
     * @this {overlay}
     */
    var preparePopup = function () {
      var $overlay  = $(this)
        , $backdrop = $('<div class="backdrop fade">');

      // Lock body scrolling
      $('body').addClass('modal-open');

      // Prepare dialog animation
      $(dialog, $overlay).addClass('fade');

      // Attach a backdrop to the overlay if one doesn't already exist
      if (!$overlay.data('backdrop')) {
        $overlay.data('backdrop', $backdrop);

        // Append the modal backdrop to overlay
        $overlay.append($backdrop);
      }

      // Fake async addition of class
      setTimeout(function () {
        // Fade in backdrop and add spinner
        $backdrop.addClass('in').spin({
          lines  : 11
        , radius : 10
        , length : 10
        , width  : 4
        });
      }, 0);
    };

    /**
     * Fade in the modal dialog when it's time to reveal it.
     *
     * @this {overlay}
     */
    var revealPopup = function () {
      var $overlay  = $(this)
        , $backdrop = $overlay.data('backdrop');

      // Fade in modal dialog
      $(dialog, $overlay).addClass('in');

      if ($backdrop.length) {
        // Remove spinner from modal backdrop
        $backdrop.spin(false);
      }
    };

    /**
     * When it's time to close the modal, first fade out the modal dialog,
     * then fade out the modal backdrop, and lastly remove the entire modal
     * from the DOM.
     *
     * @this {overlay}
     */
    var closePopup = function () {
      var $overlay  = $(this)
        , $backdrop = $overlay.data('backdrop');

      // Fade out the modal dialog
      $(dialog, $overlay).removeClass('in');

      setTimeout(function () {
        if ($backdrop.length) {
          // Fade out the backdrop
          $backdrop.removeClass('in');
        }

        // Re-enable body scrolling
        $('body').removeClass('modal-open');
      }, 150);

      setTimeout(function () {
        // Remove overlay from the DOM
        $(overlay).remove();
      }, 300);
    };

    $(document)
      .on('popupLoading', function () {
        $(overlay).each(preparePopup);
      })
      .on('popupReveal', function () {
        $(overlay).each(revealPopup);
      })
      .on('popupClose', function (e) {
        $(overlay).each(closePopup);
      });

    var confirmPopupEls = [
      'a.Delete'
    , 'a.DeleteComment'
    , 'a.DeleteFile'
    , 'a.PopConfirm'
    , 'a.ClearConversation'
    , 'ul#DP_Remove a'  
    ];

    // When only a confirmation modal is shown, the "popupLoading" and
    // "popupReveal" events are never triggered. Manually trigger them to make
    // sure that the modal is actually shown.
    $(document).on('click', confirmPopupEls.join(), function (e) {
      $(document).trigger('popupLoading');

      setTimeout(function () {
        $(document).trigger('popupReveal');
      }, 150);
    });

  });

  /**
   * Override the popup.close method to ensure that the modal isn't immdiately
   * removed from the DOM upon closing the dialog. This version of the method
   * instead lets it be up to listeners to actually close the modal, just like
   * it's the reponsibility of listeners to show the modal.
   *
   * @param  {Object} settings
   * @param  {Object} response
   * @return {bool}
   */
  $.popup.close = function (settings, response) {
    $(document).unbind('keydown.popup');
    $('#' + settings.popupId).trigger('popupClose');

    return false;
  };

})(jQuery, window, document);
