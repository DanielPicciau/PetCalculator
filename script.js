(() => {
    const ready = (fn) => {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn, { once: true });
        } else {
            fn();
        }
    };

    ready(() => {
        // Onboarding (dropdown: "Add a pet")
        const addPetBtn = document.getElementById("addPetBtn");
        const petMenu = document.getElementById("petMenu");
        const addPetLabel = document.getElementById("addPetLabel");

        if (addPetBtn && petMenu && addPetLabel) {
            const isOpen = () => !petMenu.classList.contains("hidden");
            const open = () => {
                petMenu.classList.remove("hidden");
                addPetBtn.setAttribute("aria-expanded", "true");
            };
            const close = () => {
                petMenu.classList.add("hidden");
                addPetBtn.setAttribute("aria-expanded", "false");
            };
            const toggle = () => (isOpen() ? close() : open());

            addPetBtn.addEventListener("click", (e) => {
                e.preventDefault();
                toggle();
            });

            petMenu.addEventListener("click", (e) => {
                const target = e.target;
                if (!(target instanceof HTMLElement)) return;
                const item = target.closest("[data-pet]");
                if (!(item instanceof HTMLElement)) return;

                const pet = item.getAttribute("data-pet");
                if (!pet) return;

                addPetLabel.textContent = pet;
                addPetBtn.dataset.selectedPet = pet;
                close();
            });

            document.addEventListener("click", (e) => {
                if (!isOpen()) return;
                const target = e.target;
                if (!(target instanceof Node)) return;
                if (addPetBtn.contains(target) || petMenu.contains(target)) return;
                close();
            });

            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") close();
            });
        }

        // Onboarding Part 2: Extract pets from localStorage and allow selection
        const petSelect = document.getElementById("pet-select");
        const petDetailsTitle = document.getElementById("pet-details-title");

        if (petSelect instanceof HTMLSelectElement && petDetailsTitle) {
            let pets = [];
            try {
                const petsRaw = localStorage.getItem("pets");
                if (petsRaw) pets = JSON.parse(petsRaw);
            } catch {
                pets = [];
            }

            petSelect.innerHTML = '<option value="" disabled selected>Select your pet</option>';
            pets.forEach((pet, idx) => {
                const opt = document.createElement("option");
                opt.value = String(idx);
                opt.textContent = (pet && pet.name) ? pet.name : `Pet ${idx + 1}`;
                petSelect.appendChild(opt);
            });

            petSelect.addEventListener("change", () => {
                const selectedIdx = Number(petSelect.value);
                if (pets[selectedIdx]) {
                    petDetailsTitle.textContent = `${pets[selectedIdx].name || "Pet"}’s Details`;
                } else {
                    petDetailsTitle.textContent = "Pet’s Details";
                }
            });

            if (pets.length === 1) {
                petSelect.selectedIndex = 1;
                petSelect.dispatchEvent(new Event("change"));
            }
        }
    });
})();
