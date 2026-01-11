import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";

export default function MetaobjectsPage() {
  return (
    <ContentLayout
      title="Metaobjects"
      description="Learn how to create and use metaobjects for complex, reusable content structures"
    >
      <div className="space-y-8">
        {/* What are Metaobjects */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            What are Metaobjects?
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Metaobjects are custom data structures that let you create and store
            complex, reusable content that isn't tied to a specific product,
            collection, or page. Think of them as custom content types.
          </p>

          <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-blue-900">💡 Use Cases</h4>
            <ul className="mt-2 space-y-1 text-sm text-blue-800">
              <li>• Team member profiles</li>
              <li>• Store locations</li>
              <li>• FAQ entries</li>
              <li>• Testimonials</li>
              <li>• Custom product specifications</li>
            </ul>
          </div>
        </section>

        {/* Creating Metaobjects */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            How to Create Metaobjects
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Step 1: Go to Settings
              </h3>
              <p className="mt-2 text-gray-700">
                Shopify Admin → Settings → Custom Data → Metaobjects
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Step 2: Add Definition
              </h3>
              <p className="mt-2 text-gray-700">Click "Add definition"</p>
            </div>
          </div>
        </section>

        {/* Example: Team Member */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Example: Team Member Metaobject
          </h2>

          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Definition Settings
            </h3>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li>
                <strong>Name:</strong> Team Member
              </li>
              <li>
                <strong>Type:</strong> team_member
              </li>
            </ul>
          </div>

          <h3 className="mt-6 text-2xl font-semibold text-gray-900">
            Step 4: Add Fields
          </h3>
          <p className="mt-2 text-gray-700">
            Click "Add field" for each field you need:
          </p>

          <div className="mt-4 space-y-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">Field 1: Name</h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>
                  <strong>Name:</strong> Name
                </li>
                <li>
                  <strong>Type:</strong> Single line text
                </li>
                <li>
                  <strong>Key:</strong> name (auto-generated)
                </li>
                <li>
                  <strong>Validation:</strong> Required
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">Field 2: Bio</h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>
                  <strong>Name:</strong> Bio
                </li>
                <li>
                  <strong>Type:</strong> Multi-line text
                </li>
                <li>
                  <strong>Key:</strong> bio
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">Field 3: Photo</h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>
                  <strong>Name:</strong> Photo
                </li>
                <li>
                  <strong>Type:</strong> File reference
                </li>
                <li>
                  <strong>Key:</strong> photo
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">
                Field 4: Social Media
              </h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>
                  <strong>Name:</strong> Social Media
                </li>
                <li>
                  <strong>Type:</strong> URL
                </li>
                <li>
                  <strong>Key:</strong> social_media
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">
                Field 5: Expertise
              </h4>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>
                  <strong>Name:</strong> Expertise
                </li>
                <li>
                  <strong>Type:</strong> List of single line text
                </li>
                <li>
                  <strong>Key:</strong> expertise
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Step 5: Save Definition
            </h3>
            <p className="mt-2 text-gray-700">
              After saving, you can create entries for this metaobject type.
            </p>
          </div>
        </section>

        {/* Using Metaobjects in Liquid */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Using Metaobjects in Liquid
          </h2>
          <CodeBlock
            code={`<!-- Access metaobject from a metafield -->
{% assign team_member = product.metafields.custom.team_member.value %}

<div class="team-member">
  {% if team_member.photo %}
    <img src="{{ team_member.photo | img_url: 'medium' }}" 
         alt="{{ team_member.name }}">
  {% endif %}
  
  <h3>{{ team_member.name }}</h3>
  
  {% if team_member.bio %}
    <p>{{ team_member.bio }}</p>
  {% endif %}
  
  {% if team_member.expertise %}
    <ul class="expertise-list">
      {% for skill in team_member.expertise %}
        <li>{{ skill }}</li>
      {% endfor %}
    </ul>
  {% endif %}
  
  {% if team_member.social_media %}
    <a href="{{ team_member.social_media }}" target="_blank">
      Follow on Social Media
    </a>
  {% endif %}
</div>`}
            language="liquid"
            filename="team-member.liquid"
          />
        </section>

        {/* Listing All Metaobjects */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900">
            Listing All Metaobjects
          </h2>
          <CodeBlock
            code={`<!-- Get all team members -->
{% assign team_members = shop.metaobjects.team_member.values %}

<div class="team-grid">
  {% for member in team_members %}
    <div class="team-card">
      {% if member.photo %}
        <img src="{{ member.photo | img_url: 'medium' }}" 
             alt="{{ member.name }}">
      {% endif %}
      <h3>{{ member.name }}</h3>
      <p>{{ member.bio | truncate: 100 }}</p>
    </div>
  {% endfor %}
</div>`}
            language="liquid"
            filename="team-list.liquid"
          />
        </section>
      </div>
    </ContentLayout>
  );
}
