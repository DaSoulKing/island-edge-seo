-- Honey Bridge SEO - New Articles
-- Run in Railway Postgres Query tab.
-- 3 SEO Playbook articles (is_playbook = true) + 3 regular blog posts
-- Also updates the 3 existing articles to be part of the playbook.

-- Mark existing 3 articles as playbook posts
UPDATE blog_posts SET is_playbook = true, playbook_part = 'Part One'   WHERE slug = 'why-seo-matters-2025';
UPDATE blog_posts SET is_playbook = true, playbook_part = 'Part Two'   WHERE slug = 'technical-seo-checklist';
UPDATE blog_posts SET is_playbook = true, playbook_part = 'Part Three' WHERE slug = 'local-seo-guide';

-- PLAYBOOK PART FOUR
INSERT INTO blog_posts (slug, title, excerpt, content, author, category, tags, published, is_playbook, playbook_part, published_at, created_at, updated_at)
VALUES (
  'what-are-backlinks',
  'What Are Backlinks and Why Does Google Care About Them',
  'A backlink is when another website links to yours. Google treats these like votes of trust. The more quality votes you have, the higher you rank. Here is how it works.',
  $BODY$
<p>Imagine you are trying to find a good mechanic in a city you just moved to. You could look online, or you could ask three neighbors who they use. If all three point to the same shop, you trust it without needing to verify much.</p>

<p>Google thinks the same way. When other websites link to yours, Google sees it as a vote of confidence. The more quality votes you have, <span style="color:#f4ca14; font-weight:500;">the more Google trusts that your site is worth showing to people.</span></p>

<h2>Not All Links Are Equal</h2>

<p>A link from a major newspaper is worth far more than a link from a random blog no one reads. Google looks at two main things when it weighs a link.</p>

<ul style="margin:16px 0 16px 20px; display:flex; flex-direction:column; gap:10px;">
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">Authority of the linking site.</span> A link from a site that itself has many quality links pointing to it carries more weight. Think news sites, government pages, universities, well-known industry blogs.</li>
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">Relevance of the linking site.</span> A plumbing company getting a link from a home improvement blog is more valuable than one from a cooking website. The topic has to make sense.</li>
</ul>

<h2>How Do You Get Backlinks?</h2>

<p>The honest answer is that good backlinks come from doing something worth linking to. That might be publishing a useful article, creating a free tool, getting featured in the news, or being listed in a local directory.</p>

<p style="padding:20px 24px; border-left:2px solid #f4ca14; background:rgba(244,202,20,0.04); margin:24px 0; font-size:0.9rem; color:#d4ccbb; line-height:1.85;">
<span style="color:#f4ca14; font-weight:600; display:block; font-size:1rem; margin-bottom:6px;">The easiest win for most local businesses</span>
Get listed in local directories. Yelp, your local Chamber of Commerce site, industry-specific directories, and local news features all count as backlinks. Many of these are free to get listed in and take an hour of setup.
</p>

<p>You can also reach out directly to websites in your industry and offer to write a guest article. If they publish it, you usually get a link back to your site in the author section. This takes time but it is one of the most effective ways to build authority.</p>

<h2>What to Avoid</h2>

<p>Buying links in bulk or getting listed in spam directories does more harm than good. Google can detect unnatural link patterns and will penalize sites that try to game the system. Any links you build should look natural, meaning they come from real websites that have a genuine reason to mention you.</p>

<h2>How Many Do You Need?</h2>

<p>There is no magic number. It depends on your industry and who you are competing against. A local bakery needs far fewer links than a national software company. The goal is not to collect links endlessly. It is to have more quality links than the sites currently ranking above you.</p>

<p style="font-size:0.95rem; color:#f5f0e8; font-style:italic; margin-top:32px;">Want to know how your backlink profile stacks up against your competitors? <a href="/quote" style="color:#f4ca14;">Request a free audit</a> and we will take a look.</p>
$BODY$,
  'Honey Bridge SEO', 'Strategy',
  ARRAY['Backlinks', 'Authority', 'Link Building', 'Beginner'],
  true, true, 'Part Four',
  NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'
);

