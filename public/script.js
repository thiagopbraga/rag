document.getElementById("uploadButton").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file to upload.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/document/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("File uploaded successfully!");
    } else {
      const error = await response.json();
      alert(`Error uploading file: ${error.message}`);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("An error occurred while uploading the file.");
  }
});

document
  .getElementById("questionButton")
  .addEventListener("click", async () => {
    const questionInput = document.getElementById("questionInput");
    const question = questionInput.value;
    if (!question) {
      alert("Please enter a question.");
      return;
    }

    try {
      const response = await fetch("/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      console.log("Received answer:", data);
      document.getElementById("answer").innerText = data.answer;
      document.getElementById("sources").innerHTML = data.sources
        .map((s, idx) => `<li style='list-style:none'>[${idx+1}]: página${s.page}</li>`)
        .join("");
    } catch (error) {
      console.error("Error sending query:", error);
      alert("An error occurred while sending the query.");
    }
  });
