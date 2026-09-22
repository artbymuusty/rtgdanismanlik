import type { Dictionary } from "./types";
import { siteConfig } from "@/lib/site-config";
import { errorMessages } from "./error-messages";

/**
 * Turkish is the site's original language. Editorial conventions used here:
 *  - Informal "sen" throughout (also in the legal pages, for one consistent voice).
 *  - "Mentör" / "Mentörlük" (TDK spelling) — never "mentor" / "mentorluk".
 *  - City names in Turkish form (Münih, not München).
 *  - Straight apostrophe for suffixes (Almanya'da); “…” for quoted phrases.
 * Keys that double as data — service `slug`s, tier `id`s, stage/assessment
 * option `value`s — must stay identical across tr/en/de (they go to the CRM sheet).
 */
export const tr: Dictionary = {
  meta: {
    siteName: siteConfig.name,
    defaultTitle: `${siteConfig.name} — Almanya eğitim yolculuğunda yol arkadaşın`,
    titleTemplate: `%s — ${siteConfig.name}`,
    defaultDescription:
      "Almanya'da eğitim hayatını ilerletmek isteyen herkes için: nereden başlayacağını bilsen de bilmesen de, mevcut durumunu birlikte değerlendirip sana uygun bir sonraki adımı belirliyoruz.",
    tagline: "Almanya eğitim yolculuğunda yol arkadaşın",
    ogEyebrow: "Almanya'da Eğitim",
  },
  common: {
    skipToContent: "Ana içeriğe geç",
    mainNavLabel: "Ana menü",
    moreNavLabel: "Diğer sayfalar",
    mobileNavLabel: "Mobil menü",
    menuOpenLabel: "Menüyü aç",
    menuCloseLabel: "Menüyü kapat",
    menuButtonOpen: "Menü",
    menuButtonClose: "Kapat",
    back: "Geri",
    next: "İleri",
    backHome: "Ana Sayfaya Dön",
    whatsappWrite: "WhatsApp'tan Bize Yaz",
    sample: "Örnek",
    socialLinksLabel: "Sosyal medya bağlantıları",
    sampleAccount: "örnek hesap",
    honeypotLabel: "Şirket",
    languageLabel: "Dil",
    languageNames: { tr: "Türkçe", en: "English", de: "Deutsch" },
    notFound: {
      eyebrow: "404",
      title: "Aradığın sayfayı bulamadık.",
      description: "Bağlantı eskimiş ya da adres yanlış yazılmış olabilir. Ana sayfadan devam edebilirsin.",
      home: "Ana Sayfaya Dön",
      contact: "İletişime Geç",
    },
    error: errorMessages.tr,
  },
  stories: {
    homeTitle: "Bu yolculukta yalnız değildiler.",
    homeSubtitle: "Bu yoldan gerçekten geçmiş olanların hikâyeleri.",
    viewAll: "Tüm Hikâyeleri Gör",
    pageTitle: "Öğrenci Hikâyeleri",
    pageIntro: "Her yol aynı şekilde başlamıyor. Ama bazen doğru bir konuşma, bir sonraki adımı görmeyi kolaylaştırıyor.",
    pageDescription:
      "Bu yoldan gerçekten geçmiş olanların hikâyeleri: nereden başladılar, hangi adımları attılar, şimdi neredeler?",
    empty: "Henüz burada paylaşabileceğimiz bir hikâye yok. İlk hikâyeler geldiğinde bu sayfa güncellenecek.",
    featuredLabel: "Öne Çıkan Hikâye",
    startedFrom: "Nereden başladı?",
    stepsTaken: "Birlikte hangi adımları attık?",
    nowWhere: "Şimdi nerede?",
    carouselLabel: "Diğer öğrenci hikâyeleri",
    previous: "Önceki öğrenci hikâyesi",
    nextStory: "Sonraki öğrenci hikâyesi",
  },
  mentors: {
    ourMentors: "Mentörlerimiz",
    germanyExperience: "Almanya deneyimi",
    education: "Eğitim geçmişi",
    specialty: "Uzmanlık alanı",
  },
  joinUsCta: {
    eyebrow: "Bize Katılın",
    title: "Almanya'da okudun mu? Sen de mentör olabilirsin.",
    description:
      "Bu süreci yaşamış olmak, arkandan gelen biri için çok şey değiştirir. Deneyimini paylaşmak istersen seni dinlemekten memnuniyet duyarız.",
    cta: "Mentör Olarak Başvur",
  },
  legal: {
    updatedLabel: "Son güncelleme",
    privacy: {
      title: "Gizlilik Politikası",
      description:
        "Hangi kişisel bilgileri neden topladığımızı ve bu bilgileri nasıl sakladığımızı açıklayan gizlilik politikamız.",
      controller: { heading: "Veri sorumlusu" },
      collected: {
        heading: "Hangi bilgileri topluyoruz?",
        body: "Başvuru formunu doldurduğunda ad, soyad, telefon/WhatsApp numarası ve e-posta adresinin yanı sıra eğitim durumun ve hedeflerinle ilgili paylaştığın bilgileri alıyoruz. Bize İletişim sayfasından WhatsApp veya e-posta yoluyla ulaştığında ise ilgili platformun kendi gizlilik kuralları geçerli olur.",
      },
      purpose: {
        heading: "Bu bilgileri ne için kullanıyoruz?",
        body: "Bilgilerini yalnızca seninle iletişime geçmek ve görüşmeye hazırlanmak için kullanıyoruz. Üçüncü taraflara satmıyor, pazarlama amacıyla da paylaşmıyoruz.",
      },
      retention: {
        heading: "Verilerin saklanması",
        bodyPrefix: "Bilgilerin, erişimi yalnızca yetkili ekip üyeleriyle sınırlı olan güvenli bir ortamda saklanır.",
        withEmail: "Bilgilerinin silinmesini istersen {email} adresine yazabilirsin.",
        beforeLink: "Bilgilerinin silinmesini istersen ",
        linkText: "iletişim sayfasındaki",
        afterLink: " kanallardan bize ulaşabilirsin.",
      },
    },
    kvkk: {
      title: "KVKK Aydınlatma Metni",
      description:
        "6698 sayılı KVKK kapsamında kişisel verilerinin nasıl işlendiğini açıklayan aydınlatma metnimiz.",
      subtitle: "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında",
      controller: { heading: "Veri sorumlusu", mersis: "MERSİS", taxOffice: "V.D." },
      data: {
        heading: "İşlenen kişisel veriler",
        body: "Ad, soyad, telefon numarası, e-posta adresi, eğitim durumu ve hedeflerinle ilgili paylaştığın bilgiler.",
      },
      purpose: {
        heading: "İşleme amacı",
        body: "Seninle iletişime geçmek, mentörlük görüşmesine hazırlanmak ve talep ettiğin bilgilendirmeyi yapmak.",
      },
      rights: {
        heading: "Sahip olduğun haklar",
        withEmail: "KVKK'nın 11. maddesi kapsamındaki haklarını kullanmak için {email} adresine yazabilirsin.",
        beforeLink: "KVKK'nın 11. maddesi kapsamındaki haklarını kullanmak için ",
        linkText: "iletişim sayfasındaki",
        afterLink: " kanallardan bize ulaşabilirsin.",
      },
    },
    terms: {
      title: "Kullanım Şartları",
      description: "Hizmetlerimizin kapsamını ve siteyi kullanırken geçerli olan şartları açıklayan kullanım şartlarımız.",
      scope: {
        heading: "Hizmetin kapsamı",
        body: `${siteConfig.name}, Almanya'da eğitim süreci konusunda yönlendirme ve mentörlük desteği sunar. Üniversite kabulünü, vize onayını ya da başka bir resmi kararı garanti etmez; bu kararlar ilgili üniversite, konsolosluk ve resmi kurumların yetkisindedir.`,
      },
      liability: {
        heading: "Sorumluluk",
        body: "Paylaştığımız bilgi ve yönlendirmeler görüşme sırasındaki bilgilere dayanır; resmi kurumların güncel şartlarını doğrulamak kullanıcının sorumluluğundadır.",
      },
      contact: {
        heading: "İletişim",
        withEmail: "Sorularını {email} adresine iletebilirsin.",
        beforeLink: "Sorularını iletmek için ",
        linkText: "iletişim sayfasındaki",
        afterLink: " kanallardan bize ulaşabilirsin.",
      },
    },
  },
  nav: {
    home: "Ana Sayfa",
    services: "Hizmetler",
    mentorship: "Mentörlük",
    studentStories: "Öğrenci Hikâyeleri",
    about: "Hakkımızda",
    pricing: "Fiyatlar",
    joinUs: "Bize Katılın",
    faq: "Sıkça Sorulan Sorular",
    contact: "İletişim",
    more: "Daha Fazla",
    ctaPrimary: "Yolculuğunu Konuşalım",
  },
  home: {
    hero: {
      eyebrow: "Almanya'da Eğitim",
      title: "Almanya'da eğitim yolculuğunda yalnız değilsin.",
      subtitle:
        "Nereden başlayacağını biliyor olabilirsin, henüz hiçbir şey bilmiyor da olabilirsin. Durumunu birlikte değerlendiriyor, sana uygun yolu adım adım planlıyoruz.",
      ctaPrimary: "Yolculuğunu Konuşalım",
      ctaSecondary: "Hizmetlerimizi Keşfet",
      imageAlt: "Berlin Ana Garı (Hauptbahnhof), Almanya yolculuğunun ilk durağı",
    },
    journey: {
      eyebrow: "Yolculuk",
      title: "Nerede olursan ol, Almanya'ya giden yolu birlikte çizelim.",
      description:
        "Türkiye'nin neresinde olursan ol, hedefin Berlin, Münih, Hamburg ya da Frankfurt olsun; bulunduğun yerden başlayabiliriz. Bu yol tek bir uçuştan ibaret değil, birçok küçük kararın toplamı.",
      mapOrigin: "Türkiye",
      mapDestination: "Almanya",
    },
    stageSelector: {
      title: "Şu anda sürecin neresindesin?",
      subtitle: "Sana en yakın olanı seç, sana uygun cevabı hemen görelim.",
      stages: [
        {
          id: "researching",
          label: "Henüz araştırıyorum",
          description:
            "Hiçbir şeyin netleşmemiş olması sorun değil. Almanya'da eğitimin nasıl işlediğini, hangi yolların mümkün olduğunu konuşarak başlayabiliriz.",
          cta: "Araştırmamı Birlikte Yapalım",
        },
        {
          id: "choosing",
          label: "Bölüm / üniversite araştırıyorum",
          description:
            "Seçenekleri tek başına elemeye çalışmak yorucu olabilir. İlgi alanını ve hedefini konuşup seçenekleri birlikte daraltabiliriz.",
          cta: "Seçeneklerimi Konuşalım",
        },
        {
          id: "preparing",
          label: "Başvuruya hazırlanıyorum",
          description:
            "Hangi belgenin ne zaman gerektiğini netleştirip süreci adım adım birlikte takip edebiliriz.",
          cta: "Hazırlığımı Planlayalım",
        },
        {
          id: "applied",
          label: "Başvurdum, sonraki adımı bilmiyorum",
          description:
            "Başvuruyu gönderdikten sonraki bekleme süreci belirsiz hissettirebilir. Şu an ne yapman gerektiğini birlikte netleştirelim.",
          cta: "Sonraki Adımı Bulalım",
        },
        {
          id: "visa",
          label: "Vize sürecindeyim",
          description:
            "Vize belgeleri ve randevu süreci dikkatli takip gerektirir. Neyin eksik olduğunu birlikte kontrol edelim.",
          cta: "Vize Sürecimi Konuşalım",
        },
        {
          id: "pre-departure",
          label: "Almanya'ya hazırlanıyorum",
          description:
            "Eğitim kadar günlük hayatı düzene sokmak da önemli. Konaklamadan ilk haftalara kadar her şeyi birlikte planlayalım.",
          cta: "Gidiş Hazırlığımı Konuşalım",
        },
        {
          id: "in-germany",
          label: "Almanya'dayım",
          description:
            "Buradaki hayatını düzenlerken ya da eğitimini ilerletirken destek almak istersen yanındayız.",
          cta: "Sürecimi Birlikte Değerlendirelim",
        },
      ],
      fallback: {
        id: "unsure",
        label: "Emin değilim",
        description:
          "Hiç sorun değil. Nereden başlayacağını bilmemen bizimle konuşmana engel değil; durumunu birlikte netleştirelim.",
        cta: "Birlikte Netleştirelim",
      },
    },
    services: {
      title: "Hizmetlerimiz",
      subtitle: "Beş alanda, sürecinin neresinde olursan ol yanındayız.",
      cta: "Tüm Hizmetleri Gör",
    },
    howWeWork: {
      title: "Nasıl çalışıyoruz?",
      subtitle: "Süreç karmaşık değil; dört adımda birlikte ilerliyoruz.",
      steps: [
        {
          title: "Seni tanıyoruz",
          description: "Kısa birkaç soruyla mevcut durumunu ve hedefini anlıyoruz.",
        },
        {
          title: "Görüşüyoruz",
          description: "Bir mentörle, durumuna özel bir görüşmede seçeneklerini konuşuyoruz.",
        },
        {
          title: "Yolu birlikte netleştiriyoruz",
          description: "Sana uygun olabilecek adımları ve zaman çizelgesini birlikte planlıyoruz.",
        },
        {
          title: "Süreç boyunca yanındayız",
          description: "Başvurudan vizeye, gerektiğinde Almanya'daki ilk günlere kadar iletişimimiz sürüyor.",
        },
      ],
    },
    mentorship: {
      title: "Yalnız ilerlemek zorunda değilsin.",
      description:
        "Mentörlerimiz bu süreci yalnızca anlatmıyor; akademik, bürokratik ve günlük hayat tarafını da biliyor. Görevleri senin yerine başvuru yapmak değil, doğru kararı vermeni kolaylaştırmak.",
      cta: "Mentörlüğü Keşfet",
      approachEyebrow: "Yaklaşımımız",
      approachQuote: "Görevleri senin yerine başvuru yapmak değil, doğru kararı vermeni kolaylaştırmak.",
    },
    visualStory: {
      eyebrow: "Günlük Hayat",
      title: "Almanya'da hayat, başvurudan ibaret değil.",
      description:
        "Bir üniversiteye kabul edilmek yolculuğun önemli bir parçası; asıl hikâye kampüse adım attığında, yeni bir şehirde kendi düzenini kurduğunda başlıyor.",
      captions: ["Humboldt Üniversitesi", "Münih", "Bibliotheca Albertina"],
    },
    humanConnection: {
      eyebrow: "Birlikte Başlayalım",
      metadata: "İlk Adım",
      title: "Önce nerede olduğunu anlayalım.",
      description:
        "Sana bir şey satmaya çalışmıyoruz; önce durumunu dinliyor, sana uygun olmayan bir yolu “uygun” gibi göstermeden dürüstçe yol gösteriyoruz.",
      cta: "Yolculuğunu Konuşalım",
      imageSrc: "/images/cities/frankfurt.jpg",
      imageAlt: "Frankfurt, Almanya",
    },
    faqPreview: {
      title: "Sıkça sorulan sorular",
      cta: "Tüm Soruları Gör",
    },
    finalCta: {
      eyebrow: "Nereden Başlarsan Başla · Almanya",
      title: "Hazırsan konuşalım.",
      description:
        "Bulunduğun yerden başlayalım. Durumunu birlikte anlayalım, ardından sana uygun yolu birlikte çizelim.",
      ctaPrimary: "Yolculuğunu Konuşalım",
      ctaSecondary: "WhatsApp'tan Bize Yaz",
    },
  },
  services: {
    title: "Hizmetlerimiz",
    intro:
      "Her hizmet, sürecin farklı bir aşamasına denk geliyor. Şu an hangisine ihtiyacın olduğundan emin değilsen, bunu da birlikte konuşarak netleştirebiliriz.",
    items: [
      {
        slug: "egitim-yonlendirme",
        title: "Eğitim ve Bölüm Yönlendirmesi",
        shortDescription: "Hedeflerine ve mevcut durumuna göre seçeneklerini birlikte değerlendiriyoruz.",
        problem:
          "Hangi bölümün, hangi şehrin veya hangi eğitim seviyesinin sana uygun olduğuna tek başına karar vermek zor olabilir.",
        help:
          "İlgi alanını, akademik geçmişini ve hedeflerini konuşarak gerçekçi seçenekleri birlikte belirliyoruz.",
        process: [
          "Kısa bir tanışma görüşmesi",
          "İlgi alanı ve akademik durum değerlendirmesi",
          "Olası bölüm ve üniversite seçeneklerinin konuşulması",
          "Bir sonraki adımın netleştirilmesi",
        ],
        scope: "Bölüm, şehir ve üniversite seçimi konusunda yönlendirme; kabul garantisi verilmez.",
        forWhom: "Henüz araştırma aşamasında olan ya da seçeneklerini daraltmak isteyen herkes için.",
        nextStep: "Durumunu anlat, birlikte bir görüşme planlayalım.",
      },
      {
        slug: "basvuru-sureci",
        title: "Üniversite Başvuru Süreci",
        shortDescription: "Başvuru sürecinde hangi adımda ne yapacağını birlikte takip ediyoruz.",
        problem:
          "Başvuru gereksinimleri üniversiteden üniversiteye değişiyor; hangi belgenin ne zaman gerektiğini takip etmek kolay değil.",
        help:
          "Başvuracağın programların gereksinimlerini netleştirip belge hazırlığını ve zaman çizelgesini birlikte düzenliyoruz.",
        process: [
          "Hedef programların gereksinimlerinin çıkarılması",
          "Belge listesinin netleştirilmesi",
          "Hazırlık takviminin oluşturulması",
          "Başvuru öncesi son kontrol",
        ],
        scope: "Süreç planlaması ve rehberlik; başvurunun üniversite tarafından değerlendirilmesi bizim kontrolümüzde değildir.",
        forWhom: "Hedefi netleşmiş, başvuruya hazırlanan ya da başvuru sürecinde olan öğrenciler için.",
        nextStep: "Hangi programları düşündüğünü paylaşarak başlayalım.",
      },
      {
        slug: "vize-hazirlik",
        title: "Vizeye Hazırlık",
        shortDescription: "Belgeler ve süreç konusunda hazırlığını düzenli biçimde yapmana yardımcı oluyoruz.",
        problem:
          "Vize süreci yoğun bir belge trafiği ve randevu takibi gerektiriyor; küçük bir eksik süreci geciktirebiliyor.",
        help:
          "Gerekli belgeleri, finansal yeterlilik kanıtı şartlarını ve randevu sürecini adım adım birlikte takip ediyoruz.",
        process: [
          "Vize türüne göre belge listesinin çıkarılması",
          "Finansal yeterlilik kanıtı ve bloke hesap (Sperrkonto) sürecinin konuşulması",
          "Randevu ve başvuru takibi",
          "Son kontrol",
        ],
        scope: "Hazırlık ve planlama desteği; vize kararı ilgili konsolosluğun yetkisindedir ve garanti edilemez.",
        forWhom: "Kabul almış ve vize sürecine girecek ya da girmiş öğrenciler için.",
        nextStep: "Hangi aşamada olduğunu anlat, süreci birlikte netleştirelim.",
      },
      {
        slug: "almanyaya-hazirlik",
        title: "Almanya'ya Hazırlık",
        shortDescription: "Eğitim kadar önemli olan yeni hayatına hazırlanırken yanında oluyoruz.",
        problem:
          "Konaklama, kayıt işlemleri, banka hesabı ve sigorta gibi pratik konular gitmeden önce netleşmezse ilk haftalar zorlaşabiliyor.",
        help:
          "Gitmeden önce ve ilk haftalarda karşına çıkacak pratik konuları birlikte planlıyoruz.",
        process: [
          "Konaklama arayışında yönlendirme",
          "Kayıt (Anmeldung) ve banka hesabı süreci hakkında bilgilendirme",
          "Sağlık sigortası konusunda yönlendirme",
          "İlk hafta kontrol listesi",
        ],
        scope: "Bilgilendirme ve planlama desteği; konaklama ve sözleşme gibi işlemleri öğrenci kendisi yürütür.",
        forWhom: "Vize süreci ilerleyen ya da gitmeye hazırlanan öğrenciler için.",
        nextStep: "Gidiş tarihini paylaş, hazırlığı birlikte planlayalım.",
      },
      {
        slug: "mentorluk",
        title: "Mentörlük",
        shortDescription: "Yalnızca başvuruya kadar değil, yolculuğun boyunca deneyim ve yönlendirme desteği sunuyoruz.",
        problem:
          "Süreç uzun ve bazen belirsiz; tek seferlik bir danışmanlık görüşmesi her sorunun cevabını vermeyebilir.",
        help:
          "Bir mentörle düzenli iletişimde kalarak süreç ilerledikçe ortaya çıkan sorulara zamanında cevap buluyorsun.",
        process: [
          "Mentör eşleştirmesi",
          "Düzenli iletişim ve ilerleme takibi",
          "Sorular çıktıkça yönlendirme",
          "Hedefe göre sürecin güncellenmesi",
        ],
        scope: "Yönlendirme ve deneyim paylaşımı; hukuki ve resmi kararlar öğrencinin ve ilgili kurumların sorumluluğundadır.",
        forWhom: "Sürecin herhangi bir aşamasında düzenli destek isteyen herkes için.",
        nextStep: "Mentörlüğün sana nasıl uyabileceğini konuşalım.",
      },
    ],
    labels: {
      problem: "Sorun",
      help: "Nasıl destek oluyoruz",
      forWhom: "Kimler için",
      process: "Süreç",
      scope: "Kapsam",
    },
  },
  mentorship: {
    title: "Mentör, senin yerine başvuru yapan kişi değil.",
    intro:
      "Bu sürecin akademik, bürokratik ve günlük yaşam tarafını bilen insanlarla çalışıyorsun. Mentörünün görevi seni yönlendirmek, doğru kararları vermeni kolaylaştırmak ve süreç boyunca yanında olmak.",
    sections: [
      {
        heading: "Mentörlüğe neden ihtiyaç var?",
        body: "Almanya'da eğitim süreci tek bir karardan ibaret değil. Bölüm seçiminden başvuruya, vizeden ilk haftalara kadar birçok küçük karar art arda geliyor; mentör, bu kararların hepsini tek başına vermek zorunda kalmamanı sağlıyor.",
      },
      {
        heading: "Ne zaman bir mentöre ihtiyaç duyarsın?",
        body: "Genellikle “şu an ne yapmam gerekiyor?” sorusuna net bir cevap bulamadığın her an. Bu, sürecin en başında da olabilir, başvurunun ortasında da, vize aşamasında da.",
      },
      {
        heading: "Mentör ne yapıyor?",
        body: "Durumunu dinler, seçeneklerini birlikte değerlendirir, süreç boyunca hangi adımın ne zaman geldiğini takip eder ve sorularına zamanında cevap verir. Kararı sen verirsin; mentör bu kararı daha bilinçli vermene yardımcı olur.",
      },
      {
        heading: "Süreç nasıl ilerliyor?",
        body: "Bir tanışma görüşmesiyle başlar. Ardından ihtiyacına göre düzenli aralıklarla iletişimde kalırsınız; bu bazen haftalık bir kontrol, bazen yalnızca kritik bir aşamadaki tek bir görüşme olur.",
      },
    ],
    processTitle: "Mentörlük süreci",
    process: [
      { title: "Tanışma görüşmesi", description: "Durumunu ve hedefini birlikte konuşuyoruz." },
      { title: "Yol haritası", description: "Sana uygun olabilecek adımları ve zamanlamayı netleştiriyoruz." },
      { title: "Düzenli takip", description: "Süreç ilerledikçe ortaya çıkan soruları birlikte çözüyoruz." },
      { title: "Kritik aşamalarda destek", description: "Başvuru, vize ve gidiş gibi kritik anlarda yanındayız." },
    ],
    cta: {
      title: "Mentörlüğün sana nasıl uyabileceğini konuşalım.",
      description: "Henüz hiçbir şey netleşmemiş olsa bile kısa bir görüşmeyle başlayabiliriz.",
      label: "Yolculuğunu Konuşalım",
    },
  },
  about: {
    title: "Hakkımızda",
    imageSrc: "/images/cities/cologne.jpg",
    imageAlt: "Köln, Almanya",
    intro:
      "Biz, bu sürecin nasıl hissettirdiğini bilen insanların kurduğu bir yapıyız.",
    sections: [
      {
        heading: "Neden varız?",
        body: "Almanya'da eğitim süreci doğru bilgiyle ilerlediğinde ulaşılabilir bir hedef. Ama dağınık bilgi, belirsiz adımlar ve yalnız ilerleme hissi bu süreci olduğundan zor gösteriyor. Biz bu boşluğu doldurmak için buradayız.",
      },
      {
        heading: "Nasıl yaklaşıyoruz?",
        body: "Yargılamadan. Geç başlamış olabilirsin, notların düşük olabilir, dilin henüz yeterli olmayabilir ya da hedefin belirsiz olabilir; bunların hiçbiri konuşmaya başlamana engel değil. Bulunduğun yerden ilerleyebileceğin seçenekleri birlikte değerlendiriyoruz.",
      },
      {
        heading: "Öğrenci için ne değişiyor?",
        body: "Çoğu kaynak ya çok genel ya da çok teknik; nerede olduğunu bilmeden bir bilgi yığınıyla karşılaşıyorsun. Biz önce durumunu anlamaya, sonra doğru bilgiyi doğru zamanda vermeye öncelik veriyoruz: tek başına elemen gereken bir yığın yerine, senin durumuna göre konuşulmuş bir yol.",
      },
      {
        heading: "Almanya'da yolculuk nasıl ilerliyor?",
        body: "Önce dinliyoruz, sonra yönlendiriyoruz. Süreç boyunca hangi adımın ne zaman geldiğini takip ediyor, sorularına zamanında cevap veriyoruz. Söz verirken gerçekçi kalıyoruz; uygun olmayan bir yolu “uygun” gibi göstermiyoruz.",
      },
      {
        heading: "Bundan sonra?",
        body: "Bu platform büyüdükçe gerçek öğrenci hikâyeleri ve gerçek mentör profilleriyle zenginleşecek. Önceliğimiz de değişmeyecek: her görüşmede aynı dikkat ve dürüstlükle yanında olmak. Sayımız artsa da yaklaşımımız aynı kalacak.",
      },
    ],
  },
  pricing: {
    title: "Fiyatlandırma",
    intro:
      "Sabit bir fiyat listesi yayınlamıyoruz, çünkü ihtiyacın durumuna göre değişiyor. Bunun yerine önce durumunu anlıyor, sonra sana uygun kapsamı ve ücreti birlikte netleştiriyoruz.",
    intake: {
      eyebrow: "İlk Adım",
      title: "İlk görüşme",
      description:
        "Her şey kısa bir tanışma görüşmesiyle başlıyor. Bu görüşmede seni ve hedefini dinliyor, aşağıdaki üç kapsamdan hangisinin sana uygun olabileceğini birlikte konuşuyoruz. Hiçbir şeye karar vermiş olman gerekmiyor.",
      cta: "İlk Görüşmeyi Planla",
    },
    tiersTitle: "Sana uygun kapsam",
    tiersSubtitle:
      "Üç farklı kapsam sunuyoruz; hangisinin sana uygun olduğuna birlikte karar veriyoruz. Kesin ücret, konuştuğumuz kapsama göre netleşiyor.",
    tiers: [
      {
        id: "yol-haritasi",
        name: "Yol Haritası",
        tagline: "Tek seferlik, net bir yön",
        description:
          "Nereden başlayacağını ya da başvurunu nasıl düzenleyeceğini netleştirmek istiyorsan bu kapsam sana yeterli olabilir.",
        priceLabel: "Görüşmede birlikte netleştiriyoruz",
        includes: ["egitim-yonlendirme", "basvuru-sureci"],
        idealFor: "Henüz araştırma ya da başvuru hazırlığı aşamasında olanlar için.",
        cta: "Detayları Konuşalım",
      },
      {
        id: "birebir-mentorluk",
        name: "Birebir Mentörlük",
        tagline: "Süreç boyunca düzenli destek",
        description:
          "Tek bir görüşme yetmiyorsa bir mentörle düzenli iletişimde kalarak süreç ilerledikçe çıkan sorulara zamanında cevap buluyorsun.",
        priceLabel: "Sürece göre birlikte belirliyoruz",
        includes: ["egitim-yonlendirme", "basvuru-sureci", "mentorluk"],
        idealFor: "Yalnızca bir kez değil, süreç boyunca yanında birini isteyenler için.",
        cta: "Detayları Konuşalım",
      },
      {
        id: "kapsamli-destek",
        name: "Kapsamlı Destek",
        tagline: "Başvurudan Almanya'daki ilk haftalara",
        description:
          "Başvurudan vizeye, vizeden Almanya'daki ilk haftalara kadar sürecin tamamında yanında olmamızı istiyorsan bu kapsamı konuşabiliriz.",
        priceLabel: "İhtiyacına göre birlikte planlıyoruz",
        includes: ["egitim-yonlendirme", "basvuru-sureci", "mentorluk", "vize-hazirlik", "almanyaya-hazirlik"],
        idealFor: "Sürecin başından Almanya'ya yerleşene kadar kapsamlı destek isteyenler için.",
        cta: "Detayları Konuşalım",
      },
    ],
    comparisonTitle: "Kapsamları karşılaştır",
    comparisonNote: "Hangi kapsamın hangi hizmetleri içerdiğini aşağıda görebilirsin. Ayrıntılar için ilgili hizmete göz atabilirsin.",
    honestyNote:
      "Burada net bir rakam görmemenin nedeni gizlilik değil, dürüstlük: ihtiyacın netleşmeden bir rakam vermek gerçekçi olmazdı. Görüşmede konuştuğumuz kapsamın dışında sürpriz bir ücretle karşılaşmazsın.",
    included: "Bu kapsamda",
    tableService: "Hizmet",
    tableFee: "Ücret",
    includedAria: "Dahil",
    cta: {
      title: "Hangi kapsamın sana uygun olduğunu birlikte konuşalım.",
      description: "Karar vermiş olman gerekmiyor. Durumunu anlat, sana uygun kapsamı birlikte bulalım.",
      label: "Yolculuğunu Konuşalım",
    },
  },
  faq: {
    title: "Sıkça sorulan sorular",
    intro: "Aklındaki soruların bir kısmının cevabı burada olabilir. Bulamazsan doğrudan bize sorabilirsin.",
    items: [
      {
        question: "Nereden başlamam gerektiğini bilmiyorum, yine de iletişime geçebilir miyim?",
        answer:
          "Evet. Nereden başlayacağını bilmemen bizimle konuşmana engel değil.",
        category: "Genel",
      },
      {
        question: "Almanya'da üniversite ücretsiz mi?",
        answer:
          "Çoğu devlet üniversitesinde öğrenim ücreti alınmıyor; ancak genellikle dönemlik bir katkı payı (Semesterbeitrag) ödeniyor. Tutar üniversiteye ve eyalete göre değişiyor; durumuna göre birlikte netleştirebiliriz.",
        category: "Maliyet",
      },
      {
        question: "Hangi Almanca seviyesi gerekiyor?",
        answer:
          "Almanca eğitim veren programlarda genellikle B2–C1 seviyesi isteniyor; İngilizce eğitim veren programlarda dil şartı farklı olabiliyor. Seviyeni paylaşırsan hangi yolların açık olduğunu birlikte değerlendirebiliriz.",
        category: "Almanya'da Eğitim",
      },
      {
        question: "Hangi bölümleri okuyabilirim?",
        answer:
          "Akademik geçmişine ve ilgi alanına bağlı olarak birçok bölüm mümkün olabilir. Kesin bir liste vermek yerine durumunu birlikte değerlendirip gerçekçi seçenekleri konuşmayı tercih ediyoruz.",
        category: "Almanya'da Eğitim",
      },
      {
        question: "YKS gerekiyor mu?",
        answer:
          "Bu, hangi programa ve hangi yolla başvuracağına göre değişiyor. Bazı yollarda gerekmiyor, bazılarında akademik geçmişin farklı biçimde değerlendiriliyor. Durumunu konuşarak netleştirelim.",
        category: "Başvuru ve Vize Süreci",
      },
      {
        question: "Başvuru ne kadar sürer?",
        answer:
          "Üniversiteye ve programa göre değişiyor; bazı süreçler birkaç hafta, bazıları birkaç ay sürebiliyor. Hedef program netleştikçe sana özel bir zaman çizelgesi çıkarabiliriz.",
        category: "Başvuru ve Vize Süreci",
      },
      {
        question: "Vize konusunda yardımcı oluyor musunuz?",
        answer:
          "Evet. Belge hazırlığı, randevu takibi ve süreç boyunca ortaya çıkan sorular konusunda yanındayız; vize kararının kendisi ilgili konsolosluğun yetkisinde olduğu için bunu garanti edemeyiz.",
        category: "Başvuru ve Vize Süreci",
      },
      {
        question: "Almanya'ya gittikten sonra destek devam ediyor mu?",
        answer:
          "Evet. Kayıt işlemlerinde, ilk haftalarda ve eğitim sürecinde ihtiyaç duyduğun konularda iletişimde kalabiliyoruz.",
        category: "Mentörlük ve Destek",
      },
    ],
  },
  contact: {
    title: "İletişim",
    intro: "Sana en uygun kanaldan bize ulaşabilirsin; hepsi aynı yere çıkıyor: bir insanla konuşmak.",
    whatsapp: {
      title: "WhatsApp",
      description: "Hızlı bir sorun mu var? Doğrudan bize yazabilirsin.",
      cta: "WhatsApp'tan Bize Yaz",
    },
    email: {
      title: "E-posta",
      description: "Ayrıntılı yazmayı tercih ediyorsan.",
      cta: "E-posta Gönder",
    },
    formCta: {
      title: "Durumunu anlatarak başla",
      description: "Birkaç kısa soruyla seni tanıyalım, sana uygun bir görüşme hazırlayalım.",
      cta: "Yolculuğunu Konuşalım",
    },
    photoCaption: "Bir görüşme başlıyor",
    photoAlt: "Frankfurt, Almanya",
    composer: {
      title: "Bize yaz",
      description: "Sorunu, sorununu veya talebini doğrudan bize ilet. Mesajın ilgili ekibe ulaştırılır.",
      emailLabel: "E-posta adresi",
      emailPlaceholder: "ornek@mail.com",
      categoryLabel: "Konu kategorisi",
      categories: {
        general: "Genel soru",
        consulting: "Başvuru / Danışmanlık",
        billing: "Ödeme / Faturalandırma",
        complaint: "Şikayet",
        technical: "Teknik / Sistem Sorunu",
        website: "Web Sitesi Hatası",
        other: "Diğer",
      },
      subjectLabel: "Konu",
      subjectPlaceholder: "Mesajınızın konusu",
      messageLabel: "Mesaj",
      messagePlaceholders: {
        general: "Size nasıl yardımcı olabiliriz?",
        consulting: "Size nasıl yardımcı olabiliriz?",
        billing: "Size nasıl yardımcı olabiliriz?",
        complaint: "Yaşadığınız durumu, ilgili hizmeti ve mümkünse tarih/saat bilgisini açıklayın.",
        technical: "Karşılaştığınız hatayı, hangi sayfada olduğunu ve mümkünse aldığınız hata mesajını açıklayın.",
        website: "Hatanın hangi sayfada oluştuğunu ve ne yaptığınızda ortaya çıktığını açıklayın.",
        other: "Size nasıl yardımcı olabiliriz?",
      },
      honeypotLabel: "Şirket",
      submit: "Mesajı Gönder",
      submitting: "Gönderiliyor...",
      successTitle: "Mesajınız iletildi.",
      successBody: "Mesajınızı aldık. Gerekli durumda verdiğiniz e-posta adresinden sizinle iletişime geçeceğiz.",
      errorTitle: "Mesaj gönderilemedi.",
      errorBody: "Tekrar deneyin veya farklı bir iletişim kanalı kullanın.",
      retry: "Tekrar dene",
    },
  },
  bizeKatilin: {
    eyebrow: "Bize Katılın",
    applyEyebrow: "Başvuru",
    title: "Bir zamanlar sen de nereden başlayacağını bilmiyordun.",
    intro: "Almanya'da eğitim deneyimin varsa ve bu yolda birine yol arkadaşı olmak istiyorsan, seni dinlemekten memnuniyet duyarız.",
    imageCaption: "Deneyimini paylaş",
    sections: [
      {
        heading: "Neden mentör olabilirsin?",
        body: "Almanya'da okudun ya da hâlâ okuyorsun. Başvurunun, vizenin ve yeni bir şehirde hayata tutunmanın nasıl bir his olduğunu biliyorsun. Bu deneyim, arkandan gelen biri için çok şey değiştirir.",
      },
      {
        heading: "Kimleri arıyoruz?",
        body: "Belirli bir unvan aramıyoruz. Aradığımız şey, süreci gerçekten yaşamış olmak ve bir öğrencinin sorularına zaman ayırmaya istekli olmak.",
      },
      {
        heading: "Mentör olarak ne yaparsın?",
        body: "Öğrencinin durumunu dinler, sorularını cevaplarsın; bazen tek bir görüşme, bazen süreç boyunca düzenli bir iletişim olur. Ne kadar zaman ayırabileceğini birlikte konuşuruz.",
      },
      {
        heading: "Nasıl çalışıyoruz?",
        body: "Başvurundan sonra kısa bir tanışma görüşmesi yapıyoruz. Uygun görürsek seni, sana uygun bir öğrenciyle ya da süreçle eşleştiriyoruz.",
      },
    ],
    formTitle: "Başvuru formu",
    formDescription: "Birkaç bilgiyle başlayalım, geri kalanını görüşmede konuşuruz.",
    fields: {
      firstName: "Ad",
      lastName: "Soyad",
      phone: "Telefon / WhatsApp",
      email: "E-posta",
      germanyExperience: "Almanya'daki deneyimin nedir?",
      germanyExperiencePlaceholder: "Hangi şehir, hangi üniversite veya program, ne zaman?",
      motivation: "Neden mentör olmak istiyorsun?",
      motivationPlaceholder: "Birkaç cümleyle anlatman yeterli.",
      message: "Eklemek istediğin bir şey var mı?",
      messagePlaceholder: "İstersen buraya yazabilirsin (isteğe bağlı).",
    },
    submit: { label: "Başvurunu Gönder", loading: "Gönderiliyor..." },
    success: {
      title: "Teşekkürler.",
      description: "Başvurunu aldık. İnceledikten sonra seninle iletişime geçeceğiz.",
      backHome: "Ana Sayfaya Dön",
    },
    error: { description: "Formu gönderirken bir sorun oluştu. Lütfen biraz sonra tekrar dene." },
  },
  assessment: {
    contactValidation: "Lütfen ad, soyad, telefon, e-posta ve tercih ettiğin iletişim yöntemini eksiksiz doldur.",
    metaTitle: "Seni Biraz Tanıyalım",
    metaDescription: "Birkaç kısa soruyla durumunu anlayalım, sana uygun bir görüşme hazırlayalım.",
    intro: {
      eyebrow: "Kişisel Yol Haritası",
      title: "Seni biraz tanıyalım.",
      description:
        "Sana daha doğru yardımcı olabilmemiz için birkaç kısa soru soracağız. Formu doldurman birkaç dakikadan az sürer.",
      startCta: "Başlayalım",
    },
    steps: [
      {
        id: "stage",
        question: "Şu anda hangi aşamadasın?",
        type: "single",
        options: [
          { value: "researching", label: "Henüz araştırıyorum" },
          { value: "choosing", label: "Bölüm / üniversite araştırıyorum" },
          { value: "preparing", label: "Başvuruya hazırlanıyorum" },
          { value: "applied", label: "Başvurdum" },
          { value: "visa", label: "Vize sürecindeyim" },
          { value: "pre-departure", label: "Almanya'ya hazırlanıyorum" },
          { value: "in-germany", label: "Almanya'dayım" },
          { value: "unsure", label: "Emin değilim" },
        ],
      },
      {
        id: "educationStatus",
        question: "Eğitim durumun nedir?",
        type: "single",
        options: [
          { value: "high-school-student", label: "Lise öğrencisiyim" },
          { value: "high-school-graduate", label: "Lise mezunuyum" },
          { value: "university-student", label: "Üniversite öğrencisiyim" },
          { value: "university-graduate", label: "Üniversite mezunuyum" },
          { value: "considering-masters", label: "Yüksek lisans yapmayı düşünüyorum" },
          { value: "other", label: "Diğer" },
        ],
      },
      {
        id: "interestArea",
        question: "Hangi alana ilgi duyuyorsun?",
        type: "single",
        helper: "Henüz net değilse “Henüz bilmiyorum” seçeneğini seçebilirsin.",
        options: [
          { value: "engineering", label: "Mühendislik" },
          { value: "computer-it", label: "Bilgisayar / Bilişim (IT)" },
          { value: "business-economics", label: "İşletme / Ekonomi" },
          { value: "health", label: "Sağlık" },
          { value: "social-sciences", label: "Sosyal bilimler" },
          { value: "design-arts", label: "Tasarım / Sanat" },
          { value: "unknown", label: "Henüz bilmiyorum" },
          { value: "other", label: "Diğer" },
        ],
      },
      {
        id: "germanLevel",
        question: "Almanca seviyen nedir?",
        type: "single",
        options: [
          { value: "undisclosed", label: "Belirtmek istemiyorum" },
          { value: "none", label: "Henüz başlamadım" },
          { value: "a1", label: "A1" },
          { value: "a2", label: "A2" },
          { value: "b1", label: "B1" },
          { value: "b2", label: "B2" },
          { value: "c1", label: "C1" },
          { value: "c2", label: "C2" },
          { value: "native", label: "Ana dil / akıcı" },
        ],
      },
      {
        id: "englishLevel",
        question: "İngilizce seviyen nedir?",
        type: "single",
        options: [
          { value: "undisclosed", label: "Belirtmek istemiyorum" },
          { value: "none", label: "Henüz başlamadım" },
          { value: "a1", label: "A1" },
          { value: "a2", label: "A2" },
          { value: "b1", label: "B1" },
          { value: "b2", label: "B2" },
          { value: "c1", label: "C1" },
          { value: "c2", label: "C2" },
          { value: "native", label: "Ana dil / akıcı" },
        ],
      },
      {
        id: "target",
        question: "Almanya'da ne yapmak istiyorsun?",
        type: "single",
        options: [
          { value: "bachelor", label: "Lisans" },
          { value: "masters", label: "Yüksek lisans" },
          { value: "language-course", label: "Dil eğitimi" },
          { value: "studienkolleg", label: "Studienkolleg" },
          { value: "vocational", label: "Mesleki eğitim" },
          { value: "undecided", label: "Henüz karar vermedim" },
          { value: "other", label: "Diğer" },
        ],
      },
      {
        id: "timeline",
        question: "Ne zaman başlamayı düşünüyorsun?",
        type: "single",
        options: [
          { value: "next-term", label: "En yakın dönem" },
          { value: "6-months", label: "6 ay içinde" },
          { value: "1-year", label: "1 yıl içinde" },
          { value: "1-year-plus", label: "1 yıldan sonra" },
          { value: "unsure", label: "Henüz bilmiyorum" },
        ],
      },
      {
        id: "background",
        question: "Kendinden, eğitiminden veya deneyimlerinden biraz bahset.",
        helper:
          "Akademik geçmişin, öne çıkan deneyimlerin ya da danışmanlıktan ne beklediğin hakkında birkaç cümle yazman, danışmanının seni görüşmeden önce tanımasına yardımcı olur.",
        type: "text",
        placeholder: "Birkaç cümle yeterli.",
      },
      {
        id: "message",
        question: "Bize iletmek istediğin başka bir soru veya konu var mı?",
        type: "text",
        placeholder: "İstersen buraya yazabilirsin (isteğe bağlı).",
        optional: true,
      },
      {
        id: "referralSource",
        question: "Bizi nereden duydun?",
        type: "single",
        options: [
          { value: "instagram", label: "Instagram" },
          { value: "linkedin", label: "LinkedIn" },
          { value: "google_search", label: "Google / İnternet araması" },
          { value: "university_campus", label: "Üniversite / Kampüs" },
          { value: "friend_referral", label: "Bir arkadaşım / Tanıdığım" },
          { value: "event_booth", label: "Etkinlik / Stand" },
          { value: "whatsapp", label: "WhatsApp" },
          { value: "youtube", label: "YouTube" },
          { value: "other", label: "Diğer" },
        ],
      },
    ],
    referralOtherLabel: "Diğer (kısaca belirt)",
    contactStep: {
      title: "Sana nasıl ulaşalım?",
      description: "Son adım. Bu bilgilerle görüşmemize hazırlıklı geleceğiz.",
      fields: {
        firstName: "Ad",
        lastName: "Soyad",
        phone: "Telefon / WhatsApp",
        email: "E-posta",
        preferredContact: "Tercih ettiğin iletişim yöntemi",
        preferredContactOptions: [
          { value: "whatsapp", label: "WhatsApp" },
          { value: "phone", label: "Telefon" },
        ],
      },
    },
    submit: { label: "Gönder", loading: "Gönderiliyor..." },
    success: {
      title: "Teşekkürler.",
      description:
        "Bilgilerini aldık. Ekibimiz paylaştıklarını inceleyip en kısa sürede seninle iletişime geçecek.",
      whatsappCta: "İstersen şimdi WhatsApp'tan da bize yazabilirsin.",
      backHome: "Ana Sayfaya Dön",
    },
    error: {
      title: "Bir şeyler ters gitti.",
      description: "Formu gönderirken bir sorun oluştu. Bir kez daha deneyebilirsin; olmazsa bize doğrudan WhatsApp'tan yazabilirsin.",
      retry: "Tekrar Dene",
    },
  },
  footer: {
    description:
      "Almanya'da eğitim hayatını ilerletmek isteyen herkes için: nereden başlarsan başla, bir sonraki adımı birlikte buluyoruz.",
    navTitle: "Sayfalar",
    legalTitle: "Yasal Bilgiler",
    legalLinks: [
      { label: "Gizlilik Politikası", route: "privacy" },
      { label: "KVKK Aydınlatma Metni", route: "kvkk" },
      { label: "Kullanım Şartları", route: "terms" },
    ],
    rights: `© ${new Date().getFullYear()} ${siteConfig.name}. Tüm hakları saklıdır.`,
  },
};
