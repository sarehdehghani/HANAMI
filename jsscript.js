/* =========================================================
   Hanami · House of Wellness — jsscript.js
   طراح سایت: ساره دهقانی
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k, d = null) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} }
};
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* =========================================================
   ⚙️ تنظیمات — فقط این بخش را با اطلاعات واقعی پر کنید
   ========================================================= */
const CONFIG = {
  WA_NUMBER: '98XXXXXXXXXX',                 // شماره واتساپ سالن، بدون + و بدون صفر (مثلاً 989151234567)
  CARD_NUMBER: '6037 0000 0000 0000',        // شماره کارت
  CARD_OWNER: { fa: ' هنگامه حافظ ', en: 'hengameh hafez' },
  CARD_BANK:  { fa: ' بانک',      en: 'Bank' },
  BOOKING_ENDPOINT: ''                       // آدرس دریافت فرم (Formspree / Web3Forms / ...). خالی = ارسال از راه واتساپ
};

/* مبلغ بیعانه‌ی هر خدمت (به تومان) */
const PRICES = {
  massage: 400000, nails: 200000, pedi: 300000, hair: 500000, facial: 500000, color:1000000,
  restore: 700000, spa: 500000, micro: 800000, makeup: 800000, lash: 300000
};

/* ---------- Content (fa / en) ---------- */
const D = {
  fa: {
    'gate.music':'ورود با موسیقی','gate.silent':'بدون موسیقی',
    'nav.legend':'افسانه','nav.services':'خدمات','nav.gallery':'گالری','nav.mag':'مجله','nav.team':'تیم','nav.contact':'تماس','nav.book':'رزرو نوبت',
    'hero.eyebrow':'خانه‌ی آرامش · 花見',
    'hero.lead':'جایی که زیبایی، مثل شکوفه‌ی گیلاس، آرام و لحظه‌به‌لحظه می‌شکفد. ماساژ، مراقبت از پوست و مو، ناخن، پدیکیور و میکاپ، همه زیر یک سقف.',
    'hero.cta1':'رزرو نوبت','hero.cta2':'مشاهده خدمات',
    'legend.eyebrow':'نام ما از کجا آمد','legend.title':'افسانه‌ی هانامی',
    'legend.p1':'هانامی (花見) در زبان ژاپنی یعنی «تماشای گل». سنتی کهن که هر بهار مردم زیر درختان شکوفه‌ی گیلاس جمع می‌شوند، چای می‌نوشند و زیبایی گذرای لحظه را جشن می‌گیرند.',
    'legend.p2':'شکوفه‌ها چند روز بیشتر نمی‌مانند و همین گذرا بودن، آن‌ها را ارزشمند می‌کند. هانامی هاوس آو ولنس همین حس را به مراقبت از شما می‌آورد: توقفی آرام برای دیده شدن و شکفتن.',
    'legend.quote':'زیبایی در لحظه‌ای است که برای خودتان می‌ایستید.',
    'svc.eyebrow':'مراقبت در هر شکل','svc.title':'خدمات هانامی','svc.book':'رزرو این خدمت','svc.dep':'بیعانه',
    's.massage.n':'ماساژ','s.massage.d':'ماساژ آرامش‌بخش با روغن‌های ملایم، در اتاقی با نور گرم و رایحه‌ی شمع.',
    's.nails.n':'ناخن','s.nails.d':'مانیکور، کاشت و طراحی ناخن با طیف کامل رنگ‌ها.',
    's.pedi.n':'پدیکیور','s.pedi.d':'مراقبت کامل از پا و ناخن‌ها؛ پاک‌سازی، نرم‌کردن پوست و لاک‌زدن در فضایی آرام.',
    's.hair.n':'کوتاهی مو','s.hair.d':'کوتاهی و حالت‌دهی متناسب با فرم صورت و سبک شخصی شما.',
    's.facial.n':'فیشال','s.facial.d':'پاک‌سازی و احیای پوست با محصولات حرفه‌ای و مراقبت مخصوص هر پوست.',
    's.color.n':'رنگ و لایت','s.color.d':'از بلوند خاکستری و هایلایت تا قهوه‌ای عمیق؛ رنگی که به موی شما احترام می‌گذارد.',
    's.restore.n':'احیای مو','s.restore.d':'درمان‌های ترمیمی برای موی خسته، تا دوباره شاداب و پرجان شود.',
    's.spa.n':'هد اسپا','s.spa.d':'شست‌وشو، ماساژ و پاک‌سازی عمیق پوست سر در فضایی آرام؛ آرامش از سر تا شانه.',
    's.micro.n':'میکروبلیدینگ','s.micro.d':'ابرو، آیلاینر دائم و Sakura Lips با ظرافت و رنگ‌های طبیعی.',
    's.makeup.n':'میکاپ','s.makeup.d':'میکاپ روزانه، مهمانی و عروس؛ درخشان و ماندگار.',
    's.lash.n':'مژه','s.lash.d':'اکستنشن و لیفت مژه برای نگاهی پرتر و طبیعی.',
    'gal.eyebrow':'از درون خانه','gal.title':'لحظه‌هایی از هانامی',
    'mag.eyebrow':'راز درخشش','mag.title':'مجله‌ی زیبایی',
    'mag.lead':'نکته‌های ساده‌ی مراقبتی برای هر خدمت؛ چه کارهایی بکنید و از چه کارهایی بپرهیزید.',
    'mag.do':'بهتر است','mag.dont':'نکنید','mag.tip':'نکته‌ی هانامی',
    'team.eyebrow':'دو دوست، یک خانه','team.title':'بنیان‌گذاران',
    'team.p':'هانامی با یک ایده ساخته شد: مراقبت از زیبایی باید حس یک مکث آرام داشته باشد، نه عجله. هر گوشه‌ی این خانه با همین نگاه طراحی شده است.',
    'team.n1':'هنگامه حافظ','team.role':'بنیان‌گذار','team.n2':'میترا طوسی','team.role2':'بنیان‌گذار',
    'book.eyebrow':'یک ساعت برای خودتان','book.title':'رزرو نوبت',
    'book.side':'نوبت‌تان را ثبت کنید؛ بقیه‌اش با ما. یک چای، یک مکث و مراقبتی که شایسته‌ی شماست.',
    'f.name':'نام و نام خانوادگی','f.phone':'شماره تماس','f.service':'خدمت','f.staff':'پرسنل','f.anystaff':'هر کدام (اولین نفر آزاد)',
    'f.date':'تاریخ','f.choosedate':'انتخاب تاریخ','f.time':'ساعت',
    'f.note':'توضیحات (اختیاری)','f.submit':'ثبت نوبت','f.sending':'در حال ارسال…',
    'f.pickfirst':'ابتدا خدمت و تاریخ را انتخاب کنید.','f.choose':'انتخاب کنید…',
    'f.nofree':'برای این روز ساعت خالی نیست.','f.free':'ساعت‌های خط‌خورده پر شده‌اند.',
    'pay.title':'پرداخت بیعانه',
    'pay.help':'مبلغ بیعانه را کارت‌به‌کارت واریز کنید و تصویر رسید را در کادر زیر بارگذاری کنید.',
    'pay.card':'شماره کارت','pay.owner':'به نام','pay.bank':'بانک','pay.copy':'کپی','pay.copied':'کپی شد',
    'pay.upload':'بارگذاری تصویر رسید','pay.drag':'کلیک کنید یا تصویر را اینجا رها کنید','pay.remove':'حذف تصویر',
    'pay.err':'فقط فایل تصویری (حداکثر ۱۵ مگابایت) انتخاب کنید.',
    'ok.title':'نوبت شما ثبت شد',
    'ok.sent':'نوبت و رسید شما ارسال شد. پس از بررسی، تأیید نهایی انجام می‌شود.',
    'ok.manual':'برای قطعی شدن، تصویر رسید را همراه کد نوبت در واتساپ برای ما بفرستید.',
    'ok.fail':'ارسال خودکار انجام نشد.',
    'ok.wa':'ارسال در واتساپ','ok.share':'ارسال تصویر رسید','ok.close':'بستن','ok.dep':'بیعانه',
    'foot.about':'خانه‌ی زیبایی و آرامش، با الهام از سنت هانامی و فضای گرم ژاپنی.',
    'foot.hours':'ساعت کار','foot.hoursv':'همه‌روزه ۱۰ تا ۲۰','foot.addr':'نشانی','foot.addrv':'مشهد، حامد جنوبی ۱، پلاک ۶۴','foot.contact':'ارتباط',
    'foot.credit':'طراح سایت: ساره دهقانی'
  },
  en: {
    'gate.music':'Enter with music','gate.silent':'Without music',
    'nav.legend':'Legend','nav.services':'Services','nav.gallery':'Gallery','nav.mag':'Journal','nav.team':'Team','nav.contact':'Contact','nav.book':'Book now',
    'hero.eyebrow':'A house of calm · 花見',
    'hero.lead':'Where beauty, like cherry blossom, unfolds slowly and in its own time. Massage, skin and hair care, nails, pedicure and makeup — all under one roof.',
    'hero.cta1':'Book an appointment','hero.cta2':'Explore services',
    'legend.eyebrow':'Where our name comes from','legend.title':'The Legend of Hanami',
    'legend.p1':'Hanami (花見) is Japanese for “flower viewing”. An old custom in which, each spring, people gather beneath blooming cherry trees to share tea and celebrate the fleeting beauty of the moment.',
    'legend.p2':'Blossoms last only days, and that brevity is what makes them precious. Hanami House of Wellness brings this feeling to your care: a quiet pause to be seen, and to bloom.',
    'legend.quote':'Beauty is the moment you stop for yourself.',
    'svc.eyebrow':'Care in every form','svc.title':'Our Services','svc.book':'Book this service','svc.dep':'Deposit',
    's.massage.n':'Massage','s.massage.d':'Soothing massage with gentle oils, in a softly lit room scented by candlelight.',
    's.nails.n':'Nails','s.nails.d':'Manicure, extensions and nail art in a full palette of shades.',
    's.pedi.n':'Pedicure','s.pedi.d':'Complete foot and toenail care: cleansing, softening and polish in a calm setting.',
    's.hair.n':'Haircut','s.hair.d':'Cuts and styling shaped around your features and personal style.',
    's.facial.n':'Facial','s.facial.d':'Cleansing and renewal with professional products, tailored to your skin.',
    's.color.n':'Color & Highlights','s.color.d':'From ash blonde and highlights to deep chestnut — colour that respects your hair.',
    's.restore.n':'Hair Restoration','s.restore.d':'Restorative treatments for tired hair, bringing it back to life.',
    's.spa.n':'Head Spa','s.spa.d':'Cleansing, massage and deep scalp care in a quiet space; calm from head to shoulders.',
    's.micro.n':'Microblading','s.micro.d':'Brows, permanent eyeliner and Sakura Lips, finished with delicacy.',
    's.makeup.n':'Makeup','s.makeup.d':'Day, evening and bridal makeup — luminous and long-lasting.',
    's.lash.n':'Lashes','s.lash.d':'Extensions and lifts for a fuller, natural-looking gaze.',
    'gal.eyebrow':'Inside the house','gal.title':'Moments at Hanami',
    'mag.eyebrow':'The secret to glowing','mag.title':'The Beauty Journal',
    'mag.lead':'Simple care tips for every service: what to do, and what to avoid.',
    'mag.do':'Do','mag.dont':'Avoid','mag.tip':'Hanami tip',
    'team.eyebrow':'Two friends, one house','team.title':'The Founders',
    'team.p':'Hanami began with one idea: beauty care should feel like a calm pause, not a rush. Every corner of this house was designed with that in mind.',
    'team.n1':'Hengameh Hafez','team.role':'Founder','team.n2':'Mitra Tousi','team.role2':'Founder',
    'book.eyebrow':'An hour for yourself','book.title':'Book an Appointment',
    'book.side':'Reserve your time and leave the rest to us. A cup of tea, a pause, and care you deserve.',
    'f.name':'Full name','f.phone':'Phone number','f.service':'Service','f.staff':'Specialist','f.anystaff':'Any available',
    'f.date':'Date','f.choosedate':'Select a date','f.time':'Time',
    'f.note':'Notes (optional)','f.submit':'Confirm booking','f.sending':'Sending…',
    'f.pickfirst':'Pick a service and a date first.','f.choose':'Choose…',
    'f.nofree':'No free slots on this day.','f.free':'Struck-through times are taken.',
    'pay.title':'Deposit payment',
    'pay.help':'Pay the deposit by card-to-card transfer, then upload the receipt image below.',
    'pay.card':'Card number','pay.owner':'Card holder','pay.bank':'Bank','pay.copy':'Copy','pay.copied':'Copied',
    'pay.upload':'Upload receipt image','pay.drag':'Click or drop the image here','pay.remove':'Remove image',
    'pay.err':'Please choose an image file (max 15 MB).',
    'ok.title':'Your booking is saved',
    'ok.sent':'Your booking and receipt were sent. You will receive the final confirmation after review.',
    'ok.manual':'To finalise, send the receipt image with your booking code on WhatsApp.',
    'ok.fail':'Automatic sending failed.',
    'ok.wa':'Send on WhatsApp','ok.share':'Send receipt image','ok.close':'Close','ok.dep':'Deposit',
    'foot.about':'A house of beauty and calm, inspired by the hanami tradition and warm Japanese interiors.',
    'foot.hours':'Opening hours','foot.hoursv':'Daily, 10:00 – 20:00','foot.addr':'Address','foot.addrv':'Hamed Jonoubi 1, No. 64, Mashhad','foot.contact':'Contact',
    'foot.credit':'Website design by Sareh Dehghani'
  }
};

