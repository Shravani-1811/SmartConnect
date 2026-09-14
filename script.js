function showContactForm() {
    document.getElementById("contactForm").style.display="block";
}
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let editIndex = -1;
function addContact() {

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;

    if (name === "" || phone === "" || email === "") {
        alert("Please fill all fields!");
        return;
    }

    if (phone.length !== 10 || isNaN(phone)) {
        alert("Please enter a valid 10-digit phone number!");
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        alert("Please enter a valid email!");
        return;
    }

    let contact = {
        name: name,
        phone: phone,
        email: email,
        favorite: editIndex === -1 ? false : contacts[editIndex].favorite
    };

    if (editIndex === -1) {
        contacts.push(contact);

        fetch(`http://localhost:18080/add?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}`);
    } else {

    let oldName = contacts[editIndex].name;

    contacts[editIndex] = contact;

    fetch(`http://localhost:18080/update?name=${encodeURIComponent(oldName)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}`)
        .then(response => response.text())
        .then(data => console.log(data));
}

    editIndex = -1;

    localStorage.setItem("contacts", JSON.stringify(contacts));
    displayContacts();

    alert("Contact Saved Successfully!");
}
async function displayContacts() {

    let contactList = document.getElementById("contactList");

    document.getElementById("totalContacts").innerText = contacts.length;
    document.getElementById("favoriteCount").innerText =
        contacts.filter(c => c.favorite).length;

    contactList.innerHTML = "";

    for (let i = 0; i < contacts.length; i++) {

        let contact = contacts[i];

        contactList.innerHTML += `
            <div class="contact-card">
                <h3>${contact.name}</h3>
                <p>📞 ${contact.phone}</p>
                <p>📧 ${contact.email}</p>

                <button onclick="toggleFavorite(${i})">
                    ${contact.favorite ? "⭐ Unfavorite" : "⭐ Favorite"}
                </button>

                <button onclick="editContact(${i})">✏️ Edit</button>

                <button onclick="deleteContact(${i})">🗑️ Delete</button>
            </div>
        `;
    }
}
function toggleFavorite(index) {
    contacts[index].favorite = !contacts[index].favorite;

    localStorage.setItem("contacts", JSON.stringify(contacts));

    displayContacts();
}
function searchContacts() {
    let searchText = document.getElementById("search").value.toLowerCase();

    let filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchText)
    );

    let contactList = document.getElementById("contactList");
    contactList.innerHTML = "";

    for (let i = 0; i < filteredContacts.length; i++) {
        let contact = filteredContacts[i];

        contactList.innerHTML += `
    <div class="contact-card">
        <h3>${contact.name}</h3>
        <p>📞 ${contact.phone}</p>
        <p>📧 ${contact.email}</p>

        <button onclick="toggleFavorite(${contacts.indexOf(contact)})">
            ${contact.favorite ? "⭐ Unfavorite" : "⭐ Favorite"}
        </button>

        <button onclick="editContact(${contacts.indexOf(contact)})">
            ✏️ Edit
        </button>

        <button onclick="deleteContact(${contacts.indexOf(contact)})">
            🗑️ Delete
        </button>
    </div>
`;
    }
}
function deleteContact(index) {
    contacts.splice(index, 1);
    localStorage.setItem("contacts", JSON.stringify(contacts));
    displayContacts();
}
displayContacts();

function sortContacts() {
    contacts.sort((a, b) => a.name.localeCompare(b.name));

    localStorage.setItem("contacts", JSON.stringify(contacts));

    displayContacts();
}
function editContact(index) {
    let contact = contacts[index];

    document.getElementById("name").value = contact.name;
    document.getElementById("phone").value = contact.phone;
    document.getElementById("email").value = contact.email;

    editIndex = index;

    document.getElementById("contactForm").style.display = "block";
}