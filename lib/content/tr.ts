import type { Dictionary } from "./types";
import { siteConfig } from "@/lib/site-config";

export const tr: Dictionary = {
  meta: {
    siteName: siteConfig.name,
    defaultTitle: `${siteConfig.name} — Almanya eğitim yolculuğunda yol arkadaşın`,
    titleTemplate: `%s — ${siteConfig.name}`,
    defaultDescription:
      "Almanya'da eğitim hayatını ilerletmek isteyen herkes için: nereden başlayacağını bilsen de bilmesen de, mevcut durumunu birlikte değerlendirip sana uygun bir sonraki adımı konuşuyoruz.",
  },
  nav: {
    home: "Ana Sayfa",
    services: "Nasıl Yardımcı Oluyoruz?",
    mentorship: "Mentorluk",
    studentStories: "Öğrenci Hikâyeleri",
    about: "Hakkımızda",
    pricing: "Fiyatlar",
    joinUs: "Bize Katılın",
    faq: "Sık Sorulanlar",
    contact: "İletişim",
    more: "Daha Fazla",
    ctaPrimary: "Yolculuğunu Konuşalım",
  },
  home: {
    hero: {
      eyebrow: "Almanya'da Eğitim",
      title: "Almanya'da eğitim yolculuğunda yalnız değilsin.",
      subtitle:
        "Nereden başlayacağını biliyor olabilirsin, henüz hiçbir şey bilmiyor da olabilirsin. Mevcut durumunu birlikte değerlendiriyor, sana uygun yolu beraber planlıyoruz.",
      ctaPrimary: "Yolculuğunu Konuşalım",
      ctaSecondary: "Nasıl Yardımcı Olduğumuzu Anlat",
    },
    journey: {
      eyebrow: "Yolculuk",
      title: "Nerede olursan ol, Almanya'ya giden yolu birlikte çizelim.",
      description:
        "Türkiye'nin neresinde olursan ol, Berlin, München, Hamburg ya da Frankfurt — hedefin hangisi olursa olsun bulunduğun yerden başlayabiliriz. Bu rota tek bir uçuş değil, birçok küçük kararın toplamı.",
    },
    stageSelector: {
      title: "Şu anda nerede olursan ol.",
      subtitle: "Aşağıdakilerden sana en yakın olanı seç, sana uygun cevabı hemen görelim.",
      stages: [
        {
          id: "researching",
          label: "Henüz araştırıyorum",
          description:
            "Hiçbir şeyin netleşmemiş olması sorun değil. Almanya'da eğitimin nasıl işlediğini, hangi yolların mümkün olduğunu konuşarak başlayabiliriz.",
          cta: "Araştırmama Yardımcı Olun",
        },
        {
          id: "choosing",
          label: "Bölüm / üniversite araştırıyorum",
          description:
            "Seçenekleri tek başına elemeye çalışmak yorucu olabilir. İlgi alanını ve hedefini konuşup birlikte daraltabiliriz.",
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
            "Başvuru gönderdikten sonra bekleme süreci belirsiz gelebilir. Şu an ne yapman gerektiğini birlikte netleştirelim.",
          cta: "Sonraki Adımı Bulalım",
        },
        {
          id: "visa",
          label: "Vize sürecindeyim",
          description:
            "Vize belgeleri ve randevu süreci detaylı takip ister. Neyin eksik olduğunu birlikte kontrol edelim.",
          cta: "Vize Sürecimi Konuşalım",
        },
        {
          id: "pre-departure",
          label: "Almanya'ya hazırlanıyorum",
          description:
            "Eğitim kadar günlük hayatı organize etmek de önemli. Konaklamadan ilk haftalara kadar birlikte planlayalım.",
          cta: "Gidiş Hazırlığımı Konuşalım",
        },
        {
          id: "in-germany",
          label: "Almanya'dayım",
          description:
            "Buradaki hayatını organize ederken veya eğitimini ilerletirken destek almak istersen buradayız.",
          cta: "Devam Eden Sürecimi Konuşalım",
        },
      ],
      fallback: {
        id: "unsure",
        label: "Emin değilim",
        description:
          "Hiçbir sorun değil. Nereden başlayacağını bilmiyor olman bizimle konuşman için bir engel değil, durumunu birlikte netleştirelim.",
        cta: "Birlikte Netleştirelim",
      },
    },
    services: {
      title: "Nasıl yardımcı oluyoruz?",
      subtitle: "Beş alanda, sürecinin neresinde olursan ol yanındayız.",
      cta: "Tüm Hizmetleri Gör",
    },
    howWeWork: {
      title: "Nasıl çalışıyoruz?",
      subtitle: "Süreç karmaşık değil, dört adımda birlikte ilerliyoruz.",
      steps: [
        {
          title: "Seni tanıyoruz",
          description: "Kısa birkaç soruyla mevcut durumunu ve hedefini anlıyoruz.",
        },
        {
          title: "Görüşüyoruz",
          description: "Bir mentorla, durumuna özel bir görüşmede seçeneklerini konuşuyoruz.",
        },
        {
          title: "Yolu birlikte netleştiriyoruz",
          description: "Sana uygun olabilecek adımları ve zaman çizelgesini birlikte planlıyoruz.",
        },
        {
          title: "Süreç boyunca yanındayız",
          description: "Başvurudan vizeye, gerektiğinde Almanya'daki ilk günlere kadar iletişim sürüyor.",
        },
      ],
    },
    mentorship: {
      title: "Yalnız ilerlemek zorunda değilsin.",
      description:
        "Mentorlarımız bu süreci sadece anlatmıyor, akademik, bürokratik ve günlük hayatla ilgili tarafını da biliyor. Görevleri başvuru yapmak değil, doğru kararı vermeni kolaylaştırmak.",
      cta: "Mentorluğu Keşfet",
    },
    visualStory: {
      eyebrow: "Günlük Hayat",
      title: "Almanya'da hayat, başvurudan ibaret değil.",
      description:
        "Bir üniversiteye kabul edilmek yolculuğun önemli bir parçası; asıl hikâye kampüse adım attığında, yeni bir şehirde kendi düzenini kurduğunda başlıyor.",
      captions: ["Humboldt Üniversitesi", "München", "Bibliotheca Albertina"],
    },
    humanConnection: {
      eyebrow: "Birlikte Başlayalım",
      metadata: "İlk Adım",
      title: "Önce nerede olduğunu anlayalım.",
      description:
        "Sana bir şey satmaya çalışmıyoruz; önce durumunu dinliyor, sana uygun olmayan bir yolu 'uygun' gibi göstermeden dürüstçe yol gösteriyoruz.",
      cta: "Yolculuğunu Konuşalım",
      imageSrc: "/images/cities/frankfurt.jpg",
      imageAlt: "Frankfurt, Almanya",
    },
    faqPreview: {
      title: "Sık sorulanlar",
      cta: "Tüm Soruları Gör",
    },
    finalCta: {
      title: "Hazırsan konuşalım.",
      description:
        "Bulunduğun yerden başlayalım. Durumunu birlikte anlayalım, sonrasında sana uygun yolu birlikte çizelim.",
      ctaPrimary: "Yolculuğunu Konuşalım",
      ctaSecondary: "WhatsApp'tan Yaz",
    },
  },
  services: {
    title: "Nasıl yardımcı oluyoruz?",
    intro:
      "Her hizmet, sürecin farklı bir aşamasına karşılık geliyor. Hangisine şu an ihtiyacın olduğundan emin değilsen, birlikte konuşarak da netleştirebiliriz.",
    items: [
      {
        slug: "egitim-yonlendirme",
        title: "Eğitim & Bölüm Yönlendirmesi",
        shortDescription: "Hedeflerine ve mevcut durumuna göre seçeneklerini birlikte değerlendiriyoruz.",
        problem:
          "Hangi bölümün, hangi şehrin veya hangi eğitim seviyesinin sana uygun olduğuna karar vermek tek başına zor olabilir.",
        help:
          "İlgi alanını, akademik geçmişini ve hedeflerini konuşarak gerçekçi seçenekleri birlikte belirliyoruz.",
        process: [
          "Kısa bir tanışma görüşmesi",
          "İlgi alanı ve akademik durum değerlendirmesi",
          "Olası bölüm / üniversite yönlerinin konuşulması",
          "Sonraki adımın netleştirilmesi",
        ],
        scope: "Bölüm ve şehir/üniversite yönü hakkında yönlendirme; kesin kabul garantisi değil.",
        forWhom: "Henüz araştırma aşamasında olan ya da seçenekleri daraltmak isteyen herkes için.",
        nextStep: "Durumunu anlatarak bir görüşme planlayabiliriz.",
      },
      {
        slug: "basvuru-sureci",
        title: "Üniversite Başvuru Süreci",
        shortDescription: "Başvuru sürecinde hangi adımda ne yapacağını birlikte takip ediyoruz.",
        problem:
          "Başvuru gereksinimleri üniversiteden üniversiteye değişiyor; hangi belgenin ne zaman gerektiğini takip etmek kolay değil.",
        help:
          "Başvuracağın programların gereksinimlerini netleştirip, belge hazırlığını ve zaman çizelgesini birlikte organize ediyoruz.",
        process: [
          "Hedef program(lar)ın gereksinimlerinin çıkarılması",
          "Belge listesinin netleştirilmesi",
          "Hazırlık takviminin oluşturulması",
          "Başvuru öncesi son kontrol",
        ],
        scope: "Süreç organizasyonu ve rehberlik; başvurunun üniversite tarafından değerlendirilmesi bizim kontrolümüzde değil.",
        forWhom: "Hedefi netleşmiş, başvuruya hazırlanan ya da başvuru sürecinde olan öğrenciler için.",
        nextStep: "Hangi program(lar)ı düşündüğünü paylaşarak başlayabiliriz.",
      },
      {
        slug: "vize-hazirlik",
        title: "Vizeye Hazırlık",
        shortDescription: "Belgeler ve süreç konusunda hazırlığını sistemli şekilde yapmana yardımcı oluyoruz.",
        problem:
          "Vize süreci belge yoğunluğu ve randevu takibi gerektiriyor; küçük bir eksik süreci geciktirebiliyor.",
        help:
          "Gerekli belgeleri, finansal kanıt gereksinimlerini ve randevu sürecini adım adım birlikte takip ediyoruz.",
        process: [
          "Vize türüne göre belge listesinin çıkarılması",
          "Finansal kanıt / blocked account sürecinin konuşulması",
          "Randevu ve başvuru takibi",
          "Son kontrol",
        ],
        scope: "Hazırlık ve organizasyon desteği; vize kararı ilgili konsolosluğun yetkisindedir, garanti edilemez.",
        forWhom: "Kabul almış ve vize sürecine girecek ya da girmiş öğrenciler için.",
        nextStep: "Hangi aşamada olduğunu belirterek süreci birlikte netleştirelim.",
      },
      {
        slug: "almanyaya-hazirlik",
        title: "Almanya'ya Hazırlık",
        shortDescription: "Eğitim kadar önemli olan yeni hayatına hazırlanırken yanında oluyoruz.",
        problem:
          "Konaklama, kayıt işlemleri, banka hesabı, sigorta gibi pratik konular gitmeden önce netleşmediğinde ilk haftalar zorlaşabiliyor.",
        help:
          "Gitmeden önce ve ilk haftalarda karşılaşacağın pratik konuları birlikte planlıyoruz.",
        process: [
          "Konaklama araştırması yönlendirmesi",
          "Kayıt (Anmeldung) ve banka hesabı süreci hakkında bilgilendirme",
          "Sağlık sigortası konusunda yönlendirme",
          "İlk hafta kontrol listesi",
        ],
        scope: "Bilgilendirme ve organizasyon desteği; konaklama/sözleşme gibi işlemler öğrenci tarafından yürütülür.",
        forWhom: "Vize süreci ilerleyen ya da gitmeye hazırlanan öğrenciler için.",
        nextStep: "Gidiş tarihini paylaşarak hazırlığı birlikte planlayalım.",
      },
      {
        slug: "mentorluk",
        title: "Mentorluk",
        shortDescription: "Sadece başvuruya kadar değil, yolculuğun boyunca deneyim ve yönlendirme desteği sunuyoruz.",
        problem:
          "Süreç uzun ve bazen belirsiz; tek seferlik bir danışmanlık görüşmesi her sorunun cevabını vermeyebilir.",
        help:
          "Bir mentorla düzenli iletişimde kalarak, süreç ilerledikçe ortaya çıkan sorulara zamanında cevap buluyorsun.",
        process: [
          "Mentor eşleştirmesi",
          "Düzenli iletişim ve ilerleme takibi",
          "Sorular oldukça yönlendirme",
          "Hedefe göre sürecin güncellenmesi",
        ],
        scope: "Yönlendirme ve deneyim paylaşımı; hukuki/resmi kararlar öğrencinin ve ilgili kurumların sorumluluğundadır.",
        forWhom: "Sürecin herhangi bir aşamasında, düzenli destek isteyen herkes için.",
        nextStep: "Mentorluğun sana nasıl uyabileceğini konuşalım.",
      },
    ],
  },
  mentorship: {
    title: "Mentor burada sadece başvuru yapan kişi değil.",
    intro:
      "Bu sürecin akademik, bürokratik ve günlük yaşamla ilgili tarafını bilen insanlarla çalışıyorsun. Mentorun görevi seni yönlendirmek, doğru kararları vermeni kolaylaştırmak ve süreç boyunca yanında olmak.",
    sections: [
      {
        heading: "Mentor neden var?",
        body: "Almanya'da eğitim süreci tek bir karardan ibaret değil. Bölüm seçiminden başvuruya, vizeden ilk haftalara kadar birçok küçük karar art arda geliyor; bir mentor bu kararları tek başına vermek zorunda kalmamanı sağlıyor.",
      },
      {
        heading: "Ne zaman bir mentora ihtiyaç duyarsın?",
        body: "Genelde 'şu an ne yapmam gerekiyor?' sorusuna net bir cevap bulamadığın her an. Bu, sürecin en başında da olabilir, başvuru ortasında da, vize aşamasında da.",
      },
      {
        heading: "Mentor ne yapıyor?",
        body: "Durumunu dinler, seçeneklerini birlikte değerlendirir, süreç boyunca hangi adımın ne zaman geldiğini takip eder ve sorularına zamanında cevap verir. Kararı sen verirsin, mentor bu kararı daha bilinçli vermeni sağlar.",
      },
      {
        heading: "Süreç nasıl ilerliyor?",
        body: "Bir tanışma görüşmesiyle başlar. Oradan sonra ihtiyacına göre düzenli aralıklarla iletişimde kalırsınız; bu bazen haftalık bir kontrol, bazen sadece kritik bir aşamada tek bir görüşme olabilir.",
      },
    ],
    processTitle: "Mentorlukla ilerleyiş",
    process: [
      { title: "Tanışma görüşmesi", description: "Durumunu ve hedefini birlikte konuşuyoruz." },
      { title: "Yol haritası", description: "Sana uygun olabilecek adımları ve zamanlamayı netleştiriyoruz." },
      { title: "Düzenli takip", description: "Süreç ilerledikçe ortaya çıkan soruları birlikte çözüyoruz." },
      { title: "Kritik aşamalarda destek", description: "Başvuru, vize ve gidiş gibi kritik anlarda yanındayız." },
    ],
    cta: {
      title: "Mentorluğun sana nasıl uyabileceğini konuşalım.",
      description: "Kısa bir görüşmeyle başlayabiliriz, henüz hiçbir şey netleşmemiş olsa bile.",
      label: "Yolculuğunu Konuşalım",
    },
  },
  about: {
    title: "Hakkımızda",
    intro:
      "Bu sürecin nasıl hissettirdiğini bilen insanlar tarafından oluşturulan bir sistemiz.",
    sections: [
      {
        heading: "Neden varız?",
        body: "Almanya'da eğitim süreci doğru bilgiyle ilerlediğinde ulaşılabilir bir hedef. Ama dağınık bilgi, belirsiz adımlar ve yalnız ilerleme hissi bu süreci gereğinden zor gösteriyor. Biz bu boşluğu doldurmak için buradayız.",
      },
      {
        heading: "Nasıl yaklaşıyoruz?",
        body: "Yargılamadan. Geç başlamış, notları düşük, dili henüz yeterli değil ya da hedefi belirsiz olabilirsin; bunların hiçbiri konuşmaya başlamak için bir engel değil. Mevcut durumundan ilerleyebileceğin seçenekleri birlikte değerlendiriyoruz.",
      },
      {
        heading: "Öğrenci için ne değişiyor?",
        body: "Çoğu kaynak ya çok genel ya da çok teknik; nerede olduğunu bilmeden bir bilgi yığınıyla karşılaşıyorsun. Biz önce durumunu anlamayı, sonra doğru bilgiyi doğru zamanda vermeyi önceliklendiriyoruz — tek başına elemen gereken bir yığın yerine, senin durumuna konuşulmuş bir yol.",
      },
      {
        heading: "Almanya'da yolculuk nasıl ilerliyor?",
        body: "Önce dinliyoruz, sonra yönlendiriyoruz. Süreç boyunca hangi adımın ne zaman geldiğini takip ediyor, sorularına zamanında cevap veriyoruz. Söz verirken gerçekçi kalıyoruz; uygun olmayan bir yolu 'uygun' gibi göstermiyoruz.",
      },
      {
        heading: "Bundan sonra?",
        body: "Bu platform büyüdükçe gerçek öğrenci hikâyeleri ve gerçek mentor profilleriyle zenginleşecek. Şu an önceliğimiz aynı kalıyor: her görüşmede aynı dikkat ve dürüstlükle yanında olmak — sayı büyüse de yaklaşımımız değişmeyecek.",
      },
    ],
  },
  pricing: {
    title: "Fiyatlandırma",
    intro:
      "Sabit bir fiyat listesi yayınlamıyoruz, çünkü ihtiyacın senin durumuna göre değişiyor. Bunun yerine önce durumunu anlıyor, sonra sana uygun kapsamı ve ücreti birlikte netleştiriyoruz.",
    intake: {
      eyebrow: "İlk Adım",
      title: "İlk görüşme",
      description:
        "Her şey kısa bir tanışma görüşmesiyle başlıyor. Bu görüşmede seni ve hedefini dinliyor, aşağıdaki üç kapsamdan hangisinin sana uygun olabileceğini birlikte konuşuyoruz. Hiçbir şeye karar vermiş olman gerekmiyor.",
      cta: "İlk Görüşmeyi Başlat",
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
          "Nereden başlayacağını ya da başvurunu nasıl organize edeceğini netleştirmek istiyorsan, bu kapsam sana yeterli olabilir.",
        priceLabel: "Görüşmede birlikte netleştiriyoruz",
        includes: ["egitim-yonlendirme", "basvuru-sureci"],
        idealFor: "Henüz araştırma ya da başvuru hazırlığı aşamasında olanlar için.",
        cta: "Detayları Konuşalım",
      },
      {
        id: "birebir-mentorluk",
        name: "Birebir Mentorluk",
        tagline: "Süreç boyunca düzenli destek",
        description:
          "Tek bir görüşme yetmiyorsa, bir mentorla düzenli iletişimde kalarak süreç ilerledikçe çıkan sorulara zamanında cevap buluyorsun.",
        priceLabel: "Sürece göre birlikte belirliyoruz",
        includes: ["egitim-yonlendirme", "basvuru-sureci", "mentorluk"],
        idealFor: "Sadece bir kez değil, süreç boyunca yanında birini isteyenler için.",
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
    comparisonNote: "Her kapsamın hangi hizmetleri içerdiğini aşağıda görebilirsin. Detaylar için ilgili hizmeti incele.",
    honestyNote:
      "Burada net bir sayı görmemenin nedeni gizlilik değil, dürüstlük: ihtiyacın netleşmeden bir rakam vermek gerçekçi olmazdı. Görüşmede konuştuğumuz kapsam dışında sürpriz bir ücretle karşılaşmazsın.",
    cta: {
      title: "Hangi kapsamın sana uygun olduğunu birlikte konuşalım.",
      description: "Karar vermiş olman gerekmiyor. Durumunu anlat, uygun kapsamı birlikte bulalım.",
      label: "Yolculuğunu Konuşalım",
    },
  },
  faq: {
    title: "Sık sorulanlar",
    intro: "Aklındaki soruların bir kısmının cevabı burada olabilir. Bulamazsan, doğrudan sorabilirsin.",
    items: [
      {
        question: "Nereden başlamam gerektiğini bilmiyorum, yine de iletişime geçebilir miyim?",
        answer:
          "Evet. Nereden başlayacağını bilmiyor olman bizimle konuşman için bir engel değil.",
        category: "Genel",
      },
      {
        question: "Almanya'da üniversite ücretsiz mi?",
        answer:
          "Çoğu devlet üniversitesinde okul harcı yok, ancak dönemlik bir katkı payı (Semesterbeitrag) genelde bulunuyor. Tam tutar üniversiteye ve eyalete göre değişiyor, durumuna göre birlikte netleştirebiliriz.",
        category: "Maliyet",
      },
      {
        question: "Hangi seviyede Almanca gerekir?",
        answer:
          "Almanca öğretim yapan programlarda genelde B2–C1 seviyesi isteniyor; İngilizce öğretim yapan programlarda dil şartı farklı olabiliyor. Hangi seviyede olduğunu paylaşırsan hangi yolların açık olduğunu birlikte değerlendiririz.",
        category: "Almanya'da Eğitim",
      },
      {
        question: "Hangi bölümleri okuyabilirim?",
        answer:
          "Akademik geçmişine ve ilgi alanına bağlı olarak birçok bölüm mümkün olabilir. Kesin bir liste vermek yerine, durumunu birlikte değerlendirip gerçekçi seçenekleri konuşmayı tercih ediyoruz.",
        category: "Almanya'da Eğitim",
      },
      {
        question: "YKS gerekiyor mu?",
        answer:
          "Bu, hangi programa ve hangi yolla başvuracağına göre değişiyor. Bazı yollarda gerekmiyor, bazılarında akademik geçmişin farklı şekilde değerlendiriliyor. Durumunu konuşarak netleştirelim.",
        category: "Başvuru & Vize Süreci",
      },
      {
        question: "Başvuru ne kadar sürer?",
        answer:
          "Üniversiteye ve programa göre değişiyor; bazı süreçler birkaç hafta, bazıları birkaç ay sürebiliyor. Hedef program netleştikçe sana özel bir zaman çizelgesi çıkarabiliriz.",
        category: "Başvuru & Vize Süreci",
      },
      {
        question: "Vize konusunda yardımcı oluyor musunuz?",
        answer:
          "Evet. Belge hazırlığı, randevu takibi ve süreç boyunca ortaya çıkan sorular konusunda yanındayız; vize kararının kendisi ilgili konsolosluğun yetkisinde olduğu için bunu garanti edemeyiz.",
        category: "Başvuru & Vize Süreci",
      },
      {
        question: "Almanya'ya gittikten sonra destek devam ediyor mu?",
        answer:
          "Evet. Kayıt işlemleri, ilk haftalar ve eğitim sürecinde ihtiyaç duyduğun konularda iletişimde kalabiliyoruz.",
        category: "Mentorluk & Destek",
      },
    ],
  },
  contact: {
    title: "İletişim",
    intro: "Sana en uygun kanaldan ulaşabilirsin, hepsi aynı yere çıkıyor: bir insanla konuşmak.",
    whatsapp: {
      title: "WhatsApp",
      description: "Hızlı bir sorun mu var? Doğrudan yazabilirsin.",
      cta: "WhatsApp'tan Yaz",
    },
    email: {
      title: "E-posta",
      description: "Detaylı yazmayı tercih ediyorsan.",
      cta: "E-posta Gönder",
    },
    formCta: {
      title: "Durumunu anlatarak başla",
      description: "Birkaç kısa soruyla seni tanıyalım, sana uygun bir görüşme hazırlayalım.",
      cta: "Yolculuğunu Konuşalım",
    },
  },
  bizeKatilin: {
    eyebrow: "Bize Katılın",
    title: "Bir zamanlar sen de nereden başlayacağını bilmiyordun.",
    intro: "Almanya'da eğitim deneyimin varsa ve bu yolda birine yol arkadaşı olmak istiyorsan, seni dinlemek isteriz.",
    imageCaption: "Deneyimini paylaş",
    sections: [
      {
        heading: "Neden mentor olabilirsin?",
        body: "Almanya'da okudun ya da hâlâ okuyorsun. Başvuru, vize, yeni bir şehirde hayata tutunma gibi süreçlerin nasıl hissettirdiğini biliyorsun. Bu deneyim, senden sonra gelen birine büyük fark yaratır.",
      },
      {
        heading: "Kimleri arıyoruz?",
        body: "Belirli bir unvan aramıyoruz. Aradığımız şey: sürecin içinden gerçekten geçmiş olmak ve bir öğrencinin sorularına zaman ayırmaya istekli olmak.",
      },
      {
        heading: "Mentor olarak ne yaparsın?",
        body: "Öğrencinin durumunu dinler, sorularını cevaplarsın; bazen tek bir görüşme, bazen süreç boyunca düzenli bir iletişim olur. Ne kadar zaman ayırabileceğini birlikte konuşuruz.",
      },
      {
        heading: "Nasıl çalışıyoruz?",
        body: "Başvurundan sonra kısa bir tanışma görüşmesi yapıyoruz. Uygun görürsek, sana uygun bir öğrenciyle veya süreçle eşleştiriyoruz.",
      },
    ],
    formTitle: "Başvuru formu",
    formDescription: "Birkaç bilgiyle başlayalım, geri kalanını görüşmede konuşuruz.",
    fields: {
      firstName: "Ad",
      lastName: "Soyad",
      phone: "Telefon / WhatsApp",
      email: "E-posta",
      germanyExperience: "Almanya deneyimin nedir?",
      germanyExperiencePlaceholder: "Hangi şehir, hangi üniversite/program, ne zaman?",
      motivation: "Neden mentor olmak istiyorsun?",
      motivationPlaceholder: "Birkaç cümleyle anlatman yeterli.",
      message: "Eklemek istediğin bir şey var mı?",
      messagePlaceholder: "İstersen buraya yazabilirsin (opsiyonel).",
    },
    submit: { label: "Başvuruyu Gönder", loading: "Gönderiliyor..." },
    success: {
      title: "Teşekkürler.",
      description: "Başvurunu aldık. İnceledikten sonra seninle iletişime geçeceğiz.",
      backHome: "Ana Sayfaya Dön",
    },
    error: { description: "Formu gönderirken bir sorun oluştu. Lütfen tekrar dene." },
  },
  assessment: {
    intro: {
      eyebrow: "Kişisel Yol Haritası",
      title: "Seni biraz tanıyalım.",
      description:
        "Sana daha doğru yardımcı olabilmemiz için birkaç kısa soru soracağız. Formu doldurman birkaç dakikadan kısa sürer.",
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
          { value: "considering-masters", label: "Yüksek lisans düşünüyorum" },
          { value: "other", label: "Diğer" },
        ],
      },
      {
        id: "interestArea",
        question: "Hangi alana ilgi duyuyorsun?",
        type: "single",
        helper: "Henüz net değilse 'Henüz bilmiyorum' seçebilirsin.",
        options: [
          { value: "engineering", label: "Mühendislik" },
          { value: "computer-it", label: "Bilgisayar / IT" },
          { value: "business-economics", label: "İşletme / Ekonomi" },
          { value: "health", label: "Sağlık" },
          { value: "social-sciences", label: "Sosyal bilimler" },
          { value: "design-arts", label: "Tasarım / Sanat" },
          { value: "unknown", label: "Henüz bilmiyorum" },
          { value: "other", label: "Diğer" },
        ],
      },
      {
        id: "languageLevel",
        question: "Almanca / İngilizce seviyen?",
        type: "single",
        options: [
          { value: "none", label: "Henüz başlamadım" },
          { value: "a1-a2", label: "A1–A2" },
          { value: "b1-b2", label: "B1–B2" },
          { value: "c1-c2", label: "C1–C2" },
          { value: "native-fluent", label: "Ana dil / akıcı" },
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
        id: "message",
        question: "Bize özellikle sormak istediğin bir şey var mı?",
        type: "text",
        placeholder: "İstersen buraya yazabilirsin (opsiyonel).",
        optional: true,
      },
    ],
    contactStep: {
      title: "Sana nasıl ulaşalım?",
      description: "Son adım. Bu bilgilerle görüşmene hazırlıklı geleceğiz.",
      fields: {
        firstName: "Ad",
        lastName: "Soyad",
        phone: "Telefon / WhatsApp",
        email: "E-posta",
        preferredContact: "Tercih ettiğin iletişim yöntemi",
        preferredContactOptions: [
          { value: "whatsapp", label: "WhatsApp" },
          { value: "phone", label: "Telefon" },
          { value: "email", label: "E-posta" },
        ],
        note: "Varsa bize uygun olduğun bir zaman bırakabilirsin (opsiyonel).",
      },
    },
    submit: { label: "Gönder", loading: "Gönderiliyor..." },
    success: {
      title: "Teşekkürler.",
      description:
        "Seni biraz daha tanıyoruz. Paylaştığın bilgilerle görüşmemize hazırlıklı geleceğiz. Bir sonraki adımda seninle iletişime geçeceğiz.",
      whatsappCta: "İstersen WhatsApp'tan şimdi de yazabilirsin.",
      backHome: "Ana Sayfaya Dön",
    },
    error: {
      title: "Bir şeyler ters gitti.",
      description: "Formu gönderirken bir sorun oluştu. Tekrar deneyebilir ya da doğrudan WhatsApp'tan yazabilirsin.",
      retry: "Tekrar Dene",
    },
  },
  footer: {
    description:
      "Almanya'da eğitim hayatını ilerletmek isteyen herkes için: nereden başlarsan başla, bir sonraki adımı birlikte buluyoruz.",
    navTitle: "Sayfalar",
    legalTitle: "Yasal",
    legalLinks: [
      { label: "Gizlilik Politikası", href: "/gizlilik" },
      { label: "KVKK Aydınlatma Metni", href: "/kvkk" },
      { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
    ],
    rights: `© ${new Date().getFullYear()} ${siteConfig.name}. Tüm hakları saklıdır.`,
  },
};