const SERVICES = [
  { id:'massage', ic:'bi-droplet-half' },
  { id:'nails',   ic:'bi-stars' },
  { id:'pedi',    ic:'bi-person-walking' },
  { id:'hair',    ic:'bi-scissors' },
  { id:'facial',  ic:'bi-flower3' },
  { id:'color',   ic:'bi-palette2' },
  { id:'restore', ic:'bi-heart-pulse' },
  { id:'spa',     ic:'bi-cloud-drizzle' },
  { id:'micro',   ic:'bi-pen' },
  { id:'makeup',  ic:'bi-brush' },
  { id:'lash',    ic:'bi-eye' }
];

/* پرسنل هر خدمت — هر وقت کسی اضافه یا کم شد فقط همین‌جا را عوض کنید */
const STAFF = {
  nails:   [{id:'fereshteh',fa:'فرشته',en:'Fereshteh'},{id:'ghazal',fa:'غزل',en:'Ghazal'},
            {id:'maedeh',fa:'مائده',en:'Maedeh'},{id:'firouzeh',fa:'فیروزه',en:'Firouzeh'}],
  lash:    [{id:'fereshteh',fa:'فرشته',en:'Fereshteh'},{id:'farnaz',fa:'فرناز',en:'Farnaz'}],
  massage: [{id:'nafas',fa:'نفس',en:'Nafas'},{id:'saba',fa:'صبا',en:'Saba'},{id:'monireh',fa:'منیره',en:'Monireh'}]
};

