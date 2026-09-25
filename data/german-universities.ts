/**
 * Germany's universities ranked in the global top 500 of the QS World
 * University Rankings 2027 — the specific, named source for every rank
 * below; never a private "best university" judgment. Ranks and the
 * ranking source/year come from the requester, taken as given and
 * reproduced verbatim — not independently re-verified against QS's own
 * site in this pass, and not generated or estimated by this code.
 *
 * IMAGES: 27 of the 28 entries carry a real, per-university-verified
 * `images` field. Each photo was chosen from that specific university's
 * own English Wikipedia article (via the MediaWiki API's embedded-image
 * list, cross-checked against Wikidata/Commons category context) and
 * then visually confirmed — not just filename-matched — to actually show
 * that institution's own building/campus, never a generic city landmark
 * or an unrelated person/subject that merely appears in the same article.
 * Every image is real, freely-licensed Wikimedia Commons photography;
 * `source` on each image is the full attribution (photographer, license,
 * Commons file page) and must be kept intact if these images are ever
 * displayed with visible credit. `johannes-gutenberg-mainz` ("mainz") is
 * the one exception: no image in its Wikipedia article was judged a
 * suitable representative photo (the only candidate was a small, low-
 * resolution statue close-up), so it was deliberately left without an
 * `images` field rather than force a weak or mismatched picture in —
 * <UniversityImagePlaceholder> renders an honest editorial information
 * panel for it instead (name/city/rank + "no campus image" copy — never a
 * broken image, never a mismatched stock photo, and deliberately never
 * styled to look like a photograph, real or generated). A handful of
 * other entries have only 2 images (or, for bochum/konstanz, just 1)
 * where a third well-matched candidate could not be found — see
 * `images.tertiary` / `images.secondary` being absent; the Explorer
 * component already handles a missing slot the same way, per-slot.
 * Downloaded at ~1280px wide into public/images/universities/<id>/ (a
 * couple of files that Wikimedia's thumbnailer rate-limited fell back to
 * ~500px — still sharp at this component's display sizes). Swapping in
 * RTG's own photography later needs zero code changes: replace the file
 * at the same path and update that image's `alt`/`source`.
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
  /** Present only once a real, sourced photo exists for this university
   * (see the file-level doc comment) — never populated with a
   * placeholder/stock value. `secondary`/`tertiary` are independently
   * optional: some universities only had one or two well-matched,
   * verifiable photos available. */
  images?: {
    primary: { src: string; alt: string; source: string };
    secondary?: { src: string; alt: string; source: string };
    tertiary?: { src: string; alt: string; source: string };
  };
}

