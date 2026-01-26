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
