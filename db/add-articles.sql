-- Step 1: Add is_playbook column to blog_posts table
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_playbook BOOLEAN DEFAULT FALSE;

-- Step 2: Mark the existing 3 articles as playbook posts
UPDATE blog_posts SET is_playbook = TRUE
WHERE slug IN ('why-seo-matters-2025', 'technical-seo-checklist', 'local-seo-guide');

-- Step 3: Insert 3 more SEO Playbook articles

INSERT INTO blog_posts (slug, title, excerpt, content, author, category, tags, published, is_playbook, published_at, created_at, updated_at)
VALUES (
  'what-are-keywords',
  'What Are Keywords and Why Does Every Page Need the Right One',
  'You keep hearing that keywords are important. But what actually are they, and how do you pick the right ones? This article breaks it down simply.',
  $BODY$
<p>A keyword is just a word or phrase that someone types into Google when they are looking for something. That is it. Nothing complicated.</p>

<p>When someone types "emergency plumber near me" or "best Italian restaurant downtown," those are keywords. Your job is to make sure your website shows up when people type the keywords that match what you offer.</p>

<h2>Why Keywords Matter So Much</h2>

<p>Google has to decide, for any given search, which websites to show. It cannot read minds. It reads your website and tries to figure out what it is about. If your website clearly matches what someone searched for, you rank higher. If it does not, you do not.</p>

<p style="padding:20px 24px; border-left:2px solid #f4ca14; background:rgba(244,202,20,0.04); margin:24px 0; font-size:0.9rem; color:#ddd7cc; line-height:1.85;">
Think of it like a library. When a book is filed correctly under the right topic, people can find it. When it is filed under the wrong topic or no topic at all, it just sits there unread.
</p>

<p>Your website works the same way. Each page needs to be clearly filed under the right topic, which means using the right keywords in the right places.</p>

<h2>How to Pick the Right Keywords</h2>

<p>The best keywords share two things: people are actually searching for them, and they match what you offer.</p>

<p>Start by writing down every way a customer might search for your business. Think like someone who has never heard of you but needs what you sell. What would they type?</p>

<ul style="margin:16px 0 16px 20px; display:flex; flex-direction:column; gap:8px;">
  <li style="font-size:0.9rem; color:#ddd7cc; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">Be specific.</span> "Plumber" is too broad. "Emergency plumber Chicago" is specific. Specific keywords have less competition and bring people who are ready to hire.</li>
  <li style="font-size:0.9rem; color:#ddd7cc; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">Think about intent.</span> Someone searching "how to fix a leaky faucet" wants a tutorial. Someone searching "plumber to fix leaky faucet" wants to hire someone. Those are very different.</li>
  <li style="font-size:0.9rem; color:#ddd7cc; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">One keyword focus per page.</span> Each page on your site should focus on one main keyword. Do not try to rank for twenty things on the same page.</li>
</ul>

<h2>Where to Put Your Keywords</h2>

<p>Once you know your keyword, it needs to show up in a few key places on the page. Not stuffed in everywhere, just placed naturally where it makes sense.</p>

<p style="padding:20px 24px; border-left:2px solid #e08522; background:rgba(224,133,34,0.05); margin:24px 0; font-size:0.88rem; color:#ddd7cc; line-height:1.85;">
<span style="color:#e08522; font-weight:600; font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase; display:block; margin-bottom:8px;">Where keywords belong</span>
In the page title. In the first paragraph of your content. In at least one heading on the page. In the meta description. In the URL if possible.
</p>

<p>Google is smart enough to understand related words and phrases. You do not need to use the exact keyword over and over. Write naturally for the person reading it, and use the keyword where it fits.</p>

<h2>The Mistake Most People Make</h2>

<p>The most common mistake is guessing. Business owners assume they know what their customers search for, but they are often wrong. Someone who sells "custom handmade furniture" might find that people actually search for "bespoke dining tables" or "made to order wooden chairs."</p>

<p>Free tools like Google Search Console show you exactly what people typed to find your site. If you are not using that data, you are guessing.</p>

<p style="font-size:0.95rem; color:#f5f0e8; font-style:italic; margin-top:32px;">Want us to do the keyword research for your business and show you what your customers are actually searching for? <a href="/quote" style="color:#f4ca14;">Request a free quote.</a></p>
$BODY$,
  'Honey Bridge SEO',
  'Strategy',
  ARRAY['Keywords', 'SEO Basics', 'Strategy', 'Beginner'],
  true,
  true,
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
);

