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
            const user = { fullName, email, phone, password };
            localStorage.setItem('pawplanUser', JSON.stringify(user));
            localStorage.setItem('pawplanAuth', 'true');
            // New account should start with a clean pet list.
            localStorage.removeItem('pets');
            window.location.href = './onboarding-step-1.html';
        });
    }
});

// Login page: Validate credentials and continue
document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('login-continue-btn');
    if (!loginBtn) return;

    loginBtn.addEventListener('click', function () {
        const form = loginBtn.closest('form');
        if (!form) return;

        const emailInput = form.querySelector('input[name="email"]');
        const passwordInput = form.querySelector('input[name="password"]');
        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';

        if (!email || !password) {
            alert('Please enter your email and password.');
            return;
        }

        let storedUser = null;
        try {
            const rawUser = localStorage.getItem('pawplanUser');
            storedUser = rawUser ? JSON.parse(rawUser) : null;
        } catch (e) {
            storedUser = null;
        }

        if (!storedUser) {
            alert('No account found. Please sign up first.');
            window.location.href = './signup.html';
            return;
        }

        const storedEmail = (storedUser.email || '').toLowerCase();
        if (email.toLowerCase() !== storedEmail) {
            alert('Email not recognized.');
            return;
        }

        if (password !== storedUser.password) {
            alert('Incorrect password.');
            return;
        }

        localStorage.setItem('pawplanAuth', 'true');

        let pets = [];
        try {
            const rawPets = localStorage.getItem('pets');
            pets = rawPets ? JSON.parse(rawPets) : [];
        } catch (e) {
            pets = [];
        }

        const nextPage = Array.isArray(pets) && pets.length > 0 ? './onboarding-step-2.html' : './onboarding-step-1.html';
        window.location.href = nextPage;
    });
});
//
// Onboarding Part 1: Add pets and save to localStorage
document.addEventListener('DOMContentLoaded', function () {
    const petForm = document.getElementById('pet-form');
    const petRowsDiv = document.getElementById('pet-rows');
    const addRowBtn = document.getElementById('add-pet-row-btn');
    const continueBtn = document.getElementById('continue-btn');
    if (!petForm || !petRowsDiv || !addRowBtn || !continueBtn) return;

    const petTypes = [
        'Dog',
        'Cat',

        'Rabbit',
        'Bird',
        'Hamster',
        'Guinea Pig',
        'Fish',
        'Turtle',
        'Lizard',
        'Snake',
        'Ferret',
        'Other',
    ];

    let pets = [];
    try {
        const petsRaw = localStorage.getItem('pets');
        if (petsRaw) {
            pets = JSON.parse(petsRaw);
        }
    } catch (e) {
        pets = [];
    }

    const normalizePets = function (rawPets) {
        if (!Array.isArray(rawPets)) return [];
        return rawPets.map(function (pet) {
            const type = typeof pet.type === 'string' ? pet.type : '';
            const name = typeof pet.name === 'string' ? pet.name : '';
            return { type, name };
        });
    };

    const escapeHtml = function (value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    const savePets = function (petsToSave) {
        localStorage.setItem('pets', JSON.stringify(petsToSave));
    };

    const buildOptionsHtml = function (selectedType) {
        const placeholder = '<option value="">Add a pet</option>';
        const options = petTypes
            .map(function (type) {
                const selectedAttr = type === selectedType ? ' selected' : '';
                return `<option value="${type}"${selectedAttr}>${type}</option>`;
            })
            .join('');
        return `${placeholder}${options}`;
    };

    const createRow = function (pet) {
        const row = document.createElement('div');
        row.dataset.petRow = 'true';
        row.className = 'flex items-center gap-4';

        const optionsHtml = buildOptionsHtml(pet.type);
        const safeName = escapeHtml(pet.name);

        row.innerHTML = `
            <div class="grid flex-grow grid-cols-1 gap-4 sm:grid-cols-2">
                <label class="flex h-16 w-full items-center gap-4 rounded-2xl border border-[#FF3B30] bg-white px-6 text-left text-lg font-semibold text-gray-500 whitespace-nowrap">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="currentColor"><path d="M12 10c-1.32 0-1.983.421-2.931 1.924l-.244.398l-.395.688l-.141.254c-.24.434-.571.753-1.139 1.142l-.55.365c-.94.627-1.432 1.118-1.707 1.955c-.124.338-.196.853-.193 1.28C4.7 19.693 5.898 21 7.5 21l.242-.006c.119-.006.234-.017.354-.034l.248-.043l.132-.028l.291-.073l.162-.045l.57-.17l.763-.243l.455-.136c.53-.15.94-.222 1.283-.222c.344 0 .753.073 1.283.222l.455.136l.764.242l.569.171l.312.084q.145.036.273.062l.248.043c.12.017.235.028.354.034L16.5 21c1.602 0 2.8-1.307 2.8-3c0-.427-.073-.939-.207-1.306c-.236-.724-.677-1.223-1.48-1.83l-.257-.19l-.528-.38c-.642-.47-1.003-.826-1.253-1.278l-.27-.485l-.252-.432C14.042 10.403 13.435 10 12 10m7.78-3h-.03c-1.219.02-2.35 1.066-2.908 2.504c-.69 1.775-.348 3.72 1.075 4.333c.256.109.527.163.801.163c1.231 0 2.38-1.053 2.943-2.504c.686-1.774.34-3.72-1.076-4.332A2.05 2.05 0 0 0 19.781 7zM9.025 3c-.112 0-.185.002-.27.015l-.093.016C7.13 3.237 6.265 5.02 6.554 6.886C6.826 8.611 8.016 10 9.474 10l.187-.005l.084-.01l.092-.016c1.533-.206 2.397-1.989 2.108-3.855C11.675 4.387 10.485 3 9.025 3"/><path d="M14.972 3c-1.459 0-2.647 1.388-2.916 3.113c-.29 1.867.574 3.65 2.174 3.867q.153.02.296.02c1.39 0 2.543-1.265 2.877-2.883l.041-.23c.29-1.867-.574-3.65-2.174-3.867a2 2 0 0 0-.298-.02M4.217 7c-.274 0-.544.054-.797.161c-1.426.615-1.767 2.562-1.078 4.335C2.905 12.947 4.052 14 5.283 14c.274 0 .544-.054.797-.161c1.426-.615 1.767-2.562 1.078-4.335C6.595 8.053 5.448 7 4.217 7"/></g></svg>
                    <select name="petType" class="min-w-0 flex-1 whitespace-nowrap bg-transparent text-lg font-semibold text-gray-600 focus:outline-none">
                        ${optionsHtml}
                    </select>
                </label>
                <label class="flex h-16 w-full items-center gap-4 rounded-2xl border border-[#FF3B30] bg-white px-6 text-left text-lg font-semibold text-gray-500">
                    <img src="../assets/icons/dog-collar.svg" alt="Collar" class="h-6 w-6 opacity-70" />
                    <input type="text" name="petName" placeholder="Add their name" value="${safeName}"
                        class="min-w-0 flex-1 bg-transparent text-lg font-semibold text-gray-700 placeholder:font-semibold placeholder:text-gray-500 focus:outline-none" />
                </label>
            </div>
            <button type="button" aria-label="Remove pet" class="remove-pet-row-btn inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-2xl font-extrabold leading-none text-gray-400 hover:bg-gray-100">&times;</button>
        `;

        return row;
    };

    const collectRowValues = function () {
        const rows = Array.from(petRowsDiv.querySelectorAll('[data-pet-row="true"]'));
        return rows.map(function (row) {
            const typeSelect = row.querySelector('select[name="petType"]');
            const nameInput = row.querySelector('input[name="petName"]');
            const type = typeSelect ? typeSelect.value.trim() : '';
            const name = nameInput ? nameInput.value.trim() : '';
            return { type, name };
        });
    };

    const collectPets = function (options) {
        const requireComplete = Boolean(options && options.requireComplete);
        const rows = collectRowValues();
        const completedPets = [];
        let hasIncomplete = false;

        rows.forEach(function (row) {
            const hasAnyValue = Boolean(row.type || row.name);
            if (!hasAnyValue) return;

            const isComplete = Boolean(row.type && row.name);
            if (isComplete) {
                completedPets.push({ type: row.type, name: row.name });
                return;
            }

            hasIncomplete = true;
        });

        if (requireComplete && hasIncomplete) {
            alert('Please choose a pet type and name for each pet.');
            return null;
        }

        return { pets: completedPets, hasIncomplete };
    };

    const updateContinueState = function () {
        const result = collectPets({ requireComplete: false });
        if (!result) return;

        const shouldDisable = result.pets.length === 0 || result.hasIncomplete;
        continueBtn.disabled = shouldDisable;
        continueBtn.classList.toggle('opacity-50', shouldDisable);
        continueBtn.classList.toggle('cursor-not-allowed', shouldDisable);
    };

    const renderRows = function (rowsToRender) {
        petRowsDiv.innerHTML = '';
        rowsToRender.forEach(function (pet) {
            petRowsDiv.appendChild(createRow(pet));
        });
        updateContinueState();
    };

    addRowBtn.addEventListener('click', function () {
        const rows = collectRowValues();
        rows.push({ type: '', name: '' });
        renderRows(rows);

        const nameInputs = petRowsDiv.querySelectorAll('input[name="petName"]');
        const lastNameInput = nameInputs[nameInputs.length - 1];
        if (lastNameInput) {
            lastNameInput.focus();
        }
    });

    petRowsDiv.addEventListener('input', updateContinueState);
    petRowsDiv.addEventListener('change', updateContinueState);
    petRowsDiv.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-pet-row-btn')) {
            const rows = collectRowValues();
            const rowElement = event.target.closest('[data-pet-row="true"]');
            const allRowElements = Array.from(petRowsDiv.querySelectorAll('[data-pet-row="true"]'));
            const index = allRowElements.indexOf(rowElement);

            if (index > -1) {
                rows.splice(index, 1);
            }

            if (rows.length === 0) {
                renderRows([{ type: '', name: '' }]);
            } else {
                renderRows(rows);
            }
        }
    });

    continueBtn.addEventListener('click', function () {
        const result = collectPets({ requireComplete: true });
        if (!result) return;

        if (result.pets.length === 0) {
            alert('Add at least one pet before continuing.');
            return;
        }

        savePets(result.pets);
        window.location.href = './onboarding-step-2.html';
    });

    pets = normalizePets(pets);
    renderRows(pets.length > 0 ? pets : [{ type: '', name: '' }]);
});

