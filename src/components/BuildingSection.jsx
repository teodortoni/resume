import "./BuildingSection.css";

function BuildingSection() {
  return (
    <section className="section section-alt" aria-labelledby="building-heading">
      <div className="container">
        <h2 id="building-heading" className="section-heading">Currently Building</h2>
        <article className="build-card">
          <h3>Tax Preparation Platform for Small Landlords</h3>
          <p>
            A multi-tenant application designed to simplify rental income and expense reporting and reduce the manual effort
            involved in tax preparation.
          </p>
          <p className="mono">React · TypeScript · Node.js · NestJS · PostgreSQL</p>
          <h4>Current architecture</h4>
          <ul>
            <li>Multi-tenant architecture</li>
            <li>Token-based authentication</li>
            <li>Tenant-aware data architecture</li>
            <li>Data validation workflows</li>
            <li>PDF tax-form generation</li>
          </ul>
          <h4>Exploring Agentic AI</h4>
          <p>I’m currently extending this project with AI-assisted workflows that are under active development and not yet in production.</p>
          <ul>
            <li>Receipt/document extraction</li>
            <li>Expense classification</li>
            <li>Data validation</li>
            <li>Guided tax-preparation workflows</li>
            <li>Agent orchestration</li>
          </ul>
        </article>
      </div>
    </section>
  );
}

export default BuildingSection;