INSERT INTO blog_posts (slug, title, excerpt, content, author, category, tags, published, is_playbook, published_at, created_at, updated_at)
VALUES (
  'what-are-backlinks',
  'What Are Backlinks and Why Does Google Care About Them',
  'Backlinks are one of the most important ranking factors in SEO. But most people have no idea what they are. Here is a plain explanation and why they matter for your site.',
  $BODY$
<p>A backlink is just a link from one website to yours. When another site links to your page, Google sees that as a vote of confidence. The more quality sites that link to you, the more Google trusts your site, and the higher it ranks you.</p>

<p>Think of it like this. If ten strangers say a restaurant is good, that is useful. If ten well known food critics say the same restaurant is good, that means a lot more. Backlinks work the same way. Links from respected websites count for more than links from random ones.</p>

<h2>Why Google Uses Backlinks</h2>

<p>When Google first launched, its big insight was that links were a signal of quality. A page that lots of other pages link to must be worth something. That logic is still at the core of how Google works today.</p>

<p style="padding:20px 24px; border-left:2px solid #f4ca14; background:rgba(244,202,20,0.04); margin:24px 0; font-size:0.9rem; color:#ddd7cc; line-height:1.85;">
A single backlink from a well known industry publication or a respected local business directory can do more for your rankings than dozens of links from small unknown sites.
</p>

<h2>What Makes a Good Backlink</h2>

<p>Not all backlinks are equal. Here is what makes one valuable.</p>

<ul style="margin:16px 0 16px 20px; display:flex; flex-direction:column; gap:8px;">
  <li style="font-size:0.9rem; color:#ddd7cc; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">It comes from a relevant site.</span> A link to a plumbing company from a home improvement blog is relevant. A link from a random cooking site is not.</li>
  <li style="font-size:0.9rem; color:#ddd7cc; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">The linking site is trusted.</span> News sites, government pages, universities, and well known industry publications carry a lot of weight.</li>
  <li style="font-size:0.9rem; color:#ddd7cc; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">The link uses descriptive text.</span> A link that says "best Chicago plumber" is more useful than one that just says "click here."</li>
</ul>

<h2>How to Get Backlinks</h2>

<p>The honest answer is that earning good backlinks takes real work. There are no shortcuts that last. Here are methods that actually work.</p>

<p style="padding:20px 24px; border-left:2px solid #e08522; background:rgba(224,133,34,0.05); margin:24px 0; font-size:0.88rem; color:#ddd7cc; line-height:1.85;">
<span style="color:#e08522; font-weight:600; font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase; display:block; margin-bottom:8px;">What actually works</span>
Write content worth linking to. Get listed in local directories. Partner with other local businesses. Get mentioned in local news. Ask suppliers or partners to link to you. Sponsor local events.
</p>

<h2>What to Avoid</h2>

<p>Buying links. Using link farms. Swapping links just for the sake of it. Google has gotten very good at detecting these tactics and they can get your site penalized, meaning it drops out of search results entirely.</p>

<p>The businesses that win long term are the ones who earn links through doing good work and being genuinely useful online. It takes longer but the results stick.</p>

<p style="font-size:0.95rem; color:#f5f0e8; font-style:italic; margin-top:32px;">Building a solid backlink profile is one of the things we handle for clients. <a href="/services" style="color:#f4ca14;">See how our link building service works.</a></p>
$BODY$,
  'Honey Bridge SEO',
  'Strategy',
  ARRAY['Backlinks', 'Link Building', 'SEO Basics', 'Beginner'],
  true,
  true,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
);

