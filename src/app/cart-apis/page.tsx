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
      description="Learn how to build dynamic, AJAX-powered shopping experiences using Shopify's Cart and Section Rendering APIs."
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Cart API Overview
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            The Shopify Cart API allows you to interact with the cart using
            JavaScript, enabling dynamic cart updates without page reloads.
            Perfect for modern, app-like experiences.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Get Cart Contents
          </h2>
          <CodeBlock
            code={`// Get cart as JSON
fetch('/cart.js')
  .then(response => response.json())
  .then(cart => {
    console.log(cart);
    console.log('Total items:', cart.item_count);
    console.log('Total price:', cart.total_price);
  });`}
            language="javascript"
            filename="get-cart.js"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Add to Cart</h2>
          <CodeBlock
            code={`// Add single item
fetch('/cart/add.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: 40934235668668,  // variant ID
    quantity: 1
  })
})
  .then(response => response.json())
  .then(item => {
    console.log('Item added:', item);
  });

// Add multiple items
fetch('/cart/add.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    items: [
      { id: 40934235668668, quantity: 1 },
      { id: 40934235668669, quantity: 2 }
    ]
  })
})
  .then(response => response.json())
  .then(data => console.log(data));`}
            language="javascript"
            filename="add-to-cart.js"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Update Cart</h2>
          <CodeBlock
            code={`// Update item quantity
fetch('/cart/change.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    id: 'variant-id-or-line-item-key',
    quantity: 3
  })
})
  .then(response => response.json())
  .then(cart => console.log(cart));

// Update multiple items
fetch('/cart/update.js', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    updates: {
      40934235668668: 2,
      40934235668669: 0  // 0 removes the item
    }
  })
})
  .then(response => response.json())
  .then(cart => console.log(cart));`}
            language="javascript"
            filename="update-cart.js"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Clear Cart</h2>
          <CodeBlock
            code={`fetch('/cart/clear.js', {
  method: 'POST'
})
  .then(response => response.json())
  .then(cart => {
    console.log('Cart cleared:', cart);
  });`}
            language="javascript"
            filename="clear-cart.js"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Section Rendering API
          </h2>
          <p className="mt-4 text-gray-700">
            The Section Rendering API allows you to re-render specific sections
            of your theme without reloading the entire page.
          </p>
          <CodeBlock
            code={`// Render a specific section
fetch('/cart?section_id=cart-drawer')
  .then(response => response.text())
  .then(html => {
    // Update the DOM with the new HTML
    document.querySelector('#cart-drawer').innerHTML = html;
  });

// Render multiple sections
fetch('/cart?sections=cart-drawer,cart-icon-bubble')
  .then(response => response.json())
  .then(sections => {
    // sections is an object with section IDs as keys
    document.querySelector('#cart-drawer').innerHTML = 
      sections['cart-drawer'];
    document.querySelector('#cart-icon').innerHTML = 
      sections['cart-icon-bubble'];
  });`}
            language="javascript"
            filename="section-rendering.js"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Complete AJAX Cart Example
          </h2>
          <CodeBlock
            code={`class AjaxCart {
  constructor() {
    this.init();
  }

  init() {
    // Add to cart buttons
    document.querySelectorAll('[data-add-to-cart]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const variantId = button.dataset.variantId;
        this.addToCart(variantId);
      });
    });
  }

  async addToCart(variantId, quantity = 1) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity })
      });
      
      const item = await response.json();
      await this.updateCartUI();
      this.showNotification('Item added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  async updateCartUI() {
    const response = await fetch('/cart?section_id=cart-drawer');
    const html = await response.text();
    document.querySelector('#cart-drawer').innerHTML = html;
  }

  showNotification(message) {
    // Your notification logic here
    alert(message);
  }
}

// Initialize
new AjaxCart();`}
            language="javascript"
            filename="ajax-cart.js"
          />
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900">Best Practices</h2>
          <div className="mt-6 rounded-lg border border-shopify-green/20 bg-shopify-green/5 p-6">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Always handle errors gracefully</li>
              <li>Show loading states during API calls</li>
              <li>Update cart count/total immediately for better UX</li>
              <li>Use Section Rendering API to keep UI in sync</li>
              <li>Debounce quantity updates to avoid excessive requests</li>
              <li>Consider using cart attributes for custom data</li>
            </ul>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
