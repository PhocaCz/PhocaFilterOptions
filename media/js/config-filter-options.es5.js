"use strict";

/*
 * @package Joomla
 * @copyright Copyright (C) 2005 Open Source Matters. All rights reserved.
 * @license http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
 *
 * @extension Phoca Filter Options System Plugin
 * @copyright Copyright (C) Jan Pavelka www.phoca.cz
 * @license http://www.gnu.org/copyleft/gpl.html GNU/GPL
 */

document.addEventListener("DOMContentLoaded", function () {

	function phFilterOptionsQuote(str) {
		return str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
	};

	function phRemoveElementsByClass(parentElem, className) {
		var elements = parentElem.getElementsByClassName(className);
		while (elements.length > 0) {
			elements[0].parentNode.removeChild(elements[0]);
		}
	}

	function filterOptions(str) {

		var hideElements = '.tab-pane .alert, .tab-pane .field-spacer, fieldset legend, #sendtestmail, .tab-description, .tab-pane h3, .ph-admin-additional-box';
		var hideElementBoxes = '.tab-header, .ph-options-head, .ph-options-head-expert';
		var tab = '#configTabs div button';
		var tabContent = '#configTabs > joomla-tab-element';
		var excludeTabs = '#page-filters, #page-permissions, #permissions, #permissions_label';
		var itemParameter = '.control-group .control-label label';
		var itemParameterBox = '.control-group';
		var tabRow = '.tab-pane .row div';
		var tabFieldset = '.tab-pane .row div fieldset';

		// Get active tab and return it back after filtering
		var activeTab = false;
		document.querySelectorAll(tabContent).forEach(function (elem) {

			/*if (elem.getAttribute('aria-hidden') == 'true') {
   	
   } else {
   	activeTab = elem;
   }*/
			/*
   * Unfortunately, every Joomla version changes dramatically and therefore this part must change as well 
   * So this is in fact not a final solution
   * Phoca Filter Options must set all tabs as active so when it does, then it is not possible to detect the original active tab
   * This is why we differentiate between
   * active="true" ... standard active tab set by system
   * active="specific" ... active tab set by this plugin to be able to search all tabs
   * In both cases, active is active for Joomla core system ... FOR NOW
   */

			if (elem.hasAttribute('active') && elem.getAttribute('active') != 'specific') {
				activeTab = elem;
			}
		});

		if (str.length > 0) {

			/* Make tabs disabled */
			document.querySelectorAll(tab).forEach(function (elem) {
				elem.classList.add('disabled');
				elem.classList.add('phFilterOptionsDisabled');
			});

			/* Make all tab contents active so they can be searched */
			document.querySelectorAll(tabContent).forEach(function (elem) {

				//elem.setAttribute('active', true);
				if (!elem.hasAttribute('active')) {
					elem.setAttribute('active', "specific");
				}
				elem.classList.add('phFilterOptionsNoStyle');
				phRemoveElementsByClass(elem, 'phFilterOptionsHeader');

				// Add tab information (yellow box displayed in filter results)
				var newItem = document.createElement("div");
				newItem.classList.add('phFilterOptionsHeader');
				var textnode = document.createTextNode(elem.getAttribute('name'));
				newItem.appendChild(textnode);
				elem.insertBefore(newItem, elem.childNodes[0]);
			});

			/* Hide some specific parts which are not neccessary to display in search results */
			document.querySelectorAll(hideElements).forEach(function (elem) {
				elem.classList.add('phFilterOptionsHidden');
				elem.parentElement.classList.add('phFilterOptionsFieldset');
			});
			/* Hide boxes of specific parts which are not neccessary to display in search results */
			document.querySelectorAll(hideElementBoxes).forEach(function (elem) {
				elem.parentElement.parentElement.classList.add('phFilterOptionsHidden');
			});

			/* Hide tab items which cannot be filtered */
			document.querySelectorAll(excludeTabs).forEach(function (elem) {
				elem.classList.add('disabled');
			});

			/* Cancel columns in Global Configuration */
			document.querySelectorAll(tabRow).forEach(function (elem) {
				elem.classList.add('filter-options-col');
			});
			document.querySelectorAll(tabFieldset).forEach(function (elem) {
				elem.classList.add('filter-options-fieldset');
			});

			/* Foreach each item and check if it fits criteria. If yes, display it */
			document.querySelectorAll(itemParameter).forEach(function (elem) {
				var ePP = elem.parentElement.parentElement;
				var item = elem.innerHTML;
				//ePP.style.display = "none";
				ePP.classList.add('phFilterOptionsHidden');

				if (item && typeof item == "string") {
					var re = new RegExp(phFilterOptionsQuote(str), "i");
					var res = item.match(re);

					if (res) {
						//ePP.style.display = "block";
						ePP.classList.remove('phFilterOptionsHidden');
					}
				}
			});
			return;
		}

		/* Remove disabled class from all tabs */
		document.querySelectorAll(tab).forEach(function (elem) {
			elem.classList.remove('disabled');
			elem.classList.remove('phFilterOptionsDisabled');
		});

		/* Remove active class from all tab contents */
		document.querySelectorAll(tabContent).forEach(function (elem) {

			elem.removeAttribute('active');
			//elem.setAttribute("aria-hidden", "true");
			elem.classList.remove('phFilterOptionsNoStyle');
			phRemoveElementsByClass(elem, 'phFilterOptionsHeader');
		});

		/* Return back the active tab */

		if (activeTab) {
			activeTab.setAttribute("active", true);
			//activeTab.removeAttribute("aria-hidden");	
		}

		/* Display all hidden parts back - undo the changes we've made when searching */
		document.querySelectorAll(hideElements).forEach(function (elem) {
			elem.classList.remove('phFilterOptionsHidden');
			elem.parentElement.classList.remove('phFilterOptionsFieldset');
		});

		/* Display all hidden boxex of parts back - undo the changes we've made when searching */
		document.querySelectorAll(hideElementBoxes).forEach(function (elem) {
			elem.parentElement.parentElement.classList.remove('phFilterOptionsHidden');
		});

		/* Display all hidden paremter items back - undo the changes we've made when searching */
		document.querySelectorAll(itemParameterBox).forEach(function (elem) {
			elem.classList.remove('phFilterOptionsHidden');
		});

		/* Display items which cannot be filtered - undo the changes we've made when searching */
		document.querySelectorAll(excludeTabs).forEach(function (elem) {
			elem.classList.remove('disabled');
		});

		/* Cancel canceling of columns ( :-) ) in Global Configuration */
		document.querySelectorAll(tabRow).forEach(function (elem) {
			elem.classList.remove('filter-options-col');
		});
		document.querySelectorAll(tabFieldset).forEach(function (elem) {
			elem.classList.remove('filter-options-fieldset');
		});
	}

	/* Events */
	document.getElementById("filterOptionsClear").addEventListener("click", function (event) {
		document.getElementById("filterOptionsInput").value = "";
		filterOptions("");
	});

	document.getElementById("filterOptionsInput").addEventListener("input", function (event) {
		var eV = event.currentTarget.value;
		filterOptions(eV);
	});
});