-- PLAYBOOK PART FIVE
INSERT INTO blog_posts (slug, title, excerpt, content, author, category, tags, published, is_playbook, playbook_part, published_at, created_at, updated_at)
VALUES (
  'what-is-keyword-research',
  'Keyword Research: How to Find Out What Your Customers Are Actually Searching',
  'Before you write a single word for your website, you need to know what words your customers are typing into Google. This is called keyword research and it changes everything.',
  $BODY$
<p>Most business owners write their website based on how they describe their own business. A plumber might write "residential pipe installation services." But their customers are typing "fix leaky pipe" or "plumber near me."</p>

<p>This gap is where a lot of businesses lose rankings before they even start. <span style="color:#f4ca14; font-weight:500;">Keyword research closes that gap.</span> It tells you the exact words and phrases your customers use so you can put those words on your site.</p>

<h2>How to Start Without Any Tools</h2>

<p>You do not need expensive software to start. Google itself gives you useful clues for free.</p>

<p style="padding:20px 24px; border-left:2px solid #e08522; background:rgba(224,133,34,0.05); margin:24px 0; font-size:0.88rem; color:#d4ccbb; line-height:1.85;">
<span style="color:#e08522; font-weight:600; font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase; display:block; margin-bottom:8px;">Try this right now</span>
Type the start of a search related to your business into Google but do not press enter. Watch the autocomplete suggestions that appear. These are real searches people do all the time. Write them all down.
</p>

<p>Then scroll to the very bottom of a Google results page. You will see a section called "Related searches." These are more phrases real people use. This alone can give you twenty or thirty keyword ideas in ten minutes with no tools at all.</p>

<h2>What Makes a Good Keyword</h2>

<p>There are two things to balance: how many people search for it, and how hard it is to rank for it.</p>

<ul style="margin:16px 0 16px 20px; display:flex; flex-direction:column; gap:10px;">
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">High search volume, hard to rank.</span> Terms like "plumber" get searched millions of times but you are competing with thousands of businesses. Very hard to rank for if you are starting out.</li>
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;"><span style="color:#f5f0e8; font-weight:500;">Lower search volume, easier to rank.</span> Terms like "emergency plumber Hyde Park Chicago" get fewer searches but far less competition. A business that ranks for ten of these earns more than one chasing the big term.</li>
</ul>

<p>These specific, longer phrases are called long-tail keywords. They are where most small businesses should start.</p>

<h2>Where to Put Your Keywords</h2>

<p>Once you know your keywords, they need to appear naturally in a few key places: the title of your page, the first paragraph of your text, and in a few headings throughout the page. Do not stuff them in unnaturally. Write like a human. Google can tell the difference.</p>

<p>Each page on your site should target one main keyword and a handful of related ones. A page trying to rank for twenty unrelated terms will rank for none of them. Focus is what wins.</p>

<p style="font-size:0.95rem; color:#f5f0e8; font-style:italic; margin-top:32px;">Not sure which keywords your business should be targeting? <a href="/contact" style="color:#f4ca14;">Send us a message</a> and we can walk you through it.</p>
$BODY$,
  'Honey Bridge SEO', 'Strategy',
  ARRAY['Keywords', 'Research', 'Content', 'Beginner'],
  true, true, 'Part Five',
  NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'
);

