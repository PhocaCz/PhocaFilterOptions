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
	//	if ($view != 'component') { return true;}
		
		
		// Add JS
		$document	= JFactory::getDocument();
		$document->addScript(JURI::root(true).'/media/plg_system_phocafilteroptions/js/config-filter-options.js');
		JHtml::stylesheet('media/plg_system_phocafilteroptions/css/filter-options.css' );
		return true;
	}
	
	function onAfterRender() {
		
		
		$app 		= JFactory::getApplication();
		$option 	= $app->input->get('option', '', 'string');
		$view 		= $app->input->get('view', '', 'string');
		
		if ($app->getName() != 'administrator') { return true;}
		
		if ($option != 'com_config') { return true;}
		//if ($view != 'component') { return true;}
		
		// Add HTML
		$buffer = JResponse::getBody();
		$addHtml = '<div class="row-fluid">'
					  .'<div class="span2"></div>'
					  .'<div class="span10"><form class="form-inline"><input type="text" id="filterOptionsInput" placeholder="'.JText::_('PLG_SYSTEM_PHOCAFILTEROPTIONS_TYPE_FILTER_OPTIONS').'" /> <button type="button" id="filterOptionsClear" class="btn btn-primary" title="'. JText::_('JSEARCH_FILTER_CLEAR').'">'.JText::_('JSEARCH_FILTER_CLEAR').'</button></form></div>'
				  .'</div>';
		
		// Use the easiest and quickest replace method
		$buffer	= str_replace("<form action=", $addHtml . "<form action=", $buffer);
		JResponse::setBody($buffer);

		return true;
	}
}
?>