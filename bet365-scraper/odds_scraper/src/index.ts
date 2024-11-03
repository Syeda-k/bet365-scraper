import { execSync } from 'child_process';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Determine whether this is for Odds or Results scraper
const isOddsScraper = process.env.SCRAPER_TYPE === 'odds';
const idLeague = isOddsScraper ? parseInt(process.env.ID_LEAGUE || '1', 10) : 0;

// Path to nircmd executable
const nircmdPath = process.env.NIRCMD_PATH || 'C:\\Users\\kiran\\Downloads\\nircmd-x64\\nircmd.exe';

// URL to open
const url = process.env.TARGET_URL || 'https://www.bet365.com/#/AVR/B146/R^1/';

// League selectors based on ID_LEAGUE
const leagueSelectors: { [key: number]: string } = {
  1: '[data-content="World Cup"]',
  2: '[data-content="Euro Cup"]',
  3: '[data-content="South American Super League"]',
  4: '[data-content="Premiership"]',
};

// Open the browser
console.log('Opening browser...');
execSync(`${nircmdPath} exec hide "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" "${url}"`);

const interactAndCapture = (): void => {
  // Wait for 2 minutes to ensure the page loads
  setTimeout(() => {
    console.log('2 minutes have passed. Taking initial screenshot...');

    // Path to save the initial screenshot
    const initialScreenshotPath = path.resolve(__dirname, 'initial_screenshot.png');

    // Use nircmd to take a screenshot
    execSync(`${nircmdPath} savescreenshot "${initialScreenshotPath}"`);
    console.log(`Initial screenshot saved to ${initialScreenshotPath}`);

    if (isOddsScraper) {
      // League selector based on ID_LEAGUE
      const leagueSelector = leagueSelectors[idLeague];
      if (!leagueSelector) {
        console.error(`Invalid ID_LEAGUE value: ${idLeague}`);
        return;
      }

      // JavaScript code to run in the browser console
      const jsCode = `
        (function() {
          const leagueSelector = ${JSON.stringify(leagueSelector)};
          const element = document.querySelector(leagueSelector);
          if (element) {
            console.log('Element found:', leagueSelector);
            element.click();
            console.log('Element clicked:', leagueSelector);
            return true;
          } else {
            console.log('Element not found:', leagueSelector);
            return false;
          }
        })();
      `;

      // Open DevTools, execute JavaScript code, and click on the element
      console.log('Opening DevTools and executing JavaScript code...');
      execSync(`${nircmdPath} sendkeypress ctrl+shift+j`);
      execSync(`${nircmdPath} sendkeys "${jsCode}"`);
      execSync(`${nircmdPath} sendkeypress enter`);
    }

    // Define a delay to ensure the click action has time to complete
    setTimeout(() => {
      // Path to save the final screenshot
      const finalScreenshotPath = path.resolve(__dirname, 'final_screenshot.png');

      // Use nircmd to take a screenshot after interacting with the elements
      console.log('Taking final screenshot...');
      execSync(`${nircmdPath} savescreenshot "${finalScreenshotPath}"`);
      console.log(`Final screenshot saved to ${finalScreenshotPath}`);

      console.log('The interaction has completed. Final screenshot taken.');
    }, 10000); // 10 seconds after interaction

  }, 60000); // Wait for 2 minutes (120000 milliseconds)
};

// Run the interaction and capture function
interactAndCapture();