INSERT INTO blog_posts (slug, title, excerpt, content, author, category, tags, published, is_playbook, published_at, created_at, updated_at)
VALUES (
  'how-long-seo-takes',
  'How Long Does SEO Actually Take to Work',
  'SEO is not instant. But how long does it really take? And what should you expect to see and when? This article gives you a straight answer.',
  $BODY$
<p>This is the question everyone asks before starting SEO. And the honest answer is: it depends. But that is not helpful on its own, so here is a more detailed breakdown.</p>

<p>Most businesses start seeing meaningful movement in <span style="color:#f4ca14; font-weight:500;">three to six months</span>. Some see changes sooner. Some take longer. The speed depends on a few things we will cover below.</p>

<h2>Why SEO Takes Time</h2>

<p>Google does not update rankings in real time. It crawls your site, processes the changes, and then updates its index. That process can take days or weeks depending on how often Google visits your site.</p>

<p>More importantly, SEO is about building trust with Google. And trust takes time to build. A brand new website with no history will always take longer to rank than an established site that has been around for years. You are earning credibility, not just flipping a switch.</p>

<h2>What Happens in Each Phase</h2>

<p style="padding:20px 24px; border-left:2px solid #e08522; background:rgba(224,133,34,0.05); margin:24px 0; font-size:0.88rem; color:#ddd7cc; line-height:1.85;">
<span style="color:#e08522; font-weight:600; font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase; display:block; margin-bottom:8px;">A rough timeline</span>
Weeks 1 to 4: Technical fixes, content updates, and Google starting to re-read your site. Not much visible change yet but the groundwork is being laid.<br><br>
Months 2 to 3: Google begins recognising the improvements. Some lower competition keywords may start moving. Your score will start improving.<br><br>
Months 4 to 6: Real movement on your main keywords. Traffic starts to increase noticeably. This is when most clients start seeing leads from organic search.<br><br>
Month 6 onwards: Compounding growth. Each improvement you made earlier continues to build on itself.
</p>

<h2>What Speeds It Up</h2>

<ul style="margin:16px 0 16px 20px; display:flex; flex-direction:column; gap:8px;">
  <li style="font-size:0.9rem; color:#ddd7cc; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">Having an established domain.</span> A site that has been around for years with some existing content will move faster than a brand new one.</li>
  <li style="font-size:0.9rem; color:#ddd7cc; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">Fixing technical issues quickly.</span> If your site has crawl errors or slow load times, fixing those first unlocks the fastest gains.</li>
  <li style="font-size:0.9rem; color:#ddd7cc; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">Publishing useful content consistently.</span> Google rewards sites that stay active and keep adding value.</li>
  <li style="font-size:0.9rem; color:#ddd7cc; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">Lower competition in your market.</span> A local business in a small city will see faster results than a national brand in a crowded industry.</li>
</ul>

<h2>The Right Way to Think About It</h2>

<p>Do not think of SEO as a campaign with a start and end date. Think of it as an ongoing investment. Every month you put in, the returns keep growing. Every month a competitor is putting in the work and you are not, the gap between you and them gets wider.</p>

<p style="padding:20px 24px; border-left:2px solid #f4ca14; background:rgba(244,202,20,0.04); margin:24px 0; font-size:0.9rem; color:#ddd7cc; line-height:1.85;">
The best time to start was six months ago. The second best time is today.
</p>

<p style="font-size:0.95rem; color:#f5f0e8; font-style:italic; margin-top:32px;">Ready to start building? <a href="/quote" style="color:#f4ca14;">Get a free quote</a> and we will walk you through what a realistic timeline looks like for your specific situation.</p>
$BODY$,
  'Honey Bridge SEO',
  'Strategy',
  ARRAY['Timeline', 'SEO Basics', 'Expectations', 'Beginner'],
  true,
  true,
  NOW() - INTERVAL '1 days',
  NOW() - INTERVAL '1 days',
  NOW() - INTERVAL '1 days'
);

-- Step 4: Insert 3 regular blog posts (not part of the playbook)

