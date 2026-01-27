// State Management
const state = {
    products: [
        { id: 1, name: 'Product 1', consumption: 250000, discount: 18 },
        { id: 2, name: 'Product 2', consumption: 100000, discount: 20 },
        { id: 3, name: 'Product 3', consumption: 100000, discount: 27 },
        { id: 4, name: 'Product 4', consumption: 50000, discount: 35 }
    ],
    commitment: 300000
};

// DOM Elements
const elements = {
    product1: document.getElementById('product1'),
    product2: document.getElementById('product2'),
    product3: document.getElementById('product3'),
    product4: document.getElementById('product4'),
    discountRate1: document.getElementById('discountRate1'),
    discountRate2: document.getElementById('discountRate2'),
    discountRate3: document.getElementById('discountRate3'),
    discountRate4: document.getElementById('discountRate4'),
    commitmentAmount: document.getElementById('commitmentAmount'),
    commitmentSlider: document.getElementById('commitmentSlider'),
    totalConsumption: document.getElementById('totalConsumption'),
    commitmentPercent: document.getElementById('commitmentPercent'),
    monthlySavings: document.getElementById('monthlySavings'),
    costWithout: document.getElementById('costWithout'),
    costWith: document.getElementById('costWith'),
    savingsPercent: document.getElementById('savingsPercent'),
    breakdownDetails: document.getElementById('breakdownDetails'),
    discount1: document.getElementById('discount1'),
    discount2: document.getElementById('discount2'),
    discount3: document.getElementById('discount3'),
    discount4: document.getElementById('discount4')
};

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatPercent(value) {
    return `${value.toFixed(1)}%`;
}

// Calculation Engine
function calculateSavings() {
    // Get current state
    const products = state.products.map((p, index) => ({
        ...p,
        consumption: parseFloat(elements[`product${index + 1}`].value) || 0,
        discount: parseFloat(elements[`discountRate${index + 1}`].value) || 0
    }));

    const commitment = parseFloat(elements.commitmentAmount.value) || 0;

    // Calculate total consumption
    const totalConsumption = products.reduce((sum, p) => sum + p.consumption, 0);

    // Cost without commitment (no discounts)
    const costWithout = totalConsumption;

    // Sort products by discount percentage (highest to lowest)
    const sortedProducts = [...products].sort((a, b) => b.discount - a.discount);

    // Apply commitment bucket from highest to lowest discount
    let remainingCommitment = commitment;
    let commitmentUsedSoFar = 0;
    const breakdown = [];

    sortedProducts.forEach(product => {
        const commitmentBefore = remainingCommitment;

        if (product.consumption === 0) {
            breakdown.push({
                ...product,
                discountedAmount: 0,
                normalAmount: 0,
                discountedCost: 0,
                normalCost: 0,
                totalCost: 0,
                savings: 0,
                commitmentUsed: 0,
                commitmentRemaining: remainingCommitment,
                commitmentUsedSoFar: commitmentUsedSoFar
            });
            return;
        }

        const discountedAmount = Math.min(remainingCommitment, product.consumption);
        const normalAmount = product.consumption - discountedAmount;

        const discountMultiplier = 1 - (product.discount / 100);
        const discountedCost = discountedAmount * discountMultiplier;
        const normalCost = normalAmount;
        const totalCost = discountedCost + normalCost;
        const savings = product.consumption - totalCost;

        remainingCommitment -= discountedAmount;
        commitmentUsedSoFar += discountedAmount;

        breakdown.push({
            ...product,
            discountedAmount,
            normalAmount,
            discountedCost,
            normalCost,
            totalCost,
            savings,
            commitmentUsed: discountedAmount,
            commitmentRemaining: remainingCommitment,
            commitmentUsedSoFar: commitmentUsedSoFar,
            commitmentBefore: commitmentBefore
        });
    });

    // Calculate total cost with commitment
    const costWith = breakdown.reduce((sum, item) => sum + item.totalCost, 0);
    const totalSavings = costWithout - costWith;
    const savingsPercent = totalConsumption > 0 ? (totalSavings / totalConsumption) * 100 : 0;

    return {
        totalConsumption,
        commitment,
        costWithout,
        costWith,
        totalSavings,
        savingsPercent,
        breakdown,
        commitmentPercent: totalConsumption > 0 ? (commitment / totalConsumption) * 100 : 0
    };
}