// Onboarding Part 2: Extract pets from localStorage and allow selection
document.addEventListener('DOMContentLoaded', function () {
    const petSelect = document.getElementById('pet-select');
    const petDetailsTitle = document.getElementById('pet-details-title');
    const petSizeSelect = document.getElementById('pet-size-select');
    const dietTypeSelect = document.getElementById('diet-type-select');
    const activityLevelSelect = document.getElementById('activity-level-select');
    const treatsToggle = document.getElementById('treats-toggle');
    const petSizeInfo = document.getElementById('pet-size-info');
    const dietTypeInfo = document.getElementById('diet-type-info');
    const activityLevelInfo = document.getElementById('activity-level-info');
    const continueNextBtn = document.getElementById('continue-next-btn');
    const saveDetailsBtn = document.getElementById('save-details-btn');
    const saveStatus = document.getElementById('save-status');
    const continueReason = document.getElementById('continue-reason');

    const isOnboardingPart2 = Boolean(
        petSelect &&
        petSizeSelect &&
        dietTypeSelect &&
        activityLevelSelect &&
        treatsToggle &&
        petSizeInfo &&
        dietTypeInfo &&
        activityLevelInfo &&
        continueNextBtn &&
        saveDetailsBtn &&
        saveStatus &&
        continueReason
    );
    if (!isOnboardingPart2) return;

    let pets = [];
    try {
        const petsRaw = localStorage.getItem('pets');
        pets = petsRaw ? JSON.parse(petsRaw) : [];
    } catch (e) {
        pets = [];
    }

    if (!Array.isArray(pets) || pets.length === 0) {
        alert('Please add at least one pet first.');
        window.location.href = './onboarding-step-1.html';
        return;
    }

    const normalizePets = function (rawPets) {
        if (!Array.isArray(rawPets)) return [];
        return rawPets.map(function (pet) {
            const type = typeof pet.type === 'string' ? pet.type : '';
            const name = typeof pet.name === 'string' ? pet.name : '';
            const size = typeof pet.size === 'string' ? pet.size : '';
            const diet = typeof pet.diet === 'string' ? pet.diet : '';
            const activity = typeof pet.activity === 'string' ? pet.activity : '';
            const treats = Boolean(pet.treats);
            return { type, name, size, diet, activity, treats };
        });
    };

    const savePets = function () {
        localStorage.setItem('pets', JSON.stringify(pets));
    };

    const detailInputs = [petSizeSelect, dietTypeSelect, activityLevelSelect, treatsToggle];
    const detailSelects = [petSizeSelect, dietTypeSelect, activityLevelSelect];

    const setDetailsDisabled = function (disabled) {
        detailInputs.forEach(function (input) {
            input.disabled = disabled;
        });
    };

    const updateSelectTone = function (selectEl) {
        const hasValue = Boolean(selectEl.value);
        selectEl.classList.toggle('text-gray-500', !hasValue);
        selectEl.classList.toggle('text-gray-700', hasValue);
    };

    const refreshSelectTones = function () {
        detailSelects.forEach(updateSelectTone);
    };

    const sizeInfoMap = {
        Small: '(Cat/Dog under 5 kg)',
        Medium: '(Dog 5-20 kg)',
        Large: '(Dog 20+ kg)',
    };

    const dietInfoMap = {
        Standard: '(GBP 0.002 per kcal)',
        Premium: '(GBP 0.005 per kcal)',
    };

    const activityInfoMap = {
        Low: '(Low activity)',
        Normal: '(Normal activity)',
        High: '(High activity / working / puppy)',
    };

    const detailInfos = [
        { select: petSizeSelect, info: petSizeInfo, map: sizeInfoMap },
        { select: dietTypeSelect, info: dietTypeInfo, map: dietInfoMap },
        { select: activityLevelSelect, info: activityLevelInfo, map: activityInfoMap },
    ];

    const updateInfoText = function (selectEl, infoEl, map) {
        const message = map[selectEl.value];
        if (!message) {
            infoEl.textContent = '';
            infoEl.classList.add('hidden');
            return;
        }
        infoEl.textContent = message;
        infoEl.classList.remove('hidden');
    };

    const refreshInfoTexts = function () {
        detailInfos.forEach(function (item) {
            updateInfoText(item.select, item.info, item.map);
        });
    };

    const requiredFieldLabels = {
        size: 'Size',
        diet: 'Diet Type',
        activity: 'Activity Level',
    };
    const requiredFields = Object.keys(requiredFieldLabels);

    const getPetName = function (pet, index) {
        if (!pet) return `Pet ${index + 1}`;
        return pet.name || `Pet ${index + 1}`;
    };

    const getDraftFromInputs = function () {
        return {
            size: petSizeSelect.value,
            diet: dietTypeSelect.value,
            activity: activityLevelSelect.value,
            treats: treatsToggle.checked,
        };
    };

    const applyDraftToInputs = function (draft) {
        const safeDraft = draft || { size: '', diet: '', activity: '', treats: false };
        petSizeSelect.value = safeDraft.size || '';
        dietTypeSelect.value = safeDraft.diet || '';
        activityLevelSelect.value = safeDraft.activity || '';
        treatsToggle.checked = Boolean(safeDraft.treats);
    };

    const getMissingFields = function (pet) {
        if (!pet) return requiredFields;
        return requiredFields.filter(function (field) {
            return !pet[field];
        });
    };

    const formatMissingFields = function (missingFields) {
        return missingFields.map(function (field) {
            return requiredFieldLabels[field];
        }).join(', ');
    };

    const setSaveStatus = function (message, tone) {
        saveStatus.textContent = message || '';
        saveStatus.classList.remove('text-gray-500', 'text-amber-600', 'text-[#0A7A0A]');
        if (tone === 'warning') {
            saveStatus.classList.add('text-amber-600');
            return;
        }
        if (tone === 'success') {
            saveStatus.classList.add('text-[#0A7A0A]');
            return;
        }
        saveStatus.classList.add('text-gray-500');
    };

    const setContinueReasonTone = function (tone) {
        continueReason.classList.remove('text-[#B91C1C]', 'text-[#0A7A0A]');
        if (tone === 'success') {
            continueReason.classList.add('text-[#0A7A0A]');
            return;
        }
        continueReason.classList.add('text-[#B91C1C]');
    };

    const updateContinueReason = function (reasons, options) {
        const tone = options && options.tone === 'success' ? 'success' : 'error';
        if (!reasons.length) {
            continueReason.textContent = '';
            continueReason.classList.add('hidden');
            return;
        }
        setContinueReasonTone(tone);
        continueReason.textContent = reasons.join(' ');
        continueReason.classList.remove('hidden');
    };

    const updateDetailsTitle = function (index) {
        if (!petDetailsTitle) return;
        if (pets[index]) {
            petDetailsTitle.textContent = `${pets[index].name || 'Pet'}’s Details`;
            return;
        }
        petDetailsTitle.textContent = 'Pet’s Details';
    };

    let currentIndex = -1;
    let currentDraft = null;
    let currentDirty = false;

    const updateSaveStatus = function (options) {
        const savedRecently = Boolean(options && options.savedRecently);
        if (currentIndex < 0 || !pets[currentIndex]) {
            saveDetailsBtn.disabled = true;
            setSaveStatus('', 'neutral');
            return;
        }

        saveDetailsBtn.disabled = false;
        const petName = getPetName(pets[currentIndex], currentIndex);

        if (savedRecently) {
            setSaveStatus(`Saved details for ${petName}.`, 'success');
            return;
        }

        if (currentDirty) {
            setSaveStatus(`Unsaved changes for ${petName}.`, 'warning');
            return;
        }

        setSaveStatus(`Details saved for ${petName}.`, 'neutral');
    };

    const isPetComplete = function (pet) {
        return getMissingFields(pet).length === 0;
    };

    const updateContinueState = function () {
        const blockedByDirty = currentDirty && currentIndex >= 0;
        const incompletePets = pets
            .map(function (pet, index) {
                return {
                    pet,
                    index,
                    missing: getMissingFields(pet),
                };
            })
            .filter(function (item) {
                return item.missing.length > 0;
            });

        const hasIncompletePet = incompletePets.length > 0;
        const shouldDisable = blockedByDirty || hasIncompletePet;

        continueNextBtn.disabled = shouldDisable;
        continueNextBtn.classList.toggle('bg-[#0A7A0A]', !shouldDisable);
        continueNextBtn.classList.toggle('bg-gray-300', shouldDisable);

        const reasons = [];
        if (blockedByDirty && pets[currentIndex]) {
            const petName = getPetName(pets[currentIndex], currentIndex);
            reasons.push(`Save details for ${petName} before continuing.`);
        }
        if (hasIncompletePet) {
            const summary = incompletePets
                .map(function (item) {
                    const petName = getPetName(item.pet, item.index);
                    const missingLabels = formatMissingFields(item.missing);
                    return `${petName} (${missingLabels})`;
                })
                .join('; ');
            reasons.push(`Complete details for: ${summary}.`);
        }
        updateContinueReason(reasons);
    };

    const loadDetailsForIndex = function (index) {
        const pet = pets[index];
        if (!pet) {
            currentIndex = -1;
            currentDraft = null;
            currentDirty = false;
            applyDraftToInputs({ size: '', diet: '', activity: '', treats: false });
            setDetailsDisabled(true);
            refreshSelectTones();
            refreshInfoTexts();
            updateDetailsTitle(-1);
            updateSaveStatus();
            updateContinueState();
            return;
        }

        currentIndex = index;
        currentDraft = {
            size: pet.size || '',
            diet: pet.diet || '',
            activity: pet.activity || '',
            treats: Boolean(pet.treats),
        };
        currentDirty = false;
        applyDraftToInputs(currentDraft);
        setDetailsDisabled(false);
        refreshSelectTones();
        refreshInfoTexts();
        updateDetailsTitle(index);
        updateSaveStatus();
        updateContinueState();
    };

    const handleDetailInputChange = function () {
        if (currentIndex < 0 || !pets[currentIndex]) return;
        currentDraft = getDraftFromInputs();
        currentDirty = true;
        refreshSelectTones();
        refreshInfoTexts();
        updateSaveStatus();
        updateContinueState();
    };

    const saveCurrentDetails = function () {
        if (currentIndex < 0 || !pets[currentIndex]) return;
        currentDraft = getDraftFromInputs();
        const pet = pets[currentIndex];
        pet.size = currentDraft.size;
        pet.diet = currentDraft.diet;
        pet.activity = currentDraft.activity;
        pet.treats = currentDraft.treats;
        savePets();
        currentDirty = false;
        refreshSelectTones();
        refreshInfoTexts();
        updateSaveStatus({ savedRecently: true });
        updateContinueState();
    };

    pets = normalizePets(pets);
    savePets();

    petSelect.innerHTML = '<option value="" disabled selected>Select a pet</option>';
    pets.forEach(function (pet, idx) {
        const opt = document.createElement('option');
        opt.value = String(idx);
        opt.textContent = `${getPetName(pet, idx)}’s Details`;
        petSelect.appendChild(opt);
    });

    petSelect.addEventListener('change', function () {
        const nextIndex = parseInt(petSelect.value, 10);
        if (!Number.isFinite(nextIndex)) {
            loadDetailsForIndex(-1);
            return;
        }
        loadDetailsForIndex(nextIndex);
    });

    petSizeSelect.addEventListener('change', handleDetailInputChange);
    dietTypeSelect.addEventListener('change', handleDetailInputChange);
    activityLevelSelect.addEventListener('change', handleDetailInputChange);
    treatsToggle.addEventListener('change', handleDetailInputChange);
    saveDetailsBtn.addEventListener('click', saveCurrentDetails);
    continueNextBtn.addEventListener('click', function () {
        if (continueNextBtn.disabled) {
            updateContinueState();
            return;
        }
        savePets();
        updateContinueReason(['All pet details saved. Ready to continue.'], { tone: 'success' });
    });

    if (pets.length === 1) {
        petSelect.value = '0';
        loadDetailsForIndex(0);
        return;
    }

    petSelect.selectedIndex = 0;
    loadDetailsForIndex(-1);
});

