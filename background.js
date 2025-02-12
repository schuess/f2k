
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background script received message:", message.action);

  if (message.action === "logData") {
    chrome.storage.local.get({ capturedData: [] }, result => {
      let currentData = result.capturedData;
      currentData.push(message.data);
      chrome.storage.local.set({ capturedData: currentData }, () => {
        console.log("Data successfully stored:", message.data);
        sendResponse({ status: "success" });
      });
    });
    return true;  // Keep the message channel open for async response
  } else if (message.action === "getData") {
    chrome.storage.local.get({ capturedData: [] }, result => {
      console.log("Retrieved data for popup:", result.capturedData.length, "records");
      sendResponse({ data: result.capturedData });
    });
    return true;
  } else if (message.action === "exportData") {
    chrome.storage.local.get({ capturedData: [] }, result => {
      console.log("Attempting to export data. Records found:", result.capturedData.length);
      if (result.capturedData.length > 0) {
        exportToCsv("f2k-data.csv", result.capturedData);
        sendResponse({ status: "exported" });
      } else {
        console.warn("No data available to export.");
        sendResponse({ status: "no_data" });
      }
    });
    return true;  // Keep the message channel open for async response
  }
});


function exportToCsv(filename, data) {
  console.log("Generating CSV file...");

  let csvContent = "Name,Email\\n" + data.map(d => `${d.name},${d.email}`).join("\\n");
  let blob = new Blob([csvContent], { type: "text/csv" });

  let reader = new FileReader();
  reader.onload = function(event) {
    let blobUrl = event.target.result;
    chrome.downloads.download({
      url: blobUrl,
      filename: filename,
      saveAs: true
    }, downloadId => {
      if (chrome.runtime.lastError) {
        console.error("Download failed:", chrome.runtime.lastError.message);
      } else {
        console.log("Download started with ID:", downloadId);
      }
    });
  };
  reader.readAsDataURL(blob);
}