// UI Update Functions
function updateUI() {
    const results = calculateSavings();

    // Update total consumption
    elements.totalConsumption.textContent = formatCurrency(results.totalConsumption);

    // Update commitment percentage
    elements.commitmentPercent.textContent = formatPercent(results.commitmentPercent);

    // Update savings summary
    elements.monthlySavings.textContent = formatCurrency(results.totalSavings);
    elements.costWithout.textContent = formatCurrency(results.costWithout);
    elements.costWith.textContent = formatCurrency(results.costWith);
    elements.savingsPercent.textContent = formatPercent(results.savingsPercent);

    // Update discount badges
    elements.discount1.textContent = `${elements.discountRate1.value}% discount`;
    elements.discount2.textContent = `${elements.discountRate2.value}% discount`;
    elements.discount3.textContent = `${elements.discountRate3.value}% discount`;
    elements.discount4.textContent = `${elements.discountRate4.value}% discount`;

    // Update commitment slider max and background
    const maxCommitment = results.totalConsumption;
    elements.commitmentSlider.max = maxCommitment;

    const sliderPercent = maxCommitment > 0 ? (results.commitment / maxCommitment) * 100 : 0;
    elements.commitmentSlider.style.background = `linear-gradient(to right, var(--primary-blue) 0%, var(--primary-blue) ${sliderPercent}%, var(--border-color) ${sliderPercent}%, var(--border-color) 100%)`;

    // Update breakdown
    updateBreakdown(results.breakdown);
}

