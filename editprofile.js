// Save profile from edit form
function saveProfile(event) {
  event.preventDefault();
  const name = document.getElementById("businessNameInput").value;
  const contact = document.getElementById("contactInput").value;
  const address = document.getElementById("addressInput").value;
  const logo = document.getElementById("logoInput").value || "https://via.placeholder.com/100";

  const profile = { name, contact, address, logo };
  localStorage.setItem("businessProfile", JSON.stringify(profile));
  window.location.href = "BUSINESS PROFILE.html";
}

// Load profile to homepage
function loadProfile() {
  const profile = JSON.parse(localStorage.getItem("businessProfile"));
  if (profile) {
    document.getElementById("businessName").innerText = profile.name;
    document.getElementById("contact").innerText = profile.contact;
    document.getElementById("address").innerText = profile.address;
    document.getElementById("logo").src = profile.logo;
  }
}

// Load profile into edit form
function loadForm() {
  const profile = JSON.parse(localStorage.getItem("businessProfile"));
  if (profile) {
    document.getElementById("businessNameInput").value = profile.name;
    document.getElementBDId("contactInput").value = profile.contact;
    document.getElementById("addressInput").value = profile.address;
    document.getElementById("logoInput").value = profile.logo;
  }
}
