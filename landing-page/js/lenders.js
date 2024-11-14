// lenders.js

// Updated lender data with the new schema

// State list
const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

// Get the initial search input
const lendersInput = document.getElementById('lenders-input');

// Event listeners to open modal
lendersInput.addEventListener('focus', openModal);
lendersInput.addEventListener('click', openModal);

// Function to create and open modal
function openModal() {
    createModalElements();
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('modal').style.display = 'block';
    document.getElementById('modal-search-input').focus();
    renderLenders(true); // true indicates initial render
}

// Function to create modal elements dynamically
function createModalElements() {
    // Check if modal already exists
    if (document.getElementById('modal')) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.5); display: none; z-index: 999;
    `;
    document.body.appendChild(overlay);

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        width: 90%; max-width: 1000px; background: #fff; border-radius: 8px;
        overflow: hidden; display: none; z-index: 1000; max-height: 90vh;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(modal);

    // Close button
    const closeModalBtn = document.createElement('button');
    closeModalBtn.id = 'close-modal';
    closeModalBtn.innerHTML = '&times;';
    closeModalBtn.style.cssText = `
        position: absolute; top: 10px; right: 10px;
        border: none; font-size: 20px; cursor: pointer;
        height: 30px; width: 30px;
        border-radius: 15px;
        background: transparent;

    `;
    modal.appendChild(closeModalBtn);

    // Modal content container
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        display: flex; flex-direction: row; max-height: 85vh;
    `;
    modal.appendChild(modalContent);

    // Sidebar for state filters
    const stateFilters = document.createElement('div');
    stateFilters.id = 'state-filters';
    stateFilters.style.cssText = `
        width: 150px; padding: 20px; border-right: 1px solid #ddd;
        overflow-y: auto; max-height: 100%;
        font-family: Inter;
    `;
    modalContent.appendChild(stateFilters);

    // Main content area
    const modalMain = document.createElement('div');
    modalMain.style.cssText = `
        flex: 1; padding: 30px; overflow-y: auto; max-height: 100%; display: flex;
        flex-direction: column;
        justify-content: space-around;
        font-family: Inter;
        padding-right: 40px;
        padding-left: 40px;
    `;
    modalContent.appendChild(modalMain);

    // Search box
    const modalSearch = document.createElement('div');
    modalSearch.className = 'modal-search';
    modalSearch.style.cssText = `margin-bottom: 20px;`;
    const modalSearchInput = document.createElement('input');
    modalSearchInput.type = 'text';
    modalSearchInput.id = 'modal-search-input';
    modalSearchInput.placeholder = 'Search lenders...';
    modalSearchInput.style.cssText = `
        width: 100%; padding: 10px; font-size: 16px; box-sizing: border-box;
        border-radius: 5px;
        border: 1px solid rgba(201, 178, 240, 0.3);
        background: #F7F8FC;
    `;
    modalSearch.appendChild(modalSearchInput);
    modalMain.appendChild(modalSearch);

    // Lender list (cards in masonry layout)
    const lenderListContainer = document.createElement('div');
    lenderListContainer.style.cssText = `
        overflow-y: auto; flex: 1; max-height: calc(100% - 100px);
    `;

    const lenderList = document.createElement('div');
    let lenderListColumns = 2;
    if (window.matchMedia('(max-width: 800px)').matches) { // For screen size upto 600px
        lenderListColumns = 1;
    } else {
        lenderListColumns = 2;
    }
    lenderList.id = 'lender-list';
    lenderList.style.cssText = `
        column-gap: 20px;
        column-count: ${lenderListColumns};
    `;
    lenderListContainer.appendChild(lenderList);
    modalMain.appendChild(lenderListContainer);

    // Load More button
    const loadMoreParent = document.createElement('div');
    loadMoreParent.style.cssText = `
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    `;
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.id = 'load-more-btn';
    loadMoreBtn.textContent = 'Load More...';
    loadMoreBtn.style.cssText = `
        display: none; width: fit-content; padding: 10px; margin-top: 20px;
        font-size: 14px; cursor: pointer;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        background: #fff;
    `;
    loadMoreBtn.addEventListener('click', loadMoreLenders);
    loadMoreParent.appendChild(loadMoreBtn);
    modalMain.appendChild(loadMoreParent);

    // Event listeners
    closeModalBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    modalSearchInput.addEventListener('input', () => renderLenders(true));

    // Generate state filters
    renderStateFilters(stateFilters);

    // Save references for later use
    window.modalElements = {
        overlay,
        modal,
        modalSearchInput,
        lenderList,
        stateFilters,
        loadMoreBtn,
        lendersDisplayed: 0
    };
}

// Function to close modal
function closeModal() {
    window.modalElements.overlay.style.display = 'none';
    window.modalElements.modal.style.display = 'none';
}

// Generate state filters
function renderStateFilters(container) {
    const title = document.createElement('h3');
    title.textContent = 'Filter by State';
    title.style.marginBottom = '10px';
    container.appendChild(title);

    states.forEach(state => {
        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.marginBottom = '5px';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = state;
        checkbox.style.marginRight = '5px';
        checkbox.addEventListener('change', () => renderLenders(true));
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(state));
        container.appendChild(label);
    });
}

