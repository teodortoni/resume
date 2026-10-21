import "./ApproachSection.css";

const CARDS = [
  { title: "Performance", body: "I like measuring the bottleneck before optimizing it." },
  { title: "Ownership", body: "I’m comfortable working across APIs, data, infrastructure, and the user-facing product." },
  { title: "Reliability", body: "Production systems need observability, testing, and thoughtful failure handling." },
  { title: "Practicality", body: "I care about choosing the simplest solution that solves the actual problem." }
];

function ApproachSection() {
  return (
    <section className="section" aria-labelledby="approach-heading">
      <div className="container">
        <h2 id="approach-heading" className="section-heading">Engineering Approach</h2>
        <div className="approach-grid">
          {CARDS.map((card) => (
            <article key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ApproachSection;
