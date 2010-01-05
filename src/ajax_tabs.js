/**
 * @author Laurynas Butkus <http://lauris.night.lt/>
 * @copyright 2009 Laurynas Butkus
 * @package LivePipe UI
 * @license MIT
 * @require prototype.js, livepipe.js, cookie.js
 */

Control.AjaxTabs = Class.create(Control.Tabs, {
  initialize: function($super, tab_list_container, options) {
    this.ajaxLinks = $H({});

    options = Object.extend({ 
      beforeChangeOriginal: options.beforeChange || Prototype.emptyFunction,
      linkSelector: 'li a',
      ajaxLoader: 'Loading...',
      rememberLastActiveTab: false,
      cookieKey: $(tab_list_container).id + '_T_'  
    }, options || {});
    
    options.beforeChange = this.beforeChangeHandler.bind(this);
    
    if (options.rememberLastActiveTab)		
      options.defaultTab = options.defaultTab || Cookie.get(options.cookieKey) || 'first';
			
		if (!$(options.defaultTab))
		  options.defaultTab = 'first';
    
    (typeof(options.linkSelector == 'string') ? 
      $(tab_list_container).select(options.linkSelector) : 
      options.linkSelector($(tab_list_container))
    ).findAll(function(link){
      return (/^[^#].*#.+/).exec((Prototype.Browser.WebKit ? decodeURIComponent(link.href) : link.href).replace(window.location.href.split('#')[0],''));
    }).each(function(link){
      parts = link.href.split('#');
      this.ajaxLinks.set(parts[1], parts[0]);
      // replace original href
      link.href = '#' + parts[1];
    }.bind(this));
    
    $super(tab_list_container, options);
  },
  
  beforeChangeHandler: function(old_container, new_container) {
    if (this.notify('beforeChangeOriginal', old_container, new_container) === false) 
      return false;
    
    if (this.options.rememberLastActiveTab) 
      Cookie.set(this.options.cookieKey, new_container.id);     
      
    var url = this.ajaxLinks.get(new_container.id)
    
    if (!url) return;
      
    new_container.update(this.options.ajaxLoader);
    
    new Ajax.Updater(new_container, url, { method: 'get', evalScripts: true });
  },
  
  resetActiveTab: function() {
    this.setActiveTab(this.activeLink);
  }
});