INSERT INTO blog_posts (slug, title, excerpt, content, author, category, tags, published, is_playbook, published_at, created_at, updated_at)
VALUES (
  'google-algorithm-updates',
  'Google Updates Its Algorithm Constantly. Here Is What That Means for You',
  'Google changes how it ranks websites hundreds of times a year. Most changes are small. Some are big. Here is how to stay on the right side of them without obsessing over every update.',
  $BODY$
<p>Google updates its search algorithm thousands of times per year. Most of those changes are tiny tweaks you would never notice. But a handful of times each year, Google releases a bigger update that can noticeably shift rankings across many websites at once.</p>

<p>When a big update rolls out, some sites jump up. Others drop. Business owners who were getting good traffic suddenly see it cut in half. Others who were buried suddenly find themselves on page one. It can feel random. It is not.</p>

<h2>Why Google Keeps Updating</h2>

<p>Google's goal has always been the same: show people the most useful, trustworthy, and relevant results for what they searched for. As the internet changes and as people try to game the system, Google keeps adjusting to stay ahead of it.</p>

<p style="padding:20px 24px; border-left:2px solid #f4ca14; background:rgba(244,202,20,0.04); margin:24px 0; font-size:0.9rem; color:#ddd7cc; line-height:1.85;">
The sites that get hit hardest by updates are usually ones that were trying to shortcut their way to the top. Sites that focus on being genuinely useful tend to hold their positions or improve over time.
</p>

<h2>What the Big Updates Actually Target</h2>

<p>Recent major updates from Google have focused on a few clear themes.</p>

<ul style="margin:16px 0 16px 20px; display:flex; flex-direction:column; gap:8px;">
  <li style="font-size:0.9rem; color:#ddd7cc; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">Helpful content.</span> Google now actively looks for signs that content was written for real people, not just to rank. Thin pages full of keywords with no real value get demoted.</li>
  <li style="font-size:0.9rem; color:#ddd7cc; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">Site reputation.</span> Google looks at whether your business is actually real and trusted. Reviews, mentions, and backlinks from respected sources all matter.</li>
  <li style="font-size:0.9rem; color:#ddd7cc; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">Technical quality.</span> Slow sites, broken pages, and poor mobile experiences continue to get pushed down.</li>
</ul>

<h2>How to Protect Your Site From Updates</h2>

<p>The short answer is to do the right things in the first place. Build a site that is fast, easy to use, and full of content that genuinely helps your visitors. Get links from real sources. Keep your technical foundation solid.</p>

<p>Sites that are built on genuine quality rarely see dramatic drops from algorithm updates. Sites built on shortcuts almost always do eventually.</p>

<p style="font-size:0.95rem; color:#f5f0e8; font-style:italic; margin-top:32px;">If your site has been hit by an update and you are not sure why, <a href="/contact" style="color:#f4ca14;">get in touch</a>. We can take a look and tell you what likely happened.</p>
$BODY$,
  'Honey Bridge SEO',
  'Strategy',
  ARRAY['Algorithm', 'Google Updates', 'Strategy'],
  true,
  false,
  NOW() - INTERVAL '8 days',
  NOW() - INTERVAL '8 days',
  NOW() - INTERVAL '8 days'
);

INSERT INTO blog_posts (slug, title, excerpt, content, author, category, tags, published, is_playbook, published_at, created_at, updated_at)
VALUES (
  'content-vs-links',
  'Content or Links: Which Matters More for SEO',
  'Ask ten SEO people which matters more and you will get ten different answers. Here is the honest breakdown so you can decide where to put your energy first.',
  $BODY$
<p>This debate has been going on in the SEO world for years. Team Content says that if you write great content, the links will come naturally. Team Links says that without backlinks, even the best content will sit unread at the bottom of page ten.</p>

<p>Both sides are right. And that is not a cop-out. Here is why.</p>

<h2>What Content Does Well</h2>

<p>Content is how you tell Google what your site is about. It is also how you give people a reason to visit, stay, and come back. Without solid content, nothing else works. You cannot rank for a keyword that does not appear on your site.</p>

<p>Good content also gives other sites something worth linking to. If you write the best explanation of a topic in your industry, people will naturally link to it when they write about related subjects.</p>

<h2>What Links Do Well</h2>

<p>Links are how Google decides how much to trust your site. Two pages with identical content will not rank the same if one has ten quality backlinks and the other has none. The one with links will win almost every time.</p>

<p style="padding:20px 24px; border-left:2px solid #f4ca14; background:rgba(244,202,20,0.04); margin:24px 0; font-size:0.9rem; color:#ddd7cc; line-height:1.85;">
In a competitive market, links are often the deciding factor. In a local or niche market with less competition, content alone can sometimes be enough to get to the top.
</p>

<h2>Which Should You Focus on First</h2>

<p>Start with content. You need something on your site worth ranking before links matter. Get your pages well written, properly structured, and targeting the right keywords.</p>

<p>Then build links. Once your content foundation is solid, links are what push you past competitors who have similar content but less authority.</p>

<p style="padding:20px 24px; border-left:2px solid #e08522; background:rgba(224,133,34,0.05); margin:24px 0; font-size:0.88rem; color:#ddd7cc; line-height:1.85;">
<span style="color:#e08522; font-weight:600; font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase; display:block; margin-bottom:8px;">The practical answer</span>
If you have zero content: write first. If you have decent content but low rankings: links are probably the missing piece. If you have both: keep doing both consistently.
</p>

<h2>The Trap to Avoid</h2>

<p>Spending all your time on one and ignoring the other. A site with great content and no links will stall. A site with lots of links but thin content will eventually get hit by an algorithm update. The strongest sites do both well.</p>

<p style="font-size:0.95rem; color:#f5f0e8; font-style:italic; margin-top:32px;">Not sure where your site stands on either front? <a href="/quote" style="color:#f4ca14;">Request a free quote</a> and we will give you an honest assessment.</p>
$BODY$,
  'Honey Bridge SEO',
  'Strategy',
  ARRAY['Content', 'Link Building', 'Strategy', 'Comparison'],
  true,
  false,
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '15 days'
);