-- PLAYBOOK PART SIX
INSERT INTO blog_posts (slug, title, excerpt, content, author, category, tags, published, is_playbook, playbook_part, published_at, created_at, updated_at)
VALUES (
  'how-to-track-seo-progress',
  'How to Know If Your SEO Is Actually Working',
  'SEO takes time, which makes it hard to tell if anything is happening. Here is what to track, what numbers actually matter, and how to read them without confusion.',
  $BODY$
<p>One of the most common questions we get is: "I started working on my SEO two months ago. How do I know if it is working?"</p>

<p>It is a fair question. Unlike running an ad where you spend money and see immediate results, SEO builds slowly. But there are clear signals that tell you whether you are heading in the right direction.</p>

<h2>The Three Numbers That Actually Matter</h2>

<p style="padding:20px 24px; border-left:2px solid #f4ca14; background:rgba(244,202,20,0.04); margin:24px 0; font-size:0.9rem; color:#d4ccbb; line-height:1.85;">
Most people focus on their ranking for one keyword. That is useful but it only tells part of the story. These three numbers give you the full picture.
</p>

<ul style="margin:16px 0 16px 20px; display:flex; flex-direction:column; gap:14px;">
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;"><span style="color:#f4ca14; font-weight:600; display:block; margin-bottom:3px;">Organic traffic.</span> This is the number of visitors coming to your site from Google searches without paid ads. You can see this in Google Analytics for free. If this number is growing month over month, your SEO is working.</li>
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;"><span style="color:#f4ca14; font-weight:600; display:block; margin-bottom:3px;">Keyword rankings.</span> Which position does your site appear in when people search for your main keywords. Google Search Console shows you this for free. You want to see this number going down over time, meaning you are moving up the results.</li>
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;"><span style="color:#f4ca14; font-weight:600; display:block; margin-bottom:3px;">Impressions.</span> How many times your site appeared in search results, even if people did not click. A growing impression count means Google is showing your site to more people. Clicks come after impressions, so this is an early signal that things are moving.</li>
</ul>

<h2>How Long Should This Take?</h2>

<p>For a brand new site with no history, expect three to six months before you see clear movement. For an existing site with some history, improvements can show up in four to eight weeks after making changes.</p>

<p>This is why it is important to start tracking from day one. If you wait until month four to check your numbers, you have no baseline to compare against. Set up Google Analytics and Google Search Console today, even if you are just starting out.</p>

<h2>Warning Signs That Things Are Not Working</h2>

<ul style="margin:16px 0 16px 20px; display:flex; flex-direction:column; gap:8px;">
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;">Organic traffic is flat or falling after six months of consistent work</li>
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;">Your rankings have not moved at all for your main keywords</li>
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;">Google Search Console shows a high number of crawl errors</li>
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;">Your site score on our free checker has not improved</li>
</ul>

<p>If any of these apply, it usually means something structural is wrong, not just that you need to wait longer.</p>

<h2>One Simple Habit That Helps</h2>

<p>Check your numbers on the same day every month. Not every day, because day to day changes are noise. Monthly trends are what matter. After three months of monthly check-ins, you will have a clear picture of whether your SEO is moving in the right direction.</p>

<p style="font-size:0.95rem; color:#f5f0e8; font-style:italic; margin-top:32px;">If your numbers are stuck or you are not sure how to read them, <a href="/contact" style="color:#f4ca14;">get in touch</a>. We can review what you have and tell you what to fix first.</p>
$BODY$,
  'Honey Bridge SEO', 'Strategy',
  ARRAY['Analytics', 'Tracking', 'Progress', 'Beginner'],
  true, true, 'Part Six',
  NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
);

-- REGULAR BLOG POST 1
INSERT INTO blog_posts (slug, title, excerpt, content, author, category, tags, published, is_playbook, published_at, created_at, updated_at)
VALUES (
  'google-algorithm-updates',
  'Google Updates Its Algorithm All the Time. Here Is What That Means for You.',
  'Google changes how it ranks websites hundreds of times a year. Most updates are small. A few are big. Here is how to think about them without losing your mind.',
  $BODY$
<p>If you have ever noticed your website traffic suddenly drop for no obvious reason, there is a good chance a Google algorithm update is involved.</p>

<p>Google changes its ranking system constantly. Most changes are small tweaks that barely affect anyone. But a few times a year, Google rolls out a major update that shifts rankings across the board. Some sites go up. Some go down. And a lot of business owners panic.</p>

<h2>Why Google Keeps Changing Things</h2>

<p>Google's goal has always been to show people the most useful, trustworthy results for their search. The algorithm changes are Google trying to get better at doing that. When spammy sites find a loophole to rank higher than they deserve, Google closes it. When real, helpful sites are getting buried, Google tries to surface them.</p>

<p>If your site consistently does the right things, big updates tend to help you or leave you alone. The sites that get hurt are usually those that were gaming the system in some way.</p>

<h2>The Updates That Matter Most</h2>

<p style="padding:20px 24px; border-left:2px solid #f4ca14; background:rgba(244,202,20,0.04); margin:24px 0; font-size:0.9rem; color:#d4ccbb; line-height:1.85;">
Google names its major updates. Core updates happen a few times a year and affect rankings broadly. Helpful content updates target sites that exist to rank rather than to genuinely help people. Spam updates target fake links and low quality content.
</p>

<p>You do not need to follow every update closely. What you need to know is: after any major update, check your Google Search Console for changes in impressions and clicks. If you see a drop starting on a specific date, search online for what Google update rolled out around that time. That will tell you what aspect of your site to look at.</p>

<h2>The Best Protection Against Updates</h2>

<p>The businesses that survive algorithm updates best are the ones who built their SEO on a solid foundation: fast site, genuine content, real backlinks, good user experience. None of those things go out of style. Google may change how it measures them but it never stops caring about them.</p>

<p>The businesses that get hurt are the ones who chased shortcuts. Bought links. Published thin content just to have more pages. Stuffed keywords into text unnaturally. These tactics work until they do not, and then they can be very hard to recover from.</p>

<p style="font-size:0.95rem; color:#f5f0e8; font-style:italic; margin-top:32px;">If your traffic dropped after a recent update and you are not sure why, <a href="/contact" style="color:#f4ca14;">send us a message</a>. We can look at your site and give you an honest read.</p>
$BODY$,
  'Honey Bridge SEO', 'Technical',
  ARRAY['Google', 'Algorithm', 'Updates', 'Rankings'],
  true, false,
  NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'
);

