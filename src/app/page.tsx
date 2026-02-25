import "../styles/teaser.css";
// import  Header  from "./components/Header";

export default function Home() {
  return (
    <div>
      <main className="teaser">
        <div className="bubbles">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="teaser-content">
          <h1>Coming Soon.</h1>
          <p>We’re building something great.</p>

          <p>
            For now, visit:{" "}
            <a href="https://kmanejo.wixstudio.com/trlars" target="_blank">
              TRACER
            </a>
          </p>
        </div>

      </main>
    </div>
  );
}