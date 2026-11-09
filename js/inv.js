// Umumiy mantiq: ma'lumot, ochilish, hisoblagich, marosim, xarita, musiqa,
// gultojlar va RU/UZ til almashtirish.
(function () {
  "use strict";
  var PREVIEW = /[?&]preview=1/.test(location.search);

  var DEF = {
    lead_uz: "Hayotimizdagi eng baxtli kunni Siz — aziz mehmonimiz bilan birga nishonlashni orzu qilamiz.",
    lead_ru: "Мы мечтаем разделить самый счастливый день нашей жизни с Вами — нашим дорогим гостем.",
    msg_uz: "Sizning tashrifingiz bu quvonchli kunimizga alohida fayz va tabarruk baxsh etadi. Kelishingizni intiqlik bilan kutamiz.",
    msg_ru: "Ваше присутствие подарит нашему радостному дню особую теплоту. С нетерпением ждём Вас.",
    fam_uz: "Kuyov va kelin oilalari",
    fam_ru: "Семьи жениха и невесты"
  };
  var D = {
    kuyov: "Islombek", kelin: "Nilufar",
    year: 2026, month: 9, day: 20, hour: 18, minute: 0,
    venueName: "\"Navro'z\" to'yxonasi",
    address: "Toshkent sh., Chilonzor tumani, 12-mavze",
    lead: DEF.lead_uz, message: DEF.msg_uz, family: DEF.fam_uz,
    schedule: [
      { time: "17:00", label: "Mehmonlarni kutib olish" },
      { time: "18:00", label: "Nikoh marosimi" },
      { time: "19:00", label: "Ziyofat boshlanishi" },
      { time: "20:00", label: "Milliy taomlar" },
      { time: "21:00", label: "Raqs va davra" }
    ]
  };
  var INV = Object.assign({}, D, window.__INV__ || {});
  // Marosim tartibi taklifnomaning o'zida (shablon yoki admin bot) berilmagan bo'lsa — to'y vaqtidan hisoblanadi
  // (avval namunadagi 17:00…21:00 qotib qolardi: to'y 13:00 da bo'lsa ham jadval 17:00 dan boshlanardi)
  if (!(window.__INV__ && Array.isArray(window.__INV__.schedule))) (function(){
    var h0 = (INV.hour != null && INV.hour !== "" && !isNaN(+INV.hour)) ? +INV.hour : 18, m0 = +INV.minute || 0;
    var at = function(d){ var t = (h0 * 60 + m0 + d + 1440) % 1440, x = Math.floor(t / 60), y = t % 60; return (x < 10 ? "0" : "") + x + ":" + (y < 10 ? "0" : "") + y; };
    INV.schedule = D.schedule.map(function(it, i){ return { time: at(i * 60), label: it.label }; });
  })();
  // Avval yaratilgan taklifnomalarda standart xabar eski imlo bilan saqlangan ("tabaruk") — to'g'risiga almashtiriladi ("tabarruk"),
  // shunda eski taklifnomalarda ham xato tuzaladi va boshqa tillarga tarjimasi ishlayveradi.
  if (typeof INV.message === "string") INV.message = INV.message.replace("alohida fayz va tabaruk baxsh etadi", "alohida fayz va tabarruk baxsh etadi");
  if (INV.anim) document.body.classList.add("anim-" + INV.anim);

  // ---------- Til lug'atlari ----------
  var L = {
    uz: {
      months: ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"],
      monthsNom: ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"],
      days: ["Yakshanba","Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"],
      daysShort: ["Ya","Du","Se","Cho","Pa","Ju","Sha"]
    },
    ru: {
      months: ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"],
      monthsNom: ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
      days: ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"],
      daysShort: ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"]
    }
  };
  // Statik iboralar: uz -> ru
  var PH = {
    "Taklifnoma": "Приглашение",
    "Chiroqlarni yoqish uchun bosing": "Нажмите, чтобы зажечь свет",
    "Sunnat to'yiga taklifnoma": "Приглашение на сүндет той",
    "Bizning botirlarimiz": "Наши батыры",
    "Bizning botirimiz": "Наш батыр",
    "Sunnat to'yimizga taklifnoma": "Приглашение на суннат-той",
    "Bizning o'g'lonlarimiz": "Наши сыновья",
    "Bizning o'g'lonimiz": "Наш сын",
    "Farzandimizning sunnat to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "Приглашаем Вас за наш праздничный дастархан по случаю сүндет тоя нашего сына.",
    "Sunnat to'yi kuni": "День торжества",
    "To'ygacha qolgan vaqt": "До торжества осталось",
    "Farzandlarimizning sunnat to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "Приглашаем Вас за наш праздничный дастархан по случаю сүндет тоя наших сыновей.",
    "Sizning tashrifingiz bu quvonchli kunimizga alohida fayz baxsh etadi. Kelishingizni intiqlik bilan kutamiz.": "Ваш приход придаст особую радость нашему празднику. С нетерпением ждём Вас.",
    "Ota-onalari": "Родители",
    "Qizimizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "Приглашаем Вас за наш праздничный дастархан по случаю бешик-тоя нашей дочери.",
    "Egizak qizlarimizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "Приглашаем Вас за наш праздничный дастархан по случаю бешик-тоя наших дочерей-близняшек.",
    "O'g'limizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "Приглашаем Вас за наш праздничный дастархан по случаю бешик-тоя нашего сына.",
    "Egizak o'g'illarimizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "Приглашаем Вас за наш праздничный дастархан по случаю бешик-тоя наших сыновей-близнецов.",
    "Egizaklarimiz — qizimiz va o'g'limizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "Приглашаем Вас за наш праздничный дастархан по случаю бешик-тоя наших близнецов — дочери и сына.",
    "Farzandimizga beshik to'yi muborak bo'lsin! Sizning tashrifingiz va duolaringiz bu quvonchli kunimizga alohida fayz baxsh etadi.": "Поздравляем нашего малыша с бешик-тоем! Ваш приход и добрые пожелания придадут этому радостному дню особую теплоту.",
    "Farzandlarimizga beshik to'yi muborak bo'lsin! Sizning tashrifingiz va duolaringiz bu quvonchli kunimizga alohida fayz baxsh etadi.": "Поздравляем наших малышей с бешик-тоем! Ваш приход и добрые пожелания придадут этому радостному дню особую теплоту.",
    "Ota-onasi": "Родители",
    "Beshikka belash marosimi": "Обряд укладывания в бешик",
    "Bayram dasturxoni": "Праздничный дастархан",
    "Tilaklar va duo": "Пожелания и дуа",
    "Qiz bazmi": "Девичник",
    "Qiz bazmiga taklifnoma": "Приглашение на девичник",
    "Aziz dugonam": "Дорогая подруга",
    "Aziz mehmonim": "Дорогой гость",
    "Sevgi ila": "С любовью",
    "Lahzalar": "Моменты",
    "Bazm kuni": "День девичника",
    "Liboslar": "Дресс-код",
    "Bazmga quyidagi liboslarda kelishingizni so'raymiz": "Просим прийти в нарядах в следующих тонах",
    "Bazmga qolgan vaqt": "До девичника осталось",
    "Hayotimning yangi sahifasi oldidan eng yaqin insonlarim bilan birga bo'lishni istayman.": "Перед новой страницей моей жизни я хочу побыть с самыми близкими людьми.",
    "Qiz bazmimga Sizni chin dildan taklif etaman. Kelishingiz men uchun katta quvonch bo'ladi.": "От всего сердца приглашаю Вас на мой девичник. Ваш приход будет для меня большой радостью.",
    "Ochish uchun bosing": "Нажмите, чтобы открыть",
    "Siz taklifnoma oldingiz": "Вы приглашены",
    "Ochish uchun suring →": "Проведите, чтобы открыть →",
    "Yurakni bosing": "Нажмите на сердце",
    "To'y kuni": "День свадьбы",
    "Nikoh to'yiga taklif etamiz": "Приглашаем на свадьбу",
    "Nikoh to'yiga taklifnoma": "Приглашение на свадьбу",
    "Tug'ilgan kunga taklifnoma": "Приглашение на день рождения",
    "Tug'ilgan kuning muborak!": "С днём рождения!",
    "Xotiralar": "Воспоминания",
    "Sevgi bilan": "С любовью",
    "Shamlarni puflang": "Задуйте свечи",
    "Bosib turing": "Нажмите и держите",
    "Orzu qiling!": "Загадайте желание!",
    "Do'stlar tilaklari": "Пожелания друзей",
    "Tabrik": "Поздравление",
    "Tug'ilgan kun egasiga tilagingiz...": "Ваше пожелание имениннику...",
    "Tug'ilgan kuning muborak bo'lsin! Hayoting doim quvonch, sog'liq va omadga to'la bo'lsin. Barcha orzularing ushalsin!": "С днём рождения! Пусть жизнь всегда будет полна радости, здоровья и удачи. Пусть сбудутся все мечты!",
    "Bayram dasturi": "Программа праздника",
    "Bayramgacha qolgan vaqt": "До праздника осталось",
    "Sizni intiqlik bilan kutaman": "С нетерпением жду вас",
    "Bayram joyi": "Место праздника",
    "Tort kesish": "Разрезание торта",
    "O'yinlar va raqslar": "Игры и танцы",
    "Sovg'alar va tilaklar": "Подарки и пожелания",
    "Sharni bosing": "Нажмите на шарик",
    "Mening tug'ilgan kunimga Sizni taklif qilaman! Bu quvonchli kunni birga nishonlaylik.": "Приглашаю Вас на мой день рождения! Давайте отпразднуем этот радостный день вместе.",
    "Sizning tashrifingiz bayramimga alohida fayz baxsh etadi. Kelishingizni intiqlik bilan kutaman!": "Ваш приход сделает мой праздник по-настоящему особенным. С нетерпением жду Вас!",
    "Nikoh marosimi": "Церемония никях",
    "Nikoh to'yi": "Свадьба",
    "Pastga suring": "Листайте вниз",
    "Pastga tushuring": "Листайте вниз",
    "To'yga qoldi": "До свадьбы осталось",
    "Har lahzani sanayapmiz": "Считаем каждое мгновение",
    "Marosim tartibi": "Программа торжества",
    "Sana": "Дата", "Vaqti": "Время", "Manzil": "Адрес",
    "Mehmonlar kutib olinadi": "Встреча гостей",
    "Hurmat ila": "С уважением",
    "Kun": "Дней", "Soat": "Часов", "Daqiqa": "Минут", "Soniya": "Секунд",
    "Bismillahir Rohmanir Rohiym": "Bismillahir Rohmanir Rohiym",
    "Mehmonlarni kutib olish": "Встреча гостей",
    "Ziyofat boshlanishi": "Начало банкета",
    "Milliy taomlar": "Национальные блюда",
    "Raqs va davra": "Танцы и веселье",
    "Biz": "Мы",
    "Kelin va Kuyov": "Жених и Невеста",
    "Kelin va kuyov": "Невеста и жених",
    "Bizning baxtimiz": "Наше счастье",
    "Baxtli kunimizgacha": "До счастливого дня",
    "To'y manzili": "Адрес торжества",
    "To'y maskani": "Место торжества",
    "Xaritada ko'rish": "Посмотреть на карте",
    "Yo'nalishni ko'rish": "Проложить маршрут",
    "Xaritada ochish": "Открыть на карте",
    "Bizning lahzalarimiz": "Наши моменты",
    "Galereya": "Галерея",
    "Sizni kutamiz": "Ждём вас",
    "Biz bilan birga bo'ling": "Будьте с нами",
    "Sizni intiqlik bilan kutamiz": "С нетерпением ждём вас",
    "Sizni kutib qolamiz": "С нетерпением ждём вас",
    "Aziz mehmonlar": "Дорогие гости",
    "Aziz mehmon!": "Дорогой гость!",
    "Aziz mehmon": "Дорогой гость",
    "Baxtli kunimizga xush kelibsiz": "Добро пожаловать в наш счастливый день",
    "To'yga qolgan vaqt": "До свадьбы осталось",
    "Taklifnomani ochish uchun bosing": "Нажмите, чтобы открыть приглашение",
    "Taklifnomani ochish": "Открыть приглашение",
    "Marosim dasturi": "Программа торжества",
    "Bayram dasturi": "Праздничная программа",
    "Bayram davom etadi": "Праздник продолжается",
    "Banket": "Банкет", "Visol oqshomi": "Вечер торжества",
    "To'yona uchun": "Свадебный подарок", "Nusxa olish": "Копировать", "Karta raqami nusxalandi ✓": "Номер карты скопирован ✓",
    "To'y marosimi": "Свадебная церемония",
    "Tilaklar": "Пожелания",
    "Tilak yuborish": "Отправить пожелание",
    "Tahrirlash": "Изменить",
    "O'chirish": "Удалить",
    "Saqlash": "Сохранить",
    "Bekor qilish": "Отмена",
    "Tilak o'chirilsinmi?": "Удалить пожелание?",
    "Tilagingiz yangilandi ✓": "Пожелание обновлено ✓",
    "Tilak o'chirildi": "Пожелание удалено",
    "Aziz va qadrdon insonimiz!": "Дорогие и близкие нам люди!",
    "Sizlarga o'zlaringizdan, ular bilan orom topishingiz uchun juftlar yaratgani va oralaringizga muhabbat hamda rahmat solib qo'ygani ham Uning oyatlaridandir.":
      "Среди Его знамений — то, что Он сотворил для вас супруг из вас самих, чтобы вы находили в них покой, и установил между вами любовь и милосердие.",
    "Rum surasi, 21-oyat": "Сура «Ар-Рум», аят 21",
    // Demo kontent matnlari (RU'da toza ko'rinishi uchun)
    "Bir umr birga bo'lish yo'lida qadam qo'yayotganimizda, sizning ishtirokingiz biz uchun eng katta baxt.":
      "Делая шаг навстречу совместной жизни, мы будем счастливы видеть вас рядом в этот особенный день.",
    "Sizni o'zimiz uchun juda muhim bo'lgan ushbu baxtli kunimizda yonimizda ko'rishdan behad xursand bo'lamiz. Kelishingizni intiqlik bilan kutamiz.":
      "Мы будем безмерно рады видеть вас рядом в этот важный и счастливый для нас день. С нетерпением ждём вас.",
    "Ali va Valiya oilalari": "Семьи Али и Валии",
    // Tilaklar (wishes) bo'limi
    "Ismingiz": "Ваше имя",
    "Yosh oilaga tilagingiz...": "Ваше пожелание молодой семье...",
    "Birinchi bo'lib tilak qoldiring 💐": "Оставьте пожелание первым 💐",
    "Ism va tilak yozing": "Напишите имя и пожелание",
    "Rahmat! Tilagingiz qo'shildi 💐": "Спасибо! Ваше пожелание добавлено 💐",
    "Xatolik": "Ошибка",
    "Ulanishda xatolik": "Ошибка соединения",
    "Namunada tilak yuborilmaydi — haqiqiy taklifnomada ishlaydi.": "В демо пожелание не отправляется — работает в настоящем приглашении.",
    "Baxtli bo'linglar! 💐": "Будьте счастливы! 💐",
    "To'yingiz muborak bo'lsin!": "Поздравляем со свадьбой!",
    "Siz to'yimizga taklif etilgansiz": "Вы приглашены на нашу свадьбу",
    "Siz to'yimizga taklif qilingansiz": "Вы приглашены на нашу свадьбу",
    "Baxtli va totuv umr tilaymiz": "Желаем счастливой и дружной жизни",
    "Muhabbat bog'i": "Сад любви",
    "Muhabbat ila": "С любовью",
    "Sevgi ila": "С любовью",
    "Mehr ila": "С теплотой",
    "Bizning hikoyamiz": "Наша история",
    "Bizning sevgimiz": "Наша любовь",
    "Baxtli bo'ling": "Будьте счастливы",
    "Umringiz uzoq bo'lsin": "Долгих лет жизни",
    // Nahorgi osh
    "Nahorgi osh": "Нахорги ош",
    "Boshlanishi": "Начало",
    "Osh kuni": "День плова",
    "Oshga qolgan vaqt": "До плова осталось",
    "Osh manzili": "Место проведения",
    "Ma'ruza": "Маъруза (проповедь)",
    "Osh tortish va taomlanish": "Подача плова и трапеза",
    "Dasturxonimiz Siz bilan fayzli bo'ladi": "Наш дастархан станет благословеннее с Вами",
    // Retro kino
    "Sizni premyeraga taklif qilamiz": "Приглашаем Вас на премьеру",
    "Seansni boshlash": "Начать сеанс",
    "Premyera": "Премьера",
    "Bosh rollarda": "В главных ролях",
    "Aziz tomoshabin": "Дорогой зритель",
    "Kadrlar": "Кадры",
    "Seanslar jadvali": "Расписание сеансов",
    "Premyeragacha": "До премьеры",
    "Taklif chiptasi": "Пригласительный билет",
    "Film": "Фильм", "Seans": "Сеанс", "Kinoteatr": "Кинотеатр", "Qator · Joy": "Ряд · Место",
    "Aziz mehmon · Eng hurmatli": "Дорогой гость · Самое почётное",
    "Kirish": "Вход",
    "Chiptani yirting →": "Оторвите билет →",
    "Yandex Xarita": "Яндекс Карты",

    "Kalendarga qo'shish": "Добавить в календарь",
    "Telefon taqvimiga": "В календарь телефона",
    "Fayl yuklanadi — uni bosib oching": "Скачается файл — откройте его",
    "Google Taqvim": "Google Календарь",
    "Sizning stolingiz": "Ваш стол",
    // Turmushga chiqasanmi? (taklif)
    "Eng baxtli kun": "Самый счастливый день", "endi bir umr birga": "теперь вместе навсегда", "Uchrashuvimiz": "Наша встреча",
    "Seni kutaman": "Я буду ждать тебя", "Uchrashuv joyi": "Место встречи", "Bizning lahzalarimiz": "Наши моменты",
    "Senga maktubim": "Моё письмо тебе", "Seni sevaman": "Я люблю тебя",
    // Xushxabar
    "Xushxabar": "Радостная новость", "Endi biz uchtamiz": "Теперь нас трое", "Farzandimiz dunyoga kelishiga": "До рождения нашего малыша", "qoldi": "осталось",
    "Birinchi suratimiz": "Наше первое фото", "Sizga xatim": "Моё письмо Вам", "Sizni sevaman": "Люблю Вас",
    // Kechirim
    "Kechirganing uchun rahmat": "Спасибо, что простила", "endi hammasi yaxshi bo'ladi": "теперь всё будет хорошо",
    "Kinoteatr manzili": "Адрес кинотеатра",
    "Tomoshabinlar fikri": "Отзывы зрителей",
    "...va ular baxtli yashadilar": "...и жили они долго и счастливо",
    // Oltin kitob
    "Kitobni ochish uchun bosing": "Нажмите, чтобы открыть книгу",
    "Varaqlash uchun suring": "Листайте, чтобы перевернуть",
    "Barcha tilaklar": "Все пожелания",
    // Oq konvert
    "Konvertni ochish uchun bosing": "Нажмите, чтобы открыть конверт",
    "Nikoh marosimiga xush kelibsiz": "Добро пожаловать на церемонию никях",
    "Sanani ochish uchun qiring": "Сотрите, чтобы открыть дату",
    "Kuni": "День", "Oyi": "Месяц", "Yili": "Год",
    "Sizni nikoh marosimimizga taklif qilamiz": "Приглашаем Вас на нашу церемонию никях",
    "va": "и",
    "Aziz do'stlar va yaqinlar": "Дорогие друзья и близкие",
    "Va sizlarni juft-juft qilib yaratdik": "И Мы создали вас парами",
    "Naba surasi, 8-oyat": "Сура «Ан-Наба», аят 8",
    "Bayram boshlanishiga": "До начала торжества",
    "Kelin-kuyovning kirib kelishi": "Выход жениха и невесты",
    "Nikoh duosi": "Благословение никях",
    "Farzandlarimizning nikoh to'yi munosabati bilan beriladigan nahorgi oshimizga Sizni lutfan taklif etamiz.":
      "Приглашаем Вас на утренний плов по случаю свадьбы наших детей.",
    "Sizni to'yimizga taklif etamiz": "Приглашаем Вас на нашу свадьбу",
    "\"Sizlarga o'zlaringizdan, ular bilan orom topishingiz uchun juftlar yaratgani va oralaringizga muhabbat hamda rahmat solib qo'ygani ham Uning oyatlaridandir.\"": "«Среди Его знамений — то, что Он сотворил для вас супруг из вас самих, чтобы вы находили в них покой, и установил между вами любовь и милосердие.»",
    "Sizni hayotimizning eng quvonchli kunida aziz mehmonimiz bo'lishga taklif etamiz.": "Приглашаем Вас стать нашим дорогим гостем в самый радостный день нашей жизни.",
    "Ochish": "Открыть",
    "Joylashuv": "Местоположение",
    "Xush kelibsiz": "Добро пожаловать",
    "Tilaklaringizni qoldiring": "Оставьте свои пожелания",
    "Kalendarga saqlash": "Добавить в календарь",
    "Suratlarni barmoq bilan suring": "Листайте фотографии пальцем",
    "Senga aytmoqchi bo'lgan gapim bor…": "Мне нужно тебе кое-что сказать…",
    "Yurakni bosib tur": "Нажми и удерживай сердце",
    "Bu sahifa faqat sen uchun": "Эта страница только для тебя",
    "Sevgi maktubi": "Любовное письмо",
    "Seni sevuvchi": "Любящий тебя",
    "Senga aytmoqchi bo'lganlarim": "Всё, что я хотел тебе сказать",
    "Ovozni yoqish": "Включить звук",
    "Shu kuni, shu soatda": "В этот день, в этот час",
    "Uchrashuvgacha": "До нашей встречи",
    "Seni birinchi ko'rgan kunimdan beri hayotim butunlay o'zgardi. Har kuni seni o'ylab uyg'onaman va seni o'ylab uxlayman. Bugun yuragimdagini senga aytishga qaror qildim: men seni sevaman.": "С того дня, как я впервые увидел тебя, моя жизнь полностью изменилась. Каждый день я просыпаюсь с мыслями о тебе и засыпаю с ними. Сегодня я решил сказать тебе то, что у меня на сердце: я люблю тебя.",
    "Osmonga qarang…": "Посмотрите на небо…",
    "Shouni boshlash": "Начать шоу",
    "O'tkazib yuborish": "Пропустить"
  };
  // ---------- QOZOQCHA va INGLIZCHA ----------
  // Statik iboralar: uz -> kk / uz -> en (kalitlar PH bilan bir xil). Mijoz o'zi yozgan matnlar (xabar, imzo, to'yxona, manzil) tarjima qilinmaydi.
  L.kk = {
    months: ["қаңтар","ақпан","наурыз","сәуір","мамыр","маусым","шілде","тамыз","қыркүйек","қазан","қараша","желтоқсан"],
    monthsNom: ["Қаңтар","Ақпан","Наурыз","Сәуір","Мамыр","Маусым","Шілде","Тамыз","Қыркүйек","Қазан","Қараша","Желтоқсан"],
    days: ["Жексенбі","Дүйсенбі","Сейсенбі","Сәрсенбі","Бейсенбі","Жұма","Сенбі"],
    daysShort: ["Жс","Дс","Сс","Ср","Бс","Жм","Сб"]
  };
  L.en = {
    months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    monthsNom: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    days: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    daysShort: ["Su","Mo","Tu","We","Th","Fr","Sa"]
  };
  // ---------- TURKCHA (Turkiya bozori uchun) ----------
  L.tr = {
    months: ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],
    monthsNom: ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],
    days: ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"],
    daysShort: ["Pz","Pt","Sa","Ça","Pe","Cu","Ct"]
  };
  var KKD = {
    "Taklifnoma": "Шақыру",
    "Chiroqlarni yoqish uchun bosing": "Шамдарды жағу үшін басыңыз",
    "Sunnat to'yiga taklifnoma": "Сүндет тойға шақыру",
    "Bizning botirlarimiz": "Біздің батырларымыз",
    "Bizning botirimiz": "Біздің батырымыз",
    "Farzandimizning sunnat to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "Ұлымыздың сүндет тойына арналған ақ дастарханымыздың қадірлі қонағы болуға шақырамыз.",
    "Sunnat to'yi kuni": "Той күні",
    "To'ygacha qolgan vaqt": "Тойға дейін қалған уақыт",
    "Farzandlarimizning sunnat to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "Ұлдарымыздың сүндет тойына арналған ақ дастарханымыздың қадірлі қонағы болуға шақырамыз.",
    "Sizning tashrifingiz bu quvonchli kunimizga alohida fayz baxsh etadi. Kelishingizni intiqlik bilan kutamiz.": "Сіздің келуіңіз біздің қуанышымызды еселей түседі. Келуіңізді асыға күтеміз.",
    "Ota-onalari": "Ата-анасы",
    "Qizimizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "Қызымыздың бесік тойына арналған ақ дастарханымыздың қадірлі қонағы болуға шақырамыз.",
    "Egizak qizlarimizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "Егіз қыздарымыздың бесік тойына арналған ақ дастарханымыздың қадірлі қонағы болуға шақырамыз.",
    "O'g'limizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "Ұлымыздың бесік тойына арналған ақ дастарханымыздың қадірлі қонағы болуға шақырамыз.",
    "Egizak o'g'illarimizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "Егіз ұлдарымыздың бесік тойына арналған ақ дастарханымыздың қадірлі қонағы болуға шақырамыз.",
    "Egizaklarimiz — qizimiz va o'g'limizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "Егіздеріміз — қызымыз бен ұлымыздың бесік тойына арналған ақ дастарханымыздың қадірлі қонағы болуға шақырамыз.",
    "Farzandimizga beshik to'yi muborak bo'lsin! Sizning tashrifingiz va duolaringiz bu quvonchli kunimizga alohida fayz baxsh etadi.": "Балапанымыздың бесік тойы құтты болсын! Сіздің келуіңіз бен тілектеріңіз қуанышымызды еселей түседі.",
    "Farzandlarimizga beshik to'yi muborak bo'lsin! Sizning tashrifingiz va duolaringiz bu quvonchli kunimizga alohida fayz baxsh etadi.": "Балапандарымыздың бесік тойы құтты болсын! Сіздің келуіңіз бен тілектеріңіз қуанышымызды еселей түседі.",
    "Ota-onasi": "Ата-анасы",
    "Beshikka belash marosimi": "Бесікке салу рәсімі",
    "Bayram dasturxoni": "Мерекелік дастарқан",
    "Tilaklar va duo": "Тілектер мен бата",
    "Qiz bazmi": "Қыз ұзату",
    "Qiz bazmiga taklifnoma": "Қыз ұзатуға шақыру",
    "Aziz dugonam": "Қымбатты құрбым",
    "Aziz mehmonim": "Құрметті қонағым",
    "Sevgi ila": "Махаббатпен",
    "Lahzalar": "Сәттер",
    "Bazm kuni": "Той күні",
    "Liboslar": "Киім үлгісі",
    "Bazmga quyidagi liboslarda kelishingizni so'raymiz": "Кешке төмендегі түстегі киіммен келуіңізді сұраймыз",
    "Bazmga qolgan vaqt": "Кешке дейін қалған уақыт",
    "Hayotimning yangi sahifasi oldidan eng yaqin insonlarim bilan birga bo'lishni istayman.": "Өмірімнің жаңа парағы алдында ең жақын жандарыммен бірге болғым келеді.",
    "Qiz bazmimga Sizni chin dildan taklif etaman. Kelishingiz men uchun katta quvonch bo'ladi.": "Сізді қыз ұзату кешіме шын жүректен шақырамын. Келуіңіз мен үшін үлкен қуаныш болмақ.",
    "Ochish uchun bosing": "Ашу үшін басыңыз",
    "Siz taklifnoma oldingiz": "Сізге шақыру келді",
    "Ochish uchun suring →": "Ашу үшін сырғытыңыз →",
    "Yurakni bosing": "Жүректі басыңыз",
    "To'y kuni": "Той күні",
    "Nikoh to'yiga taklif etamiz": "Үйлену тойына шақырамыз",
    "Nikoh to'yiga taklifnoma": "Үйлену тойына шақыру",
    "Tug'ilgan kunga taklifnoma": "Туған күнге шақыру",
    "Tug'ilgan kuning muborak!": "Туған күніңмен!",
    "Xotiralar": "Естеліктер",
    "Sevgi bilan": "Сүйіспеншілікпен",
    "Shamlarni puflang": "Шамдарды үрлеңіз",
    "Bosib turing": "Басып тұрыңыз",
    "Orzu qiling!": "Тілек тілеңіз!",
    "Do'stlar tilaklari": "Достардың тілектері",
    "Tabrik": "Құттықтау",
    "Tug'ilgan kun egasiga tilagingiz...": "Туған күн иесіне тілегіңіз...",
    "Tug'ilgan kuning muborak bo'lsin! Hayoting doim quvonch, sog'liq va omadga to'la bo'lsin. Barcha orzularing ushalsin!": "Туған күніңмен! Өмірің әрқашан қуанышқа, денсаулыққа және сәттілікке толы болсын. Барлық армандарың орындалсын!",
    "Bayram dasturi": "Мереке бағдарламасы",
    "Bayramgacha qolgan vaqt": "Мерекеге дейін қалған уақыт",
    "Sizni intiqlik bilan kutaman": "Сізді асыға күтемін",
    "Bayram joyi": "Мереке орны",
    "Tort kesish": "Торт кесу",
    "O'yinlar va raqslar": "Ойындар мен билер",
    "Sovg'alar va tilaklar": "Сыйлықтар мен тілектер",
    "Sharni bosing": "Шарды басыңыз",
    "Mening tug'ilgan kunimga Sizni taklif qilaman! Bu quvonchli kunni birga nishonlaylik.": "Сізді туған күніме шақырамын! Осы қуанышты күнді бірге тойлайық.",
    "Sizning tashrifingiz bayramimga alohida fayz baxsh etadi. Kelishingizni intiqlik bilan kutaman!": "Сіздің келуіңіз мерекеме ерекше шырай береді. Сізді асыға күтемін!",
    "Nikoh marosimi": "Неке қию рәсімі",
    "Nikoh to'yi": "Үйлену тойы",
    "Pastga suring": "Төмен сырғытыңыз",
    "Pastga tushuring": "Төмен сырғытыңыз",
    "To'yga qoldi": "Тойға дейін қалды",
    "Har lahzani sanayapmiz": "Әр сәтті санап жүрміз",
    "Marosim tartibi": "Той бағдарламасы",
    "Sana": "Күні",
    "Vaqti": "Уақыты",
    "Manzil": "Мекенжай",
    "Mehmonlar kutib olinadi": "Қонақтарды қарсы алу",
    "Hurmat ila": "Құрметпен",
    "Kun": "Күн",
    "Soat": "Сағат",
    "Daqiqa": "Минут",
    "Soniya": "Секунд",
    "Bismillahir Rohmanir Rohiym": "Бисмилләһир-Рахманир-Рахим",
    "Mehmonlarni kutib olish": "Қонақтарды қарсы алу",
    "Ziyofat boshlanishi": "Той дастарханының басталуы",
    "Milliy taomlar": "Ұлттық тағамдар",
    "Raqs va davra": "Би және думан",
    "Biz": "Біз",
    "Kelin va Kuyov": "Қалыңдық пен Күйеу жігіт",
    "Kelin va kuyov": "Қалыңдық пен күйеу жігіт",
    "Bizning baxtimiz": "Біздің бақытымыз",
    "Baxtli kunimizgacha": "Бақытты күнімізге дейін",
    "To'y manzili": "Той өтетін мекенжай",
    "To'y maskani": "Той өтетін орын",
    "Xaritada ko'rish": "Картадан көру",
    "Yo'nalishni ko'rish": "Бағытты көру",
    "Xaritada ochish": "Картадан ашу",
    "Bizning lahzalarimiz": "Біздің сәттеріміз",
    "Galereya": "Галерея",
    "Sizni kutamiz": "Сізді күтеміз",
    "Biz bilan birga bo'ling": "Бізбен бірге болыңыз",
    "Sizni intiqlik bilan kutamiz": "Сізді асыға күтеміз",
    "Sizni kutib qolamiz": "Сізді асыға күтеміз",
    "Aziz mehmonlar": "Құрметті қонақтар",
    "Aziz mehmon!": "Құрметті қонақ!",
    "Aziz mehmon": "Құрметті қонақ",
    "Baxtli kunimizga xush kelibsiz": "Бақытты күнімізге қош келдіңіз",
    "To'yga qolgan vaqt": "Тойға дейін қалған уақыт",
    "Taklifnomani ochish uchun bosing": "Шақыруды ашу үшін басыңыз",
    "Taklifnomani ochish": "Шақыруды ашу",
    "Marosim dasturi": "Той бағдарламасы",
    "Bayram dasturi": "Мерекелік бағдарлама",
    "Bayram davom etadi": "Той жалғасады",
    "Banket": "Банкет",
    "Visol oqshomi": "Салтанатты кеш",
    "To'yona uchun": "Тойға сыйлық үшін",
    "Nusxa olish": "Көшіру",
    "Karta raqami nusxalandi ✓": "Карта нөмірі көшірілді ✓",
    "To'y marosimi": "Той салтанаты",
    "Tilaklar": "Тілектер",
    "Tilak yuborish": "Тілек жіберу",
    "Tahrirlash": "Өзгерту",
    "O'chirish": "Жою",
    "Saqlash": "Сақтау",
    "Bekor qilish": "Болдырмау",
    "Tilak o'chirilsinmi?": "Тілекті жою керек пе?",
    "Tilagingiz yangilandi ✓": "Тілегіңіз жаңартылды ✓",
    "Tilak o'chirildi": "Тілек жойылды",
    "Aziz va qadrdon insonimiz!": "Қымбатты әрі қадірлі жақынымыз!",
    "Sizlarga o'zlaringizdan, ular bilan orom topishingiz uchun juftlar yaratgani va oralaringizga muhabbat hamda rahmat solib qo'ygani ham Uning oyatlaridandir.": "Сендерге өз жандарыңнан, оларға тыныштық табуларың үшін жұбайлар жаратқаны және араларыңа сүйіспеншілік пен мейірімділік орнатқаны да — Оның белгілерінен.",
    "Rum surasi, 21-oyat": "«Рум» сүресі, 21-аят",
    "Bir umr birga bo'lish yo'lida qadam qo'yayotganimizda, sizning ishtirokingiz biz uchun eng katta baxt.": "Бір ғұмыр бірге болу жолына қадам басқан осы сәтте сіздің қатысуыңыз — біз үшін ең үлкен бақыт.",
    "Sizni o'zimiz uchun juda muhim bo'lgan ushbu baxtli kunimizda yonimizda ko'rishdan behad xursand bo'lamiz. Kelishingizni intiqlik bilan kutamiz.": "Біз үшін аса маңызды осы бақытты күнімізде сізді қасымыздан көрсек, шексіз қуанамыз. Келуіңізді асыға күтеміз.",
    "Ali va Valiya oilalari": "Әли мен Уәлия отбасылары",
    "Ismingiz": "Есіміңіз",
    "Yosh oilaga tilagingiz...": "Жас отбасына тілегіңіз...",
    "Birinchi bo'lib tilak qoldiring 💐": "Алғашқы болып тілек қалдырыңыз 💐",
    "Ism va tilak yozing": "Есіміңіз бен тілегіңізді жазыңыз",
    "Rahmat! Tilagingiz qo'shildi 💐": "Рақмет! Тілегіңіз қосылды 💐",
    "Xatolik": "Қате",
    "Ulanishda xatolik": "Байланыс қатесі",
    "Namunada tilak yuborilmaydi — haqiqiy taklifnomada ishlaydi.": "Үлгіде тілек жіберілмейді — нақты шақыруда жұмыс істейді.",
    "Baxtli bo'linglar! 💐": "Бақытты болыңдар! 💐",
    "To'yingiz muborak bo'lsin!": "Тойларыңыз құтты болсын!",
    "Siz to'yimizga taklif etilgansiz": "Сіз біздің тойымызға шақырылдыңыз",
    "Siz to'yimizga taklif qilingansiz": "Сіз біздің тойымызға шақырылдыңыз",
    "Baxtli va totuv umr tilaymiz": "Бақытты да тату ғұмыр тілейміз",
    "Muhabbat bog'i": "Махаббат бағы",
    "Muhabbat ila": "Махаббатпен",
    "Mehr ila": "Ізгі ниетпен",
    "Bizning hikoyamiz": "Біздің хикаямыз",
    "Bizning sevgimiz": "Біздің махаббатымыз",
    "Baxtli bo'ling": "Бақытты болыңыз",
    "Umringiz uzoq bo'lsin": "Ғұмырыңыз ұзақ болсын",
    "Nahorgi osh": "Таңғы ас",
    "Boshlanishi": "Басталуы",
    "Osh kuni": "Ас күні",
    "Oshga qolgan vaqt": "Асқа дейін қалған уақыт",
    "Osh manzili": "Ас берілетін орын",
    "Ma'ruza": "Уағыз",
    "Osh tortish va taomlanish": "Ас тарту және дастархан",
    "Dasturxonimiz Siz bilan fayzli bo'ladi": "Дастарханымыз Сізбен берекелі болмақ",
    "Sizni premyeraga taklif qilamiz": "Сізді премьераға шақырамыз",
    "Seansni boshlash": "Сеансты бастау",
    "Premyera": "Премьера",
    "Bosh rollarda": "Басты рөлдерде",
    "Aziz tomoshabin": "Құрметті көрермен",
    "Kadrlar": "Кадрлар",
    "Seanslar jadvali": "Сеанстар кестесі",
    "Premyeragacha": "Премьераға дейін",
    "Taklif chiptasi": "Шақыру билеті",
    "Film": "Фильм",
    "Seans": "Сеанс",
    "Kinoteatr": "Кинотеатр",
    "Qator · Joy": "Қатар · Орын",
    "Aziz mehmon · Eng hurmatli": "Құрметті қонақ · Ең қадірлі",
    "Kirish": "Кіру",
    "Chiptani yirting →": "Билетті жыртыңыз →",
    "Yandex Xarita": "Яндекс Карта",

    "Kalendarga qo'shish": "Күнтізбеге қосу",
    "Telefon taqvimiga": "Телефон күнтізбесіне",
    "Fayl yuklanadi — uni bosib oching": "Файл жүктеледі — оны ашыңыз",
    "Google Taqvim": "Google Күнтізбе",
    "Sizning stolingiz": "Сіздің үстеліңіз",
    "Eng baxtli kun": "Ең бақытты күн",
    "endi bir umr birga": "енді мәңгі біргеміз",
    "Uchrashuvimiz": "Біздің кездесуіміз",
    "Seni kutaman": "Сені күтемін",
    "Uchrashuv joyi": "Кездесу орны",
    "Senga maktubim": "Саған хатым",
    "Seni sevaman": "Мен сені сүйемін",
    "Xushxabar": "Қуанышты хабар",
    "Endi biz uchtamiz": "Енді біз үшеуміз",
    "Farzandimiz dunyoga kelishiga": "Сәбиіміз дүниеге келгенге дейін",
    "qoldi": "қалды",
    "Birinchi suratimiz": "Алғашқы суретіміз",
    "Sizga xatim": "Сізге хатым",
    "Sizni sevaman": "Сізді сүйемін",
    "Kechirganing uchun rahmat": "Кешіргенің үшін рақмет",
    "endi hammasi yaxshi bo'ladi": "енді бәрі жақсы болады",
    "Kinoteatr manzili": "Кинотеатр мекенжайы",
    "Tomoshabinlar fikri": "Көрермендер пікірі",
    "...va ular baxtli yashadilar": "...сөйтіп олар бақытты ғұмыр кешті",
    "Kitobni ochish uchun bosing": "Кітапты ашу үшін басыңыз",
    "Varaqlash uchun suring": "Парақтау үшін сырғытыңыз",
    "Barcha tilaklar": "Барлық тілектер",
    "Konvertni ochish uchun bosing": "Конвертті ашу үшін басыңыз",
    "Nikoh marosimiga xush kelibsiz": "Неке қию рәсіміне қош келдіңіз",
    "Sanani ochish uchun qiring": "Күнін ашу үшін сүртіңіз",
    "Kuni": "Күні",
    "Oyi": "Айы",
    "Yili": "Жылы",
    "Sizni nikoh marosimimizga taklif qilamiz": "Сізді неке қию рәсімімізге шақырамыз",
    "va": "және",
    "Aziz do'stlar va yaqinlar": "Қымбатты достар мен жақындар",
    "Va sizlarni juft-juft qilib yaratdik": "Әрі сендерді жұп-жұп етіп жараттық",
    "Naba surasi, 8-oyat": "«Нәбә» сүресі, 8-аят",
    "Bayram boshlanishiga": "Той басталғанға дейін",
    "Kelin-kuyovning kirib kelishi": "Жас жұбайлардың келуі",
    "Nikoh duosi": "Неке дұғасы",
    "Farzandlarimizning nikoh to'yi munosabati bilan beriladigan nahorgi oshimizga Sizni lutfan taklif etamiz.": "Балаларымыздың үйлену тойына орай берілетін таңғы асымызға Сізді шақырамыз.",
    "Sizni to'yimizga taklif etamiz": "Сізді тойымызға шақырамыз",
    "\"Sizlarga o'zlaringizdan, ular bilan orom topishingiz uchun juftlar yaratgani va oralaringizga muhabbat hamda rahmat solib qo'ygani ham Uning oyatlaridandir.\"": "«Сендерге өз жандарыңнан, оларға тыныштық табуларың үшін жұбайлар жаратқаны және араларыңа сүйіспеншілік пен мейірімділік орнатқаны да — Оның белгілерінен.»",
    "Sizni hayotimizning eng quvonchli kunida aziz mehmonimiz bo'lishga taklif etamiz.": "Сізді өміріміздің ең қуанышты күнінде қадірлі қонағымыз болуға шақырамыз.",
    "Ochish": "Ашу",
    "Joylashuv": "Орналасқан жері",
    "Xush kelibsiz": "Қош келдіңіз",
    "Tilaklaringizni qoldiring": "Тілектеріңізді қалдырыңыз",
    "Kalendarga saqlash": "Күнтізбеге сақтау",
    "Suratlarni barmoq bilan suring": "Суреттерді саусағыңызбен сырғытыңыз",
    "Senga aytmoqchi bo'lgan gapim bor…": "Саған айтқым келетін сөзім бар…",
    "Yurakni bosib tur": "Жүректі басып тұр",
    "Bu sahifa faqat sen uchun": "Бұл бет тек сен үшін",
    "Sevgi maktubi": "Махаббат хаты",
    "Seni sevuvchi": "Сені сүйетін",
    "Senga aytmoqchi bo'lganlarim": "Саған айтқым келгені",
    "Ovozni yoqish": "Дыбысты қосу",
    "Shu kuni, shu soatda": "Осы күні, осы сағатта",
    "Uchrashuvgacha": "Кездесуге дейін",
    "Seni birinchi ko'rgan kunimdan beri hayotim butunlay o'zgardi. Har kuni seni o'ylab uyg'onaman va seni o'ylab uxlayman. Bugun yuragimdagini senga aytishga qaror qildim: men seni sevaman.": "Сені алғаш көрген күннен бастап өмірім мүлдем өзгерді. Күн сайын сені ойлап оянамын, сені ойлап ұйықтаймын. Бүгін жүрегімдегіні саған айтуға бел будым: мен сені сүйемін.",
    "Osmonga qarang…": "Аспанға қараңыз…",
    "Shouni boshlash": "Шоуды бастау",
    "O'tkazib yuborish": "Өткізіп жіберу"
  };
  var END = {
    "Taklifnoma": "Invitation",
    "Chiroqlarni yoqish uchun bosing": "Tap to turn on the lights",
    "Sunnat to'yiga taklifnoma": "Invitation to the Sunnat celebration",
    "Bizning botirlarimiz": "Our little heroes",
    "Bizning botirimiz": "Our little hero",
    "Farzandimizning sunnat to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "We kindly invite you to our festive table in honour of our son's Sunnat celebration.",
    "Sunnat to'yi kuni": "Celebration day",
    "To'ygacha qolgan vaqt": "Time left until the celebration",
    "Farzandlarimizning sunnat to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "We kindly invite you to our festive table in honour of our sons' Sunnat celebration.",
    "Sizning tashrifingiz bu quvonchli kunimizga alohida fayz baxsh etadi. Kelishingizni intiqlik bilan kutamiz.": "Your presence will make our joyful day even brighter. We look forward to seeing you.",
    "Ota-onalari": "Parents",
    "Qizimizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "We kindly invite you to our festive table in honour of our daughter's cradle celebration.",
    "Egizak qizlarimizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "We kindly invite you to our festive table in honour of our twin daughters' cradle celebration.",
    "O'g'limizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "We kindly invite you to our festive table in honour of our son's cradle celebration.",
    "Egizak o'g'illarimizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "We kindly invite you to our festive table in honour of our twin sons' cradle celebration.",
    "Egizaklarimiz — qizimiz va o'g'limizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "We kindly invite you to our festive table in honour of our twins' — our daughter's and son's — cradle celebration.",
    "Farzandimizga beshik to'yi muborak bo'lsin! Sizning tashrifingiz va duolaringiz bu quvonchli kunimizga alohida fayz baxsh etadi.": "Congratulations to our little one on the cradle celebration! Your presence and blessings will make this joyful day even brighter.",
    "Farzandlarimizga beshik to'yi muborak bo'lsin! Sizning tashrifingiz va duolaringiz bu quvonchli kunimizga alohida fayz baxsh etadi.": "Congratulations to our little ones on their cradle celebration! Your presence and blessings will make this joyful day even brighter.",
    "Ota-onasi": "Parents",
    "Beshikka belash marosimi": "Cradle ceremony",
    "Bayram dasturxoni": "Festive table",
    "Tilaklar va duo": "Wishes and blessings",
    "Qiz bazmi": "Bridal party",
    "Qiz bazmiga taklifnoma": "Bridal party invitation",
    "Aziz dugonam": "Dear friend",
    "Aziz mehmonim": "Dear guest",
    "Sevgi ila": "With love",
    "Lahzalar": "Moments",
    "Bazm kuni": "Party day",
    "Liboslar": "Dress code",
    "Bazmga quyidagi liboslarda kelishingizni so'raymiz": "We kindly ask you to wear the following colours",
    "Bazmga qolgan vaqt": "Time left until the party",
    "Hayotimning yangi sahifasi oldidan eng yaqin insonlarim bilan birga bo'lishni istayman.": "Before a new chapter of my life begins, I want to be with the people closest to me.",
    "Qiz bazmimga Sizni chin dildan taklif etaman. Kelishingiz men uchun katta quvonch bo'ladi.": "I warmly invite you to my bridal party. Your presence will mean so much to me.",
    "Ochish uchun bosing": "Tap to open",
    "Siz taklifnoma oldingiz": "You have received an invitation",
    "Ochish uchun suring →": "Slide to open →",
    "Yurakni bosing": "Tap the heart",
    "To'y kuni": "Wedding day",
    "Nikoh to'yiga taklif etamiz": "We invite you to our wedding",
    "Nikoh to'yiga taklifnoma": "Wedding invitation",
    "Tug'ilgan kunga taklifnoma": "Birthday invitation",
    "Tug'ilgan kuning muborak!": "Happy birthday!",
    "Xotiralar": "Memories",
    "Sevgi bilan": "With love",
    "Shamlarni puflang": "Blow out the candles",
    "Bosib turing": "Press and hold",
    "Orzu qiling!": "Make a wish!",
    "Do'stlar tilaklari": "Wishes from friends",
    "Tabrik": "Greeting",
    "Tug'ilgan kun egasiga tilagingiz...": "Your wish for the birthday person...",
    "Tug'ilgan kuning muborak bo'lsin! Hayoting doim quvonch, sog'liq va omadga to'la bo'lsin. Barcha orzularing ushalsin!": "Happy birthday! May your life always be full of joy, health and good luck. May all your dreams come true!",
    "Bayram dasturi": "Party programme",
    "Bayramgacha qolgan vaqt": "Time left until the party",
    "Sizni intiqlik bilan kutaman": "Can't wait to see you",
    "Bayram joyi": "Venue",
    "Tort kesish": "Cake cutting",
    "O'yinlar va raqslar": "Games and dancing",
    "Sovg'alar va tilaklar": "Gifts and wishes",
    "Sharni bosing": "Tap the balloon",
    "Mening tug'ilgan kunimga Sizni taklif qilaman! Bu quvonchli kunni birga nishonlaylik.": "You are invited to my birthday! Let's celebrate this joyful day together.",
    "Sizning tashrifingiz bayramimga alohida fayz baxsh etadi. Kelishingizni intiqlik bilan kutaman!": "Your presence will make my celebration truly special. Can't wait to see you!",
    "Nikoh marosimi": "Nikah ceremony",
    "Nikoh to'yi": "Wedding",
    "Pastga suring": "Scroll down",
    "Pastga tushuring": "Scroll down",
    "To'yga qoldi": "Until the wedding",
    "Har lahzani sanayapmiz": "We are counting every moment",
    "Marosim tartibi": "Programme of the day",
    "Sana": "Date",
    "Vaqti": "Time",
    "Manzil": "Address",
    "Mehmonlar kutib olinadi": "Welcoming guests",
    "Hurmat ila": "With warm regards",
    "Kun": "Days",
    "Soat": "Hours",
    "Daqiqa": "Minutes",
    "Soniya": "Seconds",
    "Bismillahir Rohmanir Rohiym": "Bismillahir Rahmanir Rahim",
    "Mehmonlarni kutib olish": "Welcoming guests",
    "Ziyofat boshlanishi": "Dinner begins",
    "Milliy taomlar": "Traditional dishes",
    "Raqs va davra": "Dancing and celebration",
    "Biz": "Us",
    "Kelin va Kuyov": "Bride and Groom",
    "Kelin va kuyov": "Bride and groom",
    "Bizning baxtimiz": "Our happiness",
    "Baxtli kunimizgacha": "Until our happy day",
    "To'y manzili": "Wedding venue",
    "To'y maskani": "Wedding venue",
    "Xaritada ko'rish": "View on map",
    "Yo'nalishni ko'rish": "Get directions",
    "Xaritada ochish": "Open in maps",
    "Bizning lahzalarimiz": "Our moments",
    "Galereya": "Gallery",
    "Sizni kutamiz": "We look forward to seeing you",
    "Biz bilan birga bo'ling": "Celebrate with us",
    "Sizni intiqlik bilan kutamiz": "We can't wait to see you",
    "Sizni kutib qolamiz": "We look forward to seeing you",
    "Aziz mehmonlar": "Dear guests",
    "Aziz mehmon!": "Dear guest!",
    "Aziz mehmon": "Dear guest",
    "Baxtli kunimizga xush kelibsiz": "Welcome to our happy day",
    "To'yga qolgan vaqt": "Time left until the wedding",
    "Taklifnomani ochish uchun bosing": "Tap to open the invitation",
    "Taklifnomani ochish": "Open invitation",
    "Marosim dasturi": "Programme",
    "Bayram dasturi": "Festive programme",
    "Bayram davom etadi": "The celebration continues",
    "Banket": "Banquet",
    "Visol oqshomi": "Evening reception",
    "To'yona uchun": "For a gift",
    "Nusxa olish": "Copy",
    "Karta raqami nusxalandi ✓": "Card number copied ✓",
    "To'y marosimi": "Wedding ceremony",
    "Tilaklar": "Wishes",
    "Tilak yuborish": "Send a wish",
    "Tahrirlash": "Edit",
    "O'chirish": "Delete",
    "Saqlash": "Save",
    "Bekor qilish": "Cancel",
    "Tilak o'chirilsinmi?": "Delete this wish?",
    "Tilagingiz yangilandi ✓": "Your wish has been updated ✓",
    "Tilak o'chirildi": "Wish deleted",
    "Aziz va qadrdon insonimiz!": "Our dear and cherished guest!",
    "Sizlarga o'zlaringizdan, ular bilan orom topishingiz uchun juftlar yaratgani va oralaringizga muhabbat hamda rahmat solib qo'ygani ham Uning oyatlaridandir.": "And among His signs is that He created for you spouses from among yourselves, so that you may find tranquillity in them, and He placed between you love and mercy.",
    "Rum surasi, 21-oyat": "Surah Ar-Rum, verse 21",
    "Bir umr birga bo'lish yo'lida qadam qo'yayotganimizda, sizning ishtirokingiz biz uchun eng katta baxt.": "As we take our first step towards a life together, having you with us would be our greatest joy.",
    "Sizni o'zimiz uchun juda muhim bo'lgan ushbu baxtli kunimizda yonimizda ko'rishdan behad xursand bo'lamiz. Kelishingizni intiqlik bilan kutamiz.": "We would be delighted to have you beside us on this very special and happy day. We look forward to seeing you.",
    "Ali va Valiya oilalari": "The families of Ali and Valiya",
    "Ismingiz": "Your name",
    "Yosh oilaga tilagingiz...": "Your wish for the newlyweds...",
    "Birinchi bo'lib tilak qoldiring 💐": "Be the first to leave a wish 💐",
    "Ism va tilak yozing": "Please enter your name and a wish",
    "Rahmat! Tilagingiz qo'shildi 💐": "Thank you! Your wish has been added 💐",
    "Xatolik": "Error",
    "Ulanishda xatolik": "Connection error",
    "Namunada tilak yuborilmaydi — haqiqiy taklifnomada ishlaydi.": "Wishes can't be sent in the demo — it works in a real invitation.",
    "Baxtli bo'linglar! 💐": "Be happy! 💐",
    "To'yingiz muborak bo'lsin!": "Congratulations on your wedding!",
    "Siz to'yimizga taklif etilgansiz": "You are invited to our wedding",
    "Siz to'yimizga taklif qilingansiz": "You are invited to our wedding",
    "Baxtli va totuv umr tilaymiz": "Wishing you a happy and harmonious life",
    "Muhabbat bog'i": "Garden of love",
    "Muhabbat ila": "With love",
    "Mehr ila": "With warmth",
    "Bizning hikoyamiz": "Our story",
    "Bizning sevgimiz": "Our love",
    "Baxtli bo'ling": "Be happy",
    "Umringiz uzoq bo'lsin": "May you live a long life",
    "Nahorgi osh": "Morning Osh",
    "Boshlanishi": "Starts at",
    "Osh kuni": "Day of the osh",
    "Oshga qolgan vaqt": "Time left until the osh",
    "Osh manzili": "Venue",
    "Ma'ruza": "Sermon",
    "Osh tortish va taomlanish": "Serving of osh and meal",
    "Dasturxonimiz Siz bilan fayzli bo'ladi": "Our table will be blessed by your presence",
    "Sizni premyeraga taklif qilamiz": "You are invited to the premiere",
    "Seansni boshlash": "Start the show",
    "Premyera": "Premiere",
    "Bosh rollarda": "Starring",
    "Aziz tomoshabin": "Dear viewer",
    "Kadrlar": "Stills",
    "Seanslar jadvali": "Showtimes",
    "Premyeragacha": "Until the premiere",
    "Taklif chiptasi": "Invitation ticket",
    "Film": "Film",
    "Seans": "Show",
    "Kinoteatr": "Cinema",
    "Qator · Joy": "Row · Seat",
    "Aziz mehmon · Eng hurmatli": "Dear guest · Guest of honour",
    "Kirish": "Entrance",
    "Chiptani yirting →": "Tear the ticket →",
    "Yandex Xarita": "Yandex Maps",

    "Kalendarga qo'shish": "Add to calendar",
    "Telefon taqvimiga": "Phone calendar",
    "Fayl yuklanadi — uni bosib oching": "A file will download — open it",
    "Google Taqvim": "Google Calendar",
    "Sizning stolingiz": "Your table",
    "Eng baxtli kun": "The happiest day",
    "endi bir umr birga": "together forever now",
    "Uchrashuvimiz": "Our date",
    "Seni kutaman": "I'll be waiting for you",
    "Uchrashuv joyi": "Meeting place",
    "Senga maktubim": "My letter to you",
    "Seni sevaman": "I love you",
    "Xushxabar": "Happy news",
    "Endi biz uchtamiz": "Now there are three of us",
    "Farzandimiz dunyoga kelishiga": "Until our baby arrives",
    "qoldi": "to go",
    "Birinchi suratimiz": "Our first photo",
    "Sizga xatim": "My letter to you",
    "Sizni sevaman": "I love you",
    "Kechirganing uchun rahmat": "Thank you for forgiving me",
    "endi hammasi yaxshi bo'ladi": "everything will be fine now",
    "Kinoteatr manzili": "Cinema address",
    "Tomoshabinlar fikri": "Audience reviews",
    "...va ular baxtli yashadilar": "...and they lived happily ever after",
    "Kitobni ochish uchun bosing": "Tap to open the book",
    "Varaqlash uchun suring": "Swipe to turn the page",
    "Barcha tilaklar": "All wishes",
    "Konvertni ochish uchun bosing": "Tap to open the envelope",
    "Nikoh marosimiga xush kelibsiz": "Welcome to our Nikah ceremony",
    "Sanani ochish uchun qiring": "Scratch to reveal the date",
    "Kuni": "Day",
    "Oyi": "Month",
    "Yili": "Year",
    "Sizni nikoh marosimimizga taklif qilamiz": "We invite you to our Nikah ceremony",
    "va": "and",
    "Aziz do'stlar va yaqinlar": "Dear friends and family",
    "Va sizlarni juft-juft qilib yaratdik": "And We created you in pairs",
    "Naba surasi, 8-oyat": "Surah An-Naba, verse 8",
    "Bayram boshlanishiga": "Until the celebration begins",
    "Kelin-kuyovning kirib kelishi": "Entrance of the bride and groom",
    "Nikoh duosi": "Nikah blessing",
    "Farzandlarimizning nikoh to'yi munosabati bilan beriladigan nahorgi oshimizga Sizni lutfan taklif etamiz.": "We kindly invite you to our morning osh held in honour of our children's wedding.",
    "Sizni to'yimizga taklif etamiz": "We invite you to our wedding",
    "\"Sizlarga o'zlaringizdan, ular bilan orom topishingiz uchun juftlar yaratgani va oralaringizga muhabbat hamda rahmat solib qo'ygani ham Uning oyatlaridandir.\"": "“And among His signs is that He created for you spouses from among yourselves, so that you may find tranquillity in them, and He placed between you love and mercy.”",
    "Sizni hayotimizning eng quvonchli kunida aziz mehmonimiz bo'lishga taklif etamiz.": "We invite you to be our dear guest on the happiest day of our lives.",
    "Ochish": "Open",
    "Joylashuv": "Location",
    "Xush kelibsiz": "Welcome",
    "Tilaklaringizni qoldiring": "Leave your wishes",
    "Kalendarga saqlash": "Add to calendar",
    "Suratlarni barmoq bilan suring": "Swipe through the photos",
    "Senga aytmoqchi bo'lgan gapim bor…": "There's something I want to tell you…",
    "Yurakni bosib tur": "Press and hold the heart",
    "Bu sahifa faqat sen uchun": "This page is just for you",
    "Sevgi maktubi": "A love letter",
    "Seni sevuvchi": "With all my love",
    "Senga aytmoqchi bo'lganlarim": "Everything I wanted to tell you",
    "Ovozni yoqish": "Turn on sound",
    "Shu kuni, shu soatda": "On this day, at this hour",
    "Uchrashuvgacha": "Until we meet",
    "Seni birinchi ko'rgan kunimdan beri hayotim butunlay o'zgardi. Har kuni seni o'ylab uyg'onaman va seni o'ylab uxlayman. Bugun yuragimdagini senga aytishga qaror qildim: men seni sevaman.": "Since the day I first saw you, my life has completely changed. Every day I wake up thinking of you and fall asleep thinking of you. Today I decided to tell you what is in my heart: I love you.",
    "Osmonga qarang…": "Look up at the sky…",
    "Shouni boshlash": "Start the show",
    "O'tkazib yuborish": "Skip"
  };
  // Statik iboralar: uz -> tr (kalitlar PH bilan bir xil)
  var TRD = {
    "Taklifnoma": "Davetiye",
    "Chiroqlarni yoqish uchun bosing": "Işıkları yakmak için dokunun",
    "Sunnat to'yiga taklifnoma": "Sünnet düğünü davetiyesi",
    "Bizning botirlarimiz": "Küçük kahramanlarımız",
    "Bizning botirimiz": "Küçük kahramanımız",
    "Farzandimizning sunnat to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "Oğlumuzun sünnet düğünü vesilesiyle kuracağımız sofraya sizleri de bekliyoruz.",
    "Sunnat to'yi kuni": "Sünnet düğünü günü",
    "To'ygacha qolgan vaqt": "Düğüne kalan süre",
    "Farzandlarimizning sunnat to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "Oğullarımızın sünnet düğünü vesilesiyle kuracağımız sofraya sizleri de bekliyoruz.",
    "Sizning tashrifingiz bu quvonchli kunimizga alohida fayz baxsh etadi. Kelishingizni intiqlik bilan kutamiz.": "Varlığınız bu mutlu günümüze ayrı bir neşe katacak. Gelişinizi sabırsızlıkla bekliyoruz.",
    "Ota-onalari": "Anne ve babaları",
    "Qizimizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "Kızımızın beşik töreni vesilesiyle kuracağımız sofraya sizleri de bekliyoruz.",
    "Egizak qizlarimizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "İkiz kızlarımızın beşik töreni vesilesiyle kuracağımız sofraya sizleri de bekliyoruz.",
    "O'g'limizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "Oğlumuzun beşik töreni vesilesiyle kuracağımız sofraya sizleri de bekliyoruz.",
    "Egizak o'g'illarimizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "İkiz oğullarımızın beşik töreni vesilesiyle kuracağımız sofraya sizleri de bekliyoruz.",
    "Egizaklarimiz — qizimiz va o'g'limizning beshik to'yi munosabati bilan yoziladigan dasturxonimizga Sizni lutfan taklif etamiz.": "İkizlerimizin — kızımızın ve oğlumuzun — beşik töreni vesilesiyle kuracağımız sofraya sizleri de bekliyoruz.",
    "Farzandimizga beshik to'yi muborak bo'lsin! Sizning tashrifingiz va duolaringiz bu quvonchli kunimizga alohida fayz baxsh etadi.": "Yavrumuzun beşik töreni kutlu olsun! Varlığınız ve dualarınız bu mutlu günümüze ayrı bir bereket katacak.",
    "Farzandlarimizga beshik to'yi muborak bo'lsin! Sizning tashrifingiz va duolaringiz bu quvonchli kunimizga alohida fayz baxsh etadi.": "Yavrularımızın beşik töreni kutlu olsun! Varlığınız ve dualarınız bu mutlu günümüze ayrı bir bereket katacak.",
    "Ota-onasi": "Anne ve babası",
    "Beshikka belash marosimi": "Beşiğe yatırma töreni",
    "Bayram dasturxoni": "Bayram sofrası",
    "Tilaklar va duo": "Dilekler ve dualar",
    "Qiz bazmi": "Kına gecesi",
    "Qiz bazmiga taklifnoma": "Kına gecesi davetiyesi",
    "Aziz dugonam": "Sevgili arkadaşım",
    "Aziz mehmonim": "Değerli misafirim",
    "Sevgi ila": "Sevgiyle",
    "Lahzalar": "Anlar",
    "Bazm kuni": "Eğlence günü",
    "Liboslar": "Kıyafetler",
    "Bazmga quyidagi liboslarda kelishingizni so'raymiz": "Eğlenceye şu renklerde kıyafetlerle gelmenizi rica ederiz",
    "Bazmga qolgan vaqt": "Eğlenceye kalan süre",
    "Hayotimning yangi sahifasi oldidan eng yaqin insonlarim bilan birga bo'lishni istayman.": "Hayatımın yeni sayfası açılmadan önce en yakınlarımla birlikte olmak istiyorum.",
    "Qiz bazmimga Sizni chin dildan taklif etaman. Kelishingiz men uchun katta quvonch bo'ladi.": "Kına geceme sizi içtenlikle davet ediyorum. Gelmeniz beni çok mutlu edecek.",
    "Ochish uchun bosing": "Açmak için dokunun",
    "Siz taklifnoma oldingiz": "Bir davetiyeniz var",
    "Ochish uchun suring →": "Açmak için kaydırın →",
    "Yurakni bosing": "Kalbe dokunun",
    "To'y kuni": "Düğün günü",
    "Nikoh to'yiga taklif etamiz": "Düğünümüze davetlisiniz",
    "Nikoh to'yiga taklifnoma": "Düğün davetiyesi",
    "Tug'ilgan kunga taklifnoma": "Doğum günü davetiyesi",
    "Tug'ilgan kuning muborak!": "İyi ki doğdun!",
    "Xotiralar": "Anılar",
    "Sevgi bilan": "Sevgiyle",
    "Shamlarni puflang": "Mumları üfleyin",
    "Bosib turing": "Basılı tutun",
    "Orzu qiling!": "Bir dilek tut!",
    "Do'stlar tilaklari": "Arkadaşlardan dilekler",
    "Tabrik": "Tebrik",
    "Tug'ilgan kun egasiga tilagingiz...": "Doğum günü sahibine dileğiniz...",
    "Tug'ilgan kuning muborak bo'lsin! Hayoting doim quvonch, sog'liq va omadga to'la bo'lsin. Barcha orzularing ushalsin!": "Doğum günün kutlu olsun! Hayatın hep neşe, sağlık ve şansla dolu olsun. Tüm hayallerin gerçek olsun!",
    "Bayram dasturi": "Program",
    "Bayramgacha qolgan vaqt": "Kutlamaya kalan süre",
    "Sizni intiqlik bilan kutaman": "Sizi sabırsızlıkla bekliyorum",
    "Bayram joyi": "Kutlama yeri",
    "Tort kesish": "Pasta kesimi",
    "O'yinlar va raqslar": "Oyunlar ve dans",
    "Sovg'alar va tilaklar": "Hediyeler ve dilekler",
    "Sharni bosing": "Balona dokunun",
    "Mening tug'ilgan kunimga Sizni taklif qilaman! Bu quvonchli kunni birga nishonlaylik.": "Doğum günüme davetlisiniz! Bu mutlu günü birlikte kutlayalım.",
    "Sizning tashrifingiz bayramimga alohida fayz baxsh etadi. Kelishingizni intiqlik bilan kutaman!": "Gelişiniz kutlamama ayrı bir neşe katacak. Sizi sabırsızlıkla bekliyorum!",
    "Nikoh marosimi": "Nikah töreni",
    "Nikoh to'yi": "Düğün",
    "Pastga suring": "Aşağı kaydırın",
    "Pastga tushuring": "Aşağı kaydırın",
    "To'yga qoldi": "Düğüne kalan",
    "Har lahzani sanayapmiz": "Her anı sayıyoruz",
    "Marosim tartibi": "Günün programı",
    "Sana": "Tarih",
    "Vaqti": "Saat",
    "Manzil": "Adres",
    "Mehmonlar kutib olinadi": "Misafir kabulü",
    "Hurmat ila": "Saygılarımızla",
    "Kun": "Gün",
    "Soat": "Saat",
    "Daqiqa": "Dakika",
    "Soniya": "Saniye",
    "Bismillahir Rohmanir Rohiym": "Bismillahirrahmanirrahim",
    "Mehmonlarni kutib olish": "Misafir kabulü",
    "Ziyofat boshlanishi": "Yemek ikramı",
    "Milliy taomlar": "Geleneksel lezzetler",
    "Raqs va davra": "Dans ve eğlence",
    "Biz": "Biz",
    "Kelin va Kuyov": "Gelin ve Damat",
    "Kelin va kuyov": "Gelin ve damat",
    "Bizning baxtimiz": "Mutluluğumuz",
    "Baxtli kunimizgacha": "Mutlu günümüze kalan",
    "To'y manzili": "Düğün yeri",
    "To'y maskani": "Düğün yeri",
    "Xaritada ko'rish": "Haritada gör",
    "Yo'nalishni ko'rish": "Yol tarifi al",
    "Xaritada ochish": "Haritada aç",
    "Bizning lahzalarimiz": "Anlarımız",
    "Galereya": "Galeri",
    "Sizni kutamiz": "Sizi bekliyoruz",
    "Biz bilan birga bo'ling": "Bu mutluluğu bizimle paylaşın",
    "Sizni intiqlik bilan kutamiz": "Sizi sabırsızlıkla bekliyoruz",
    "Sizni kutib qolamiz": "Sizi bekliyoruz",
    "Aziz mehmonlar": "Değerli misafirlerimiz",
    "Aziz mehmon!": "Değerli misafirimiz!",
    "Aziz mehmon": "Değerli misafirimiz",
    "Baxtli kunimizga xush kelibsiz": "Mutlu günümüze hoş geldiniz",
    "To'yga qolgan vaqt": "Düğüne kalan süre",
    "Taklifnomani ochish uchun bosing": "Davetiyeyi açmak için dokunun",
    "Taklifnomani ochish": "Davetiyeyi aç",
    "Marosim dasturi": "Program",
    "Bayram davom etadi": "Eğlence devam ediyor",
    "Banket": "Ziyafet",
    "Visol oqshomi": "Düğün gecesi",
    "To'yona uchun": "Takı ve hediye için",
    "Nusxa olish": "Kopyala",
    "Karta raqami nusxalandi ✓": "Kart numarası kopyalandı ✓",
    "To'y marosimi": "Düğün töreni",
    "Tilaklar": "Dilekler",
    "Tilak yuborish": "Dilek gönder",
    "Tahrirlash": "Düzenle",
    "O'chirish": "Sil",
    "Saqlash": "Kaydet",
    "Bekor qilish": "Vazgeç",
    "Tilak o'chirilsinmi?": "Bu dilek silinsin mi?",
    "Tilagingiz yangilandi ✓": "Dileğiniz güncellendi ✓",
    "Tilak o'chirildi": "Dilek silindi",
    "Aziz va qadrdon insonimiz!": "Sevgili ve kıymetli misafirimiz!",
    "Sizlarga o'zlaringizdan, ular bilan orom topishingiz uchun juftlar yaratgani va oralaringizga muhabbat hamda rahmat solib qo'ygani ham Uning oyatlaridandir.": "Kendileriyle huzura kavuşasınız diye size kendi türünüzden eşler yaratması ve aranızda sevgi ve merhamet var etmesi de O'nun varlığının delillerindendir.",
    "Rum surasi, 21-oyat": "Rum suresi, 21. ayet",
    "Bir umr birga bo'lish yo'lida qadam qo'yayotganimizda, sizning ishtirokingiz biz uchun eng katta baxt.": "Bir ömür sürecek yolculuğumuza ilk adımı atarken yanımızda olmanız bizim için en büyük mutluluk.",
    "Sizni o'zimiz uchun juda muhim bo'lgan ushbu baxtli kunimizda yonimizda ko'rishdan behad xursand bo'lamiz. Kelishingizni intiqlik bilan kutamiz.": "Bizim için çok özel olan bu mutlu günümüzde sizi yanımızda görmekten büyük sevinç duyarız. Gelişinizi sabırsızlıkla bekliyoruz.",
    "Ali va Valiya oilalari": "Ali ve Valiya aileleri",
    "Ismingiz": "Adınız",
    "Yosh oilaga tilagingiz...": "Yeni çifte dileğiniz...",
    "Birinchi bo'lib tilak qoldiring 💐": "İlk dileği siz bırakın 💐",
    "Ism va tilak yozing": "Adınızı ve dileğinizi yazın",
    "Rahmat! Tilagingiz qo'shildi 💐": "Teşekkürler! Dileğiniz eklendi 💐",
    "Xatolik": "Hata",
    "Ulanishda xatolik": "Bağlantı hatası",
    "Namunada tilak yuborilmaydi — haqiqiy taklifnomada ishlaydi.": "Örnekte dilek gönderilemez — gerçek davetiyede çalışır.",
    "Baxtli bo'linglar! 💐": "Bir ömür mutlu olun! 💐",
    "To'yingiz muborak bo'lsin!": "Mutluluklar dileriz!",
    "Siz to'yimizga taklif etilgansiz": "Düğünümüze davetlisiniz",
    "Siz to'yimizga taklif qilingansiz": "Düğünümüze davetlisiniz",
    "Baxtli va totuv umr tilaymiz": "Mutlu ve huzurlu bir ömür dileriz",
    "Muhabbat bog'i": "Aşk bahçesi",
    "Muhabbat ila": "Sevgiyle",
    "Mehr ila": "Sevgiyle",
    "Bizning hikoyamiz": "Hikâyemiz",
    "Bizning sevgimiz": "Aşkımız",
    "Baxtli bo'ling": "Mutlu olun",
    "Umringiz uzoq bo'lsin": "Ömrünüz uzun olsun",
    "Nahorgi osh": "Sabah pilavı",
    "Boshlanishi": "Başlangıç",
    "Osh kuni": "Pilav günü",
    "Oshga qolgan vaqt": "Pilava kalan süre",
    "Osh manzili": "Adres",
    "Ma'ruza": "Sohbet",
    "Osh tortish va taomlanish": "Pilav ikramı",
    "Dasturxonimiz Siz bilan fayzli bo'ladi": "Soframız sizinle bereketlenecek",
    "Sizni premyeraga taklif qilamiz": "Sizi galamıza davet ediyoruz",
    "Seansni boshlash": "Gösterimi başlat",
    "Premyera": "Gala",
    "Bosh rollarda": "Başrollerde",
    "Aziz tomoshabin": "Sevgili izleyici",
    "Kadrlar": "Kareler",
    "Seanslar jadvali": "Seans programı",
    "Premyeragacha": "Galaya kalan",
    "Taklif chiptasi": "Davet bileti",
    "Film": "Film",
    "Seans": "Seans",
    "Kinoteatr": "Sinema",
    "Qator · Joy": "Sıra · Koltuk",
    "Aziz mehmon · Eng hurmatli": "Değerli misafir · Onur konuğu",
    "Kirish": "Giriş",
    "Chiptani yirting →": "Bileti yırtın →",
    "Yandex Xarita": "Yandex Haritalar",
    "Kalendarga qo'shish": "Takvime ekle",
    "Telefon taqvimiga": "Telefon takvimine",
    "Fayl yuklanadi — uni bosib oching": "Bir dosya inecek — dokunup açın",
    "Google Taqvim": "Google Takvim",
    "Sizning stolingiz": "Masanız",
    "Eng baxtli kun": "En mutlu gün",
    "endi bir umr birga": "artık bir ömür birlikte",
    "Uchrashuvimiz": "Buluşmamız",
    "Seni kutaman": "Seni bekliyorum",
    "Uchrashuv joyi": "Buluşma yeri",
    "Senga maktubim": "Sana mektubum",
    "Seni sevaman": "Seni seviyorum",
    "Xushxabar": "Müjde",
    "Endi biz uchtamiz": "Artık üç kişiyiz",
    "Farzandimiz dunyoga kelishiga": "Bebeğimizin gelmesine",
    "qoldi": "kaldı",
    "Birinchi suratimiz": "İlk fotoğrafımız",
    "Sizga xatim": "Size mektubum",
    "Sizni sevaman": "Sizi seviyorum",
    "Kechirganing uchun rahmat": "Affettiğin için teşekkürler",
    "endi hammasi yaxshi bo'ladi": "artık her şey güzel olacak",
    "Kinoteatr manzili": "Sinema adresi",
    "Tomoshabinlar fikri": "İzleyici yorumları",
    "...va ular baxtli yashadilar": "...ve sonsuza dek mutlu yaşadılar",
    "Kitobni ochish uchun bosing": "Kitabı açmak için dokunun",
    "Varaqlash uchun suring": "Sayfa çevirmek için kaydırın",
    "Barcha tilaklar": "Tüm dilekler",
    "Konvertni ochish uchun bosing": "Zarfı açmak için dokunun",
    "Nikoh marosimiga xush kelibsiz": "Nikah törenimize hoş geldiniz",
    "Sanani ochish uchun qiring": "Tarihi görmek için kazıyın",
    "Kuni": "Gün",
    "Oyi": "Ay",
    "Yili": "Yıl",
    "Sizni nikoh marosimimizga taklif qilamiz": "Sizi nikah törenimize davet ediyoruz",
    "va": "ve",
    "Aziz do'stlar va yaqinlar": "Sevgili dostlar ve yakınlarımız",
    "Va sizlarni juft-juft qilib yaratdik": "Ve sizi çift çift yarattık",
    "Naba surasi, 8-oyat": "Nebe suresi, 8. ayet",
    "Bayram boshlanishiga": "Kutlamanın başlamasına",
    "Kelin-kuyovning kirib kelishi": "Gelin ve damadın girişi",
    "Nikoh duosi": "Nikah duası",
    "Farzandlarimizning nikoh to'yi munosabati bilan beriladigan nahorgi oshimizga Sizni lutfan taklif etamiz.": "Çocuklarımızın düğünü vesilesiyle vereceğimiz sabah pilavına sizi de davet ediyoruz.",
    "Sizni to'yimizga taklif etamiz": "Sizi düğünümüze davet ediyoruz",
    "\"Sizlarga o'zlaringizdan, ular bilan orom topishingiz uchun juftlar yaratgani va oralaringizga muhabbat hamda rahmat solib qo'ygani ham Uning oyatlaridandir.\"": "“Kendileriyle huzura kavuşasınız diye size kendi türünüzden eşler yaratması ve aranızda sevgi ve merhamet var etmesi de O'nun varlığının delillerindendir.”",
    "Sizni hayotimizning eng quvonchli kunida aziz mehmonimiz bo'lishga taklif etamiz.": "Hayatımızın en mutlu gününde sizi değerli misafirimiz olarak aramızda görmek istiyoruz.",
    "Ochish": "Aç",
    "Joylashuv": "Konum",
    "Xush kelibsiz": "Hoş geldiniz",
    "Tilaklaringizni qoldiring": "Dileklerinizi bırakın",
    "Kalendarga saqlash": "Takvime kaydet",
    "Suratlarni barmoq bilan suring": "Fotoğrafları parmağınızla kaydırın",
    "Senga aytmoqchi bo'lgan gapim bor…": "Sana söylemek istediğim bir şey var…",
    "Yurakni bosib tur": "Kalbe basılı tut",
    "Bu sahifa faqat sen uchun": "Bu sayfa sadece senin için",
    "Sevgi maktubi": "Aşk mektubu",
    "Seni sevuvchi": "Seni seven",
    "Senga aytmoqchi bo'lganlarim": "Sana söylemek istediklerim",
    "Ovozni yoqish": "Sesi aç",
    "Shu kuni, shu soatda": "Bu gün, bu saatte",
    "Uchrashuvgacha": "Buluşmaya kalan",
    "Seni birinchi ko'rgan kunimdan beri hayotim butunlay o'zgardi. Har kuni seni o'ylab uyg'onaman va seni o'ylab uxlayman. Bugun yuragimdagini senga aytishga qaror qildim: men seni sevaman.": "Seni ilk gördüğüm günden beri hayatım tamamen değişti. Her sabah seni düşünerek uyanıyor, her gece seni düşünerek uyuyorum. Bugün kalbimdekini sana söylemeye karar verdim: seni seviyorum.",
    "Osmonga qarang…": "Gökyüzüne bakın…",
    "Shouni boshlash": "Gösteriyi başlat",
    "O'tkazib yuborish": "Geç",
    "Hayotimizdagi eng baxtli kunni Siz — aziz mehmonimiz bilan birga nishonlashni orzu qilamiz.": "Hayatımızın en mutlu gününü siz değerli misafirimizle birlikte kutlamayı diliyoruz.",
    "Sizning tashrifingiz bu quvonchli kunimizga alohida fayz va tabarruk baxsh etadi. Kelishingizni intiqlik bilan kutamiz.": "Varlığınız bu mutlu günümüze ayrı bir sıcaklık ve bereket katacak. Gelişinizi sabırsızlıkla bekliyoruz.",
    "Kuyov va kelin oilalari": "Gelin ve damat aileleri",
    "Choy va suhbat": "Çay ve sohbet",
    "Tabriklar": "Tebrikler",
    "Kelin-kuyov tabriklari": "Gelin ve damadı tebrik",
    "Sunnat to'yi tabriklari": "Sünnet tebrikleri",
    "Yakun": "Kapanış",
    "Ziyofat": "Ziyafet",
    "Raqs": "Dans",
    "Bayram tabriklari": "Tebrikler"
  };
  // Standart matnlar (mijoz o'zgartirmagan bo'lsa) — har tilda
  DEF.lead_kk = "Өміріміздегі ең бақытты күнді Сізбен — қадірлі қонағымызбен бірге атап өтуді армандаймыз.";
  DEF.msg_kk = "Сіздің келуіңіз осы қуанышты күнімізге ерекше шуақ пен береке сыйлайды. Келуіңізді асыға күтеміз.";
  DEF.fam_kk = "Күйеу жігіт пен қалыңдықтың отбасылары";
  DEF.lead_en = "We dream of sharing the happiest day of our lives with you — our dear guest.";
  DEF.msg_en = "Your presence will bring special warmth and blessing to our joyful day. We look forward to seeing you.";
  DEF.fam_en = "The families of the groom and bride";
  DEF.lead_tr = "Hayatımızın en mutlu gününü siz değerli misafirimizle birlikte kutlamayı diliyoruz.";
  DEF.msg_tr = "Varlığınız bu mutlu günümüze ayrı bir sıcaklık ve bereket katacak. Gelişinizi sabırsızlıkla bekliyoruz.";
  DEF.fam_tr = "Gelin ve damat aileleri";
  // Sana/vaqt qoliplari: {d} kun, {M} oy, {y} yil, {dw} hafta kuni, {t} vaqt
  var FMT = {
    uz: { date: "{d}-{M}, {y}-yil", hero: "{d}-{M} · {y}", day: "{dw} kuni", time: "Soat {t} da" },
    ru: { date: "{d} {M} {y} г.",    hero: "{d} {M} · {y}", day: "{dw}",      time: "в {t}" },
    kk: { date: "{d} {M} {y} ж.",    hero: "{d} {M} · {y}", day: "{dw}",      time: "Сағат {t}" },
    en: { date: "{M} {d}, {y}",      hero: "{d} {M} · {y}", day: "{dw}",      time: "at {t}" },
    tr: { date: "{d} {M} {y}",       hero: "{d} {M} · {y}", day: "{dw}",      time: "Saat {t}" }
  };
  var ALL_LANGS = ["uz", "ru", "kk", "en", "tr"], LANG_LABEL = { uz: "UZ", ru: "RU", kk: "ҚАЗ", en: "EN", tr: "TR" };
  var DICT = { ru: PH, kk: KKD, en: END, tr: TRD };
  // Shablon o'z tarjimalarini qo'shishi mumkin (window.__XLANG__ — masalan, sunnat to'yi qozoqchasi): umumiy lug'at ustiga yoziladi.
  // { code:"kk", label:"ҚАЗ", isDefault:true, L:{months,monthsNom,days,daysShort}, fmt:{date,hero,day,time}, dict:{ "o'zbekcha matn": "tarjima" } }
  var XL = (window.__XLANG__ && window.__XLANG__.code && window.__XLANG__.dict) ? window.__XLANG__ : null;
  if (XL) {
    if (XL.L) L[XL.code] = XL.L;
    var _xd = {}, _xk; for (_xk in (DICT[XL.code] || {})) _xd[_xk] = DICT[XL.code][_xk]; for (_xk in XL.dict) _xd[_xk] = XL.dict[_xk];
    DICT[XL.code] = _xd;
    if (XL.fmt) { var _xf = {}; for (_xk in (FMT[XL.code] || {})) _xf[_xk] = FMT[XL.code][_xk]; for (_xk in XL.fmt) _xf[_xk] = XL.fmt[_xk]; FMT[XL.code] = _xf; }
    if (XL.label) LANG_LABEL[XL.code] = XL.label;
    if (ALL_LANGS.indexOf(XL.code) < 0) ALL_LANGS.push(XL.code);
  }
  // Shu taklifnomaning tillari: INV.langs = ["kk","ru"] (birinchisi — asosiy til). Berilmagan bo'lsa — avvalgidek: UZ + RU
  // (sunnat to'yi shablonida: ҚАЗ + UZ + RU, asosiysi qozoqcha).
  var LANGS = (function(){
    var a = [], src = Array.isArray(INV.langs) ? INV.langs : [];
    src.forEach(function(c){ c = String(c).toLowerCase(); if (ALL_LANGS.indexOf(c) >= 0 && L[c] && a.indexOf(c) < 0) a.push(c); });
    if (!a.length) a = XL ? (XL.isDefault ? [XL.code, "uz", "ru"] : ["uz", "ru", XL.code]) : ["uz", "ru"];
    return a;
  })();
  window.__INV_MONTHS__ = { uz: L.uz.monthsNom, ru: L.ru.monthsNom, kk: L.kk.monthsNom, en: L.en.monthsNom, tr: L.tr.monthsNom };
  function dictOf(lang){ return DICT[lang] || null; }
  // Berilgan tilga tarjima (lug'atda bo'lmasa — o'zbekcha asli qoladi)
  // Shu taklifnomaga xos yozuv almashtirishlari (admin bot orqali qo'yadi): INV.textMap = { uz:{ "eski":"yangi" }, ru:{ "eski (o'zbekchasi)":"yangi ruscha" } }
  // Masalan: "Nikoh marosimi" o'rniga "Baxt kechasi". Solishtirish katta-kichik harfga qaramaydi.
  var TMAP = { uz: {}, ru: {}, kk: {}, en: {}, tr: {} };
  (function(){ var m = INV.textMap; if (!m || typeof m !== "object") return;
    ["uz", "ru", "kk", "en", "tr"].forEach(function(l){ var o = m[l]; if (o && typeof o === "object") for (var k in o) if (typeof o[k] === "string" && o[k]) TMAP[l][String(k).trim().toLowerCase()] = o[k]; }); })();
  function tmOf(lang, s){ var o = TMAP[lang]; return o ? o[String(s).trim().toLowerCase()] : undefined; }
  function trL(lang, s){
    var c = tmOf(lang, s); if (c != null) return c;                       // shu taklifnomaning o'z matni ustuvor
    var D = dictOf(lang); return (D && D[s]) ? D[s] : s;
  }
  function hasTr(s){ return !!(PH[s] || KKD[s] || TRD[s] || tmOf("tr", s) != null || (XL && XL.dict[s]) || tmOf("uz", s) != null || tmOf("ru", s) != null || tmOf("kk", s) != null || tmOf("en", s) != null); }
  // Joriy tilga qarab statik iborani qaytaradi
  function tr(s){ return trL(LANG, s); }

  function two(n){ return (n < 10 ? "0" : "") + n; }
  function id(x){ return document.getElementById(x); }
  function set(x, v){ var el = id(x); if (el && v != null) el.textContent = v; }
  // O'zbek digraflari (Sh, Ch, Ng, O', G') to'liq bosh harf sifatida olinadi
  function initial(name){
    name = (name || "").trim();
    if (!name) return "K";
    var low = name.toLowerCase();
    var di = null;
    if (low.indexOf("sh") === 0 || low.indexOf("ch") === 0 || low.indexOf("ng") === 0) di = name.slice(0, 2);
    else if (/^[og][’'ʻ`‘]/i.test(name)) di = name.slice(0, 2);
    if (di) return di.charAt(0).toUpperCase() + di.slice(1).toLowerCase();
    return name.charAt(0).toUpperCase();
  }
  var w = new Date(INV.year, (INV.month||1)-1, INV.day, INV.hour||0, INV.minute||0, 0);

  // Tildan mustaqil
  // Qo'sho'loq to'y (ikki juft; server faqat shu imkoniyati bor dizaynlarda saqlaydi): ismlar juft-juft yoziladi —
  // kuyov o'rnida "Sardor & Madina", kelin o'rnida "Jasur & Nilufar", orasida shablonning o'z "va"si
  var QOSH = !!(INV.kuyov2 && INV.kelin2);
  var N1 = QOSH ? INV.kuyov + " & " + INV.kelin : INV.kuyov, N2 = QOSH ? INV.kuyov2 + " & " + INV.kelin2 : INV.kelin;
  if (QOSH) document.documentElement.classList.add("qosh");
  set("kuyov", N1); set("kelin", N2);
  set("venue", INV.venueName); set("address", INV.address);
  set("lkuyov", N1); set("lkelin", N2);
  set("footNames", QOSH ? N1 + " va " + N2 + " · " + INV.year : INV.kuyov + " & " + INV.kelin + " · " + INV.year);
  set("seal", initial(INV.kuyov) + " & " + initial(INV.kelin));
  document.title = QOSH ? N1 + " va " + N2 : INV.kuyov + " & " + INV.kelin;

  // Uzun ism (masalan "Muhammadaziz") tor telefonda ekrandan chiqib, gorizontal skroll bermasin:
  // bitta so'z qatorga bo'linmaydi — sig'masa shrift FAQAT kerakli miqdorda kichrayadi (oddiy ismlarda hech narsa o'zgarmaydi)
  function fitName(el){
    if (!el || !el.textContent) return;
    el.style.fontSize = "";
    var box = el.closest("section, .pg-c, .section, #card") || document.body;
    var bcs = getComputedStyle(box);
    var avail = Math.min(box.clientWidth - parseFloat(bcs.paddingLeft) - parseFloat(bcs.paddingRight), window.innerWidth - 24);
    for (var i = 0; i < 4; i++) {
      var need = getComputedStyle(el).display === "inline" ? el.getBoundingClientRect().width : el.scrollWidth;
      if (!(avail > 0) || need <= avail + 1) break;
      var fs = parseFloat(getComputedStyle(el).fontSize);
      el.style.fontSize = Math.max(fs * .5, fs * avail / need * .97).toFixed(1) + "px";
    }
  }
  // Mijoz birinchi sahifadagi sana/vaqt blokini o'chirgan bo'lsa (INV.hideDate) — faqat o'sha blok yashiriladi
  // (kalendar, taymer va yakuniy sana o'zgarmaydi). Blok: .dbox / .when / .c-when / .ed-meta, bo'lmasa — #heroDate ning o'zi.
  if (INV.hideDate) {
    var _hd = id("heroDate"), _ht = id("heroTime");
    if (_hd) {
      var _hp = _hd.parentNode;
      var _hb = _hd.closest(".dbox,.when,.c-when,.ed-meta") || ((_hp.children.length === 1 && !/^(SECTION|MAIN|BODY|HEADER)$/.test(_hp.tagName)) ? _hp : _hd);
      _hb.style.display = "none";
    }
    if (_ht) _ht.style.display = "none";
    var _mqd = id("mqDate"); if (_mqd) _mqd.style.display = "none";          // Retro kino: peshtaxtadagi sana
  }
  // Mijoz "Marosim tartibi" bo'limini o'chirgan bo'lsa (INV.hideSchedule) — bo'lim butunlay yashiriladi.
  // Bo'limda boshqa ma'lumot ham bo'lsa (kalendar, taymer, manzil...) — faqat jadval va uning sarlavhasi yashiriladi.
  if (INV.hideSchedule) {
    var _sc = id("schedule") || id("tl") || id("showtimes") || id("toc");     // tl — Oq konvert, showtimes — Retro kino, toc — Oltin kitob
    if (_sc) {
      var _ss = _sc.closest("[data-optional]") || _sc.closest("section");
      if (_ss && !_ss.querySelector("#calendar,#venue,#d,#wishWrap,#message,#kuyov,#coupleWrap")) _ss.style.display = "none";
      else {
        _sc.style.display = "none";
        // sarlavha: jadvaldan oldingi matnli element(lar) — keyingi ma'lumot blokigacha
        var _pv = _sc.previousElementSibling, _n = 0;
        while (_pv && _n < 2 && !_pv.id && !_pv.querySelector("[id]") && /^(P|H2|H3|DIV|SPAN|SVG)$/i.test(_pv.tagName)) { var _pp = _pv.previousElementSibling; _pv.style.display = "none"; _pv = _pp; _n++; }
      }
    }
  }
  function fitNames(){ ["kuyov", "kelin", "lkuyov", "lkelin", "footNames"].forEach(function(k){ fitName(id(k)); }); }
  fitNames();
  var _fitW = window.innerWidth;   // iPhone manzil satri yashirinib-chiqqanda (faqat balandlik) qayta o'lchamaydi
  window.addEventListener("resize", function(){ if (window.innerWidth !== _fitW) { _fitW = window.innerWidth; fitNames(); } });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNames).catch(function(){});

  // Fon rasmi
  var scene = id("scene");
  if (scene && INV.bg) { scene.style.backgroundImage = "url('" + INV.bg + "')"; scene.classList.add("has-img"); if (INV.ovtext) scene.setAttribute("data-ov", INV.ovtext); }

  // ---------- Til qo'llash ----------
  // Qo'shimcha tilli shablonda tanlov alohida saqlanadi (boshqa taklifnomada tanlangan til bu yerdagi standart tilni bosib ketmasin)
  // Tanlov HAR TAKLIFNOMA uchun alohida saqlanadi — boshqa taklifnomada tanlangan til bu yerdagi asosiy tilni bosib ketmaydi.
  // Mehmon shu taklifnomada tilni o'zi almashtirgan bo'lsa (va u til hali ro'yxatda bo'lsa) — o'sha ochiladi; aks holda asosiy til.
  var LANG_KEY = "invlang:" + location.pathname.replace(/\/+$/, ""), LANG_DEF = LANGS[0];
  var LANG = (function(){ var v = null; try { v = localStorage.getItem(LANG_KEY); } catch(e){} return LANGS.indexOf(v) >= 0 ? v : LANG_DEF; })();
  var m0 = (INV.month||1)-1;

  // Standart matn (mijoz o'zgartirmagan) — tanlangan tilda; mijoz o'zi yozgan matn — qanday bo'lsa shunday
  function trText(v, key, lang){
    var _c = tmOf(lang, v); if (_c != null) return _c;                    // shu taklifnomaning o'z matni (bot: matn / matnru / matnkk / matnen) ustuvor
    if (lang !== "uz" && v === DEF[key + "_uz"] && DEF[key + "_" + lang]) return DEF[key + "_" + lang];
    var _d = dictOf(lang); if (_d && v && _d[v]) return _d[v];
    return v;
  }
  function renderSchedule(lang){
    var sc = id("schedule"); if (!sc || !Array.isArray(INV.schedule)) return;
    sc.innerHTML = "";
    INV.schedule.forEach(function(it){
      var lb0 = it.label === "Banket" ? "Visol oqshomi" : it.label;
      var lbl = trL(lang, lb0);
      var row = document.createElement("div"); row.className = "sch-row";
      var t = document.createElement("span"); t.className = "sch-t"; t.textContent = it.time;
      var d = document.createElement("span"); d.className = "sch-dot";
      var l = document.createElement("span"); l.className = "sch-l"; l.textContent = lbl;
      row.appendChild(t); row.appendChild(d); row.appendChild(l); sc.appendChild(row);
    });
  }
  function renderCalendar(lang){
    var cal = id("calendar"); if (!cal) return;
    var first = new Date(INV.year, m0, 1).getDay(), dim = new Date(INV.year, m0+1, 0).getDate();
    var DS = L[lang].daysShort;
    var h = '<div class="cal-head">' + L[lang].monthsNom[m0] + ', ' + INV.year + '</div><div class="cal-grid">';
    for (var wi = 0; wi < 7; wi++) h += '<span class="cal-wd">' + DS[wi] + '</span>';
    for (var fi = 0; fi < first; fi++) h += '<span></span>';
    for (var dd = 1; dd <= dim; dd++) h += '<span class="cal-day' + (dd === INV.day ? ' cal-sel' : '') + '">' + dd + '</span>';
    cal.innerHTML = h + '</div>';
  }
  function translateStatic(lang){
    document.querySelectorAll(".cov-pre,.cov-hint,.lock-pre,.lock-text,.fold-pre,.fold-hint,.wd,.pre,.lbl,.sign,.card-i .k,.card-i .sub,.ayah-tr,.ayah-ref,.count .u,.bism,.eyebrow,.welcome,.g3d-hint,.hero-title,.b-pre,.cd-m,.foot-tx,.stol-l").forEach(function(el){
      if (el.id) return;
      if (el.dataset.uz === undefined) el.dataset.uz = el.textContent.trim();
      var uz = el.dataset.uz;
      el.textContent = trL(lang, uz);
    });
    // "Pastga suring" / "Pastga tushuring" — .scrolld ichida chev bor, faqat matn tuguni
    document.querySelectorAll(".scrolld").forEach(function(el){
      var node = el.firstChild;
      if (node && node.nodeType === 3) {
        if (el.dataset.uz === undefined) el.dataset.uz = node.nodeValue.trim();
        node.nodeValue = trL(lang, el.dataset.uz);
      }
    });
    // UMUMIY: matni PH kalitiga to'liq mos KELADIGAN har qanday leaf element (id'siz) tarjima qilinadi.
    // Bu har bir shablonning o'z sarlavha klassini (masalan .am-hs, .lbl, .hd) avtomatik qamraydi.
    document.querySelectorAll("#card *, .opening-ov *, .scene *").forEach(function(el){
      if (el.id || el.children.length) return;                 // faqat matnli (bolasiz) leaf; id'lilar data-driven
      var t = (el.dataset.uz !== undefined) ? el.dataset.uz : el.textContent.trim();
      if (!t || !hasTr(t)) return;
      if (el.dataset.uz === undefined) el.dataset.uz = t;
      el.textContent = trL(lang, t);
    });
    // CTA tugmalari (masalan: "Xaritada ko'rish", "Xaritada ochish", "Yo'nalishni ko'rish")
    document.querySelectorAll(".card-i .cta, .venue .cta, .sec .cta").forEach(function(el){
      if (!el.dataset.uz) {
        var txt = "";
        for (var i = 0; i < el.childNodes.length; i++) {
          if (el.childNodes[i].nodeType === 3) txt += el.childNodes[i].nodeValue;
        }
        el.dataset.uz = txt.trim();
      }
      var uz = el.dataset.uz;
      var target = trL(lang, uz);
      for (var j = 0; j < el.childNodes.length; j++) {
        if (el.childNodes[j].nodeType === 3) {
          el.childNodes[j].nodeValue = " " + target;
          break;
        }
      }
    });
  }
  // QOZOQCHA harflar (ә ғ қ ң ө ұ ү і): bezakli (qo'lyozma) shriftlarning ko'pida ular yo'q — brauzer faqat shu harflarni boshqa
  // shriftdan olib, so'z "ola-qura" chiqadi. Shuning uchun qozoqcha rejimda kirillcha matnli har bir element tekshiriladi:
  // shriftida bu harflar bo'lmasa — butun matn bitta to'liq shriftga (kursiv serif) o'tkaziladi. Boshqa tilga o'tilganda asliga qaytadi.
  var _cv2d = null;
  function fontHas(fam, str){
    try {
      _cv2d = _cv2d || document.createElement("canvas").getContext("2d");
      _cv2d.font = "40px " + fam + ", monospace"; var a = _cv2d.measureText(str).width;
      _cv2d.font = "40px " + fam + ", serif"; var b = _cv2d.measureText(str).width;
      return Math.abs(a - b) < 0.01;                           // zaxira shrift o'zgarsa ham en bir xil — demak harflar shu shriftning o'zida
    } catch (e) { return true; }
  }
  function fixKkGlyphs(lang){
    [].slice.call(document.querySelectorAll("[data-kkfix]")).forEach(function(el){
      el.style.fontFamily = ""; el.style.fontStyle = ""; el.style.fontSize = ""; el.style.letterSpacing = ""; el.removeAttribute("data-kkfix");
    });
    if (lang !== "kk" || !document.body) return;
    var tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false), n, seen = [], memo = {};
    while ((n = tw.nextNode())) {
      var el = n.parentElement;
      if (!el || seen.indexOf(el) >= 0 || !/[Ѐ-ӿ]/.test(n.nodeValue) || /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(el.tagName) || el.closest("#langBtn")) continue;
      seen.push(el);
    }
    seen.forEach(function(el){
      var cs = getComputedStyle(el), first = (cs.fontFamily || "").split(",")[0].trim();
      if (!first || /^(serif|sans-serif|monospace|cursive|system-ui)$/i.test(first)) return;
      if (!(first in memo)) memo[first] = fontHas(first, "әғқңөұүі");
      if (memo[first]) return;
      var script = /vibes|parisienne|script|allura|dancing|pinyon|alex|tangerine|sacramento|pacifico|lobster|caveat|satisfy|italianno|cursive/i.test(cs.fontFamily);
      var fz = parseFloat(cs.fontSize) || 0;
      el.setAttribute("data-kkfix", "1");
      el.style.fontFamily = '"Cormorant Garamond", "Times New Roman", Georgia, serif';
      if (script) { el.style.fontStyle = "italic"; el.style.letterSpacing = "0"; if (fz > 22) el.style.fontSize = (fz * .84).toFixed(1) + "px"; }   // qo'lyozma shrift ingichkaroq — o'rnini bosuvchi biroz kichraytiriladi
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ if (typeof LANG !== "undefined") fixKkGlyphs(LANG); }).catch(function(){});
  function applyLang(lang){
    var M = L[lang].months, MN = L[lang].monthsNom, DW = L[lang].days;
    // sana/vaqt ko'rinishi — shu til qolipi bo'yicha (FMT)
    var _f = FMT[lang] || FMT.uz, _t = two(INV.hour||0) + ":" + two(INV.minute||0);
    var _fm = function(q){ return String(q).replace("{d}", INV.day).replace("{M}", M[m0]).replace("{y}", INV.year).replace("{dw}", DW[w.getDay()]).replace("{t}", _t); };
    set("dateText", _fm(_f.date));
    set("heroDate", _fm(_f.hero));
    set("dayText", _fm(_f.day));
    set("timeText", _fm(_f.time));
    set("lockDate", _fm(_f.hero));
    set("scrMonth", MN[m0] || "");            // qirib ochiladigan sanadagi oy nomi (Oq konvert, Oq dantel)
    set("dateBig", INV.day);
    set("monText", ((MN[m0] || '') + ' ' + INV.year).toUpperCase());
    set("qDay", INV.day);
    set("qMonth", (MN[m0] || '').toUpperCase());
    set("qYear", INV.year);
    set("signNames", (INV.kuyov || '') + ' & ' + (INV.kelin || ''));
    var ovDate = document.querySelector(".lock-date");
    if (ovDate) {
      ovDate.textContent = _fm(_f.hero);
    }
    // taklif matni: shu til uchun alohida varianti berilgan bo'lsa (bot: taklifru / taklifkk …) — o'sha
    var _ld = INV.i18n && INV.i18n[lang] && typeof INV.i18n[lang].lead === "string" && INV.i18n[lang].lead.trim();
    set("lead", _ld || trText(INV.lead, "lead", lang));
    // Mijoz o'zi yozgan matnlar: shu til uchun alohida varianti berilgan bo'lsa (INV.i18n — admin bot orqali qo'yadi) — o'sha chiqadi,
    // bo'lmasa — asl yozilgani (to'yxona nomi, manzil, imzo, xabar)
    var _lo = (INV.i18n && typeof INV.i18n === "object" && INV.i18n[lang] && typeof INV.i18n[lang] === "object") ? INV.i18n[lang] : {};
    var _lv = function(k){ return (typeof _lo[k] === "string" && _lo[k].trim()) ? _lo[k].trim() : null; };
    set("message", _lv("message") || trText(INV.message, "msg", lang));
    set("family", _lv("family") || trText(INV.family, "fam", lang));
    set("venue", _lv("venueName") || INV.venueName);
    set("address", _lv("address") || INV.address);
    set("tkVenue", _lv("venueName") || INV.venueName || "");      // Retro kino chiptasidagi kinoteatr nomi
    // O'ngdan chapga yoziladigan qo'shimcha til (shablon __XLANG__ { rtl:true } — masalan forscha): sahifa yo'nalishi va ismlarning shu tildagi yozilishi
    if (XL && XL.rtl) {
      document.documentElement.dir = lang === XL.code ? "rtl" : "ltr";
      if (!QOSH) { var _nk = _lv("kuyov"), _ne = _lv("kelin"); set("kuyov", _nk || INV.kuyov); set("kelin", _ne || INV.kelin); set("lkuyov", _nk || INV.kuyov); set("lkelin", _ne || INV.kelin); fitNames(); }
    }
    renderSchedule(lang);
    renderCalendar(lang);
    translateStatic(lang);
    if (typeof window.__applyWishLang === "function") window.__applyWishLang();
    document.documentElement.lang = lang;
    fixKkGlyphs(lang);
  }

  // Til tugmasi (galereya preview'ida yashiriladi — toza thumbnail uchun)
  var langBtn = document.createElement("div");
  langBtn.className = "lang-btn"; langBtn.id = "langBtn";
  langBtn.innerHTML = LANGS.map(function(c){ return '<span data-l="' + c + '">' + esc2(LANG_LABEL[c] || c.toUpperCase()) + '</span>'; }).join("");
  if (PREVIEW || LANGS.length < 2) langBtn.style.display = "none";      // bitta til bo'lsa — almashtirgich kerak emas
  document.body.appendChild(langBtn);
  // (tanlov faqat mehmon o'zi tugmani bosganda saqlanadi — asosiy til keyin o'zgartirilsa, bosmagan mehmonlarda yangisi ochiladi)
  function setLang(lang, byUser){
    LANG = lang; if (byUser) { try { localStorage.setItem(LANG_KEY, lang); } catch(e){} }
    langBtn.querySelectorAll("span").forEach(function(s){ s.classList.toggle("on", s.getAttribute("data-l") === lang); });
    applyLang(lang);
  }
  langBtn.addEventListener("click", function(e){
    var s = e.target.closest("span"); if (!s) return;
    setLang(s.getAttribute("data-l"), true);
  });
  setLang(LANG);

  // Kalendarga qo'shish: faqat mijoz yoqqan bo'lsa (INV.showCal) chiqadi; shablonda #calAdd bo'lsa — o'sha joyda, bo'lmasa kalendar/sanoq ostida. Android — telefondagi taqvim ilovasi (intent), iPhone/kompyuter — .ics (Taqvim ilovasi).
  // Shablon sarlavha/davomiylikni berishi mumkin: window.__CAL__ = { title: "...", mins: 180 }
  (function(){
    var cb = id("calAdd"), own = id("faIcs");
    // Foto albomda o'zining "Kalendarga saqlash" tugmasi bor (doim) — umumiy tugma qo'shilmaydi
    if (own) { if (cb) cb.parentNode.removeChild(cb); return; }
    if (!INV.showCal || INV.calSkip || window.__NO_CAL__ || !INV.year || !INV.month || !INV.day) { if (cb) cb.parentNode.removeChild(cb); return; }
    if (!cb) {
      // Shablonda joyi belgilanmagan: kalendar ostiga (yonidagi "kuni · soati" yozuvidan keyin), kalendar bo'lmasa — sanoq ostiga
      var calEl = id("calendar"), cnt = document.querySelector("#card .count"), after = null;
      if (calEl && calEl.offsetParent !== null) { after = calEl; var nx = calEl.nextElementSibling; if (nx && (nx.querySelector("#dayText,#timeText") || /daysub|day-sub|o-day/.test(nx.className))) after = nx; }
      else if (cnt && cnt.offsetParent !== null) after = cnt;
      else if (id("d") && id("s")) { var an = id("d").parentNode; while (an && !an.contains(id("s"))) an = an.parentNode; if (an && an !== document.body) after = an; }     // sanoq boshqacha tuzilgan dizaynlar
      if (!after) return;
      cb = document.createElement("a"); cb.id = "calAdd"; cb.className = "cta cta-2 cal-add cal-auto";
      var wrap = document.createElement("div"); wrap.className = "cal-add-row"; wrap.appendChild(cb);
      after.parentNode.insertBefore(wrap, after.nextSibling);
    }
    var C = window.__CAL__ || {}, p2 = function(n){ return (n < 10 ? "0" : "") + n; };
    var hh = (INV.hour != null && INV.hour !== "") ? +INV.hour : 18, mi = +INV.minute || 0;
    var names = QOSH ? N1 + " va " + N2 : [INV.kuyov, INV.kelin].filter(Boolean).join(" va ");
    var title = C.title || (INV.osh ? "Nahorgi osh" + (names ? " — " + names : "") : (names ? names + " — to'y" : "Taklifnoma"));
    var loc = [INV.venueName, INV.address].filter(Boolean).join(", ");
    var link = /\/t\//.test(location.pathname) ? location.origin + location.pathname : "";
    var mins = +C.mins || (INV.osh ? 180 : 240);
    var d0 = "" + INV.year + p2(INV.month) + p2(INV.day) + "T" + p2(hh) + p2(mi);
    var android = /Android/i.test(navigator.userAgent);
    var ics = "/ics?t=" + encodeURIComponent(title) + "&d=" + d0 + "&m=" + mins + (loc ? "&l=" + encodeURIComponent(loc) : "") + (link ? "&u=" + encodeURIComponent(link) : "");
    cb.href = ics;
    if (android) {
      // Android'da sayt telefondagi taqvim ilovasini to'g'ridan-to'g'ri ocha olmaydi — mehmon o'zi tanlaydi:
      // "Telefon taqvimiga" — .ics fayl (ochilganda Samsung/Xiaomi/Google taqvimi "hodisa qo'shish" oynasini chiqaradi), yoki Google Taqvim sayti
      var e = new Date(Date.UTC(INV.year, INV.month - 1, INV.day, hh, mi) + mins * 60000);
      var d1 = "" + e.getUTCFullYear() + p2(e.getUTCMonth() + 1) + p2(e.getUTCDate()) + "T" + p2(e.getUTCHours()) + p2(e.getUTCMinutes());
      var gweb = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(title) + "&dates=" + d0 + "00/" + d1 + "00&ctz=Asia%2FTashkent"
        + (loc ? "&location=" + encodeURIComponent(loc) : "") + (link ? "&details=" + encodeURIComponent(link) : "");
      var st = document.createElement("style");
      st.textContent = ".cal-sh{position:fixed;inset:0;z-index:90;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.45);opacity:0;pointer-events:none;transition:opacity .25s}"
        + ".cal-sh.on{opacity:1;pointer-events:auto}"
        + ".cal-sh .cs{width:100%;max-width:440px;background:#fff;color:#222;border-radius:20px 20px 0 0;padding:18px 18px calc(env(safe-area-inset-bottom,0px) + 18px);transform:translateY(30px);transition:transform .3s;font-family:var(--sans,system-ui,sans-serif);text-align:center}"
        + ".cal-sh.on .cs{transform:none}"
        + ".cal-sh .ct{font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#666;margin:2px 0 14px}"
        + ".cal-sh a,.cal-sh button{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;box-sizing:border-box;margin:0 0 10px;padding:15px 16px;border-radius:14px;border:1px solid #ddd;background:#f6f6f6;color:#222;font:600 15px/1.2 var(--sans,system-ui,sans-serif);text-decoration:none;cursor:pointer}"
        + ".cal-sh a.pr{background:var(--accent,#333);border-color:transparent;color:#fff}"
        + ".cal-sh small{display:block;font-size:11.5px;font-weight:400;opacity:.8;margin-top:3px}"
        + ".cal-sh button{background:none;border:0;color:#888;margin:4px 0 0;padding:10px}";
      document.head.appendChild(st);
      var sh = document.createElement("div"); sh.className = "cal-sh";
      document.body.appendChild(sh);
      var close = function(){ sh.classList.remove("on"); };
      sh.addEventListener("click", function(ev){ if (ev.target === sh || (ev.target.closest && ev.target.closest(".cx"))) close(); else if (ev.target.closest && ev.target.closest("a")) setTimeout(close, 300); });
      cb.addEventListener("click", function(ev){
        ev.preventDefault();
        sh.innerHTML = '<div class="cs"><div class="ct"></div><a class="pr" download="taklifnoma.ics"><span><b></b><small></small></span></a><a target="_blank" rel="noopener"><span><b>Google</b></span></a><button type="button" class="cx"></button></div>';
        var as = sh.querySelectorAll("a");
        sh.querySelector(".ct").textContent = tr("Kalendarga qo'shish");
        as[0].href = ics; as[0].querySelector("b").textContent = tr("Telefon taqvimiga"); as[0].querySelector("small").textContent = tr("Fayl yuklanadi — uni bosib oching");
        as[1].href = gweb; as[1].querySelector("b").textContent = tr("Google Taqvim");
        sh.querySelector(".cx").textContent = tr("Bekor qilish");
        void sh.offsetWidth; sh.classList.add("on");
      });
    }
    var calSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4M12 13v5M9.5 15.5h5"/></svg>';
    var sp = document.createElement("span"); sp.dataset.uz = "Kalendarga qo'shish"; sp.textContent = tr("Kalendarga qo'shish");
    cb.innerHTML = calSvg; cb.appendChild(sp);
    cb.removeAttribute("hidden");
    // Avtomatik qo'yilgan tugma fonga singib ketsa (masalan, to'q qizil bo'limda qizil yozuv) — oq yoki to'q rangga o'tadi
    if (cb.classList.contains("cal-auto")) (function(){
      var rgb = function(c){ var m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(c || ""); return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] == null ? 1 : +m[4] } : null; };
      var lum = function(c){ var f = function(v){ v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
      // fon rangi: eng yaqin to'liq rangli ota-element; yo'lda fon RASM bo'lsa — rangni aniqlab bo'lmaydi, tugma o'z holida qoladi
      var bg = null, n = cb.parentNode; while (n && n.nodeType === 1 && n !== document.body) { var cs = getComputedStyle(n); if (cs.backgroundImage && cs.backgroundImage !== "none") return; var c = rgb(cs.backgroundColor); if (c && c.a > .5) { bg = c; break; } n = n.parentNode; }
      // bo'limning o'z rangi topilmasa (sahifa foni rasm yoki body) — tegilmaydi
      var fg = rgb(getComputedStyle(cb).color); if (!bg || !fg) return;
      var L1 = lum(fg), L2 = lum(bg), ratio = (Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05);
      if (ratio >= 3) return;
      var col = L2 < .4 ? "#fff7ee" : "#2a2020"; cb.style.color = col; cb.style.borderColor = L2 < .4 ? "rgba(255,247,238,.75)" : "rgba(42,32,32,.6)"; cb.style.background = "transparent";
    })();
  })();

  // Manzil: rasm + xarita + Google/Yandex
  function pinSvg(){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-6.3-7-11a7 7 0 0114 0c0 4.7-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>'; }
  var mb = id("mapBtn");
  if (mb) {
    var mq = (INV.lat && INV.lng) ? (INV.lat + "," + INV.lng) : ((INV.venueName||"") + " " + (INV.address||""));
    var enc = encodeURIComponent(mq);
    var mcard = mb.closest(".card-i");
    mb.href = (typeof INV.mapUrl === "string" && /^https:\/\//.test(INV.mapUrl)) ? INV.mapUrl : "https://www.google.com/maps/search/?api=1&query=" + enc;      // bot: xaritalink — mijoz bergan aniq havola
    mb.innerHTML = pinSvg() + "Google Maps";
    var yx = document.createElement("a"); yx.className = "cta cta-2 yx-btn";      /* turkchada yashiriladi (Turkiyada Yandex ishlatilmaydi) */ yx.target = "_blank"; yx.rel = "noopener";
    yx.href = "https://yandex.uz/maps/?text=" + enc; yx.innerHTML = pinSvg() + "<span>Yandex Xarita</span>";
    // til almashganda translateStatic (PH) yangilaydi; hozirgi til RU bo'lsa — darhol
    if (LANG !== "uz") { var yxs = yx.querySelector("span"); yxs.dataset.uz = "Yandex Xarita"; yxs.textContent = tr("Yandex Xarita"); }
    var mrow = document.createElement("div"); mrow.className = "map-btns";
    mb.parentNode.insertBefore(mrow, mb); mrow.appendChild(mb); mrow.appendChild(yx);
    if (mcard) {
      var map = document.createElement("div"); map.className = "map-embed";
      var ifr = document.createElement("iframe"); ifr.loading = "lazy"; ifr.title = "Xarita";
      ifr.src = "https://maps.google.com/maps?q=" + enc + "&z=15&output=embed"; map.appendChild(ifr);
      mcard.insertBefore(map, mrow);
      if (INV.venuePhoto && !document.querySelector(".venue-img")) { var vp = document.createElement("img"); vp.className = "venue-photo"; vp.alt = "To'yxona"; vp.loading = "lazy"; vp.src = INV.venuePhoto; mcard.insertBefore(vp, map); }
    }
  }

  // Stol raqami: havolada ?stol=5 (ixtiyoriy &mehmon=Aliyevlar oilasi) bo'lsa — shablondagi #stolWrap kartochkasi to'ldiriladi
  // (bot: /stollar <havola> <jami>, /stol <havola> <raqam> [mehmon]). Shablonda o'z kartochkasi bo'lmasa — Bej arkadagi
  // dumaloq stol (tepadan: 10 ta stul, dasturxon, gulchambar, o'rtada raqam) manzil bo'limiga avtomatik qo'yiladi,
  // ranglari va shrifti shu dizaynning o'zidan olinadi (sarlavha rangi — urg'u, joy nomi — matn).
  function autoStol(){
    var v = id("venue"); if (!v) return null;
    var anchor = (v.closest && v.closest(".info")) || v, box = anchor.parentNode; if (!box) return null;
    var hd = box.querySelector("h2,.lbl,.title,.t,.ftit,.am-hs,.pre") || (box.closest(".section,section") || box).querySelector("h2,.lbl,.title,.t,.ftit,.am-hs,.pre");
    function rgb(s){ var m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(s || ""); return m && (m[4] === undefined || +m[4] > .3) ? [+m[1], +m[2], +m[3]] : null; }
    function lum(c){ return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255; }
    function css(c){ return "rgb(" + c.map(Math.round).join(",") + ")"; }
    var cv = getComputedStyle(v), acc = (hd && rgb(getComputedStyle(hd).color)) || rgb(cv.color) || [176, 103, 74], ink = rgb(cv.color) || acc;   // joy nomi gradient/shaffof bo'lsa — urg'u rangi
    // raqam och dasturxon ustida — urg'u rangi juda och bo'lsa (tungi dizaynlardagi oltin) to'qroq qilinadi
    var numC = acc; if (lum(numC) > .5) numC = numC.map(function(x){ return x * (.5 / lum(acc)) * .8; });
    if (!id("stolAutoCss")) {
      var st = document.createElement("style"); st.id = "stolAutoCss";
      st.textContent = ".ist{position:relative;display:flex;flex-direction:column;align-items:center;gap:4px;margin:4px auto 24px;width:100%;max-width:300px;text-align:center}"
        + ".ist[hidden]{display:none}"
        + ".ist-g{font-style:italic;font-weight:600;font-size:22px;line-height:1.25;color:var(--si)}"
        + ".ist-l{font-weight:600;letter-spacing:.2em;text-transform:uppercase;font-size:15px;color:var(--sa);margin-top:2px}"
        + ".ist svg{width:min(72vw,280px);height:auto;margin-top:8px;overflow:visible;filter:drop-shadow(0 14px 18px rgba(40,28,14,.2))}"
        + ".ist .chair{fill:url(#istSeat);stroke:var(--sa);stroke-opacity:.55;stroke-width:.9}"
        + ".ist .chair-b{fill:none;stroke:var(--sa);stroke-opacity:.6;stroke-width:3;stroke-linecap:round}"
        + ".ist .chair-s{fill:rgba(40,28,14,.16)}"
        + ".ist .cloth{fill:url(#istCloth);stroke:var(--sa);stroke-width:1.6}"
        + ".ist .cloth2{fill:none;stroke:#c9a97a;stroke-width:1.1}"
        + ".ist .cloth3{fill:none;stroke:var(--sa);stroke-opacity:.3;stroke-width:1;stroke-dasharray:2 4;stroke-linecap:round}"
        + ".ist .leaf{fill:#a3ab8c}.ist .leaf.g{fill:#cdb48f}.ist .stem{fill:none;stroke:#8f9877;stroke-width:1.4;stroke-linecap:round}"
        + ".ist .ring{fill:none;stroke:var(--sa);stroke-width:1.3;opacity:.45}"
        + ".ist .num{font-style:italic;font-weight:600;font-size:150px;fill:var(--sn)}"
        + ".ist .num.long{font-size:66px;font-style:normal;letter-spacing:.02em}"
        + ".ist .pulse{fill:none;stroke:var(--sa);stroke-width:2;opacity:0;transform-box:fill-box;transform-origin:center;animation:istPulse 3.2s ease-out infinite}"
        + "@keyframes istPulse{0%{opacity:.55;transform:scale(.97)}70%{opacity:0;transform:scale(1.09)}100%{opacity:0;transform:scale(1.09)}}"
        + "@media (prefers-reduced-motion:reduce){.ist .pulse{animation:none}}";
      document.head.appendChild(st);
    }
    var N = 10, C = 150;
    var h = '<defs><radialGradient id="istCloth" cx="50%" cy="42%" r="60%"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#eee2cc"/></radialGradient>'
          + '<linearGradient id="istSeat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1e6d2"/><stop offset="1" stop-color="#dccaa9"/></linearGradient></defs>';
    h += '<circle class="pulse" cx="' + C + '" cy="' + C + '" r="112"/>';
    for (var i = 0; i < N; i++) {
      h += '<g transform="rotate(' + (i * 360 / N) + ' ' + C + ' ' + C + ') translate(' + C + ' ' + (C - 136) + ')">'
         + '<ellipse class="chair-s" cx="0" cy="3" rx="16" ry="9"/>'
         + '<rect class="chair" x="-15" y="-7" width="30" height="16" rx="7"/><path class="chair-b" d="M-12 -9 Q0 -16 12 -9"/></g>';
    }
    h += '<circle class="cloth" cx="' + C + '" cy="' + C + '" r="108"/><circle class="cloth2" cx="' + C + '" cy="' + C + '" r="103"/><circle class="cloth3" cx="' + C + '" cy="' + C + '" r="96"/>';
    h += '<circle class="ring" cx="' + C + '" cy="' + C + '" r="88"/>';
    function branch(a0){
      var r = 92, p = '', d = '';
      for (var k = 0; k <= 9; k++) {
        var t = (a0 + k * 15) * Math.PI / 180, x = C + r * Math.cos(t), y = C + r * Math.sin(t);
        d += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
        if (k === 9) break;
        var out = k % 2 ? 1 : -1, rr = r + out * 4.5, lx = C + rr * Math.cos(t), ly = C + rr * Math.sin(t), ang = (a0 + k * 15) + 90 + out * 32;
        p += '<ellipse class="leaf' + (k % 3 === 1 ? ' g' : '') + '" cx="' + lx.toFixed(1) + '" cy="' + ly.toFixed(1) + '" rx="7.5" ry="3.3" transform="rotate(' + ang + ' ' + lx.toFixed(1) + ' ' + ly.toFixed(1) + ')"/>';
      }
      return '<path class="stem" d="' + d + '"/>' + p;
    }
    h += branch(110) + branch(290);
    h += '<text class="num" id="stolNum" x="' + C + '" y="' + (C - 6) + '" text-anchor="middle" dominant-baseline="central"></text>';
    var w = document.createElement("div");
    w.className = "ist"; w.id = "stolWrap"; w.hidden = true;
    w.style.setProperty("--sa", css(acc)); w.style.setProperty("--si", css(ink)); w.style.setProperty("--sn", css(numC));
    // raqam va mehmon nomi — qo'lyozma bo'lmagan shriftda (qo'lyozma "5" doiradan chiqib ketadi): joy nomi yoki sarlavha shrifti, bo'lmasa Cormorant
    var SCR = /italianno|vibes|script|pinyon|parisienne|allura|great|dancing|alex|tangerine|sacramento|pacifico|lobster|caveat|satisfy|cursive/i;
    var lf = hd ? getComputedStyle(hd).fontFamily : "", nf = [cv.fontFamily, lf].filter(function(f){ return f && !SCR.test(f); })[0] || '"Cormorant Garamond", Georgia, serif';
    w.style.fontFamily = nf;
    w.innerHTML = '<div class="ist-g stol-g" id="stolGuest"></div><div class="ist-l stol-l">Sizning stolingiz</div><svg viewBox="-10 -10 320 320" aria-hidden="true">' + h + '</svg>';
    if (lf && !SCR.test(lf)) w.querySelector(".ist-l").style.fontFamily = lf;
    box.insertBefore(w, anchor);
    // Oltin kitob: bet balandligi qat'iy (sig'masa butun bet kichrayadi) — stol ixchamroq, matnlar o'qiladigan bo'lib qoladi
    if (w.closest(".pg-c, section.pg[data-n]")) {
      w.style.margin = "0 auto 8px"; w.style.gap = "0";
      w.querySelector(".ist-g").style.fontSize = "17px"; w.querySelector(".ist-l").style.fontSize = "11px";
      var sv = w.querySelector("svg"); sv.style.width = "104px"; sv.style.marginTop = "2px";
    }
    return w;
  }
  (function(){
    var q = {};
    location.search.replace(/^\?/, "").split("&").forEach(function(p){ var i = p.indexOf("="); if (i < 1) return; try { q[decodeURIComponent(p.slice(0, i))] = decodeURIComponent(p.slice(i + 1).replace(/\+/g, " ")); } catch(e){} });
    var n = String(q.stol || "").trim().slice(0, 10), g = String(q.mehmon || "").trim().slice(0, 60);
    if (!n) return;
    var wrap = id("stolWrap") || autoStol(); if (!wrap) return;
    var num = id("stolNum"), gs = id("stolGuest");
    if (num) { num.textContent = n; if (n.length > 2) num.classList.add("long"); }
    if (gs) { gs.textContent = g; if (!g) gs.style.display = "none"; }
    wrap.removeAttribute("hidden");
  })();

  // Hisoblagich
  var cd = id("d"), ch = id("h"), cm = id("m"), cs = id("s");
  if (cd && ch && cm && cs) {
    (function tick(){
      var diff = w - new Date(); if (!(diff > 0)) diff = 0;   // o'tgan sana yoki noto'g'ri sana (NaN) — 00
      var sec = Math.floor(diff/1000);
      cd.textContent = two(Math.floor(sec/86400)); ch.textContent = two(Math.floor(sec%86400/3600));
      cm.textContent = two(Math.floor(sec%3600/60)); cs.textContent = two(sec%60);
      setTimeout(tick, 1000);
    })();
  }

  // Scroll reveal — elementlar viewportga kirganда elegant paydo bo'ladi.
  // IntersectionObserver (asosiy) + scroll zaxira (kafolat: kontent hech qachon yashirin qolmaydi).
  var hasIO = ('IntersectionObserver' in window);
  var io = hasIO ? new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) e.target.classList.add("in"); }); }, { threshold: .12, rootMargin: "0px 0px -6% 0px" }) : { observe: function(el){ el.classList.add("in"); } };
  document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });
  function revealInView(){
    var vh = window.innerHeight || 800, left = 0;
    document.querySelectorAll(".reveal:not(.in)").forEach(function(el){
      left++;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92) el.classList.add("in"); // top viewport ichida yoki undan yuqori (o'tib ketgan) bo'lsa ochamiz
    });
    return left;
  }
  var _rvT = 0;
  window.addEventListener("scroll", function(){ if (_rvT) return; _rvT = setTimeout(function(){ _rvT = 0; revealInView(); }, 120); }, { passive: true });
  revealInView();
  setTimeout(revealInView, 400);

  // Shablon ichidagi mavjud rasm slotlarini (masalan: saroy.html) mijoz ma'lumoti bilan yangilash
  var _storyImg = document.querySelector(".story-img");
  if (_storyImg && INV.photos && INV.photos[0]) {
    _storyImg.src = INV.photos[0];
  }
  var _venueImg = document.querySelector(".venue-img");
  if (_venueImg && INV.venuePhoto) {
    _venueImg.src = INV.venuePhoto;
  }

  // Kuyov-kelin rasmlari (1-3 ta) — shablonда #coupleWrap slot bo'lsa o'shanga, bo'lmasa avtomatik section
  var _card = id("card");
  var _coupleSlot = id("coupleWrap");
  // Shablon rasmlarni o'zi ko'rsatsa (masalan, sunnat: o'g'illar halqa ramkada) — umumiy "Biz" rasm bo'limi qo'shilmaydi: window.__NO_COUPLE__
  if (INV.photos && INV.photos.length && _card && !window.__NO_COUPLE__) {
    var n = Math.min(INV.photos.length, 3);
    var wrap = document.createElement("div"); wrap.className = "couple-grid couple-" + n;
    INV.photos.slice(0, 3).forEach(function(u){ var im = document.createElement("img"); im.className = "couple-photo"; im.loading = "lazy"; im.src = u; wrap.appendChild(im); });
    if (_coupleSlot) { _coupleSlot.appendChild(wrap); var _csec = _coupleSlot.closest(".reveal"); if (_csec) io.observe(_csec); }
    else {
      var ps = document.createElement("section"); ps.className = "section reveal";
      var lbl = document.createElement("p"); lbl.className = "lbl"; lbl.textContent = "Biz"; ps.appendChild(lbl);
      ps.appendChild(wrap);
      var foot = _card.querySelector(".foot, .foot2, .b-foot");
      if (foot && foot.parentNode) foot.parentNode.insertBefore(ps, foot); else _card.appendChild(ps);
      io.observe(ps);
    }
  } else if (_coupleSlot) {
    var _hideC = _coupleSlot.closest("[data-optional]") || _coupleSlot.closest("section"); if (_hideC) _hideC.style.display = "none";
  }

  // Tilaklar (mehmonlar yozadi, hammaga ko'rinadi). Shablon o'chirishi mumkin: window.__NO_WISHES__ (masalan: turmush taklifi)
  if (_card && !window.__NO_WISHES__) {
    var slugM = location.pathname.match(/\/t\/([^/?#]+)/);
    var wslug = slugM ? slugM[1] : null;
    var wishInner = '<div class="wish-list" id="wishList"></div>' +
      '<div class="wish-form"><input id="wishName" maxlength="40" placeholder="' + tr("Ismingiz") + '">' +
      '<textarea id="wishText" maxlength="300" placeholder="' + tr("Yosh oilaga tilagingiz...") + '"></textarea>' +
      '<button type="button" id="wishSend" class="cta">' + tr("Tilak yuborish") + '</button>' +
      '<button type="button" id="wishCancel" class="wish-cancel" hidden>' + tr("Bekor qilish") + '</button>' +
      '<div class="wish-note" id="wishNote"></div></div>';
    var _wishSlot = id("wishWrap");
    if (_wishSlot) { _wishSlot.innerHTML = wishInner; var _wsec = _wishSlot.closest(".reveal"); if (_wsec) io.observe(_wsec); }
    else {
      var ws = document.createElement("section"); ws.className = "section reveal";
      ws.innerHTML = '<p class="lbl">Tilaklar</p>' + wishInner;
      var _foot = _card.querySelector(".foot");
      if (_foot && _foot.parentNode) _foot.parentNode.insertBefore(ws, _foot); else _card.appendChild(ws);
      io.observe(ws);
    }

    // To'yona kartasi (ixtiyoriy): mijoz karta raqamini kiritgan bo'lsa — tilaklardan OLDIN, shablonning o'z bo'lim uslubida
    // (tilaklar bo'limining klassi nusxalanadi: oddiy shablonda — section, Oltin kitobda — alohida varaq). Kiritilmasa — hech narsa qo'shilmaydi.
    var _cardNo = String(INV.card || "").replace(/\D/g, "");
    if (_cardNo.length >= 16 && _cardNo.length <= 19) {
      var _grp = _cardNo.replace(/(\d{4})(?=\d)/g, "$1 ");
      var _brand = /^(8600|5614|6262)/.test(_cardNo) ? "UZCARD" : /^9860/.test(_cardNo) ? "HUMO" : /^4/.test(_cardNo) ? "VISA" : /^(5[1-5]|2[2-7])/.test(_cardNo) ? "Mastercard" : "";
      var _toyIn = '<div class="toy-card"><span class="toy-chip"></span><span class="toy-brand">' + esc2(_brand) + '</span>'
        + '<div class="toy-num">' + esc2(_grp) + '</div>'
        + (INV.cardName ? '<div class="toy-name">' + esc2(String(INV.cardName).toUpperCase()) + '</div>' : '') + '</div>'
        + '<button type="button" class="cta toy-copy">Nusxa olish</button><p class="toy-note" id="toyNote"></p>';
      var _anc = _wishSlot ? _wishSlot.closest("section") : ws, ts;
      if (_anc) {
        ts = _anc.cloneNode(true);
        var _slot = _wishSlot ? ts.querySelector("#wishWrap") : null;
        if (_slot) { _slot.removeAttribute("id"); _slot.innerHTML = _toyIn; }
        else { [].slice.call(ts.querySelectorAll(".wish-list,.wish-form")).forEach(function(e){ e.remove(); }); ts.insertAdjacentHTML("beforeend", _toyIn); }
        // nusxadagi boshqa id'li elementlar (masalan, "Barcha tilaklar" tugmasi) kerak emas
        [].slice.call(ts.querySelectorAll("[id]:not(#toyNote)")).forEach(function(e){ e.remove(); });
        ts.removeAttribute("id"); ts.classList.remove("in"); ts.classList.add("toyona");
        [].slice.call(ts.querySelectorAll("[data-uz]")).concat([ts]).forEach(function(e){ e.removeAttribute("data-uz"); });
        // sarlavha: "Tilaklar" -> "To'yona uchun" (shablon shrifti/uslubi saqlanadi)
        var _tw = document.createTreeWalker(ts, NodeFilter.SHOW_TEXT, null, false), _tn;
        // (sarlavha boshqacha bo'lsa — masalan "Tomoshabinlar fikri" — birinchi matn almashtiriladi; raqamli belgilar, masalan "08", o'tkaziladi)
        var _first = null, _hit = false;
        while ((_tn = _tw.nextNode())) {
          var _v = _tn.nodeValue.trim(); if (!_v || /^[\d\s.—-]+$/.test(_v)) continue;
          if (!_first) _first = _tn;
          if (_v === "Tilaklar") { _tn.nodeValue = _tn.nodeValue.replace("Tilaklar", "To'yona uchun"); _hit = true; break; }
        }
        if (!_hit && _first) _first.nodeValue = "To'yona uchun";
        _anc.parentNode.insertBefore(ts, _anc);
      } else {
        ts = document.createElement("section"); ts.className = "section reveal toyona";
        ts.innerHTML = '<p class="lbl">To\'yona uchun</p>' + _toyIn; _card.appendChild(ts);
      }
      if (/(^|\s)reveal(\s|$)/.test(ts.className)) io.observe(ts);
      ts.querySelector(".toy-copy").addEventListener("click", function(){
        var note = ts.querySelector(".toy-note");
        function ok(){ note.textContent = tr("Karta raqami nusxalandi ✓"); setTimeout(function(){ note.textContent = ""; }, 2600); }
        function fallback(){ var ta = document.createElement("textarea"); ta.value = _cardNo; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;left:-9999px;top:0";
          document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); ok(); } catch (e) {} document.body.removeChild(ta); }
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(_cardNo).then(ok, fallback); else fallback();
      });
      // raqam kartaga sig'masa (eski iPhone'da cqw yo'q / tor varaq) — shrift kichraytiriladi
      var _tn2 = ts.querySelector(".toy-num");
      function fitToy(){ if (!_tn2.clientWidth) return; _tn2.style.fontSize = ""; var fz = parseFloat(getComputedStyle(_tn2).fontSize) || 16;
        while (_tn2.scrollWidth > _tn2.clientWidth + 1 && fz > 9) { fz -= .5; _tn2.style.fontSize = fz + "px"; } }
      fitToy(); setTimeout(fitToy, 700); window.addEventListener("resize", fitToy);
      if (LANG !== "uz") translateStatic(LANG);
    }
    // Mijoz "Tilaklar" bo'limini o'chirtirgan bo'lsa (INV.noWishes) — bo'lim butunlay yashiriladi (to'yona kartasi bo'lsa, u qoladi)
    if (INV.noWishes) {
      var _wx = _wishSlot ? (_wishSlot.closest("section") || _wishSlot) : ws;
      if (_wx) { _wx.style.display = "none"; _wx.classList.remove("reveal"); }
    }
    var wlist = id("wishList");
    var _lastWishes = null, _wishSample = false;
    // O'z tilaklari: yozilganda server bergan maxfiy kalitlar shu brauzerda saqlanadi ({ tilakId: kalit }) —
    // mehmon faqat O'ZI (shu qurilmadan) yozgan tilagini tahrirlay/o'chira oladi.
    var _mineKey = "tw:" + (wslug || "demo"), _mine = {}, _editId = null;
    try { _mine = JSON.parse(localStorage.getItem(_mineKey) || "{}") || {}; } catch (e) { _mine = {}; }
    function saveMine(){ try { localStorage.setItem(_mineKey, JSON.stringify(_mine)); } catch (e) {} }
    function setEdit(x){
      _editId = x ? x.id : null;
      var ws = id("wishSend"), wc = id("wishCancel");
      if (x) { id("wishName").value = x.name; id("wishText").value = x.text; id("wishNote").textContent = ""; }
      else { id("wishText").value = ""; }
      if (ws) ws.textContent = tr(_editId != null ? "Saqlash" : "Tilak yuborish");
      if (wc) wc.hidden = _editId == null;
      if (_lastWishes !== null) renderWishes(_lastWishes);
      if (x) { try { id("wishText").focus(); id("wishText").scrollIntoView({ block: "center", behavior: "smooth" }); } catch (e) {} }
    }
    function wishPost(path, body){ return fetch("/api/wish/" + encodeURIComponent(wslug) + path, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) }).then(function(r){ return r.json(); }); }
    function delWish(x){
      if (!window.confirm(tr("Tilak o'chirilsinmi?"))) return;
      if (_wishSample) { _lastWishes = _lastWishes.filter(function(w){ return w.id !== x.id; }); if (_editId === x.id) setEdit(null); else renderWishes(_lastWishes); id("wishNote").textContent = tr("Tilak o'chirildi"); return; }
      wishPost("/" + x.id + "/delete", { token: _mine[x.id] }).then(function(res){
        if (res && res.ok) { delete _mine[x.id]; saveMine(); if (_editId === x.id) setEdit(null); id("wishNote").textContent = tr("Tilak o'chirildi"); loadWishes(); }
        else id("wishNote").textContent = (res && res.error) || tr("Xatolik");
      }).catch(function(){ id("wishNote").textContent = tr("Ulanishda xatolik"); });
    }
    function renderWishes(arr){
      _lastWishes = arr;
      wlist.innerHTML = "";
      if (!arr || !arr.length){ var e = document.createElement("div"); e.className = "wish-empty"; e.textContent = tr("Birinchi bo'lib tilak qoldiring 💐"); wlist.appendChild(e); return; }
      arr.forEach(function(x){ var c = document.createElement("div"); c.className = "wish-item";
        var nm = document.createElement("div"); nm.className = "wish-name"; nm.textContent = x.name;
        var tx = document.createElement("div"); tx.className = "wish-text"; tx.textContent = _wishSample ? tr(x.text) : x.text;
        c.appendChild(nm); c.appendChild(tx);
        if (x.id != null && _mine[x.id]) {      // o'z tilagi — tahrirlash / o'chirish
          if (_editId === x.id) c.className += " editing";
          var ac = document.createElement("div"); ac.className = "wish-acts";
          var be = document.createElement("button"); be.type = "button"; be.className = "wish-act"; be.textContent = tr("Tahrirlash");
          be.addEventListener("click", function(){ setEdit(x); });
          var bd = document.createElement("button"); bd.type = "button"; bd.className = "wish-act del"; bd.textContent = tr("O'chirish");
          bd.addEventListener("click", function(){ delWish(x); });
          ac.appendChild(be); ac.appendChild(bd); c.appendChild(ac);
        }
        wlist.appendChild(c); });
    }
    // Til almashganda wishes matnlarini yangilaydi (placeholder, tugma, namuna)
    window.__applyWishLang = function(){
      var wn = id("wishName"), wt = id("wishText"), ws = id("wishSend");
      if (wn) wn.placeholder = tr("Ismingiz");
      if (wt) wt.placeholder = tr("Yosh oilaga tilagingiz...");
      if (ws) ws.textContent = tr(_editId != null ? "Saqlash" : "Tilak yuborish");
      var wc = id("wishCancel"); if (wc) wc.textContent = tr("Bekor qilish");
      if (_lastWishes !== null) renderWishes(_lastWishes);
    };
    function loadWishes(){ fetch("/api/wishes/" + encodeURIComponent(wslug)).then(function(r){ return r.json(); }).then(function(d){ if (d && d.ok) renderWishes(d.wishes); }).catch(function(){}); }
    id("wishCancel").addEventListener("click", function(){ setEdit(null); });
    if (wslug) {
      loadWishes();
      id("wishSend").addEventListener("click", function(){
        var nm = id("wishName").value.trim(), tx = id("wishText").value.trim();
        if (!nm || !tx){ id("wishNote").textContent = tr("Ism va tilak yozing"); return; }
        var b = this; b.disabled = true;
        if (_editId != null) {      // o'z tilagini saqlash
          wishPost("/" + _editId + "/edit", { name: nm, text: tx, token: _mine[_editId] }).then(function(res){ b.disabled = false;
            if (res && res.ok) { setEdit(null); id("wishNote").textContent = tr("Tilagingiz yangilandi ✓"); loadWishes(); }
            else id("wishNote").textContent = (res && res.error) || tr("Xatolik");
          }).catch(function(){ b.disabled = false; id("wishNote").textContent = tr("Ulanishda xatolik"); });
          return;
        }
        fetch("/api/wish/" + encodeURIComponent(wslug), { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ name:nm, text:tx }) })
          .then(function(r){ return r.json(); }).then(function(res){ b.disabled = false;
            if (res.ok){ if (res.id != null && res.token) { _mine[res.id] = res.token; saveMine(); }
              id("wishText").value = ""; id("wishNote").textContent = tr("Rahmat! Tilagingiz qo'shildi 💐"); loadWishes(); }
            else id("wishNote").textContent = res.error || tr("Xatolik");
          }).catch(function(){ b.disabled = false; id("wishNote").textContent = tr("Ulanishda xatolik"); });
      });
    } else {
      _wishSample = true;
      // Namunada birinchi tilak "o'ziniki" deb ko'rsatiladi — tahrirlash/o'chirish qanday ishlashini ko'rish uchun (serverga hech narsa yuborilmaydi)
      _mine = { s1: 1 };
      renderWishes([{ id:"s1", name:"Dilnoza", text:"Baxtli bo'linglar! 💐" }, { id:"s2", name:"Sardor", text:"To'yingiz muborak bo'lsin!" }]);
      id("wishSend").addEventListener("click", function(){
        if (_editId != null) {
          var nm = id("wishName").value.trim(), tx = id("wishText").value.trim();
          if (!nm || !tx){ id("wishNote").textContent = tr("Ism va tilak yozing"); return; }
          _lastWishes = _lastWishes.map(function(w){ return w.id === _editId ? { id: w.id, name: nm, text: tx } : w; });
          setEdit(null); id("wishNote").textContent = tr("Tilagingiz yangilandi ✓"); return;
        }
        id("wishNote").textContent = tr("Namunada tilak yuborilmaydi — haqiqiy taklifnomada ishlaydi.");
      });
    }
  }

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  // Fon qo'shig'i (Reduce Motion'ga bog'liq emas — animatsiya emas)
  var music = null;
  if (!PREVIEW && INV.audioTry) {
    var startAt = +(INV.audioStart || 0);
    // iPhone/iOS: media-fragment (#t=) boshlanish nuqtasini ishonchli qo'yadi
    var audioEl = new Audio(INV.audioTry + (startAt > 0 ? ("#t=" + startAt) : ""));
    audioEl.preload = "auto";
    // Shablon ovoz darajasini bersa (INV.audioVol) — 0 dan shu darajagacha ~3 soniyada asta kuchayadi
    if (INV.audioVol > 0 && INV.audioVol < 1) {
      var _vTarget = +INV.audioVol, _vDone = false;
      audioEl.volume = 0;
      audioEl.addEventListener("playing", function(){
        if (_vDone) return; _vDone = true;
        var t0 = Date.now(), iv = setInterval(function(){
          var k = Math.min(1, (Date.now() - t0) / 3000);
          try { audioEl.volume = _vTarget * k; } catch(e){}
          if (k >= 1) clearInterval(iv);
        }, 60);
      });
    }
    if (startAt > 0) {
      audioEl.loop = false;
      audioEl.addEventListener("ended", function(){ try { audioEl.currentTime = startAt; } catch(e){} audioEl.play().catch(function(){}); });
      // Zaxira: agar boshiga tushib qolsa (loop/iOS), soniyaga qaytaramiz
      audioEl.addEventListener("timeupdate", function(){
        if (audioEl.currentTime < startAt - 0.35 && !audioEl.seeking) { try { audioEl.currentTime = startAt; } catch(e){} }
      });
    } else { audioEl.loop = true; }
    music = { playing: function(){ return audioEl && !audioEl.paused; },
      pause: function(){ audioEl.pause(); },
      // play(): iOS avtomatik chalishni rad etsa - onBlocked chaqiriladi
      play: function(onBlocked){ var p = audioEl.play(); if (p && p.catch) p.catch(function(){ if (onBlocked) onBlocked(); }); },
      toggle: function(){ if (!audioEl.paused){ audioEl.pause(); return false; } audioEl.play().catch(function(){}); return true; } };
  }
  if (music) music.el = audioEl;      // shablon uchun: qo'shiqni Web Audio orqali pasaytirish (iPhone'da audio.volume o'zgarmaydi)
  window.__INV_MUSIC__ = music;      // shablon uchun (masalan: video ovozi chiqayotganda qo'shiqni to'xtatib turish)
  var mbtn = id("music");
  if (mbtn && music) {
    mbtn.addEventListener("click", function(){ music.toggle(); });
    // Tugma holati qo'shiqning HAQIQIY holatidan olinadi (iOS play()ni rad etsa ham to'g'ri)
    audioEl.addEventListener("play", function(){ mbtn.classList.add("playing"); });
    audioEl.addEventListener("pause", function(){ mbtn.classList.remove("playing"); });
  }
  else if (mbtn) { mbtn.style.display = "none"; }

  // ===== Ochilish: 2 xil (mijoz tanlaydi): slide (chapdan o'ngga surish) / heart (yurakni bosish) =====
  var card = id("card");
  function startMusicNow(){ if (music && !music.playing()) music.play(); }
  // Shablondagi eski ochilish markupini olib tashlaymiz — inv.js o'zi quradi
  var _oc = id("cover"); if (_oc) _oc.remove();
  var _ol = id("lock"); if (_ol) _ol.remove();
  function esc2(s){ return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  var sealTxt = initial(INV.kuyov) + " & " + initial(INV.kelin);
  var namesTxt = QOSH ? N1 + " va " + N2 : (INV.kuyov || "") + " & " + (INV.kelin || "");
  var _mm = (INV.month || 1) - 1;
  var dateTxt = INV.day + "-" + ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"][_mm] + " · " + INV.year;
  var openType = INV.opening || "slide";

  var revealed = false;
  function reveal(delay){
    if (revealed) return; revealed = true;
    startMusicNow();
    var ov = document.querySelector(".opening-ov");
    setTimeout(function(){
      if (ov) ov.classList.add("gone");
      if (card) card.classList.add("show");
      document.body.style.overflow = "auto"; window.scrollTo(0, 0);
      // overlay so'nish davomiyligini shablon o'zgartira oladi (window.__OV_FADE_MS__), aks holda 0.9s
      setTimeout(function(){ if (ov && ov.parentNode) ov.parentNode.removeChild(ov); }, window.__OV_FADE_MS__ || 900);
    }, delay || 0);
  }

  if (PREVIEW) {
    if (card) card.classList.add("show");
  } else {
    document.body.style.overflow = "hidden";
    var ov = document.createElement("div");
    ov.className = "opening-ov open-" + openType;

    // Shablon o'z ochilishini bersa (masalan: konvert qopqog'i + nur) — window.__CUSTOM_OPEN__(api).
    // Shablon .opening-ov overlay'ini o'zi quradi va tayyor bo'lganda api.reveal(kechikish_ms) ni chaqiradi.
    if (typeof window.__CUSTOM_OPEN__ === "function") {
      window.__CUSTOM_OPEN__({ reveal: reveal, startMusic: startMusicNow, esc: esc2, sealTxt: sealTxt, namesTxt: namesTxt, dateTxt: dateTxt });

    } else if (openType === "heart") {
      ov.className += " cover heart-open";
      ov.innerHTML = '<div class="cov-pre">Taklifnoma</div><button class="heart-btn" aria-label="Ochish">&#10084;</button><div class="cov-hint">Yurakni bosing</div>';
      document.body.appendChild(ov);
      var hb = ov.querySelector(".heart-btn");
      hb.addEventListener("click", function(){ if (revealed) return; hb.classList.add("burst"); reveal(650); });

    } else if (openType === "fold") {
      // konvert — 4 burchak (X) ochilib, o'rtadagi muhr yo'qoladi.
      // Har flapda bir xil to'liq-ekran relief (bo'rtma) gul naqsh — flaplar bilan birga bo'linadi.
      ov.className += " foldscreen";
      var cl = function(x, y, s){ return '<use href="#cl" transform="translate(' + x + ',' + y + ') scale(' + s + ')"/>'; };
      var flora = '<svg class="flap-flora" viewBox="0 0 440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">'
        + '<defs>'
        + '<filter id="emb" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="-0.7" dy="-0.7" stdDeviation="0.5" flood-color="#ffffff" flood-opacity="0.9"/><feDropShadow dx="1.1" dy="1.3" stdDeviation="1" flood-color="#ab9260" flood-opacity="0.55"/></filter>'
        + '<g id="bloom"><ellipse cx="0" cy="-9" rx="5" ry="9"/><ellipse cx="0" cy="-9" rx="5" ry="9" transform="rotate(72)"/><ellipse cx="0" cy="-9" rx="5" ry="9" transform="rotate(144)"/><ellipse cx="0" cy="-9" rx="5" ry="9" transform="rotate(216)"/><ellipse cx="0" cy="-9" rx="5" ry="9" transform="rotate(288)"/><circle r="3.6" fill="#f4ead4"/></g>'
        + '<g id="leaf"><path d="M0 0 C 9 -6 14 -19 0 -28 C -14 -19 -9 -6 0 0 Z"/></g>'
        + '<g id="cl"><use href="#leaf" transform="translate(-13,5) rotate(-35) scale(.85)"/><use href="#leaf" transform="translate(13,5) rotate(35) scale(.85)"/><use href="#leaf" transform="translate(0,-4) scale(.8)"/><use href="#bloom" transform="translate(-10,-3) scale(.82)"/><use href="#bloom" transform="translate(10,-3) scale(.82)"/><use href="#bloom" transform="translate(0,-13) scale(1)"/></g>'
        + '</defs>'
        + '<g fill="#e4d3af" filter="url(#emb)" opacity=".95">'
        // yuqori garland
        + cl(220,50,1.35) + cl(150,58,1) + cl(290,58,1) + cl(96,82,.85) + cl(344,82,.85) + cl(52,122,.75) + cl(388,122,.75)
        // yuqori diagonallar
        + cl(120,205,.82) + cl(320,205,.82) + cl(162,298,.72) + cl(278,298,.72) + cl(60,330,.7) + cl(380,330,.7)
        // yon o'rta
        + cl(44,450,.78) + cl(396,450,.78)
        // muhr atrofida halqa (markaz ~220,450)
        + cl(150,442,.9) + cl(290,442,.9) + cl(188,392,.8) + cl(252,392,.8) + cl(188,508,.8) + cl(252,508,.8) + cl(220,366,.78) + cl(220,530,.9)
        // pastki diagonallar
        + cl(60,560,.7) + cl(380,560,.7) + cl(150,600,.75) + cl(290,600,.75) + cl(110,690,.82) + cl(330,690,.82)
        // pastki buket
        + cl(220,832,1.7) + cl(160,850,1.1) + cl(280,850,1.1) + cl(106,864,.9) + cl(334,864,.9) + cl(56,878,.72) + cl(384,878,.72)
        + '</g></svg>';
      // Shablon o'z konvert naqshini bersa (window.__FOLD_ART__), o'shani ishlatamiz
      if (typeof window.__FOLD_ART__ === "string") flora = window.__FOLD_ART__;
      ov.innerHTML = '<div class="fold-glow"></div>'
        + '<div class="flap flap-t">' + flora + '</div><div class="flap flap-b">' + flora + '</div><div class="flap flap-l">' + flora + '</div><div class="flap flap-r">' + flora + '</div>'
        + '<div class="fold-pre">Taklifnoma</div>'
        + '<div class="fold-seal">' + esc2(sealTxt) + '</div>'
        + '<div class="fold-hint">Ochish uchun bosing</div>';
      document.body.appendChild(ov);
      var fOpened = false;
      ov.addEventListener("click", function(){ if (fOpened || revealed) return; fOpened = true; ov.classList.add("open"); reveal(900); });

    } else if (openType === "gate") {
      // Islomiy arka/darvoza — ikki tabaqa 3D ochiladi, ichidagi taklifnoma ko'rinadi
      ov.className += " gatescreen";
      var gart = (typeof window.__GATE_ART__ === "string") ? window.__GATE_ART__ : "";
      ov.innerHTML = '<div class="fold-glow"></div>'
        + '<div class="gate-panel gp-l">' + gart + '</div><div class="gate-panel gp-r">' + gart + '</div>'
        + '<div class="fold-pre">Taklifnoma</div>'
        + '<div class="fold-seal">' + esc2(sealTxt) + '</div>'
        + '<div class="fold-hint">Ochish uchun bosing</div>';
      document.body.appendChild(ov);
      var gOpened = false;
      ov.addEventListener("click", function(){ if (gOpened || revealed) return; gOpened = true; ov.classList.add("open"); reveal(2300); });

    } else if (openType === "gate3d") {
      // REAL rasmli 3D dekorativ eshik — 2 tabaqa menteshadan ochiladi, ortida sahna, matn blur bilan paydo
      ov.className += " scene";
      ov.innerHTML = '<div class="scene-scrim"></div>'
        + '<div class="doors">'
        +   '<div class="door door-left"><div class="door-side"></div><div class="door-face"><div class="leaf"></div></div></div>'
        +   '<div class="door door-right"><div class="door-side"></div><div class="door-face"><div class="leaf"></div></div></div>'
        + '</div>'
        + '<div class="seam-glow"></div>'
        + '<div class="g3d-hint">Taklifnomani ochish uchun bosing</div>';   // ismsiz, tugmasiz — pastda nozik yozuv
      // Shablon eshik ustiga o'z bezagini bersa (masalan: o'rtadagi surg'uch muhr) — window.__G3D_EXTRA__
      if (typeof window.__G3D_EXTRA__ === "string") ov.insertAdjacentHTML("beforeend", window.__G3D_EXTRA__);
      document.body.appendChild(ov);
      var g3Opened = false;
      ov.addEventListener("click", function(){ if (g3Opened || revealed) return; g3Opened = true; revealed = true;  // ekranning istalgan joyiga bosilsa ochiladi
        startMusicNow();
        // Eshik 3D ochila boshlaydi. Tabaqalar JS bilan (har kadrda) aylantiriladi — CSS transition bilan emas:
        // iPhone (Telegram ichidagi brauzer) kechiktirilgan (transition-delay) 3D transitionni bajarmay, eshikni birdan
        // ochib yuborardi. Vaqtlar shablon CSS'idan o'qiladi (davomiylik, kechikish, easing) — dizayn o'zgarmaydi.
        setTimeout(function(){
          var doors = [].slice.call(ov.querySelectorAll(".door"));
          var ms = function(v, def){ var s = String(v || "").split(",")[0].trim(), n = parseFloat(s); if (isNaN(n)) return def; return /ms$/.test(s) ? n : n * 1000; };
          var cs0 = doors[0] ? getComputedStyle(doors[0]) : null;
          var dDur = cs0 ? ms(cs0.transitionDuration, 2800) : 2800, dDel = cs0 ? ms(cs0.transitionDelay, 0) : 0;
          var bz = cs0 ? /cubic-bezier\(([^)]+)\)/.exec(cs0.transitionTimingFunction || "") : null;
          var P = bz ? bz[1].split(",").map(parseFloat) : [.42, 0, .2, 1];
          if (P.length !== 4 || P.some(isNaN)) P = [.42, 0, .2, 1];
          var ease = function(t){                                   // cubic-bezier(x1,y1,x2,y2) — CSS'dagi kabi
            var s = t, i, x, dx;
            for (i = 0; i < 8; i++) {
              x = ((1 - 3 * P[2] + 3 * P[0]) * s + (3 * P[2] - 6 * P[0])) * s * s + 3 * P[0] * s - t;
              dx = 3 * (1 - 3 * P[2] + 3 * P[0]) * s * s + 2 * (3 * P[2] - 6 * P[0]) * s + 3 * P[0];
              if (Math.abs(dx) < 1e-6) break;
              s = Math.max(0, Math.min(1, s - x / dx));
            }
            return ((1 - 3 * P[3] + 3 * P[1]) * s + (3 * P[3] - 6 * P[1])) * s * s + 3 * P[1] * s;
          };
          ov.classList.add("opening");
          var leaves = [].slice.call(ov.querySelectorAll(".door-face,.door-side"));
          var csf = leaves[0] ? getComputedStyle(leaves[0]) : null;
          var fDel = csf ? ms(csf.transitionDelay, 2200) : 2200, fDur = csf ? ms(csf.transitionDuration, 600) : 600;
          // Telefonda «Harakatni kamaytirish» (Reduce Motion) yoqilgan bo'lsa, base.css barcha transition'larni 0.001s qiladi —
          // CSS'dan o'qilgan davomiylik yaroqsiz bo'lib, eshik birdan ochilib ketardi. Eshik — taklifnomaning asosiy qismi va
          // sekin, yumshoq harakat, shuning uchun u doim to'liq ko'rsatiladi: haqiqiy vaqtlar shablondan (window.__G3D__) olinadi.
          if (G3.door) { dDel = G3.door[0]; dDur = G3.door[1]; }
          else if (dDur < 50) { dDel = G3.done ? 2550 : 0; dDur = G3.done ? Math.max(1200, G3.done - 2800) : 2800; }
          if (G3.fade) { fDel = G3.fade[0]; fDur = G3.fade[1]; }
          else if (fDur < 50) { fDur = 600; fDel = Math.max(0, dDel + dDur - 600); }
          var total = Math.max(dDel + dDur, fDel + fDur);
          doors.forEach(function(d){ d.style.transition = "none"; });
          leaves.forEach(function(l){ l.style.transition = "none"; l.style.opacity = "1"; });
          var draw = function(t){
            var k = ease(Math.max(0, Math.min(1, (t - dDel) / Math.max(1, dDur)))), a = (115 * k).toFixed(2);
            var o = (1 - Math.max(0, Math.min(1, (t - fDel) / Math.max(1, fDur)))).toFixed(3);
            doors.forEach(function(d){ d.style.transform = "rotateY(" + (d.classList.contains("door-left") ? "-" : "") + a + "deg)"; });
            leaves.forEach(function(l){ l.style.opacity = o; });
          };
          ov.__draw = draw;                                         // sinov uchun: istalgan ondagi kadr
          draw(0);
          // Soat: rAF + zaxira interval (rAF to'xtab qolsa ham davom etadi); bitta kadr 100ms dan ortiq "sakramaydi"
          var T = 0, last = 0, ended = false, lastRaf = 0, iv = 0;
          var end = function(){ if (ended) return; ended = true; clearInterval(iv); draw(total); if (ov && ov.parentNode) ov.parentNode.removeChild(ov); };
          var step = function(now){
            if (ended) return;
            if (!last) last = now;
            T += Math.min(100, Math.max(0, now - last)); last = now;
            if (T >= total) return end();
            draw(T);
          };
          var raf = function(now){ if (ended) return; lastRaf = Date.now(); step(now); requestAnimationFrame(raf); };
          requestAnimationFrame(raf);
          iv = setInterval(function(){ if (Date.now() - lastRaf > 60) step(performance.now()); }, 33);
          setTimeout(end, total * 2 + 1500);                        // KAFOLAT: har qanday holatda overlay olib tashlanadi
        }, 150);
        // Eshik ochilayotganda ismlar ORQADA asta namoyon bo'ladi — va shu ondayoq skroll ochiladi:
        // mehmon eshik to'liq ochilishini (2.8s) kutmaydi, overlay teginishlarni ushlamaydi (pointer-events:none)
        // Vaqtlarni shablon o'zgartira oladi (masalan: sekinroq eshik) — window.__G3D__ = { show: ms, done: ms }
        var G3 = window.__G3D__ || {};
        setTimeout(function(){
          if (card) card.classList.add("show");
          document.body.style.overflow = "auto";
          ov.style.pointerEvents = "none";
        }, G3.show || 700);
        // Tabaqalar oxirida asta so'nadi (base.css), so'ng overlay ko'rinmas holda olib tashlanadi — kadr sakramaydi
        // (overlayni yuqoridagi JS animatsiya o'zi tugagach olib tashlaydi; bu — zaxira, animatsiya umuman boshlanmasa)
        setTimeout(function(){ if (ov && ov.parentNode) ov.parentNode.removeChild(ov); }, (G3.done || 3000) * 2 + 2000);
      });

    } else {
      // slide (standart) — chapdan o'ngga suriladi
      ov.className += " lockscreen";
      ov.innerHTML = '<div class="lock-pre">Siz taklifnoma oldingiz</div><div class="lock-names">' + esc2(namesTxt) + '</div><div class="lock-date">' + esc2(dateTxt) + '</div><div class="lock-track"><div class="lock-fill"></div><span class="lock-text">Ochish uchun suring →</span><div class="lock-handle">→</div></div>';
      document.body.appendChild(ov);
      // Shablon slide ekraniga bezak bersa (window.__LOCK_ART__)
      if (typeof window.__LOCK_ART__ === "string") ov.insertAdjacentHTML("afterbegin", window.__LOCK_ART__);
      var track = ov.querySelector(".lock-track"), handle = ov.querySelector(".lock-handle"), fill = ov.querySelector(".lock-fill");
      var dragging = false, startX = 0, x = 0, maxX = 0, raf = 0;
      handle.style.willChange = "transform";
      function applyDrag(){ raf = 0; handle.style.transform = "translateX(" + x + "px)"; fill.style.width = (handle.offsetWidth + x) + "px"; if (x >= maxX - 2) reveal(600); }
      function move(v){ x = Math.max(0, Math.min(v, maxX)); if (!raf) raf = requestAnimationFrame(applyDrag); }
      handle.addEventListener("pointerdown", function(e){ dragging = true; maxX = track.clientWidth - handle.offsetWidth - 8; startX = e.clientX - x; handle.style.transition = "none"; try{ handle.setPointerCapture(e.pointerId); }catch(_){} });
      window.addEventListener("pointermove", function(e){ if (dragging) move(e.clientX - startX); });
      window.addEventListener("pointerup", function(){ if (!dragging) return; dragging = false; if (!revealed){ handle.style.transition = "transform .3s ease"; x = 0; handle.style.transform = "translateX(0)"; fill.style.width = handle.offsetWidth + "px"; } });
    }
    applyLang(LANG);
  }

  // Musiqa: ochilishdan tashqari, har qanday birinchi teginish/skrollда ham boshlansin
  // (surish/bosib-turish rAF ichida bloklansa — zaxira). "O'chirilgan" holat saqlanmaydi.
  if (music) {
    // iPhone faqat touchend/click da chalishga ruxsat beradi (touchstart/pointerdown
    // da play() rad etiladi) - shuning uchun hammasini tinglaymiz va qo'shiq
    // HAQIQATAN boshlangandagina tinglovchilarni olib tashlaymiz. Keyin mehmon
    // o'chirsa, skroll/teginish qo'shiqni qayta yoqmaydi.
    var GESTURES = ["pointerdown","touchstart","touchend","pointerup","click","keydown","scroll"];
    var _mgs = function(e){
      // Shablon o'zi skroll qilayotganda (window.__AUTO_SCROLLING__, masalan osh-hovli) "scroll" teginish emas — play() urinmaymiz
      if (e && e.type === "scroll" && window.__AUTO_SCROLLING__) return;
      if (music && !music.playing()) music.play();
    };
    var disarm = function(){
      GESTURES.forEach(function(ev){ window.removeEventListener(ev, _mgs); });
    };
    var armGesture = function(){
      GESTURES.forEach(function(ev){ window.addEventListener(ev, _mgs, { passive: true }); });
    };
    audioEl.addEventListener("playing", disarm);
    armGesture();

    // Qaytib kirganda qo'shiq YANA chalinsin (oldin o'chirilgan bo'lsa ham).
    // iPhone/Telegram sahifani xotiradan (bfcache) tiklaydi - skript qayta
    // ishlamaydi, qo'shiq esa o'chirilgan holatda qolib ketardi.
    var resumeOnReturn = function(){
      if (!revealed || music.playing()) return;   // hali ochilmagan - ochilishning o'zi boshlaydi
      music.play(armGesture);                      // iOS bloklasa - birinchi teginishda
    };
    document.addEventListener("visibilitychange", function(){
      if (document.hidden) { if (music.playing()) music.pause(); }  // chiqib ketganda fonda chalinmasin
      else resumeOnReturn();
    });
    window.addEventListener("pageshow", function(e){ if (e.persisted) resumeOnReturn(); });
  }

  // Gultojlar
  var c = id("petals");
  if (c && !reduce && !PREVIEW) {
    var g2 = c.getContext("2d"), P = [], W, H;
    var cssPetal = getComputedStyle(document.documentElement).getPropertyValue("--petal").trim();
    var col = cssPetal || c.getAttribute("data-color") || "201,162,75";
    function rz(){ W = c.width = innerWidth; H = c.height = innerHeight; }
    rz(); addEventListener("resize", rz);
    var PN = innerWidth < 600 ? 14 : 22;
    for (var i = 0; i < PN; i++) P.push({ x:Math.random()*W, y:Math.random()*H, r:Math.random()*2+1, sp:Math.random()*.4+.15, dr:Math.random()*.6-.3, ph:Math.random()*6.28 });
    (function draw(){
      g2.clearRect(0,0,W,H);
      for (var i=0;i<P.length;i++){ var p=P[i]; p.y += p.sp; p.x += Math.sin(p.y/60+p.ph)*.3 + p.dr*.2;
        if (p.y > H+8){ p.y=-8; p.x=Math.random()*W; }
        g2.beginPath(); g2.arc(p.x,p.y,p.r,0,6.28); g2.fillStyle = "rgba("+col+","+(.35+p.r/8)+")"; g2.fill(); }
      requestAnimationFrame(draw);
    })();
  } else if (c && PREVIEW) { c.style.display = "none"; }

  // Admin bot orqali qo'yilgan matn almashtirish (INV.textMap) — butun sahifada: shablonning o'z matnlari, kirish ekranlari
  // va keyin chiqadigan oynalar ham (MutationObserver). Yozuv to'liq mos kelsa almashadi (katta-kichik harfga qaramaydi).
  (function(){
    var any = false; for (var l in TMAP) for (var k in TMAP[l]) { any = true; break; }
    if (!any || !document.body || !window.MutationObserver) return;
    var mine = typeof WeakMap === "function" ? new WeakMap() : null, busy = false;
    function fixNode(n){
      var t = n.nodeValue; if (!t) return; var s = t.trim(); if (!s || s.length > 200) return;
      if (mine && mine.get(n) === t) return;                                // o'zimiz qo'ygan matn — qayta tegilmaydi
      var p = n.parentNode; if (!p || p.nodeType !== 1 || /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(p.tagName) || (p.closest && p.closest("#langBtn,.wish-list,.wish-form"))) return;
      var v = tmOf(LANG, s); if (v == null || v === s) return;
      var nt = t.replace(s, v); n.nodeValue = nt; if (mine) mine.set(n, nt);
    }
    function walk(root){ if (!root) return; if (root.nodeType === 3) { fixNode(root); return; } if (root.nodeType !== 1) return;
      var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false), n; while ((n = w.nextNode())) fixNode(n); }
    walk(document.body);
    var q = []; function flush(){ busy = true; var a = q; q = []; for (var i = 0; i < a.length; i++) walk(a[i]); busy = false; }
    new MutationObserver(function(ms){ if (busy) return; for (var i = 0; i < ms.length; i++) { var m = ms[i];
      if (m.type === "characterData") q.push(m.target); else for (var j = 0; j < m.addedNodes.length; j++) q.push(m.addedNodes[j]); }
      if (q.length) flush(); }).observe(document.body, { childList: true, subtree: true, characterData: true });
  })();

  // ---------- Mehmon ismi: havolada ?mehmon=Aziz aka va oilasi bo'lsa — kirish ekranida va «Aziz mehmon» sarlavhasi ostida chiqadi ----------
  // (mijoz havolalarni o'zi yaratadi: /t/<kod>/mehmonlar sahifasi; bot: /mehmonlar <havola>). Shrift va rang — shu dizaynning ismlaridan.
  (function(){
    var g = ""; try { g = (new URLSearchParams(location.search).get("mehmon") || "").replace(/\s+/g, " ").trim().slice(0, 60); } catch (e) {}
    if (!g || PREVIEW) return;
    window.__GUEST__ = g;
    if (!id("gstCss")) { var st = document.createElement("style"); st.id = "gstCss";
      st.textContent = ".gst-ov{text-transform:none;letter-spacing:normal;line-height:1.15;margin:8px auto 12px;text-align:center;max-width:90%;position:relative;z-index:3;word-wrap:break-word}"
        + ".gst-ov.gst-fix{position:absolute;left:5%;right:5%;bottom:16%;z-index:20;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.45)}"
        + ".gst-in{line-height:1.15;margin:4px auto 12px;text-align:center;max-width:92%;word-wrap:break-word}";
      document.head.appendChild(st); }
    // dizaynning ism shrifti (kuyov ismi), o'lchami — ism o'lchamining ~60%
    function look(el, colorFrom, k){
      var src = id("kuyov") || id("kelin") || document.querySelector(".c-names,.names,.nm,h1"); if (!src) return;
      var cs = getComputedStyle(src), fz = parseFloat(cs.fontSize) || 40;
      el.style.fontFamily = cs.fontFamily; el.style.fontWeight = cs.fontWeight; el.style.fontStyle = cs.fontStyle;
      var it = /Italianno/i.test(cs.fontFamily) ? 1.3 : 1;      // Italianno kichik ko'rinadi — 1.3 baravar
      el.style.fontSize = Math.max(it > 1 ? 32 : 26, Math.min(50, fz * (k || .62) * it)) + "px";
      el.style.color = colorFrom ? getComputedStyle(colorFrom).color : cs.color;
    }
    // 1) kirish ekrani: «… ochish uchun bosing» yozuvi ustida
    // Joyi: 1) kirish ekranidagi kelin-kuyov ismlari ostida (o'sha yozuv rangida); 2) bo'lmasa — «… ochish uchun bosing» ustida; 3) bo'lmasa — pastda.
    // Shablon o'zi ko'rsatsa (masalan, Baxt reysi — talonda) — window.__NO_GUEST_OV__ = true
    function onOv(ov){
      if (!ov || ov.__gst || window.__NO_GUEST_OV__) return; ov.__gst = 1;
      var d = document.createElement("div"); d.className = "gst-ov"; d.textContent = g;
      var k = String(INV.kuyov || "").trim(), e2 = String(INV.kelin || "").trim(), nm = null;
      if (e2 === k) e2 = "";      // bitta ism (sunnat, tug'ilgan kun)
      if (k) { var lim = (k + String(INV.kelin || "")).length + 14;
        [].forEach.call(ov.querySelectorAll("*"), function(e){ if (/^(SCRIPT|STYLE|SVG|PATH)$/i.test(e.tagName)) return;
          var t = (e.textContent || "").trim(); if (t.indexOf(k) >= 0 && (!e2 || t.indexOf(e2) >= 0) && t.length <= lim && (!nm || nm.contains(e))) nm = e; }); }      // ikkala ism birga turgan eng ichki blok
      while (nm && nm !== ov && /^inline/.test(getComputedStyle(nm).display)) nm = nm.parentElement;
      if (nm && nm !== ov && nm.parentNode) {
        if (/^(absolute|fixed)$/.test(getComputedStyle(nm).position)) nm.appendChild(d); else nm.parentNode.insertBefore(d, nm.nextSibling);
        look(d, nm, .5); return;
      }
      var hint = ov.querySelector('[class*="hint"]') || ov.querySelector(".h");
      if (hint && hint.parentNode) {
        // yozuv pastga mahkamlangan bo'lsa (absolute) — ism uning ichida, ustida; aks holda — oldida
        if (!/^(absolute|fixed)$/.test(getComputedStyle(hint).position)) hint.parentNode.insertBefore(d, hint);
        else if (hint.children.length) hint.insertBefore(d, hint.firstChild);
        else {      // faqat matnli yozuv (shablon uning matnini qayta yozadi) — ism yonida, aynan ustiga mahkamlanadi
          hint.parentNode.insertBefore(d, hint);
          d.style.position = "absolute"; d.style.left = "50%"; d.style.width = "max-content"; d.style.maxWidth = "88%"; d.style.margin = "0"; d.style.top = "auto"; d.style.zIndex = "5";
          d.style.webkitTransform = d.style.transform = "translateX(-50%)";
          var hb = getComputedStyle(hint).backgroundColor;      // yozuvning yarim shaffof foni bo'lsa — ismga ham (gulli/rasmli fonda o'qilsin)
          if (hb && !/^(transparent|rgba\(0, 0, 0, 0\))$/.test(hb)) { d.style.background = hb; d.style.borderRadius = "18px"; d.style.padding = "4px 16px 6px"; }
          var place = function(){ var pr = hint.parentNode.getBoundingClientRect(), hr = hint.getBoundingClientRect(); if (hr.height) d.style.bottom = Math.round(pr.bottom - hr.top + 8) + "px"; };
          place(); setTimeout(place, 400); setTimeout(place, 1500); window.addEventListener("resize", place);
        }
        look(d, hint, .58); return; }
      d.className += " gst-fix"; ov.appendChild(d); look(d, null, .58); d.style.color = "#fff";
    }
    var ov0 = document.querySelector(".opening-ov"); if (ov0) onOv(ov0);
    if (window.MutationObserver) { var mo = new MutationObserver(function(ms){ ms.forEach(function(m){ [].forEach.call(m.addedNodes, function(n){ if (n.nodeType === 1 && n.classList && n.classList.contains("opening-ov")) onOv(n); }); }); });
      mo.observe(document.body, { childList: true }); setTimeout(function(){ mo.disconnect(); }, 8000); }
    // 2) ichkarida: «Aziz mehmon» sarlavhasi ostida (stol havolasida ism stol kartochkasida bor)
    if (/[?&]stol=/.test(location.search) || window.__NO_GUEST_IN__) return;      // shablon ismni o'zi ko'rsatsa (masalan, «Dear Aziz,») — window.__NO_GUEST_IN__
    var card = id("card"); if (!card) return;
    var RX = /^(aziz mehmon(lar|im)?|aziz do'stlar va yaqinlar|aziz va qadrdon insonimiz|aziz mehmonlarimiz)!?$/i, hd = null;
    [].some.call(card.querySelectorAll("h1,h2,h3,h4,p,div,span"), function(e){
      if (e.children.length && !e.getAttribute("data-t")) return false;
      var t = ((e.dataset && e.dataset.uz) || e.textContent || "").trim();
      if (RX.test(t) || e.getAttribute("data-t") === "dear") { hd = e; return true; } return false; });
    var n = document.createElement("div"); n.className = "gst-in"; n.textContent = g; n.setAttribute("data-nocyr", "");
    if (hd && hd.parentNode) hd.parentNode.insertBefore(n, hd.nextSibling);
    else { var ld = id("lead"); if (!ld || !ld.parentNode) return; ld.parentNode.insertBefore(n, ld); }
    look(n, hd, .62);
  })();
})();