/* گالری: همه عکس هستند. عکس پدیکیور را با نام pedicure.jpg کنار بقیه بگذارید */
const GALLERY = [
  { img:'nails.jpg',        fa:'ناخن',          en:'nails' },
  // { img:'pedicure.jpg',     fa:'پدیکیور',       en:'Pedicure' },
  { img:'hair-flowers.jpg', fa:'کوتاهی مو',     en:'Haircut' },
  { img:'skincare.jpg',     fa:'فیشال',         en:'Facial' },
  { img:'artist.jpg',       fa:'رنگ و لایت',    en:'Color & Highlights' },
  { img:'scalp-spa.jpg',    fa:'احیای مو',      en:'Hair Restoration' },
  { img:'microblading.jpg', fa:'میکروبلیدینگ',  en:'Microblading' },
  { img:'makeup.jpg',       fa:'میکاپ',         en:'Makeup' },
  { img:'brows-lashes.jpg', fa:'مژه',           en:'Lashes' }
];

/* ---------- Magazine (نکته‌های مراقبتی) ---------- */
const MAG = {
  massage: {
    fa: { intro:'ماساژ فقط ساعتی روی تخت نیست؛ کاری که قبل و بعدش می‌کنید اثرش را چند برابر می‌کند.',
      do:['قبل از جلسه کمی آب بنوشید و ۱۵ دقیقه زودتر برسید تا بدنتان آرام شود.','هر نقطه‌ی دردناک، حساسیت یا آسیب‌دیدگی قدیمی را به ماساژور بگویید.','فشار را با ماساژور هماهنگ کنید؛ اگر زیاد یا کم بود همان لحظه بگویید.','بعد از جلسه آب بنوشید و اگر می‌شود کمی استراحت کنید.'],
      dont:['با شکم پر یا بلافاصله بعد از غذای سنگین نیایید.','با تب، عفونت پوستی یا آسیب‌دیدگی تازه بدون مشورت پزشک ماساژ نگیرید.','بعد از ماساژ بلافاصله ورزش سنگین یا سونا نروید.','اگر باردار هستید، حتماً قبل از رزرو اطلاع بدهید.'],
      tip:'نفس‌های عمیق و آهسته در طول ماساژ، اثر آرامش را بیشتر می‌کند.' },
    en: { intro:'A massage is more than the hour on the table; what you do before and after multiplies its effect.',
      do:['Drink some water beforehand and arrive 15 minutes early to settle in.','Tell your therapist about sore spots, sensitivities or old injuries.','Agree on pressure together; say so right away if it is too much or too little.','Drink water afterwards and, if you can, rest for a while.'],
      dont:['Do not come on a full stomach or right after a heavy meal.','Do not book with a fever, skin infection or fresh injury without medical advice.','Avoid intense workouts or the sauna straight after your session.','If you are pregnant, let us know before booking.'],
      tip:'Slow, deep breaths during the massage deepen the sense of calm.' }
  },
  nails: {
    fa: { intro:'ناخن‌های زیبا با چند عادت ساده مدت زیادی سالم و براق می‌مانند.',
      do:['هر روز روی کوتیکول روغن یا کرم مخصوص بمالید.','برای کارهای خانه (ظرف‌شویی و شوینده) دستکش بپوشید.','برای ترمیم و حالت‌دهی ناخن‌ها در موعد مقرر به سالن مراجعه کنید.','دست‌ها را مرطوب نگه دارید تا ناخن خشک و شکننده نشود.'],
      dont:['از ناخن به‌عنوان ابزار (باز کردن قوطی، کندن برچسب) استفاده نکنید.','لاک یا ژل را با کندن و کشیدن برنندازید؛ به ناخن طبیعی آسیب می‌زند.','ناخن‌های کاشته‌شده را خودتان با ابزار تیز اصلاح نکنید.','در صورت قرمزی، درد یا تغییر رنگ زیر ناخن، به متخصص نشان دهید.'],
      tip:'کوتیکول را نبرید و فقط آرام عقب بزنید؛ محافظ طبیعی ناخن است.' },
    en: { intro:'A few simple habits keep nails healthy and glossy for much longer.',
      do:['Apply cuticle oil or cream daily.','Wear gloves for washing up and cleaning products.','Come back on schedule for fills and shaping.','Keep hands moisturised so nails stay flexible.'],
      dont:['Do not use nails as tools (opening cans, scraping labels).','Do not peel or pick off polish or gel; it damages the natural nail.','Do not trim extensions yourself with sharp tools.','If you notice redness, pain or colour change under a nail, have it checked.'],
      tip:'Push cuticles back gently rather than cutting them; they are the nail’s natural shield.' }
  },
  pedi: {
    fa: { intro:'پاهای شما هر روز بار بدن را می‌کشند؛ چند عادت ساده بعد از پدیکیور، نرمی و سلامت پا را مدت‌ها نگه می‌دارد.',
      do:['هر شب پاها را بشویید، خوب خشک کنید (مخصوصاً بین انگشتان) و کرم مرطوب‌کننده بمالید.','کفش و جوراب راحت و متناسب با پا بپوشید و جوراب نخی را ترجیح بدهید.','ناخن پا را صاف و نه خیلی کوتاه بگیرید تا ناخن‌فرورفته پیدا نشود.','برای مراقبت منظم، هر ۳ تا ۴ هفته نوبت پدیکیور بگیرید.'],
      dont:['پینه و پوست خشک پاشنه را با تیغ یا ابزار تیز در خانه نبرید.','با زخم باز، قارچ یا عفونت پوستی بدون مشورت پزشک پدیکیور نکنید.','در روز پدیکیور شیو نکنید؛ ریزخراش‌ها خطر عفونت را بالا می‌برند.','کفش تنگ و پاشنه‌بلند را ساعت‌های طولانی نپوشید.'],
      tip:'اگر دیابت یا مشکل گردش خون دارید، قبل از جلسه حتماً به متخصص بگویید.' },
    en: { intro:'Your feet carry you all day; a few simple habits after a pedicure keep them soft and healthy for longer.',
      do:['Wash your feet every night, dry well (especially between the toes) and moisturise.','Wear comfortable, well-fitting shoes and prefer cotton socks.','Cut toenails straight and not too short to avoid ingrown nails.','Book a pedicure every 3–4 weeks for regular care.'],
      dont:['Do not cut calluses or dry heel skin with blades or sharp tools at home.','Do not book with open sores, fungus or a skin infection without medical advice.','Do not shave on the day of your pedicure; tiny nicks raise infection risk.','Do not wear tight shoes or high heels for long hours.'],
      tip:'If you have diabetes or circulation problems, tell your specialist before the session.' }
  },
  hair: {
    fa: { intro:'کوتاهی خوب فقط در سالن تمام نمی‌شود؛ حفظ فرم آن به مراقبت‌های ساده‌ی خانگی بستگی دارد.',
      do:['هر ۶ تا ۸ هفته یک بار سر مو را بزنید تا فرم و سلامت مو حفظ شود.','قبل از استفاده از حرارت، محافظ حرارتی بزنید.','موی خیس را با شانه‌ی دندانه‌درشت باز کنید.','روی بالش ساتن یا ابریشم بخوابید تا موخوره و گره کمتر شود.'],
      dont:['موی خیس را شدید با حوله نمالید.','هر روز با سشوار یا اتوی داغ شکل ندهید.','موخوره را با کشیدن یا کندن درمان نکنید؛ فقط کوتاه‌کردن کمک می‌کند.','موی خیس را با کش محکم نبندید.'],
      tip:'حالت دلخواهتان را با عکس به آرایشگر نشان دهید؛ یک عکس از هزار توضیح بهتر است.' },
    en: { intro:'A great cut does not end at the salon; keeping its shape depends on simple care at home.',
      do:['Trim every 6–8 weeks to keep shape and health.','Use heat protectant before any hot tools.','Detangle wet hair with a wide-tooth comb.','Sleep on satin or silk to reduce breakage and knots.'],
      dont:['Do not rub wet hair roughly with a towel.','Do not style with high heat every day.','Do not try to fix split ends by pulling; only trimming helps.','Do not tie wet hair tightly with elastic bands.'],
      tip:'Bring a reference photo of the look you want; it says more than a thousand words.' }
  },
  facial: {
    fa: { intro:'پوست بعد از فیشال حساس‌تر است؛ ۴۸ ساعت اول مهم‌ترین زمان مراقبت است.',
      do:['هر روز ضدآفتاب بزنید، حتی در هوای ابری.','پوست را با محصولات ملایم و بدون عطر تمیز و مرطوب کنید.','آب فراوان بنوشید و خواب کافی داشته باشید.','اگر پوست حساس یا آکنه‌ای دارید، قبل از جلسه به متخصص بگویید.'],
      dont:['تا ۴۸ ساعت از لایه‌بردار، اسید و محصولات قوی استفاده نکنید.','جوش و پوسته‌ها را با دست نکنید.','بلافاصله بعد از فیشال در آفتاب شدید، سونا یا استخر نباشید.','بدون مشورت، چند محصول جدید را همزمان شروع نکنید.'],
      tip:'ثبات از شدت مهم‌تر است؛ مراقبت ساده‌ی منظم بهتر از درمان‌های پراکنده‌ی سنگین است.' },
    en: { intro:'Skin is more sensitive after a facial; the first 48 hours matter most.',
      do:['Wear sunscreen daily, even on cloudy days.','Cleanse and moisturise with gentle, fragrance-free products.','Drink plenty of water and get enough sleep.','Tell your specialist beforehand if you have sensitive or acne-prone skin.'],
      dont:['Avoid exfoliants, acids and strong actives for 48 hours.','Do not pick at blemishes or flaking skin.','Avoid strong sun, saunas and pools right after your facial.','Do not start several new products at once without advice.'],
      tip:'Consistency beats intensity; simple regular care outperforms occasional heavy treatments.' }
  },
  color: {
    fa: { intro:'رنگ و لایت با مراقبت درست هم درخشان‌تر می‌ماند و هم موی کمتری آسیب می‌بیند.',
      do:['۴۸ ساعت اول بعد از رنگ، موها را نشویید.','از شامپوی مخصوص موی رنگ‌شده و بدون سولفات استفاده کنید.','هفته‌ای یک بار ماسک مو بزنید.','برای ریشه‌ی رشدکرده طبق توصیه‌ی رنگ‌کار نوبت بگیرید.'],
      dont:['با آب خیلی داغ نشویید؛ رنگ زودتر می‌رود.','بعد از رنگ یا دکلره، فوراً اتوی داغ یا درمان شیمیایی دیگر انجام ندهید.','بدون مشورت و تست حساسیت، روی موی دکلره‌شده رنگ خانگی نزنید.','بدون پوشش در آفتاب شدید یا آب کلردار استخر نمانید.'],
      tip:'قبل از شروع، سابقه‌ی رنگ و دکلره‌ی موهایتان را حتماً به رنگ‌کار بگویید.' },
    en: { intro:'With proper care, colour and highlights stay vivid longer and your hair stays healthier.',
      do:['Wait 48 hours after colouring before washing.','Use a sulphate-free shampoo made for coloured hair.','Apply a hair mask once a week.','Schedule root touch-ups as advised by your colourist.'],
      dont:['Do not wash with very hot water; colour fades faster.','Do not use hot irons or other chemical treatments right after colouring or bleaching.','Do not use home dye on bleached hair without advice and a patch test.','Do not stay in strong sun or chlorinated pools without covering your hair.'],
      tip:'Tell your colourist about your full colour and bleach history before you start.' }
  },
  restore: {
    fa: { intro:'موی خسته به زمان و صبر نیاز دارد؛ ترمیم یک مسیر است، نه یک جلسه.',
      do:['بعد از جلسه از شامپو و ماسک پیشنهادی متخصص استفاده کنید.','مصرف حرارت را تا حد ممکن کم کنید.','پوست سر را آرام ماساژ بدهید تا خون‌رسانی بهتر شود.','تغذیه‌ی متعادل و پروتئین کافی را فراموش نکنید.'],
      dont:['بلافاصله بعد از جلسه موها را سفت نبندید.','همزمان چند درمان شیمیایی (فر، دکلره، صاف‌کننده) انجام ندهید.','خارش یا ریزش ناگهانی پوست سر را نادیده نگیرید؛ به متخصص نشان دهید.','از یک جلسه انتظار نتیجه‌ی کامل نداشته باشید.'],
      tip:'قبل و بعد از هر دوره از موهایتان عکس بگیرید؛ پیشرفت را بهتر می‌بینید.' },
    en: { intro:'Tired hair needs time and patience; restoration is a journey, not a single session.',
      do:['Use the shampoo and mask your specialist recommends after each session.','Keep heat styling to a minimum.','Massage the scalp gently to boost circulation.','Keep a balanced diet with enough protein.'],
      dont:['Do not tie hair tightly right after a session.','Do not stack several chemical treatments (perm, bleach, straightening).','Do not ignore scalp itching or sudden shedding; have it checked.','Do not expect full results from one session.'],
      tip:'Take before-and-after photos of each course; progress is easier to see.' }
  },
  spa: {
    fa: { intro:'هد اسپا ترکیبی از پاک‌سازی عمیق و ماساژ پوست سر است؛ بعد از آن پوست سر آرام‌تر و حساس‌تر است.',
      do:['قبل از جلسه موها را شانه کنید و اگر محصول زیاد روی مو دارید به متخصص بگویید.','بعد از جلسه آب کافی بنوشید و کمی استراحت کنید.','برای حفظ نتیجه، فاصله‌ی جلسه‌های بعدی را با متخصص تعیین کنید.','از شامپوی ملایم و مناسب نوع پوست سر استفاده کنید.'],
      dont:['اگر پوست سر زخم، التهاب یا عفونت دارد، بدون مشورت اقدام نکنید.','تا چند ساعت بعد، موها را سفت نبندید و محصول سنگین روی پوست سر نزنید.','بلافاصله بعد از جلسه از آب خیلی داغ یا سشوار داغ استفاده نکنید.','پوست سر را با ناخن و فشار نخارانید.'],
      tip:'پوست سر هم مثل پوست صورت به مراقبت منظم نیاز دارد؛ سر سالم، موی سالم.' },
    en: { intro:'A head spa combines deep cleansing with scalp massage; afterwards the scalp is calmer but more sensitive.',
      do:['Brush your hair before the session and mention heavy product build-up to your specialist.','Drink water afterwards and rest for a while.','Agree on the interval for follow-up sessions with your specialist.','Use a gentle shampoo suited to your scalp type.'],
      dont:['Do not book with open sores, inflammation or infection on the scalp without advice.','For a few hours, avoid tight hairstyles and heavy scalp products.','Avoid very hot water or hot blow-drying right after the session.','Do not scratch the scalp with nails or pressure.'],
      tip:'The scalp needs regular care just like facial skin; healthy scalp, healthy hair.' }
  },
  micro: {
    fa: { intro:'میکروبلیدینگ یک کار پوستی است؛ دوره‌ی ترمیم اولیه تعیین‌کننده‌ی ماندگاری رنگ است.',
      do:['طبق دستور هنرمند، ناحیه را با پد تمیز و مرطوب ملایم پاک کنید.','پمادی را که هنرمند تجویز کرده فقط به‌مقدار بسیار کم بمالید.','بعد از ترمیم کامل از ضدآفتاب استفاده کنید.','برای جلسه‌ی اصلاح (تاچ‌آپ) در موعد مقرر مراجعه کنید.'],
      dont:['پوسته‌ها را نکنید؛ رنگ می‌ریزد و ممکن است جای زخم بماند.','تا چند روز ناحیه را خیس نکنید و از سونا، استخر و آفتاب دوری کنید.','در دوره‌ی ترمیم آرایش یا پیلینگ روی ناحیه انجام ندهید.','در بارداری، بیماری خاص یا مصرف داروهای رقیق‌کننده‌ی خون، قبل از جلسه با پزشک مشورت کنید.'],
      tip:'رنگ در هفته‌ی اول تیره‌تر و بعد روشن‌تر می‌شود؛ قضاوت را به بعد از ترمیم کامل بسپارید.' },
    en: { intro:'Microblading is a skin procedure; the initial healing period decides how long the colour lasts.',
      do:['Gently clean the area with a damp clean pad as your artist instructs.','Apply only a very thin layer of the ointment your artist prescribed.','Use sunscreen once fully healed.','Return for your touch-up session on schedule.'],
      dont:['Do not pick scabs; colour will fall out and may scar.','Keep the area dry for the first days and avoid saunas, pools and sun.','Avoid makeup or peels on the area while it heals.','If you are pregnant, ill or on blood thinners, consult your doctor first.'],
      tip:'Colour looks darker in week one and softens later; judge the result after full healing.' }
  },
  makeup: {
    fa: { intro:'میکاپ ماندگار از پوست آماده شروع می‌شود، نه از پایه‌ی گران‌قیمت.',
      do:['روز قبل پوست را تمیز و مرطوب کنید و خوب بخوابید.','عکس یا ایده‌ی موردنظرتان را از قبل به میکاپ‌آرتیست نشان بدهید.','با لباس دکمه‌دار یا یقه‌باز بیایید تا آرایش خراب نشود.','شب حتماً آرایش را با پاک‌کننده‌ی ملایم پاک کنید.'],
      dont:['در روز مراسم محصول یا ماسک جدیدی که قبلاً امتحان نکرده‌اید نزنید.','قبل از میکاپ پوست را شدید لایه‌برداری نکنید.','با آرایش نخوابید.','دست به صورت نزنید و آرایش را با انگشت تصحیح نکنید.'],
      tip:'قبل از مراسم مهم یک جلسه‌ی آزمایشی میکاپ رزرو کنید.' },
    en: { intro:'Long-lasting makeup starts with prepared skin, not an expensive foundation.',
      do:['Cleanse and moisturise the day before and get a good night’s sleep.','Show your makeup artist reference photos in advance.','Wear a button-up or wide-neck top so makeup is not smudged.','Remove makeup at night with a gentle cleanser.'],
      dont:['Do not try new products or masks on the day of your event.','Do not exfoliate harshly right before makeup.','Do not sleep in your makeup.','Do not touch your face or fix makeup with your fingers.'],
      tip:'Book a trial session before an important occasion.' }
  },
  lash: {
    fa: { intro:'اکستنشن و لیفت با مراقبت درست طبیعی‌تر می‌ماند و مژه‌ی خودتان هم سالم می‌ماند.',
      do:['۲۴ ساعت اول مژه‌ها را خیس نکنید و بخار صورت نگیرید.','مژه‌ها را هر روز با برس تمیز و آرام شانه کنید.','مژه‌ها را با شامپوی مخصوص یا فوم ملایم و بدون روغن تمیز کنید.','برای ترمیم، هر ۲ تا ۴ هفته به سالن مراجعه کنید.'],
      dont:['از محصولات یا پاک‌کننده‌ی روغنی دور چشم استفاده نکنید.','مژه‌ها را نمالید، نکشید و با ناخن نکنید.','روی اکستنشن ریمل ضدآب و فرکننده‌ی مژه استفاده نکنید.','در صورت قرمزی، سوزش یا خارش چشم، سریع به سالن یا پزشک مراجعه کنید.'],
      tip:'به پشت بخوابید یا از بالش نرم استفاده کنید تا مژه‌ها له نشوند.' },
    en: { intro:'With proper care, extensions and lifts look natural longer and your own lashes stay healthy.',
      do:['Keep lashes dry and avoid steam for the first 24 hours.','Brush lashes gently with a clean spoolie every day.','Cleanse with a lash shampoo or gentle oil-free foam.','Come back for a fill every 2–4 weeks.'],
      dont:['Do not use oil-based products or oily cleansers around the eyes.','Do not rub, pull or pick at the lashes.','Do not use waterproof mascara or a lash curler on extensions.','If you notice redness, burning or itching, contact us or a doctor promptly.'],
      tip:'Sleep on your back or on a soft pillow so lashes do not get crushed.' }
  }
};

