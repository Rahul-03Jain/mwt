// email-service.js - Email functionality only
// This file ONLY handles sending emails, nothing else
// Call this from your cart.js when checkout happens

// ===== CONFIGURATION =====
const WEB3FORMS_ACCESS_KEY = "a606f413-66e3-40eb-a305-4f7f5388e52d"; // Get from https://web3forms.com

// ===== MAIN EMAIL FUNCTION =====

/**
 * Send order confirmation email
 * Call this function from cart.js after successful checkout
 * 
 * @param {Object} orderData - Order information
 * @param {string} orderData.customerEmail - Customer's email address
 * @param {string} orderData.customerName - Customer's name
 * @param {string} orderData.orderId - Unique order ID
 * @param {Array|string} orderData.items - Cart items (array or formatted string)
 * @param {string|number} orderData.total - Order total amount
 * 
 * @returns {Promise<Object>} - { success: boolean, error?: string }
 */
async function sendOrderEmail(orderData) {
    // Format items if it's an array
    let itemsList;
    if (Array.isArray(orderData.items)) {
        itemsList = orderData.items.map(item => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            return `${item.name} x${item.quantity} - $${item.price.toFixed(2)} each = $${itemTotal}`;
        }).join('\n');
    } else {
        itemsList = orderData.items; // Already formatted string
    }

    // Prepare email data
    const emailData = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `Order Confirmation - ${orderData.orderId}`,
        from_name: "ShopEasy", // ⚠️ CHANGE THIS to your store name
        email: orderData.customerEmail,
        message: `
Hello ${orderData.customerName},

Thank you for your order!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order ID: ${orderData.orderId}
Order Date: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
})}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ITEMS ORDERED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${itemsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOTAL: $${orderData.total}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

We'll send you another email when your order ships.

Thank you for shopping with us!

Best regards,
ShopEasy Team
        `,
        // Additional metadata
        customer_name: orderData.customerName,
        order_id: orderData.orderId,
        order_total: orderData.total,
    };

    // Send email via Web3Forms API
    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(emailData),
        });

        const result = await response.json();

        if (result.success) {
            console.log("✅ Order confirmation email sent successfully!");
            return { success: true };
        } else {
            console.error("❌ Email failed:", result.message);
            return { success: false, error: result.message };
        }
    } catch (error) {
        console.error("❌ Email error:", error);
        return { success: false, error: error.message };
    }
}

// Log when this file loads
console.log("✅ Email service loaded and ready");