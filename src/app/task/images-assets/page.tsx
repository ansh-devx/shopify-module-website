import ContentLayout from "@/components/layout/ContentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";

export const metadata = {
  title: "Images & Assets - Shopify Learn",
  description:
    "Learn how to upload and use images in Shopify Admin for your task.",
};

export default function ImagesAssetsPage() {
  return (
    <ContentLayout
      title="Images & Assets"
      description="Learn how to upload images in Shopify Admin and use them in your sections"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <p className="mt-4 text-lg text-gray-700">
            Your PDP will include images - product images, section images, and
            other assets. Learn how to upload and manage them in Shopify Admin.
          </p>
        </section>

        {/* Uploading Images */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Uploading Images to Shopify
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Shopify provides a centralized location for managing all your
            store&apos;s images and files.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-shopify-green/20 bg-shopify-green/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-shopify-green text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Navigate to Content
                  </h3>
                  <p className="mt-2 text-white/80">
                    In your Shopify admin, go to <strong>Content</strong> in the
                    left sidebar.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-shopify-green/20 bg-shopify-green/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-shopify-green text-white font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Open Files
                  </h3>
                  <p className="mt-2 text-white/80">
                    Click on <strong>&quot;Files&quot;</strong> to access the
                    file manager.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-shopify-green/20 bg-shopify-green/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-shopify-green text-white font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    Upload Images
                  </h3>
                  <p className="mt-2 text-white/80">
                    Click <strong>&quot;Upload files&quot;</strong> or drag and
                    drop images to upload them.
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    Supported formats: JPG, PNG, GIF, SVG, WebP (recommended for
                    better performance)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Using Images in Sections */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Using Images in Sections
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Once uploaded, you can use images in your theme sections through the
            theme editor.
          </p>

          <div className="mt-6 space-y-4">
            <Card className="border-[#24393d] bg-[#151d1e]">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  In the Theme Editor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-white/80 list-decimal list-inside">
                  <li>
                    Open the theme editor (Online Store → Themes → Customize)
                  </li>
                  <li>
                    Select a section that has image settings (e.g., Image with
                    text, Banner)
                  </li>
                  <li>
                    Click on the image placeholder or &quot;Select image&quot;
                    button
                  </li>
                  <li>Choose from your uploaded files or upload a new one</li>
                  <li>The image will appear in your section</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-[#24393d] bg-[#151d1e]">
              <CardHeader>
                <CardTitle className="text-xl text-white">
                  Image Picker Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-3">
                  Most sections with image settings use the{" "}
                  <strong>image_picker</strong> setting type in schema. This
                  provides an easy interface for merchants to select images.
                </p>
                <ul className="space-y-2 text-white/80 list-disc list-inside">
                  <li>Click to browse your uploaded files</li>
                  <li>Upload new images directly from the picker</li>
                  <li>Replace or remove images easily</li>
                  <li>Images are automatically optimized by Shopify</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Product Images */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Product Images</h2>
          <p className="mt-4 text-lg text-gray-700">
            Product images are managed differently - they&apos;re uploaded
            directly to the product itself.
          </p>

          <div className="mt-6 rounded-lg border border-[#24393d] bg-[#151d1e] p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Uploading Product Images
            </h3>
            <ol className="space-y-2 text-white/80 list-decimal list-inside">
              <li>
                Go to <strong>Products</strong> in the admin
              </li>
              <li>Click on a product (or create a new one)</li>
              <li>
                In the <strong>Media</strong> section, click{" "}
                <strong>&quot;Add media&quot;</strong>
              </li>
              <li>Upload images or choose from your files</li>
              <li>The first image becomes the featured image</li>
              <li>Drag images to reorder them</li>
            </ol>
          </div>

          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">💡 For Your task</h4>
            <p className="mt-2 text-sm text-blue-800">
              Make sure your test product has images uploaded. These will be
              displayed on your PDP using Liquid variables like{" "}
              <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
                product.featured_image
              </code>{" "}
              and{" "}
              <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
                product.images
              </code>
              .
            </p>
          </div>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Image Best Practices
          </h2>
          <div className="mt-6 space-y-4">
            <Card className="border-shopify-teal/50 bg-shopify-teal/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Optimization Tips
                </h3>
                <ul className="space-y-2 text-white/80 list-disc list-inside">
                  <li>
                    <strong>File size:</strong> Keep images under 5MB for faster
                    loading
                  </li>
                  <li>
                    <strong>Format:</strong> Use WebP when possible for better
                    compression
                  </li>
                  <li>
                    <strong>Dimensions:</strong> Shopify automatically resizes
                    images, but 2048px width is recommended for product images
                  </li>
                  <li>
                    <strong>Alt text:</strong> Always add descriptive alt text
                    for accessibility and SEO
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Learn More */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">Learn More</h2>
          <p className="mt-4 text-lg text-gray-700">
            For comprehensive documentation on images and assets:
          </p>
          <div className="mt-4 space-y-2">
            <div>
              <a
                href="https://help.shopify.com/en/manual/files"
                target="_blank"
                rel="noopener noreferrer"
                className="text-shopify-blue hover:underline font-medium"
              >
                Managing Files in Shopify →
              </a>
            </div>
            <div>
              <a
                href="https://shopify.dev/docs/api/liquid/filters/image_url"
                target="_blank"
                rel="noopener noreferrer"
                className="text-shopify-blue hover:underline font-medium"
              >
                Image URL Filter Documentation →
              </a>
            </div>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
