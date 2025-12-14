import { prisma } from '../src/lib/prisma';

async function seedBlog() {
  console.log('🌱 Seeding blog data...');

  // Get admin user
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!admin) {
    console.error('❌ No admin user found. Please create an admin user first.');
    return;
  }

  // Create blog categories
  const categories = await Promise.all([
    prisma.blogCategory.upsert({
      where: { slug: 'jewelry-care' },
      update: {},
      create: {
        name: 'Jewelry Care',
        slug: 'jewelry-care',
        description: 'מדריכים לטיפול ושמירה על תכשיטי כסף וזהב',
        image:
          'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800',
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'style-guides' },
      update: {},
      create: {
        name: 'Style Guides',
        slug: 'style-guides',
        description: 'איך לשלב תכשיטים בלוק האישי שלך',
        image:
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'trends' },
      update: {},
      create: {
        name: 'Trends',
        slug: 'trends',
        description: 'הטרנדים החמים ביותר בעולם תכשיטי הגברים',
        image:
          'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800',
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'buyers-guide' },
      update: {},
      create: {
        name: "Buyer's Guide",
        slug: 'buyers-guide',
        description: 'כל מה שצריך לדעת לפני רכישת תכשיט',
        image:
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
      },
    }),
  ]);

  // Create blog tags
  const tags = await Promise.all([
    prisma.blogTag.upsert({
      where: { slug: 'silver' },
      update: {},
      create: { name: 'Silver', slug: 'silver' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'gold' },
      update: {},
      create: { name: 'Gold', slug: 'gold' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'chains' },
      update: {},
      create: { name: 'Chains', slug: 'chains' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'rings' },
      update: {},
      create: { name: 'Rings', slug: 'rings' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'bracelets' },
      update: {},
      create: { name: 'Bracelets', slug: 'bracelets' },
    }),
    prisma.blogTag.upsert({
      where: { slug: 'maintenance' },
      update: {},
      create: { name: 'Maintenance', slug: 'maintenance' },
    }),
  ]);

  // Create sample blog posts
  const posts = [
    {
      title: 'The Complete Guide to Silver Jewelry Care',
      slug: 'complete-guide-silver-jewelry-care',
      excerpt:
        'תכשיטי כסף דורשים טיפול מיוחד כדי לשמור על הברק והיופי שלהם. במדריך זה נלמד את כל הטריקים לשמירה על תכשיטי הכסף שלכם.',
      content: `תכשיטי כסף הם אחד מסוגי התכשיטים הפופולריים ביותר בקרב גברים, אבל הם דורשים טיפול מיוחד כדי לשמור על הברק והיופי שלהם לאורך זמן.

## למה כסף משחיר?

כסף מגיב עם גופרית באוויר ויוצר שכבה של כסף סולפיד, שנראית כהה או שחורה. זהו תהליך טבעי לחלוטין ואינו פוגע בתכשיט עצמו.

## טיפים לשמירה על תכשיטי כסף:

### 1. אחסון נכון
- שמרו את התכשיטים במקום יבש וחשוך
- השתמשו בשקית אטומה או קופסת תכשיטים
- הוסיפו שקיות סיליקה למניעת לחות

### 2. ניקוי קבוע
- נקו את התכשיטים באופן קבוע במטלית רכה
- השתמשו במים פושרים וסבון עדין
- ייבשו היטב לאחר הניקוי

### 3. הימנעות מגורמים מזיקים
- הסירו תכשיטים לפני רחצה או ים
- הימנעו ממגע עם בשמים וקוסמטיקה
- הורידו תכשיטים בעת עבודה פיזית

## מתי כדאי לפנות למומחה?

אם התכשיט משחיר באופן חמור או יש נזק פיזי, מומלץ לפנות לצורף מקצועי לטיפול מקצועי.

זכרו - תכשיט מטופח הוא תכשיט יפה!`,
      metaTitle: 'המדריך המלא לטיפול בתכשיטי כסף | Forge & Steel',
      metaDescription:
        'למדו כיצד לשמור על תכשיטי הכסף שלכם בצורה מושלמת. טיפים מקצועיים לניקוי, אחסון ותחזוקה.',
      keywords: ['כסף', 'תכשיטים', 'טיפוח', 'ניקוי', 'תחזוקה'],
      featuredImage:
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200',
      categoryId: categories[0].id,
      featured: true,
      readTime: 5,
      tagIds: [tags[0].id, tags[5].id],
    },
    {
      title: 'How to Incorporate Jewelry into Your Daily Style',
      slug: 'incorporate-jewelry-daily-style',
      excerpt:
        'תכשיטים יכולים להעצים את הסטייל האישי שלך. גלה איך לשלב אותם בצורה נכונה.',
      content: `תכשיטים לגברים הפכו לחלק בלתי נפרד מהאופנה המודרנית. הנה המדריך שלנו לשילוב נכון:

## עקרונות יסוד

### פחות זה יותר
אל תגזימו! בחרו 2-3 פריטים מקסימום ליום רגיל.

### התאמה לאירוע
- עבודה: תכשיט אחד עדין
- יום יום: שרשרת או צמיד
- ערב: אפשר להוסיף טבעת

## שילובים מנצחים

1. **שרשרת + שעון** - קלאסי ואלגנטי
2. **טבעת + צמיד** - מודרני וסטייליש
3. **שרשרת כפולה** - נועז ובולט

זכרו - הביטחון העצמי הוא התכשיט הכי יפה!`,
      metaTitle: 'איך לשלב תכשיטים בסגנון היומיומי | מדריך סטייל',
      metaDescription: 'טיפים מקצועיים לשילוב תכשיטי גברים בלוק היומיומי שלך',
      keywords: ['סטייל', 'אופנה', 'תכשיטים', 'גברים'],
      featuredImage:
        'https://images.unsplash.com/photo-1601159431809-e9c785f52f91?w=1200',
      categoryId: categories[1].id,
      featured: true,
      readTime: 4,
      tagIds: [tags[2].id, tags[3].id],
    },
    {
      title: "Hot Trends in Men's Jewelry 2024",
      slug: 'hot-trends-mens-jewelry-2024',
      excerpt:
        'מה חם השנה בעולם תכשיטי הגברים? סקירה מקיפה של הטרנדים המובילים.',
      content: `2024 מביאה איתה טרנדים מרגשים בעולם תכשיטי הגברים:

## 1. שילוב מתכות
שילוב של זהב וכסף יחד - לא עוד חוק קפוא!

## 2. שרשראות עבות
שרשראות קובניות וחזקות חוזרות בגדול

## 3. עיצובים מינימליסטים
פשטות וקלאסיקה מובילות את השוק

## 4. תכשיטים בהשראת טבע
מוטיבים של עלים, פרחים וחיות

## 5. תכשיטים מותאמים אישית
חריטות ותכשיטים ייחודיים בשיא הפופולריות

הטרנד המרכזי? אותנטיות ובחירה של מה שמדבר אליכם!`,
      metaTitle: 'טרנדים חמים בתכשיטי גברים 2024 | Forge & Steel',
      metaDescription:
        'גלה את הטרנדים החמים ביותר בעולם תכשיטי הגברים לשנת 2024',
      keywords: ['טרנדים', '2024', 'אופנה', 'תכשיטים'],
      featuredImage:
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200',
      categoryId: categories[2].id,
      featured: false,
      readTime: 3,
      tagIds: [tags[0].id, tags[1].id],
    },
    {
      title: 'Guide to Buying Your First Chain',
      slug: 'guide-buying-first-chain',
      excerpt: 'חושב לקנות את השרשרת הראשונה שלך? הנה כל מה שאתה צריך לדעת.',
      content: `רוצה לקנות את השרשרת הראשונה שלך? הנה המדריך המלא:

## בחירת האורך הנכון

### אורכים נפוצים:
- 45 ס"מ - צמוד לצוואר
- 50 ס"מ - קלאסי, מגיע לעצם הבריח
- 55 ס"מ - ארוך יותר, יורד לחזה
- 60 ס"מ - ארוך, אורבני

## סוגי שרשראות

1. **פיגארו** - קלאסית ואלגנטית
2. **קובנית** - עבה ומרשימה
3. **חבל** - מעודנת ומסתובבת
4. **גורמט** - מודרנית ואופנתית

## בחירת העובי

עובי השרשרת צריך להתאים לצוואר שלך:
- צוואר דק: 3-5 מ"מ
- צוואר בינוני: 5-8 מ"מ
- צוואר עבה: 8+ מ"מ

## חומר

- כסף 925: קלאסי ומשתלם
- זהב 14K: יוקרתי ועמיד
- נירוסטה: זול ועמיד

## טיפ סופי
בחר מה שמרגיש לך נוח ונכון. השרשרת הכי יפה היא זו שאתה אוהב!`,
      metaTitle: 'מדריך לרכישת השרשרת הראשונה | Forge & Steel',
      metaDescription:
        'כל מה שצריך לדעת לפני קניית השרשרת הראשונה - אורכים, סוגים וחומרים',
      keywords: ['שרשרת', 'מדריך קניה', 'כסף', 'זהב'],
      featuredImage:
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200',
      categoryId: categories[3].id,
      featured: true,
      readTime: 6,
      tagIds: [tags[2].id, tags[0].id, tags[1].id],
    },
  ];

  for (const postData of posts) {
    const { tagIds, ...postInfo } = postData;

    const post = await prisma.blogPost.upsert({
      where: { slug: postInfo.slug },
      update: {},
      create: {
        ...postInfo,
        authorId: admin.id,
        authorName: admin.name || admin.email,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    // Add tags
    for (const tagId of tagIds) {
      await prisma.blogPostTag.upsert({
        where: {
          postId_tagId: {
            postId: post.id,
            tagId: tagId,
          },
        },
        update: {},
        create: {
          postId: post.id,
          tagId: tagId,
        },
      });
    }

    console.log(`✅ Created blog post: ${postInfo.title}`);
  }

  console.log('✅ Blog seed completed!');
}

seedBlog()
  .catch((e) => {
    console.error('❌ Blog seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