-- REGULAR BLOG POST 2
INSERT INTO blog_posts (slug, title, excerpt, content, author, category, tags, published, is_playbook, published_at, created_at, updated_at)
VALUES (
  'seo-vs-google-ads',
  'SEO vs Google Ads: Which One Is Right for Your Business',
  'Both SEO and Google Ads put your business in front of people searching for what you offer. But they work very differently. Here is how to decide which one fits your situation.',
  $BODY$
<p>When business owners decide they want to show up on Google, they usually face a fork in the road: pay for ads that appear immediately, or invest in SEO that builds up over time. The question is which one is better.</p>

<p>The honest answer is that they are different tools for different situations. Sometimes one is clearly better. Sometimes you need both.</p>

<h2>How Google Ads Work</h2>

<p>Google Ads lets you pay to appear at the top of search results for specific keywords. You set a budget, choose your keywords, write your ad, and it goes live within hours. When someone clicks your ad, you pay a fee. When they do not click, you pay nothing.</p>

<p>The major advantage is speed. You can have your business appearing on page one tomorrow. The major drawback is that the moment you stop paying, you disappear. There is no residual value. Every visitor costs money every time.</p>

<h2>How SEO Works</h2>

<p>SEO earns you a position in the regular search results, not the paid section at the top. It takes months to build. But once you rank, you get traffic without paying per click. A well-ranked page can bring in customers for years after the work was done.</p>

<p style="padding:20px 24px; border-left:2px solid #f4ca14; background:rgba(244,202,20,0.04); margin:24px 0; font-size:0.9rem; color:#d4ccbb; line-height:1.85;">
Studies consistently show that around 70 percent of clicks go to organic results rather than paid ads. People have learned to scroll past the ads. This does not mean ads are useless. It means organic rankings capture the majority of the attention.
</p>

<h2>When to Use Ads</h2>

<ul style="margin:16px 0 16px 20px; display:flex; flex-direction:column; gap:8px;">
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;">You need customers right now and cannot wait months for SEO to build</li>
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;">You are launching a new product or service and want immediate visibility</li>
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;">You are in a competitive market where SEO alone takes a very long time</li>
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;">You want to test whether certain keywords actually convert before committing to SEO for them</li>
</ul>

<h2>When to Prioritize SEO</h2>

<ul style="margin:16px 0 16px 20px; display:flex; flex-direction:column; gap:8px;">
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;">You want traffic that keeps coming without an ongoing ad budget</li>
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;">Your customers do a lot of research before buying and organic results build more trust</li>
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;">You are playing a long game and want to own your traffic rather than rent it</li>
</ul>

<h2>The Best Approach for Most Small Businesses</h2>

<p>Use ads to get customers now while you build your SEO in the background. As your organic rankings improve, you can reduce your ad spend. Over time, SEO takes over as your main traffic source and your cost per customer drops significantly.</p>

<p style="font-size:0.95rem; color:#f5f0e8; font-style:italic; margin-top:32px;">Not sure which is the right move for your business right now? <a href="/contact" style="color:#f4ca14;">Talk to us</a>. We can look at your situation and give you a straight answer.</p>
$BODY$,
  'Honey Bridge SEO', 'Strategy',
  ARRAY['Google Ads', 'PPC', 'SEO vs Ads', 'Strategy'],
  true, false,
  NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'
);

