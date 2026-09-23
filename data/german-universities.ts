/**
 * Germany's universities ranked in the global top 500 of the QS World
 * University Rankings 2027 — the specific, named source for every rank
 * below; never a private "best university" judgment. Ranks and the
 * ranking source/year come from the requester, taken as given and
 * reproduced verbatim — not independently re-verified against QS's own
 * site in this pass, and not generated or estimated by this code.
 *
 * IMAGES: none of the 28 entries below carries an `images` field yet.
 * Sourcing a real, correctly-matched, appropriately-licensed photo per
 * university (ideally three: a primary campus/building shot plus two
 * supporting images) needs either the same live web research + manual
 * visual verification this session did not have available, or RTG's own
 * curated photography — not something to fabricate or approximate with a
 * generic/stock photo (see the explicit "do not guess" instruction this
 * data model was built under). Until then, <EditorialPhoto> renders its
 * existing, already-designed placeholder motif (never a broken image,
 * never a mismatched stock photo) for every entry — see
 * components/university-explorer/UniversityExplorer.tsx. Adding a real
 * set of photos later needs zero code changes: drop the files under
 * public/images/universities/<id>/ and set that entry's `images` field.
 *
 * City names: the German spelling is used for every city except the two
 * in this list with an established, distinct Turkish/English form
 * (München/Munich/Münih, Köln/Cologne/Köln) — see localizedCityName() in
 * the Explorer component, matching this repo's existing convention of
 * using the Turkish city form elsewhere (see lib/content/tr.ts's own
 * note on this).
 */

export const QS_RANKING_SOURCE = "QS World University Rankings 2027";
export const QS_RANKING_YEAR = 2027;

export interface GermanUniversity {
  id: string;
  name: string;
  /** German spelling; localizedCityName() maps the couple of exceptions per locale. */
  city: string;
  qsRank: number;
  /** The institution's own official homepage — a stable, well-established
   * domain, not content requiring visual verification the way a photo
   * would. */
  officialUrl: string;
  /** Present only once a real, sourced photo set exists for this
   * university (see the file-level doc comment) — never populated with a
   * placeholder/stock value. */
  images?: {
    primary: { src: string; alt: string; source: string };
    secondary: { src: string; alt: string; source: string };
    tertiary: { src: string; alt: string; source: string };
  };
}

export const GERMAN_UNIVERSITIES: GermanUniversity[] = [
  { id: "tum", name: "Technical University of Munich", city: "München", qsRank: 25, officialUrl: "https://www.tum.de" },
  { id: "lmu", name: "Ludwig-Maximilians-Universität München", city: "München", qsRank: 61, officialUrl: "https://www.lmu.de" },
  { id: "heidelberg", name: "Universität Heidelberg", city: "Heidelberg", qsRank: 86, officialUrl: "https://www.uni-heidelberg.de" },
  { id: "fu-berlin", name: "Freie Universität Berlin", city: "Berlin", qsRank: 98, officialUrl: "https://www.fu-berlin.de" },
  { id: "rwth-aachen", name: "RWTH Aachen University", city: "Aachen", qsRank: 104, officialUrl: "https://www.rwth-aachen.de" },
  { id: "kit", name: "Karlsruhe Institute of Technology (KIT)", city: "Karlsruhe", qsRank: 110, officialUrl: "https://www.kit.edu" },
  { id: "hu-berlin", name: "Humboldt-Universität zu Berlin", city: "Berlin", qsRank: 140, officialUrl: "https://www.hu-berlin.de" },
  { id: "tu-berlin", name: "Technische Universität Berlin", city: "Berlin", qsRank: 158, officialUrl: "https://www.tu.berlin" },
  { id: "tu-dresden", name: "Technische Universität Dresden", city: "Dresden", qsRank: 185, officialUrl: "https://tu-dresden.de" },
  { id: "bonn", name: "Rheinische Friedrich-Wilhelms-Universität Bonn", city: "Bonn", qsRank: 209, officialUrl: "https://www.uni-bonn.de" },
  { id: "hamburg", name: "Universität Hamburg", city: "Hamburg", qsRank: 209, officialUrl: "https://www.uni-hamburg.de" },
  { id: "fau", name: "Friedrich-Alexander-Universität Erlangen-Nürnberg", city: "Erlangen", qsRank: 218, officialUrl: "https://www.fau.de" },
  { id: "tuebingen", name: "Eberhard Karls Universität Tübingen", city: "Tübingen", qsRank: 230, officialUrl: "https://uni-tuebingen.de" },
  { id: "freiburg", name: "Albert-Ludwigs-Universität Freiburg", city: "Freiburg", qsRank: 245, officialUrl: "https://www.uni-freiburg.de" },
  { id: "tu-darmstadt", name: "Technical University of Darmstadt", city: "Darmstadt", qsRank: 250, officialUrl: "https://www.tu-darmstadt.de" },
  { id: "goettingen", name: "University of Göttingen", city: "Göttingen", qsRank: 261, officialUrl: "https://www.uni-goettingen.de" },
  { id: "koeln", name: "University of Cologne", city: "Köln", qsRank: 269, officialUrl: "https://www.uni-koeln.de" },
  { id: "stuttgart", name: "Universität Stuttgart", city: "Stuttgart", qsRank: 318, officialUrl: "https://www.uni-stuttgart.de" },
  { id: "muenster", name: "University of Münster", city: "Münster", qsRank: 370, officialUrl: "https://www.uni-muenster.de" },
  { id: "frankfurt", name: "Goethe-University Frankfurt am Main", city: "Frankfurt", qsRank: 376, officialUrl: "https://www.uni-frankfurt.de" },
  { id: "bochum", name: "Ruhr-Universität Bochum", city: "Bochum", qsRank: 402, officialUrl: "https://www.ruhr-uni-bochum.de" },
  { id: "konstanz", name: "Universität Konstanz", city: "Konstanz", qsRank: 425, officialUrl: "https://www.uni-konstanz.de" },
  { id: "mannheim", name: "Universität Mannheim", city: "Mannheim", qsRank: 425, officialUrl: "https://www.uni-mannheim.de" },
  { id: "wuerzburg", name: "Julius-Maximilians-Universität Würzburg", city: "Würzburg", qsRank: 430, officialUrl: "https://www.uni-wuerzburg.de" },
  { id: "hannover", name: "Leibniz University Hannover", city: "Hannover", qsRank: 470, officialUrl: "https://www.uni-hannover.de" },
  { id: "bayreuth", name: "University of Bayreuth", city: "Bayreuth", qsRank: 472, officialUrl: "https://www.uni-bayreuth.de" },
  { id: "mainz", name: "Johannes Gutenberg-Universität Mainz", city: "Mainz", qsRank: 500, officialUrl: "https://www.uni-mainz.de" },
  { id: "potsdam", name: "Universität Potsdam", city: "Potsdam", qsRank: 500, officialUrl: "https://www.uni-potsdam.de" },
];
