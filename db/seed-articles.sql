-- Honey Bridge SEO - Blog Articles
-- Run this in your Railway Postgres query editor.
-- Deletes and replaces the three seed articles with full versions.

DELETE FROM blog_posts WHERE slug IN (
  'why-seo-matters-2025',
  'technical-seo-checklist',
  'local-seo-guide'
);

INSERT INTO blog_posts (slug, title, excerpt, content, category, tags, published, author, published_at) VALUES

(
  'why-seo-matters-2025',
  'Why a Score of 80 Does Not Mean 80 Percent',
  'Most people think an SEO score of 80 out of 100 means their site is 80 percent of the way to the top. It does not. Here is what it actually means and why it matters so much for your business.',
  '
<p>If you ran our free SEO check and got a score of 75 or 80, your first reaction might be: <span style="color:var(--gold); font-weight:500;">"That is pretty good, right?"</span></p>

<p>It is not bad. But here is the thing most people do not know: SEO scores do not work like percentages. A score of 80 does not mean you are getting 80 percent of the traffic you could be getting. In reality, you might be getting closer to 20 percent.</p>

<h2>How Search Results Actually Work</h2>

<p>Think about the last time you searched for something on Google. Did you click to page two? Almost no one does. Studies show that <span style="color:var(--cream); font-weight:500;">over 90 percent of all clicks go to results on page one</span>, and more than half of those go to the top three results.</p>

<p>This means the difference between ranking 1st and ranking 10th is not small. It is enormous. The first result gets roughly ten times more clicks than the tenth result, and they are both on the same page.</p>

<p>SEO scores reflect this. A site with a score of 95 does not get a little more traffic than a site with a score of 80. It can get three, five, or ten times more traffic depending on the industry.</p>

<h2>The Gap Between 80 and 98 in Real Numbers</h2>

<p>Here is a simple way to think about it. Say 1,000 people search for your type of business every month in your area.</p>

<ul style="margin: 16px 0 16px 20px; display:flex; flex-direction:column; gap:10px;">
  <li style="font-size:0.9rem; color:var(--cream-dim); line-height:1.75;">At a score of <span style="color:#c0504a; font-weight:600;">60</span>, you might rank on page 2 or 3. You get maybe 20 visitors a month.</li>
  <li style="font-size:0.9rem; color:var(--cream-dim); line-height:1.75;">At a score of <span style="color:var(--amber); font-weight:600;">80</span>, you might rank somewhere on page 1. You get maybe 80 to 120 visitors a month.</li>
  <li style="font-size:0.9rem; color:var(--cream-dim); line-height:1.75;">At a score of <span style="color:#7cba6a; font-weight:600;">98</span>, you rank near the top of page 1. You get 300 to 500 visitors a month from that one search term alone.</li>
</ul>

<p>The score went up by 18 points. The traffic went up by four or five times. That is what non-linear means. Small improvements at the top of the scale make a massive difference.</p>

<h2>Why Does the Gap Exist?</h2>

<p>Google is not just measuring one thing when it scores your site. It is looking at dozens of signals at the same time. Things like:</p>

<p style="padding: 20px 24px; border-left: 2px solid var(--gold); background: rgba(244,202,20,0.04); margin: 24px 0; font-size:0.9rem; color:var(--cream-dim); line-height:1.85;">
How fast your pages load. Whether your site works well on phones. Whether other sites link to you. Whether your content actually answers what people are searching for. Whether your pages are set up so Google can find and read them.
</p>

<p>Each of these things affects your score a little bit. But they also stack on top of each other. A site that does all of them well does not just score a little better. It signals to Google that it is a trustworthy, helpful, high quality site. And Google rewards that with top positions.</p>

<h2>What Should You Do About It?</h2>

<p>The first step is knowing where you stand. Run the free check on our homepage. Look at your four scores: Performance, SEO, Accessibility, and Best Practices.</p>

<p>Each one under 98 represents a gap between where you are and where the top results are. The good news is that most of these gaps can be closed with the right work. Some fixes are quick. Some take a few months. But every point you gain compounds into more visibility.</p>

<p style="font-size:0.95rem; color:var(--cream); font-weight:400; font-family:var(--font-display); font-style:italic; margin-top:32px;">If you want to know exactly what is holding your score down and what it would take to fix it, <a href="/quote" style="color:var(--gold);">request a free quote</a>. We will look at your site and tell you straight.</p>
',
  'Strategy',
  ARRAY['SEO Score', 'Traffic', 'Rankings', 'Beginner'],
  TRUE,
  'Honey Bridge SEO',
  NOW() - INTERVAL '5 days'
),