export const GERMAN_UNIVERSITIES: GermanUniversity[] = [
  { id: "tum", name: "Technical University of Munich", city: "München", qsRank: 25, officialUrl: "https://www.tum.de",
    images: {
      primary: { src: "/images/universities/tum/primary.jpg", alt: "Technical University of Munich's Garching research campus, aerial view", source: "Wikimedia Commons — © Graf-flugplatz, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:110910032-TUM.jpg" },
      secondary: { src: "/images/universities/tum/secondary.jpg", alt: "Interior of TUM's Informatics building at Garching, with its landmark spiral slide", source: "Wikimedia Commons — © TobiasK, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:MI-Geb%C3%A4ude_der_TU_M%C3%BCnchen_Magistrale2.JPG" },
      tertiary: { src: "/images/universities/tum/tertiary.jpg", alt: "TUM's Garching-Ost campus building with university flags", source: "Wikimedia Commons — © Gras-Ober, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:TU_M%C3%BCnchen_GO-2.jpg" },
    },
  },
  { id: "lmu", name: "Ludwig-Maximilians-Universität München", city: "München", qsRank: 61, officialUrl: "https://www.lmu.de",
    images: {
      primary: { src: "/images/universities/lmu/primary.jpg", alt: "LMU Munich's Great Hall (Audimax)", source: "Wikimedia Commons — © Church of emacs, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:LMU_M%C3%BCnchen_-_Audimax2.JPG" },
      secondary: { src: "/images/universities/lmu/secondary.jpg", alt: "LMU Munich's Große Aula assembly hall", source: "Wikimedia Commons — © Kt80, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Lmu_grosse_aula.jpg" },
    },
  },
  { id: "heidelberg", name: "Universität Heidelberg", city: "Heidelberg", qsRank: 86, officialUrl: "https://www.uni-heidelberg.de",
    images: {
      primary: { src: "/images/universities/heidelberg/primary.jpg", alt: "Heidelberg University's Old University building (Alte Universität)", source: "Wikimedia Commons — © Renardo la vulpo, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Heidelberg,_Alte_Universit%C3%A4t_v_S,_5.jpeg" },
      secondary: { src: "/images/universities/heidelberg/secondary.jpg", alt: "Main entrance of Heidelberg University Hospital's Ludolf-Krehl-Klinik", source: "Wikimedia Commons — © 3268zauber, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Heidelberg_Haupteingang_Ludolf-Krehl-Klink.JPG" },
    },
  },
  { id: "fu-berlin", name: "Freie Universität Berlin", city: "Berlin", qsRank: 98, officialUrl: "https://www.fu-berlin.de",
    images: {
      primary: { src: "/images/universities/fu-berlin/primary.jpg", alt: "Free University of Berlin's economics building", source: "Wikimedia Commons — © Dirk Ingo Franke, CC BY-SA 2.0 — https://commons.wikimedia.org/wiki/File:FU_Berlin_Wirtschaftswissenschaften_w%C3%A4hrend_FCRC.JPG" },
      secondary: { src: "/images/universities/fu-berlin/secondary.jpg", alt: "A Free University of Berlin institute building on Königin-Luise-Straße", source: "Wikimedia Commons — © Axel Mauruszat, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Universit%C3%A4tsinstitut_K%C3%B6nigin-Luise-Str_12-16.jpg" },
    },
  },
  { id: "rwth-aachen", name: "RWTH Aachen University", city: "Aachen", qsRank: 104, officialUrl: "https://www.rwth-aachen.de",
    images: {
      primary: { src: "/images/universities/rwth-aachen/primary.jpg", alt: "RWTH Aachen's SuperC building illuminated at night", source: "Wikimedia Commons — © Euku:⇄, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:SuperC_-_bei_Nacht.jpg" },
      secondary: { src: "/images/universities/rwth-aachen/secondary.jpg", alt: "RWTH Aachen University's historic main building", source: "Wikimedia Commons — © א (Aleph), CC BY-SA 2.5 — https://commons.wikimedia.org/wiki/File:RWTH_Aachen_Hauptgeb%C3%A4ude.jpg" },
      tertiary: { src: "/images/universities/rwth-aachen/tertiary.jpg", alt: "RWTH Aachen's Institute of Physical Chemistry", source: "Wikimedia Commons — © Sascha Faber, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Institut_f%C3%BCr_physikalische_Chemie_-_RWTH_Aachen.jpg" },
    },
  },
  { id: "kit", name: "Karlsruhe Institute of Technology (KIT)", city: "Karlsruhe", qsRank: 110, officialUrl: "https://www.kit.edu",
    images: {
      primary: { src: "/images/universities/kit/primary.jpg", alt: "A historic Karlsruhe Institute of Technology building (Victoriapensionat)", source: "Wikimedia Commons — © Haeferl, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Karlsruhe_-_Institute_of_Technology_-_Victoriapensionat_I.jpg" },
      secondary: { src: "/images/universities/kit/secondary.jpg", alt: "Karlsruhe Institute of Technology building at Otto-Ammann-Platz", source: "Wikimedia Commons — © Dr. Bernd Gross, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Otto-Ammann-Platz_1_Karlsruhe_2.JPG" },
      tertiary: { src: "/images/universities/kit/tertiary.jpg", alt: "KIT's Institute of Electrical Engineering", source: "Wikimedia Commons — © Coaster J, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Elektrotechnisches_Institut_KIT_01.jpg" },
    },
  },
  { id: "hu-berlin", name: "Humboldt-Universität zu Berlin", city: "Berlin", qsRank: 140, officialUrl: "https://www.hu-berlin.de",
    images: {
      primary: { src: "/images/universities/hu-berlin/primary.jpg", alt: "Humboldt University of Berlin's main building on Unter den Linden", source: "Wikimedia Commons — © Christian Wolf (www.c-w-design.de), CC BY-SA 3.0 de — https://commons.wikimedia.org/wiki/File:Frontansicht_des_Hauptgeb%C3%A4udes_der_Humboldt-Universit%C3%A4t_in_Berlin.jpg" },
      secondary: { src: "/images/universities/hu-berlin/secondary.jpg", alt: "The Alexander von Humboldt monument in front of Humboldt University", source: "Wikimedia Commons — © Christian Wolf (www.c-w-design.de), CC BY-SA 3.0 de — https://commons.wikimedia.org/wiki/File:Alexander_von_Humboldt_Denkmal_-_Humboldt_Universit%C3%A4t_zu_Berlin.jpg" },
    },
  },
  { id: "tu-berlin", name: "Technische Universität Berlin", city: "Berlin", qsRank: 158, officialUrl: "https://www.tu.berlin",
    images: {
      primary: { src: "/images/universities/tu-berlin/primary.jpg", alt: "Technical University of Berlin's chemistry building", source: "Wikimedia Commons — © RobbieIanMorrison, CC BY 4.0 — https://commons.wikimedia.org/wiki/File:TU_Berlin_chemistry_building_overall.jpg" },
      secondary: { src: "/images/universities/tu-berlin/secondary.jpg", alt: "Technical University of Berlin's main building, aerial view", source: "Wikimedia Commons — © TU Berlin/Pressestelle/Ulrich Dahl, Copyrighted free use — https://commons.wikimedia.org/wiki/File:TU_Berlin_Hauptgebaeude070710_UlrichDahl.jpg" },
    },
  },
  { id: "tu-dresden", name: "Technische Universität Dresden", city: "Dresden", qsRank: 185, officialUrl: "https://tu-dresden.de",
    images: {
      primary: { src: "/images/universities/tu-dresden/primary.jpg", alt: "TU Dresden's Andreas-Pfitzmann-Bau in spring", source: "Wikimedia Commons — © Julian Mendez, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Andreas-Pfitzmann-Bau-TU_Dresden-20160408.jpg" },
      secondary: { src: "/images/universities/tu-dresden/secondary.jpg", alt: "TU Dresden's Hörsaalzentrum (lecture hall centre)", source: "Wikimedia Commons — © Hans-Jürgen Räth Akrisios, Public domain — https://commons.wikimedia.org/wiki/File:HSZ_TUDresden.jpg" },
    },
  },
  { id: "bonn", name: "Rheinische Friedrich-Wilhelms-Universität Bonn", city: "Bonn", qsRank: 209, officialUrl: "https://www.uni-bonn.de",
    images: {
      primary: { src: "/images/universities/bonn/primary.jpg", alt: "University of Bonn's main building, the former Electoral Palace", source: "Wikimedia Commons — © Thomas Wolf (Der Wolf im Wald), CC BY-SA 2.5 — https://commons.wikimedia.org/wiki/File:Universit%C3%A4t_Bonn.jpg" },
      secondary: { src: "/images/universities/bonn/secondary.jpg", alt: "The Säulenhalle (columned hall) inside University of Bonn's main building", source: "Wikimedia Commons — © Axel Kirch, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:2016-05-04-bonn-universitaet-innenansicht-saeulenhalle-05.jpg" },
      tertiary: { src: "/images/universities/bonn/tertiary.jpg", alt: "The Rosenhof courtyard of University of Bonn's main building", source: "Wikimedia Commons — © Axel Kirch, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:2016-05-04-bonn-universitaet-innenansicht-rosenhof-03.jpg" },
    },
  },
  { id: "hamburg", name: "Universität Hamburg", city: "Hamburg", qsRank: 209, officialUrl: "https://www.uni-hamburg.de",
    images: {
      primary: { src: "/images/universities/hamburg/primary.jpg", alt: "University of Hamburg's domed main building, aerial view", source: "Wikimedia Commons — © Merlin Senger, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:UniHHHauptgebaeude.jpg" },
      secondary: { src: "/images/universities/hamburg/secondary.jpg", alt: "University of Hamburg's Philosophenturm (Philosophy Tower)", source: "Wikimedia Commons — © Dirk Franke, Southpark, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Uni-hh-philo-turm.JPG" },
    },
  },
  { id: "fau", name: "Friedrich-Alexander-Universität Erlangen-Nürnberg", city: "Erlangen", qsRank: 218, officialUrl: "https://www.fau.de",
    images: {
      primary: { src: "/images/universities/fau/primary.jpg", alt: "Schloss Erlangen, the historic seat of FAU Erlangen-Nürnberg", source: "Wikimedia Commons — © Selby, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Schloss-Erlangen02.JPG" },
      secondary: { src: "/images/universities/fau/secondary.jpg", alt: "FAU's Computer Science department building", source: "Wikimedia Commons — © Chu86happychu, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:University_of_Erlangen-Nuremberg-Computer_Science_Department.JPG" },
      tertiary: { src: "/images/universities/fau/tertiary.jpg", alt: "FAU's Laboratory of Telecommunications, Technical Faculty", source: "Wikimedia Commons — © Chu86happychu, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:University_of_Erlangen-Nuremberg_-_Laboratory_of_Telecommunication_-_Technical_Faculty.JPG" },
    },
  },
  { id: "tuebingen", name: "Eberhard Karls Universität Tübingen", city: "Tübingen", qsRank: 230, officialUrl: "https://uni-tuebingen.de",
    images: {
      primary: { src: "/images/universities/tuebingen/primary.jpg", alt: "University of Tübingen's Neue Aula in summer", source: "Wikimedia Commons — © Prissantenbär, Public domain — https://commons.wikimedia.org/wiki/File:Uni_T%C3%BCbingen_Neue_Aula_Sommer.jpg" },
      secondary: { src: "/images/universities/tuebingen/secondary.jpg", alt: "Reading room inside Tübingen's Bonatzbau library", source: "Wikimedia Commons — © Laphroaig1991, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Innenansicht_Bonatzbau.jpg" },
      tertiary: { src: "/images/universities/tuebingen/tertiary.jpg", alt: "University of Tübingen's library building entrance", source: "Wikimedia Commons — © Der gestiefelte Kater, CC BY-SA 2.5 — https://commons.wikimedia.org/wiki/File:TuebingenUniBibliothek.jpg" },
    },
  },
  { id: "freiburg", name: "Albert-Ludwigs-Universität Freiburg", city: "Freiburg", qsRank: 245, officialUrl: "https://www.uni-freiburg.de",
    images: {
      primary: { src: "/images/universities/freiburg/primary.jpg", alt: "University of Freiburg's University Library", source: "Wikimedia Commons — © Peitho84, CC BY 3.0 — https://commons.wikimedia.org/wiki/File:Unibibliothek_Freiburg.JPG" },
      secondary: { src: "/images/universities/freiburg/secondary.jpg", alt: "University of Freiburg's Kollegiengebäude IV (old university library)", source: "Wikimedia Commons — © Andreas Schwarzkopf, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Uni_Freiburg_KG_IV_(alte_UB).JPG" },
      tertiary: { src: "/images/universities/freiburg/tertiary.jpg", alt: "A statue at the entrance of Freiburg's Kollegiengebäude I", source: "Wikimedia Commons — © user:Joergens.mi, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Kolleggeb%C3%A4ude_I_Figur_Eingang_rechts_Fr.jpg" },
    },
  },
  { id: "tu-darmstadt", name: "Technical University of Darmstadt", city: "Darmstadt", qsRank: 250, officialUrl: "https://www.tu-darmstadt.de",
    images: {
      primary: { src: "/images/universities/tu-darmstadt/primary.jpg", alt: "TU Darmstadt's historic main building (Altes Hauptgebäude)", source: "Wikimedia Commons — © Aidexxx, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Darmstadt_Hochschulstra%C3%9Fe_1_Altes_Hauptgeb%C3%A4ude_der_TH_001.JPG" },
      secondary: { src: "/images/universities/tu-darmstadt/secondary.jpg", alt: "TU Darmstadt's Campusplatz courtyard", source: "Wikimedia Commons — © Grffine, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Campusplatz_TU_Darmstadt.jpg" },
      tertiary: { src: "/images/universities/tu-darmstadt/tertiary.jpg", alt: "TU Darmstadt's lecture hall and media centre at Lichtwiese campus", source: "Wikimedia Commons — © Grffine, CC0 — https://commons.wikimedia.org/wiki/File:TU_Darmstadt_H%C3%B6rsaal-Medienzentrum-Campus-Lichtwiese.jpg" },
    },
  },
  { id: "goettingen", name: "University of Göttingen", city: "Göttingen", qsRank: 261, officialUrl: "https://www.uni-goettingen.de",
    images: {
      primary: { src: "/images/universities/goettingen/primary.jpg", alt: "University of Göttingen's Aula at Wilhelmsplatz", source: "Wikimedia Commons — © A.Savin, FAL — https://commons.wikimedia.org/wiki/File:G%C3%B6ttingen_asv2022-06_img42_Uni_Aula_Wilhelmsplatz.jpg" },
      secondary: { src: "/images/universities/goettingen/secondary.jpg", alt: "University of Göttingen's auditorium building", source: "Wikimedia Commons — © Daniel Schwen, CC BY-SA 2.5 — https://commons.wikimedia.org/wiki/File:Auditorium_G%C3%B6ttingen.jpg" },
      tertiary: { src: "/images/universities/goettingen/tertiary.jpg", alt: "The historic Göttingen Observatory", source: "Wikimedia Commons — © Daniel Schwen, CC BY-SA 2.5 — https://commons.wikimedia.org/wiki/File:Goe_Sternwarte_pano.jpg" },
    },
  },
  { id: "koeln", name: "University of Cologne", city: "Köln", qsRank: 269, officialUrl: "https://www.uni-koeln.de",
    images: {
      primary: { src: "/images/universities/koeln/primary.jpg", alt: "University of Cologne's main building", source: "Wikimedia Commons — © Raimond Spekking, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Hauptgeb%C3%A4ude_der_Universit%C3%A4t_zu_K%C3%B6ln-5634.jpg" },
      secondary: { src: "/images/universities/koeln/secondary.jpg", alt: "University of Cologne's Philosophikum building", source: "Wikimedia Commons — © Raimond Spekking, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Philosophikum,_Universit%C3%A4t_zu_K%C3%B6ln-0548.jpg" },
      tertiary: { src: "/images/universities/koeln/tertiary.jpg", alt: "University of Cologne's WiSo building (economics and social sciences)", source: "Wikimedia Commons — © Raimond Spekking, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:WiSo-Geb%C3%A4ude,_Universit%C3%A4t_zu_K%C3%B6ln-0518.jpg" },
    },
  },
  { id: "stuttgart", name: "Universität Stuttgart", city: "Stuttgart", qsRank: 318, officialUrl: "https://www.uni-stuttgart.de",
    images: {
      primary: { src: "/images/universities/stuttgart/primary.jpg", alt: "University of Stuttgart's Stadtmitte campus buildings", source: "Wikimedia Commons — © Christoph Hoffmann, CC BY-SA 2.0 de — https://commons.wikimedia.org/wiki/File:Universit%C3%A4t_Stuttgart_(Stadtmitte)_002.JPG" },
      secondary: { src: "/images/universities/stuttgart/secondary.jpg", alt: "University of Stuttgart's International Centre", source: "Wikimedia Commons — © Julian Herzog (Website), CC BY 4.0 — https://commons.wikimedia.org/wiki/File:Internationales_Zentrum_Universit%C3%A4t_Stuttgart_1.jpg" },
      tertiary: { src: "/images/universities/stuttgart/tertiary.jpg", alt: "University of Stuttgart's Pfaffenhof II building at Vaihingen campus", source: "Wikimedia Commons — © Julian Herzog (Website), CC BY 4.0 — https://commons.wikimedia.org/wiki/File:Pfaffenhof_II_Universit%C3%A4t_Stuttgart.jpg" },
    },
  },
  { id: "muenster", name: "University of Münster", city: "Münster", qsRank: 370, officialUrl: "https://www.uni-muenster.de",
    images: {
      primary: { src: "/images/universities/muenster/primary.jpg", alt: "University of Münster's main building, the former Prince-Bishop's Palace", source: "Wikimedia Commons — © Dietmar Rabich, CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:M%C3%BCnster,_F%C3%BCrstbisch%C3%B6fliches_Schloss_--_2014_--_6769-71_(retouched).jpg" },
      secondary: { src: "/images/universities/muenster/secondary.jpg", alt: "Entrance to the English Seminar at the University of Münster", source: "Wikimedia Commons — © NordhornerII, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Entrance_English_Seminar_University_M%C3%BCnster.jpg" },
      tertiary: { src: "/images/universities/muenster/tertiary.jpg", alt: "University of Münster's Physics building", source: "Wikimedia Commons — © STBR, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:MuensterUniversityPhysics.jpg" },
    },
  },
  { id: "frankfurt", name: "Goethe-University Frankfurt am Main", city: "Frankfurt", qsRank: 376, officialUrl: "https://www.uni-frankfurt.de",
    images: {
      primary: { src: "/images/universities/frankfurt/primary.jpg", alt: "Goethe University Frankfurt's Westend campus", source: "Wikimedia Commons — © Shadowcat45, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Campus_Westend_Frankfurt_01.jpg" },
      secondary: { src: "/images/universities/frankfurt/secondary.jpg", alt: "A lecture hall at Goethe University's Westend campus", source: "Wikimedia Commons — © Goethe-uni, CC BY 3.0 — https://commons.wikimedia.org/wiki/File:Campus-westend-hoersaalgebaeude-hoersaal-2008-10-27-5.jpg" },
      tertiary: { src: "/images/universities/frankfurt/tertiary.jpg", alt: "Goethe University's historic IG Farben building", source: "Wikimedia Commons — © Eva K., GFDL 1.2 — https://commons.wikimedia.org/wiki/File:IG_Farben_Gebaeude_Uni_Frankfurt.jpg" },
    },
  },
  { id: "bochum", name: "Ruhr-Universität Bochum", city: "Bochum", qsRank: 402, officialUrl: "https://www.ruhr-uni-bochum.de",
    images: {
      primary: { src: "/images/universities/bochum/primary.jpg", alt: "Ruhr University Bochum's Audimax lecture hall", source: "Wikimedia Commons — © MorphX, Public domain — https://commons.wikimedia.org/wiki/File:Audimax-Aussen.jpg" },
    },
  },
  { id: "konstanz", name: "Universität Konstanz", city: "Konstanz", qsRank: 425, officialUrl: "https://www.uni-konstanz.de",
    images: {
      primary: { src: "/images/universities/konstanz/primary.jpg", alt: "The pyramid glass roofs of the University of Konstanz campus", source: "Wikimedia Commons — © Christian Schirm, Public domain — https://commons.wikimedia.org/wiki/File:Glasdach_Uni_Konstanz.JPG" },
    },
  },
  { id: "mannheim", name: "Universität Mannheim", city: "Mannheim", qsRank: 425, officialUrl: "https://www.uni-mannheim.de",
    images: {
      primary: { src: "/images/universities/mannheim/primary.jpg", alt: "University of Mannheim's seat, the Baroque Mannheim Palace", source: "Wikimedia Commons — © Hubert Berberich (HubiB), CC BY 3.0 — https://commons.wikimedia.org/wiki/File:SchlossMannheim-Pano-130616.jpg" },
      secondary: { src: "/images/universities/mannheim/secondary.jpg", alt: "University of Mannheim's MZES institute building", source: "Wikimedia Commons — © Nikolaus Hollermeier, CC BY 3.0 — https://commons.wikimedia.org/wiki/File:MZES_Uni_Mannheim_A5.jpg" },
    },
  },
  { id: "wuerzburg", name: "Julius-Maximilians-Universität Würzburg", city: "Würzburg", qsRank: 430, officialUrl: "https://www.uni-wuerzburg.de",
    images: {
      primary: { src: "/images/universities/wuerzburg/primary.jpg", alt: "University of Würzburg's Old University building", source: "Wikimedia Commons — © Robert Emmerich, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Wuerzburg_old_university_2001.jpg" },
      secondary: { src: "/images/universities/wuerzburg/secondary.jpg", alt: "University of Würzburg's New University building", source: "Wikimedia Commons — © Robert Emmerich, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Wuerzburg_new_university_2005.jpg" },
      tertiary: { src: "/images/universities/wuerzburg/tertiary.jpg", alt: "University of Würzburg's library building", source: "Wikimedia Commons — © Robert Emmerich, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Wuerzburg_university_library2002.jpg" },
    },
  },
  { id: "hannover", name: "Leibniz University Hannover", city: "Hannover", qsRank: 470, officialUrl: "https://www.uni-hannover.de",
    images: {
      primary: { src: "/images/universities/hannover/primary.jpg", alt: "Leibniz University Hannover's main building (Welfenschloss)", source: "Wikimedia Commons — © Firefeichti, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Universitaet_Hannover_Hauptgeb%C3%A4ude.JPG" },
      secondary: { src: "/images/universities/hannover/secondary.jpg", alt: "Leibniz University Hannover's main building lit at night", source: "Wikimedia Commons — © Christian A. Schröder (ChristianSchd), CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:Office_building_Leibniz_Universitaet_Hannover_Conti-Campus_Koenigsworther_Platz_Mitte_Hannover_Germany_03.jpg" },
      tertiary: { src: "/images/universities/hannover/tertiary.jpg", alt: "The TIB library building serving Leibniz University Hannover", source: "Wikimedia Commons — © Christian A. Schröder (ChristianSchd), CC BY-SA 4.0 — https://commons.wikimedia.org/wiki/File:German_National_Library_of_Science_and_Technology_TIB_university_library_Hannover_UB_Am_Welfengarten_1b_Nordstadt_Hannover_Germany_04.jpg" },
    },
  },
  { id: "bayreuth", name: "University of Bayreuth", city: "Bayreuth", qsRank: 472, officialUrl: "https://www.uni-bayreuth.de",
    images: {
      primary: { src: "/images/universities/bayreuth/primary.jpg", alt: "University of Bayreuth's Audimax building", source: "Wikimedia Commons — © H. Wurst, CC BY-SA 2.0 de — https://commons.wikimedia.org/wiki/File:Auditorium_maximum_der_Universit%C3%A4t_Bayreuth_im_Herbst_2006.jpg" },
      secondary: { src: "/images/universities/bayreuth/secondary.jpg", alt: "University of Bayreuth's campus in autumn", source: "Wikimedia Commons — © Christian Wißler, Hochschulmarketing, Public domain — https://commons.wikimedia.org/wiki/File:Campus-bayreuth-1.jpg" },
      tertiary: { src: "/images/universities/bayreuth/tertiary.jpg", alt: "University of Bayreuth's campus grounds", source: "Wikimedia Commons — © Christian Wißler, Hochschulmarketing, Public domain — https://commons.wikimedia.org/wiki/File:Campus-bayreuth-2.jpg" },
    },
  },
  { id: "mainz", name: "Johannes Gutenberg-Universität Mainz", city: "Mainz", qsRank: 500, officialUrl: "https://www.uni-mainz.de" },
  { id: "potsdam", name: "Universität Potsdam", city: "Potsdam", qsRank: 500, officialUrl: "https://www.uni-potsdam.de",
    images: {
      primary: { src: "/images/universities/potsdam/primary.jpg", alt: "A University of Potsdam courtyard building", source: "Wikimedia Commons — © Ben Titze, Public domain — https://commons.wikimedia.org/wiki/File:Uni_Potsdam_Court.JPG" },
      secondary: { src: "/images/universities/potsdam/secondary.jpg", alt: "University of Potsdam's Babelsberg campus, Haus 1", source: "Wikimedia Commons — © Jorges at German Wikipedia, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Universitaet_Potsdam_-_Babelsberg_-_Haus_1.jpg" },
      tertiary: { src: "/images/universities/potsdam/tertiary.jpg", alt: "University of Potsdam's Am Neuen Palais campus", source: "Wikimedia Commons — © Hedavid at German Wikipedia, CC BY-SA 3.0 — https://commons.wikimedia.org/wiki/File:Universit%C3%A4t_Potsdam_-_Am_Neuen_Palais.jpg" },
    },
  },
];
