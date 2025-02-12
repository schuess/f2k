
(function() {
  console.log("f2k name and email capture initialized...");

  let capturedData = new Set();  // Use a Set to avoid duplicates

  function captureData() {
    console.log("Running email capture...");
    
    // Capture the name using the verified XPath
    let nameNode = document.evaluate(
      '//*[@id="mount_0_0_ag"]/div/div[1]/div/div[4]/div/div/div[1]/div/div[2]/div/div/div/div/div[1]/div[3]/div/div/div[1]/div/div[2]/div/div/div/div[1]/span/span',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    let name = nameNode ? nameNode.textContent.trim() : "Unknown";
    console.log("Captured Name:", name);

    // Capture all emails using the selector
    let spans = Array.from(document.querySelectorAll('span.x193iq5w')).filter(span => /\S+@\S+\.\S+/.test(span.textContent));

    console.log(`Found ${spans.length} elements with valid emails.`);

    spans.forEach(span => {
      let email = span.textContent.trim().split(' ')[0];

      if (!capturedData.has(email)) {
        console.log("Captured Name:", name, "| Captured Email:", email);
        capturedData.add(email);
        chrome.runtime.sendMessage({ action: "logData", data: { name: name, email: email } });
      }
    });
  }

  // Use MutationObserver to monitor the DOM and capture emails and names when they appear
  const observer = new MutationObserver(() => {
    console.log("DOM changed, checking for new emails...");
    captureData();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  console.log("MutationObserver is now watching for changes...");
})();
