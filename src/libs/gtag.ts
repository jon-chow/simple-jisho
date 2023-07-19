declare global {
  interface Window {
    gtag: any;
  }
}

interface IGAEvent {
	action: string;
	category: string;
	label: string;
	value: string;
}

/* -------------------------------------------------------------------------- */
/*                                   EXPORTS                                  */
/* -------------------------------------------------------------------------- */

// Tracking ID
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;


/**
 * Google Analytics measure page view.
 * @param {string} path
 */
function GAPageView(path: string) {
  window.gtag("config", GA_TRACKING_ID, {
		page_path: path,
	});
}

/**
 * Google Analytics measure event.
 * @param {string} action
 * @param {string} category
 * @param {string} label
 * @param {string} value
 */
function GAEvent({ action, category, label, value="" }: IGAEvent) {
  window.gtag("event", action, {
    event_category: category,
    event_label: JSON.stringify(label),
    value,
  });
}

export { GA_TRACKING_ID, GAPageView, GAEvent };