const SLOTS = ['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];
const STORE = 'hanami_bookings_v1';

let lang = store.get('hm_lang', 'fa');
let theme = store.get('hm_theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
const t = k => (D[lang][k] ?? k);
const money = n => lang === 'fa' ? n.toLocaleString('fa-IR') + ' تومان' : n.toLocaleString('en-US') + ' Toman';
const toEn = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Language ---------- */
function setBootstrap() {
  const l = $('#bs');
  if (!l) return;
  const href = `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap${lang === 'fa' ? '.rtl' : ''}.min.css`;
  if (l.href !== href) l.href = href;
}
function applyLang() {
  const html = document.documentElement;
  html.lang = lang; html.dir = lang === 'fa' ? 'rtl' : 'ltr';
  setBootstrap();
  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $('#langBtn').textContent = lang === 'fa' ? 'EN' : 'فا';
  renderServices(); renderSelect(); renderStaff(); renderSlots(); renderPay();
  refreshDate(); renderGallery(); renderMag();
  $('#yr').textContent = new Date().getFullYear();
  const tel = $('#telLink'); tel.textContent = '+' + CONFIG.WA_NUMBER; tel.href = 'tel:+' + CONFIG.WA_NUMBER;
  observe();
}
$('#langBtn').onclick = () => { lang = lang === 'fa' ? 'en' : 'fa'; store.set('hm_lang', lang); applyLang(); };

/* ---------- Theme ---------- */
function applyTheme() {
  document.documentElement.dataset.bsTheme = theme;
  $('#themeBtn').innerHTML = `<i class="bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon-stars'}"></i>`;
  $('meta[name=theme-color]').content = theme === 'dark' ? '#110e0d' : '#f8f2ea';
}
$('#themeBtn').onclick = () => { theme = theme === 'dark' ? 'light' : 'dark'; store.set('hm_theme', theme); applyTheme(); };

/* ---------- Go to booking with a service ---------- */
function bookService(id) {
  $('#fSvc').value = id;
  $('#fSvc').dispatchEvent(new Event('change'));
  $('#book').scrollIntoView({ behavior: 'smooth' });
}

/* ---------- Services ---------- */
function renderServices() {
  $('#svcGrid').innerHTML = SERVICES.map((s, i) => `
    <div class="col-md-6 col-lg-4">
      <article class="svc rv" data-id="${s.id}" tabindex="0" role="button">
        <span class="no">${String(i + 1).padStart(2, '0')}</span>
        <div class="svc-ic"><i class="bi ${s.ic}"></i></div>
        <h3>${t(`s.${s.id}.n`)}</h3>
        <p>${t(`s.${s.id}.d`)}</p>
        <span class="dep">${t('svc.dep')}: ${money(PRICES[s.id])}</span>
        <span class="go">${t('svc.book')} <i class="bi bi-arrow-${lang === 'fa' ? 'left' : 'right'}"></i></span>
      </article>
    </div>`).join('');
  $$('.svc').forEach(c => {
    c.onclick = () => bookService(c.dataset.id);
    c.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bookService(c.dataset.id); } };
  });
}
function renderSelect() {
  const cur = $('#fSvc').value;
  $('#fSvc').innerHTML = `<option value="" disabled selected>${t('f.choose')}</option>` +
    SERVICES.map(s => `<option value="${s.id}">${t(`s.${s.id}.n`)}</option>`).join('');
  if (cur) $('#fSvc').value = cur;
}