INSERT INTO blog_posts (slug, title, excerpt, content, author, category, tags, published, is_playbook, published_at, created_at, updated_at)
VALUES (
  'schema-markup-explained',
  'Schema Markup: The Simple Thing Most Sites Are Missing',
  'Schema markup sounds technical but the idea is simple. It tells Google extra details about your business in a language Google understands perfectly. Here is what it is and why it matters.',
  $BODY$
<p>When you look at Google search results, you sometimes see results that stand out from the rest. A restaurant listing might show a star rating and a price range right in the results. A recipe might show cook time and a photo. A product might show its price and whether it is in stock.</p>

<p>That extra information comes from schema markup. And most small business websites do not use it.</p>

<h2>What Schema Markup Actually Is</h2>

<p>Schema markup is a small piece of code you add to your website that gives Google structured information about what is on the page. Instead of Google having to guess whether a number on your page is a phone number, a price, or a rating, you tell it directly.</p>

<p style="padding:20px 24px; border-left:2px solid #f4ca14; background:rgba(244,202,20,0.04); margin:24px 0; font-size:0.9rem; color:#ddd7cc; line-height:1.85;">
Think of it as a label on a box. The box might have all the right contents inside, but without a clear label, Google has to open it and figure out what is inside on its own. Schema puts the label on the outside.
</p>

<h2>What Types of Schema Matter Most</h2>

<p>For most small businesses, these are the ones worth having.</p>

<ul style="margin:16px 0 16px 20px; display:flex; flex-direction:column; gap:8px;">
  <li style="font-size:0.9rem; color:#ddd7cc; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">Local Business schema.</span> Tells Google your business name, address, phone number, hours, and type of business. This directly helps with local search rankings.</li>
  <li style="font-size:0.9rem; color:#ddd7cc; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">Review schema.</span> Lets Google display your star rating in search results. This increases click rates noticeably.</li>
  <li style="font-size:0.9rem; color:#ddd7cc; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">FAQ schema.</span> If you have a frequently asked questions section, this can make your result take up much more space in search results, pushing competitors further down.</li>
  <li style="font-size:0.9rem; color:#ddd7cc; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">Service schema.</span> Describes the services you offer in detail so Google can match you to more specific searches.</li>
</ul>

<h2>Does It Actually Improve Rankings?</h2>

<p>Schema markup does not directly make you rank higher on its own. What it does is make your result more visible and more informative when you do rank. A result with a star rating and extra details gets more clicks than a plain text result in the same position.</p>

<p>More clicks signal to Google that your result is useful, which can gradually improve your ranking over time. It is one of those things that quietly compounds.</p>

<p style="padding:20px 24px; border-left:2px solid #e08522; background:rgba(224,133,34,0.05); margin:24px 0; font-size:0.88rem; color:#ddd7cc; line-height:1.85;">
<span style="color:#e08522; font-weight:600; font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase; display:block; margin-bottom:8px;">Worth knowing</span>
Google Search Console will tell you if your schema is set up correctly. It flags errors and shows you which rich results you are eligible for. If you have schema already, it is worth checking.
</p>

<h2>How to Add It</h2>

<p>If you are on WordPress, plugins like Yoast or Rank Math handle a lot of this automatically. If you have a custom site, it needs to be added to the page code. The format is called JSON-LD and it sits in the head section of your HTML.</p>

<p>It looks technical but the logic is simple once you have seen it. Most businesses can get the basics set up in an afternoon.</p>

<p style="font-size:0.95rem; color:#f5f0e8; font-style:italic; margin-top:32px;">Schema is part of every technical SEO audit we do. <a href="/services" style="color:#f4ca14;">See what a technical SEO audit covers.</a></p>
$BODY$,
  'Honey Bridge SEO',
  'Technical',
  ARRAY['Schema Markup', 'Technical SEO', 'Rich Results'],
  true,
  false,
  NOW() - INTERVAL '25 days',
  NOW() - INTERVAL '25 days',
  NOW() - INTERVAL '25 days'
);

-- Confirm all posts
SELECT id, slug, is_playbook, published_at::date FROM blog_posts ORDER BY published_at DESC;
