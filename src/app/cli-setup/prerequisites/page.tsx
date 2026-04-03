import ContentLayout from "@/components/layout/ContentLayout";
import CodeBlock from "@/components/code-block/CodeBlock";

export default function CLIPrerequisites() {
  return (
    <ContentLayout
      title="Shopify CLI - Prerequisites"
      description="Set up the required tools before installing Shopify CLI"
    >
      <div className="space-y-8">
        {/* Install Homebrew */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Install Homebrew</h2>
          <p className="mt-4 text-lg text-gray-700">
            Homebrew is a package manager for macOS that makes it easy to
            install and manage software.
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            Installation Command
          </h3>
          <CodeBlock
            code={`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`}
            language="bash"
            filename="terminal"
          />

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            After Installation
          </h3>
          <CodeBlock
            code={`echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"`}
            language="bash"
            filename="terminal"
          />

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            Verify Installation
          </h3>
          <CodeBlock
            code={`brew --version`}
            language="bash"
            filename="terminal"
          />
        </section>

        {/* Install Git */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Install Git</h2>
          <p className="mt-4 text-lg text-gray-700">
            Git is a version control system that helps you track changes in your
            code.
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            Installation Command
          </h3>
          <CodeBlock
            code={`brew install git`}
            language="bash"
            filename="terminal"
          />

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            Verify Installation
          </h3>
          <CodeBlock
            code={`git --version`}
            language="bash"
            filename="terminal"
          />

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            Configure Git
          </h3>
          <p className="mt-2 text-gray-700">Set your name:</p>
          <CodeBlock
            code={`git config --global user.name "Your Full Name"`}
            language="bash"
            filename="terminal"
          />

          <p className="mt-4 text-gray-700">Set your email:</p>
          <CodeBlock
            code={`git config --global user.email "your.email@devxlabs.ai"`}
            language="bash"
            filename="terminal"
          />
        </section>

        {/* Install Node */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Install Node.js</h2>
          <p className="mt-4 text-lg text-gray-700">
            Node.js is a JavaScript runtime that allows you to run JavaScript on
            your computer.
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            Installation Command
          </h3>
          <CodeBlock
            code={`brew install node`}
            language="bash"
            filename="terminal"
          />

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            Verify Installation
          </h3>
          <CodeBlock
            code={`node --version`}
            language="bash"
            filename="terminal"
          />
        </section>

        {/* Install zsh */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary">Install Zsh</h2>
          <p className="mt-4 text-lg text-gray-700">
            Zsh is a powerful shell that provides better command-line
            experience.
          </p>

          <h3 className="mt-6 text-2xl font-semibold text-text-primary">
            Installation Command
          </h3>
          <CodeBlock
            code={`brew install zsh`}
            language="bash"
            filename="terminal"
          />
        </section>
      </div>
    </ContentLayout>
  );
}
