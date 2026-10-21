import "./ResultsSection.css";

const RESULTS = [
  { value: "35%+", label: "API latency reduction across production services" },
  { value: "5 min", label: "Release time, down from ~1 hour" },
  { value: "99%", label: "Production uptime maintained" },
  { value: "1M+", label: "Requests supported in production systems" },
  { value: "4", label: "API applications led from concept to launch" }
];

function ResultsSection() {
  return (
    <section className="section impact" aria-labelledby="impact-heading">
      <div className="container">
        <h2 id="impact-heading">Selected Results</h2>
        <div className="impact-grid">
          {RESULTS.map((item) => (
            <article key={item.value + item.label}>
              <p className="impact-number">{item.value}</p>
              <p>{item.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ResultsSection;
