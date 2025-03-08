// Function to handle member registration
function registerMember(event) {
    event.preventDefault();
    
    const form = event.target;
    const firstName = form['first-name'].value;
    const lastName = form['last-name'].value;
    const email = form['email'].value;
    const password = form['password'].value;

    // Get existing members or initialize empty array
    const members = JSON.parse(localStorage.getItem('members') || '[]');

    // Add new member
    members.push({
        firstName,
        lastName,
        email,
        password: btoa(password) // Basic password encoding (not secure for production)
    });

    // Save to localStorage
    localStorage.setItem('members', JSON.stringify(members));

    // Clear form
    form.reset();
    alert('Đăng ký thành công!');
}

// Function to display members in admin page
function displayMembers() {
    const memberList = document.getElementById('memberList');
    if (!memberList) return; // Exit if not on admin page

    const members = JSON.parse(localStorage.getItem('members') || '[]');

    memberList.innerHTML = members.map(member => `
        <tr>
            <td>${member.lastName}</td>
            <td>${member.firstName}</td>
            <td>${member.email}</td>
        </tr>
    `).join('');
}

// Call displayMembers when on admin page
if (window.location.pathname.includes('admin.html')) {
    displayMembers();
}