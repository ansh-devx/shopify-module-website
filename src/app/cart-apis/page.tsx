import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const metadata = {
  title: "Cart & Section APIs - Shopify Learn",
  description:
    "Build dynamic shopping experiences with Cart APIs and Section Rendering.",
};

export default function CartAPIs() {
  return (
    <ContentLayout
      title="Cart & Section Rendering APIs"
      description="Learn how to use Shopify's Cart API endpoints and build dynamic shopping experiences"
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            Cart API Endpoints
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            The Shopify Cart API provides endpoints to interact with the cart
            using JavaScript. All endpoints return JSON responses.
          </p>
        </section>

        {/* /cart.js */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">/cart.js</h2>
          <p className="mt-4 text-lg text-gray-700">
            Gets the current cart contents as JSON. Returns the full cart object
            with items, total price, item count, and other cart data.
          </p>
          <CodeBlock
            code={`// GET request - no body needed
fetch('/cart.js')
  .then(response => response.json())
  .then(cart => {
    console.log(cart);
    // Returns object with:
    // - items: array of cart items
    // - item_count: total number of items
    // - total_price: total price in cents
    // - original_total_price: price before discounts
    // - total_discount: total discount amount
    // - cart_level_discount_applications: applied discounts
    // - attributes: custom cart attributes
    // - note: cart note
  });`}
            language="javascript"
            filename="cart.js"
          />
        </section>

        {/* /cart/add.js */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">/cart/add.js</h2>
          <p className="mt-4 text-lg text-gray-700">
            Adds items to the cart. Can add a single item or multiple items at
            once. Requires POST request with variant ID and quantity.
          </p>
          <CodeBlock
            code={`// Add single item
fetch('/cart/add.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: 40934235668668,  // Variant ID (required)
    quantity: 1,          // Quantity (required, default: 1)
    properties: {         // Optional: custom properties
      custom_key: 'value'
    }
  })
})
  .then(response => response.json())
  .then(item => {
    // Returns the added item object
    console.log('Item added:', item);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Add multiple items at once
fetch('/cart/add.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    items: [
      { 
        id: 40934235668668, 
        quantity: 1,
        properties: { size: 'Large' }
      },
      { 
        id: 40934235668669, 
        quantity: 2 
      }
    ]
  })
})
  .then(response => response.json())
  .then(items => {
    // Returns array of added items
    console.log('Items added:', items);
  });`}
            language="javascript"
            filename="add-to-cart.js"
          />
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">Important Notes</h4>
            <ul className="mt-2 space-y-1 text-sm text-blue-800 list-disc list-inside">
              <li>
                <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
                  id
                </code>{" "}
                must be the variant ID, not product ID
              </li>
              <li>
                If item already exists in cart with same properties, quantity is
                added
              </li>
              <li>
                Properties are key-value pairs for customization (e.g.,
                engraving, size)
              </li>
              <li>Returns the added item(s), not the full cart</li>
            </ul>
          </div>
        </section>

        {/* /cart/change.js */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">/cart/change.js</h2>
          <p className="mt-4 text-lg text-gray-700">
            Changes the quantity of a specific line item in the cart. Use the
            line item key (from cart.items array) or variant ID. Setting
            quantity to 0 removes the item.
          </p>
          <CodeBlock
            code={`// Change quantity using line item key (recommended)
fetch('/cart/change.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: '12345678901234:abc123',  // Line item key (variant_id:property_hash)
    quantity: 3                    // New quantity
  })
})
  .then(response => response.json())
  .then(cart => {
    // Returns the full updated cart object
    console.log('Cart updated:', cart);
  });

// Change quantity using variant ID
// Note: This updates ALL line items with this variant ID
fetch('/cart/change.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: 40934235668668,  // Variant ID
    quantity: 2          // New quantity
  })
})
  .then(response => response.json())
  .then(cart => console.log(cart));

// Remove item by setting quantity to 0
fetch('/cart/change.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: '12345678901234:abc123',
    quantity: 0  // Removes the item
  })
})
  .then(response => response.json())
  .then(cart => console.log(cart));`}
            language="javascript"
            filename="change-cart.js"
          />
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">Important Notes</h4>
            <ul className="mt-2 space-y-1 text-sm text-blue-800 list-disc list-inside">
              <li>
                Use line item key (from{" "}
                <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
                  cart.items[].key
                </code>
                ) for precise control
              </li>
              <li>Using variant ID updates all line items with that variant</li>
              <li>Setting quantity to 0 removes the item completely</li>
              <li>Returns the full updated cart object</li>
            </ul>
          </div>
        </section>

        {/* /cart/update.js */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">/cart/update.js</h2>
          <p className="mt-4 text-lg text-gray-700">
            Updates multiple line items at once. More efficient than multiple
            /cart/change.js calls. Use variant IDs or line item keys with new
            quantities.
          </p>
          <CodeBlock
            code={`// Update multiple items using variant IDs
fetch('/cart/update.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    updates: {
      40934235668668: 2,  // Variant ID: new quantity
      40934235668669: 3,  // Another variant
      40934235668670: 0   // Setting to 0 removes item
    }
  })
})
  .then(response => response.json())
  .then(cart => {
    // Returns the full updated cart object
    console.log('Cart updated:', cart);
  });

// Update using line item keys (more precise)
fetch('/cart/update.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    updates: {
      '12345678901234:abc123': 2,  // Line item key: new quantity
      '12345678901235:def456': 1,
      '12345678901236:ghi789': 0   // Removes item
    }
  })
})
  .then(response => response.json())
  .then(cart => console.log(cart));`}
            language="javascript"
            filename="update-cart.js"
          />
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">Important Notes</h4>
            <ul className="mt-2 space-y-1 text-sm text-blue-800 list-disc list-inside">
              <li>
                Use{" "}
                <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
                  updates
                </code>{" "}
                object with variant IDs or line item keys as keys
              </li>
              <li>Values are the new quantities (0 removes the item)</li>
              <li>More efficient than multiple /cart/change.js calls</li>
              <li>Returns the full updated cart object</li>
            </ul>
          </div>
        </section>

        {/* /cart/clear.js */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">/cart/clear.js</h2>
          <p className="mt-4 text-lg text-gray-700">
            Clears all items from the cart. Removes everything but preserves
            cart attributes and note if needed. Returns an empty cart object.
          </p>
          <CodeBlock
            code={`// Clear entire cart
fetch('/cart/clear.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
})
  .then(response => response.json())
  .then(cart => {
    // Returns cart object with empty items array
    console.log('Cart cleared:', cart);
    // cart.items = []
    // cart.item_count = 0
    // cart.total_price = 0
  })
  .catch(error => {
    console.error('Error clearing cart:', error);
  });`}
            language="javascript"
            filename="clear-cart.js"
          />
        </section>

        {/* /cart (HTML) */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">/cart</h2>
          <p className="mt-4 text-lg text-gray-700">
            Gets the cart page HTML. Used with Section Rendering API to get
            rendered sections. Use{" "}
            <code className="rounded bg-surface-2 px-1 py-0.5 text-xs">
              ?section_id=
            </code>{" "}
            or{" "}
            <code className="rounded bg-surface-2 px-1 py-0.5 text-xs">
              ?sections=
            </code>{" "}
            query parameters.
          </p>
          <CodeBlock
            code={`// Get single section HTML
fetch('/cart?section_id=cart-drawer')
  .then(response => response.text())
  .then(html => {
    // Returns HTML string for the section
    document.querySelector('#cart-drawer').innerHTML = html;
  });

// Get multiple sections as JSON
fetch('/cart?sections=cart-drawer,cart-icon-bubble')
  .then(response => response.json())
  .then(sections => {
    // Returns object: { 'cart-drawer': '<html>', 'cart-icon-bubble': '<html>' }
    document.querySelector('#cart-drawer').innerHTML = sections['cart-drawer'];
    document.querySelector('#cart-icon').innerHTML = sections['cart-icon-bubble'];
  });

// Combine with cart.js to get both JSON and HTML
Promise.all([
  fetch('/cart.js').then(r => r.json()),
  fetch('/cart?section_id=cart-drawer').then(r => r.text())
])
  .then(([cart, html]) => {
    console.log('Cart data:', cart);
    document.querySelector('#cart-drawer').innerHTML = html;
  });`}
            language="javascript"
            filename="cart-html.js"
          />
        </section>

        {/* Custom Web Components */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            Custom Web Components
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Shopify supports custom web components (Web Components API) for
            building reusable cart functionality. Components automatically
            handle cart updates and state management.
          </p>
          <CodeBlock
            code={`<!-- Cart Drawer Component -->
<cart-drawer>
  <button slot="trigger">Open Cart</button>
  <div slot="drawer">
    <cart-items>
      <template>
        <cart-item>
          <img src="{{ item.image }}" alt="{{ item.title }}">
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.price | money }}</p>
            <quantity-input 
              value="{{ item.quantity }}"
              data-variant-id="{{ item.variant_id }}"
            ></quantity-input>
            <cart-remove-button 
              data-variant-id="{{ item.variant_id }}"
            >Remove</cart-remove-button>
          </div>
        </cart-item>
      </template>
    </cart-items>
    
    <cart-summary>
      <p>Total: <cart-total-price></cart-total-price></p>
      <a href="/checkout">Checkout</a>
    </cart-summary>
  </div>
</cart-drawer>

<!-- Add to Cart Button -->
<product-form data-product-id="{{ product.id }}">
  <button type="submit">Add to Cart</button>
</product-form>

<!-- Quantity Input -->
<quantity-input 
  value="1" 
  min="1" 
  max="10"
></quantity-input>`}
            language="html"
            filename="cart-components.html"
          />
          <div className="mt-6 space-y-4">
            <Card className="border-accent/10 bg-background">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Available Cart Components
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-text-secondary list-disc list-inside">
                  <li>
                    <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">
                      &lt;cart-drawer&gt;
                    </code>{" "}
                    - Drawer component for cart
                  </li>
                  <li>
                    <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">
                      &lt;cart-items&gt;
                    </code>{" "}
                    - Container for cart items
                  </li>
                  <li>
                    <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">
                      &lt;cart-item&gt;
                    </code>{" "}
                    - Individual cart item
                  </li>
                  <li>
                    <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">
                      &lt;cart-remove-button&gt;
                    </code>{" "}
                    - Remove item button
                  </li>
                  <li>
                    <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">
                      &lt;quantity-input&gt;
                    </code>{" "}
                    - Quantity selector with +/- buttons
                  </li>
                  <li>
                    <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">
                      &lt;cart-summary&gt;
                    </code>{" "}
                    - Cart totals and summary
                  </li>
                  <li>
                    <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">
                      &lt;cart-total-price&gt;
                    </code>{" "}
                    - Displays total price
                  </li>
                  <li>
                    <code className="rounded bg-gray-700/50 px-1 py-0.5 text-xs">
                      &lt;product-form&gt;
                    </code>{" "}
                    - Form for adding products to cart
                  </li>
                </ul>
              </CardContent>
            </Card>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 className="font-semibold text-blue-900">Benefits</h4>
              <ul className="mt-2 space-y-1 text-sm text-blue-800 list-disc list-inside">
                <li>
                  Automatic state management - components handle cart updates
                </li>
                <li>Built-in accessibility features</li>
                <li>No JavaScript required - works out of the box</li>
                <li>Can be styled with CSS</li>
                <li>Can combine with JavaScript for custom behavior</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Complete Example */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">
            Complete AJAX Cart Example
          </h2>
          <CodeBlock
            code={`// Cart management class
class AjaxCart {
  async addToCart(variantId, quantity = 1) {
    const response = await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity })
    });
    
    if (!response.ok) throw new Error('Failed to add to cart');
    const item = await response.json();
    
    // Update cart UI
    await this.updateCartUI();
    return item;
  }

  async updateQuantity(lineItemKey, quantity) {
    const response = await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lineItemKey, quantity })
    });
    
    if (!response.ok) throw new Error('Failed to update cart');
    const cart = await response.json();
    
    await this.updateCartUI();
    return cart;
  }

  async removeItem(lineItemKey) {
    return this.updateQuantity(lineItemKey, 0);
  }

  async clearCart() {
    const response = await fetch('/cart/clear.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error('Failed to clear cart');
    const cart = await response.json();
    
    await this.updateCartUI();
    return cart;
  }

  async updateCartUI() {
    // Get updated cart data
    const cartResponse = await fetch('/cart.js');
    const cart = await cartResponse.json();
    
    // Get updated cart drawer HTML
    const htmlResponse = await fetch('/cart?section_id=cart-drawer');
    const html = await htmlResponse.text();
    
    // Update DOM
    document.querySelector('#cart-drawer').innerHTML = html;
    document.querySelector('#cart-count').textContent = cart.item_count;
    document.querySelector('#cart-total').textContent = this.formatMoney(cart.total_price);
  }

  formatMoney(cents) {
    return (cents / 100).toFixed(2);
  }
}

// Initialize
const cart = new AjaxCart();

// Usage
cart.addToCart(40934235668668, 1);
cart.updateQuantity('12345678901234:abc123', 3);
cart.removeItem('12345678901234:abc123');
cart.clearCart();`}
            language="javascript"
            filename="ajax-cart.js"
          />
        </section>

        {/* Learn More */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Learn More</h2>
          <p className="mt-4 text-lg text-gray-700">
            For comprehensive documentation:
          </p>
          <div className="mt-4 space-y-2">
            <div>
              <a
                href="https://shopify.dev/docs/api/ajax/reference/cart"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline font-medium"
              >
                Cart API Documentation →
              </a>
            </div>
            <div>
              <a
                href="https://shopify.dev/docs/api/section-rendering"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline font-medium"
              >
                Section Rendering API Documentation →
              </a>
            </div>
            <div>
              <a
                href="https://shopify.dev/docs/themes/custom-web-components"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline font-medium"
              >
                Custom Web Components Documentation →
              </a>
            </div>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