/* ---------- Gallery (photos, lazy) ---------- */
function renderGallery() {
  $('#galGrid').innerHTML = GALLERY.map(g => `
    <figure class="rv">
      <img src="${g.img}" alt="${esc(g[lang])}" loading="lazy" decoding="async">
      <figcaption>${esc(g[lang])}</figcaption>
    </figure>`).join('');
  observe();
}

/* ---------- Magazine ---------- */
let magSel = 'massage';
function renderMag() {
  const tabs = $('#magTabs'), panel = $('#magPanel');
  tabs.innerHTML = SERVICES.map(s => `
    <button type="button" role="tab" data-id="${s.id}" class="${s.id === magSel ? 'active' : ''}" aria-selected="${s.id === magSel}">
      <i class="bi ${s.ic}"></i>${t(`s.${s.id}.n`)}
    </button>`).join('');
  const m = MAG[magSel][lang];
  panel.innerHTML = `
    <p class="mag-intro">${m.intro}</p>
    <div class="row g-4">
      <div class="col-md-6"><div class="mag-card do">
        <h3><i class="bi bi-check2-circle"></i>${t('mag.do')}</h3>
        <ul>${m.do.map(x => `<li>${x}</li>`).join('')}</ul>
      </div></div>
      <div class="col-md-6"><div class="mag-card dont">
        <h3><i class="bi bi-x-circle"></i>${t('mag.dont')}</h3>
        <ul>${m.dont.map(x => `<li>${x}</li>`).join('')}</ul>
      </div></div>
    </div>
    <div class="mag-tip"><b>${t('mag.tip')}</b>${m.tip}</div>
    <div class="mag-cta"><button type="button" class="btn btn-hm-ghost" id="magBook">${t('svc.book')}</button></div>`;
}
$('#magTabs').addEventListener('click', e => {
  const b = e.target.closest('[data-id]');
  if (!b) return;
  magSel = b.dataset.id; renderMag();
});
$('#magPanel').addEventListener('click', e => { if (e.target.closest('#magBook')) bookService(magSel); });