(
  'technical-seo-checklist',
  'The Technical Checklist: What Your Site Needs Before Anything Else',
  'You can write great content and still rank nowhere. You can get other sites to link to you and still rank nowhere. Why? Because if your technical foundation is broken, none of the other stuff works. Here is what to check.',
  '
<p>A lot of people start with content. They write blog posts, update their service pages, try to get backlinks. Then they wonder why nothing is moving.</p>

<p>Often the reason is simple: <span style="color:var(--gold); font-weight:500;">Google cannot properly read the site in the first place.</span></p>

<p>Technical SEO is the foundation. It is the stuff that happens under the hood. You do not see most of it when you look at a website, but Google sees all of it. And if it is not set up right, you are basically trying to build a house on sand.</p>

<h2>Can Google Find Your Pages?</h2>

<p>This sounds obvious but many sites have pages that Google is accidentally blocked from reading. This happens through a file called robots.txt. This file tells search engines which pages to look at and which to skip. If it is set up wrong, it can accidentally tell Google to ignore your most important pages.</p>

<p style="padding: 20px 24px; border-left: 2px solid var(--amber); background: rgba(224,133,34,0.05); margin: 24px 0; font-size:0.88rem; color:var(--cream-dim); line-height:1.85;">
<span style="color:var(--amber); font-weight:600; font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase; display:block; margin-bottom:8px;">How to check this</span>
Go to yourwebsite.com/robots.txt and look at what it says. If you see lines that say "Disallow: /" with nothing after it, or that block important folders, that is a problem worth fixing.
</p>

<p>You also want to make sure you have an XML sitemap. This is a file that lists every page on your site and tells Google where to find them. Think of it like a table of contents for your whole website. Without it, Google has to find your pages on its own, and it might miss some.</p>

<h2>How Fast Does Your Site Load?</h2>

<p>Google cares about speed. A lot. Studies show that for every extra second a page takes to load, more people leave without reading anything. And Google knows this. Slow sites rank lower.</p>

<p>The main things that slow sites down are:</p>

<ul style="margin: 16px 0 16px 20px; display:flex; flex-direction:column; gap:8px;">
  <li style="font-size:0.9rem; color:var(--cream-dim); line-height:1.75;"><span style="color:var(--cream); font-weight:500;">Images that are too big.</span> A photo taken on a phone can be 4MB or more. For a website, it should be under 200KB. Use a tool like TinyPNG or Squoosh to compress them.</li>
  <li style="font-size:0.9rem; color:var(--cream-dim); line-height:1.75;"><span style="color:var(--cream); font-weight:500;">Too many scripts loading at once.</span> Every plugin, chat widget, and analytics tool you add slows your site down a little bit.</li>
  <li style="font-size:0.9rem; color:var(--cream-dim); line-height:1.75;"><span style="color:var(--cream); font-weight:500;">No content delivery network (CDN).</span> A CDN stores copies of your site in data centers around the world so the site loads faster no matter where your visitor is.</li>
</ul>

<h2>Does Your Site Work on Phones?</h2>

<p>More than half of all web traffic comes from phones. Google uses the mobile version of your site when deciding where to rank you. If your site looks broken on a phone, or if buttons are too small to tap, or if text is too tiny to read without zooming, you will rank lower.</p>

<p>The easiest way to check this is to open your site on your own phone and try to use it like a customer would. Can you read everything clearly? Can you tap buttons and links without struggling? Does it load reasonably fast on a normal phone connection?</p>

<h2>Are Your Pages Set Up to Tell Google What They Are About?</h2>

<p>Every page on your site should have a clear title tag and a meta description. The title is the big blue link you see in Google search results. The description is the small text underneath it.</p>

<p style="padding: 20px 24px; border-left: 2px solid var(--gold); background: rgba(244,202,20,0.04); margin: 24px 0; font-size:0.9rem; color:var(--cream-dim); line-height:1.85;">
These are not just for Google. They are what people see before they decide whether to click on your site or your competitor's site. A clear, specific title and description can double the number of people who click through even before you change your ranking.
</p>

<p>You also want to make sure your site has one clear URL per page. If the same page can be reached through multiple different web addresses, Google sees it as duplicate content and it gets split across all those versions. This is fixed by setting a canonical URL, which just tells Google which version of the page is the real one.</p>

<h2>How to Start</h2>

<p>Run the free check on our homepage. The performance score and SEO score will both reflect how well your technical foundation is set up. If either is below 98, read through the audit results. Each failed item is a specific issue you can fix.</p>

<p style="font-size:0.95rem; color:var(--cream); font-weight:400; font-family:var(--font-display); font-style:italic; margin-top:32px;">Not sure how to fix what you find? <a href="/contact" style="color:var(--gold);">Send us a message</a>. We help businesses like yours get this stuff sorted out every week.</p>
',
  'Technical',
  ARRAY['Technical SEO', 'Site Speed', 'Crawlability', 'Beginner'],
  TRUE,
  'Honey Bridge SEO',
  NOW() - INTERVAL '12 days'
),

