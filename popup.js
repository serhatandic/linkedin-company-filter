let keywords = [];
let totalRemoved = 0;

// Load saved keywords and stats when popup opens
chrome.storage.sync.get(['keywords', 'totalRemoved'], function (result) {
	keywords = result.keywords || [];
	totalRemoved = result.totalRemoved || 0;
	updateKeywordList();
	updateStats();
});

document.getElementById('addKeyword').addEventListener('click', addKeyword);
document.getElementById('keyword').addEventListener('keypress', function (e) {
	if (e.key === 'Enter') {
		addKeyword();
	}
});

function addKeyword() {
	const keyword = document.getElementById('keyword').value.trim();
	if (keyword && !keywords.includes(keyword)) {
		keywords.push(keyword);
		updateKeywordList();
		saveKeywords();
		document.getElementById('keyword').value = '';

		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, {
				action: 'removeItems',
				keywords: keywords,
			});
		});
	}
}

function updateKeywordList() {
	const keywordsDiv = document.getElementById('keywords');
	keywordsDiv.innerHTML =
		'<h3>Blacklisted companies:</h3>' +
		keywords
			.map(
				(k, index) =>
					`<div class="keyword-item">
      <span>${k}</span>
      <span class="remove-btn" data-index="${index}">X</span>
     </div>`
			)
			.join('');

	// Add event listeners to remove buttons
	document.querySelectorAll('.remove-btn').forEach((btn) => {
		btn.addEventListener('click', function () {
			const index = parseInt(this.getAttribute('data-index'));
			keywords.splice(index, 1);
			updateKeywordList();
			saveKeywords();

			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				chrome.tabs.sendMessage(tabs[0].id, {
					action: 'removeItems',
					keywords: keywords,
				});
			});
		});
	});
}

function updateStats() {
	const statsDiv = document.getElementById('stats') || createStatsDiv();
	statsDiv.textContent = `Total entries removed: ${totalRemoved}`;
}

function createStatsDiv() {
	const statsDiv = document.createElement('div');
	statsDiv.id = 'stats';
	document.body.appendChild(statsDiv);
	return statsDiv;
}

function saveKeywords() {
	chrome.storage.sync.set({ keywords: keywords }, function () {
		console.log('Keywords saved');
	});
}

// Initialize the extension
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	chrome.scripting.executeScript({
		target: { tabId: tabs[0].id },
		files: ['content.js'],
	});
});

// Listen for stats updates from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'updateStats') {
		totalRemoved = request.totalRemoved;
		updateStats();
		chrome.storage.sync.set({ totalRemoved: totalRemoved });
	}
});

// Request current stats when popup opens
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	chrome.tabs.sendMessage(
		tabs[0].id,
		{ action: 'getStats' },
		function (response) {
			if (response) {
				totalRemoved = response.totalRemoved;
				updateStats();
			}
		}
	);
});