/* ---------- Booking helpers ---------- */
const bookings = () => { try { return JSON.parse(store.get(STORE)) || []; } catch { return []; } };
const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);

/* ---------- Jalali (fa) / Gregorian (en) date picker ---------- */
const dateInput = $('#fDate'), dateView = $('#fDateView'), cal = $('#cal');
const JM = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const jf = new Intl.DateTimeFormat('en-u-ca-persian-nu-latn', { year: 'numeric', month: 'numeric', day: 'numeric' });
const P = d => {
  if (lang === 'fa') { const o = {}; jf.formatToParts(d).forEach(x => o[x.type] = x.value); return { y: +o.year, m: +o.month, d: +o.day }; }
  return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() };
};
const noon = d => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const monthFirst = d => { let x = noon(d); while (P(x).d !== 1) x = addDays(x, -1); return x; };
const fmtN = n => lang === 'fa' ? n.toLocaleString('fa-IR', { useGrouping: false }) : String(n);
const niceDate = k => new Date(k + 'T12:00').toLocaleDateString(lang === 'fa' ? 'fa-IR' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
let anchor = monthFirst(new Date());

function drawCal() {
  const first = anchor, pf = P(first), todayK = iso(new Date());
  let len = 0, x = first;
  while (P(x).m === pf.m) { len++; x = addDays(x, 1); }
  const off = lang === 'fa' ? (first.getDay() + 1) % 7 : first.getDay();      // fa: هفته از شنبه
  const heads = lang === 'fa' ? ['ش','ی','د','س','چ','پ','ج'] : ['S','M','T','W','T','F','S'];
  const title = lang === 'fa' ? `${JM[pf.m - 1]} ${fmtN(pf.y)}` : first.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const canPrev = iso(first) > iso(monthFirst(new Date()));
  let cells = '<span></span>'.repeat(off);
  for (let i = 1; i <= len; i++) {
    const k = iso(addDays(first, i - 1));
    cells += `<button type="button" data-k="${k}" class="${k === dateInput.value ? 'sel' : ''} ${k === todayK ? 'today' : ''}" ${k < todayK ? 'disabled' : ''}>${fmtN(i)}</button>`;
  }
  const L = lang === 'fa' ? ['right', 'left'] : ['left', 'right'];
  cal.innerHTML = `
    <div class="cal-h">
      <button type="button" data-nav="-1" ${canPrev ? '' : 'disabled'} aria-label="prev"><i class="bi bi-chevron-${L[0]}"></i></button>
      <b>${title}</b>
      <button type="button" data-nav="1" aria-label="next"><i class="bi bi-chevron-${L[1]}"></i></button>
    </div>
    <div class="cal-w">${heads.map(h => `<span>${h}</span>`).join('')}</div>
    <div class="cal-g">${cells}</div>`;
}
function openCal() { drawCal(); cal.hidden = false; }
function closeCal() { cal.hidden = true; }
function refreshDate() {
  dateView.placeholder = t('f.choosedate');
  if (dateInput.value) dateView.value = niceDate(dateInput.value);
  anchor = monthFirst(dateInput.value ? new Date(dateInput.value + 'T12:00') : new Date());
  if (!cal.hidden) drawCal();
}
dateView.addEventListener('click', () => cal.hidden ? openCal() : closeCal());
dateView.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCal(); }
  if (e.key === 'Escape') closeCal();
});
cal.addEventListener('click', e => {
  const nav = e.target.closest('[data-nav]'), day = e.target.closest('[data-k]');
  if (nav) {
    anchor = +nav.dataset.nav > 0 ? monthFirst(addDays(anchor, 32)) : monthFirst(addDays(anchor, -1));
    drawCal();
  } else if (day && !day.disabled) {
    dateInput.value = day.dataset.k;
    dateView.value = niceDate(day.dataset.k);
    closeCal();
    dateInput.dispatchEvent(new Event('change'));
  }
});
document.addEventListener('click', e => { if (!cal.hidden && !e.target.closest('#cal, #fDateView')) closeCal(); });

/* ---------- Staff + slots ---------- */
const isBusy = (date, time, key) => bookings().some(b => b.date === date && b.time === time && (b.staff || b.service) === key);