(
  'local-seo-guide',
  'How to Show Up When People in Your City Search for You',
  'If your business serves a local area, showing up in local search results is the single highest return on investment move you can make. Here is exactly how it works and what to do.',
  '
<p>When someone in your city searches for "plumber near me" or "best coffee shop in [city]," Google shows them a map with three businesses listed. That map section is called the map pack, and it sits above all the regular website results.</p>

<p><span style="color:var(--gold); font-weight:500;">The three businesses in that map pack get the most calls. The most clicks. The most customers.</span> Everyone below them gets the leftover attention.</p>

<p>This article explains how to get into that map pack and stay there.</p>

<h2>Step One: Claim Your Google Business Profile</h2>

<p>Your Google Business Profile is the listing that shows up in the map pack. It shows your business name, address, phone number, hours, photos, reviews, and more.</p>

<p>If you have not claimed yours yet, go to business.google.com and set it up. It is free. Once you have it, fill out every single section. Business category, description, hours, website, phone number, all of it. Google uses this information to decide when and where to show you.</p>

<p style="padding: 20px 24px; border-left: 2px solid var(--gold); background: rgba(244,202,20,0.04); margin: 24px 0; font-size:0.9rem; color:var(--cream-dim); line-height:1.85;">
<span style="color:var(--gold); font-weight:600; display:block; font-family:var(--font-display); font-size:1rem; margin-bottom:6px;">The most important thing most businesses skip</span>
Add photos. Real photos of your location, your team, your work, your products. Businesses with photos get significantly more direction requests and website clicks than those without. It takes ten minutes and makes a real difference.
</p>

<h2>Step Two: Get Your Name, Address, and Phone Number Consistent</h2>

<p>This one sounds boring but it matters. Your business name, address, and phone number need to be spelled the exact same way everywhere on the internet. On your website. On your Google Business Profile. On Yelp. On Facebook. On every directory that lists you.</p>

<p>If your address is "123 Main St" on your website but "123 Main Street" on Yelp, Google sees those as two different businesses. It loses confidence in your listing and ranks you lower.</p>

<p>Do a search for your business name and audit every listing you find. Make sure they all match exactly.</p>

<h2>Step Three: Get More Reviews</h2>

<p>Reviews are one of the strongest signals Google uses for local rankings. More reviews means higher rankings. Better reviews means higher rankings. Recent reviews means higher rankings.</p>

<ul style="margin: 16px 0 16px 20px; display:flex; flex-direction:column; gap:8px;">
  <li style="font-size:0.9rem; color:var(--cream-dim); line-height:1.75;"><span style="color:var(--cream); font-weight:500;">Ask every happy customer.</span> Most people will leave a review if you just ask. Text them a direct link to your Google review page right after a good job.</li>
  <li style="font-size:0.9rem; color:var(--cream-dim); line-height:1.75;"><span style="color:var(--cream); font-weight:500;">Respond to every review.</span> Good and bad. Responding shows Google and potential customers that you are active and you care.</li>
  <li style="font-size:0.9rem; color:var(--cream-dim); line-height:1.75;"><span style="color:var(--cream); font-weight:500;">Do not buy reviews.</span> Google catches this. It can get your whole listing removed. It is not worth it.</li>
</ul>

<h2>Step Four: Make Your Website Mention Your Location</h2>

<p>Your website needs to clearly tell Google where you operate. This means your city and region should appear naturally in your page content, your title tags, and your footer.</p>

<p style="padding: 20px 24px; border-left: 2px solid var(--amber); background: rgba(224,133,34,0.05); margin: 24px 0; font-size:0.88rem; color:var(--cream-dim); line-height:1.85;">
<span style="color:var(--amber); font-weight:600; font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase; display:block; margin-bottom:8px;">Example</span>
Instead of a headline that says "Expert Plumbing Services," try "Expert Plumbing Services in Chicago." Instead of "Contact Us," your footer should show your full address. Small changes like these help Google connect your website to your location.
</p>

<p>If you serve multiple cities, create a separate page for each one. A page titled "Plumbing Services in Oak Park" that talks specifically about that area will rank in Oak Park searches much better than one generic page trying to cover every city at once.</p>

<h2>How Long Does This Take?</h2>

<p>Some of this you will see results from within a few weeks, especially filling out your Google Business Profile and getting a few more reviews. The website changes take a bit longer because Google needs time to re-read your pages and update its rankings. Most businesses see noticeable improvement in two to four months.</p>

<p>The businesses that do best are the ones who keep at it. Add a photo to your Google Business Profile every month. Ask for reviews consistently. Keep your information up to date. Local SEO is not a one time task, it is a habit.</p>

<p style="font-size:0.95rem; color:var(--cream); font-weight:400; font-family:var(--font-display); font-style:italic; margin-top:32px;">Want someone to handle all of this for you? <a href="/quote" style="color:var(--gold);">Get a free quote</a> and we will put together a local SEO plan for your area.</p>
',
  'Local SEO',
  ARRAY['Local SEO', 'Google Business', 'Reviews', 'Beginner'],
  TRUE,
  'Honey Bridge SEO',
  NOW() - INTERVAL '20 days'
);

-- Confirm
SELECT slug, title, published_at::date FROM blog_posts ORDER BY published_at DESC;