-- REGULAR BLOG POST 3
INSERT INTO blog_posts (slug, title, excerpt, content, author, category, tags, published, is_playbook, published_at, created_at, updated_at)
VALUES (
  'content-that-ranks',
  'How to Write Content That Actually Ranks on Google',
  'Writing content for your website is not the same as writing for a blog or social media. Google looks for specific things. Here is what they are and how to give Google exactly what it wants.',
  $BODY$
<p>A lot of businesses publish content that no one reads. Not because it is bad writing, but because it was never set up to be found. Writing for Google requires a slightly different approach than writing for people who already know your business exists.</p>

<p>The good news is that once you understand what Google is looking for, you can apply the same formula to every piece of content you create.</p>

<h2>Start With What People Are Actually Asking</h2>

<p>Before you write anything, figure out the question your content is going to answer. Specifically, think about how someone who has never heard of you would type that question into Google.</p>

<p>A page titled "Our Approach to Landscaping" will get almost no search traffic. A page titled "How Much Does Landscaping Cost in Austin" will attract exactly the people looking to hire a landscaper in Austin. Same business, very different result.</p>

<h2>Write for the Person, Not the Algorithm</h2>

<p style="padding:20px 24px; border-left:2px solid #f4ca14; background:rgba(244,202,20,0.04); margin:24px 0; font-size:0.9rem; color:#d4ccbb; line-height:1.85;">
Google has gotten very good at understanding whether a piece of content actually helps people or just exists to rank. Content that is thin, repetitive, or does not fully answer the question will not rank well no matter how many keywords you put in it.
</p>

<p>Write like you are answering a question from a smart friend who knows nothing about your industry. Be specific. Give real information. If your competitors have 300-word pages on the topic, write 800 words that actually cover it properly. Depth beats length, but depth usually requires length.</p>

<h2>Structure Matters More Than You Think</h2>

<p>Google reads the structure of your page to understand what it is about. Use clear headings that describe what each section covers. Break up long paragraphs. Use bullet points or numbered lists where they make sense.</p>

<p>Your main keyword should appear in:</p>

<ul style="margin:16px 0 16px 20px; display:flex; flex-direction:column; gap:8px;">
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;">The page title</li>
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;">The first paragraph</li>
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;">At least one heading</li>
  <li style="font-size:0.9rem; color:#d4ccbb; line-height:1.75;">The meta description</li>
</ul>

<p>Do not force it. If using the keyword feels unnatural, rewrite the sentence. Google rewards natural writing. It penalizes obvious keyword stuffing.</p>

<h2>Update Your Content Regularly</h2>

<p>A post that was accurate two years ago may now contain outdated information. Google notices when content is stale. Going back to your best-performing pages once a year and updating them with current information can bring a ranking boost without starting from scratch.</p>

<p>This is also a good time to add new sections based on questions you have received from customers since you first published the page. Real questions from real customers are some of the best keyword ideas you will ever find.</p>

<p style="font-size:0.95rem; color:#f5f0e8; font-style:italic; margin-top:32px;">Want help figuring out what content your site actually needs? <a href="/quote" style="color:#f4ca14;">Request a free quote</a> and we can map it out for you.</p>
$BODY$,
  'Honey Bridge SEO', 'Content',
  ARRAY['Content', 'Writing', 'Rankings', 'On-Page SEO'],
  true, false,
  NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'
);

-- Confirm everything
SELECT id, slug, is_playbook, playbook_part, published_at::date
FROM blog_posts
ORDER BY is_playbook DESC, playbook_part ASC NULLS LAST, published_at DESC;
