
document.getElementById("download-btn").addEventListener("click", () => {
  console.log("Download button clicked. Sending message to background script...");
  chrome.runtime.sendMessage({ action: "exportData" }, response => {
    if (response) {
      if (response.status === "exported") {
        console.log("Export successful. CSV file should download now.");
      } else if (response.status === "no_data") {
        console.warn("No data available to export.");
      } else {
        console.error("Export failed. Unknown response:", response.status);
      }
    } else {
      console.error("No response from background script.");
    }
  });
});

chrome.runtime.sendMessage({ action: "getData" }, response => {
  const dataList = document.getElementById("data-list");
  const data = response.data || [];

  console.log("Loaded data for popup:", data.length, "records.");

  if (data.length === 0) {
    dataList.innerHTML = "<li>No data captured yet.</li>";
  } else {
    data.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<span class="name">${item.name}</span>: <span class="email">${item.email}</span>`;
      dataList.appendChild(li);
    });
  }
});
