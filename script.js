// Signup page: Validate and continue
document.addEventListener('DOMContentLoaded', function () {
    const signupBtn = document.getElementById('signup-continue-btn');
    if (signupBtn) {
        signupBtn.addEventListener('click', function () {
            const form = signupBtn.closest('form');
            if (!form) return;
            const fullName = form.querySelector('input[name="fullName"]').value.trim();
            const email = form.querySelector('input[name="email"]').value.trim();
            const phone = form.querySelector('input[name="phone"]').value.trim();
            const password = form.querySelector('input[name="password"]').value;
            const passwordConfirmation = form.querySelector('input[name="passwordConfirmation"]').value;
            // Simple validation
            if (!fullName || !email || !phone || !password || !passwordConfirmation) {
                alert('Please fill in all fields.');
                return;
            }
            if (password !== passwordConfirmation) {
                alert('Passwords do not match.');
                return;
            }
            // Optionally, save user data to localStorage or send to backend here
            // For now, just continue to onboarding
            window.location.href = 'onboarding.html';
        });
    }
});
<<<<<<< HEAD
// Onboarding Part 1: Add pets and save to localStorage
document.addEventListener('DOMContentLoaded', function () {
    const petForm = document.getElementById('pet-form');
    const petNameInput = document.getElementById('pet-name');
    const petListDiv = document.getElementById('pet-list');
    const continueBtn = document.getElementById('continue-btn');
    if (petForm && petNameInput && petListDiv && continueBtn) {
        // Load pets from localStorage
        let pets = [];
        try {
            const petsRaw = localStorage.getItem('pets');
            if (petsRaw) {
                pets = JSON.parse(petsRaw);
            }
        } catch (e) {
            pets = [];
        }
        function renderPets() {
            petListDiv.innerHTML = '';
            if (pets.length === 0) {
                petListDiv.textContent = 'No pets added yet.';
                return;
            }
            pets.forEach((pet, idx) => {
                const div = document.createElement('div');
                div.className = 'flex items-center gap-2 mb-2';
                div.innerHTML = `<span class='font-semibold'>${pet.name}</span> <button data-idx='${idx}' class='remove-pet bg-red-500 text-white px-2 rounded'>Remove</button>`;
                petListDiv.appendChild(div);
            });
        }
        renderPets();
        petForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = petNameInput.value.trim();
            if (name) {
                pets.push({ name });
                localStorage.setItem('pets', JSON.stringify(pets));
                petNameInput.value = '';
                renderPets();
            }
        });
        petListDiv.addEventListener('click', function (e) {
            if (e.target.classList.contains('remove-pet')) {
                const idx = e.target.getAttribute('data-idx');
                pets.splice(idx, 1);
                localStorage.setItem('pets', JSON.stringify(pets));
                renderPets();
            }
        });
        continueBtn.addEventListener('click', function () {
            if (pets.length === 0) {
                alert('Please add at least one pet before continuing.');
                return;
            }
            window.location.href = 'onboarding-part-2.html';
        });
    }
});
// Onboarding Part 2: Extract pets from localStorage and allow selection
document.addEventListener('DOMContentLoaded', function () {
    const petSelect = document.getElementById('pet-select');
    const petDetailsTitle = document.getElementById('pet-details-title');
    // Only run if onboarding-part-2 page
    if (petSelect && petDetailsTitle) {
        // Get pets from localStorage (assume key 'pets', array of objects with 'name')
        let pets = [];
        try {
            const petsRaw = localStorage.getItem('pets');
            if (petsRaw) {
                pets = JSON.parse(petsRaw);
            }
        } catch (e) {
            pets = [];
=======
(() => {
    const ready = (fn) => {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn, { once: true });
        } else {
            fn();
>>>>>>> 7d1e8a2a7f691c249fde47928396b83816ce2045
        }
    };

    ready(() => {
        // Onboarding (dropdown: "Add a pet")
        const addPetBtn = document.getElementById("addPetBtn");
        const petMenu = document.getElementById("petMenu");
        const addPetLabel = document.getElementById("addPetLabel");

        // Onboarding Part 1: Add pets and save to localStorage
        document.addEventListener('DOMContentLoaded', function () {
            const petForm = document.getElementById('pet-form');
            const petNameInput = document.getElementById('pet-name');
            const petListDiv = document.getElementById('pet-list');
            const continueBtn = document.getElementById('continue-btn');
            if (petForm && petNameInput && petListDiv && continueBtn) {
                // Load pets from localStorage
                let pets = [];
                try {
                    const petsRaw = localStorage.getItem('pets');
                    if (petsRaw) {
                        pets = JSON.parse(petsRaw);
                    }
                } catch (e) {
                    pets = [];
                }
                function renderPets() {
                    petListDiv.innerHTML = '';
                    if (pets.length === 0) {
                        petListDiv.textContent = 'No pets added yet.';
                        return;
                    }
                    pets.forEach((pet, idx) => {
                        const div = document.createElement('div');
                        div.className = 'flex items-center gap-2 mb-2';
                        div.innerHTML = `<span class='font-semibold'>${pet.name}</span> <button data-idx='${idx}' class='remove-pet bg-red-500 text-white px-2 rounded'>Remove</button>`;
                        petListDiv.appendChild(div);
                    });
                }
                renderPets();
                petForm.addEventListener('submit', function (e) {
                    e.preventDefault();
                    const name = petNameInput.value.trim();
                    if (name) {
                        pets.push({ name });
                        localStorage.setItem('pets', JSON.stringify(pets));
                        petNameInput.value = '';
                        renderPets();
                    }
                });
                petListDiv.addEventListener('click', function (e) {
                    if (e.target.classList.contains('remove-pet')) {
                        const idx = e.target.getAttribute('data-idx');
                        pets.splice(idx, 1);
                        localStorage.setItem('pets', JSON.stringify(pets));
                        renderPets();
                    }
                });
                continueBtn.addEventListener('click', function () {
                    if (pets.length === 0) {
                        alert('Please add at least one pet before continuing.');
                        return;
                    }
                    window.location.href = 'onboarding-part-2.html';
                });
            }
        });
        // Onboarding Part 2: Extract pets from localStorage and allow selection
        document.addEventListener('DOMContentLoaded', function () {
            const petSelect = document.getElementById('pet-select');
            const petDetailsTitle = document.getElementById('pet-details-title');
            // Only run if onboarding-part-2 page
            if (petSelect && petDetailsTitle) {
                // Get pets from localStorage (assume key 'pets', array of objects with 'name')
                let pets = [];
                try {
                    const petsRaw = localStorage.getItem('pets');
                    if (petsRaw) {
                        pets = JSON.parse(petsRaw);
                    }
                } catch (e) {
                    pets = [];
                }
                // Populate dropdown
                petSelect.innerHTML = '<option value="" disabled selected>Select your pet</option>';
                pets.forEach((pet, idx) => {
                    const opt = document.createElement('option');
                    opt.value = idx;
                    opt.textContent = pet.name || `Pet ${idx + 1}`;
                    petSelect.appendChild(opt);
                });
                // Update details title on change
                petSelect.addEventListener('change', function () {
                    const selectedIdx = petSelect.value;
                    if (pets[selectedIdx]) {
                        petDetailsTitle.textContent = `${pets[selectedIdx].name || 'Pet'}’s Details`;
                    } else {
                        petDetailsTitle.textContent = 'Pet’s Details';
                    }
                });
                // If only one pet, select it by default
                if (pets.length === 1) {
                    petSelect.selectedIndex = 1;
                    petSelect.dispatchEvent(new Event('change'));
                }
            }
        });
