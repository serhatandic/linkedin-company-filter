# LinkedIn Job Listing Filter Chrome Extension

## Overview

This Chrome extension allows users to create a blacklist of company names and automatically removes list items containing these names from web pages. It's useful for customizing web browsing experiences, particularly for job seekers, researchers, or anyone looking to filter out specific company-related content.

## Features

-   Add and remove companies from a blacklist
-   Automatically remove list items containing blacklisted company names from web pages
-   Real-time updates as content is removed
-   Persistent storage of blacklist and removal statistics
-   Works on dynamically loaded content

## Installation

1. Clone this repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Click on the extension icon in the Chrome toolbar to open the popup interface.
2. Enter a company name in the text field and click "Blacklist" or press Enter to add it to the blacklist.
3. View the list of blacklisted companies in the popup.
4. To remove a company from the blacklist, click the "X" next to its name.
5. The extension will automatically remove list items containing blacklisted company names from web pages you visit.
6. View the total number of removed items in the statistics section of the popup.

## File Structure

-   `manifest.json`: Extension configuration file
-   `popup.html`: HTML structure for the extension popup
-   `popup.js`: JavaScript for managing the popup interface and user interactions
-   `content.js`: Content script that runs on web pages to remove blacklisted items

## Technical Details

-   Uses Chrome's Storage API for persistent data storage
-   Implements MutationObserver to handle dynamically loaded content
-   Utilizes Chrome's messaging system for communication between popup and content scripts

## Development

To modify or enhance the extension:

1. Edit the relevant files (`popup.html`, `popup.js`, `content.js`)
2. Make sure to update `manifest.json` if adding new permissions or scripts
3. Reload the extension in `chrome://extensions/` after making changes

## Privacy Note

This extension operates locally and does not send any data to external servers. All blacklist data and statistics are stored in your local Chrome storage.

## Contributing

Contributions to improve the extension are welcome. Please feel free to submit pull requests or create issues for bugs and feature requests.

## Support

For support, please open an issue in the GitHub repository.