// Calculator page: render logged-in or logged-out view and calculate estimate
document.addEventListener('DOMContentLoaded', function () {
    const calculatorPage = document.getElementById('calculator-page');
    if (!calculatorPage) return;

    const authView = document.getElementById('auth-view');
    const guestView = document.getElementById('guest-view');
    const authLink = document.getElementById('auth-link');

    let user = null;
    try {
        const rawUser = localStorage.getItem('pawplanUser');
        user = rawUser ? JSON.parse(rawUser) : null;
    } catch (e) {
        user = null;
    }

    const storedAuth = localStorage.getItem('pawplanAuth');
    const isLoggedIn = storedAuth === 'true' || (storedAuth === null && Boolean(user));

    let pets = [];
    try {
        const rawPets = localStorage.getItem('pets');
        pets = rawPets ? JSON.parse(rawPets) : [];
    } catch (e) {
        pets = [];
    }

    const normalizePets = function (rawPets) {
        if (!Array.isArray(rawPets)) return [];
        return rawPets.map(function (pet) {
            return {
                type: typeof pet.type === 'string' ? pet.type : '',
                name: typeof pet.name === 'string' ? pet.name : '',
                size: typeof pet.size === 'string' ? pet.size : '',
                diet: typeof pet.diet === 'string' ? pet.diet : '',
                activity: typeof pet.activity === 'string' ? pet.activity : '',
                treats: Boolean(pet.treats),
            };
        });
    };

    pets = normalizePets(pets);

    const getFirstName = function (fullName) {
        if (typeof fullName !== 'string') return 'there';
        const parts = fullName.trim().split(/\s+/).filter(Boolean);
        return parts.length ? parts[0] : 'there';
    };

    const setAuthHeader = function () {
        if (!authLink) return;
        if (isLoggedIn) {
            const firstName = getFirstName(user && user.fullName);
            authLink.innerHTML = `Hi ${firstName}, <button type=\"button\" id=\"logout-btn\">Logout</button>`;
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function () {
                    localStorage.setItem('pawplanAuth', 'false');
                    window.location.reload();
                });
            }
            return;
        }
        authLink.innerHTML = '<a href=\"login.html\">Login</a>';
    };

    setAuthHeader();

    const showAuthView = Boolean(isLoggedIn && pets.length);
    if (authView) authView.hidden = !showAuthView;
    if (guestView) guestView.hidden = showAuthView;

    const baseCalories = {
        Small: { Low: 200, Normal: 250, High: 400 },
        Medium: { Low: 600, Normal: 800, High: 1200 },
        Large: { Low: 1200, Normal: 1500, High: 2500 },
    };

    const dietCosts = {
        Standard: 0.002,
        Premium: 0.005,
    };

    const formatCurrency = function (value) {
        if (!Number.isFinite(value)) return '£0.00';
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
        }).format(value);
    };

    const getQuantityValue = function (section) {
        const valueEl = section ? section.querySelector('[data-quantity-value]') : null;
        const rawValue = valueEl ? parseInt(valueEl.textContent, 10) : 1;
        if (!Number.isFinite(rawValue) || rawValue < 1) return 1;
        return rawValue;
    };

    const adjustQuantity = function (section, delta) {
        const valueEl = section ? section.querySelector('[data-quantity-value]') : null;
        if (!valueEl) return;
        const current = getQuantityValue(section);
        const next = Math.max(1, current + delta);
        valueEl.textContent = String(next);
    };

    const collectInputs = function (section) {
        if (!section) return null;
        const size = section.querySelector('[data-input=\"size\"]')?.value || '';
        const activity = section.querySelector('[data-input=\"activity\"]')?.value || '';
        const diet = section.querySelector('[data-input=\"diet\"]')?.value || '';
        const treatsSelect = section.querySelector('[data-input=\"treats-select\"]');
        const treatsToggle = section.querySelector('[data-input=\"treats-toggle\"]');
        let treats = false;
        if (treatsSelect) {
            treats = treatsSelect.value === 'yes';
        }
        if (treatsToggle) {
            treats = treatsToggle.checked;
        }
        const quantity = getQuantityValue(section);
        return { size, activity, diet, treats, quantity };
    };

    const calculatePlan = function (inputs) {
        if (!inputs) return null;
        const base = baseCalories[inputs.size] && baseCalories[inputs.size][inputs.activity];
        const costPerKcal = dietCosts[inputs.diet];
        if (!base || !costPerKcal) return null;
        const adjustedDaily = base * (inputs.treats ? 1.1 : 1);
        const monthlyCost = adjustedDaily * costPerKcal * 30 * inputs.quantity;
        return {
            base,
            dailyCalories: Math.round(adjustedDaily),
            monthlyCost,
            costPerKcal,
            size: inputs.size,
            activity: inputs.activity,
            diet: inputs.diet,
            treats: inputs.treats,
            quantity: inputs.quantity,
        };
    };

    const overlay = document.getElementById('result-overlay');
    const overlayClose = document.getElementById('overlay-close');
    const overlaySummary = document.getElementById('overlay-summary');
    const overlayDaily = document.getElementById('overlay-daily');
    const overlayDiet = document.getElementById('overlay-diet');
    const overlayMonthly = document.getElementById('overlay-monthly');

    const showOverlay = function (result) {
        if (!overlay || !result) return;
        if (overlaySummary) {
            const treatsText = result.treats ? 'Includes treats' : 'No treats';
            overlaySummary.textContent = `${result.size} size, ${result.activity} activity. ${treatsText}.`;
        }
        if (overlayDaily) {
            overlayDaily.textContent = `Daily calories: ${result.dailyCalories} kcal.`;
        }
        if (overlayDiet) {
            overlayDiet.textContent = `Diet: ${result.diet} (£${result.costPerKcal.toFixed(3)} per kcal) | Pets: ${result.quantity}.`;
        }
        if (overlayMonthly) {
            overlayMonthly.textContent = formatCurrency(result.monthlyCost);
        }
        overlay.classList.add('is-visible');
        overlay.setAttribute('aria-hidden', 'false');
    };

    const hideOverlay = function () {
        if (!overlay) return;
        overlay.classList.remove('is-visible');
        overlay.setAttribute('aria-hidden', 'true');
    };

    if (overlayClose) {
        overlayClose.addEventListener('click', hideOverlay);
    }

    if (overlay) {
        overlay.addEventListener('click', function (event) {
            if (event.target === overlay) {
                hideOverlay();
            }
        });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            hideOverlay();
        }
    });

    const handleQuantityClicks = function (section, callback) {
        if (!section) return;
        section.addEventListener('click', function (event) {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            if (!target.matches('[data-qty-action]')) return;
            const delta = target.dataset.qtyAction === 'dec' ? -1 : 1;
            adjustQuantity(section, delta);
            if (typeof callback === 'function') {
                callback();
            }
        });
    };

    const setErrorMessage = function (element, message) {
        if (!element) return;
        element.textContent = message || '';
    };

    const ensureCompleteInputs = function (inputs) {
        if (!inputs) return false;
        return Boolean(inputs.size && inputs.activity && inputs.diet);
    };

    if (showAuthView) {
        const petSelect = document.getElementById('auth-pet-select');
        const petSizeSelect = document.getElementById('auth-pet-size');
        const activitySelect = document.getElementById('auth-activity');
        const dietSelect = document.getElementById('auth-diet');
        const treatsSelect = document.getElementById('auth-treats');
        const authCalcBtn = document.getElementById('auth-calc-btn');
        const authPreviewBar = document.getElementById('auth-preview-bar');
        const authPreviewText = document.getElementById('auth-preview-text');
        const authError = document.getElementById('auth-error');

        if (petSelect) {
            petSelect.innerHTML = '<option value=\"\" disabled selected>Select a pet</option>';
            pets.forEach(function (pet, index) {
                const option = document.createElement('option');
                option.value = String(index);
                const labelName = pet.name ? pet.name : `Pet ${index + 1}`;
                const typeSuffix = pet.type ? ` (${pet.type})` : '';
                option.textContent = `${labelName}${typeSuffix}`;
                petSelect.appendChild(option);
            });
        }

        const setSelectValue = function (select, value) {
            if (!select) return;
            const hasOption = Array.from(select.options).some(function (option) {
                return option.value === value;
            });
            select.value = hasOption ? value : '';
        };

        const updatePreview = function () {
            if (!authPreviewText) return;
            const inputs = collectInputs(authView);
            const result = calculatePlan(inputs);
            if (authPreviewBar) {
                const isReady = Boolean(petSelect && petSelect.value && ensureCompleteInputs(inputs) && result);
                authPreviewBar.classList.toggle('is-actionable', isReady);
            }
            if (!petSelect || !petSelect.value) {
                authPreviewText.textContent = 'Select a pet to see the estimate.';
            } else if (!ensureCompleteInputs(inputs)) {
                authPreviewText.textContent = 'Complete size, activity, and diet to see the estimate.';
            } else if (result) {
                authPreviewText.textContent = `Estimated monthly cost: ${formatCurrency(result.monthlyCost)}.`;
            } else {
                authPreviewText.textContent = 'Complete the form to see the estimate.';
            }
        };

        const runAuthCalculation = function () {
            const inputs = collectInputs(authView);
            if (!petSelect || !petSelect.value) {
                setErrorMessage(authError, 'Select a pet to continue.');
                return;
            }
            if (!ensureCompleteInputs(inputs)) {
                setErrorMessage(authError, 'Complete size, activity, and diet to calculate.');
                return;
            }
            const result = calculatePlan(inputs);
            if (!result) {
                setErrorMessage(authError, 'Complete the form to calculate.');
                return;
            }
            setErrorMessage(authError, '');
            showOverlay(result);
        };

        if (petSelect) {
            petSelect.addEventListener('change', function () {
                const index = parseInt(petSelect.value, 10);
                const pet = Number.isFinite(index) ? pets[index] : null;
                if (pet) {
                    setSelectValue(petSizeSelect, pet.size);
                    setSelectValue(activitySelect, pet.activity);
                    setSelectValue(dietSelect, pet.diet);
                    if (treatsSelect) {
                        if (pet.treats === true) {
                            treatsSelect.value = 'yes';
                        } else if (pet.treats === false) {
                            treatsSelect.value = 'no';
                        } else {
                            treatsSelect.value = '';
                        }
                    }
                }
                updatePreview();
            });
        }

        handleQuantityClicks(authView, updatePreview);

        [petSizeSelect, activitySelect, dietSelect, treatsSelect].forEach(function (selectEl) {
            if (!selectEl) return;
            selectEl.addEventListener('change', function () {
                updatePreview();
                setErrorMessage(authError, '');
            });
        });

        if (authCalcBtn) {
            authCalcBtn.addEventListener('click', runAuthCalculation);
        }

        if (authPreviewBar) {
            authPreviewBar.setAttribute('role', 'button');
            authPreviewBar.setAttribute('tabindex', '0');
            authPreviewBar.addEventListener('click', runAuthCalculation);
            authPreviewBar.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    runAuthCalculation();
                }
            });
        }

        if (pets.length === 1 && petSelect) {
            petSelect.value = '0';
            petSelect.dispatchEvent(new Event('change'));
        } else {
            updatePreview();
        }
    }

    if (!showAuthView && guestView) {
        const guestCalcBtn = document.getElementById('guest-calc-btn');
        const guestError = document.getElementById('guest-error');
        const guestInputs = guestView.querySelectorAll('select, input[type="checkbox"]');

        handleQuantityClicks(guestView, function () {
            setErrorMessage(guestError, '');
        });

        guestInputs.forEach(function (inputEl) {
            inputEl.addEventListener('change', function () {
                setErrorMessage(guestError, '');
            });
        });

        if (guestCalcBtn) {
            guestCalcBtn.addEventListener('click', function () {
                const inputs = collectInputs(guestView);
                if (!ensureCompleteInputs(inputs)) {
                    setErrorMessage(guestError, 'Please complete size, activity, and diet to calculate.');
                    return;
                }
                const result = calculatePlan(inputs);
                if (!result) {
                    setErrorMessage(guestError, 'Please complete the form to calculate.');
                    return;
                }
                setErrorMessage(guestError, '');
                showOverlay(result);
            });
        }
    }
});