function freeFor(date, time, svc, staffId) {
  const list = STAFF[svc];
  if (!list) return isBusy(date, time, svc) ? [] : [svc];
  const ids = (staffId && staffId !== 'any') ? [staffId] : list.map(p => p.id);
  return ids.filter(id => !isBusy(date, time, id));
}

function renderStaff() {
  const svc = $('#fSvc').value, list = STAFF[svc], wrap = $('#staffWrap'), box = $('#staffPick');
  if (!list) { wrap.hidden = true; box.innerHTML = ''; return; }
  const items = [{ id: 'any' }, ...list];
  const cur = ($('input[name=staff]:checked') || {}).value;
  const pick = items.some(p => p.id === cur) ? cur : 'any';
  box.innerHTML = items.map(p => `<input type="radio" name="staff" id="st_${p.id}" value="${p.id}" ${p.id === pick ? 'checked' : ''}>
    <label for="st_${p.id}">${p.id === 'any' ? t('f.anystaff') : p[lang]}</label>`).join('');
  wrap.hidden = false;
}

function renderSlots() {
  const box = $('#slots'), d = dateInput.value, svc = $('#fSvc').value;
  if (!d || !svc) { box.innerHTML = ''; $('#slotHint').textContent = t('f.pickfirst'); return; }
  const staffId = ($('input[name=staff]:checked') || {}).value;
  const now = new Date(), isToday = d === iso(now);
  box.innerHTML = SLOTS.map(s => {
    const past = isToday && +s.slice(0, 2) <= now.getHours();
    const off = past || !freeFor(d, s, svc, staffId).length;
    return `<input type="radio" name="slot" id="sl${s.replace(':', '')}" value="${s}" ${off ? 'disabled' : ''} required>
            <label for="sl${s.replace(':', '')}">${s}</label>`;
  }).join('');
  const free = $$('input:not(:disabled)', box).length;
  $('#slotHint').textContent = free ? t('f.free') : t('f.nofree');
}
dateInput.addEventListener('change', renderSlots);
$('#fSvc').addEventListener('change', () => { renderStaff(); renderSlots(); renderPay(); });
$('#staffPick').addEventListener('change', renderSlots);

/* ---------- Payment: card + receipt ---------- */
function renderPay() {
  const svc = $('#fSvc').value;
  $('#payWrap').hidden = !svc;
  if (!svc) return;
  $('#payAmt').textContent = money(PRICES[svc]);
  $('#cardNum').textContent = CONFIG.CARD_NUMBER;
  $('#cardOwner').textContent = CONFIG.CARD_OWNER[lang];
  $('#cardBank').textContent = CONFIG.CARD_BANK[lang];
  setCopyLabel(false);
}
function setCopyLabel(done) {
  $('#copyCard').innerHTML = `<i class="bi bi-${done ? 'check2' : 'copy'}"></i> ${t(done ? 'pay.copied' : 'pay.copy')}`;
}
$('#copyCard').addEventListener('click', async () => {
  const raw = CONFIG.CARD_NUMBER.replace(/\s/g, '');
  let ok = false;
  try { await navigator.clipboard.writeText(raw); ok = true; }
  catch {
    const ta = document.createElement('textarea');
    ta.value = raw; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta);
    ta.select(); try { ok = document.execCommand('copy'); } catch {} ta.remove();
  }
  if (ok) { setCopyLabel(true); setTimeout(() => setCopyLabel(false), 1800); }
});

let receiptBlob = null;
const rcInput = $('#fReceipt'), rcDrop = $('#drop'), rcPrev = $('#rcPrev'), rcClear = $('#rcClear'), rcErr = $('#rcErr');

const loadImg = file => new Promise((res, rej) => {
  const u = URL.createObjectURL(file), i = new Image();
  i.onload = () => { URL.revokeObjectURL(u); res(i); };
  i.onerror = rej; i.src = u;
});
async function shrink(file, max = 1400) {                 // کوچک‌کردن رسید قبل از ارسال
  const img = await loadImg(file);
  const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  const c = document.createElement('canvas');
  c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
  const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
  x.drawImage(img, 0, 0, c.width, c.height);
  return new Promise(r => c.toBlob(b => r(b), 'image/jpeg', .8));
}
function clearReceipt() {
  receiptBlob = null; rcInput.value = '';
  if (rcPrev.src.startsWith('blob:')) URL.revokeObjectURL(rcPrev.src);
  rcPrev.removeAttribute('src'); rcPrev.hidden = true; rcClear.hidden = true; rcErr.hidden = true;
}
rcInput.addEventListener('change', async () => {
  const file = rcInput.files[0]; rcErr.hidden = true;
  if (!file) { clearReceipt(); return; }
  if (!file.type.startsWith('image/') || file.size > 15 * 1024 * 1024) {
    clearReceipt(); rcErr.textContent = t('pay.err'); rcErr.hidden = false; return;
  }
  try {
    const blob = await shrink(file);
    if (!blob) throw 0;
    if (rcPrev.src.startsWith('blob:')) URL.revokeObjectURL(rcPrev.src);
    receiptBlob = blob;
    rcPrev.src = URL.createObjectURL(blob); rcPrev.hidden = false; rcClear.hidden = false;
  } catch { clearReceipt(); rcErr.textContent = t('pay.err'); rcErr.hidden = false; }
});
rcClear.addEventListener('click', clearReceipt);
['dragenter', 'dragover'].forEach(ev => rcDrop.addEventListener(ev, e => { e.preventDefault(); rcDrop.classList.add('drag'); }));
['dragleave', 'drop'].forEach(ev => rcDrop.addEventListener(ev, e => { e.preventDefault(); rcDrop.classList.remove('drag'); }));
rcDrop.addEventListener('drop', e => {
  const f = e.dataTransfer.files[0];
  if (!f) return;
  const dt = new DataTransfer(); dt.items.add(f); rcInput.files = dt.files;
  rcInput.dispatchEvent(new Event('change'));
});
rcDrop.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); rcInput.click(); } });

/* ---------- Submit ---------- */
const okModal = new bootstrap.Modal('#okModal');
let shareData = null;
$('#okShare').addEventListener('click', () => { if (shareData && navigator.share) navigator.share(shareData).catch(() => {}); });