// Filter lenders based on search input and selected states
function filterLenders() {
    const query = window.modalElements.modalSearchInput.value.toLowerCase();
    const checkedStates = Array.from(
        window.modalElements.stateFilters.querySelectorAll('input[type="checkbox"]:checked')
    ).map(cb => cb.value);

    return lenders.filter(lender => {
        // Combine all searchable fields into one string
        const searchableContent = `
            ${lender.companyName}
            ${lender.individualName}
            ${lender.aboutMe}
            ${lender.address}
            ${lender.nmlsId}
            ${lender.officePhone}
            ${lender.faxPhone}
            ${lender.stateLicenses}
            ${lender.website}
            ${lender.id}
            ${lender.languagesSpoken}
            ${lender.stateAbbreviation}
            ${lender.city}
            ${lender.overview}
            ${lender.loanPrograms}
        `.toLowerCase();

        const matchesQuery = searchableContent.includes(query);

        const matchesState = checkedStates.length === 0 ||
            checkedStates.includes(lender.stateAbbreviation);

        return matchesQuery && matchesState;
    });
}

function getSlugBasedOnTitle(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

// Render lenders to the list as cards
function renderLenders(reset = false) {
    const lenderList = window.modalElements.lenderList;
    const loadMoreBtn = window.modalElements.loadMoreBtn;

    if (reset) {
        lenderList.innerHTML = '';
        window.modalElements.lendersDisplayed = 0;
    }

    const filteredLenders = filterLenders();

    if (filteredLenders.length === 0) {
        lenderList.innerHTML = '<p>No lenders found.</p>';
        loadMoreBtn.style.display = 'none';
        return;
    }

    const lendersToDisplay = filteredLenders.slice(window.modalElements.lendersDisplayed, window.modalElements.lendersDisplayed + 100);

    lendersToDisplay.forEach(lender => {
        // Card container
        const card = document.createElement('div');
        card.className = 'lender-card';
        card.style.cssText = `
            background: #fff; border: 1px solid #ddd; border-radius: 8px;
            margin-bottom: 20px; display: inline-block; width: 100%;
            box-sizing: border-box; padding: 15px; break-inside: avoid;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            vertical-align: top;
            overflow-wrap: break-word;
            cursor: pointer;
            transition: background-color 0.4s;
        `;

        // Hover style for card
        card.addEventListener('mouseenter', () => {
            card.style.backgroundColor = 'rgba(201, 178, 240, 0.2)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.backgroundColor = '#fff';
            
        });

        // Image container
        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = `
            width: 100%; position: relative; padding-bottom: 100%; /* 1:1 Aspect Ratio */
            overflow: hidden; border-radius: 5px;
            margin-bottom: 10px;
        `;

        // Image
        const image = document.createElement('img');
        image.src = lender.imageURL || 'https://via.placeholder.com/300';
        image.alt = lender.companyName || 'Lender Image';
        image.style.cssText = `
            width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;
        `;
        imageContainer.appendChild(image);
        card.appendChild(imageContainer);

        // Title
        const title = document.createElement('h3');
        title.textContent = lender.companyName || lender.individualName;
        title.style.margin = '10px 0 5px 0';

        // Details
        const details = document.createElement('p');
        details.style.cssText = 'flex: 1;';

        details.innerHTML = `
            <strong>Location:</strong> ${lender.city}, ${lender.stateAbbreviation}<br>
            <strong>Phone:</strong> <a href="${lender.officePhoneLink}">${lender.officePhone}</a><br>
            <strong>Website:</strong> <a href="${lender.websiteURL}" target="_blank">${lender.websiteURL}</a><br>
            <strong>NMLS ID:</strong> ${lender.nmlsId}<br>
            <strong>Rating:</strong> ${lender.rating ? lender.rating.toFixed(2) : 'N/A'}<br>
        `;

        // About
        const about = document.createElement('p');
        about.textContent = lender?.overview?.length > 200 ? lender?.overview?.slice(0, 200) + '...' : lender?.overview;
        about.style.cssText = 'margin-top: 10px;';

        // Append elements to card
        card.appendChild(title);
        card.appendChild(details);
        card.appendChild(about);

        card.addEventListener('click', () => {
            window.open(`https://addy.so/lenders/${getSlugBasedOnTitle(lender.companyName || lender.individualName)}`, '_blank');
        });

        // Append card to lender list
        lenderList.appendChild(card);
    });

    window.modalElements.lendersDisplayed += lendersToDisplay.length;

    // Show or hide Load More button
    if (window.modalElements.lendersDisplayed < filteredLenders.length) {
        loadMoreBtn.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

// Function to load more lenders
function loadMoreLenders() {
    renderLenders();
}

// Create a function to check current window width and update column count accordingly
const setColumnCount = () => {
    const lenderList = document.getElementById('lender-list');
    if (!lenderList) return;
    if (window.matchMedia('(max-width: 800px)').matches) { // For screen size upto 600px
        lenderList.style.columnCount = '1';
    } else {
        lenderList.style.columnCount = '2';
    }
};

// Use it once at the start to set initial column count
setColumnCount();

// Recalculate column count when window is resized
window.addEventListener('resize', setColumnCount);