function updateBreakdown(breakdown) {
    // Display breakdown in discount application order (highest to lowest discount)
    const sortedBreakdown = [...breakdown].sort((a, b) => b.discount - a.discount);

    // Get total commitment for percentage calculations
    const totalCommitment = parseFloat(elements.commitmentAmount.value) || 0;

    elements.breakdownDetails.innerHTML = sortedBreakdown.map(item => {
        if (item.consumption === 0) {
            return `
                <div class="breakdown-item">
                    <div class="breakdown-header">
                        <span class="breakdown-product">${item.name}</span>
                        <span class="breakdown-discount">${item.discount}% discount</span>
                    </div>
                    <div class="breakdown-details-grid">
                        <div class="breakdown-detail">
                            <span class="breakdown-detail-label">Consumption</span>
                            <span class="breakdown-detail-value">${formatCurrency(0)}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // Calculate percentage of commitment remaining
        const remainingPercent = totalCommitment > 0 ? (item.commitmentRemaining / totalCommitment) * 100 : 0;
        const usedPercent = 100 - remainingPercent;

        return `
            <div class="breakdown-item">
                <div class="breakdown-header">
                    <span class="breakdown-product">${item.name}</span>
                    <span class="breakdown-discount">${item.discount}% discount</span>
                </div>
                <div class="breakdown-details-grid">
                    <div class="breakdown-detail">
                        <span class="breakdown-detail-label">Total Consumption</span>
                        <span class="breakdown-detail-value">${formatCurrency(item.consumption)}</span>
                    </div>
                    <div class="breakdown-detail">
                        <span class="breakdown-detail-label">Discounted Amount</span>
                        <span class="breakdown-detail-value">${formatCurrency(item.discountedAmount)}</span>
                    </div>
                    <div class="breakdown-detail">
                        <span class="breakdown-detail-label">Normal Rate Amount</span>
                        <span class="breakdown-detail-value">${formatCurrency(item.normalAmount)}</span>
                    </div>
                    <div class="breakdown-detail">
                        <span class="breakdown-detail-label">Total Cost</span>
                        <span class="breakdown-detail-value">${formatCurrency(item.totalCost)}</span>
                    </div>
                    <div class="breakdown-detail">
                        <span class="breakdown-detail-label">Savings</span>
                        <span class="breakdown-detail-value" style="color: var(--accent-green);">${formatCurrency(item.savings)}</span>
                    </div>
                    <div class="breakdown-detail commitment-tracker">
                        <span class="breakdown-detail-label">Commitment Status</span>
                        <div class="commitment-drum">
                            <div class="commitment-drum-container">
                                <div class="commitment-drum-fill" style="height: ${remainingPercent}%"></div>
                                <div class="commitment-drum-label">${formatPercent(remainingPercent)} left</div>
                            </div>
                            <div class="commitment-drum-details">
                                <div class="commitment-detail-row">
                                    <span>Used:</span>
                                    <span class="commitment-value">${formatCurrency(item.commitmentUsed)}</span>
                                </div>
                                <div class="commitment-detail-row">
                                    <span>Remaining:</span>
                                    <span class="commitment-value">${formatCurrency(item.commitmentRemaining)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Event Listeners
function setupEventListeners() {
    // Product consumption inputs
    elements.product1.addEventListener('input', updateUI);
    elements.product2.addEventListener('input', updateUI);
    elements.product3.addEventListener('input', updateUI);
    elements.product4.addEventListener('input', updateUI);

    // Discount rate inputs
    elements.discountRate1.addEventListener('input', updateUI);
    elements.discountRate2.addEventListener('input', updateUI);
    elements.discountRate3.addEventListener('input', updateUI);
    elements.discountRate4.addEventListener('input', updateUI);

    // Commitment amount input
    elements.commitmentAmount.addEventListener('input', (e) => {
        elements.commitmentSlider.value = e.target.value;
        updateUI();
    });

    // Commitment slider
    elements.commitmentSlider.addEventListener('input', (e) => {
        elements.commitmentAmount.value = e.target.value;
        updateUI();
    });

    // Scenario generation button
    const generateButton = document.getElementById('generateScenario');
    if (generateButton) {
        generateButton.addEventListener('click', generateScenarioComparison);
    }
}

// Scenario Comparison Functions
function generateScenarioComparison() {
    const scenarioComparison = document.getElementById('scenarioComparison');
    scenarioComparison.classList.remove('hidden');

    // Get current consumption
    const currentConsumption = [
        { id: 1, name: 'Product 1', amount: parseFloat(elements.product1.value) || 0, discount: parseFloat(elements.discountRate1.value) || 0 },
        { id: 2, name: 'Product 2', amount: parseFloat(elements.product2.value) || 0, discount: parseFloat(elements.discountRate2.value) || 0 },
        { id: 3, name: 'Product 3', amount: parseFloat(elements.product3.value) || 0, discount: parseFloat(elements.discountRate3.value) || 0 },
        { id: 4, name: 'Product 4', amount: parseFloat(elements.product4.value) || 0, discount: parseFloat(elements.discountRate4.value) || 0 }
    ];

    const commitment = parseFloat(elements.commitmentAmount.value) || 0;
    const totalConsumption = currentConsumption.reduce((sum, p) => sum + p.amount, 0);

    // Calculate current scenario savings
    const currentResults = calculateSavingsForScenario(currentConsumption, commitment);

    // Generate optimized scenario - shift consumption to higher discount products
    const optimizedConsumption = generateOptimizedConsumption(currentConsumption, totalConsumption);
    const optimizedResults = calculateSavingsForScenario(optimizedConsumption, commitment);

    // Display scenarios
    displayScenario('currentScenario', currentConsumption, currentResults, null);
    displayScenario('optimizedScenario', optimizedConsumption, optimizedResults, currentConsumption);

    // Display impact
    const additionalSavings = optimizedResults.totalSavings - currentResults.totalSavings;
    document.getElementById('additionalSavings').textContent = formatCurrency(additionalSavings);

    const savingsIncrease = currentResults.totalSavings > 0
        ? ((additionalSavings / currentResults.totalSavings) * 100).toFixed(1)
        : 0;

    document.getElementById('impactDescription').textContent =
        `By shifting ${formatCurrency(Math.abs(additionalSavings))} of consumption from lower-discount to higher-discount products, ` +
        `you could increase your total savings by ${savingsIncrease}%. This demonstrates how the tiered discount structure ` +
        `incentivizes customers to concentrate their usage on products with higher discount rates.`;
}

function generateOptimizedConsumption(currentConsumption, totalConsumption) {
    // Sort products by discount (highest to lowest)
    const sorted = [...currentConsumption].sort((a, b) => b.discount - a.discount);

    // Strategy: Shift 30-40% of consumption from lowest discount products to highest discount products
    const optimized = currentConsumption.map(p => ({ ...p, amount: p.amount }));

    // Find products with lowest and highest discounts
    const lowestDiscountProduct = sorted[sorted.length - 1];
    const highestDiscountProduct = sorted[0];

    // Calculate shift amount (30% of lowest discount product's consumption)
    const shiftAmount = Math.min(
        lowestDiscountProduct.amount * 0.3,
        totalConsumption * 0.15 // Cap at 15% of total to keep it realistic
    );

    // Apply the shift
    optimized.forEach(p => {
        if (p.id === lowestDiscountProduct.id) {
            p.amount -= shiftAmount;
        } else if (p.id === highestDiscountProduct.id) {
            p.amount += shiftAmount;
        }
    });

    return optimized;
}

function calculateSavingsForScenario(products, commitment) {
    const totalConsumption = products.reduce((sum, p) => sum + p.amount, 0);
    const costWithout = totalConsumption;

    // Sort by discount (highest to lowest)
    const sorted = [...products].sort((a, b) => b.discount - a.discount);

    let remainingCommitment = commitment;
    let totalCost = 0;

    sorted.forEach(product => {
        const discountedAmount = Math.min(remainingCommitment, product.amount);
        const normalAmount = product.amount - discountedAmount;

        const discountMultiplier = 1 - (product.discount / 100);
        const discountedCost = discountedAmount * discountMultiplier;
        const normalCost = normalAmount;

        totalCost += discountedCost + normalCost;
        remainingCommitment -= discountedAmount;
    });

    return {
        totalConsumption,
        costWithout,
        costWith: totalCost,
        totalSavings: costWithout - totalCost
    };
}

function displayScenario(elementId, products, results, comparison) {
    const element = document.getElementById(elementId);

    let html = '';

    // Sort by product ID for consistent display
    const sorted = [...products].sort((a, b) => a.id - b.id);

    sorted.forEach(product => {
        let changeHtml = '';

        if (comparison) {
            const originalProduct = comparison.find(p => p.id === product.id);
            const diff = product.amount - originalProduct.amount;

            if (Math.abs(diff) > 100) { // Only show if difference is significant
                const diffPercent = ((diff / originalProduct.amount) * 100).toFixed(0);
                if (diff > 0) {
                    changeHtml = `<span class="scenario-change increase">+${diffPercent}%</span>`;
                } else if (diff < 0) {
                    changeHtml = `<span class="scenario-change decrease">${diffPercent}%</span>`;
                }
            }
        }

        html += `
            <div class="scenario-row">
                <span class="scenario-product-name">${product.name} (${product.discount}%)</span>
                <span>
                    <span class="scenario-value">${formatCurrency(product.amount)}</span>
                    ${changeHtml}
                </span>
            </div>
        `;
    });

    html += `
        <div class="scenario-total">
            <span>Total Savings:</span>
            <span style="color: var(--accent-green);">${formatCurrency(results.totalSavings)}</span>
        </div>
    `;

    element.innerHTML = html;
}


// Initialize
function init() {
    setupEventListeners();
    updateUI();
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