$('#bookForm').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target;
  if (!f.checkValidity() || !receiptBlob) {
    f.classList.add('was-validated');
    const bad = $(':invalid', f) || rcDrop;
    (bad.closest('.col-12, .col-md-6') || bad).scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  const slot = $('input[name=slot]:checked', f).value;
  const svc = $('#fSvc').value;

  let staff = null;
  if (STAFF[svc]) {
    const pick = $('input[name=staff]:checked').value;
    const free = freeFor(dateInput.value, slot, svc, pick);
    if (!free.length) { renderSlots(); return; }                 // همین الان کسی آن ساعت را گرفت
    staff = free[Math.floor(Math.random() * free.length)];       // «هر کدام» → یک نفر آزاد
  }
  const staffName = staff ? STAFF[svc].find(p => p.id === staff)[lang] : '';
  const phone = toEn($('#fPhone').value.trim());

  const b = {
    code: 'HM-' + Math.floor(1000 + Math.random() * 9000),
    name: $('#fName').value.trim(), phone,
    service: svc, staff, date: dateInput.value, time: slot,
    note: $('#fNote').value.trim(), deposit: PRICES[svc], at: Date.now()
  };

  /* ارسال خودکار (اگر آدرس فرم تنظیم شده باشد) */
  let sent = false, tried = !!CONFIG.BOOKING_ENDPOINT;
  const btn = $('#submitBtn');
  if (tried) {
    btn.disabled = true; btn.textContent = t('f.sending');
    try {
      const fd = new FormData();
      Object.entries({ code: b.code, name: b.name, phone: b.phone, service: svc, specialist: staffName,
        date: b.date, time: b.time, deposit: b.deposit, note: b.note }).forEach(([k, v]) => fd.append(k, v));
      fd.append('receipt', receiptBlob, `${b.code}.jpg`);
      const r = await fetch(CONFIG.BOOKING_ENDPOINT, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      sent = r.ok;
    } catch { sent = false; }
    btn.disabled = false; btn.textContent = t('f.submit');
  }

  store.set(STORE, JSON.stringify([...bookings(), b]));          // ساعت برای همین دستگاه پر می‌شود (بدون عکس رسید)

  const svcName = t(`s.${svc}.n`), dateTxt = niceDate(b.date);
  const msg = `Hanami · ${b.code}\n${b.name} (${phone})\n${svcName}${staffName ? ' · ' + staffName : ''}\n${dateTxt} ${b.time}\n${t('ok.dep')}: ${money(b.deposit)}${b.note ? '\n' + b.note : ''}`;

  $('#okCode').textContent = b.code;
  $('#okMsg').textContent = sent ? t('ok.sent') : ((tried ? t('ok.fail') + ' ' : '') + t('ok.manual'));
  $('#okSum').innerHTML =
    `<li><b>${esc(svcName)}</b></li>` +
    (staffName ? `<li>${t('f.staff')}: ${esc(staffName)}</li>` : '') +
    `<li>${esc(dateTxt)} · <span dir="ltr">${b.time}</span></li>` +
    `<li>${t('ok.dep')}: ${money(b.deposit)}</li><li>${esc(b.name)}</li>`;
  $('#okWa').href = `https://wa.me/${CONFIG.WA_NUMBER}?text=${encodeURIComponent(msg)}`;

  shareData = null;
  if (!sent) {
    const file = new File([receiptBlob], `${b.code}.jpg`, { type: 'image/jpeg' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) shareData = { files: [file], text: msg };
  }
  $('#okShare').hidden = !shareData;
  okModal.show();

  f.reset(); dateInput.value = ''; dateView.value = ''; f.classList.remove('was-validated');
  clearReceipt(); renderStaff(); renderSlots(); renderPay();
});

/* ---------- Music ---------- */
const bgm = $('#bgm'), mBtn = $('#musicBtn'), vol = $('#vol');
let savedVol = +(store.get('hm_vol', 20));
if (isNaN(savedVol)) savedVol = 20;
vol.value = savedVol; bgm.volume = savedVol / 100;
vol.addEventListener('input', () => { bgm.volume = vol.value / 100; store.set('hm_vol', vol.value); });
function setPlaying(on) { mBtn.classList.toggle('playing', on); }
async function playMusic() { try { await bgm.play(); setPlaying(true); } catch { setPlaying(false); } }
mBtn.onclick = () => { bgm.paused ? playMusic() : (bgm.pause(), setPlaying(false)); };
bgm.addEventListener('error', () => { mBtn.title = 'Music file not found'; });

/* ---------- Hero video: autoplay تضمینی ---------- */
const heroV = $('#heroVideo');
function playHero() {
  if (!heroV) return;
  heroV.muted = true; heroV.defaultMuted = true; heroV.loop = true;
  heroV.setAttribute('muted', ''); heroV.setAttribute('playsinline', ''); heroV.setAttribute('webkit-playsinline', '');
  if (!heroV.paused && !heroV.ended) return;
  const p = heroV.play();
  if (p && p.catch) p.catch(() => {});
}
(function heroVideo() {
  if (!heroV) return;
  playHero();
  // هر رویدادی که نشان بدهد ویدیو آماده است یا وقفه خورده، دوباره تلاش می‌کند
  ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'suspend', 'stalled', 'pause', 'ended']
    .forEach(ev => heroV.addEventListener(ev, () => {
      if (ev === 'pause' && document.hidden) return;
      playHero();
    }));
  // اگر مرورگر (مثلاً حالت کم‌مصرف iOS) بلاک کرد، با اولین تعامل کاربر پخش می‌شود
  ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown', 'scroll', 'wheel', 'mousemove']
    .forEach(ev => addEventListener(ev, playHero, { passive: true }));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) playHero(); });
  addEventListener('pageshow', playHero);
  addEventListener('focus', playHero);
  // نگهبان: اگر به هر دلیلی ایستاد، هر ثانیه دوباره راه می‌اندازد
  setInterval(() => { if (!document.hidden && heroV.paused) playHero(); }, 1000);
})();

/* ---------- Gate ---------- */
const gate = $('#gate');
function enter(withMusic) {
  gate.classList.add('out'); setTimeout(() => gate.remove(), 1000);
  document.body.style.overflow = '';
  playHero();                                  // این کلیک یک تعامل واقعی است؛ پخش ویدیو قطعی می‌شود
  if (withMusic) playMusic();
  setTimeout(observe, 300);
}
document.body.style.overflow = 'hidden';
$('#enterMusic').onclick = () => enter(true);
$('#enterSilent').onclick = () => enter(false);

/* ---------- Nav scroll + reveal ---------- */
const nav = $('#nav');
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 30);
addEventListener('scroll', onScroll, { passive: true }); onScroll();
$$('#menu .nav-link').forEach(a => a.addEventListener('click', () => bootstrap.Collapse.getInstance('#menu')?.hide()));

const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { setTimeout(() => e.target.classList.add('in'), (e.target.dataset.d || 0)); io.unobserve(e.target); }
}), { threshold: .12 });
function observe() { $$('.rv:not(.in)').forEach((el, i) => { el.dataset.d = (i % 4) * 90; io.observe(el); }); }

/* ---------- Sakura petals ---------- */
(function petals() {
  const cv = $('#petals'), cx = cv.getContext('2d');
  if (reduceMotion) return;
  let W, H; const PT = [];
  const N = innerWidth < 768 ? 12 : 24;
  const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  addEventListener('resize', size); size();
  const mk = init => ({ x: Math.random() * W, y: init ? Math.random() * H : -30, s: 5 + Math.random() * 8,
    v: .35 + Math.random() * .8, d: Math.random() - .3, r: Math.random() * 6.28, rv: (Math.random() - .5) * .03,
    o: .3 + Math.random() * .45, w: Math.random() * 6.28 });
  for (let i = 0; i < N; i++) PT.push(mk(true));
  (function loop() {
    cx.clearRect(0, 0, W, H);
    for (const p of PT) {
      p.w += .015; p.x += p.d + Math.sin(p.w) * .6; p.y += p.v; p.r += p.rv;
      if (p.y > H + 30 || p.x > W + 40 || p.x < -40) Object.assign(p, mk(false));
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.scale(1, .65 + Math.sin(p.w) * .3);
      cx.fillStyle = `rgba(233,150,175,${p.o})`;
      cx.beginPath(); cx.moveTo(0, -p.s);
      cx.bezierCurveTo(p.s * .9, -p.s * .6, p.s * .7, p.s * .7, 0, p.s);
      cx.bezierCurveTo(-p.s * .7, p.s * .7, -p.s * .9, -p.s * .6, 0, -p.s);
      cx.fill(); cx.restore();
    }
    requestAnimationFrame(loop);
  })();
})();

/* ---------- Init ---------- */
applyTheme();
applyLang();