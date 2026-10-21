import "./EducationSection.css";

function EducationSection() {
  return (
    <section className="section" aria-labelledby="education-heading">
      <div className="container">
        <h2 id="education-heading" className="section-heading">Education</h2>
        <p>
          <strong>B.B.A., Computer Information Systems</strong>
          <br />
          The American College of Greece
        </p>
        <p>
          <strong>Languages:</strong> English · Albanian · Greek
        </p>
      </div>
    </section>
  );
}

export default EducationSection;
