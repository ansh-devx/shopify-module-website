---
title: Implementing Checkout Extensibility for Shopify Plus Brands
author: Rahul Sharma
tags: checkout, checkout extensibility, shopify plus, UI extensions, functions
date: 2025-12-05
---

# Implementing Checkout Extensibility for Shopify Plus Brands

## Overview

Checkout Extensibility is the modern way to customize checkout on Shopify Plus. It replaces checkout.liquid with a secure, upgrade-safe extension system. We've implemented this for several brands.

## Architecture

Checkout customizations consist of two parts:

1. **Checkout UI Extensions** — React-based components rendered in the checkout
2. **Shopify Functions** — Backend logic for discounts, payment customization, delivery customization

## Setting Up a Checkout UI Extension

### 1. Generate the Extension

```bash
shopify app generate extension --type checkout_ui
```

This creates a new extension in `extensions/checkout-ui/`.

### 2. Extension Target Points

Key target points we commonly use:

| Target | Location |
|--------|----------|
| `purchase.checkout.block.render` | Main content area (most flexible) |
| `purchase.checkout.delivery-address.render-before` | Before delivery address |
| `purchase.checkout.payment-method-list.render-after` | After payment methods |
| `purchase.thank-you.block.render` | Thank you page |

### 3. Basic Extension Structure

```tsx
import {
  Banner,
  BlockStack,
  Text,
  useCartLines,
  useAppMetafields,
  reactExtension,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension(
  "purchase.checkout.block.render",
  () => <CustomMessage />
);

function CustomMessage() {
  const cartLines = useCartLines();
  const metafields = useAppMetafields();

  const totalQuantity = cartLines.reduce(
    (sum, line) => sum + line.quantity,
    0
  );

  if (totalQuantity < 3) return null;

  return (
    <Banner title="Bulk Discount Applied!" status="success">
      <BlockStack>
        <Text>You qualify for our bulk discount with {totalQuantity} items!</Text>
      </BlockStack>
    </Banner>
  );
}
```

## Shopify Functions for Discount Logic

### Creating a Discount Function

```bash
shopify app generate extension --type product_discounts
```

### Example: Tiered Volume Discount

```rust
use shopify_function::prelude::*;
use shopify_function::Result;

#[shopify_function]
fn function(input: input::ResponseData) -> Result<output::FunctionResult> {
    let cart_lines = &input.cart.lines;
    let total_quantity: i64 = cart_lines
        .iter()
        .map(|line| line.quantity)
        .sum();

    let discount_percentage = match total_quantity {
        0..=2 => 0.0,
        3..=5 => 5.0,
        6..=10 => 10.0,
        _ => 15.0,
    };

    Ok(output::FunctionResult {
        discount_application_strategy: output::DiscountApplicationStrategy::FIRST,
        discounts: vec![output::Discount {
            value: output::Value::Percentage(output::Percentage {
                value: discount_percentage.to_string(),
            }),
            targets: cart_lines
                .iter()
                .map(|line| output::Target::ProductVariant(output::ProductVariantTarget {
                    id: line.merchandise.id.clone(),
                    quantity: None,
                }))
                .collect(),
            message: Some(format!("{}% volume discount", discount_percentage)),
            conditions: vec![],
        }],
    })
}
```

## Key Learnings

1. **Test early in a development store** — Checkout extensions behave differently in dev vs production
2. **Use `useAppMetafields` for configuration** — Don't hardcode values; let merchants configure via metafields
3. **Performance matters** — Checkout extensions have strict performance budgets; keep them lightweight
4. **Error boundaries** — Always handle errors gracefully; a broken checkout costs revenue
5. **Version pinning** — Pin your `@shopify/ui-extensions-react` version to avoid breaking changes
