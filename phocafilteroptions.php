<?php
/* @package Joomla
 * @copyright Copyright (C) Open Source Matters. All rights reserved.
 * @license http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
 * @extension Phoca Extension
 * @copyright Copyright (C) Jan Pavelka www.phoca.cz
 * @license http://www.gnu.org/copyleft/gpl.html GNU/GPL
 */
defined( '_JEXEC' ) or die( 'Restricted access' );
jimport( 'joomla.plugin.plugin' );

class plgSystemPhocaFilteroptions extends JPlugin
{	
	
	public function __construct(& $subject, $config) {
		
		$this->loadLanguage('plg_system_phocafilteroptions');
		parent::__construct($subject, $config);
	}
	
	
	function onBeforeRender() {
		
		
		$app 		= JFactory::getApplication();
		$option 	= $app->input->get('option', '', 'string');
		$view 		= $app->input->get('view', '', 'string');
		
		if ($app->getName() != 'administrator') { return true;}
		
		if ($option != 'com_config') { return true;}
		if ($view != 'component') { return true;}
		
		
		// Add JS
		$document	= JFactory::getDocument();
		$js = '<script type="text/javascript">
jQuery(document).ready(function() {
	
	function phFilterQuote(str) {
		return str.replace(/[-[\\]{}()*+!<=:?.\/\\\\^$|#\\s,]/g, "\\\\$&");
	};
	
	jQuery("#phFilterOptions").on("input", function() {
		
		var tV = this.value;
	
		if (tV.length > 0) {
			
			jQuery("#configTabs li").addClass("active");
			jQuery("#configContent div.tab-pane").addClass("active");
			jQuery(".ph-options-head").parent().parent().hide();
			jQuery(".ph-options-head-expert").parent().parent().hide();
			jQuery(".field-spacer").hide();
			jQuery(".tab-description").hide();

			jQuery(".control-group .control-label label").filter(function() {				
				var tPP		= jQuery(this).parent().parent();
				var item	= jQuery(this).attr("data-original-title");
				tPP.hide();
				
				if (item && typeof item == "string") {
					var re = new RegExp(phFilterQuote(tV), "i");
					var res = item.match(re);
					if (res) {
						tPP.show();
					}
				}
			});
		
		} else {
			
			jQuery("#configTabs li").removeClass("active");
			jQuery("#configTabs li:first").addClass("active");
			jQuery("#configContent div.tab-pane").removeClass("active");
			jQuery("#configContent div.tab-pane:first").addClass("active");
			jQuery(".ph-options-head").parent().parent().show();
			jQuery(".ph-options-head-expert").parent().parent().show();
			jQuery(".field-spacer").show();
			jQuery(".tab-description").show();
			
			jQuery(".control-group").show();
			
		}
	});
});
</script>';
		
		$document->addCustomTag($js);

		return true;
	}
	
	function onAfterRender() {
		
		
		$app 		= JFactory::getApplication();
		$option 	= $app->input->get('option', '', 'string');
		$view 		= $app->input->get('view', '', 'string');
		
		if ($app->getName() != 'administrator') { return true;}
		
		if ($option != 'com_config') { return true;}
		if ($view != 'component') { return true;}
		
		// Add HTML
		$buffer = JResponse::getBody();
		$addHtml = '<div class="row-fluid">'
					  .'<div class="span2"></div>'
					  .'<div class="span10"><input type="text" id="phFilterOptions" placeholder="'.JText::_('PLG_SYSTEM_PHOCAFILTEROPTIONS_TYPE_FILTER_OPTIONS').'" /></div>'
				  .'</div>';
		
		// Use the easiest and quickest replace method
		$buffer	= str_replace("<form action=", $addHtml . "<form action=", $buffer);
		JResponse::setBody($buffer);

		return true;
	}
}
?>