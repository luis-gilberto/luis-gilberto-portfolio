import { Link } from "react-router-dom";
import { copy } from "../content/en";
import { folioEsHarvest } from "../content/folio-es";

export function CaseEsUnavailable() {
  return (
    <main id="studio-main" className="sh-case sh-es">
      <div className="sh-wrap">
        <p className="sh-lbl">ES · {folioEsHarvest.source}</p>
        <h1 className="sh-h1">{copy.esUnavailable.title}</h1>
        <p className="sh-lede">{copy.esUnavailable.body}</p>
        <p className="sh-body">
          <Link to="/">{copy.esUnavailable.back}</Link>
        </p>
      </div>
    </main>
  );
}
