let keywords = [];
let totalRemoved = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'removeItems') {
		keywords = request.keywords;
		removeItems();
	} else if (request.action === 'getStats') {
		sendResponse({ totalRemoved: totalRemoved });
	}
});

function removeItems() {
	let removedThisRun = 0;
	function remove() {
		let removed = false;
		document.querySelectorAll('li').forEach((li) => {
			if (keywords.some((keyword) => li.textContent.includes(keyword))) {
				li.remove();
				removed = true;
				removedThisRun++;
			}
		});
		if (removed) {
			remove(); // Recurse to catch any newly exposed elements
		}
	}
	remove();
	totalRemoved += removedThisRun;
	chrome.runtime.sendMessage({
		action: 'updateStats',
		totalRemoved: totalRemoved,
	});
}

// Apply saved keywords when page loads
chrome.storage.sync.get(['keywords'], function (result) {
	if (result.keywords && result.keywords.length > 0) {
		keywords = result.keywords;
		removeItems();
	}
});

// Set up MutationObserver
const observer = new MutationObserver((mutations) => {
	removeItems();
});

// Start observing the document with the configured parameters
observer.observe(document.body, {
	childList: true,
	subtree: true,
});
